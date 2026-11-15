import { CASES, METRICS, NAV, ROWS, type Case, type Row } from "@/lib/data";

/* Portuguese copies of the visible text in lib/data.ts. Everything else
   (hrefs, images, slugs, numbers) is spread from the English entries so the
   two never drift apart. */

export const NAV_PT: typeof NAV = [
  { label: "Projetos", href: "/work" },
  { label: "Eventos", href: "/events" },
  { label: "Sobre", href: "/about" },
  { label: "Currículo", href: "/resume" },
  { label: "Contato", href: "/#contact" },
];

const METRIC_LABELS_PT = [
  "restaurantes rodando em um PDV que construí do zero",
  "cidadãos atendidos por sistemas públicos que ajudei a entregar",
  "sistemas de governo que meu squad colocou em produção",
  "back-ends em Java e Spring Boot entregues",
  "prêmios nacionais, incluindo o de Smart City",
];
const METRIC_TAGS_PT = ["Muno", "Ubatuba", "Governo", "Consultoria", "Prêmios"];

export const METRICS_PT: typeof METRICS = METRICS.map((m, i) => ({
  ...m,
  tag: METRIC_TAGS_PT[i] ?? m.tag,
  label: METRIC_LABELS_PT[i] ?? m.label,
}));

export const CASES_PT: Case[] = [
  {
    ...CASES[0],
    headline: [
      { text: "Muno", bold: true },
      { text: ": uma plataforma de PDV e cardápio digital que atende " },
      { text: "120+ restaurantes", bold: true },
    ],
    insights: [
      { value: "No ar", label: "PDV 100% digital no lugar das comandas de papel" },
      { value: "02/2025", label: "construído do zero como único fundador e CTO" },
    ],
  },
  {
    ...CASES[1],
    headline: [
      { text: "MyHub", bold: true },
      { text: ": um SaaS de produtividade low-ticket para organizar " },
      { text: "toda a sua rotina", bold: true },
      { text: " em um só lugar" },
    ],
    tags: ["WEB", "SAAS", "PRODUTIVIDADE"],
    insights: [{ value: "No ar", label: "SaaS de produtividade para organizar toda a sua rotina em um só lugar" }],
  },
  {
    ...CASES[2],
    headline: [
      { text: "Campo", bold: true },
      { text: ": um consultor de campo virtual que mostra às " },
      { text: "redes de franquias", bold: true },
      { text: " onde cada loja está deixando dinheiro na mesa" },
    ],
    insights: [{ value: "Startup", label: "cada loja comparada todos os dias com lojas do mesmo perfil" }],
  },
];

const ROW_TITLES_PT = [
  "Muno — PDV e Cardápio Digital",
  "MyHub — SaaS de Produtividade",
  "Campo — Consultor de Campo Virtual para Franquias",
  "PixLab — Laboratório de Conciliação de Pix e Boleto",
  "PONTE — App de CAA para Crianças Autistas",
  "Athena — Motor de Casamento de Ordens",
  "WalletCore — API de Carteira Digital",
];

export const ROWS_PT: Row[] = ROWS.map((r, i) => ({
  ...r,
  year: r.year.replace("Now", "Hoje"),
  title: ROW_TITLES_PT[i] ?? r.title,
}));
