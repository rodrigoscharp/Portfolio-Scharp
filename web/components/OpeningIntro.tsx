"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { introDone, introPending, markIntroSeen } from "@/lib/intro";
import css from "./OpeningIntro.module.css";

/* Opening, all centred: a big "00" glitches in (not top 1, top 00) while a ring
   draws around it, the name types in under it, then the camera rushes into the
   centre while a round hole opens and reveals the hero. */

const R = 46;
const C = 2 * Math.PI * R;
const HOLD = 1.9;

/* A liquid hole: a closed curve around the screen centre whose radius wobbles
   with a few travelling sine waves. Returned as an even-odd clip path that
   keeps the full screen except the blob. */
function liquidClip(w: number, h: number, r: number, t: number, phase = 0) {
  const cx = w / 2;
  const cy = h / 2;
  const N = 72;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const k =
      1 +
      0.1 * Math.sin(3 * a + t * 7 + phase) +
      0.06 * Math.sin(5 * a - t * 11 + phase * 2) +
      0.035 * Math.sin(9 * a + t * 5);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]);
  }
  // Smooth closed curve through the midpoints.
  const mid = (p: [number, number], q: [number, number]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let d = `M${mid(pts[N - 1], pts[0]).join(" ")}`;
  for (let i = 0; i < N; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % N]);
    d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${m[0].toFixed(1)} ${m[1].toFixed(1)}`;
  }
  return `path(evenodd, "M0 0H${w}V${h}H0Z${d}Z")`;
}

export default function OpeningIntro() {
  // Rendered from the server so it covers the page before the first paint; CSS
  // only shows it when the inline script in the layout marked the intro pending.
  const [show, setShow] = useState(true);
  const ring = useMotionValue(0);
  const dash = useTransform(ring, (v) => C * (1 - v));
  // The zoom: content rushes toward the viewer while a round hole grows from the centre.
  const zoom = useMotionValue(1);
  const hole = useMotionValue(0);
  const dark = useRef<HTMLDivElement>(null);
  const rim = useRef<HTMLDivElement>(null);
  const fade = useTransform(zoom, [1, 5], [1, 0]);

  useEffect(() => {
    if (!introPending()) {
      const off = window.requestAnimationFrame(() => setShow(false));
      return () => window.cancelAnimationFrame(off);
    }
    markIntroSeen();
    document.documentElement.style.overflow = "hidden";
    let done = false;
    const draw = animate(ring, 1, { duration: 1.1, delay: 0.25, ease: [0.65, 0, 0.35, 1] });
    const finish = () => {
      if (done) return;
      done = true;
      draw.stop();
      animate(zoom, 14, { duration: 0.75, ease: [0.7, 0, 0.84, 0] });
      // Liquid opening: the dark layer's blob leads, an orange rim follows it.
      const w = window.innerWidth;
      const h = window.innerHeight;
      const full = Math.hypot(w, h) * 0.75;
      const t0 = performance.now();
      const unsub = hole.on("change", (v) => {
        const t = (performance.now() - t0) / 1000;
        if (dark.current) dark.current.style.clipPath = liquidClip(w, h, v * full, t);
        if (rim.current) rim.current.style.clipPath = liquidClip(w, h, Math.max(0, v - 0.09) * full, t, 1.3);
      });
      animate(hole, 1, { duration: 1.05, delay: 0.1, ease: [0.55, 0, 0.3, 1] }).then(() => {
        unsub();
        document.documentElement.style.overflow = "";
        document.documentElement.classList.remove("intro-pending");
        introDone();
        setShow(false);
      });
    };
    const timer = window.setTimeout(finish, HOLD * 1000);
    const skip = () => finish();
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      draw.stop();
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      document.documentElement.style.overflow = "";
    };
  }, [ring, zoom, hole]);

  if (!show) return null;

  return (
    <>
      {/* orange liquid rim, just behind the dark layer's edge */}
      <div ref={rim} aria-hidden className={`${css.cover} ${css.rim}`} />
      <motion.div
        ref={dark}
        aria-hidden
        className={`${css.cover} ${css.dark}`}
      >
        {/* faint grid, zooming with everything else */}
        <motion.div
          className={css.grid}
          style={{ scale: zoom }}
        />

        <motion.div className={css.stack} style={{ scale: zoom, opacity: fade }}>
          <div className={css.ring}>
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.2" />
              <motion.circle
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke="#ff7a3a"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray={C}
                style={{ strokeDashoffset: dash }}
              />
            </svg>
            <motion.p
              className={`${css.display} ${css.zero}`}
              initial={{ opacity: 0, scale: 2.2, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", x: [0, -6, 5, -3, 0] }}
              transition={{ duration: 0.55, ease: [0.2, 0.9, 0.3, 1] }}
            >
              00
            </motion.p>
          </div>

          {/* the name and the title, letter by letter */}
          <p className={`${css.display} ${css.name}`}>
            {"RODRIGO SCHARP".split("").map((ch, k) => (
              <motion.span
                key={k}
                className={css.letter}
                initial={{ opacity: 0, y: 18, rotateX: 90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.35, delay: 0.45 + k * 0.03, ease: [0.2, 0.9, 0.3, 1] }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </p>
          <motion.p
            className={css.cmd}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span className={css.prompt}>$ </span>rodrigoscharp <span className={css.flag}>--top 00</span>
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
}
