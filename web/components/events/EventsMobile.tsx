"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { EVENTS } from "@/lib/events";
import { quadMatrix3d } from "@/lib/quad";

const INTRO = { bg: "#0d0d0d", accent: "#46647f", ink: "#ffffff" };
const N = EVENTS.length;

const titleSize = (len: number, mobile: boolean) => {
  const vw = len <= 8 ? 9.4 : len <= 11 ? 8 : 6.6;
  return mobile ? `min(${vw * 1.5}vw, 4.4rem)` : `min(${vw}vw, 9.4rem)`;
};

/* target shape of every photo, measured from the reference (1440×688 viewport):
   TL, TR, BR, BL inside a 593×440 bounding box */
const DST: [number, number][] = [
  [203, 42],
  [593, 0],
  [488, 440],
  [0, 429],
];
const BBOX_W = 593;
const BBOX_H = 440;
const SRC_W = 520;
const SRC_H = 400;
const GAP = 96;
const LOCK_MS = 1250;
const EASE = [0.7, 0, 0.15, 1] as const;

export default function EventsMobile() {
  const [index, setIndex] = useState(0); // 0 = intro, 1..N = events
  const [moving, setMoving] = useState(false);
  const [vp, setVp] = useState({ w: 1440, h: 800 });
  const [ready, setReady] = useState(false);
  const indexRef = useRef(0);
  const lockUntil = useRef(0);
  const touchY = useRef<number | null>(null);

  const go = useCallback((to: number) => {
    const next = Math.max(0, Math.min(N, to));
    if (next === indexRef.current) return;
    indexRef.current = next;
    lockUntil.current = performance.now() + LOCK_MS;
    setIndex(next);
    setMoving(true);
    window.setTimeout(() => setMoving(false), LOCK_MS - 150);
  }, []);

  useEffect(() => {
    const measure = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      setReady(true);
    };
    measure();
    window.addEventListener("resize", measure);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now < lockUntil.current) {
        lockUntil.current = Math.max(lockUntil.current, now + 200);
        return;
      }
      if (Math.abs(e.deltaY) < 8) return;
      go(indexRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        if (performance.now() >= lockUntil.current) go(indexRef.current + 1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        if (performance.now() >= lockUntil.current) go(indexRef.current - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(N);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => e.preventDefault();
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY.current === null) return;
      const dy = touchY.current - e.changedTouches[0].clientY;
      touchY.current = null;
      if (Math.abs(dy) > 50 && performance.now() >= lockUntil.current) {
        go(indexRef.current + (dy > 0 ? 1 : -1));
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go]);

  const mobile = vp.w < 768;
  const k = mobile
    ? (vp.w * 0.82) / BBOX_W
    : Math.max(0.55, Math.min(vp.w / 1440, vp.h / 688));
  const stackLeft = mobile ? vp.w * 0.09 : vp.w * (697 / 1440);
  const centerY = mobile ? vp.h * 0.7 : vp.h * (328 / 688);
  const stackTop = centerY - (BBOX_H * k) / 2;
  const pitch = (BBOX_H + GAP) * k;

  const matrix = useMemo(
    () =>
      quadMatrix3d(
        SRC_W * k,
        SRC_H * k,
        DST.map(([x, y]) => [x * k, y * k]) as [number, number][],
      ),
    [k],
  );

  const intro = index === 0;
  const active = index - 1;
  const ev = intro ? null : EVENTS[active];
  const bg = ev?.bg ?? INTRO.bg;
  const accent = ev?.accent ?? INTRO.accent;
  const ink = ev?.ink ?? INTRO.ink;
  const soft = `color-mix(in srgb, ${ink} 38%, transparent)`;

  const trackY = intro ? vp.h - stackTop : -active * pitch;

  const nav = "text-[13px] font-bold uppercase tracking-[2px] md:text-[14px]";

  return (
    <div
      className="fixed inset-0 select-none overflow-hidden font-[family-name:var(--font-jakarta)]"
      style={{ color: ink }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: bg }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-[6px] md:w-[10px]"
        animate={{ backgroundColor: accent }}
        transition={{ duration: 1.1, ease: "easeInOut" }}
      />

      {/* nav */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-6 md:px-[6.25vw] md:pt-[44px]"
        animate={{ color: ink }}
        transition={{ duration: 1.1 }}
      >
        <Link
          href="/"
          className={`${nav} transition-opacity duration-500 ${intro ? "pointer-events-none opacity-0" : "opacity-100"}`}
          tabIndex={intro ? -1 : 0}
        >
          Rodrigo Scharp
        </Link>
        <Link href="/" className={nav}>
          Home
        </Link>
      </motion.div>

      {/* right stack of photos, warped to the reference's perspective */}
      <div
        className="absolute z-10"
        style={{ left: stackLeft, top: stackTop, width: BBOX_W * k, height: BBOX_H * k }}
      >
        <motion.div
          className="absolute left-0 top-0"
          style={{ width: 0, height: 0 }}
          animate={{ y: trackY, skewY: moving ? -5 : 0, scaleY: moving ? 1.05 : 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {EVENTS.map((e, i) => {
            const isActive = i === active;
            return (
              <div
                key={e.slug}
                className="absolute left-0 top-0"
                style={{
                  width: SRC_W * k,
                  height: SRC_H * k,
                  transform: `translateY(${i * pitch}px) ${matrix}`,
                  transformOrigin: "0 0",
                  opacity: ready ? (isActive ? 1 : 0.5) : 0,
                  filter: isActive ? "grayscale(0)" : "grayscale(1)",
                  transition: "opacity .9s ease, filter .9s ease",
                }}
              >
                <Image
                  src={e.image}
                  alt={isActive ? `${e.title}, ${e.place}` : ""}
                  fill
                  sizes="600px"
                  priority={i < 2}
                  className="object-cover"
                  style={{ objectPosition: e.focus }}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* text */}
      <div
        className="absolute z-10 px-6 md:left-[6.25vw] md:top-[47%] md:w-[46vw] md:-translate-y-1/2 md:px-0"
        style={mobile ? { top: "10vh", left: 0, right: 0 } : undefined}
      >
        <AnimatePresence mode="wait">
          {intro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.35 } }}
            >
              <h1
                className="font-[family-name:var(--font-dmserif)] text-[clamp(3.2rem,8.6vw,7.6rem)] leading-none"
                style={{ color: accent, WebkitTextStroke: "0.02em currentColor" }}
              >
                Events
              </h1>
              <p className="mt-4 text-[14px] font-bold uppercase tracking-[2px] md:text-[16px]">
                Conferences · Summits · Forums
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={ev!.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.55 } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
            >
              <h2
                className="whitespace-nowrap font-[family-name:var(--font-dmserif)] leading-[0.98]"
                style={{
                  color: accent,
                  WebkitTextStroke: "0.02em currentColor",
                  fontSize: titleSize(ev!.title.length, mobile),
                }}
              >
                {ev!.title}
              </h2>
              <p className="mt-5 max-w-[30em] text-[17px] leading-[1.6] md:text-[20px]">
                {ev!.text}
              </p>
              <p className="mt-6 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[2px] md:text-[16px]">
                {ev!.place} · {ev!.date}
                <span style={{ color: accent }}>✦</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* intro bubble */}
      <AnimatePresence>
        {intro && (
          <motion.p
            key="bubble"
            className="absolute bottom-8 left-6 right-6 z-10 max-w-[390px] md:right-auto rounded-[44px] rounded-bl-none bg-[#262626] px-7 py-6 text-[16px] italic leading-[1.5] text-white md:bottom-[7vh] md:left-[6.25vw]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.7 } }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
          >
            Role pra ver por onde eu passei, {N} eventos de norte a sul do Brasil ↓
          </motion.p>
        )}
      </AnimatePresence>

      {/* thumbnail */}
      {!mobile && (
        <motion.div
          className="absolute z-10 overflow-hidden rounded-[6px] border-[3px]"
          style={{
            left: "3.8vw",
            bottom: "5.8vh",
            width: 240 * k,
            height: 141 * k,
            borderColor: accent,
          }}
          animate={{
            opacity: intro ? 0 : 1,
            skewX: moving ? -12 : 0,
            rotate: moving ? -3 : 0,
          }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <AnimatePresence mode="popLayout">
            {ev && (
              <motion.div
                key={ev.slug}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={ev.image}
                  alt=""
                  fill
                  sizes="260px"
                  className="scale-[1.9] object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* pagination */}
      <motion.ul
        className="absolute right-[3.4vw] top-1/2 z-20 flex -translate-y-1/2 flex-col gap-[20px] md:right-[6.6vw]"
        animate={{ opacity: intro ? 0 : 1 }}
        transition={{ duration: 0.6 }}
      >
        {EVENTS.map((e, i) => (
          <li key={e.slug}>
            <button
              type="button"
              aria-label={`Go to ${e.title}`}
              aria-current={i === active}
              tabIndex={intro ? -1 : 0}
              onClick={() => go(i + 1)}
              className="block h-[14px] w-[8px] rounded-full transition-colors duration-500"
              style={{ backgroundColor: i === active ? accent : soft }}
            />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
