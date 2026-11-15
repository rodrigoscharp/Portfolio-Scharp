"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/* Two languages, translated by hand. English is what the server renders; the
   visitor's choice (or browser language on the first visit) is applied right
   after hydration. The inline script in the site layout hides the page for that
   instant when Portuguese is coming, so English never flashes. */

export type Lang = "en" | "pt";

const KEY = "lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Inline copy: t("Hello", "Olá"). */
  t: (en: string, pt: string) => string;
};

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (en) => en });

export function readStoredLang(): Lang {
  try {
    const s = localStorage.getItem(KEY);
    if (s === "en" || s === "pt") return s;
  } catch {}
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const l = readStoredLang();
    // Deferred so the first client render matches the server's English HTML.
    const id = window.requestAnimationFrame(() => {
      setLangState(l);
      document.documentElement.classList.remove("lang-pending");
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const t = useCallback((en: string, pt: string) => (lang === "pt" ? pt : en), [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Picks the English or Portuguese version of a whole value (arrays, objects). */
export function useL<T>(en: T, pt: T): T {
  return useContext(LangContext).lang === "pt" ? pt : en;
}

/** Inline bilingual text usable from server components: <T en="Hello" pt="Olá" />. */
export function T({ en, pt }: { en: React.ReactNode; pt: React.ReactNode }) {
  return <>{useContext(LangContext).lang === "pt" ? pt : en}</>;
}

/** EN | PT switch for the navbar. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <span className={`inline-flex items-center gap-1 ${className}`} role="group" aria-label="Language">
      {(["en", "pt"] as const).map((l, i) => (
        <span key={l} className="inline-flex items-center gap-1">
          {i > 0 && <span aria-hidden className="opacity-40">|</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`uppercase transition-opacity hover:opacity-100 ${lang === l ? "font-semibold opacity-100" : "opacity-50"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </span>
  );
}
