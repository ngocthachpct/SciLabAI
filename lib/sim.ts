import { z } from "zod";
import simDefaults from "@/lib/sim-defaults.json";

export const SimTypeSchema = z.enum([
  "force-motion",
  "buoyancy",
  "ohm-law",
  "convex-lens",
  "identities",
  "linear-equation",
  "linear-function",
  "right-triangle",
]);
export type SimType = z.infer<typeof SimTypeSchema>;

export const SIM_TYPE_LABEL_VI: Record<SimType, string> = {
  "force-motion": "Lực và chuyển động",
  buoyancy: "Lực đẩy Ác-si-mét",
  "ohm-law": "Định luật Ôm",
  "convex-lens": "Thấu kính hội tụ",
  identities: "Hằng đẳng thức",
  "linear-equation": "Phương trình bậc nhất",
  "linear-function": "Hàm số bậc nhất",
  "right-triangle": "Tam giác vuông",
};

export const SIM_TYPE_SUBJECT: Record<SimType, "physics" | "math"> = {
  "force-motion": "physics",
  buoyancy: "physics",
  "ohm-law": "physics",
  "convex-lens": "physics",
  identities: "math",
  "linear-equation": "math",
  "linear-function": "math",
  "right-triangle": "math",
};

export interface SimParamMeta {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export const SIM_PARAM_META: Record<SimType, readonly SimParamMeta[]> = {
  "force-motion": [
    { key: "F", label: "Lực kéo F", unit: "N", min: -10, max: 10, step: 0.5 },
    { key: "m", label: "Khối lượng m", unit: "kg", min: 1, max: 10, step: 0.5 },
    { key: "friction", label: "Ma sát", unit: "", min: 0, max: 1, step: 1 },
  ],
  buoyancy: [
    { key: "V", label: "Thể tích vật V", unit: "cm³", min: 50, max: 500, step: 10 },
    { key: "liquid", label: "Chất lỏng (0: nước, 1: dầu)", unit: "", min: 0, max: 1, step: 1 },
    { key: "m", label: "Khối lượng vật m", unit: "kg", min: 0.05, max: 0.5, step: 0.05 },
  ],
  "ohm-law": [
    { key: "U", label: "Hiệu điện thế U", unit: "V", min: 1, max: 12, step: 1 },
    { key: "R", label: "Điện trở R", unit: "Ω", min: 1, max: 12, step: 1 },
    { key: "closed", label: "Đóng mạch", unit: "", min: 0, max: 1, step: 1 },
  ],
  "convex-lens": [
    { key: "f", label: "Tiêu cự f", unit: "cm", min: 5, max: 20, step: 1 },
    { key: "u", label: "Khoảng cách vật u", unit: "cm", min: 3, max: 40, step: 1 },
  ],
  identities: [
    { key: "id", label: "Hằng đẳng thức (0–6)", unit: "", min: 0, max: 6, step: 1 },
    { key: "a", label: "a", unit: "", min: -10, max: 10, step: 1 },
    { key: "b", label: "b", unit: "", min: -10, max: 10, step: 1 },
  ],
  "linear-equation": [
    { key: "a", label: "Hệ số a", unit: "", min: -10, max: 10, step: 1 },
    { key: "b", label: "Hệ số b", unit: "", min: -20, max: 20, step: 1 },
    { key: "c", label: "Vế phải c", unit: "", min: -20, max: 20, step: 1 },
  ],
  "linear-function": [
    { key: "a", label: "Hệ số a", unit: "", min: -5, max: 5, step: 0.5 },
    { key: "b", label: "Hệ số b", unit: "", min: -10, max: 10, step: 1 },
  ],
  "right-triangle": [
    { key: "a", label: "Cạnh góc vuông a", unit: "", min: 1, max: 12, step: 1 },
    { key: "b", label: "Cạnh góc vuông b", unit: "", min: 1, max: 12, step: 1 },
  ],
};

export const SimTaskSchema = z.object({
  id: z.string().min(1).max(40),
  prompt: z.string().min(1).max(200),
  target: z.record(z.string(), z.number()),
  hint: z.string().max(200).optional(),
});

export const SimExperimentSchema = z.object({
  type: SimTypeSchema,
  params: z.record(z.string(), z.number()),
  tasks: z.array(SimTaskSchema).min(1).max(8),
});

export type SimTask = z.infer<typeof SimTaskSchema>;
export type SimExperiment = z.infer<typeof SimExperimentSchema>;

export const DEFAULT_SIMS: Readonly<Record<string, SimExperiment>> =
  simDefaults as unknown as Readonly<Record<string, SimExperiment>>;

export const SIM_TASK_LABELS: Readonly<Record<string, string>> = Object.freeze(
  Object.entries(DEFAULT_SIMS).reduce<Record<string, string>>((acc, [lessonId, sim]) => {
    for (const task of sim.tasks) {
      acc[simKey(lessonId, task.id)] = `${SIM_TYPE_LABEL_VI[sim.type]} — ${task.prompt}`;
    }
    return acc;
  }, {})
);

export function simKey(lessonId: string, taskId: string): string {
  return `sim:${lessonId}:${taskId}`;
}

export function isSimKey(key: string): boolean {
  return key.startsWith("sim:");
}

export function clampSimParams(type: SimType, params: Record<string, number>): Record<string, number> {
  const meta = SIM_PARAM_META[type];
  const out: Record<string, number> = {};
  for (const item of meta) {
    const raw = params[item.key];
    if (typeof raw !== "number" || !Number.isFinite(raw)) continue;
    out[item.key] = Math.min(item.max, Math.max(item.min, raw));
  }
  for (const metaItem of meta) {
    if (!(metaItem.key in out)) out[metaItem.key] = DEFAULT_SIMS_FOR_TYPE[type].params[metaItem.key];
  }
  return out;
}

const DEFAULT_SIMS_FOR_TYPE: Record<SimType, SimExperiment> = Object.values(DEFAULT_SIMS).reduce(
  (acc, sim) => {
    if (!acc[sim.type]) acc[sim.type] = sim;
    return acc;
  },
  {} as Record<SimType, SimExperiment>
);

export function matchesTask(params: Record<string, number>, target: Record<string, number>): boolean {
  return Object.entries(target).every(([key, value]) => {
    const actual = params[key];
    return typeof actual === "number" && Math.abs(actual - value) < 0.001;
  });
}

export function isSimExperimentAllowed(subject: string, sim: SimExperiment): boolean {
  return SIM_TYPE_SUBJECT[sim.type] === subject;
}
