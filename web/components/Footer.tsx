import { ArrowUp } from "@/components/Icons";
import { SITE } from "@/lib/data";
import { T } from "@/lib/i18n";

const pill =
  "rounded-full border border-ink px-6 py-2.5 text-[12px] font-normal uppercase transition-colors hover:bg-ink hover:text-paper";

export default function Footer() {
  return (
    <footer className="grid items-end gap-6 px-6 pb-8 text-[13px] md:grid-cols-3 md:px-[4.4rem]">
      <p className="font-medium leading-tight">
        <T en="Design & Developed" pt="Design & desenvolvimento" />
        <br />
        <T en="by Rodrigo" pt="por Rodrigo" />
        <span className="mt-2 block font-light text-ink-soft">
          <T en="Press" pt="Aperte" /> <kbd className="rounded border border-ink/30 px-1 font-mono text-[11px]">⌘K</kbd>{" "}
          <T en="to jump anywhere" pt="para ir a qualquer lugar" />
        </span>
      </p>

      <div className="flex gap-4 md:justify-center">
        <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className={pill}>
          LinkedIn
        </a>
        <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={pill}>
          GitHub
        </a>
      </div>

      <div className="font-medium md:text-right">
        <p>
          © 2026 - <T en="All Rights Reserved" pt="Todos os direitos reservados" />
        </p>
        <a href="#top" className="mt-1 inline-flex items-center gap-1">
          <T en="Back to top" pt="Voltar ao topo" /> <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
