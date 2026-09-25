"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  type MotionValue,
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { EVENTS, TEASERS, parseFocus } from "@/lib/events";
import { EventsScene } from "@/lib/eventsScene";
import { Lethargy, easeInOutQuart, easeInQuad, easeOutQuad } from "@/lib/motion";

const N = EVENTS.length;
const LOADER_BG = "#0d0d0d";
const LOADER_ACCENT = "#46647f";
const LIMBO = "#0d0d0d";
const SINE = "cubic-bezier(0.39, 0.575, 0.565, 1)";

const items = EVENTS.map((e) => ({ image: e.image, focus: parseFocus(e.focus), accent: e.accent }));

type Phase = "loading" | "revealing" | "home";

function useViewport() {
  const [vp, setVp] = useState({ w: 1440, h: 800 });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

/* pointer proximity to an element (0..1), same maths as the reference's worker */
function proximity(el: HTMLElement | null, px: number, py: number, threshold = 100, margin = 10) {
  if (!el) return 0;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const dx = Math.max(Math.abs(cx - px) - (r.width / 2 + margin), 0);
  const dy = Math.max(Math.abs(cy - py) - (r.height / 2 + margin), 0);
  return 1 - Math.min(Math.hypot(dx, dy) / threshold, 1);
}

/* ------------------------------------------------------------------ */

function NameJoke({ color, active }: { color: string; active: boolean }) {
  const name = "Rodrigo Scharp".toUpperCase();
  const first = name[0];
  const mid = name.slice(1, -1);
  const last = name[name.length - 1];
  const rootRef = useRef<HTMLDivElement>(null);
  const state = useMotionValue(0);
  const busy = useRef(false);
  const [w, setW] = useState(0);
  useEffect(() => {
    setW(rootRef.current?.offsetWidth ?? 0);
  }, []);

  const s = useTransform(state, (v) => v % 2);
  const o = useTransform(s, [0, 0.2, 0.8, 1, 1.2, 1.8, 2], [0, -1, -1, 0, 1, 1, 0]);
  const t = useTransform(s, [0, 0.2, 0.8, 1, 1.2, 1.8, 2], [0, 0, 1, 1, 1, 0, 0]);
  const m = useTransform(s, [0, 0.2, 0.8, 1, 1.2, 1.8, 2], [0, 0, 1, 1, 1, 2, 2]);

  const y1 = useTransform(o, (v) => `translateY(${20 * v}px)`);
  const x1 = useTransform(t, (v) => `translateX(calc(${v * w}px - ${100 * v}%))`);
  const yy1 = useTransform(m, (v) => `translateY(${-10 * Math.sin(v * Math.PI)}px)`);
  const rz1 = useTransform(o, (v) => `rotateZ(${-10 * v}deg)`);
  const rr1 = useTransform(t, (v) => `rotateZ(${360 * v}deg)`);
  const y2 = useTransform(o, (v) => `translateY(${-20 * v}px)`);
  const x2 = useTransform(t, (v) => `translateX(calc(${-v * w}px + ${100 * v}%))`);
  const yy2 = useTransform(m, (v) => `translateY(${10 * Math.sin(v * Math.PI)}px)`);
  const rz2 = useTransform(o, (v) => `rotateZ(${10 * v}deg)`);
  const rr2 = useTransform(t, (v) => `rotateZ(${-360 * v}deg)`);

  const trigger = useCallback(() => {
    if (!active || busy.current) return;
    busy.current = true;
    const k = Math.round(state.get());
    const seq = async () => {
      await animate(state, k + 0.8, { duration: 0.3, ease: easeInOutQuart }).finished;
      await animate(state, k + 1 - 0.2, { duration: 0.6, ease: easeInOutQuart }).finished;
      await animate(state, k + 1, { duration: 0.3, ease: easeInOutQuart }).finished;
      // the letters swap places, then swap back so the name reads right again
      await new Promise((r) => setTimeout(r, 900));
      await animate(state, k + 1.8, { duration: 0.3, ease: easeInOutQuart }).finished;
      await animate(state, k + 2 - 0.2, { duration: 0.6, ease: easeInOutQuart }).finished;
      await animate(state, k + 2, { duration: 0.3, ease: easeInOutQuart }).finished;
      busy.current = false;
    };
    seq();
  }, [active, state]);

  return (
    <div
      ref={rootRef}
      onMouseEnter={trigger}
      onClick={trigger}
      className="inline-flex text-[14px] font-bold uppercase leading-[1.5em] tracking-[2px] min-[1600px]:text-[16px] [&_span]:inline-block"
      style={{ color, transition: `color .65s ${SINE}`, pointerEvents: "auto" }}
    >
      <motion.span style={{ transform: y1 }}>
        <motion.span style={{ transform: x1 }}>
          <motion.span style={{ transform: yy1 }}>
            <motion.span style={{ transform: rz1 }}>
              <motion.span style={{ transform: rr1 }}>{first}</motion.span>
            </motion.span>
          </motion.span>
        </motion.span>
      </motion.span>
      <span style={{ whiteSpace: "pre" }}>{mid}</span>
      <motion.span style={{ transform: y2 }}>
        <motion.span style={{ transform: x2 }}>
          <motion.span style={{ transform: yy2 }}>
            <motion.span style={{ transform: rz2 }}>
              <motion.span style={{ transform: rr2 }}>{last}</motion.span>
            </motion.span>
          </motion.span>
        </motion.span>
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

type FastNavProps = {
  index: number;
  fastIndex: number | null;
  open: boolean;
  wide: boolean;
  onOpen: () => void;
  onHover: (i: number) => void;
  onClose: (commit: boolean) => void;
  onPick: (i: number) => void;
};

function FastNav({ index, fastIndex, open, wide, onOpen, onHover, onClose, onPick }: FastNavProps) {
  const p = useMotionValue(0);
  const skew = useTransform(p, [0, 0.5, 1], [0, 45, 0]);
  const barW = useTransform(p, [0, 0.5, 1], ["0%", "100%", "0%"]);
  const vis = useTransform(p, (v) => (v > 0.5 ? "visible" : "hidden"));
  const count = useRef(20);
  const timer = useRef<number | null>(null);
  const opening = useRef(false);
  const armed = useRef(false);
  const armTimer = useRef<number | null>(null);
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    opening.current = true;
    const a = animate(p, open ? 1 : 0, {
      duration: 0.55,
      ease: [0.2, 0, 0.3, 1],
      onComplete: () => {
        opening.current = false;
      },
    });
    if (open) {
      armed.current = false;
      armTimer.current = window.setTimeout(() => (armed.current = true), 200);
    } else {
      armed.current = false;
    }
    return () => {
      a.stop();
      if (armTimer.current) clearTimeout(armTimer.current);
    };
  }, [open, p]);

  const cur = open ? fastIndex : index;
  const pad = wide ? "8px 50px 8px 0" : "5px 40px 5px 0";
  const bh = wide ? 20 : 16;
  const fs = wide ? 20 : 16;

  return (
    <>
      <div
        className="fixed inset-0 z-[6] cursor-pointer"
        style={{ pointerEvents: open ? "auto" : "none" }}
        onClick={() => onClose(true)}
      />
      <div className="pointer-events-none absolute right-0 top-1/2 z-[7] w-full -translate-y-1/2 px-[6.25%]">
        <div className="flex justify-end">
          <div
            className="flex flex-col items-end justify-center"
            style={{ width: open ? "auto" : 35, pointerEvents: "auto" }}
            onMouseMove={() => {
              count.current++;
              if (count.current > 20 && !timer.current && !openRef.current) {
                timer.current = window.setTimeout(onOpen, 90);
              }
            }}
            onMouseLeave={() => {
              if (timer.current) clearTimeout(timer.current);
              timer.current = null;
              count.current = 20;
              if (openRef.current) onClose(true);
            }}
          >
            {EVENTS.map((e, i) => {
              const isCur = i === cur;
              const labelColor = open ? "#ffffff" : e.ink;
              const bulletColor = open
                ? isCur
                  ? e.accent
                  : "#ffffff"
                : i === index
                  ? EVENTS[index].accent
                  : EVENTS[index].ink;
              return (
                <motion.div
                  key={e.slug}
                  className="relative whitespace-nowrap"
                  style={{
                    padding: pad,
                    marginRight: -10,
                    cursor: "pointer",
                    pointerEvents: open ? "auto" : "none",
                    color: labelColor,
                    opacity: isCur ? 1 : 0.4,
                    skewX: skew,
                    transition: `color ${open ? 0.1 : 0.65}s ${SINE}, opacity ${open ? 0.1 : 0.65}s ${SINE}`,
                  }}
                  onMouseEnter={() => {
                    if (armed.current && !opening.current) onHover(i);
                  }}
                  onClick={() => armed.current && onPick(i)}
                >
                  <motion.div
                    className="font-bold uppercase leading-[1.5em] tracking-[1px]"
                    style={{ fontSize: fs, visibility: vis }}
                  >
                    {e.title}
                  </motion.div>
                  <motion.div
                    className="absolute right-[10px] top-1/2 rounded-[4px]"
                    style={{
                      minWidth: 8,
                      height: bh,
                      width: barW,
                      y: "-50%",
                      background: bulletColor,
                      transition: `background-color ${open ? 0.1 : 0.65}s ${SINE}`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Loader({
  progress,
  leaving,
  teaser,
}: {
  progress: MotionValue<number>;
  leaving: boolean;
  teaser: string;
}) {
  const barH = useTransform(progress, (v) => `${v * 100}%`);
  const fillClip = useTransform(progress, (v) => `inset(${100 * (1 - v)}% 0 0 0)`);
  const clip = useMotionValue(0);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!leaving) return;
    const a = animate(clip, 100, {
      duration: 1,
      ease: [0.6, 0, 0.18, 1],
    });
    return () => a.stop();
  }, [leaving, clip]);
  const path = useTransform(clip, (v) => `inset(0 0 0 ${v}%)`);

  const item = (i: number) => ({
    opacity: entered ? 1 : 0,
    transform: entered ? "translateY(0)" : "translateY(30px)",
    transition: `opacity .37s ease-out ${i * 0.2}s, transform .37s ease-out ${i * 0.2}s`,
  });

  return (
    <motion.div
      className="absolute inset-0 z-[10] overflow-hidden"
      style={{ clipPath: path, cursor: leaving ? "auto" : "wait" }}
    >
      <motion.div
        className="absolute bottom-0 left-0 w-[10px]"
        style={{ height: barH, background: LOADER_ACCENT }}
      />
      <div className="flex h-full flex-col items-start justify-between px-[6.25%] py-[70px] min-[1600px]:py-[90px]">
        <div>
          <div className="relative" style={item(0)}>
            <h1
              className="events-title text-[clamp(3rem,7vw,6.6rem)] leading-none"
              style={{ color: "transparent", WebkitTextStroke: `2px ${LOADER_ACCENT}` }}
            >
              Events
            </h1>
            <motion.div
              aria-hidden
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: fillClip }}
            >
              <span
                className="block events-title text-[clamp(3rem,7vw,6.6rem)] leading-none"
                style={{ color: LOADER_ACCENT }}
              >
                Events
              </span>
            </motion.div>
          </div>
          <p
            className="mt-2 text-[14px] font-bold uppercase tracking-[2px] text-white min-[1600px]:text-[16px]"
            style={item(1)}
          >
            Conferences · Summits · Forums
          </p>
        </div>
        <p
          className="max-w-[450px] rounded-[31.5px] rounded-bl-none border border-white/5 bg-white/10 px-[30px] py-[22px] text-[18px] leading-[1.5em] text-white"
          style={item(2)}
        >
          {teaser}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

const enterV = {
  hidden: (w: number) => ({ opacity: 0, y: 25 * w }),
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutQuad } },
  exit: (w: number) => ({
    opacity: 0,
    y: -25 * w,
    transition: { duration: 0.32, ease: easeInQuad },
  }),
};

export default function EventsShow() {
  const vp = useViewport();
  const wide = vp.w >= 1600;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<EventsScene | null>(null);
  const fillRefs = useRef(new Map<number, HTMLElement>());
  const barRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const ctaRefs = useRef(new Map<number, HTMLElement>());
  const homeRef = useRef<HTMLAnchorElement>(null);
  const pointer = useRef({ x: -9999, y: -9999 });
  const prox = useRef({ cta: 0, home: 0 });
  const wheel = useRef({ acc: 0, on: false, timer: 0 as unknown as number });
  const lethargy = useRef(new Lethargy(10, 2, 0.1));
  const indexRef = useRef(0);
  const phaseRef = useRef<Phase>("loading");
  const fastRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("loading");
  const progress = useMotionValue(0);
  const [failed, setFailed] = useState(false);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(0);
  const [shownDelta, setShownDelta] = useState(1);
  const [fastOpen, setFastOpen] = useState(false);
  const [fastIndex, setFastIndex] = useState<number | null>(null);
  const [teaser, setTeaser] = useState(TEASERS[0]);

  useEffect(() => {
    phaseRef.current = phase;
    fastRef.current = fastIndex;
  }, [phase, fastIndex]);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setTeaser(TEASERS[Math.floor(Math.random() * TEASERS.length)]),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const cur = EVENTS[index];
  const shownEv = EVENTS[shown];

  /* -------- scene lifecycle -------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    let scene: EventsScene;
    try {
      scene = new EventsScene(canvas, items);
    } catch {
      queueMicrotask(() => setFailed(true));
      return;
    }
    sceneRef.current = scene;
    scene.onQuads = (quads) => {
      fillRefs.current.forEach((el, idx) => {
        const q = quads[idx];
        if (!q) return;
        el.style.clipPath = `polygon(0 0, ${q[1].x}% 0%, ${q[1].x}% ${q[1].y}%, ${q[0].x}% ${q[0].y}%, ${q[2].x}% ${q[2].y}%, ${q[3].x}% ${q[3].y}%, ${q[3].x}% 100%, 0% 100%)`;
      });
    };
    scene.onFrame = () => {
      const { x, y } = pointer.current;
      const cta = ctaRefs.current.get(indexRef.current) ?? null;
      const tCta = phaseRef.current === "home" && fastRef.current === null ? proximity(cta, x, y) : 0;
      const tHome = proximity(homeRef.current, x, y);
      prox.current.cta += (tCta - prox.current.cta) * 0.2;
      prox.current.home += (tHome - prox.current.home) * 0.2;
      if (barRef.current) barRef.current.style.width = `${10 + prox.current.cta * 10}px`;
      if (edgeRef.current) edgeRef.current.style.transform = `translate3d(${-100 * prox.current.home}%,0,0)`;
    };
    scene.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);

    const start = performance.now();
    let alive = true;
    let controls: { stop: () => void } | null = null;
    scene
      .init()
      .then(async () => {
        if (!alive) return;
        await document.fonts.ready;
        if (!alive) return;
        // the loader always plays for a moment so its choreography reads
        const spent = performance.now() - start;
        controls = animate(progress, 1, {
          duration: Math.max(1.6, 2.4 - spent / 1000),
          ease: [0.45, 0, 0.25, 1],
          onUpdate: (v) => scene.setLoadingProgress(v),
          onComplete: () => {
            window.setTimeout(() => {
              if (!alive) return;
              scene.reveal();
              setPhase("revealing");
              window.setTimeout(() => alive && setPhase("home"), 1000);
            }, 250);
          },
        });
      })
      .catch(() => setFailed(true));

    const onResize = () => scene.resize(window.innerWidth, window.innerHeight, window.devicePixelRatio || 1);
    window.addEventListener("resize", onResize);
    return () => {
      alive = false;
      controls?.stop();
      window.removeEventListener("resize", onResize);
      scene.dispose();
      sceneRef.current = null;
    };
  }, [progress]);

  /* -------- navigation -------- */
  const go = useCallback((to: number, immediateText = false) => {
    const next = Math.max(0, Math.min(N - 1, to));
    if (next === indexRef.current) return;
    const delta = next - indexRef.current;
    indexRef.current = next;
    setIndex(next);
    sceneRef.current?.setIndex(next);
    const w = Math.sign(delta) * (Math.abs(delta / 6) + 0.7);
    if (immediateText) {
      setShownDelta(w);
      setShown(next);
    } else {
      window.setTimeout(() => {
        setShownDelta(w);
        setShown(indexRef.current);
      }, 350);
    }
  }, []);

  useEffect(() => {
    const endGesture = () => {
      const g = wheel.current;
      if (!g.on) return;
      g.on = false;
      clearTimeout(g.timer);
      const steps = Math.round(Math.abs(g.acc) / 0.4);
      const dir = g.acc > 0 ? 1 : -1;
      g.acc = 0;
      sceneRef.current?.setWheelOffset(0);
      if (steps >= 1) go(indexRef.current + dir);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (phaseRef.current !== "home" || fastRef.current !== null) return;
      let y = e.deltaY;
      if (e.deltaMode === 1) y *= 50;
      const genuine = lethargy.current.check(e);
      const g = wheel.current;
      if (genuine) {
        clearTimeout(g.timer);
        g.acc += y * 0.0023;
        g.on = true;
        sceneRef.current?.setWheelOffset(g.acc);
        g.timer = window.setTimeout(endGesture, 100);
      } else if (g.on) {
        endGesture();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "home" || fastRef.current !== null) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(indexRef.current + 1);
      } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(indexRef.current - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(N - 1);
    };
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      sceneRef.current?.setPointer(e.clientX, e.clientY);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointermove", onMove);
    };
  }, [go]);

  /* -------- fast nav -------- */
  const openFast = useCallback(() => {
    if (phaseRef.current !== "home") return;
    setFastIndex(indexRef.current);
    setFastOpen(true);
    sceneRef.current?.setFastNav(indexRef.current);
  }, []);
  const hoverFast = useCallback((i: number) => {
    setFastIndex(i);
    sceneRef.current?.setFastNav(i);
  }, []);
  const closeFast = useCallback(
    (commit: boolean) => {
      const target = fastRef.current;
      if (!fastOpen) return;
      if (commit && target !== null) go(target, true);
      setFastOpen(false);
      window.setTimeout(() => {
        setFastIndex(null);
        sceneRef.current?.setFastNav(null);
      }, 50);
    },
    [fastOpen, go],
  );
  const pickFast = useCallback(
    (i: number) => {
      go(i, true);
      setFastOpen(false);
      window.setTimeout(() => {
        setFastIndex(null);
        sceneRef.current?.setFastNav(null);
      }, 50);
    },
    [go],
  );

  const bg = fastOpen ? LIMBO : phase === "loading" ? LOADER_BG : cur.bg;
  const ready = phase !== "loading";
  const previewH = 0.098125 * vp.w;

  if (failed) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-[#0d0d0d] px-6 text-center text-white">
        <p>
          Este navegador não conseguiu iniciar o WebGL.{" "}
          <Link href="/" className="underline">
            Voltar ao portfólio
          </Link>
        </p>
      </div>
    );
  }

  const titleStyle = (fill: boolean, color: string, len: number): React.CSSProperties => ({
    fontFamily: "var(--font-archivo), sans-serif",
    fontWeight: 900,
    fontStretch: "100%",
    letterSpacing: "-0.03em",
    fontSize: len <= 8 ? "7vw" : len <= 11 ? "6.1vw" : "5.3vw",
    lineHeight: "1em",
    marginBottom: "0.91vw",
    color: fill ? color : "transparent",
    WebkitTextStroke: fill ? "0.02em currentColor" : `2px ${color}`,
    whiteSpace: "nowrap",
  });

  const block = (ev: (typeof EVENTS)[number], idx: number, fill: boolean) => (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        paddingTop: 52,
        paddingBottom: 50 + previewH,
        paddingLeft: "6.25%",
        paddingRight: "6.25%",
      }}
    >
      <div>
        <div style={titleStyle(fill, ev.accent, ev.title.length)}>{ev.title}</div>
        <div
          className={`${wide ? "text-[24px]" : "text-[20px]"} font-normal leading-[1.6em]`}
          style={{ maxWidth: wide ? 700 : 580, visibility: fill ? "hidden" : "visible" }}
        >
          {ev.text}
        </div>
        <div
          ref={(el) => {
            if (fill) return;
            if (el) ctaRefs.current.set(idx, el);
            else ctaRefs.current.delete(idx);
          }}
          className={`inline-flex items-center gap-[0.62em] font-bold uppercase leading-[1.5em] tracking-[2px] ${
            wide ? "text-[20px]" : "text-[16px]"
          }`}
          style={{ marginTop: wide ? 54 : 34, visibility: fill ? "hidden" : "visible" }}
        >
          {ev.place} · {ev.date}
          <span style={{ color: ev.accent }}>✦</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 select-none overflow-hidden font-[family-name:var(--font-poppins)] text-white"
      style={{ background: LOADER_BG }}
    >
      {/* background */}
      <div
        className="absolute inset-0"
        style={{
          background: bg,
          transition: `background-color ${fastOpen ? 0.4 : 0.65}s ${SINE}`,
        }}
      />

      {/* canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] h-full w-full" />

      {/* left bar */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 top-0 z-[2] w-[10px]"
        style={{
          background: fastOpen ? "transparent" : cur.accent,
          transition: `background-color .65s ${SINE}`,
          opacity: ready ? 1 : 0,
        }}
      />

      {/* home UI: enters from the left while the loader wipes away */}
      <motion.div
        className="absolute inset-0 z-[3]"
        initial={false}
        animate={{ x: ready ? "0%" : "-5%", opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, ease: [0.6, 0, 0.18, 1] }}
      >
      {/* text layers */}
      <motion.div
        className="absolute inset-0"
        style={{ color: shownEv.ink }}
        animate={{ opacity: fastOpen ? 0 : 1 }}
        transition={{ duration: 0.2, delay: fastOpen ? 0 : 0.1 }}
      >
        <AnimatePresence custom={shownDelta} initial={false}>
          <motion.div
            key={shown}
            custom={shownDelta}
            variants={enterV}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0"
            style={{ color: shownEv.ink }}
          >
            <div
              ref={(el) => {
                if (el) fillRefs.current.set(shown, el);
                else fillRefs.current.delete(shown);
              }}
              className="absolute inset-0"
              style={{ pointerEvents: "none" }}
            >
              {block(shownEv, shown, true)}
            </div>
            <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
              {block(shownEv, shown, false)}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* header */}
      <motion.div
        className="absolute inset-x-0 top-0 z-[5] flex h-[90px] items-center justify-between px-[6.25%]"
        style={{ color: cur.ink }}
        animate={{ opacity: fastOpen ? 0 : 1 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.4, 1] }}
      >
        <NameJoke color={cur.ink} active={phase === "home"} />
        <Link
          ref={homeRef}
          href="/"
          className="text-[14px] font-bold uppercase leading-[1.5em] tracking-[2px] min-[1600px]:text-[16px]"
          style={{ color: cur.ink, transition: `color .65s ${SINE}`, pointerEvents: "auto" }}
        >
          Home
        </Link>
      </motion.div>

      {/* right edge indicator, slides in as the pointer nears "Home" */}
      <div
        ref={edgeRef}
        className="pointer-events-none fixed left-full top-0 z-[5] h-screen w-[20px]"
        style={{ background: cur.ink, willChange: "transform" }}
      />

      {/* fast navigation */}
      {phase === "home" && (
        <FastNav
          index={index}
          fastIndex={fastIndex}
          open={fastOpen}
          wide={wide}
          onOpen={openFast}
          onHover={hoverFast}
          onClose={closeFast}
          onPick={pickFast}
        />
      )}
      </motion.div>

      {/* loader */}
      {phase !== "home" && <Loader progress={progress} leaving={phase === "revealing"} teaser={teaser} />}
    </div>
  );
}
