"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/Icons";
import { CASES, type Case } from "@/lib/data";

function ReadMarquee({ text }: { text: string }) {
  const items = Array.from({ length: 16 }, (_, i) => (
    <span key={i} className="mx-4 whitespace-nowrap">
      ✦ {text}
    </span>
  ));
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 z-10 h-6 overflow-hidden bg-white/25 text-[11px] font-light leading-6 text-white backdrop-blur-[2px] [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div className="marquee-track">
        <div className="flex">{items}</div>
        <div className="flex">{items}</div>
      </div>
    </div>
  );
}

function Device({ kind, src }: { kind: Case["device"]; src: string }) {
  if (kind === "phone") {
    return (
      <div className="absolute bottom-[-18%] left-1/2 aspect-[9/19] h-[92%] -translate-x-1/2 rotate-[-4deg] rounded-[2.4rem] bg-[#0b0b0f] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
        <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-paper">
          <Image src={src} alt="" fill sizes="300px" className="object-cover object-left-top" />
        </div>
        <span className="absolute left-1/2 top-[14px] h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    );
  }
  return (
    <div className="absolute bottom-[-14%] left-1/2 aspect-[16/10] w-[min(125%,860px)] -translate-x-1/2 rotate-[-2deg] md:w-[min(72%,860px)] rounded-t-[1.4rem] bg-[#0b0b0f] p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
      <div className="relative h-full w-full overflow-hidden rounded-t-[1rem] bg-paper">
        <Image src={src} alt="" fill sizes="900px" className="object-cover object-left-top" />
      </div>
      <span className="absolute left-1/2 top-[3px] h-[6px] w-[46px] -translate-x-1/2 rounded-full bg-black/80" />
    </div>
  );
}

const pill =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-normal transition-[transform,background,color] duration-200 hover:scale-[1.03]";

function CaseCard({ c, i }: { c: Case; i: number }) {
  const full = c.layout === "full";
  return (
    <Reveal
      delay={(i % 2) * 0.08}
      className={full ? "md:col-span-2" : ""}
    >
      <article className="overflow-hidden rounded-[12px] border border-ink bg-bg">
        <div
          className={`relative overflow-hidden ${
            full
              ? "h-[clamp(430px,54vw,780px)]"
              : "h-[clamp(430px,38vw,560px)]"
          }`}
          style={{ background: c.bg }}
        >
          <ReadMarquee text={c.read} />
          <Device kind={c.device} src={c.image} />

          <div className="absolute left-0 top-6 z-10 w-[clamp(170px,16vw,250px)] rounded-br-[12px] md:bottom-0 md:top-auto md:rounded-br-none md:rounded-tr-[12px] bg-white/20 p-4 text-white backdrop-blur-md">
            <p className="text-[10px] font-light uppercase tracking-[0.9px]">
              Insights
            </p>
            {c.insights.map((m, k) => (
              <div key={k} className={k > 0 ? "mt-3 hidden sm:block" : "mt-1"}>
                <p className="text-[clamp(1.5rem,2.6vw,2.5rem)] font-bold leading-none">
                  {m.value}
                </p>
                <p className="mt-1 text-[11px] font-light leading-tight opacity-90">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <div className="absolute bottom-3 right-3 z-10 flex flex-wrap justify-end gap-2">
            {c.live && (
              <motion.a
                href={c.live}
                target={c.live.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`${pill} border border-white/50 bg-white/25 text-white backdrop-blur hover:bg-white hover:text-ink`}
              >
                Live Website
              </motion.a>
            )}
            <a
              href={c.caseHref}
              className={`${pill} bg-white text-ink hover:bg-ink hover:text-white`}
            >
              View Case Study <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-6">
          <p className="text-[12px] font-normal uppercase">Case Study {c.n}</p>
          <h3 className="mt-2 max-w-[24ch] text-[clamp(1.5rem,2.5vw,2.2rem)] font-light leading-[1.22] md:max-w-[34ch]">
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
          <ul className="mt-3 flex flex-wrap gap-x-4 text-[12px] font-normal uppercase">
            {c.tags.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export default function FeaturedWork() {
  return (
    <section id="work" className="px-5 pb-24 md:pb-40">
      <Reveal>
        <h2 className="display mb-8 whitespace-nowrap text-[clamp(2.6rem,10.4vw,10.4rem)] md:mb-12">
          Featured Work
        </h2>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 md:gap-7">
        {CASES.map((c, i) => (
          <CaseCard key={c.slug} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
