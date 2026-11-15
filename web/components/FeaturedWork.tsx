"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Reveal from "@/components/Reveal";
import { ArrowUpRight } from "@/components/Icons";
import { CASES, type Case, type Slide } from "@/lib/data";
import { CASES_PT } from "@/lib/data.pt";
import { useL, useLang } from "@/lib/i18n";

const SLIDE_MS = 4200;
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Pointer = { x: MotionValue<number>; y: MotionValue<number> };

/* Glows are radial gradients, not blur filters: a moving blur is re-rendered by
   the GPU on every frame, a gradient is not. */
/* Solid brand color with two glows drifting slowly, a dot grid, film grain
   and a soft light that follows the pointer. */
function Backdrop({ glow, pointer, play }: { glow: [string, string]; pointer: Pointer; play: boolean }) {
  const reduce = useReducedMotion();
  const loop = play && !reduce;
  // A pre-painted soft blob moved with transforms: moving it costs no repaint.
  // The blob is twice the card's size and centred on its top-left corner, so a
  // translate of v/2 % of itself moves its centre to v % of the card.
  const lightX = useTransform(pointer.x, (v) => `${v / 2}%`);
  const lightY = useTransform(pointer.y, (v) => `${v / 2}%`);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-[30%] -top-[50%] aspect-square w-[86%] opacity-70 will-change-transform"
        style={{ background: `radial-gradient(closest-side, ${glow[0]}, transparent)` }}
        animate={loop ? { x: ["0%", "28%", "8%", "0%"], y: ["0%", "18%", "34%", "0%"], scale: [1, 1.18, 0.94, 1] } : undefined}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-[55%] -right-[24%] aspect-square w-[82%] opacity-60 will-change-transform"
        style={{ background: `radial-gradient(closest-side, ${glow[1]}, transparent)` }}
        animate={loop ? { x: ["0%", "-24%", "-6%", "0%"], y: ["0%", "-20%", "-8%", "0%"], scale: [1, 0.9, 1.15, 1] } : undefined}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.3px)",
          backgroundSize: "clamp(12px,1.6vw,22px) clamp(12px,1.6vw,22px)",
          maskImage: "radial-gradient(65% 75% at 60% 45%, #000 15%, transparent 75%)",
        }}
      />
      <motion.div
        className="absolute -left-full -top-full h-[200%] w-[200%] will-change-transform"
        style={{
          x: lightX,
          y: lightY,
          background: "radial-gradient(21% 30% at 50% 50%, rgba(255,255,255,0.14), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.1] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}

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

/* The brand symbol, huge and filled with a fading gradient, behind the
   devices: a "shadow" of the logo. Drifts against the pointer for depth. */
function BrandMark({ slide, full, pointer, seen }: { slide: Slide; full: boolean; pointer: Pointer; seen: boolean }) {
  const reduce = useReducedMotion();
  const sx = useSpring(pointer.x, { stiffness: 60, damping: 20 });
  const sy = useSpring(pointer.y, { stiffness: 60, damping: 20 });
  const x = useTransform(sx, [0, 100], ["4%", "-4%"]);
  const y = useTransform(sy, [0, 100], ["3%", "-3%"]);
  const hidden = !seen && !reduce;
  const mask = `url(${slide.mark}) center / contain no-repeat`;
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${
        full ? "left-[3%] top-1/2 h-[122%] -translate-y-1/2" : "-left-[14%] -top-[8%] h-[124%]"
      }`}
      style={{ aspectRatio: slide.markAspect, x: reduce ? 0 : x, y: reduce ? 0 : y }}
    >
      <motion.div
        className="h-full w-full"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.12) 42%, rgba(255,255,255,0) 82%)",
          mask,
          WebkitMask: mask,
        }}
        initial={false}
        animate={hidden ? { opacity: 0, scale: 1.12, rotate: -4 } : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      />
    </motion.div>
  );
}

/* MacBook with an iPhone in front, sized to always fit whole inside the slide.
   Stage is 1 : 0.6 (W : H); every child is placed in % of the stage, and the
   screens keep the exact screenshot ratios (1440x900 and 393x852), so nothing
   is cropped. Enters once when seen, tilts with the pointer, the phone floats. */
function DevicesView({ slide, full, pointer, seen }: { slide: Slide; full: boolean; pointer: Pointer; seen: boolean }) {
  const reduce = useReducedMotion();
  const statusColor = slide.statusDark ? "#111" : "#fff";
  const sx = useSpring(pointer.x, { stiffness: 110, damping: 18 });
  const sy = useSpring(pointer.y, { stiffness: 110, damping: 18 });
  const rotateY = useTransform(sx, [0, 100], [-7, 7]);
  const rotateX = useTransform(sy, [0, 100], [5, -5]);
  const phoneX = useTransform(sx, [0, 100], ["-6%", "6%"]);
  const phoneY = useTransform(sy, [0, 100], ["-3%", "3%"]);
  const hidden = !seen && !reduce;

  return (
    <div className="absolute inset-0 [container-type:size] [perspective:1400px]">
      {/* Kept clear of the logo and the insights box: right-aligned when full, high when half. */}
      <motion.div
        className={`absolute [container-type:inline-size] [transform-style:preserve-3d] ${full ? "right-[6cqw] top-[9cqh]" : "left-1/2 top-[24cqh] -translate-x-1/2"}`}
        style={{
          width: full ? "min(62cqw, calc(70cqh / 0.6))" : "min(82cqw, calc(50cqh / 0.6))",
          aspectRatio: "1 / 0.6",
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={hidden ? { opacity: 0, y: "14%", scale: 0.94 } : { opacity: 1, y: "0%", scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT }}
        >
          {/* Ground shadow */}
          <span className="absolute left-[2%] top-[90%] h-[9%] w-[90%] rounded-[50%] bg-black/45 blur-[2cqw]" />
          {/* Laptop lid */}
          <div className="absolute left-[4%] top-0 w-[84%] rounded-[2.2cqw_2.2cqw_0.6cqw_0.6cqw] bg-[#0d0d10] px-[1.2cqw] pb-[1.2cqw] pt-[1.6cqw] shadow-[0_3cqw_6cqw_-2cqw_rgba(0,0,0,.55)] ring-1 ring-white/10">
            <span className="absolute left-1/2 top-[0.55cqw] h-[0.5cqw] w-[0.5cqw] -translate-x-1/2 rounded-full bg-[#2a2a30]" />
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[0.4cqw] bg-paper">
              <Image src={slide.image} alt="" fill sizes="(min-width:768px) 900px, 90vw" className="object-cover object-top" />
              <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.12)_0%,transparent_38%)]" />
            </div>
          </div>
          {/* Laptop base */}
          <div className="absolute left-0 top-[89.6%] h-[4%] w-[92%] rounded-[0_0_3cqw_3cqw/0_0_1.6cqw_1.6cqw] bg-gradient-to-b from-[#d9d9de] via-[#b4b4bb] to-[#77777f] shadow-[0_2cqw_3cqw_-1cqw_rgba(0,0,0,.5)]">
            <span className="absolute left-1/2 top-0 h-[45%] w-[16%] -translate-x-1/2 rounded-b-[1cqw] bg-[#8d8d95]" />
          </div>
        </motion.div>

        {/* iPhone: enters after the laptop, then floats and drifts with the pointer */}
        <motion.div
          className="absolute bottom-0 right-0 w-[20%]"
          initial={false}
          animate={hidden ? { opacity: 0, x: "45%", rotate: 8 } : { opacity: 1, x: "0%", rotate: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE_OUT }}
        >
          <motion.div style={{ x: reduce ? 0 : phoneX, y: reduce ? 0 : phoneY }}>
            <motion.div
              animate={reduce ? undefined : { y: ["0%", "-3.5%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-[3.1cqw] bg-[#0d0d10] p-[0.9cqw] shadow-[0_3cqw_5cqw_-1cqw_rgba(0,0,0,.6)] ring-1 ring-white/15"
            >
              <div className="relative overflow-hidden rounded-[2.3cqw]" style={{ background: slide.statusBg }}>
                <div className="relative flex h-[2.25cqw] items-end justify-between px-[1.6cqw] pb-[0.15cqw] text-[0.85cqw] font-semibold leading-none" style={{ color: statusColor }}>
                  <span>9:41</span>
                  <span className="flex items-center gap-[0.3cqw]">
                    <span className="flex items-end gap-[0.12cqw]">
                      {[0.35, 0.5, 0.65, 0.8].map((h) => (
                        <span key={h} className="w-[0.18cqw] rounded-[0.05cqw]" style={{ height: `${h}cqw`, background: statusColor }} />
                      ))}
                    </span>
                    <span className="relative h-[0.75cqw] w-[1.5cqw] rounded-[0.22cqw] border-[0.08cqw]" style={{ borderColor: statusColor }}>
                      <span className="absolute inset-[0.1cqw] right-[0.35cqw] rounded-[0.08cqw]" style={{ background: statusColor }} />
                    </span>
                  </span>
                  <span className="absolute left-1/2 top-[0.45cqw] h-[1.4cqw] w-[5.4cqw] -translate-x-1/2 rounded-full bg-black" />
                </div>
                <div className="relative aspect-[393/852] w-full">
                  <Image src={slide.phone!} alt="" fill sizes="(min-width:768px) 240px, 30vw" className="object-cover object-top" />
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.14)_0%,transparent_40%)]" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SlideView({ slide, full, seen, play }: { slide: Slide; full: boolean; seen: boolean; play: boolean }) {
  const reduce = useReducedMotion();
  const pointer = { x: useMotionValue(50), y: useMotionValue(50) };
  const hidden = !seen && !reduce;
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: slide.bg }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        pointer.x.set(((e.clientX - r.left) / r.width) * 100);
        pointer.y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      onPointerLeave={() => {
        pointer.x.set(50);
        pointer.y.set(50);
      }}
    >
      {slide.glow && <Backdrop glow={slide.glow} pointer={pointer} play={play} />}
      {slide.mark && <BrandMark slide={slide} full={full} pointer={pointer} seen={seen} />}

      {slide.kind === "devices" && <DevicesView slide={slide} full={full} pointer={pointer} seen={seen} />}

      {slide.kind === "art" && (
        <Image src={slide.image} alt="" fill sizes="(min-width:768px) 700px, 60vw" className="object-cover" />
      )}

      {slide.kind === "device" && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 rotate-[-4deg] ${
            full ? "bottom-[-18%] h-[128%]" : "bottom-[-12%] h-[102%]"
          }`}
          style={{ aspectRatio: slide.aspect ?? "714 / 953" }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="(min-width:768px) 460px, 55vw"
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,.55)]"
          />
        </div>
      )}

      {slide.kind === "mark" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: `${full ? "48px 48px" : "32px 32px"}`,
              maskImage:
                "radial-gradient(ellipse at center, #000 40%, transparent 75%)",
            }}
          />
          {slide.label && (
            <p className="relative text-[clamp(5px,0.95vw,13px)] font-light uppercase tracking-[2px] text-white/70">
              {slide.label}
            </p>
          )}
          {slide.title && (
            <motion.h4
              className="display relative mt-[0.35em] text-white"
              style={{ fontSize: full ? "clamp(36px,8vw,120px)" : "clamp(22px,4.6vw,72px)", lineHeight: 1 }}
              initial={false}
              animate={hidden ? { opacity: 0, y: "30%", filter: "blur(12px)" } : { opacity: 1, y: "0%", filter: "blur(0px)" }}
              transition={{ duration: 1, ease: EASE_OUT }}
            >
              {slide.title}
            </motion.h4>
          )}
          {slide.chips && slide.chips.length > 0 && (
            <div className={`relative mt-[0.9em] flex-wrap items-center justify-center gap-[0.5em] hidden md:flex`}>
              {slide.chips.map((chip, k) => (
                <motion.span
                  key={chip}
                  className="rounded-full border border-white/25 bg-white/5 px-[0.9em] py-[0.3em] font-mono text-white/90 backdrop-blur"
                  style={{ fontSize: full ? "clamp(8px,1.1vw,15px)" : "clamp(7px,1vw,13px)" }}
                  initial={false}
                  animate={hidden ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 + k * 0.09, ease: EASE_OUT }}
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          )}
        </div>
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
  const { t, lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const seen = useInView(ref, { amount: 0.35, once: true });
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
            <SlideView slide={s} full={full} seen={seen} play={inView} />
          </div>
        ))}
      </motion.div>

      <ReadMarquee text={c.read} />

      {c.logo && (
        <motion.div
          className={`absolute left-[clamp(8px,1.4vw,20px)] top-[calc(clamp(9px,1.25vw,18px)+clamp(6px,1vw,16px))] z-10 flex items-center rounded-full text-[clamp(9px,1.3vw,19px)] font-semibold ${
            c.logoWide
              ? "bg-[#f4ebe0] px-[0.9em] py-[0.55em] shadow-[0_6px_20px_-8px_rgba(0,0,0,.45)]"
              : "gap-[0.55em] bg-black/25 py-[0.3em] pl-[0.3em] pr-[0.95em] text-white ring-1 ring-white/15 backdrop-blur-md"
          }`}
          initial={false}
          animate={!seen && !reduce ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
        >
          {c.logoWide ? (
            <Image src={c.logo} alt={c.headline[0].text} width={720} height={155} className="h-[1.45em] w-auto" />
          ) : (
            <>
              <Image src={c.logo} alt="" width={80} height={80} className="h-[2em] w-[2em] rounded-[0.55em]" />
              <span>{c.headline[0].text}</span>
            </>
          )}
        </motion.div>
      )}

      <div
        className={`absolute bottom-0 left-0 z-10 rounded-tr-[clamp(6px,0.85vw,12px)] bg-black/30 text-white ${
          full
            ? "w-[clamp(96px,16vw,230px)] px-[clamp(8px,1.4vw,20px)] py-[clamp(8px,1.4vw,20px)]"
            : "w-[clamp(84px,32%,208px)] px-[clamp(7px,1.4vw,20px)] py-[clamp(7px,1.4vw,20px)]"
        }`}
      >
        <p className="text-[clamp(5px,0.7vw,10px)] font-light uppercase tracking-[0.9px]">
          {c.soon ? "Status" : t("Insights", "Resultados")}
        </p>
        {c.soon ? (
          <div className="mt-[0.4em]">
            {lang === "pt" ? (
              <p className="text-[clamp(9px,1.7vw,24px)] font-bold leading-[1.1]">Em breve</p>
            ) : (
              <>
                <p className="text-[clamp(9px,1.7vw,24px)] font-bold leading-[1.1]">Coming<br className="md:hidden" /> soon</p>
                <p className="text-[clamp(5px,0.85vw,12px)] font-light leading-tight opacity-90">em breve</p>
              </>
            )}
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
            {t("Live Website", "Ver site")}
          </a>
        )}
        {c.repo && (
          <a
            href={c.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-[0.4em] rounded-full border border-white/25 bg-[#3a3a40]/55 px-[clamp(6px,1.05vw,15px)] py-[clamp(3px,0.5vw,7px)] text-[clamp(6px,1.1vw,16px)] font-normal text-white backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="h-[1em] w-[1em]" fill="currentColor">
              <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.81.06 1.23.84 1.23.84.72 1.23 1.88.88 2.34.67.07-.52.28-.88.5-1.08-1.77-.2-3.63-.88-3.63-3.93 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.14 0 3.06-1.86 3.73-3.64 3.93.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2Z" />
            </svg>
            GitHub
          </a>
        )}
        {n > 1 && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
            className="flex items-center gap-[0.5em] rounded-full bg-white px-[clamp(6px,1.05vw,15px)] py-[clamp(3px,0.5vw,7px)] text-[clamp(6px,1.1vw,16px)] font-normal text-ink transition-transform hover:scale-[1.04]"
          >
            {playing ? t("Pause", "Pausar") : t("Play", "Reproduzir")}
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
  const { t } = useLang();
  const full = c.layout === "full";
  return (
    <Reveal delay={(i % 2) * 0.08} className={full ? "col-span-2" : ""}>
      <article className="flex h-full flex-col overflow-hidden rounded-[clamp(10px,1.95vw,28px)] border border-ink bg-bg">
        <Slideshow c={c} full={full} />

        <div className="relative flex flex-1 flex-col px-[clamp(8px,2.1vw,30px)] pb-[clamp(8px,1.6vw,22px)] pt-[clamp(7px,1.5vw,22px)]">
          <p className="text-[clamp(5px,0.83vw,12px)] font-medium uppercase tracking-[-0.05em]">
            {t("Case Study", "Estudo de caso")} {c.n}
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
              className="mt-[1em] inline-flex items-center gap-[0.5em] self-end rounded-full bg-ink px-[clamp(8px,1.6vw,22px)] py-[clamp(4px,0.75vw,11px)] text-[clamp(6px,1.1vw,16px)] font-light text-bg transition-transform hover:scale-[1.03] md:absolute md:bottom-[clamp(8px,1.6vw,22px)] md:right-[clamp(8px,1.6vw,22px)] md:mt-0"
            >
              {t("View Case Study", "Ver estudo de caso")} <ArrowUpRight className="h-[1em] w-[1em]" />
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function FeaturedWork() {
  const { t } = useLang();
  const cases = useL(CASES, CASES_PT);
  return (
    <section id="work" className="mx-auto max-w-[1434px] px-[clamp(12px,1.5vw,22px)] pb-24 md:pb-40">
      <Reveal>
        <h2 className="display mb-[clamp(10px,2vw,28px)] whitespace-nowrap text-[clamp(2.6rem,10.4vw,10.4rem)]">
          {/* Shorter word in PT so the nowrap display title never overflows. */}
          {t("Featured Work", "Destaques")}
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-[clamp(8px,2.6vw,38px)]">
        {cases.map((c, i) => (
          <CaseCard key={c.slug} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
