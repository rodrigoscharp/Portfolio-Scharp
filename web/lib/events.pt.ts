import { EVENTS, type EventSlide } from "@/lib/events";

/* Portuguese copy of EVENTS: only the visible text changes, so ids, images
   and colors come straight from the English list. */
const PT: Record<string, Pick<EventSlide, "date" | "text">> = {
  "aws-summit": {
    date: "Outubro de 2026",
    text: "AWS Summit São Paulo: cloud, IA e a comunidade brasileira de desenvolvedores.",
  },
  codecon: {
    date: "Agosto de 2026",
    text: "CODECON Summit '26: conectando com a comunidade dev do Brasil.",
  },
  "web-summit": {
    date: "Junho de 2026",
    text: "Web Summit Rio: participei a convite do GitHub, representando a MUNO como Founder.",
  },
  geopixel: {
    date: "Maio de 2026",
    text: "EU GEOPIXEL: debatendo casos de sucesso de georreferenciamento em cidades brasileiras.",
  },
  "tdc-summit": {
    date: "Abril de 2026",
    text: "Como Diretor de Tecnologia e Inovação de Ubatuba.",
  },
  forum: {
    date: "Abril de 2026",
    text: "Fórum de Cidades Digitais e Inteligentes: convidado como Diretor de Tecnologia de Ubatuba para o fórum de cidades inteligentes.",
  },
  "smart-cities": {
    date: "Março de 2026",
    text: "Como Diretor de Tecnologia (C-Level), ao lado do Secretário de Tecnologia de Ubatuba.",
  },
  microsoft: {
    date: "Fevereiro de 2026",
    text: "Debate de IA: um debate sobre Inteligência Artificial no escritório da Microsoft.",
  },
  feira: {
    date: "Outubro de 2025",
    text: "Feira do Empreendedor: participei a convite do SEBRAE.",
  },
  "tdc-sp": {
    date: "Setembro de 2025",
    text: "TDC São Paulo, The Developer's Conference: representando a Prescon Assessoria como Desenvolvedor Java Júnior.",
  },
};

export const EVENTS_PT: EventSlide[] = EVENTS.map((e) => ({
  ...e,
  ...PT[e.slug],
  place: e.place === "Microsoft Office" ? "Escritório da Microsoft" : e.place,
}));

/* TEASERS in lib/events.ts are already written in Portuguese. */
