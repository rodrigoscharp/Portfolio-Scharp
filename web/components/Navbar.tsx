"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CV_PDF, NAV, SITE } from "@/lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const home = path === "/";
  const resume = path === "/resume";
  const links = home ? NAV : [{ label: "Home", href: "/" }, ...NAV];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 ${
        home ? "text-white mix-blend-difference" : "bg-bg/85 text-ink backdrop-blur-sm"
      }`}
    >
      <div className="relative mx-auto flex items-center justify-between px-5 py-5 text-[13px] uppercase md:px-12 md:py-6 md:text-[14px]">
        <Link href="/" className="font-normal tracking-wide">
          {SITE.name}
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-10 md:flex">
          {links.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`font-normal hover:opacity-60 ${path === n.href ? "opacity-60" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {resume ? (
          <a
            href={CV_PDF}
            download
            className="hidden rounded-full bg-ink px-6 py-3 text-[12px] font-normal normal-case text-paper transition-transform hover:scale-[1.03] md:block"
          >
            Download Resume
          </a>
        ) : (
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-normal hover:opacity-60 md:block"
          >
            LinkedIn
          </a>
        )}

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
          {links.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          {resume && (
            <a href={CV_PDF} download>
              Download Resume
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
