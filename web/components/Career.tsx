"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { CAREER } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sticker on a current role: tilted, gently floating, with a live dot. */
function NowSticker({ still }: { still: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute -right-9 -top-6 z-20"
      animate={still ? undefined : { y: [0, -3, 0], rotate: [8, 5, 8] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      style={{ rotate: 8 }}
    >
      <span className="flex items-center gap-1.5 rounded-xl border-2 border-bg bg-accent py-1 pl-2.5 pr-3 font-serif text-[19px] italic leading-none text-white shadow-[0_6px_14px_-6px_rgba(253,96,26,0.9)]">
        <span className="relative grid size-2 place-items-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white" />
          <span className="relative size-2 rounded-full bg-white" />
        </span>
        now
      </span>
    </motion.span>
  );
}

/** Sonar rings behind a current role's logo tile. */
function Sonar({ still }: { still: boolean }) {
  if (still) return null;
  return (
    <>
      {[0, 1.1].map((delay) => (
        <motion.span
          key={delay}
          aria-hidden
          className="absolute inset-0 rounded-2xl border-2 border-accent"
          initial={{ scale: 1, opacity: 0 }}
          animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
          transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </>
  );
}

/**
 * Hand-drawn arrow arcing from one logo to the next, with a loop in the
 * middle. It draws itself the first time it scrolls into view.
 */
function PromotedArrow({ lit }: { lit: boolean }) {
  const color = lit ? "var(--accent)" : "color-mix(in srgb, var(--ink) 35%, transparent)";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {/* Fixed-size SVG centered on the segment: uniform scale keeps pathLength exact. */}
      <svg
        viewBox="0 0 150 64"
        width="150"
        height="64"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 overflow-visible"
      >
        <motion.path
          d="M14 62 C 16 36, 32 18, 56 17 C 74 16, 80 31, 69 35 C 57 39, 55 21, 78 12 C 102 3, 128 16, 134 58"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.3, delay: 0.5, ease: [0.65, 0, 0.35, 1] }}
          style={{ transition: "stroke 0.3s" }}
        />
        <motion.path
          d="M126 51 L 134 60 L 141 49"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.2, delay: 1.75 }}
          style={{ transition: "stroke 0.3s" }}
        />
      </svg>
      <motion.span
        className="absolute left-1/2 top-[-14px] -translate-x-1/2 whitespace-nowrap font-serif text-[17px] italic leading-none transition-colors duration-300 md:text-[19px]"
        style={{ color, rotate: -6 }}
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 1.6, ease: EASE }}
      >
        promoted!
      </motion.span>
    </span>
  );
}

/**
 * Horizontal career timeline: company logos sit on a track, oldest to newest.
 * Selecting a stop fills the track up to it and shows its details below.
 * On phones the track scrolls sideways and keeps the selected stop in view.
 */
export default function Career() {
  const last = CAREER.length - 1;
  const [active, setActive] = useState(last);
  const stops = useRef<(HTMLButtonElement | null)[]>([]);
  const c = CAREER[active];
  const still = !!useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Center the selected stop on the scrollable phone track. Scrolls only the
  // track, never the page; the first run jumps straight to the latest stop.
  useEffect(() => {
    const box = track.current;
    const el = stops.current[active];
    if (!box || !el) return;
    const left = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
    box.scrollTo({ left, behavior: first.current ? "auto" : "smooth" });
    first.current = false;
  }, [active]);

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = Math.min(last, Math.max(0, active + step));
    setActive(next);
    stops.current[next]?.focus();
  };

  // Track fill runs from the first stop's center to the active stop's center.
  const fill = last === 0 ? 0 : active / last;
  const edge = `${50 / CAREER.length}%`;

  return (
    <section className="mx-auto max-w-[1080px] px-5 pb-20 md:px-8 md:pb-28">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.05em]">
            Career
          </h2>
          <span className="pb-1 text-[10px] font-light uppercase tracking-[0.9px] text-ink-soft">
            2023 - Now
          </span>
        </div>
      </Reveal>

      <Reveal>
        <div
          ref={track}
          className="-mx-5 overflow-x-auto px-5 [mask-image:linear-gradient(90deg,transparent,#000_20px,#000_calc(100%-20px),transparent)] [scrollbar-width:none] md:[mask-image:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="tablist"
            aria-label="Career timeline"
            onKeyDown={onKey}
            className="relative grid min-w-[820px] pt-24 md:min-w-0"
            style={{ gridTemplateColumns: `repeat(${CAREER.length}, minmax(0, 1fr))` }}
          >
            {/* Track between the first and last logo centers. */}
            <span aria-hidden className="absolute top-[128px] h-px bg-ink/15" style={{ left: edge, right: edge }} />
            <span aria-hidden className="absolute top-[127px] h-[3px]" style={{ left: edge, right: edge }}>
              <motion.span
                className="block h-full origin-left rounded-full bg-accent"
                initial={false}
                animate={{ scaleX: fill }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </span>

            {/* Drawn "promoted" arrow over the segment leading into a promotion. */}
            {CAREER.map((s, i) =>
              s.tag === "Promoted" && i > 0 ? (
                <span
                  key={`promo-${i}`}
                  className="absolute top-[30px] h-[64px]"
                  style={{ left: `${((i - 0.5) / CAREER.length) * 100}%`, width: `${100 / CAREER.length}%` }}
                >
                  <PromotedArrow lit={i <= active} />
                </span>
              ) : null,
            )}

            {CAREER.map((s, i) => {
              const on = i === active;
              const reached = i <= active;
              return (
                <button
                  key={`${s.company}-${s.role}`}
                  ref={(el) => {
                    stops.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="career-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group relative flex cursor-pointer flex-col items-center px-1 text-center outline-none"
                >
                  <span className="relative">
                  {s.current && <Sonar still={still} />}
                  <motion.span
                    animate={{ scale: on ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className={`relative grid size-[64px] place-items-center rounded-2xl border shadow-[0_6px_18px_-8px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg ${
                      on ? "border-accent ring-2 ring-accent/25" : reached ? "border-accent/50" : "border-ink/15"
                    }`}
                    style={{ background: s.logoBg }}
                  >
                    <span className="relative size-full overflow-hidden rounded-[15px]">
                      <Image
                        src={s.logo}
                        alt={`${s.company} logo`}
                        fill
                        sizes="64px"
                        className={`object-contain p-2 transition-[filter,opacity] duration-300 ${
                          reached ? "" : "opacity-70 grayscale"
                        } group-hover:opacity-100 group-hover:grayscale-0`}
                      />
                    </span>
                  </motion.span>
                  {s.current && <NowSticker still={still} />}
                  </span>

                  <span
                    className={`mt-4 text-[11px] uppercase tracking-[0.08em] transition-colors md:text-[12px] ${
                      on ? "font-semibold text-accent" : "font-light text-ink-soft"
                    }`}
                  >
                    {s.start}
                  </span>
                  <span className={`mt-0.5 text-[14px] leading-tight md:text-[16px] ${on ? "font-medium" : "font-light"}`}>
                    {s.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>

      <div id="career-panel" role="tabpanel" aria-live="polite" className="mt-8 border-t border-ink/10 pt-7 md:mt-10 md:pt-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid gap-2 md:grid-cols-[38%_1fr] md:gap-0"
          >
            <span className="text-[13px] font-light text-ink-soft md:text-[19px]">{c.dates}</span>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-[19px] font-medium leading-snug md:text-[24px]">{c.role}</h3>
                {c.current && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-white">
                    Now
                  </span>
                )}
                {c.tag && (
                  <span className="rounded-full border border-ink/20 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-ink-soft">
                    {c.tag}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[14px] font-medium text-accent md:text-[16px]">{c.company}</p>
              <p className="mt-3 max-w-[560px] text-[14px] font-light leading-relaxed text-ink-soft md:text-[16px]">
                {c.note}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
