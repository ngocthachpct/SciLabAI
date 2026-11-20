"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { ClerkChrome } from "@/components/auth/ClerkChrome";
import { Sparkle } from "@/components/decor/Sparkle";
import { usePlan } from "@/hooks/usePlan";
import { hasClerk } from "@/hooks/useClerkOptional";

const FREE_FEATURES = [
  "1 lượt tạo bài bằng AI",
  "1 lượt phân tích phản ứng AI trong Lab",
  "Toàn bộ bài SGK sẵn có",
  "Kho bài mẫu demo",
  "Sổ tay & danh hiệu",
];

const PRO_FEATURES = [
  "Không giới hạn lượt tạo bài bằng AI",
  "Không giới hạn phân tích phản ứng mới",
  "Toàn bộ bài SGK + bài mẫu",
  "Ưu tiên trải nghiệm demo",
  "Sổ tay & danh hiệu",
];

export default function ProPage() {
  const { info, loading, refresh } = usePlan();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "err"; text: string } | null>(
    null
  );

  const changePlan = async (plan: "pro" | "free"): Promise<void> => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/pro/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        await refresh();
        setMessage({
          tone: "ok",
          text:
            plan === "pro"
              ? "🎉 Đã kích hoạt SciLab Pro (demo)! Em dùng AI không giới hạn nhé."
              : "Đã chuyển về gói Free (demo).",
        });
      } else {
        setMessage({
          tone: "err",
          text: data.message ?? "Chưa đổi được gói, thử lại nhé!",
        });
      }
    } catch {
      setMessage({ tone: "err", text: "Lỗi mạng khi đổi gói." });
    } finally {
      setBusy(false);
    }
  };

  const percent =
    info.freeLimit > 0
      ? Math.min(100, Math.round((info.used / info.freeLimit) * 100))
      : 100;

  return (
    <main className="mx-auto flex min-h-screen max-w-[900px] flex-col gap-5 p-4 lg:p-6">
      <header className="flex flex-wrap items-center gap-3">
        <Link href="/hoc" className="sticker-btn bg-paper px-3 py-1.5 text-xs text-ink">
          ← Về bài học
        </Link>
        <h1 className="font-display text-xl font-extrabold text-ink">SciLab Pro</h1>
        <Sparkle tone="#f2c14e" size={20} delay="0.4s" />
        <div className="ml-auto flex items-center gap-2">
          <ClerkChrome />
        </div>
      </header>

      <section className="card-sticker relative overflow-hidden p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full"
          style={{
            right: -120,
            top: -120,
            width: 320,
            height: 320,
            background:
              "repeating-conic-gradient(from -6deg at 50% 50%, rgba(242,193,78,0.34) 0deg 8deg, transparent 8deg 24deg)",
          }}
        />
        <p className="text-xs font-bold uppercase tracking-wide text-teal">
          Nâng cấp trải nghiệm
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold text-ink">
          Học không giới hạn cùng SciLab Pro
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-ink-soft">
          Gói Free có 1 lượt AI để em trải nghiệm. Khi cần tạo thêm bài học bằng AI
          hoặc phân tích phản ứng mới trong Lab, hãy nâng cấp Pro. Đây là bản demo:
          kích hoạt ngay, không cần thanh toán.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="sticker-flat bg-paper px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Gói hiện tại
            </p>
            <p className="font-display text-2xl font-extrabold text-ink">
              {loading ? "…" : info.isPro ? "SciLab Pro" : "Free"}
            </p>
            <p className="mt-1 text-xs font-semibold text-ink-soft">
              {info.isAuthenticated ? "Đã đăng nhập" : "Khách (tính theo IP)"}
            </p>
          </div>
          <div className="sticker-flat bg-teal-soft px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">
              Lượt AI miễn phí
            </p>
            <p className="font-display text-2xl font-extrabold text-ink">
              {info.isPro ? "Không giới hạn" : `${info.used}/${info.freeLimit}`}
            </p>
            <div className="mt-2 h-2 overflow-hidden rounded-full border-2 border-ink bg-paper">
              <div
                className="h-full bg-terracotta transition-[width] duration-300"
                style={{ width: info.isPro ? "100%" : `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card-sticker p-5">
          <p className="font-display text-xl font-extrabold text-ink">Free</p>
          <p className="mt-1 text-sm font-semibold text-ink-soft">0đ — dùng thử</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm font-medium text-ink">
            {FREE_FEATURES.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </div>
        <div className="card-sticker p-5" style={{ backgroundColor: "#fff6dc" }}>
          <p className="font-display text-xl font-extrabold text-ink">Pro (demo)</p>
          <p className="mt-1 text-sm font-semibold text-ink-soft">
            49.000đ/tháng — miễn phí trong bản demo
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm font-medium text-ink">
            {PRO_FEATURES.map((f) => (
              <li key={f}>★ {f}</li>
            ))}
          </ul>
        </div>
      </section>

      {message && (
        <div
          className="sticker-flat px-4 py-3 text-sm font-semibold"
          style={{
            backgroundColor: message.tone === "ok" ? "#d9efe7" : "#fde2d8",
            borderColor: message.tone === "ok" ? "var(--color-ink)" : "#b3402a",
          }}
        >
          {message.text}
        </div>
      )}

      <section className="card-sticker flex flex-col items-start gap-3 p-5">
        {!info.isAuthenticated ? (
          <>
            <p className="text-sm font-semibold text-ink">
              Em cần đăng nhập để gắn gói Pro với tài khoản của mình.
            </p>
            {hasClerk ? (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="sticker-btn bg-mustard px-5 py-2.5 text-sm text-ink"
                >
                  Đăng nhập để nâng cấp
                </button>
              </SignInButton>
            ) : (
              <p className="text-xs font-semibold text-ink-soft">
                Clerk chưa được cấu hình trên máy chủ này.
              </p>
            )}
          </>
        ) : info.isPro ? (
          <>
            <p className="text-sm font-semibold text-ink">
              Em đang dùng SciLab Pro (demo). Có thể quay lại gói Free để thử lại luồng.
            </p>
            <button
              type="button"
              disabled={busy || !info.demoProAllowed}
              onClick={() => void changePlan("free")}
              className="sticker-btn bg-paper px-5 py-2.5 text-sm text-ink"
            >
              {busy ? "Đang xử lý…" : "Hủy Pro (demo)"}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink">
              Kích hoạt Pro demo để dùng AI không giới hạn trên tài khoản này.
            </p>
            <button
              type="button"
              disabled={busy || !info.demoProAllowed}
              onClick={() => void changePlan("pro")}
              className="sticker-btn bg-terracotta px-6 py-3 text-sm text-white"
            >
              {busy ? "Đang kích hoạt…" : "🚀 Kích hoạt SciLab Pro (demo)"}
            </button>
            {!info.demoProAllowed && (
              <p className="text-xs font-semibold text-[#b3402a]">
                Nâng cấp demo đang tắt (ALLOW_DEMO_PRO=false).
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
