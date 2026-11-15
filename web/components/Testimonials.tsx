"use client";

import Image from "next/image";
import Reveal from "@/components/Reveal";
import { TESTIMONIALS } from "@/lib/data";
import { useLang } from "@/lib/i18n";

/* Hidden until TESTIMONIALS in lib/data.ts has real quotes. */
export default function Testimonials() {
  const { t: tr, lang } = useLang();
  if (TESTIMONIALS.length === 0) return null;
  return (
    <section id="testimonials" className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)] pb-24 md:pb-40">
      <Reveal>
        <h2
          className={`display mb-[clamp(14px,2vw,28px)] whitespace-nowrap ${
            lang === "pt" ? "text-[clamp(2.3rem,9vw,9rem)]" : "text-[clamp(2.6rem,10.4vw,10.4rem)]"
          }`}
        >
          {tr("Kind Words", "Depoimentos")}
        </h2>
      </Reveal>
      <ul className="grid gap-[clamp(8px,1.6vw,24px)] md:grid-cols-3">
        {TESTIMONIALS.map((t, k) => (
          <Reveal key={t.name} delay={k * 0.08}>
            <li className="flex h-full flex-col justify-between rounded-[clamp(10px,1.95vw,28px)] border border-ink p-[clamp(20px,2.4vw,36px)]">
              <p className="text-[clamp(17px,1.4vw,21px)] font-light leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-8 flex items-center gap-3">
                {t.photo && (
                  <Image src={t.photo} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-[13px] text-ink-soft">{t.role}</p>
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
