import localReactions from "./reactions.json";
import { isValidReagent, getReagent } from "./reagents";
import { pairKey } from "./pairKey";
import { getDb } from "./db";
import {
  ReactionResultSchema,
  validateReactionResult,
  type ReactionResult,
} from "./schema";
import { askGeminiWithRetry } from "./gemini";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "./rateLimit";
import {
  canGenerate,
  recordGeneration,
  PRO_REQUIRED_MESSAGE,
  GUEST_PRO_REQUIRED_MESSAGE,
} from "./plan";

export type ResolveOutcome =
  | { ok: true; source: "local" | "cache" | "ai"; key: string; result: ReactionResult }
  | { ok: false; error: "fallback" | "pro_required"; message: string };

export interface ResolveOptions {
  userId?: string | null;
  /** Used by scripts/warm-cache so prewarming never burns demo quota. */
  bypassQuota?: boolean;
}

const LOCAL_REACTIONS: Readonly<Record<string, unknown>> = localReactions;

/** Tầng 1: static textbook data, validated through Zod on first use. */
function tryLocal(key: string): ReactionResult | null {
  const raw = LOCAL_REACTIONS[key];
  if (raw === undefined) return null;
  const parsed = ReactionResultSchema.safeParse(raw);
  if (parsed.success && !validateReactionResult(parsed.data)) {
    return parsed.data;
  }
  return null;
}

/** Tầng 2: cached AI results in Neon (each pair calls the AI at most once). */
async function tryCache(key: string): Promise<ReactionResult | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = (await db`
      SELECT payload FROM reaction_cache WHERE pair_key = ${key} LIMIT 1
    `) as unknown as { payload: unknown }[];
    if (rows.length === 0) return null;
    const parsed = ReactionResultSchema.safeParse(rows[0].payload);
    if (parsed.success && !validateReactionResult(parsed.data)) {
      return parsed.data;
    }
    // Damaged cache row: drop it so the next call can rebuild.
    await db`DELETE FROM reaction_cache WHERE pair_key = ${key}`;
    return null;
  } catch {
    return null; // DB hiccup should never block the AI path
  }
}

async function storeCache(
  key: string,
  result: ReactionResult
): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db`
      INSERT INTO reaction_cache (pair_key, payload, source)
      VALUES (${key}, ${JSON.stringify(result)}::jsonb, 'ai')
      ON CONFLICT (pair_key) DO NOTHING
    `;
  } catch {
    // best effort
  }
}

/**
 * Hybrid engine (spec 6):
 *   1. validate inputs -> 2. pair key -> 3. local -> 4. cache -> 5. Gemini AI
 * Any tier-3 failure degrades to a friendly soft error, never an HTTP 500.
 */
export async function resolveReaction(
  idA: unknown,
  idB: unknown,
  ip: string | null,
  options: ResolveOptions = {}
): Promise<ResolveOutcome> {
  if (!isValidReagent(idA) || !isValidReagent(idB)) {
    return { ok: false, error: "fallback", message: "Chất không hợp lệ." };
  }
  const a = getReagent(idA)!;
  const b = getReagent(idB)!;
  if (a.id === b.id) {
    return {
      ok: false,
      error: "fallback",
      message: "Chưa thí nghiệm một chất với chính nó nhé!",
    };
  }

  const key = pairKey(a.id, b.id);

  // Tầng 1 & 2
  const local = tryLocal(key);
  if (local) return { ok: true, source: "local", key, result: local };
  const cached = await tryCache(key);
  if (cached) return { ok: true, source: "cache", key, result: cached };

  // Tầng 3: quota -> rate limit -> Gemini -> validate -> cache
  try {
    if (!options.bypassQuota) {
      const quota = await canGenerate(options.userId ?? null, ip);
      if (!quota.allowed) {
        return {
          ok: false,
          error: "pro_required",
          message: quota.status.isAuthenticated
            ? PRO_REQUIRED_MESSAGE
            : GUEST_PRO_REQUIRED_MESSAGE,
        };
      }
    }
    if (ip && !(await checkRateLimit(ip))) {
      return { ok: false, error: "fallback", message: RATE_LIMIT_MESSAGE };
    }
    const result = await askGeminiWithRetry(a.id, b.id);
    const broken = validateReactionResult(result);
    if (broken) {
      return { ok: false, error: "fallback", message: "Kết quả AI không hợp lệ." };
    }
    if (!options.bypassQuota) {
      await recordGeneration(options.userId ?? null, ip, "reaction");
    }
    await storeCache(key, result);
    return { ok: true, source: "ai", key, result };
  } catch (err) {
    const msg =
      err instanceof Error && err.message.includes("Chưa cấu hình AI")
        ? "AI chưa được cấu hình trên máy chủ này. Thử các cặp trong dữ liệu SGK nhé!"
        : "AI đang bận, em thử cặp chất khác nhé!";
    return { ok: false, error: "fallback", message: msg };
  }
}

/** Look up the equation for a previously resolved pair without calling the AI. */
export function lookupEquation(key: string): string | null {
  const raw = LOCAL_REACTIONS[key];
  if (raw !== undefined) {
    const parsed = ReactionResultSchema.safeParse(raw);
    if (parsed.success && parsed.data.has_reaction) return parsed.data.equation;
    return null;
  }
  return null; // handled by cache lookup at the API layer
}

/** Cache-tier counterpart of lookupEquation (no AI call). */
export async function lookupEquationCached(key: string): Promise<string | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = (await db`
      SELECT payload FROM reaction_cache WHERE pair_key = ${key} LIMIT 1
    `) as unknown as { payload: unknown }[];
    if (rows.length === 0) return null;
    const parsed = ReactionResultSchema.safeParse(rows[0].payload);
    if (parsed.success && parsed.data.has_reaction) {
      return parsed.data.equation;
    }
  } catch {
    // ignore
  }
  return null;
}
