"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Reveal from "@/components/Reveal";
import { ROWS, type Row } from "@/lib/data";

const cta: Record<Row["cta"], { label: string; cls: string }> = {
  case: { label: "Case Study", cls: "bg-[#eb6c34]" },
  live: { label: "Website Live", cls: "bg-black" },
  repo: { label: "View Repo", cls: "bg-accent-2" },
};

export default function Timeline() {
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  return (
    <section id="timeline" className="px-5 pb-28 md:px-8 md:pb-44">
      <Reveal>
        <h2 className="mb-10 font-display text-[clamp(2.8rem,6vw,5.4rem)] font-extrabold leading-none tracking-[-0.05em] [font-stretch:100%] md:mb-14">
          Timeline
        </h2>
      </Reveal>

      <div
        onMouseMove={(e) => {
          x.set(e.clientX + 24);
          y.set(e.clientY - 90);
        }}
        onMouseLeave={() => setHover(null)}
      >
        <div className="hidden grid-cols-[42%_1fr_auto] pb-3 text-[12px] font-bold uppercase md:grid">
          <span>Year</span>
          <span>Projects</span>
          <span className="invisible">Action</span>
        </div>

        <ul className="border-t border-ink md:border-t-0">
          {ROWS.map((r, i) => (
            <li
              key={r.title}
              onMouseEnter={() => setHover(i)}
              className="border-b border-ink"
            >
              <motion.div
                animate={{ x: hover === i ? 14 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-5 md:grid-cols-[42%_1fr_auto] md:py-[1.35rem]"
              >
                <span className="order-1 text-[13px] font-semibold text-ink-soft md:order-none md:text-[20px] md:font-semibold">
                  {r.year}
                </span>
                <span className="order-3 col-span-2 text-[19px] font-normal leading-snug md:order-none md:col-span-1 md:text-[22px]">
                  {r.title}
                </span>
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`order-2 justify-self-end rounded-full px-5 py-2.5 text-[13px] tracking-[0.06em] text-white transition-transform duration-200 hover:scale-[1.04] md:order-none md:px-7 md:py-3 ${cta[r.cta].cls}`}
                >
                  {cta[r.cta].label}
                </a>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {hover !== null && ROWS[hover].image && (
          <motion.div
            key="preview"
            aria-hidden
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            style={{ x: sx, y: sy }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[170px] w-[270px] overflow-hidden rounded-xl border border-ink bg-paper shadow-xl md:block"
          >
            <Image
              src={ROWS[hover].image!}
              alt=""
              fill
              sizes="270px"
              className="object-cover object-left-top"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
