"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { play, setSound, soundOn, subscribeSound, unlockSound } from "@/lib/sound";
import { useLang } from "@/lib/i18n";

const UI = "a,button,[role=switch],[data-cursor=hover]";

/* Page-wide sound: turns on with the first gesture, ticks on hover and click of
   anything interactive, and a soft whoosh as each section scrolls into view. */
export default function SoundFX() {
  const path = usePathname();

  useEffect(() => {
    const first = (e: Event) => {
      if ((e.target as Element | null)?.closest?.("[data-sound-toggle]")) return;
      unlockSound();
    };
    let over: Element | null = null;
    const enter = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest(UI) ?? null;
      if (el && el !== over && e.pointerType === "mouse") play("hover");
      over = el;
    };
    // Switches, the sound toggle and [data-sound-own] play their own sound.
    const click = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(UI);
      if (el && !el.matches("[role=switch],[data-sound-toggle],[data-sound-own]")) play("click");
    };
    window.addEventListener("pointerdown", first, true);
    window.addEventListener("keydown", first, true);
    window.addEventListener("pointerover", enter);
    window.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("pointerdown", first, true);
      window.removeEventListener("keydown", first, true);
      window.removeEventListener("pointerover", enter);
      window.removeEventListener("click", click, true);
    };
  }, []);

  // Sections are re-collected on every route change.
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting || seen.has(en.target)) return;
          seen.add(en.target);
          play("whoosh");
        }),
      { threshold: 0.2 },
    );
    const id = setTimeout(() => document.querySelectorAll("section").forEach((s) => io.observe(s)), 300);
    return () => {
      clearTimeout(id);
      io.disconnect();
    };
  }, [path]);

  return null;
}

/* Header button: four bars that dance while sound is on. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSyncExternalStore(subscribeSound, soundOn, () => false);
  const { t } = useLang();
  return (
    <button
      type="button"
      data-sound-toggle
      aria-pressed={on}
      aria-label={on ? t("Mute sound", "Desligar som") : t("Turn sound on", "Ligar som")}
      onClick={() => {
        setSound(!on);
        if (!on) play("on");
      }}
      className={`inline-flex h-4 items-end gap-[2px] transition-opacity hover:opacity-60 ${className}`}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-current ${on ? "animate-[sound-bar_0.9s_ease-in-out_infinite] motion-reduce:animate-none" : ""}`}
          style={{ height: on ? `${[60, 100, 45, 80][i]}%` : "20%", animationDelay: `${i * 0.15}s`, transformOrigin: "bottom" }}
        />
      ))}
    </button>
  );
}
