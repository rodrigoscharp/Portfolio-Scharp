"use client";

import { SETUP_IMAGES } from "@/lib/data";
import { useLang } from "@/lib/i18n";

/* Portuguese alt text, keyed by photo path. */
const ALT_PT: Record<string, string> = {
  "/images/setup/setup-1.jpg": "Mesa com teclado mecânico, mouse e microfone sob um monitor curvo",
  "/images/setup/setup-2.jpg": "Home office escuro com três monitores, notebook e luz softbox",
  "/images/setup/setup-3.jpg": "Mesa com luz roxa, dois monitores, teclado e microfone",
  "/images/setup/setup-4.jpg": "Monitor ultrawide e notebook rodando código, caderno sobre a mesa",
  "/images/setup/setup-5.jpg": "Mesa de madeira com monitor curvo, notebook, tablet e luz softbox",
};

const PLACEHOLDER_WIDTHS = ["w-[190px]", "w-[520px]", "w-[440px]", "w-[190px]", "w-[500px]", "w-[440px]"];

export default function Workspaces() {
  const { lang, t } = useLang();
  /* photos repeat inside a group so one group is always wider than the viewport */
  const items = SETUP_IMAGES.length
    ? [0, 1, 2].flatMap((n) =>
        SETUP_IMAGES.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${n}-${img.src}`}
            src={img.src}
            alt={n === 0 ? (lang === "pt" && ALT_PT[img.src]) || img.alt : ""}
            loading="lazy"
            className="h-[300px] w-auto max-w-none rounded-xl object-cover md:h-[430px]"
          />
        )),
      )
    : PLACEHOLDER_WIDTHS.map((w, i) => (
        <div
          key={i}
          className={`${w} grid h-[240px] shrink-0 place-items-center rounded-xl border border-dashed border-ink/25 bg-gradient-to-br from-ink/5 to-ink/10 text-[12px] font-light uppercase tracking-[0.9px] text-ink/50 md:h-[310px]`}
        >
          {t("Setup photo", "Foto do setup")} {i + 1}
        </div>
      ));

  return (
    <section className="pt-24 md:pt-36">
      <h2 className="mb-8 flex items-center justify-center gap-3 text-center text-[clamp(1.4rem,2.4vw,2rem)] font-medium">
        <span className="text-accent">✳</span> {t("My Workspaces so far", "Meus setups até aqui")}{" "}
        <span className="text-accent">✳</span>
      </h2>
      <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
        <div className="marquee-track gap-0 [animation-duration:60s] group-hover:[animation-play-state:paused]">
          <div className="flex shrink-0 gap-5 pr-5">{items}</div>
          <div aria-hidden className="flex shrink-0 gap-5 pr-5">{items}</div>
        </div>
      </div>
    </section>
  );
}
