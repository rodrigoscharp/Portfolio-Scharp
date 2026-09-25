"use client";

import { useSyncExternalStore } from "react";
import EventsShow from "@/components/events/EventsShow";
import EventsMobile from "@/components/events/EventsMobile";

function detect(): "gl" | "css" {
  try {
    const c = document.createElement("canvas");
    const gl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return window.innerWidth >= 900 && gl && !calm ? "gl" : "css";
  } catch {
    return "css";
  }
}

let cached: "gl" | "css" | null = null;
const snapshot = () => (cached ??= detect());
const subscribe = () => () => {};

/* Desktop gets the WebGL show; small screens keep the lighter CSS version. */
export default function EventsStage() {
  const mode = useSyncExternalStore(subscribe, snapshot, () => null);

  if (mode === "gl") return <EventsShow />;
  if (mode === "css") return <EventsMobile />;
  return <div className="fixed inset-0 bg-[#0d0d0d]" />;
}
