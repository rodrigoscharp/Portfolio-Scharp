"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimationControls, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { INTRO_SECONDS, introPending } from "@/lib/intro";

/* Beto, the coordinator of my AI team, gives the tour of the home page. He
   stays on one side, follows the scroll pointing at each section, and when the
   "My AI Staff" title comes into view he flies back to his empty seat on the
   3D stage, where the 3D Beto pops in. */

/* Where Beto stands around the element he is talking about:
   ax/ay is the anchor on the target box (0..1), dx/dy a pixel nudge, and
   point the direction his hand points. */
type Point = "left" | "right" | "up" | "down";
type Step = { id: string; target: string; ax: number; ay: number; dx: number; dy: number; point: Point; en: string; pt: string };

const STEPS: Step[] = [
  { id: "top", target: "#top h1", ax: 1, ay: 0, dx: -40, dy: -70, point: "down", en: "Hi! I'm Beto, Rodrigo's coordinator. Come, I'll show you around!", pt: "Oi! Eu sou o Beto, coordenador do Rodrigo. Vem, eu te mostro tudo!" },
  { id: "about", target: "#about p", ax: 0.12, ay: 1, dx: 0, dy: 40, point: "up", en: "This is Rodrigo. Back-end engineer, shipping since 2023.", pt: "Esse é o Rodrigo. Engenheiro back-end, entregando desde 2023." },
  { id: "skills", target: "#skills", ax: 1, ay: 0.55, dx: 20, dy: 0, point: "left", en: "These are his skills: the stack he works with every day.", pt: "Essas são as skills dele: a stack que ele usa todo dia." },
  { id: "impact", target: "#impact ul", ax: 0.5, ay: 0, dx: 0, dy: -64, point: "down", en: "Real numbers, from systems running in production right now.", pt: "Números reais, de sistemas rodando em produção agora." },
  { id: "work", target: "#work article", ax: 0, ay: 0.62, dx: -30, dy: 0, point: "right", en: "And these are products he built himself, as founder, CEO and CTO. Hover them!", pt: "E esses são produtos que ele mesmo criou, como founder, CEO e CTO. Passa o mouse!" },
  { id: "team", target: "#team h2", ax: 1, ay: 0.5, dx: 30, dy: 0, point: "left", en: "This is a little bit of him… and this is his team. Mine too! Bye!", pt: "Isso é um pouquinho dele… e esse é o time dele. O meu também! Tchau!" },
];

/* Both hands per direction (the drawing points right): pointing down or up
   they sit on each side of his body; pointing sideways they stack. */
type HandSpot = { pos: string; rot: number; flip: boolean; delay: number };
const HANDS: Record<Point, HandSpot[]> = {
  right: [
    { pos: "left-[86%] top-[30%]", rot: -12, flip: false, delay: 0 },
    { pos: "left-[82%] top-[58%]", rot: 12, flip: false, delay: 0.15 },
  ],
  left: [
    { pos: "left-[-38%] top-[30%]", rot: 12, flip: true, delay: 0 },
    { pos: "left-[-34%] top-[58%]", rot: -12, flip: true, delay: 0.15 },
  ],
  up: [
    { pos: "left-[-18%] top-[2%]", rot: -110, flip: false, delay: 0 },
    { pos: "left-[66%] top-[2%]", rot: -70, flip: false, delay: 0.15 },
  ],
  down: [
    { pos: "left-[-16%] top-[62%]", rot: 115, flip: false, delay: 0 },
    { pos: "left-[64%] top-[62%]", rot: 65, flip: false, delay: 0.15 },
  ],
};

const POKES = [
  { en: "Hey, that tickles!", pt: "Ei, isso faz cócegas!" },
  { en: "Keep scrolling, it gets better.", pt: "Continua rolando, fica melhor." },
  { en: "I'm the one who keeps his day in order.", pt: "Sou eu que deixo o dia dele em ordem." },
];

const KEY = "beto-tour-closed";
const GREEN = "#45967a";
const GREEN_LIGHT = "#6ccbb0";
const HAND_PATH =
  "M46 13.5H24.5l3.2-4.6a3 3 0 0 0-4.6-3.7L12.6 15A6 6 0 0 0 11 19v3.5A7.5 7.5 0 0 0 18.5 30H30a4 4 0 0 0 4-4 3.8 3.8 0 0 0 3-3.7 3.8 3.8 0 0 0 2-3.3V19h7a2.75 2.75 0 0 0 0-5.5Z";

/* Pointing hand in Beto's own fur: filled with his texture (cropped from his
   body) and given a fuzzy edge, so it reads as part of him. */
function Hand({ className = "", id }: { className?: string; id: string }) {
  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden overflow="visible">
      <defs>
        <pattern id={`fur-${id}`} patternUnits="userSpaceOnUse" width="48" height="48" x="-6" y="-14">
          <image href="/images/orbz/beto.png" x="-30" y="-46" width="110" height="110" preserveAspectRatio="none" />
        </pattern>
        <filter id={`fuzz-${id}`} x="-20%" y="-30%" width="140%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.8" />
        </filter>
        <radialGradient id={`shade-${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity=".18" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </radialGradient>
      </defs>
      <g filter={`url(#fuzz-${id})`}>
        <path d={HAND_PATH} fill={GREEN_LIGHT} />
        <path d={HAND_PATH} fill={`url(#fur-${id})`} />
        <path d={HAND_PATH} fill={`url(#shade-${id})`} />
      </g>
      <path d="M30 26h-6M37 22.3h-7M39 19h-8" stroke={GREEN} strokeOpacity=".55" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function BetoGuide() {
  const reduce = useReducedMotion();
  const { t, lang } = useLang();
  const [step, setStep] = useState(0);
  const [home, setHome] = useState(false);
  const [closed, setClosed] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [poke, setPoke] = useState<number | null>(null);
  const fly = useAnimationControls();
  const flying = useRef(false);

  // Read after mount so server and client render the same first frame.
  useEffect(() => {
    let skip = false;
    try {
      skip = sessionStorage.getItem(KEY) === "1";
    } catch {}
    // The stage keeps Beto's seat empty while he is out giving the tour.
    if (!skip) window.dispatchEvent(new Event("beto-away"));
    const id = window.setTimeout(() => setClosed(skip), introPending() ? (INTRO_SECONDS + 0.9) * 1000 : 900);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Which section is under the middle of the screen; the Orbz step starts as
  // soon as the "My AI Staff" title enters the lower part of the screen.
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.5;
      let found = 0;
      STEPS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top < (s.id === "team" ? window.innerHeight * 0.4 : mid)) found = i;
      });
      setStep(found);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Follow the target on screen: anchor point on its box, clamped to the viewport.
  // Springs make him travel around the page instead of jumping.
  const size = mobile ? 64 : 100;
  const px = useMotionValue(-200);
  const py = useMotionValue(-200);
  const sx = useSpring(px, { stiffness: 55, damping: 14 });
  const sy = useSpring(py, { stiffness: 55, damping: 14 });
  // Bubble placement: beside him on wide screens; above or below (and aligned
  // to whichever edge keeps it on screen) on phones.
  const [bubbleSide, setBubbleSide] = useState("left");
  // On phones the bubble is shifted sideways so it never leaves the screen.
  const bubbleDx = useMotionValue(0);
  useEffect(() => {
    if (closed) return;
    let raf = 0;
    const place = () => {
      // Hold still while flying home: the flight is relative to this spot.
      if (flying.current) return;
      const st = STEPS[step];
      const el = document.querySelector(st.target);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = vw - size - 24;
      let y = vh * 0.3;
      if (el) {
        const r = el.getBoundingClientRect();
        x = r.left + r.width * st.ax + st.dx - size / 2;
        y = r.top + r.height * st.ay + st.dy - size / 2;
        // Side anchors sit just outside the box.
        if (st.ax === 1) x += size / 2;
        if (st.ax === 0) x -= size / 2;
      }
      x = Math.min(Math.max(x, 12), vw - size - 12);
      y = Math.min(Math.max(y, 76), vh - size - 24);
      px.set(x);
      py.set(y);
      // First placement: appear in place instead of flying in from off screen.
      if (sx.get() < -100) {
        sx.jump(x);
        sy.jump(y);
      }
      const side = mobile
        ? `${y > vh * 0.45 ? "above" : "below"}-${x + size / 2 > vw * 0.5 ? "r" : "l"}`
        : x > vw * 0.5
          ? "left"
          : "right";
      setBubbleSide((p) => (p === side ? p : side));
      if (mobile) {
        const bw = Math.min(vw * 0.76, 280);
        const left = side.endsWith("-r") ? x + size - bw : x;
        bubbleDx.set(Math.min(Math.max(left, 12), vw - 12 - bw) - left);
      } else bubbleDx.set(0);
    };
    // Re-placed only when something can move him: scroll, resize, or the page
    // settling (images, fonts); one measurement per frame at most.
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        place();
      });
    };
    place();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const settle = window.setInterval(schedule, 600);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [step, closed, mobile, size, px, py, sx, sy, bubbleDx]);

  // He points once he has arrived next to the section, for as long as he is
  // explaining it, then puts his hands away.
  const [pointing, setPointing] = useState(false);
  useEffect(() => {
    // The greeting in the hero is not pointing at anything yet.
    if (closed || STEPS[step].id === "top") return;
    const on = window.setTimeout(() => setPointing(true), 700);
    const off = window.setTimeout(() => setPointing(false), 4200);
    return () => {
      window.clearTimeout(on);
      window.clearTimeout(off);
      setPointing(false);
    };
  }, [step, closed]);

  // Typewriter, counted per line so a new line restarts it.
  const [chars, setChars] = useState({ key: "", n: 0 });
  const line = poke !== null ? t(POKES[poke].en, POKES[poke].pt) : t(STEPS[step].en, STEPS[step].pt);
  const lineKey = `${step}-${poke}-${lang}`;
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setChars((p) => {
        const n = (p.key === lineKey ? p.n : 0) + 2;
        if (n >= line.length) window.clearInterval(id);
        return { key: lineKey, n };
      });
    }, 26);
    return () => window.clearInterval(id);
  }, [lineKey, line.length, reduce]);
  const typed = reduce ? line : line.slice(0, chars.key === lineKey ? chars.n : 0);

  // A poke line lasts a moment, then the tour line comes back.
  useEffect(() => {
    if (poke === null) return;
    const id = window.setTimeout(() => setPoke(null), 2600);
    return () => window.clearTimeout(id);
  }, [poke]);

  // At the Orbz: say goodbye, fly into the empty seat, and let the 3D Beto pop in.
  const atTeam = STEPS[step].id === "team";
  useEffect(() => {
    if (!atTeam || home || flying.current || closed) return;
    const id = window.setTimeout(async () => {
      const stage = document.querySelector("#team iframe") as HTMLElement | null;
      const guide = document.getElementById("beto-guide");
      if (!stage || !guide) {
        window.dispatchEvent(new Event("beto-home"));
        return setHome(true);
      }
      const s = stage.getBoundingClientRect();
      const g = guide.getBoundingClientRect();
      // Beto's seat: first Orb from the left on the stage.
      const tx = s.left + s.width * 0.14 - (g.left + g.width / 2);
      const ty = s.top + s.height * 0.5 - (g.top + g.height / 2);
      flying.current = true;
      await fly.start({
        x: [0, tx * 0.45, tx],
        y: [0, Math.min(ty, 0) - 120, ty],
        rotate: [0, -25, -360],
        scale: [1, 1.15, 0.7],
        transition: { duration: reduce ? 0.01 : 1.3, ease: "easeInOut" },
      });
      window.dispatchEvent(new Event("beto-home"));
      await fly.start({ opacity: 0, scale: 0.3, transition: { duration: 0.2 } });
      flying.current = false;
      setHome(true);
      fly.set({ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });
    }, reduce ? 200 : 1400);
    return () => window.clearTimeout(id);
  }, [atTeam, home, fly, reduce, closed]);

  const skip = () => {
    setClosed(true);
    window.dispatchEvent(new Event("beto-home"));
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
  };

  // Once he is home the tour is over for this page view.
  if (closed || home) return null;
  const hands = HANDS[STEPS[step].point];
  const BUBBLE: Record<string, string> = {
    left: "right-[calc(100%+56px)] top-0",
    right: "left-[calc(100%+56px)] top-0",
    "above-l": "left-0 bottom-[calc(100%+30px)]",
    "above-r": "right-0 bottom-[calc(100%+30px)]",
    "below-l": "left-0 top-[calc(100%+34px)]",
    "below-r": "right-0 top-[calc(100%+34px)]",
  };
  const bubbleCls = BUBBLE[bubbleSide] ?? BUBBLE.left;

  return (
    <AnimatePresence>
      <motion.div
        key="beto"
        className="pointer-events-none fixed left-0 top-0 z-[45]"
        style={{ x: sx, y: sy }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div id="beto-guide" animate={fly} className="relative" style={{ width: size, height: size }}>
          {/* soft shadow on the page, shrinking as he floats up */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-[108%] h-[14%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-[6px]"
            animate={reduce ? undefined : { scaleX: [1, 0.72, 1], opacity: [0.55, 0.3, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* a hop each time the line changes */}
          <motion.div
            key={step}
            animate={reduce ? undefined : { y: [0, -18, 0, -6, 0], rotate: [0, -10, 5, -4, 0] }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {/* idle: float and sway; hover and click get a reaction */}
            <motion.button
              type="button"
              aria-label="Beto"
              onClick={() => setPoke((p) => ((p ?? -1) + 1) % POKES.length)}
              className="pointer-events-auto block cursor-pointer"
              animate={reduce ? undefined : { y: [0, -9, 0], rotate: [-6, 2, -6] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={reduce ? undefined : { scale: 1.12, rotate: -14 }}
              whileTap={{ scale: 0.9 }}
            >
              <Image src="/images/orbz/beto.png" alt="" width={size} height={size} priority />
            </motion.button>
            {/* hands only come out while he is pointing at something */}
            <AnimatePresence>
              {pointing &&
                hands.map((h, k) => (
                  <motion.span
                    key={`${step}-${k}`}
                    aria-hidden
                    className={`absolute block w-[44%] ${h.pos}`}
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.3, delay: h.delay, ease: [0.2, 0.9, 0.3, 1.2] }}
                  >
                    <motion.span
                      className="block"
                      style={{ rotate: h.rot }}
                      animate={reduce ? undefined : { x: h.flip ? [0, -7, 0] : [0, 7, 0] }}
                      transition={{ duration: 0.9, delay: h.delay, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Hand id={`h${k}`} className={`w-full drop-shadow-[0_3px_3px_rgba(0,0,0,.2)] ${h.flip ? "-scale-x-100" : ""}`} />
                    </motion.span>
                  </motion.span>
                ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* speech bubble, on whichever side has room */}
        <motion.div
          key={`b${lineKey}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{ x: bubbleDx }}
          className={`pointer-events-auto absolute w-[min(76vw,280px)] rounded-2xl border border-ink bg-bg px-4 py-3 text-[14px] leading-snug shadow-[0_18px_40px_-18px_rgba(0,0,0,.45)] ${bubbleCls}`}
        >
          <p className="min-h-[2.6em]">{typed}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-ink-soft">
            <span>
              Beto · tour {step + 1}/{STEPS.length}
            </span>
            <button type="button" onClick={skip} className="rounded-full px-2 py-0.5 hover:bg-ink hover:text-bg">
              {t("Skip ×", "Pular ×")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
