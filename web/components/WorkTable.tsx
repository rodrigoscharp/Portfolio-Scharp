import Reveal from "@/components/Reveal";
import { ROWS, type Row } from "@/lib/data";

const cta: Record<NonNullable<Row["cta"]>, { label: string; cls: string }> = {
  case: { label: "Case Study", cls: "bg-[#eb6c34]" },
  live: { label: "Website Live", cls: "bg-black" },
  repo: { label: "View Repo", cls: "bg-accent-2" },
  soon: { label: "Em breve", cls: "bg-ink/35" },
};

export default function WorkTable() {
  return (
    <section className="mx-auto max-w-[1080px] px-5 md:px-8">
      <Reveal>
        <div className="grid grid-cols-[1fr_auto] gap-x-4 pb-2 text-[10px] font-light uppercase tracking-[0.9px] md:grid-cols-[38%_1fr_auto]">
          <span className="hidden md:block">Date</span>
          <span>Projects</span>
          <span className="text-right">Links</span>
        </div>
        <ul>
          {ROWS.map((r) => (
            <li
              key={r.title}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 border-b border-ink/10 py-3 md:grid-cols-[38%_1fr_auto]"
            >
              <span className="order-2 col-span-2 text-[13px] font-light text-ink-soft md:order-none md:col-span-1 md:text-[19px]">
                {r.year}
              </span>
              <span className="order-1 text-[17px] font-medium md:order-none md:text-[19px]">
                {r.title}
              </span>
              {!r.cta ? null : r.cta === "soon" ? (
                <span className={`order-1 rounded-full px-5 py-1.5 text-[11px] tracking-[0.06em] text-white md:order-none ${cta[r.cta].cls}`}>
                  {cta[r.cta].label}
                </span>
              ) : (
                <a
                  href={r.href}
                  target={r.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`order-1 rounded-full px-5 py-1.5 text-[11px] tracking-[0.06em] text-white transition-transform hover:scale-[1.05] md:order-none ${cta[r.cta].cls}`}
                >
                  {cta[r.cta].label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
