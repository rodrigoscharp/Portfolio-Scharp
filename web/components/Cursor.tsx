"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/* Frosted-lens cursor: a large blurred circle that trails the pointer, swells over
   interactive elements and shows a rotating "SCROLL" ring while over the hero. */
export default function Cursor() {
  const reduce = useReducedMotion();
  const path = usePathname();
  const off = path === "/events";
  const [shown, setShown] = useState(false);
  const [mode, setMode] = useState<"idle" | "hover" | "hero">("idle");
  const [down, setDown] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 140, damping: 20, mass: 0.7 });

  useEffect(() => {
    if (off || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      if (reduce) {
        sx.jump(e.clientX);
        sy.jump(e.clientY);
      }
      setShown(true);
      const t = e.target as Element | null;
      if (t?.closest("a,button,[role=switch],[data-cursor=hover]")) setMode("hover");
      else if (t?.closest("#top")) setMode("hero");
      else setMode("idle");
    };
    const leave = () => setShown(false);
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y, sx, sy, reduce, off]);

  if (off) return null;

  const scale = down ? 0.75 : mode === "hover" ? 1.45 : mode === "hero" ? 1.1 : 0.85;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-[60px] -mt-[60px] grid h-[120px] w-[120px] place-items-center rounded-full bg-bg/45 backdrop-blur-[6px]"
        animate={{ scale, opacity: shown ? 0.92 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {mode === "hero" && (
          <svg
            viewBox="0 0 120 120"
            className="h-full w-full animate-[sticker-spin_10s_linear_infinite]"
          >
            <defs>
              <path id="ring" d="M60 60 m-40 0 a40 40 0 1 1 80 0 a40 40 0 1 1 -80 0" />
            </defs>
            <text
              fill="#030309"
              fontSize="10"
              fontWeight="500"
              letterSpacing="3.2"
              style={{ textTransform: "uppercase" }}
            >
              <textPath href="#ring">✦ Scroll ✦ Scroll ✦ Scroll ✦ Scroll</textPath>
            </text>
          </svg>
        )}
      </motion.div>
    </motion.div>
  );
}
