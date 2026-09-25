"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; ph: number; ox: number; oy: number };

/* Canvas dust: tiny dots that drift slowly, wobble, and get pushed away by the cursor. */
export default function Dots({ className = "", count = 230 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const cv = canvas;
    const g = ctx;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dots: P[] = [];
    const mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const seed = (n: number) => {
      let s = 90210 + n * 7919;
      return () => {
        s = (s * 16807) % 2147483647;
        return s / 2147483647;
      };
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rnd = seed(count);
      dots = Array.from({ length: count }, () => {
        const ang = rnd() * Math.PI * 2;
        const sp = 2 + rnd() * 5;
        const x = rnd() * w;
        const y = rnd() * h;
        return {
          x, y, ox: 0, oy: 0,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          r: 1 + rnd() * 1.5,
          a: 0.4 + rnd() * 0.45,
          ph: rnd() * Math.PI * 2,
        };
      });
    };

    const readColor = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--ink-soft").trim() || "#222";
    let dotColor = readColor();
    const themeObs = new MutationObserver(() => (dotColor = readColor()));
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const draw = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      g.clearRect(0, 0, w, h);
      g.fillStyle = dotColor;
      for (const d of dots) {
        if (!reduce) {
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (d.x < -4) d.x = w + 4;
          else if (d.x > w + 4) d.x = -4;
          if (d.y < -4) d.y = h + 4;
          else if (d.y > h + 4) d.y = -4;

          const dx = d.x + d.ox - mouse.x;
          const dy = d.y + d.oy - mouse.y;
          const dist = Math.hypot(dx, dy);
          const R = 130;
          if (dist < R && dist > 0.01) {
            const push = (1 - dist / R) * 70;
            d.ox += ((dx / dist) * push - d.ox) * 0.12;
            d.oy += ((dy / dist) * push - d.oy) * 0.12;
          } else {
            d.ox *= 0.94;
            d.oy *= 0.94;
          }
        }
        const wob = reduce ? 0 : Math.sin(t / 1400 + d.ph) * 2;
        g.globalAlpha = d.a;
        g.beginPath();
        g.arc(d.x + d.ox + wob, d.y + d.oy + wob * 0.6, d.r, 0, Math.PI * 2);
        g.fill();
      }
      g.globalAlpha = 1;
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };

    build();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) requestAnimationFrame(draw);
    });
    ro.observe(cv);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible && !reduce) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(cv);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
