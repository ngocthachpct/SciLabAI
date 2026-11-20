"use client";

import type { SimTask } from "@/lib/sim";

interface SimTaskCardProps {
  lessonTitle: string;
  note?: string;
  tasks: readonly SimTask[];
  doneKeys: ReadonlySet<string>;
  onApply: (task: SimTask) => void;
}

export function SimTaskCard({ lessonTitle, note, tasks, doneKeys, onApply }: SimTaskCardProps) {
  return (
    <div className="card-sticker p-4" style={{ backgroundColor: "#fffdf6" }}>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-base font-extrabold text-ink">🎯 Nhiệm vụ mô phỏng</h3>
        <span className="sticker-chip bg-teal-soft px-2.5 py-0.5 text-[11px] text-ink">{lessonTitle}</span>
        <span className="ml-auto text-xs font-bold text-ink-soft">
          {doneKeys.size}/{tasks.length} hoàn thành
        </span>
      </div>
      {note && <p className="mt-1 text-xs font-medium text-ink-soft">{note}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {tasks.map((task) => {
          const done = doneKeys.has(task.id);
          return (
            <button
              key={task.id}
              type="button"
              disabled={done}
              onClick={() => onApply(task)}
              className={`sticker-btn max-w-full px-3 py-1.5 text-left text-xs ${
                done ? "bg-teal-soft opacity-70" : "bg-paper"
              }`}
              title={task.hint}
            >
              {done ? "✅ " : "👉 "}
              {task.prompt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
