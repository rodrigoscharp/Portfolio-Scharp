"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/Icons";
import { CASES, type Case, type Slide } from "@/lib/data";

const SLIDE_MS = 4200;

function ReadMarquee({ text }: { text: string }) {
  const items = Array.from({ length: 16 }, (_, i) => (
    <span key={i} className="mx-[0.7em] whitespace-nowrap">
      ✦ {text}
    </span>
  ));
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 z-20 h-[clamp(9px,1.25vw,18px)] overflow-hidden bg-white/30 text-[clamp(5px,0.83vw,12px)] font-light leading-[clamp(9px,1.25vw,18px)] text-white/85 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
    >
      <div className="marquee-track [animation-duration:36s]">
        <div className="flex">{items}</div>
        <div className="flex">{items}</div>
      </div>
    </div>
  );
}

function SlideView({ slide, full }: { slide: Slide; full: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: slide.bg }}>
      {slide.kind === "art" && (
        <Image src={slide.image} alt="" fill sizes="(min-width:768px) 700px, 60vw" className="object-cover" />
      )}

      {slide.kind === "laptop" && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 rotate-[-2deg] rounded-t-[clamp(6px,1.4vw,20px)] bg-[#0b0b0f] p-[clamp(2px,0.5vw,8px)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ${
            full
              ? "bottom-[-16%] aspect-[16/10] w-[66%]"
              : "bottom-[-10%] aspect-[16/10] w-[88%]"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-t-[clamp(4px,0.9vw,12px)] bg-paper">
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(min-width:768px) 900px, 90vw"
              className="object-cover object-left-top"
            />
          </div>
        </div>
      )}

      {slide.kind === "phone" && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 rotate-[-4deg] rounded-[clamp(12px,2.6vw,38px)] bg-[#0b0b0f] p-[clamp(3px,0.7vw,10px)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] ${
            full ? "bottom-[-22%] aspect-[9/19] h-[104%]" : "bottom-[-14%] aspect-[9/19] h-[92%]"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[clamp(9px,2vw,29px)] bg-paper">
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="(min-width:768px) 320px, 40vw"
              className="object-cover object-top"
            />
          </div>
          <span className="absolute left-1/2 top-[3%] h-[3%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
        </div>
      )}
    </div>
  );
}

function Slideshow({ c, full }: { c: Case; full: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hover, setHover] = useState(false);
  const n = c.slides.length;
  const active = playing && !hover && inView && !reduce && n > 1;

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % n), SLIDE_MS);
    return () => clearInterval(id);
  }, [active, n]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-t-[inherit]"
      style={{ aspectRatio: full ? "2.18 / 1" : "1 / 0.98" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="absolute inset-0 flex"
        animate={{ x: `${-i * 100}%` }}
        transition={{ duration: 0.95, ease: [0.6, 0, 0.18, 1] }}
      >
        {c.slides.map((s, k) => (
          <div key={k} className="relative h-full w-full shrink-0">
            <SlideView slide={s} full={full} />
          </div>
        ))}
      </motion.div>

      <ReadMarquee text={c.read} />

      <div
        className={`absolute bottom-0 left-0 z-10 rounded-tr-[clamp(6px,0.85vw,12px)] bg-black/30 text-white ${
          full
            ? "w-[clamp(96px,16vw,230px)] px-[clamp(8px,1.4vw,20px)] py-[clamp(8px,1.4vw,20px)]"
            : "w-[clamp(84px,32%,208px)] px-[clamp(7px,1.4vw,20px)] py-[clamp(7px,1.4vw,20px)]"
        }`}
      >
        <p className="text-[clamp(5px,0.7vw,10px)] font-light uppercase tracking-[0.9px]">
          {c.soon ? "Status" : "Insights"}
        </p>
        {c.soon ? (
          <div className="mt-[0.4em]">
            <p className="text-[clamp(9px,1.7vw,24px)] font-bold leading-[1.1]">Coming<br className="md:hidden" /> soon</p>
            <p className="text-[clamp(5px,0.85vw,12px)] font-light leading-tight opacity-90">em breve</p>
          </div>
        ) : (
          c.insights.map((m, k) => (
            <div key={k} className={k > 0 ? "mt-[1.1em] hidden md:block" : "mt-[0.3em]"}>
              <p className="text-[clamp(10px,1.7vw,24px)] font-bold leading-[1.15]">{m.value}</p>
              <p className="text-[clamp(5px,0.85vw,12px)] font-light leading-[1.25] opacity-95">
                {m.label}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="absolute bottom-[clamp(6px,0.85vw,12px)] right-[clamp(6px,0.85vw,12px)] z-10 flex items-center gap-[clamp(4px,0.85vw,12px)]">
        {c.live && (
          <a
            href={c.live}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/25 bg-[#3a3a40]/55 px-[clamp(6px,1.05vw,15px)] py-[clamp(3px,0.5vw,7px)] text-[clamp(6px,1.1vw,16px)] font-normal text-white backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
          >
            Live Website
          </a>
        )}
        {n > 1 && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
            className="flex items-center gap-[0.5em] rounded-full bg-white px-[clamp(6px,1.05vw,15px)] py-[clamp(3px,0.5vw,7px)] text-[clamp(6px,1.1vw,16px)] font-normal text-ink transition-transform hover:scale-[1.04]"
          >
            {playing ? "Pause" : "Play"}
            {playing ? (
              <svg viewBox="0 0 12 12" className="h-[0.75em] w-[0.75em]" fill="currentColor">
                <rect x="2" y="1" width="3" height="10" rx="0.6" />
                <rect x="7" y="1" width="3" height="10" rx="0.6" />
              </svg>
            ) : (
              <svg viewBox="0 0 12 12" className="h-[0.75em] w-[0.75em]" fill="currentColor">
                <path d="M2.5 1.2v9.6L10.6 6z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function CaseCard({ c, i }: { c: Case; i: number }) {
  const full = c.layout === "full";
  return (
    <Reveal delay={(i % 2) * 0.08} className={full ? "col-span-2" : ""}>
      <article className="flex h-full flex-col overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink bg-bg">
        <Slideshow c={c} full={full} />

        <div className="relative flex flex-1 flex-col px-[clamp(8px,2.1vw,30px)] pb-[clamp(8px,1.6vw,22px)] pt-[clamp(7px,1.5vw,22px)]">
          <p className="text-[clamp(5px,0.83vw,12px)] font-medium uppercase tracking-[-0.05em]">
            Case Study {c.n}
          </p>
          <h3
            className={`mt-[0.5em] font-light leading-[1.22] tracking-[-0.01em] ${
              full
                ? "max-w-[26em] text-[clamp(11px,2.4vw,34px)]"
                : "text-[clamp(9px,2.4vw,34px)]"
            }`}
          >
            {c.headline.map((h, k) =>
              h.bold ? (
                <strong key={k} className="font-bold">
                  {h.text}
                </strong>
              ) : (
                <span key={k}>{h.text}</span>
              ),
            )}
          </h3>
          <ul className="mt-[0.9em] flex flex-wrap gap-x-[1.1em] text-[clamp(5px,0.83vw,12px)] font-normal uppercase">
            {c.tags.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>

          {c.caseHref && (
            <a
              href={c.caseHref}
              className="mt-[1em] inline-flex items-center gap-[0.5em] self-end rounded-full bg-black px-[clamp(8px,1.6vw,22px)] py-[clamp(4px,0.75vw,11px)] text-[clamp(6px,1.1vw,16px)] font-light text-paper transition-transform hover:scale-[1.03] md:absolute md:bottom-[clamp(8px,1.6vw,22px)] md:right-[clamp(8px,1.6vw,22px)] md:mt-0"
            >
              View Case Study <ArrowUpRight className="h-[1em] w-[1em]" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)] pb-24 md:pb-40">
      <Reveal>
        <h2 className="display mb-[clamp(10px,2vw,28px)] whitespace-nowrap text-[clamp(2.6rem,10.4vw,10.4rem)]">
          Featured Work
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-[clamp(8px,2.6vw,38px)]">
        {CASES.map((c, i) => (
          <CaseCard key={c.slug} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
