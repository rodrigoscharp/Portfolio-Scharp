import { SETUP_IMAGES } from "@/lib/data";

const PLACEHOLDER_WIDTHS = ["w-[190px]", "w-[520px]", "w-[440px]", "w-[190px]", "w-[500px]", "w-[440px]"];

export default function Workspaces() {
  /* photos repeat inside a group so one group is always wider than the viewport */
  const items = SETUP_IMAGES.length
    ? [0, 1, 2].flatMap((n) =>
        SETUP_IMAGES.map((img) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${n}-${img.src}`}
            src={img.src}
            alt={n === 0 ? img.alt : ""}
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
          Setup photo {i + 1}
        </div>
      ));

  return (
    <section className="pt-24 md:pt-36">
      <h2 className="mb-8 flex items-center justify-center gap-3 text-center text-[clamp(1.4rem,2.4vw,2rem)] font-medium">
        <span className="text-accent">✳</span> My Workspaces so far{" "}
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
