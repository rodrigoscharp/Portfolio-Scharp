export const SITE = {
  name: "Rodrigo Scharp",
  email: "rodrigoscharp@gmail.com",
  linkedin: "https://www.linkedin.com/in/rodrigo-scharp-8728a7277",
  github: "https://github.com/rodrigoscharp",
  startYear: "2023",
  portrait: "/images/rodrigo-portrait.jpg",
};

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

export type Skill = {
  label: string;
  style:
    | "filled"
    | "outline"
    | "serif"
    | "dot"
    | "bold"
    | "rot-left"
    | "rot-right"
    | "circle-sm"
    | "circle-lg";
};

export const SKILLS: Skill[] = [
  { label: "Java", style: "filled" },
  { label: "Spring Boot", style: "outline" },
  { label: "AWS", style: "serif" },
  { label: "Docker", style: "dot" },
  { label: "Next.js", style: "outline" },
  { label: "PostgreSQL", style: "filled" },
  { label: "System Design", style: "rot-left" },
  { label: "APIs REST", style: "circle-sm" },
  { label: "Leadership", style: "bold" },
  { label: "Product Thinking", style: "rot-right" },
  { label: "&", style: "circle-lg" },
];

export type Case = {
  slug: string;
  n: string;
  read: string;
  headline: { text: string; bold?: boolean }[];
  tags: string[];
  bg: string;
  device: "laptop" | "phone";
  image: string;
  insights: { value: string; label: string }[];
  live?: string;
  caseHref: string;
  layout: "full" | "half";
  dark: boolean;
};

export const CASES: Case[] = [
  {
    slug: "muno",
    n: "01",
    read: "[X] min Read",
    headline: [
      { text: "Muno", bold: true },
      { text: ": a POS & digital menu platform serving " },
      { text: "[MÉTRICA] restaurants", bold: true },
    ],
    tags: ["WEB", "MOBILE", "SAAS"],
    bg: "linear-gradient(135deg,#fd601a 0%,#d93f00 100%)",
    device: "laptop",
    image: "/images/muno-hero.svg",
    insights: [
      { value: "[MÉTRICA]", label: "[descrição da métrica]" },
      { value: "[MÉTRICA]", label: "[descrição da métrica]" },
    ],
    live: "#",
    caseHref: "#",
    layout: "full",
    dark: false,
  },
  {
    slug: "myhub",
    n: "02",
    read: "[X] min Read",
    headline: [
      { text: "MyHub", bold: true },
      { text: ": a local-first productivity app powered by a " },
      { text: "local LLM", bold: true },
      { text: " called Beto" },
    ],
    tags: ["WEB", "LOCAL-FIRST", "LLM"],
    bg: "linear-gradient(135deg,#9342fc 0%,#5b21b6 100%)",
    device: "laptop",
    image: "/images/myhub-hero.svg",
    insights: [{ value: "[MÉTRICA]", label: "[descrição da métrica]" }],
    live: "https://github.com/rodrigoscharp/WorkFlow",
    caseHref: "https://github.com/rodrigoscharp/WorkFlow",
    layout: "full",
    dark: false,
  },
  {
    slug: "prefeitura",
    n: "03",
    read: "[X] min Read",
    headline: [
      { text: "Ubatuba City Hall", bold: true },
      { text: ": modernizing public digital services for " },
      { text: "[MÉTRICA] citizens", bold: true },
    ],
    tags: ["GOVTECH", "WEB", "INNOVATION"],
    bg: "#000000",
    device: "laptop",
    image: "/images/prefeitura-hero.svg",
    insights: [
      { value: "[MÉTRICA]", label: "[descrição da métrica]" },
      { value: "[MÉTRICA]", label: "[descrição da métrica]" },
    ],
    caseHref: "#",
    layout: "full",
    dark: true,
  },
];

export type Row = {
  year: string;
  title: string;
  cta: "case" | "live" | "repo";
  href: string;
  image: string;
};

export const ROWS: Row[] = [
  { year: "2026", title: "Ubatuba City Hall — Tech & Innovation", cta: "case", href: "#", image: "/images/prefeitura-hero.svg" },
  { year: "2025 - Now", title: "Muno — POS & Digital Menu", cta: "live", href: "#", image: "/images/muno-hero.svg" },
  { year: "2025", title: "MyHub — Local-first Productivity", cta: "case", href: "https://github.com/rodrigoscharp/WorkFlow", image: "/images/myhub-hero.svg" },
  { year: "2026", title: "PONTE — AAC App for Autistic Children", cta: "repo", href: "https://github.com/rodrigoscharp/PONTE", image: "/images/myhub-hero.svg" },
  { year: "2025", title: "Athena Matching Engine", cta: "repo", href: "https://github.com/rodrigoscharp/Athena-Matching-Engine", image: "/images/prefeitura-hero.svg" },
  { year: "2025", title: "HelpNote IA", cta: "repo", href: "https://github.com/rodrigoscharp/HelpNote_-IA", image: "/images/myhub-hero.svg" },
  { year: "2025", title: "WalletCore — Digital Wallet API", cta: "repo", href: "https://github.com/rodrigoscharp/WalletCore", image: "/images/muno-hero.svg" },
  { year: "2025", title: "BETO IA — Self-hosted Assistant", cta: "repo", href: "https://github.com/rodrigoscharp/BETO-IA", image: "/images/myhub-hero.svg" },
];
