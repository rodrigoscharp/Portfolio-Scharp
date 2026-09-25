"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { SKILLS, type Skill } from "@/lib/data";

const size = "text-[clamp(1.05rem,2.5vw,2.35rem)]";

const styles: Record<Skill["style"], string> = {
  filled: `${size} bg-ink px-[0.8em] py-[0.42em] font-semibold text-paper`,
  outline: `${size} border-[1.5px] border-ink px-[0.8em] py-[0.42em] font-medium`,
  serif: `${size} border-[1.5px] border-ink px-[0.9em] py-[0.42em] font-serif text-[1.12em] leading-none tracking-tight`,
  dot: `${size} border-[1.5px] border-ink px-[0.8em] py-[0.5em] dotmatrix text-[0.95em] font-black leading-none`,
  bold: `${size} border-[1.5px] border-ink px-[0.8em] py-[0.42em] font-bold`,
  "rot-left": `${size} -rotate-[28deg] border-[1.5px] border-ink px-[0.8em] py-[0.42em] font-medium`,
  "rot-right": `${size} rotate-[22deg] border-[1.5px] border-ink px-[0.8em] py-[0.42em] font-medium`,
  "circle-sm":
    "grid aspect-square w-[clamp(62px,6.4vw,88px)] place-items-center border-[1.5px] border-ink text-center text-[clamp(9px,.9vw,12px)] font-bold leading-tight",
  "circle-lg":
    "grid aspect-square w-[clamp(84px,9.4vw,132px)] place-items-center border-[1.5px] border-ink font-serif text-[clamp(3.4rem,7.4vw,6.2rem)] font-bold leading-none",
};

export default function Skills() {
  const box = useRef<HTMLDivElement>(null);

  return (
    <section className="px-5 pt-8 md:px-11">
      <Reveal>
        <p className="mb-5 text-[clamp(1.15rem,2vw,1.75rem)] font-normal">
          with my skills in:
        </p>
      </Reveal>

      <div
        ref={box}
        className="flex flex-wrap items-center gap-x-2 gap-y-3 md:gap-x-3 md:gap-y-4"
      >
        {SKILLS.map((s, i) => (
          <motion.div
            key={s.label}
            drag
            dragSnapToOrigin
            dragConstraints={box}
            dragElastic={0.45}
            dragTransition={{ bounceStiffness: 420, bounceDamping: 16 }}
            whileDrag={{ scale: 1.08, zIndex: 30, cursor: "grabbing" }}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`cursor-grab select-none touch-none whitespace-nowrap rounded-full ${styles[s.style]}`}
          >
            {s.label}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
