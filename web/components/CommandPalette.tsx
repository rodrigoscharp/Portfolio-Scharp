"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { CV_PDF, SITE } from "@/lib/data";
import { useLang } from "@/lib/i18n";
import { play } from "@/lib/sound";

type Cmd = { label: string; hint: string; run: () => void };

/* Cmd/Ctrl + K: jump anywhere on the site. Also logs a note for developers
   who open the console. */
export default function CommandPalette() {
  const router = useRouter();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const cmds = useMemo<Cmd[]>(() => {
    const go = (href: string) => () => router.push(href);
    const page = t("Page", "Página");
    const ext = t("External", "Externo");
    return [
      { label: t("Home", "Início"), hint: page, run: go("/") },
      { label: t("Work & career", "Projetos e carreira"), hint: page, run: go("/work") },
      ...CASE_STUDIES.map((c) => ({
        label: t(`${c.name} case study`, `Estudo de caso: ${c.name}`),
        hint: t("Case", "Estudo"),
        run: go(`/work/${c.slug}`),
      })),
      { label: t("My AI Staff (Orbz)", "Meu time de IA (Orbz)"), hint: t("Section", "Seção"), run: go("/#team") },
      { label: t("Events & talks", "Eventos e palestras"), hint: page, run: go("/events") },
      { label: t("About", "Sobre"), hint: page, run: go("/about") },
      { label: t("Resume", "Currículo"), hint: page, run: go("/resume") },
      { label: t("Download resume (PDF)", "Baixar currículo (PDF)"), hint: t("File", "Arquivo"), run: () => window.open(CV_PDF, "_blank") },
      { label: t("Copy email", "Copiar e-mail"), hint: SITE.email, run: () => navigator.clipboard?.writeText(SITE.email) },
      { label: "LinkedIn", hint: ext, run: () => window.open(SITE.linkedin, "_blank", "noopener") },
      { label: "GitHub", hint: ext, run: () => window.open(SITE.github, "_blank", "noopener") },
    ];
  }, [router, t]);

  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.trim().toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQ("");
        setI(0);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const opened = useRef(false);
  useEffect(() => {
    if (open) input.current?.focus();
    if (open !== opened.current) play(open ? "open" : "close");
    opened.current = open;
  }, [open]);

  useEffect(() => {
    console.log(
      "%cHey, developer 👋%c\nThis site is Next.js + three.js, hand-built by Rodrigo.\nPress ⌘K / Ctrl+K to jump anywhere, or write to " + SITE.email,
      "font:700 16px sans-serif;color:#fd601a",
      "font:13px sans-serif",
    );
  }, []);

  const pick = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    c.run();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label={t("Command menu", "Menu de comandos")}
            className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-ink bg-bg shadow-[0_30px_80px_-20px_rgba(0,0,0,.5)]"
            initial={{ y: -12, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setI(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setI((v) => Math.min(v + 1, list.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setI((v) => Math.max(v - 1, 0));
                } else if (e.key === "Enter") pick(list[i]);
              }}
              placeholder={t("Where to?", "Para onde?")}
              className="w-full border-b border-ink/15 bg-transparent px-5 py-4 text-[17px] outline-none placeholder:text-ink-soft"
            />
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {list.map((c, k) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onMouseEnter={() => setI(k)}
                    onClick={() => pick(c)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] ${
                      k === i ? "bg-ink text-bg" : ""
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-[12px] opacity-60">{c.hint}</span>
                  </button>
                </li>
              ))}
              {list.length === 0 && <li className="px-3 py-3 text-[14px] text-ink-soft">{t("Nothing found.", "Nada encontrado.")}</li>}
            </ul>
            <p className="border-t border-ink/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.12em] text-ink-soft">
              {t("↑↓ to move · Enter to open · Esc to close", "↑↓ para navegar · Enter para abrir · Esc para fechar")}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
