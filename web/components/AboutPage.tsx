"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Workspaces from "@/components/Workspaces";
import { SITE } from "@/lib/data";
import { EDUCATION, JOBS } from "@/lib/resume";
import { EDUCATION_PT, JOBS_PT } from "@/lib/resume.pt";
import { useL, useLang } from "@/lib/i18n";

const h = "text-[15px] font-medium";

export default function AboutPage() {
  const { lang, t } = useLang();
  const jobs = useL(JOBS, JOBS_PT);
  const education = useL(EDUCATION, EDUCATION_PT);
  const pt = lang === "pt";
  return (
    <>
      <section className="mx-auto grid max-w-[1180px] gap-10 px-5 md:grid-cols-2 md:items-center md:gap-14 md:px-8">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#e9e4d6]">
            <Image
              src={SITE.portrait}
              alt="Rodrigo Scharp"
              fill
              priority
              sizes="(min-width:768px) 1400px, 100vw"
              className="object-cover object-[52%_25%]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {pt ? (
            <>
              <h1 className="text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
                {/* Longer than the English lines: each one wraps on its own, balanced. */}
                <span className="block text-balance">Engenheiro de Software,</span>
                <span className="block text-balance">Founder &amp; CTO,</span>
                <span className="block text-balance">Tech Lead no setor público</span>
              </h1>
              <p className="mt-8 max-w-[52ch] text-[15px] font-light leading-relaxed">
                Sou o Rodrigo, engenheiro de software Java de Ubatuba, São Paulo,
                com <b className="font-semibold">mais de 4 anos</b> projetando e
                entregando sistemas em produção no setor público, em fintech e em
                food-tech, com Java 21, Spring Boot 3, PostgreSQL, RabbitMQ e
                Redis.
              </p>
              <p className="mt-5 max-w-[52ch] text-[15px] font-light leading-relaxed">
                Como Diretor de Tecnologia e Inovação da Prefeitura de Ubatuba,
                liderei um squad que colocou{" "}
                <b className="font-semibold">mais de 6 sistemas em produção</b> e
                conquistou <b className="font-semibold">2 prêmios nacionais</b>,
                entre eles o Smart City. Depois fui promovido a Tech Lead, e também
                sou Founder &amp; CTO da Muno App, uma plataforma 100% digital de
                PDV e cardápio para restaurantes.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.02em]">
                Software Engineer,
                <br />
                Founder &amp; CTO,
                <br />
                Public-tech Tech Lead
              </h1>
              <p className="mt-8 max-w-[52ch] text-[15px] font-light leading-relaxed">
                I&apos;m Rodrigo, a Java software engineer from Ubatuba, São Paulo,
                Brazil, with <b className="font-semibold">4+ years</b> designing and
                delivering production systems across the public sector, fintech and
                food-tech, using Java 21, Spring Boot 3, PostgreSQL, RabbitMQ and
                Redis.
              </p>
              <p className="mt-5 max-w-[52ch] text-[15px] font-light leading-relaxed">
                As Director of Technology and Innovation at the Municipality of
                Ubatuba I led a squad that took{" "}
                <b className="font-semibold">6+ systems to production</b> and won{" "}
                <b className="font-semibold">2 national awards</b>, including Smart
                City. I was then promoted to Tech Lead, and I&apos;m also
                Founder &amp; CTO of Muno App, a 100% digital POS and menu platform
                for restaurants.
              </p>
            </>
          )}
        </Reveal>
      </section>

      <section className="mx-auto mt-24 grid max-w-[1180px] gap-14 px-5 md:mt-32 md:grid-cols-[1.15fr_1fr_1fr] md:gap-12 md:px-8">
        <Reveal>
          {pt ? (
            <div className="space-y-5 text-[15px] font-light leading-relaxed">
              <p>
                Minha base são sistemas distribuídos: mensageria com RabbitMQ e
                Kafka, concorrência e back-ends de alta performance. Gosto das
                partes difíceis e pouco glamorosas, como um motor de matching de
                ordens lock-free projetado para mais de 100.000 ordens por segundo
                com latência p99 abaixo de 100 microssegundos, ou um ledger de
                partidas dobradas feito para consistência.
              </p>
              <p>
                Aplico Clean Architecture e a lógica de microsserviços em sistemas
                reais dos quais as pessoas dependem todos os dias, de serviços
                públicos usados por mais de 100.000 cidadãos ao PDV que segura o
                turno inteiro de um restaurante.
              </p>
              <p>
                Além do código, coordeno times e stakeholders, planejo e organizo
                o cronograma de entregas e assessoro a liderança em estratégia de
                tecnologia e governança de TI. Falo português como língua nativa e
                inglês com proficiência profissional.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-[15px] font-light leading-relaxed">
              <p>
                My core is distributed systems: messaging with RabbitMQ and Kafka,
                concurrency, and high-performance back-ends. I like the hard,
                unglamorous parts, like a lock-free order matching engine doing
                100,000+ orders per second with p99 latency under 100
                microseconds, or a double-entry ledger built for consistency.
              </p>
              <p>
                I apply Clean Architecture and microservices thinking on
                real-world systems that people depend on every day, from public
                services used by 100,000+ citizens to the POS that runs a
                restaurant&apos;s whole shift.
              </p>
              <p>
                Beyond code I coordinate teams and stakeholders, plan and
                schedule delivery, and advise leadership on technology strategy
                and IT governance. I speak Portuguese natively and English with
                professional proficiency.
              </p>
            </div>
          )}
        </Reveal>

        <Reveal delay={0.08}>
          <p className={`${h} mb-5 text-[20px]`}>{t("Experience", "Experiência")}</p>
          <ul className="space-y-6 text-[14px] font-light leading-snug">
            {jobs.flatMap((j) =>
              j.roles.map((r) => (
                <li key={j.company + r.title}>
                  <p className="font-medium">
                    {j.company} <span className="font-light">· {r.dates}</span>
                  </p>
                  <p className="mt-1">{r.title}</p>
                </li>
              )),
            )}
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <p className={`${h} mb-5 text-[20px]`}>{t("Education", "Formação")}</p>
          <div className="text-[14px] font-light leading-snug">
            <p className="font-medium">{education.school}</p>
            <p className="mt-1">{education.dates}</p>
            <p>{education.degree}</p>
          </div>
          <ul className="mt-6 space-y-3 text-[14px] font-light leading-snug">
            {education.certs.map((c) => (
              <li key={c.name}>
                <span className="font-medium">{c.name}</span> · {c.by}
              </li>
            ))}
          </ul>

          <Link
            href="/resume"
            className="mt-8 inline-block rounded-2xl bg-ink px-9 py-4 text-[13px] font-normal text-paper transition-transform hover:scale-[1.03]"
          >
            {t("Resume", "Currículo")}
          </Link>

          <p className={`${h} mb-3 mt-14 text-[20px]`}>{t("Contact", "Contato")}</p>
          <p className="text-[14px] font-medium">Email</p>
          <a
            href={`mailto:${SITE.email}`}
            className="text-[14px] font-light hover:underline"
          >
            {SITE.email}
          </a>
          <p className="mt-5 text-[14px] font-medium">{t("Social", "Redes")}</p>
          <div className="mt-1 flex gap-3 text-[14px] font-light">
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LinkedIn
            </a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
          </div>
        </Reveal>
      </section>

      <Workspaces />
    </>
  );
}
