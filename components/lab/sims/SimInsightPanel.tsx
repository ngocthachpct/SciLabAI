"use client";

import { motion } from "framer-motion";
import type { SimType } from "@/lib/sim";
import { SIM_TYPE_LABEL_VI } from "@/lib/sim";
import { computeSimResult, fmt } from "@/lib/simResults";

interface SimInsightPanelProps {
  type: SimType;
  params: Record<string, number>;
  doneCount: number;
  total: number;
}

export function SimInsightPanel({ type, params, doneCount, total }: SimInsightPanelProps) {
  const result = computeSimResult(type, params);
  return (
    <section
      aria-label="Bảng phân tích mô phỏng"
      className="card-sticker flex h-full flex-col gap-3 overflow-y-auto p-4"
      style={{ backgroundColor: "#fffdf6" }}
    >
      <div className="flex items-center gap-2">
        <h2 className="font-display text-lg font-extrabold text-ink">
          Bảng <span className="text-teal">phân tích</span>
        </h2>
        <span className="sticker-chip ml-auto bg-paper-deep px-2 py-0.5 text-[10px] text-ink-soft">
          ⚛️ Mô phỏng
        </span>
      </div>

      <motion.div
        key={result.headline}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticker-flat bg-mustard px-3 py-2.5 font-display text-lg font-extrabold text-ink"
      >
        {result.headline}
      </motion.div>

      <div className="dashed-frame px-3 py-2.5">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft">Công thức</p>
        <code className="mt-1 block break-words text-sm font-bold text-terracotta">{result.formula}</code>
      </div>

      <div className="flex flex-col gap-1.5">
        {result.details.map((line, i) => (
          <p key={i} className="text-sm font-medium text-ink">
            <span className="mr-1.5 font-extrabold text-teal">•</span>
            {line}
          </p>
        ))}
      </div>

      <div className="sticker-flat bg-teal-soft px-3 py-2.5 text-xs font-semibold text-ink">
        💡 {result.note}
      </div>

      <div className="mt-auto border-t-2 border-dashed border-ink/15 pt-3">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-ink-soft">Tiến độ</p>
        <p className="mt-1 text-sm font-bold text-ink">
          {SIM_TYPE_LABEL_VI[type]}: {doneCount}/{total} nhiệm vụ
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full bg-terracotta transition-all"
            style={{ width: `${total ? (doneCount / total) * 100 : 0}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] font-medium text-ink-soft">
          Giá trị hiện tại: {Object.entries(params).map(([k, v]) => `${k} = ${fmt(v)}`).join(", ")}
        </p>
      </div>
    </section>
  );
}
