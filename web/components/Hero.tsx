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
        Clean code que{" "}
        <span className="font-semibold text-accent">escala</span>: back-end simples de manter,
        pronto pra crescer.
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
          <h1 className="relative m-0">
            <Word i={0}>
              <span className="dotmatrix block text-[1.22em] leading-[0.95] text-ink-soft">
                Back-end
              </span>
            </Word>

            {/* AWS mark, spinning above the B — transparent, aws text + smile only */}
            <motion.span
              aria-hidden
              className="absolute -top-[0.3em] left-[-0.02em] h-[0.46em] w-[0.46em] text-ink"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              <motion.svg
                viewBox="0 0 100 100"
                className="h-full w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              >
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  fontFamily="Archivo, sans-serif"
                  fontWeight="800"
                  fontSize="46"
                  fill="currentColor"
                  letterSpacing="-1.5"
                >
                  aws
                </text>
                <path
                  d="M18 74 Q50 90 82 74"
                  stroke="#ff9900"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M72 68 L84 73 L79 85"
                  stroke="#ff9900"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </motion.svg>
            </motion.span>
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
                src={SITE.cartoon}
                alt="Rodrigo Scharp, cartoon portrait"
                fill
                sizes="260px"
                className="object-cover"
              />
            </span>
          </Word>
          <Word i={6}>NEER</Word>

          {/* Java mark (official Devicon), spinning below the first E of ENGINEER */}
          <motion.span
            aria-hidden
            className="absolute bottom-[-0.34em] left-[-0.02em] h-[0.46em] w-[0.46em]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + 4 * 0.12, ease }}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              className="h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            >
              <path
                fill="#0074BD"
                d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"
              />
              <path
                fill="#EA2D2E"
                d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"
              />
              <path
                fill="#0074BD"
                d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"
              />
              <path
                fill="#EA2D2E"
                d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"
              />
              <path
                fill="#0074BD"
                d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"
              />
            </motion.svg>
          </motion.span>

          {/* IntelliJ IDEA mark, spinning where the asterisk used to be */}
          <motion.span
            aria-hidden
            className="absolute -right-[0.34em] bottom-[-0.08em] h-[0.4em] w-[0.4em]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + 6 * 0.12, ease }}
          >
          <motion.svg
            viewBox="0 0 100 100"
            className="h-full w-full drop-shadow-[0_6px_6px_rgba(3,3,9,.3)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          >
            <defs>
              <linearGradient id="ij-a" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fe315d" />
                <stop offset="0.55" stopColor="#f97a12" />
                <stop offset="1" stopColor="#ffd83a" />
              </linearGradient>
              <linearGradient id="ij-b" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#087cfa" />
                <stop offset="0.6" stopColor="#7c59f0" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fe315d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="8" fill="url(#ij-a)" />
            <rect width="100" height="100" rx="8" fill="url(#ij-b)" />
            <rect x="15" y="15" width="70" height="70" fill="#000" />
            <rect x="22" y="26" width="9" height="30" fill="#fff" />
            <path
              d="M59 26V49a10 10 0 0 1-10 10h-3"
              fill="none"
              stroke="#fff"
              strokeWidth="9"
            />
            <rect x="22" y="68" width="28" height="6" fill="#fff" />
          </motion.svg>
          </motion.span>
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
