"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/data";
import { useLang } from "@/lib/i18n";

function Cursor3D({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 130 150"
      overflow="visible"
      className={className}
      animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="cur" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--cursor-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--cursor-b)" }} />
        </linearGradient>
        <filter id="curShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="4" dy="8" stdDeviation="5" floodColor="#000" floodOpacity=".28" />
        </filter>
      </defs>
      <g filter="url(#curShadow)">
        <path
          d="M14 8 108 62 66 76 90 126 68 136 44 86 14 114Z"
          style={{ fill: "var(--cursor-halo)", stroke: "var(--cursor-halo)" }}
          strokeWidth="14"
          strokeLinejoin="round"
        />
        <path
          d="M14 8 108 62 66 76 90 126 68 136 44 86 14 114Z"
          fill="url(#cur)"
          stroke="url(#cur)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>
    </motion.svg>
  );
}

function BigHand({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      style={{ fill: "var(--bg)", stroke: "var(--ink)" }}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ rotate: 8 }}
      animate={{ rotate: [8, 14, 8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="m9.6 12.4-2.9-7.3a1.45 1.45 0 0 1 2.7-1.1l2.6 6.6" />
      <path d="m12.3 10.6 2.5-6.6a1.45 1.45 0 0 1 2.7 1l-2.1 6.9" />
      <path d="M9.6 12.4C7.6 13 6.7 14.5 7.1 16.4l.6 2.4a3.6 3.6 0 0 0 3.5 2.7h3.3a3.6 3.6 0 0 0 3.5-3l.5-4c.2-1.4-.8-2.5-2.1-2.5h-.9Z" />
      <path d="M7.6 13.3 6 12.1a1.3 1.3 0 0 0-1.9 1.8l2.2 2.7" />
    </motion.svg>
  );
}

function CopyEmail() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(SITE.email).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        });
      }}
      className="mt-5 text-[clamp(1rem,1.5vw,1.25rem)] font-light underline-offset-4 hover:underline"
    >
      {copied ? t("Copied to clipboard ✓", "Copiado ✓") : `${SITE.email} · ${t("copy", "copiar")}`}
    </button>
  );
}

export default function FinalCTA() {
  const { t } = useLang();
  return (
    <section
      id="contact"
      className="relative overflow-hidden px-4 pb-40 pt-16 text-center md:pb-56 md:pt-28"
    >
      <Reveal>
        <h2 className="display-tight relative mx-auto max-w-[1300px] whitespace-nowrap text-[min(8.2vw,9.2rem)] md:text-[min(9vw,9.2rem)]">
          <span className="relative inline-block">
            {t("Interested in", "Vamos construir")}
            <BigHand className="absolute -right-[1.25em] -top-[0.78em] h-[1.5em] w-[1.5em]" />
          </span>
          <br />
          {t("Working together?", "algo juntos?")}
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="relative mx-auto mt-10 w-fit">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(t("Let's work together", "Vamos trabalhar juntos"))}`}
            className="rounded-full bg-ink px-8 py-4 text-[clamp(1rem,1.5vw,1.25rem)] font-medium text-bg transition-transform hover:scale-[1.04]"
          >
            {t("Let's talk →", "Vamos conversar →")}
          </a>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink px-8 py-4 text-[clamp(1rem,1.5vw,1.25rem)] font-medium transition-colors hover:bg-ink hover:text-bg"
          >
            LinkedIn
          </a>
        </div>
        <CopyEmail />
        <Cursor3D className="pointer-events-none absolute -right-[clamp(70px,9vw,130px)] top-[55%] h-[clamp(64px,8vw,110px)] w-[clamp(56px,7vw,96px)]" />
      </Reveal>
    </section>
  );
}
