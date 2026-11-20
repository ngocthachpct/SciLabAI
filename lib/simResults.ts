import type { SimType } from "@/lib/sim";

export interface SimResult {
  headline: string;
  formula: string;
  details: readonly string[];
  note: string;
}

export function fmt(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const rounded = Math.round(value * 100) / 100;
  return String(Number(rounded.toFixed(2)));
}

const IDENTITIES = [
  { expr: "(a + b)²", expand: "a² + 2ab + b²", value: (a: number, b: number) => (a + b) ** 2 },
  { expr: "(a − b)²", expand: "a² − 2ab + b²", value: (a: number, b: number) => (a - b) ** 2 },
  { expr: "a² − b²", expand: "(a − b)(a + b)", value: (a: number, b: number) => a ** 2 - b ** 2 },
  { expr: "(a + b)³", expand: "a³ + 3a²b + 3ab² + b³", value: (a: number, b: number) => (a + b) ** 3 },
  { expr: "(a − b)³", expand: "a³ − 3a²b + 3ab² − b³", value: (a: number, b: number) => (a - b) ** 3 },
  { expr: "a³ + b³", expand: "(a + b)(a² − ab + b²)", value: (a: number, b: number) => a ** 3 + b ** 3 },
  { expr: "a³ − b³", expand: "(a − b)(a² + ab + b²)", value: (a: number, b: number) => a ** 3 - b ** 3 },
] as const;

function signed(value: number): string {
  return value < 0 ? `− ${fmt(Math.abs(value))}` : `+ ${fmt(value)}`;
}

export function computeSimResult(type: SimType, p: Record<string, number>): SimResult {
  switch (type) {
    case "force-motion": {
      const F = p.F ?? 0;
      const m = p.m ?? 1;
      const friction = p.friction ?? 0;
      const frictionForce = friction === 1 ? Math.sign(F) * 2 : 0;
      const a = (F - frictionForce) / m;
      const state =
        Math.abs(a) < 0.01
          ? "Vật đứng yên hoặc chuyển động thẳng đều (cân bằng)"
          : a > 0
            ? "Vật tăng tốc theo hướng lực kéo"
            : "Vật tăng tốc ngược hướng lực kéo";
      return {
        headline: `a = ${fmt(a)} m/s²`,
        formula: "a = (F − F_ms) / m",
        details: [
          `Lực kéo F = ${fmt(F)} N`,
          friction === 1 ? `Lực ma sát ≈ ${fmt(Math.abs(frictionForce))} N` : "Bỏ qua ma sát",
          `Khối lượng m = ${fmt(m)} kg`,
          state,
        ],
        note: "Lực càng lớn hoặc khối lượng càng nhỏ thì gia tốc càng lớn.",
      };
    }
    case "buoyancy": {
      const V = p.V ?? 200;
      const liquid = p.liquid ?? 0;
      const m = p.m ?? 0.2;
      const rho = liquid === 1 ? 800 : 1000;
      const FA = rho * (V / 1_000_000) * 10;
      const P = m * 10;
      const state = FA > P + 0.01 ? "Vật nổi" : FA < P - 0.01 ? "Vật chìm" : "Vật lơ lửng trong chất lỏng";
      return {
        headline: `Fđ = ${fmt(FA)} N`,
        formula: "Fđ = d · V ; P = m · g",
        details: [
          liquid === 1 ? "Chất lỏng: dầu (d = 8000 N/m³)" : "Chất lỏng: nước (d = 10000 N/m³)",
          `Thể tích V = ${fmt(V)} cm³ = ${fmt(V / 1_000_000)} m³`,
          `Trọng lượng P = ${fmt(P)} N`,
          state,
        ],
        note: "Vật nổi khi lực đẩy Ác-si-mét lớn hơn trọng lượng của vật.",
      };
    }
    case "ohm-law": {
      const U = p.U ?? 6;
      const R = p.R ?? 3;
      const closed = p.closed ?? 1;
      const I = closed ? U / R : 0;
      return {
        headline: `I = ${fmt(I)} A`,
        formula: "I = U / R",
        details: [
          closed ? "Mạch đã đóng" : "Mạch hở nên không có dòng điện",
          `Hiệu điện thế U = ${fmt(U)} V`,
          `Điện trở R = ${fmt(R)} Ω`,
        ],
        note: "Giữ nhiệt độ không đổi: I tỉ lệ thuận với U và tỉ lệ nghịch với R.",
      };
    }
    case "convex-lens": {
      const f = p.f ?? 10;
      const u = p.u ?? 30;
      const denom = 1 / f - 1 / u;
      const real = denom > 0.0001;
      const v = real ? 1 / denom : -1 / Math.abs(denom || 0.001);
      const scale = Math.abs(v) / u;
      const kind =
        !real
          ? "Ảnh ảo, cùng chiều, lớn hơn vật"
          : u > 2 * f + 0.01
            ? "Ảnh thật, ngược chiều, nhỏ hơn vật"
            : Math.abs(u - 2 * f) < 0.01
              ? "Ảnh thật, ngược chiều, bằng vật"
              : "Ảnh thật, ngược chiều, lớn hơn vật";
      return {
        headline: `v = ${fmt(v)} cm`,
        formula: "1/f = 1/u + 1/v",
        details: [
          `Tiêu cự f = ${fmt(f)} cm; khoảng cách vật u = ${fmt(u)} cm`,
          `Độ phóng đại ≈ ${fmt(scale)}`,
          kind,
        ],
        note: "Vật đặt ngoài 2F cho ảnh thật; đặt trong F cho ảnh ảo.",
      };
    }
    case "identities": {
      const id = Math.max(0, Math.min(IDENTITIES.length - 1, Math.round(p.id ?? 0)));
      const a = p.a ?? 0;
      const b = p.b ?? 0;
      const item = IDENTITIES[id];
      return {
        headline: `Giá trị = ${fmt(item.value(a, b))}`,
        formula: `${item.expr} = ${item.expand}`,
        details: [`a = ${fmt(a)}, b = ${fmt(b)}`, `Vế trái: ${item.expr}`, `Khai triển: ${item.expand}`],
        note: "Chọn số hạng giữa đúng dấu khi bình phương tổng hoặc hiệu.",
      };
    }
    case "linear-equation": {
      const a = p.a ?? 1;
      const b = p.b ?? 0;
      const c = p.c ?? 0;
      if (Math.abs(a) < 0.001) {
        return {
          headline: "a phải khác 0",
          formula: "ax + b = c",
          details: [`Phương trình: ${fmt(b)} = ${fmt(c)}`, "Hệ số a = 0 nên không phải phương trình bậc nhất"],
          note: "Phương trình bậc nhất một ẩn cần a ≠ 0.",
        };
      }
      const x = (c - b) / a;
      return {
        headline: `x = ${fmt(x)}`,
        formula: "x = (c − b) / a",
        details: [
          `Phương trình: ${fmt(a)}x ${signed(b)} = ${fmt(c)}`,
          `${fmt(a)}x = ${fmt(c)} ${signed(-b)}`,
          `x = (${fmt(c)} − (${fmt(b)})) / ${fmt(a)} = ${fmt(x)}`,
          `Kiểm tra: ${fmt(a)} · ${fmt(x)} ${signed(b)} = ${fmt(a * x + b)}`,
        ],
        note: "Chuyển vế thì đổi dấu; chia cả hai vế cho a (a ≠ 0).",
      };
    }
    case "linear-function": {
      const a = p.a ?? 1;
      const b = p.b ?? 0;
      const trend = a > 0 ? "đồng biến trên R" : a < 0 ? "nghịch biến trên R" : "hằng số";
      const x0 = Math.abs(a) < 0.001 ? null : -b / a;
      return {
        headline: `y = ${fmt(a)}x ${signed(b)}`,
        formula: "y = ax + b (a ≠ 0)",
        details: [
          `Hệ số a = ${fmt(a)} → hàm số ${trend}`,
          `Cắt trục Oy tại (0; ${fmt(b)})`,
          x0 === null ? "Không cắt trục Ox" : `Cắt trục Ox tại (${fmt(x0)}; 0)`,
        ],
        note: "Hệ số a quyết định chiều của đường thẳng, b quyết định giao điểm với trục tung.",
      };
    }
    case "right-triangle": {
      const a = p.a ?? 3;
      const b = p.b ?? 4;
      const c = Math.sqrt(a * a + b * b);
      const h = (a * b) / c;
      const pSeg = (a * a) / c;
      const qSeg = (b * b) / c;
      return {
        headline: `c = ${fmt(c)}`,
        formula: "a² + b² = c²",
        details: [
          `Hai cạnh góc vuông: a = ${fmt(a)}, b = ${fmt(b)}`,
          `Đường cao h = ${fmt(h)}; các đoạn cạnh huyền p = ${fmt(pSeg)}, q = ${fmt(qSeg)}`,
          `sin A = ${fmt(a / c)}, cos A = ${fmt(b / c)}, tan A = ${fmt(a / b)}`,
        ],
        note: `Kiểm tra: ${fmt(a)}² + ${fmt(b)}² = ${fmt(c)}².`,
      };
    }
  }
}
