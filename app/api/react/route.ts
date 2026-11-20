import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resolveReaction } from "@/lib/engine";
import {
  getClientIp,
  getOptionalUserId,
  isWarmCacheRequest,
} from "@/lib/requestIdentity";

export const runtime = "nodejs";

const BodySchema = z.object({
  a: z.string(),
  b: z.string(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsedBody = BodySchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }

  if (parsedBody.data.a === parsedBody.data.b) {
    return NextResponse.json(
      { error: "same_reagent", message: "Chưa thí nghiệm một chất với chính nó nhé!" },
      { status: 400 }
    );
  }

  const ip = getClientIp(req);
  const userId = await getOptionalUserId();
  const bypassQuota = isWarmCacheRequest(req);

  const outcome = await resolveReaction(parsedBody.data.a, parsedBody.data.b, ip, {
    userId,
    bypassQuota,
  });

  if (outcome.ok) {
    return NextResponse.json({
      source: outcome.source,
      key: outcome.key,
      result: outcome.result,
    });
  }

  if (outcome.error === "pro_required") {
    return NextResponse.json(
      { error: outcome.error, message: outcome.message, upgradeUrl: "/pro" },
      { status: 402 }
    );
  }

  // Soft errors (HTTP 200) per spec section 7
  if (outcome.message === "Chất không hợp lệ.") {
    return NextResponse.json({ error: "bad_reagent" }, { status: 400 });
  }
  return NextResponse.json({ error: outcome.error, message: outcome.message });
}
