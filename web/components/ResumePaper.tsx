import { CV_PDF, SITE } from "@/lib/data";
import {
  AWARDS,
  EDUCATION,
  JOBS,
  PROJECTS,
  SKILLS_GROUPS,
  SUMMARY,
} from "@/lib/resume";

const sec = "mb-3 border-b border-ink/60 pb-1 text-[15px] font-semibold";
const sub = "mb-1 text-[11px] font-semibold";

export default function ResumePaper() {
  return (
    <div className="mx-auto max-w-[1040px] px-3 md:px-6">
      <article className="rounded-[26px] border border-[#eb6c34]/70 bg-paper p-6 shadow-[0_18px_50px_-24px_rgba(235,108,52,.35)] md:p-12">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr] md:gap-10">
          <header>
            <h1 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold uppercase leading-none">
              Rodrigo Scharp
            </h1>
            <p className="mt-2 text-[11px] font-semibold uppercase">
              Backend Software Engineer <span className="font-normal">|</span> Java &amp; Spring Boot{" "}
              <span className="font-normal">|</span> Distributed Systems
            </p>
            <p className="mt-3 max-w-[60ch] text-[10.5px] leading-relaxed">{SUMMARY}</p>
          </header>
          <div className="text-[10.5px] leading-relaxed md:pt-1">
            <p>
              <b>Email:</b>{" "}
              <a href={`mailto:${SITE.email}`} className="hover:underline">
                {SITE.email}
              </a>
            </p>
            <p>
              <b>LinkedIn:</b> linkedin.com/in/rodrigoscharp
            </p>
            <p>
              <b>GitHub:</b> github.com/rodrigoscharp
            </p>
            <p>
              <b>Location:</b> Ubatuba, São Paulo, Brazil
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className={sec}>Work Experience</h2>
            {JOBS.map((j) => (
              <section key={j.company} className="mb-6">
                <p className="text-[12px] font-bold text-accent-2">
                  {j.company.toUpperCase()}{" "}
                  <span className="font-normal">| {j.place}</span>
                </p>
                {j.roles.map((r) => (
                  <div key={r.title} className="mt-2">
                    <p className="text-[11px] font-bold uppercase">
                      {r.title} <span className="font-semibold">| {r.dates}</span>
                    </p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[10.5px] leading-snug">
                      {r.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="mt-1.5 text-[10px]">
                      <b>Technologies:</b> {r.tech}
                    </p>
                  </div>
                ))}
              </section>
            ))}

            <h2 className={`${sec} mt-8`}>Technical Projects</h2>
            {PROJECTS.map((p) => (
              <section key={p.name} className="mb-4">
                <p className="text-[11px] font-bold">
                  <span className="text-accent-2">{p.name}</span>
                </p>
                <p className="text-[10px] text-ink/70">{p.repo}</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-[10.5px] leading-snug">
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[10px]">
                  <b>Stack:</b> {p.stack}
                </p>
              </section>
            ))}
          </div>

          <aside>
            <h2 className={sec}>Recognition</h2>
            <ul className="mb-7 list-disc space-y-2 pl-4 text-[10.5px] leading-snug">
              {AWARDS.map((a) => (
                <li key={a.name}>
                  <b>{a.name}</b> - {a.text}
                </li>
              ))}
            </ul>

            <h2 className={sec}>Skills</h2>
            <div className="mb-7 space-y-3">
              {SKILLS_GROUPS.map((g) => (
                <div key={g.label}>
                  <p className={sub}>{g.label}</p>
                  <p className="text-[10.5px] leading-snug">
                    {g.items.map((i) => `• ${i}`).join("  ")}
                  </p>
                </div>
              ))}
            </div>

            <h2 className={sec}>Education</h2>
            <div className="mb-7 space-y-3 text-[10.5px] leading-snug">
              <div>
                <p className="font-bold text-accent-2">{EDUCATION.school}</p>
                <p>
                  {EDUCATION.degree} | {EDUCATION.dates}
                </p>
              </div>
              {EDUCATION.certs.map((c) => (
                <div key={c.name}>
                  <p className="font-bold text-accent-2">{c.name}</p>
                  <p>
                    {c.by}
                    {c.dates ? ` | ${c.dates}` : ""}
                  </p>
                </div>
              ))}
            </div>

            <h2 className={sec}>Languages</h2>
            <p className="text-[10.5px] leading-snug">
              {EDUCATION.languages.map((l) => `${l.name}: ${l.level}`).join("  |  ")}
            </p>
          </aside>
        </div>

        <p className="mt-8 text-right text-[12px]">01</p>
      </article>

      <div className="mt-8 text-center md:hidden">
        <a
          href={CV_PDF}
          download
          className="inline-block rounded-full bg-ink px-7 py-3 text-[13px] text-paper"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
}
