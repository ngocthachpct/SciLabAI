"use client";

import type { ReactElement, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { SimType } from "@/lib/sim";
import { computeSimResult, fmt } from "@/lib/simResults";
import { SimFrame } from "./shared";

type Params = Record<string, number>;

function Svg({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 440 280" className="w-full max-w-[520px]">{children}</svg>;
}

function ForceMotion({ p }: { p: Params }) {
  const F = p.F ?? 0;
  const m = p.m ?? 2;
  const friction = (p.friction ?? 0) === 1;
  const a = (F - (friction ? Math.sign(F) * 2 : 0)) / m;
  const offset = Math.max(-60, Math.min(60, a * 9));
  const arrowLen = Math.max(-110, Math.min(110, F * 9));
  const frictionLen = friction ? -Math.sign(F) * 55 : 0;
  return (
    <Svg>
      <defs>
        <marker id="force-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#b3402a" />
        </marker>
        <marker id="friction-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#3f9e8d" />
        </marker>
      </defs>
      <line x1="30" y1="230" x2="410" y2="230" stroke="var(--color-ink)" strokeWidth="3" />
      {[80, 140, 200, 260, 320, 380].map((x) => (
        <line key={x} x1={x} y1="230" x2={x - 14} y2="244" stroke="#8a7a67" strokeWidth="2" />
      ))}
      <rect x={170 + offset} y="175" width="86" height="54" rx="8" fill="#e07a5f" stroke="var(--color-ink)" strokeWidth="3" />
      <circle cx={193 + offset} cy="232" r="12" fill="#2f2a26" stroke="var(--color-ink)" strokeWidth="2" />
      <circle cx={234 + offset} cy="232" r="12" fill="#2f2a26" stroke="var(--color-ink)" strokeWidth="2" />
      <text x={213 + offset} y="207" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
        m = {fmt(m)} kg
      </text>
      {arrowLen !== 0 && (
        <>
          <line x1={213 + offset} y1="150" x2={213 + offset + arrowLen} y2="150" stroke="#b3402a" strokeWidth="5" markerEnd="url(#force-arrow)" />
          <text x={213 + offset + arrowLen / 2} y="138" textAnchor="middle" fontSize="14" fontWeight="800" fill="#b3402a">
            F = {fmt(F)} N
          </text>
        </>
      )}
      {friction && frictionLen !== 0 && (
        <>
          <line x1={213 + offset} y1="258" x2={213 + offset + frictionLen} y2="258" stroke="#3f9e8d" strokeWidth="4" markerEnd="url(#friction-arrow)" />
          <text x={213 + offset + frictionLen / 2} y="274" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3f9e8d">
            F_ms
          </text>
        </>
      )}
      <text x="220" y="35" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2f2a26">
        a = {fmt(a)} m/s²
      </text>
    </Svg>
  );
}

function Buoyancy({ p }: { p: Params }) {
  const V = p.V ?? 200;
  const liquid = (p.liquid ?? 0) === 1;
  const m = p.m ?? 0.2;
  const FA = (liquid ? 800 : 1000) * (V / 1_000_000) * 10;
  const P = m * 10;
  const float = FA > P + 0.01;
  const sink = FA < P - 0.01;
  const objectY = float ? 120 : sink ? 214 : 170;
  const upLen = Math.min(90, FA * 9);
  const downLen = Math.min(90, P * 9);
  return (
    <Svg>
      <defs>
        <marker id="buoy-up" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#3f9e8d" />
        </marker>
        <marker id="buoy-down" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#b3402a" />
        </marker>
      </defs>
      <rect x="120" y="110" width="200" height="140" fill={liquid ? "#f2d98b" : "#bfe3f5"} opacity="0.75" />
      <rect x="120" y="110" width="200" height="140" fill="none" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1="120" y1="110" x2="320" y2="110" stroke="var(--color-ink)" strokeWidth="3" />
      <rect x="196" y={objectY} width="48" height="42" rx="5" fill="#e07a5f" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1="220" y1={objectY + 20} x2="220" y2={objectY + 20 - upLen} stroke="#3f9e8d" strokeWidth="4" markerEnd="url(#buoy-up)" />
      <line x1="220" y1={objectY + 20} x2="220" y2={objectY + 20 + downLen} stroke="#b3402a" strokeWidth="4" markerEnd="url(#buoy-down)" />
      <text x="232" y={objectY + 20 - upLen} fontSize="13" fontWeight="800" fill="#3f9e8d">Fđ = {fmt(FA)} N</text>
      <text x="232" y={objectY + 20 + downLen} fontSize="13" fontWeight="800" fill="#b3402a">P = {fmt(P)} N</text>
      <text x="220" y="45" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2f2a26">
        {float ? "Vật nổi ↑" : sink ? "Vật chìm ↓" : "Vật lơ lửng"}
      </text>
      <text x="220" y="285" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b6257">
        {liquid ? "Dầu" : "Nước"} · V = {fmt(V)} cm³
      </text>
    </Svg>
  );
}

function OhmLaw({ p }: { p: Params }) {
  const U = p.U ?? 6;
  const R = p.R ?? 3;
  const closed = (p.closed ?? 1) === 1;
  const I = closed ? U / R : 0;
  const reduce = useReducedMotion();
  return (
    <Svg>
      <defs>
        <marker id="ohm-flow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#3f9e8d" />
        </marker>
      </defs>
      <path d="M90,200 L90,70 L150,70" fill="none" stroke="var(--color-ink)" strokeWidth="4" />
      <path d="M300,70 L360,70 L360,200 L300,200" fill="none" stroke="var(--color-ink)" strokeWidth="4" />
      <line x1="90" y1="120" x2="90" y2="150" stroke="var(--color-ink)" strokeWidth="6" />
      <line x1="78" y1="126" x2="102" y2="126" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1="78" y1="144" x2="102" y2="144" stroke="var(--color-ink)" strokeWidth="3" />
      <text x="62" y="140" fontSize="12" fontWeight="800" fill="#2f2a26">{fmt(U)} V</text>
      <path d="M150,70 l10,-12 l12,24 l12,-24 l12,24 l12,-24 l12,24 l12,-24 l12,12" fill="none" stroke="#b3402a" strokeWidth="4" />
      <text x="222" y="45" textAnchor="middle" fontSize="13" fontWeight="800" fill="#b3402a">R = {fmt(R)} Ω</text>
      <circle cx="330" cy="135" r="26" fill="#fffdf6" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1="330" y1="135" x2={330 + Math.min(18, I * 9)} y2={135 - Math.min(12, I * 5)} stroke="#b3402a" strokeWidth="3" />
      <text x="330" y="178" textAnchor="middle" fontSize="12" fontWeight="800" fill="#2f2a26">A</text>
      {closed ? (
        <line x1="300" y1="200" x2="360" y2="200" stroke="var(--color-ink)" strokeWidth="4" />
      ) : (
        <>
          <line x1="300" y1="200" x2="330" y2="178" stroke="var(--color-ink)" strokeWidth="4" />
          <circle cx="300" cy="200" r="5" fill="#fff" stroke="var(--color-ink)" strokeWidth="3" />
        </>
      )}
      {closed && !reduce &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cy="70" r="4" fill="#3f9e8d">
            <animate attributeName="cx" values="100;300" dur="1.4s" begin={`${i * 0.28}s`} repeatCount="indefinite" />
          </circle>
        ))}
      <text x="220" y="250" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2f2a26">
        I = {fmt(I)} A
      </text>
    </Svg>
  );
}

function ConvexLens({ p }: { p: Params }) {
  const f = p.f ?? 10;
  const u = p.u ?? 30;
  const denom = 1 / f - 1 / u;
  const real = denom > 0.0001;
  const v = real ? 1 / denom : -1 / Math.abs(denom || 0.001);
  const scale = Math.min(2.5, Math.abs(v) / u);
  const lensX = 220;
  const scalePx = 4;
  const uPx = Math.min(160, u * scalePx);
  const vPx = Math.max(-150, Math.min(150, v * scalePx));
  const objX = lensX - uPx;
  const imgX = lensX + vPx;
  const imgY = real ? 140 + 40 * scale : 140 - 40 * scale;
  const fPx = Math.min(80, f * scalePx);
  return (
    <Svg>
      <line x1="30" y1="140" x2="410" y2="140" stroke="#8a7a67" strokeWidth="2" strokeDasharray="6 5" />
      <ellipse cx={lensX} cy="140" rx="9" ry="88" fill="#bfe3f5" fillOpacity="0.7" stroke="var(--color-ink)" strokeWidth="3" />
      <circle cx={lensX - fPx} cy="140" r="4" fill="#b3402a" />
      <circle cx={lensX + fPx} cy="140" r="4" fill="#b3402a" />
      <text x={lensX - fPx} y="132" textAnchor="middle" fontSize="11" fill="#b3402a">F</text>
      <text x={lensX + fPx} y="132" textAnchor="middle" fontSize="11" fill="#b3402a">F</text>
      <line x1={objX} y1="140" x2={objX} y2="100" stroke="#3f9e8d" strokeWidth="5" />
      <text x={objX} y="92" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3f9e8d">vật</text>
      <polyline points={`${objX},100 ${lensX},100 ${imgX},${imgY}`} fill="none" stroke="#e0a23d" strokeWidth="2" />
      <polyline points={`${objX},100 ${lensX},140 ${imgX},${imgY}`} fill="none" stroke="#e0a23d" strokeWidth="2" />
      <polyline points={`${objX},100 ${lensX + fPx},140 ${imgX},${imgY}`} fill="none" stroke="#e0a23d" strokeWidth="2" />
      <line x1={imgX} y1="140" x2={imgX} y2={imgY} stroke="#b3402a" strokeWidth="5" />
      <text x={imgX} y={real ? imgY + 18 : imgY - 8} textAnchor="middle" fontSize="12" fontWeight="800" fill="#b3402a">
        {real ? "ảnh thật" : "ảnh ảo"}
      </text>
      <text x="220" y="265" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2f2a26">
        f = {fmt(f)} cm · u = {fmt(u)} cm · v = {fmt(v)} cm
      </text>
    </Svg>
  );
}

const IDENTITY_TILES: Record<number, string[]> = {
  0: ["a²", "ab", "ab", "b²"],
  1: ["a²", "−ab", "−ab", "b²"],
  2: ["a²", "−b²", "", ""],
  3: ["a³", "3a²b", "3ab²", "b³"],
  4: ["a³", "−3a²b", "3ab²", "−b³"],
  5: ["a³", "b³", "−a²b", "−ab²"],
  6: ["a³", "−b³", "a²b", "−ab²"],
};

function Identities({ p }: { p: Params }) {
  const id = Math.max(0, Math.min(6, Math.round(p.id ?? 0)));
  const a = p.a ?? 3;
  const b = p.b ?? 2;
  const result = computeSimResult("identities", p);
  const tiles = IDENTITY_TILES[id] ?? IDENTITY_TILES[0];
  const colors = ["#f2c14e", "#e07a5f", "#3f9e8d", "#8e7cc3"];
  return (
    <Svg>
      <text x="220" y="42" textAnchor="middle" fontSize="19" fontWeight="800" fill="#2f2a26">
        {result.formula}
      </text>
      {tiles.map((tile, i) =>
        tile ? (
          <g key={i}>
            <rect x={95 + (i % 2) * 125} y={75 + Math.floor(i / 2) * 78} width="118" height="70" rx="6" fill={colors[i]} stroke="var(--color-ink)" strokeWidth="2" />
            <text x={154 + (i % 2) * 125} y={115 + Math.floor(i / 2) * 78} textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">
              {tile}
            </text>
          </g>
        ) : null
      )}
      <text x="220" y="252" textAnchor="middle" fontSize="15" fontWeight="800" fill="#b3402a">
        a = {fmt(a)}, b = {fmt(b)} → {result.headline}
      </text>
    </Svg>
  );
}

function LinearEquation({ p }: { p: Params }) {
  const result = computeSimResult("linear-equation", p);
  const a = p.a ?? 1;
  return (
    <Svg>
      <line x1="90" y1="120" x2="350" y2="120" stroke="var(--color-ink)" strokeWidth="5" />
      <circle cx="220" cy="120" r="8" fill="#2f2a26" />
      <line x1="110" y1="120" x2="110" y2="170" stroke="#8a7a67" strokeWidth="2" />
      <line x1="330" y1="120" x2="330" y2="170" stroke="#8a7a67" strokeWidth="2" />
      <path d="M70,170 Q110,200 150,170 Z" fill="#f2c14e" stroke="var(--color-ink)" strokeWidth="3" />
      <path d="M290,170 Q330,200 370,170 Z" fill="#3f9e8d" stroke="var(--color-ink)" strokeWidth="3" />
      <text x="110" y="192" textAnchor="middle" fontSize="15" fontWeight="800" fill="#2f2a26">
        {fmt(a)}x + {fmt(p.b ?? 0)}
      </text>
      <text x="330" y="192" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
        {fmt(p.c ?? 0)}
      </text>
      <text x="220" y="240" textAnchor="middle" fontSize="20" fontWeight="800" fill="#b3402a">
        {result.headline}
      </text>
      <text x="220" y="266" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6b6257">
        {result.details[1] ?? ""}
      </text>
    </Svg>
  );
}

function LinearFunction({ p }: { p: Params }) {
  const a = p.a ?? 1;
  const b = p.b ?? 0;
  const toX = (x: number) => 220 + x * 22;
  const toY = (y: number) => 140 - y * 14;
  const points: string[] = [];
  for (let x = -8; x <= 8; x += 0.5) {
    const y = a * x + b;
    if (y >= -9 && y <= 9) points.push(`${toX(x)},${toY(y)}`);
  }
  return (
    <Svg>
      {[-8, -4, 4, 8].map((x) => (
        <line key={`gx${x}`} x1={toX(x)} y1="20" x2={toX(x)} y2="260" stroke="#e4d9c4" strokeWidth="1" />
      ))}
      {[-8, -4, 4, 8].map((y) => (
        <line key={`gy${y}`} x1="20" y1={toY(y)} x2="420" y2={toY(y)} stroke="#e4d9c4" strokeWidth="1" />
      ))}
      <line x1="20" y1="140" x2="420" y2="140" stroke="var(--color-ink)" strokeWidth="2" />
      <line x1="220" y1="20" x2="220" y2="260" stroke="var(--color-ink)" strokeWidth="2" />
      <text x="414" y="132" fontSize="12" fontWeight="800" fill="#6b6257">x</text>
      <text x="228" y="28" fontSize="12" fontWeight="800" fill="#6b6257">y</text>
      <polyline points={points.join(" ")} fill="none" stroke="#b3402a" strokeWidth="4" strokeLinecap="round" />
      <circle cx={toX(0)} cy={toY(b)} r="5" fill="#3f9e8d" stroke="#fff" strokeWidth="2" />
      <text x={toX(0) + 8} y={toY(b) - 8} fontSize="12" fontWeight="800" fill="#3f9e8d">(0; {fmt(b)})</text>
      <text x="220" y="275" textAnchor="middle" fontSize="14" fontWeight="800" fill="#2f2a26">
        y = {fmt(a)}x {a >= 0 ? "+" : "−"} {fmt(Math.abs(b))}
      </text>
    </Svg>
  );
}

function RightTriangle({ p }: { p: Params }) {
  const a = p.a ?? 3;
  const b = p.b ?? 4;
  const c = Math.sqrt(a * a + b * b);
  const scale = Math.min(150 / a, 230 / b);
  const ax = 90;
  const ay = 220;
  const bx = ax + b * scale;
  const by = ay;
  const cx = ax;
  const cy = ay - a * scale;
  const h = (a * b) / c;
  const footX = ax + ((b * a * a) / (c * c)) * scale;
  const footY = ay - ((a * b * b) / (c * c)) * scale;
  return (
    <Svg>
      <polygon points={`${ax},${ay} ${bx},${by} ${cx},${cy}`} fill="#f2c14e" fillOpacity="0.35" stroke="var(--color-ink)" strokeWidth="3" />
      <line x1={ax} y1={ay} x2={footX} y2={footY} stroke="#3f9e8d" strokeWidth="3" strokeDasharray="6 4" />
      <text x={ax - 16} y={(ay + cy) / 2} fontSize="15" fontWeight="800" fill="#b3402a">a = {fmt(a)}</text>
      <text x={(ax + bx) / 2} y={ay + 22} fontSize="15" fontWeight="800" fill="#b3402a">b = {fmt(b)}</text>
      <text x={(bx + cx) / 2 + 18} y={(by + cy) / 2 - 10} fontSize="15" fontWeight="800" fill="#2f2a26">c = {fmt(c)}</text>
      <text x={(ax + footX) / 2 + 6} y={(ay + footY) / 2} fontSize="12" fontWeight="800" fill="#3f9e8d">h = {fmt(h)}</text>
      <text x={ax + 8} y={ay - 12} fontSize="14" fontWeight="800" fill="#2f2a26">90°</text>
    </Svg>
  );
}

const STAGES: Record<SimType, (props: { p: Params }) => ReactElement> = {
  "force-motion": ForceMotion,
  buoyancy: Buoyancy,
  "ohm-law": OhmLaw,
  "convex-lens": ConvexLens,
  identities: Identities,
  "linear-equation": LinearEquation,
  "linear-function": LinearFunction,
  "right-triangle": RightTriangle,
};

interface SimStageProps {
  type: SimType;
  title: string;
  params: Params;
}

export function SimStage({ type, title, params }: SimStageProps) {
  const Stage = STAGES[type];
  const result = computeSimResult(type, params);
  return (
    <SimFrame title={title} subtitle={result.headline}>
      <Stage p={params} />
    </SimFrame>
  );
}
