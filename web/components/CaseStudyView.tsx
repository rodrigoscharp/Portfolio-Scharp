"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ArchDiagram from "@/components/ArchDiagram";
import { ArrowUpRight } from "@/components/Icons";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { CASE_STUDIES_PT } from "@/lib/caseStudies.pt";
import { SITE } from "@/lib/data";
import { useL, useLang } from "@/lib/i18n";

const label = "text-[12px] font-medium uppercase tracking-[0.14em] text-ink-soft";

/* The case study article. Client-side so it can follow the language switch;
   the page has already 404'd unknown slugs. */
export default function CaseStudyView({ slug }: { slug: string }) {
  const { t } = useLang();
  const list = useL(CASE_STUDIES, CASE_STUDIES_PT);
  const i = list.findIndex((x) => x.slug === slug);
  const c = list[i];
  const next = list[(i + 1) % list.length];

  return (
    <article className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)]">
      <Reveal>
        <Link href="/#work" className="text-[13px] uppercase tracking-[0.1em] hover:opacity-60">
          ← {t("All work", "Todos os projetos")}
        </Link>
        <p className={`${label} mt-8`}>
          {t("Case study", "Estudo de caso")} · {c.period}
        </p>
        <h1 className="display mt-2 text-[clamp(3.4rem,11vw,11rem)] leading-[0.95]">{c.name}</h1>
        <p className="mt-6 max-w-[24em] text-[clamp(20px,2.4vw,36px)] font-light leading-[1.2] tracking-[-0.01em]">
          {c.tagline}
        </p>
      </Reveal>

      <Reveal>
        <dl className="mt-10 grid gap-6 border-y border-ink py-6 md:grid-cols-[1fr_2fr_auto] md:items-start">
          <div>
            <dt className={label}>{t("Role", "Papel")}</dt>
            <dd className="mt-1 text-[16px]">{c.role}</dd>
          </div>
          <div>
            <dt className={label}>Stack</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {c.stack.map((s) => (
                <span key={s} className="rounded-full border border-ink px-3 py-1 font-mono text-[12px]">
                  {s}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex gap-3">
            {c.live && (
              <a href={c.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-ink px-5 py-2.5 text-[14px] text-paper transition-transform hover:scale-[1.03]">
                {t("Live", "No ar")} <ArrowUpRight className="h-[1em] w-[1em]" />
              </a>
            )}
            {c.repo && (
              <a href={c.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-ink px-5 py-2.5 text-[14px] text-paper transition-transform hover:scale-[1.03]">
                GitHub <ArrowUpRight className="h-[1em] w-[1em]" />
              </a>
            )}
          </div>
        </dl>
      </Reveal>

      {c.image && (
        <Reveal>
          <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink" style={{ background: c.accent }}>
            <div className="absolute inset-[5%] overflow-hidden rounded-[clamp(6px,1vw,14px)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
              <Image src={c.image} alt={t(`${c.name} screenshot`, `Tela do ${c.name}`)} fill sizes="(min-width:1024px) 1300px, 100vw" className="object-cover object-top" />
            </div>
          </div>
        </Reveal>
      )}

      <section className="mt-20 grid gap-8 md:mt-28 md:grid-cols-[1fr_2fr]">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none">{t("The problem", "O problema")}</h2>
        </Reveal>
        <Reveal>
          <div className="space-y-5 text-[clamp(17px,1.5vw,22px)] font-light leading-relaxed">
            {c.problem.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mt-20 md:mt-28">
        <Reveal>
          <h2 className="display mb-8 text-[clamp(2rem,4vw,3.6rem)] leading-none">{t("Architecture", "Arquitetura")}</h2>
        </Reveal>
        <Reveal>
          <ArchDiagram nodes={c.arch.nodes} edges={c.arch.edges} caption={c.arch.caption} />
        </Reveal>
      </section>

      <section className="mt-20 md:mt-28">
        <Reveal>
          <h2 className="display mb-8 text-[clamp(2rem,4vw,3.6rem)] leading-none">{t("Decisions & trade-offs", "Decisões e trade-offs")}</h2>
        </Reveal>
        <ol className="grid gap-px overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink bg-ink md:grid-cols-2">
          {c.decisions.map((d, k) => (
            <li
              key={d.title}
              className={`bg-bg p-[clamp(18px,2.2vw,34px)] ${
                k === c.decisions.length - 1 && c.decisions.length % 2 ? "md:col-span-2" : ""
              }`}
            >
              <p className="font-mono text-[13px] text-ink-soft">{String(k + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-[clamp(19px,1.7vw,24px)] font-bold leading-tight">{d.title}</h3>
              <p className="mt-3 text-[15px] font-light leading-relaxed">{d.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 md:mt-28">
        <Reveal>
          <h2 className="display mb-8 text-[clamp(2rem,4vw,3.6rem)] leading-none">{t("In numbers", "Em números")}</h2>
        </Reveal>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink bg-ink md:grid-cols-4">
          {c.numbers.map((n, k) => (
            <li
              key={n.label}
              className={`bg-bg p-[clamp(18px,2.2vw,34px)] ${
                k === c.numbers.length - 1 && c.numbers.length % 2 ? "col-span-2 md:col-span-1" : ""
              } ${c.numbers.length === 3 && k === 2 ? "md:col-span-2" : ""}`}
            >
              <p className="display text-[clamp(2.2rem,4vw,4rem)] leading-none">{n.value}</p>
              <p className="mt-3 text-[14px] font-light leading-snug">{n.label}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 grid gap-8 md:mt-28 md:grid-cols-[1fr_2fr]">
        <Reveal>
          <h2 className="display text-[clamp(2rem,4vw,3.6rem)] leading-none">{t("In hindsight", "Em retrospecto")}</h2>
        </Reveal>
        <Reveal>
          <p className="text-[clamp(17px,1.5vw,22px)] font-light leading-relaxed">{c.hindsight}</p>
        </Reveal>
      </section>

      <section className="mt-24 grid gap-4 md:mt-32 md:grid-cols-2">
        <a
          href={`mailto:${SITE.email}?subject=${encodeURIComponent(t(`About ${c.name}`, `Sobre o ${c.name}`))}`}
          className="group rounded-[clamp(10px,1.95vw,28px)] bg-ink p-[clamp(20px,3vw,44px)] text-paper"
        >
          <p className="text-[12px] uppercase tracking-[0.14em] opacity-60">{t("Building something similar?", "Construindo algo parecido?")}</p>
          <p className="display mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none">
            {t("Let's talk", "Vamos conversar")} <ArrowUpRight className="inline h-[0.8em] w-[0.8em] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </p>
        </a>
        <Link href={`/work/${next.slug}`} className="group rounded-[clamp(10px,1.95vw,28px)] border border-ink p-[clamp(20px,3vw,44px)]">
          <p className="text-[12px] uppercase tracking-[0.14em] text-ink-soft">{t("Next case study", "Próximo estudo de caso")}</p>
          <p className="display mt-3 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-none">
            {next.name} <ArrowUpRight className="inline h-[0.8em] w-[0.8em] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </p>
        </Link>
      </section>
    </article>
  );
}
