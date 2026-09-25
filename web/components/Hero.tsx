"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Toggle3D from "@/components/Toggle3D";
import Dots from "@/components/Dots";
import { SITE } from "@/lib/data";

const ease = [0.22, 1, 0.36, 1] as const;

function Word({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
    >
      {children}
    </motion.span>
  );
}

function HeroCard() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24, rotate: 3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease }}
      className="w-[min(24vw,300px)] shrink-0 rounded-2xl bg-paper/70 p-2 text-[14px] shadow-[0_10px_30px_-12px_rgba(3,3,9,.25)] ring-1 ring-ink/5 backdrop-blur max-md:w-full"
    >
      <div className="relative aspect-[16/8] overflow-hidden rounded-xl">
        <Image
          src={SITE.portrait}
          alt=""
          fill
          sizes="640px"
          className="object-cover object-[52%_25%]"
        />
      </div>
      <p className="px-2 pb-2 pt-3 text-[13px] leading-snug text-ink-soft">
        Sistemas que <span className="font-semibold text-accent">aguentam</span>{" "}
        o mundo real, do Litoral Norte pro resto do Brasil.
      </p>
    </motion.aside>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pb-16 pt-28 md:px-12"
    >
      <Dots className="opacity-70" />

      <div className="relative w-full max-w-[1240px] text-[min(11.2vw,9.4rem)] md:text-[min(10.2vw,9.4rem)]">
        {/* line 1 — dot-matrix */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="m-0">
            <Word i={0}>
              <span className="dotmatrix block text-[1.22em] leading-[0.95] text-ink-soft">
                Back-end
              </span>
            </Word>
          </h1>

          <div className="hidden md:block"><HeroCard /></div>
        </div>

        {/* line 2 — SOFTWARE with a live 3D switch as the O */}
        <div className="display flex items-center whitespace-nowrap text-accent">
          <Word i={1}>S</Word>
          <Word i={2}>
            <Toggle3D />
          </Word>
          <Word i={3}>FTWARE</Word>
        </div>

        {/* line 3 — ENGINEER with a photo capsule as the I */}
        <div className="display relative inline-flex items-center whitespace-nowrap text-ink-soft">
          <Word i={4}>ENG</Word>
          <Word i={5}>
            <span className="relative mx-[0.06em] inline-block h-[0.76em] w-[0.42em] overflow-hidden rounded-full align-baseline">
              <Image
                src={SITE.capsule}
                alt="Rodrigo Scharp"
                fill
                sizes="260px"
                className="object-cover"
              />
            </span>
          </Word>
          <Word i={6}>NEER</Word>

          <motion.svg
            aria-hidden
            viewBox="0 0 100 100"
            className="absolute -right-[0.3em] bottom-[-0.06em] h-[0.36em] w-[0.36em] drop-shadow-[0_6px_6px_rgba(160,60,10,.35)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          >
            <defs>
              <linearGradient id="ast" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff8a4d" />
                <stop offset="1" stopColor="#e2451a" />
              </linearGradient>
            </defs>
            <g stroke="url(#ast)" strokeWidth="15" strokeLinecap="round">
              <path d="M50 8V92" />
              <path d="M13.6 29 86.4 71" />
              <path d="M13.6 71 86.4 29" />
            </g>
          </motion.svg>
        </div>

        <div className="mt-8 text-base md:hidden">
          <HeroCard />
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-light uppercase tracking-[0.9px]">
        Scroll ↓
      </span>
    </section>
  );
}
