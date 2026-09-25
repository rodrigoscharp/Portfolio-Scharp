"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* Inline "O" replacement: a chunky 3D switch sized in em so it tracks the display type. */
export default function Toggle3D() {
  const [on, setOn] = useState(false);

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Toggle"
      onClick={() => setOn((v) => !v)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative mx-[0.04em] inline-block h-[0.74em] w-[1.6em] shrink-0 cursor-pointer rounded-full align-baseline"
      style={{
        background: on
          ? "linear-gradient(180deg,#ff8a4d 0%,#e2451a 100%)"
          : "linear-gradient(180deg,#f3a07e 0%,#d97f6f 100%)",
        boxShadow:
          "inset 0 0.03em 0.05em rgba(255,255,255,.55), inset 0 -0.04em 0.06em rgba(120,30,10,.35), 0 0.05em 0.09em rgba(160,70,40,.35)",
        transition: "background .35s ease",
      }}
    >
      <span
        className="absolute inset-[0.06em] rounded-full"
        style={{
          background: on
            ? "linear-gradient(90deg,#f0583a 0%,#c93b26 100%)"
            : "linear-gradient(90deg,#e08b88 0%,#c77873 100%)",
          boxShadow: "inset 0 0.05em 0.09em rgba(90,20,10,.45)",
          transition: "background .35s ease",
        }}
      />
      <motion.span
        className="absolute left-[0.1em] top-[0.09em] h-[0.56em] w-[0.56em] rounded-full"
        animate={{ x: on ? "0.86em" : "0em" }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        style={{
          background:
            "radial-gradient(circle at 35% 30%,#ffffff 0%,#f1f1f1 55%,#d7d7d7 100%)",
          boxShadow:
            "0 0.05em 0.09em rgba(60,10,0,.45), inset 0 -0.03em 0.05em rgba(0,0,0,.12)",
        }}
      />
    </motion.button>
  );
}
