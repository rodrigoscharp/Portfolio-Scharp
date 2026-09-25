import { ArrowUp } from "@/components/Icons";
import { SITE } from "@/lib/data";

const pill =
  "rounded-full border border-ink px-6 py-2.5 text-[12px] font-normal uppercase transition-colors hover:bg-ink hover:text-paper";

export default function Footer() {
  return (
    <footer className="grid items-end gap-6 px-6 pb-8 text-[13px] md:grid-cols-3 md:px-[4.4rem]">
      <p className="font-medium leading-tight">
        Design &amp; Developed
        <br />
        by Rodrigo
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
        <p>© 2026 - All Rights Reserved</p>
        <a href="#top" className="mt-1 inline-flex items-center gap-1">
          Back to top <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}
