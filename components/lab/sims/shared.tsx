"use client";

import type { ReactNode } from "react";
import { SIM_PARAM_META, type SimType } from "@/lib/sim";
import { fmt } from "@/lib/simResults";

interface SimFrameProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SimFrame({ title, subtitle, children }: SimFrameProps) {
  return (
    <section
      aria-label={title}
      className="card-sticker relative flex h-full min-h-[420px] flex-col overflow-hidden"
      style={{ backgroundColor: "#f7ecd8" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{
          width: 520,
          height: 520,
          background:
            "repeating-conic-gradient(from -6deg at 50% 50%, rgba(242,193,78,0.30) 0deg 8deg, transparent 8deg 24deg)",
        }}
      />
      <div className="relative z-10 flex flex-wrap items-center gap-2 border-b-2 border-ink/10 px-4 py-3">
        <h2 className="font-display text-base font-extrabold text-ink">{title}</h2>
        {subtitle && (
          <span className="sticker-chip bg-teal-soft px-2.5 py-0.5 text-[11px] text-ink">
            {subtitle}
          </span>
        )}
      </div>
      <div className="relative z-10 flex flex-1 items-center justify-center p-3 sm:p-5">
        {children}
      </div>
    </section>
  );
}

interface SimControlsProps {
  type: SimType;
  params: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export function SimControls({ type, params, onChange }: SimControlsProps) {
  return (
    <div className="card-sticker flex h-full flex-col gap-3 p-4" style={{ backgroundColor: "#fffdf6" }}>
      <div className="flex items-center gap-2">
        <h3 className="font-display text-base font-extrabold text-ink">🎛️ Điều khiển</h3>
        <span className="sticker-chip ml-auto bg-mustard px-2 py-0.5 text-[10px] text-ink">Kéo thanh trượt</span>
      </div>
      {SIM_PARAM_META[type].map((meta) => {
        const value = params[meta.key] ?? meta.min;
        const binary = meta.min === 0 && meta.max === 1 && meta.step === 1;
        if (binary) {
          return (
            <div key={meta.key} className="sticker-flat bg-paper px-3 py-2">
              <p className="text-xs font-bold text-ink">{meta.label}</p>
              <div className="mt-2 flex gap-2">
                {[0, 1].map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => onChange(meta.key, choice)}
                    className={`sticker-btn flex-1 px-3 py-1.5 text-xs ${
                      value === choice ? "bg-teal-soft text-ink" : "bg-paper-deep text-ink-soft"
                    }`}
                  >
                    {meta.key === "closed" ? (choice ? "Đóng" : "Mở") : choice ? "Có" : "Không"}
                  </button>
                ))}
              </div>
            </div>
          );
        }
        return (
          <label key={meta.key} className="sticker-flat block bg-paper px-3 py-2">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-ink">{meta.label}</span>
              <span className="ml-auto font-display text-sm font-extrabold text-terracotta">
                {fmt(value)} {meta.unit}
              </span>
            </div>
            <input
              type="range"
              min={meta.min}
              max={meta.max}
              step={meta.step}
              value={value}
              onChange={(e) => onChange(meta.key, Number(e.target.value))}
              className="mt-2 w-full accent-[#e07a5f]"
            />
          </label>
        );
      })}
    </div>
  );
}
