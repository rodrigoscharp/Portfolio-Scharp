"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { METRICS } from "@/lib/data";
import { METRICS_PT } from "@/lib/data.pt";
import { useL, useLang } from "@/lib/i18n";

/* Counts from 0 to the value the first time it is seen. */
function Count({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (v: number) => `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`;

  // Writes the text straight to the node: no React render per animation frame.
  useEffect(() => {
    if (!seen || reduce) return;
    const c = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt(v);
      },
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, reduce, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {fmt(reduce ? to : 0)}
    </span>
  );
}

export default function Metrics() {
  const { t } = useLang();
  const metrics = useL(METRICS, METRICS_PT);
  return (
    <section id="impact" aria-label={t("Impact in numbers", "Impacto em números")} className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)] pb-24 md:pb-36">
      <ul className="grid grid-cols-2 overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink md:grid-cols-5">
        {metrics.map((m, i) => (
          <li
            key={m.tag}
            className={`flex min-w-0 flex-col justify-between gap-6 [container-type:inline-size] p-[clamp(16px,2vw,30px)] ${
              i > 0 ? "border-ink md:border-l" : ""
            } ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""} ${
              i === metrics.length - 1 ? "col-span-2 md:col-span-1" : ""
            }`}
          >
            <p className="text-[clamp(10px,0.85vw,12px)] font-medium uppercase tracking-[0.12em] text-ink-soft">
              {m.tag}
            </p>
            <div>
              <p className="display text-[min(19cqi,4.6rem)] leading-none">
                <Count to={m.value} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-2 max-w-[16em] text-[clamp(12px,1vw,15px)] font-light leading-snug">{m.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
