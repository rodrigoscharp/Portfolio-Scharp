"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { ArchEdge, ArchNode } from "@/lib/caseStudies";

const W = 176;
const H = 74;

const KIND: Record<NonNullable<ArchNode["kind"]>, string> = {
  client: "var(--paper)",
  edge: "color-mix(in srgb, var(--accent-2) 14%, var(--paper))",
  core: "color-mix(in srgb, var(--accent) 16%, var(--paper))",
  data: "color-mix(in srgb, #2f8f5b 16%, var(--paper))",
  external: "color-mix(in srgb, var(--ink) 6%, var(--paper))",
  job: "color-mix(in srgb, #e8b64a 22%, var(--paper))",
};

/* Point on the border of a node's box, facing the other node. */
function port(n: ArchNode, toward: ArchNode) {
  const cx = n.x + W / 2;
  const cy = n.y + H / 2;
  const dx = toward.x + W / 2 - cx;
  const dy = toward.y + H / 2 - cy;
  const s = Math.min(Math.abs((W / 2) / (dx || 1e-6)), Math.abs((H / 2) / (dy || 1e-6)));
  return { x: cx + dx * s, y: cy + dy * s };
}

/* Architecture diagram: hover or tap a box to light up what it talks to and
   read what it does. Data flows along the edges as moving dashes. */
export default function ArchDiagram({ nodes, edges, caption }: { nodes: ArchNode[]; edges: ArchEdge[]; caption: string }) {
  const reduce = useReducedMotion();
  const { t } = useLang();
  const [active, setActive] = useState<string | null>(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const linked = new Set(
    active ? edges.flatMap((e) => (e.from === active || e.to === active ? [e.from, e.to] : [])) : [],
  );
  const current = active ? byId[active] : null;

  return (
    <figure className="overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink">
      <div className="grid lg:grid-cols-[1fr_minmax(260px,320px)]">
        <div className="relative overflow-x-auto bg-paper">
          <svg viewBox="0 0 1006 474" className="block min-w-[720px]" role="img" aria-label={caption}>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 10 5 0 10z" fill="currentColor" />
              </marker>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--ink)" opacity=".12" />
              </pattern>
            </defs>
            <rect width="1006" height="474" fill="url(#grid)" />

            {edges.map((e, k) => {
              const a = byId[e.from];
              const b = byId[e.to];
              const p = port(a, b);
              const q = port(b, a);
              const on = active !== null && (e.from === active || e.to === active);
              const dim = active !== null && !on;
              return (
                <g key={k} className="text-ink" style={{ opacity: dim ? 0.15 : 1, transition: "opacity .25s" }}>
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={q.x}
                    y2={q.y}
                    stroke="currentColor"
                    strokeWidth={on ? 2.4 : 1.4}
                    strokeDasharray={e.dashed ? "6 6" : undefined}
                    markerEnd="url(#arrow)"
                  />
                  {!reduce && (
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={q.x}
                      y2={q.y}
                      stroke="var(--accent)"
                      strokeWidth={on ? 3 : 2}
                      strokeDasharray="4 22"
                      strokeLinecap="round"
                      className="arch-flow"
                    />
                  )}
                  {e.label && (
                    <text
                      x={(p.x + q.x) / 2}
                      y={(p.y + q.y) / 2 - 7}
                      textAnchor="middle"
                      className="fill-ink"
                      style={{ fontSize: 11, paintOrder: "stroke", stroke: "var(--paper)", strokeWidth: 5 }}
                    >
                      {e.label}
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((n) => {
              const on = n.id === active || linked.has(n.id);
              const dim = active !== null && !on;
              return (
                <g
                  key={n.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${n.label}: ${n.detail}`}
                  onMouseEnter={() => setActive(n.id)}
                  onFocus={() => setActive(n.id)}
                  onClick={() => setActive(n.id)}
                  className="cursor-pointer outline-none"
                  data-cursor="hover"
                  style={{ opacity: dim ? 0.3 : 1, transition: "opacity .25s" }}
                >
                  <rect
                    x={n.x}
                    y={n.y}
                    width={W}
                    height={H}
                    rx={14}
                    fill={KIND[n.kind ?? "core"]}
                    stroke="var(--ink)"
                    strokeWidth={n.id === active ? 2.6 : 1.2}
                  />
                  <text x={n.x + 14} y={n.y + 31} className="fill-ink" style={{ fontSize: 15.5, fontWeight: 700 }}>
                    {n.label}
                  </text>
                  <text x={n.x + 14} y={n.y + 53} className="fill-ink" style={{ fontSize: 11.5, opacity: 0.65 }}>
                    {n.sub}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="pointer-events-none absolute bottom-3 left-4 text-[11px] uppercase tracking-[0.12em] text-ink-soft lg:hidden">
            {t("Swipe sideways · tap a box", "Arraste para o lado · toque num bloco")}
          </p>
        </div>

        <div className="border-t border-ink bg-bg p-[clamp(16px,2vw,28px)] lg:border-l lg:border-t-0" aria-live="polite">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">{current.sub}</p>
                <h4 className="mt-1 text-[22px] font-bold leading-tight">{current.label}</h4>
                <p className="mt-3 text-[15px] font-light leading-relaxed">{current.detail}</p>
              </motion.div>
            ) : (
              <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[15px] font-light leading-relaxed">
                {caption}
                <span className="mt-3 block text-[12px] uppercase tracking-[0.12em] text-ink-soft">
                  {t("Hover or tap any box to see what it does.", "Passe o mouse ou toque em um bloco para ver o que ele faz.")}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
