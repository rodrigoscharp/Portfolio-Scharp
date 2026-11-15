"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/* Syntax-coloured lines of the "back-end" behind the hero. t: token kind. */
type Tok = [string, "k" | "t" | "s" | "c" | "n" | "p" | "f"];
const CODE: Tok[][] = [
  [["// what you see is the interface. this is what I build.", "c"]],
  [["@Service", "k"]],
  [["public class ", "k"], ["RodrigoScharp", "t"], [" implements ", "k"], ["SoftwareEngineer", "t"], [" {", "p"]],
  [["  private final ", "k"], ["List", "t"], ["<", "p"], ["System", "t"], ["> shipped = ", "p"], ["List", "t"], [".of(", "p"], ["muno", "f"], [", ", "p"], ["campo", "f"], [", ", "p"], ["myHub", "f"], [", ", "p"], ["orbz", "f"], [");", "p"]],
  [["  private final ", "k"], ["int", "t"], [" restaurants = ", "p"], ["120", "n"], [";  ", "p"], ["// and counting", "c"]],
  [["  private final ", "k"], ["int", "t"], [" citizens = ", "p"], ["100_000", "n"], [";", "p"]],
  [["", "p"]],
  [["  @Transactional", "k"]],
  [["  public ", "k"], ["Product", "t"], [" build", "f"], ["(", "p"], ["Idea", "t"], [" idea) {", "p"]],
  [["    var", "k"], [" design = ", "p"], ["architect", "f"], ["(idea, ", "p"], ["Scale", "t"], [".", "p"], ["REAL_USERS", "n"], [");", "p"]],
  [["    return ", "k"], ["deploy", "f"], ["(design, ", "p"], ["Region", "t"], [".", "p"], ["SA_EAST_1", "n"], [");", "p"]],
  [["  }", "p"]],
  [["}", "p"]],
  [["", "p"]],
  [["SELECT", "k"], [" tenant, ", "p"], ["count", "f"], ["(*) ", "p"], ["FROM", "k"], [" orders ", "p"], ["WHERE", "k"], [" tenant_id = ", "p"], ["current_tenant", "f"], ["()", "p"]],
  [["INSERT INTO", "k"], [" inbox (source, key) ", "p"], ["ON CONFLICT DO NOTHING", "k"], [";  ", "p"], ["-- exactly once", "c"]],
  [["", "p"]],
  [["$ ", "c"], ["docker compose up -d", "s"], ["  ", "p"], ["✓ postgres  ✓ kafka  ✓ api", "f"]],
  [["$ ", "c"], ["./mvnw verify", "s"], ["  ", "p"], ["BUILD SUCCESS", "n"], ["  · 127 tests · p99 16.5 ms", "c"]],
];

const COLOR: Record<Tok[1], string> = {
  k: "#ff7a3a",
  t: "#7fd3c4",
  s: "#b9e27a",
  c: "#7d7a72",
  n: "#ffd25e",
  p: "#e9e4d8",
  f: "#b98bff",
};

/* X-ray lens over the hero: the title is the interface; inside the lens you
   see the back-end behind it. Follows the mouse; on touch it drifts on its own. */
export default function XRay({ children }: { children?: React.ReactNode }) {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const r = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26 });
  const sy = useSpring(y, { stiffness: 220, damping: 26 });
  const sr = useSpring(r, { stiffness: 160, damping: 20 });
  const clip = useMotionTemplate`circle(${sr}px at ${sx}px ${sy}px)`;
  const rim = useMotionTemplate`${sr}px`;

  useEffect(() => {
    const el = host.current?.parentElement;
    if (!el || reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const size = () => Math.max(80, Math.min(140, el.clientWidth * 0.09));

    if (!fine) {
      // Touch: a smaller lens drifts slowly across the title on its own.
      r.set(size() * 0.7);
      const c = animate(0, 1, {
        duration: 14,
        repeat: Infinity,
        ease: "linear",
        onUpdate: (u) => {
          const a = u * Math.PI * 2;
          x.set(el.clientWidth * (0.5 + 0.36 * Math.sin(a)));
          y.set(el.clientHeight * (0.48 + 0.18 * Math.sin(a * 2)));
        },
      });
      return () => c.stop();
    }

    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      x.set(e.clientX - b.left);
      y.set(e.clientY - b.top);
      const overUi = (e.target as Element | null)?.closest("a,button,[role=switch]");
      r.set(overUi ? 0 : size());
    };
    const enter = () => (document.documentElement.dataset.xray = "on");
    const leave = () => {
      r.set(0);
      delete document.documentElement.dataset.xray;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      delete document.documentElement.dataset.xray;
    };
  }, [reduce, r, x, y]);

  if (reduce) return null;

  return (
    <div ref={host} aria-hidden className="pointer-events-none absolute inset-0 z-20">
      <motion.div className="absolute inset-0 overflow-hidden bg-[#0e0e13]" style={{ clipPath: clip, WebkitClipPath: clip }}>
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* the code runs underneath, dimmed, behind the blueprint of the page */}
        <pre className="absolute inset-0 flex flex-col justify-center whitespace-pre px-[clamp(20px,7vw,110px)] font-mono text-[clamp(12px,1.2vw,18px)] leading-[1.75] opacity-50">
          {CODE.map((line, i) => (
            <span key={i} className="block min-h-[1.75em]">
              {line.map(([text, kind], k) => (
                <span key={k} style={{ color: COLOR[kind] ?? COLOR.p }}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </pre>
        {children}
      </motion.div>
      {/* Lens rim */}
      <motion.div
        className="absolute rounded-full border border-[#ff7a3a]/70 shadow-[0_0_0_1px_rgba(255,122,58,.15),0_0_40px_rgba(255,122,58,.25)]"
        style={{ left: sx, top: sy, width: rim, height: rim, x: "-50%", y: "-50%", scale: 2 }}
      />
    </div>
  );
}
