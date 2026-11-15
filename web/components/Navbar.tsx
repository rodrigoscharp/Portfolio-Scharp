"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CV_PDF, NAV, SITE } from "@/lib/data";
import { NAV_PT } from "@/lib/data.pt";
import { LangSwitch, useL, useLang } from "@/lib/i18n";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const home = path === "/";
  const resume = path === "/resume";
  const { t } = useLang();
  const nav = useL(NAV, NAV_PT);
  const links = home ? nav : [{ label: t("Home", "Início"), href: "/" }, ...nav];

  // Hides while scrolling down so it never sits on top of the big titles,
  // comes back on scroll up with its own backdrop.
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const past = y > (home ? window.innerHeight * 0.9 : 80);
      setSolid(past);
      if (Math.abs(y - last) > 6) {
        setHidden(past && y > last);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);
  const show = !hidden || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        show ? "translate-y-0" : "-translate-y-full"
      } ${
        home && !solid && !open
          ? "text-white mix-blend-difference"
          : "border-b border-ink/10 bg-bg/80 text-ink backdrop-blur-md"
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

        <div className="hidden items-center gap-6 md:flex">
          <LangSwitch className="font-normal" />
          {resume ? (
            <a
              href={CV_PDF}
              download
              className="rounded-full bg-ink px-6 py-3 text-[12px] font-normal normal-case text-paper transition-transform hover:scale-[1.03]"
            >
              {t("Download Resume", "Baixar currículo")}
            </a>
          ) : (
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="font-normal hover:opacity-60">
              LinkedIn
            </a>
          )}
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={t("Toggle menu", "Abrir menu")}
          onClick={() => setOpen((o) => !o)}
          className="font-normal md:hidden"
        >
          {open ? t("Close", "Fechar") : "Menu"}
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
              {t("Download Resume", "Baixar currículo")}
            </a>
          )}
          <LangSwitch className="mt-2 text-[14px]" />
        </nav>
      )}
    </header>
  );
}
