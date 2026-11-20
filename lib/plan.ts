import { getDb } from "./db";

export type PlanName = "free" | "pro";
export type AiFeature = "reaction" | "lesson_import" | "sibling_kind";

export interface PlanStatus {
  plan: PlanName;
  isPro: boolean;
  isAuthenticated: boolean;
  freeLimit: number;
  used: number;
  remaining: number;
}

export const FREE_LIMIT_DEFAULT = 1;

export function getFreeLimit(): number {
  const raw = Number(process.env.FREE_AI_GENERATIONS ?? FREE_LIMIT_DEFAULT);
  if (!Number.isFinite(raw) || raw < 0) return FREE_LIMIT_DEFAULT;
  return Math.floor(raw);
}

export function identityKey(userId: string | null, ip: string | null): string {
  if (userId) return `user:${userId}`;
  return `ip:${ip?.trim() || "unknown"}`;
}

export async function getPlan(userId: string | null): Promise<PlanName> {
  if (!userId) return "free";
  const db = getDb();
  if (!db) return "free";
  try {
    const rows = (await db`
      SELECT plan FROM user_plans WHERE user_id = ${userId} LIMIT 1
    `) as unknown as { plan: string }[];
    return rows[0]?.plan === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

export async function getUsage(key: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const rows = (await db`
      SELECT COUNT(*)::int AS count FROM ai_usage WHERE user_key = ${key}
    `) as unknown as { count: number }[];
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function getPlanStatus(
  userId: string | null,
  ip: string | null
): Promise<PlanStatus> {
  const [plan, used] = await Promise.all([
    getPlan(userId),
    getUsage(identityKey(userId, ip)),
  ]);
  const freeLimit = getFreeLimit();
  return {
    plan,
    isPro: plan === "pro",
    isAuthenticated: Boolean(userId),
    freeLimit,
    used,
    remaining: Math.max(0, freeLimit - used),
  };
}

/**
 * Free users get a small lifetime quota shared by every Gemini feature.
 * Pro users bypass the quota. When the DB is unavailable we fail open so
 * local/demo flows keep working.
 */
export async function canGenerate(
  userId: string | null,
  ip: string | null
): Promise<{ allowed: boolean; status: PlanStatus }> {
  const db = getDb();
  const status = await getPlanStatus(userId, ip);
  if (!db || status.isPro) return { allowed: true, status };
  return { allowed: status.used < status.freeLimit, status };
}

export async function recordGeneration(
  userId: string | null,
  ip: string | null,
  feature: AiFeature
): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db`
      INSERT INTO ai_usage (user_key, feature)
      VALUES (${identityKey(userId, ip)}, ${feature})
    `;
  } catch {
    // best effort: never break a successful AI response
  }
}

export async function activatePro(userId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL chưa được cấu hình.");
  await db`
    INSERT INTO user_plans (user_id, plan, pro_since, note)
    VALUES (${userId}, 'pro', NOW(), 'demo activation')
    ON CONFLICT (user_id)
    DO UPDATE SET plan = 'pro', pro_since = NOW(), note = 'demo activation', updated_at = NOW()
  `;
}

export async function downgradeToFree(userId: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL chưa được cấu hình.");
  await db`
    INSERT INTO user_plans (user_id, plan, pro_since, note)
    VALUES (${userId}, 'free', NULL, 'demo downgrade')
    ON CONFLICT (user_id)
    DO UPDATE SET plan = 'free', pro_since = NULL, note = 'demo downgrade', updated_at = NOW()
  `;
}

export const PRO_REQUIRED_MESSAGE =
  "Em đã dùng hết lượt AI miễn phí. Nâng cấp SciLab Pro để tiếp tục tạo bài bằng AI và phân tích phản ứng mới — hoặc học các bài có sẵn nhé!";

export const GUEST_PRO_REQUIRED_MESSAGE =
  "Khách đã dùng lượt AI miễn phí. Hãy đăng nhập rồi nâng cấp SciLab Pro để tiếp tục dùng AI — hoặc học các bài có sẵn nhé!";

export function isDemoProAllowed(): boolean {
  const raw = process.env.ALLOW_DEMO_PRO;
  // Default ON for the demo; set ALLOW_DEMO_PRO=false to disable mock upgrades.
  if (raw === undefined) return true;
  return raw === "true";
}
