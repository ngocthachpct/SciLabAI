import { NextRequest, NextResponse } from "next/server";
import { getClientIp, getOptionalUserId } from "@/lib/requestIdentity";
import { getPlanStatus, isDemoProAllowed } from "@/lib/plan";

export const runtime = "nodejs";

/** GET /api/me/plan — current plan + AI usage for the signed-in user (or IP guest). */
export async function GET(req: NextRequest) {
  const userId = await getOptionalUserId();
  const ip = getClientIp(req);
  const status = await getPlanStatus(userId, ip);
  return NextResponse.json({
    ...status,
    demoProAllowed: isDemoProAllowed(),
  });
}
