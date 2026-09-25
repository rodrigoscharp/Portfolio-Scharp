"use client";

import { useState } from "react";
import { NAV, SITE } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
      <div className="relative mx-auto flex items-center justify-between px-5 py-5 text-[13px] uppercase md:px-12 md:py-6 md:text-[14px]">
        <a href="#top" className="font-normal tracking-wide">
          {SITE.name}
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="font-normal hover:opacity-60">
              {n.label}
            </a>
          ))}
        </nav>

        <a
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden font-normal hover:opacity-60 md:block"
        >
          LinkedIn
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="font-normal md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 px-5 pb-6 text-[15px] uppercase md:hidden">
          {[...NAV, { label: "LinkedIn", href: SITE.linkedin }].map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
