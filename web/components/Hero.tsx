"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Toggle3D from "@/components/Toggle3D";
import SystemMap from "@/components/SystemMap";
import XRay from "@/components/XRay";
import { SITE } from "@/lib/data";
import { INTRO_SECONDS, introPending, onIntroStart } from "@/lib/intro";
import { useLang } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as const;

/* The hero is drawn twice from this one layout: the "skin" everyone sees, and
   the "x-ray" shown inside the lens, where the same page appears as a
   blueprint with its markup. Same boxes, so the two layers line up exactly. */

/* Entrances wait for the opening animation when it is about to play. */
const introDelay = () => (introPending() ? INTRO_SECONDS - 0.35 : 0);

function Word({ children, i, xray }: { children: React.ReactNode; i: number; xray: boolean }) {
  if (xray) return <span className="inline-block">{children}</span>;
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: introDelay() + 0.1 + i * 0.08, ease }}
    >
      {children}
    </motion.span>
  );
}

/* Small mono tag that only exists in the x-ray layer. */
function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`pointer-events-none absolute whitespace-nowrap font-mono text-[11px] font-normal normal-case tracking-normal text-[#7fd3c4] ${className}`}>
      {children}
    </span>
  );
}

const ROLES = [
  { logo: "/images/logos/ubatuba.png", bg: "#f7f7f7", role: ["Tech Lead", "Tech Lead"], org: ["Municipality of Ubatuba", "Prefeitura de Ubatuba"] },
  { logo: "/images/logos/muno.png", bg: "#e6e5e0", role: ["Founder & CTO", "Fundador & CTO"], org: ["Muno", "Muno"] },
] as const;

function NowCard({ xray }: { xray: boolean }) {
  const { t } = useLang();
  if (xray) {
    return (
      <div className="relative w-full rounded-2xl border border-dashed border-[#ff7a3a]/70 p-4 font-mono text-[12px] leading-relaxed text-[#e9e4d8] md:w-[300px]">
        <Tag className="-top-5 left-0">{"<aside class=\"now\">"}</Tag>
        <span className="text-[#7d7a72]">{"// GET /api/rodrigo/now"}</span>
        <br />
        {"{"}
        <br />
        &nbsp;&nbsp;<span className="text-[#b98bff]">&quot;roles&quot;</span>: [
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#b9e27a]">&quot;Tech Lead @ Ubatuba&quot;</span>,
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#b9e27a]">&quot;Founder &amp; CTO @ Muno&quot;</span>
        <br />
        &nbsp;&nbsp;],
        <br />
        &nbsp;&nbsp;<span className="text-[#b98bff]">&quot;restaurants&quot;</span>: <span className="text-[#ffd25e]">120</span>,
        <br />
        &nbsp;&nbsp;<span className="text-[#b98bff]">&quot;status&quot;</span>: <span className="text-[#b9e27a]">&quot;operational&quot;</span>
        <br />
        {"}"}
      </div>
    );
  }
  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: introDelay() + 0.7, ease }}
      className="w-full rounded-2xl bg-paper/80 p-4 text-[14px] shadow-[0_10px_30px_-12px_rgba(3,3,9,.25)] ring-1 ring-ink/5 md:w-[300px]"
    >
      <p className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-ink-soft">
        {t("Now", "Agora")}
        <span className="flex items-center gap-1.5 font-mono normal-case tracking-normal">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4be08a]" />
          {t("all systems operational", "todos os sistemas operando")}
        </span>
      </p>
      <ul className="mt-3 space-y-3">
        {ROLES.map((r) => (
          <li key={r.org[0]} className="flex items-center gap-3">
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg ring-1 ring-ink/10" style={{ background: r.bg }}>
              <Image src={r.logo} alt="" fill sizes="36px" className="object-contain p-1" />
            </span>
            <span className="leading-tight">
              <span className="block font-semibold">{t(r.role[0], r.role[1])}</span>
              <span className="block text-[12px] text-ink-soft">{t(r.org[0], r.org[1])}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/work/muno"
        className="mt-3 flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-[13px] text-bg transition-transform hover:scale-[1.02]"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4be08a] opacity-70 motion-reduce:hidden" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4be08a]" />
        </span>
        <span>
          <strong className="font-semibold">{t("120+ restaurants", "120+ restaurantes")}</strong>{" "}
          {t("live on Muno", "no ar com o Muno")}
        </span>
      </Link>
    </motion.aside>
  );
}

export function HeroLayout({ xray = false }: { xray?: boolean }) {
  const { t, lang } = useLang();
  /* In the x-ray the letters lose their fill and keep only an orange outline. */
  const outline = xray ? { color: "transparent", WebkitTextStroke: "1.5px #ff7a3a" } : undefined;
  const fade = (delay: number) =>
    xray
      ? {}
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: introDelay() + delay, ease } };

  return (
    <div className="relative mx-auto flex min-h-[100svh] w-full max-w-[1320px] flex-col justify-center px-5 pb-20 pt-28 md:px-12">
      {/* eyebrow */}
      <motion.p
        {...fade(0.05)}
        className={`relative flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[clamp(11px,1vw,14px)] uppercase tracking-[0.16em] ${
          xray ? "text-[#7d7a72]" : "text-ink-soft"
        }`}
      >
        {xray && <Tag className="-top-5 left-0">{"<p class=\"eyebrow\">"}</Tag>}
        <span className={xray ? "text-[#e9e4d8]" : "text-ink"}>{t("Software engineer", "Engenheiro de software")}</span>
      </motion.p>

      {/* the name */}
      <h1
        className={`display relative mt-[0.18em] text-[min(12.6vw,10.6rem)] leading-[0.84] ${xray ? "" : "text-ink"}`}
        aria-label={xray ? undefined : "Rodrigo Scharp"}
      >
        {xray && <Tag className="-top-4 left-0 md:-top-6">{"<h1 class=\"display\" font-size=\"10.6rem\">"}</Tag>}
        <span className="flex items-center whitespace-nowrap" style={outline} aria-hidden>
          <Word i={0} xray={xray}>R</Word>
          <Word i={1} xray={xray}>
            {xray ? (
              <span className="relative mx-[0.04em] block h-[0.74em] w-[1.6em] -translate-y-[0.045em] rounded-full border-[1.5px] border-[#ff7a3a]">
                <span className="absolute left-[0.1em] top-[0.09em] h-[0.56em] w-[0.56em] rounded-full border-[1.5px] border-[#ff7a3a]" />
                <Tag className="left-[1.9em] top-1/2 -translate-y-1/2 text-[10px] text-[#ffd25e]">{"<Toggle3D theme />"}</Tag>
              </span>
            ) : (
              <Toggle3D />
            )}
          </Word>
          <Word i={2} xray={xray}>DR</Word>
          <Word i={3} xray={xray}>
            <span
              className={`relative mx-[0.05em] inline-block h-[0.74em] w-[0.4em] overflow-hidden rounded-full align-baseline ${
                xray ? "border-[1.5px] border-[#ff7a3a]" : ""
              }`}
            >
              {!xray && (
                <Image src={SITE.cartoon} alt="" fill sizes="260px" priority className="object-cover" />
              )}
            </span>
          </Word>
          <Word i={4} xray={xray}>GO</Word>
        </span>
        <span
          className={`flex whitespace-nowrap ${xray ? "" : "text-accent"}`}
          style={outline}
          aria-hidden
        >
          <Word i={5} xray={xray}>SCHARP</Word>
        </span>
      </h1>

      {/* bottom row */}
      <div className="mt-[clamp(20px,3.5vw,48px)] grid items-end gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div>
          <motion.p
            {...fade(0.8)}
            className={`relative max-w-[30em] text-[clamp(17px,1.8vw,26px)] leading-snug tracking-[-0.01em] ${
              xray ? "font-mono text-[clamp(13px,1.3vw,18px)] text-[#7d7a72]" : "font-light"
            }`}
          >
            {xray ? (
              <>
                <Tag className="-top-5 left-0">{"<p class=\"pitch\">"}</Tag>
                <span className="text-[#b98bff]">return</span> products.<span className="text-[#ffd25e]">fromZero</span>()
                .<span className="text-[#ffd25e]">toProduction</span>()
                <br />
                <span className="text-[#7d7a72]">{"// 120+ restaurants · 100k+ citizens · 5 AI agents"}</span>
              </>
            ) : lang === "pt" ? (
              <>
                Levo produtos <strong className="font-semibold">do zero à produção</strong>:{" "}
                <span className="whitespace-nowrap">120+ restaurantes</span>,{" "}
                <span className="whitespace-nowrap">100 mil+ cidadãos</span> e um time de{" "}
                <span className="whitespace-nowrap">5 agentes de IA</span> rodam em sistemas que eu construí.
              </>
            ) : (
              <>
                I take products <strong className="font-semibold">from zero to production</strong>:{" "}
                <span className="whitespace-nowrap">120+ restaurants</span>,{" "}
                <span className="whitespace-nowrap">100k+ citizens</span> and a team of{" "}
                <span className="whitespace-nowrap">5 AI agents</span> run on systems I built.
              </>
            )}
          </motion.p>

          <motion.div {...fade(0.95)} className="relative mt-6 flex flex-wrap gap-3 text-[clamp(14px,1.1vw,16px)]">
            {xray ? (
              <>
                <span className="rounded-full border border-dashed border-[#ff7a3a]/70 px-6 py-3 font-mono text-[13px] text-[#e9e4d8]">
                  {"<a href=\"#work\">"}
                </span>
                <span className="rounded-full border border-dashed border-[#ff7a3a]/70 px-6 py-3 font-mono text-[13px] text-[#e9e4d8]">
                  {"<a href=\"#contact\">"}
                </span>
              </>
            ) : (
              <>
                <a href="#work" className="rounded-full bg-ink px-6 py-3 font-medium text-bg transition-transform hover:scale-[1.04]">
                  {t("View work ↓", "Ver projetos ↓")}
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-ink px-6 py-3 font-medium transition-colors hover:bg-ink hover:text-bg"
                >
                  {t("Let's talk", "Vamos conversar")}
                </a>
              </>
            )}
          </motion.div>
        </div>

        <NowCard xray={xray} />
      </div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  // Lands from the intro's zoom: starts a little closer and settles back.
  // Set after mount (hidden under the intro) so server and client HTML match.
  const land = useAnimationControls();
  // Bumped when the intro starts, to replay the entrances in sync with it.
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!introPending()) return;
    land.set({ scale: 1.18 });
    return onIntroStart(() => {
      setRun(1);
      land.start({ scale: 1, transition: { duration: 1.1, delay: INTRO_SECONDS - 0.55, ease: [0.16, 1, 0.3, 1] } });
    });
  }, [land]);

  return (
    <motion.section
      id="top"
      className="relative overflow-hidden"
      animate={land}
    >
      <SystemMap />
      <HeroLayout key={run} />
      <XRay>
        <HeroLayout xray />
      </XRay>

      <span className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-[10px] font-light uppercase tracking-[0.9px]">
        <span className="hidden md:inline">
          {t("Move the cursor to x-ray the back-end · ", "Passe o cursor para ver o back-end em raio-x · ")}
        </span>
        {t("Scroll ↓", "Role ↓")}
      </span>
    </motion.section>
  );
}
