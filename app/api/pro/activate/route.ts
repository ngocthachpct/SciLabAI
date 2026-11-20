import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  activatePro,
  downgradeToFree,
  getPlanStatus,
  isDemoProAllowed,
} from "@/lib/plan";
import { getClientIp, getOptionalUserId } from "@/lib/requestIdentity";

export const runtime = "nodejs";

const BodySchema = z.object({
  plan: z.enum(["pro", "free"]).default("pro"),
});

/**
 * POST /api/pro/activate — mock Pro activation for the demo.
 * Guarded by ALLOW_DEMO_PRO=true; no real payment is involved.
 */
export async function POST(req: NextRequest) {
  const userId = await getOptionalUserId();
  if (!userId) {
    return NextResponse.json(
      { error: "unauthorized", message: "Em cần đăng nhập để nâng cấp Pro." },
      { status: 401 }
    );
  }

  if (!isDemoProAllowed()) {
    return NextResponse.json(
      {
        error: "demo_disabled",
        message: "Tính năng nâng cấp Pro demo đang tắt. Liên hệ giáo viên để được cấp quyền.",
      },
      { status: 403 }
    );
  }

  let body: unknown = { plan: "pro" };
  try {
    body = await req.json();
  } catch {
    // empty body defaults to pro
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_body" }, { status: 400 });
  }

  try {
    if (parsed.data.plan === "pro") {
      await activatePro(userId);
    } else {
      await downgradeToFree(userId);
    }
  } catch {
    return NextResponse.json(
      { error: "db_error", message: "Chưa lưu được trạng thái gói. Thử lại nhé!" },
      { status: 500 }
    );
  }

  const status = await getPlanStatus(userId, getClientIp(req));
  return NextResponse.json({ ...status, demoProAllowed: true });
}
