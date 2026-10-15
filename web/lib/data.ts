export const SITE = {
  name: "Rodrigo Scharp",
  email: "rodrigoscharp@gmail.com",
  linkedin: "https://www.linkedin.com/in/rodrigoscharp",
  github: "https://github.com/rodrigoscharp",
  startYear: "2023",
  portrait: "/images/rodrigo-portrait.jpg",
  capsule: "/images/rodrigo-capsule.jpg",
  cartoon: "/images/rodrigo-cartoon.jpg",
  square: "/images/rodrigo-square.jpg",
};

export const CV_PDF = "/RodrigoScharpCV-ENG.pdf";

export const NAV = [
  { label: "Work", href: "/work" },
  { label: "Events", href: "/events" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/#contact" },
];

/* Drop workspace photos in /public/images/setup and list them here. */
export const SETUP_IMAGES: { src: string; alt: string }[] = [
  { src: "/images/setup/setup-1.jpg", alt: "Desk with mechanical keyboard, mouse and microphone under a curved monitor" },
  { src: "/images/setup/setup-2.jpg", alt: "Dark home office with three monitors, laptop and softbox light" },
  { src: "/images/setup/setup-3.jpg", alt: "Purple-lit desk with two monitors, keyboard and microphone" },
  { src: "/images/setup/setup-4.jpg", alt: "Ultrawide monitor and laptop running code, notebook on the desk" },
  { src: "/images/setup/setup-5.jpg", alt: "Wooden desk with curved monitor, laptop, tablet and softbox light" },
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
  { label: "MySQL", style: "circle-sm" },
  { label: "Leadership", style: "bold" },
  { label: "Product Thinking", style: "rot-right" },
  { label: "&", style: "circle-lg" },
];

export type Slide = {
  kind: "laptop" | "phone" | "art" | "mark" | "device";
  image: string;
  bg: string;
  label?: string;
  title?: string;
  chips?: string[];
  aspect?: string;
};

export type Case = {
  slug: string;
  n: string;
  read: string;
  headline: { text: string; bold?: boolean }[];
  tags: string[];
  slides: Slide[];
  image: string;
  insights: { value: string; label: string }[];
  live?: string;
  repo?: string;
  caseHref?: string;
  soon?: boolean;
  layout: "full" | "half";
};

export const CASES: Case[] = [
  {
    slug: "muno",
    n: "01",
    read: "Restaurantes",
    headline: [
      { text: "Muno", bold: true },
      { text: ": a POS & digital menu platform serving " },
      { text: "120+ restaurants", bold: true },
    ],
    tags: ["WEB", "MOBILE", "SAAS"],
    slides: [
      { kind: "laptop", image: "/images/muno-hero.jpg", bg: "linear-gradient(135deg,#fd601a 0%,#d93f00 100%)" },
      { kind: "device", image: "/images/muno-mobile-v4.png", bg: "linear-gradient(135deg,#1f3d33 0%,#0d1f19 100%)", aspect: "714 / 953" },
    ],
    image: "/images/muno-hero.jpg",
    insights: [
      { value: "Live", label: "100% digital POS replacing paper-based tickets" },
      { value: "02/2025", label: "shipped from zero as sole founder & CTO" },
    ],
    live: "https://munoapp.com.br",
    layout: "full",
  },
  {
    slug: "myhub",
    n: "02",
    read: "Produtividade",
    headline: [
      { text: "MyHub", bold: true },
      { text: ": a low-ticket productivity SaaS to run your " },
      { text: "whole routine", bold: true },
      { text: " in one place" },
    ],
    tags: ["WEB", "SAAS", "PRODUCTIVITY"],
    slides: [
      { kind: "laptop", image: "/images/myhub-hero.jpg", bg: "linear-gradient(135deg,#9342fc 0%,#5b21b6 100%)" },
      { kind: "device", image: "/images/myhub-mobile-v2.png", bg: "linear-gradient(135deg,#b8f04f 0%,#6fae1f 100%)", aspect: "581 / 921" },
    ],
    image: "/images/myhub-hero.jpg",
    insights: [
      { value: "Live", label: "productivity SaaS to run your whole routine in one place" },
    ],
    live: "https://usemyhub.com",
    layout: "half",
  },
  {
    slug: "prefeitura",
    n: "03",
    read: "Inovação",
    headline: [
      { text: "Ubatuba City Hall", bold: true },
      { text: ": one of the people behind Ubatuba's digital innovation, reaching " },
      { text: "+100k residents", bold: true },
    ],
    tags: ["GOVTECH", "WEB", "INNOVATION"],
    slides: [
      { kind: "laptop", image: "/images/prefeitura-hero.jpg", bg: "linear-gradient(135deg,#0b1f33 0%,#1d5a85 100%)" },
      { kind: "art", image: "/images/prefeitura-phone.jpg", bg: "#0b1f33" },
    ],
    image: "/images/prefeitura-hero.jpg",
    insights: [
      { value: "+100k", label: "residents reached by Ubatuba's digital innovation" },
      { value: "2", label: "national awards, incl. Smart City" },
    ],
    layout: "half",
  },
  {
    slug: "pixlab",
    n: "04",
    read: "Fintech",
    headline: [
      { text: "PixLab", bold: true },
      { text: ": a chaos lab that proves every cent of a " },
      { text: "Pix or boleto", bold: true },
      { text: " is credited exactly once" },
    ],
    tags: ["BACK-END", "JAVA", "FINTECH"],
    slides: [
      {
        kind: "mark",
        image: "",
        bg: "radial-gradient(140% 110% at 20% 10%, #1b2a44 0%, #0e1420 55%, #050810 100%)",
        label: "Fintech · Chaos engineering",
        title: "PixLab",
        chips: ["p99 16.5 ms", "500 req/s", "127 tests", "ledger = 0"],
      },
    ],
    image: "",
    insights: [
      { value: "127", label: "unit, property, integration & E2E tests" },
      { value: "16.5 ms", label: "p99 at 500 req/s with 30% redeliveries" },
    ],
    repo: "https://github.com/rodrigoscharp/PixLab",
    layout: "full",
  },
];

export type CareerStep = {
  /** Short start date shown under the logo on the track. */
  start: string;
  dates: string;
  role: string;
  company: string;
  /** Company name short enough for the track label. */
  short: string;
  logo: string;
  /** Tile background matching the logo file's own background. */
  logoBg: string;
  note: string;
  current?: boolean;
  tag?: string;
};

/* Career path shown on /work, oldest first (left to right on the track). */
export const CAREER: CareerStep[] = [
  {
    start: "2023",
    dates: "2023 - 2025",
    role: "Software Developer",
    company: "Bitwise Software Solutions",
    short: "Bitwise",
    logo: "/images/logos/bitwise.png",
    logoBg: "#ffffff",
    note: "Where it all started. Designed and shipped 30+ Java and Spring Boot back-ends for clients across industries: REST APIs, MySQL and PostgreSQL modeling and system integrations, in Scrum teams.",
  },
  {
    start: "2025",
    dates: "2025 - 2026",
    role: "Java Developer & Technical Consultant",
    company: "Prescon Assessoria",
    short: "Prescon",
    logo: "/images/logos/prescon.png",
    logoBg: "#ffffff",
    note: "Built back-end services hands-on for client systems and guided their architecture decisions, so teams could grow on solid Java and Spring Boot foundations.",
  },
  {
    start: "Feb 2025",
    dates: "02/2025 - Now",
    role: "Founder & CTO",
    company: "Muno App",
    short: "Muno",
    logo: "/images/logos/muno.png",
    logoBg: "#e6e5e0",
    note: "Founded Muno to take restaurants off paper: a 100% digital POS and menu platform, from the order on the table to the ticket in the kitchen, now serving 120+ restaurants. I lead product, engineering and operations, and built the back-end in Java and Spring Boot on AWS.",
    current: true,
  },
  {
    start: "2026",
    dates: "2026 - 08/2026",
    role: "Director of Technology and Innovation",
    company: "Municipality of Ubatuba",
    short: "Ubatuba",
    logo: "/images/logos/ubatuba.png",
    logoBg: "#f7f7f7",
    note: "Led the squad that took 6+ government systems to production, modernizing public services for 100,000+ citizens. Unified siloed municipal systems into one infrastructure, brought Docker and CI/CD to the department and won 2 national awards, including Smart City.",
  },
  {
    start: "Aug 2026",
    dates: "08/2026 - Now",
    role: "Tech Lead",
    company: "Municipality of Ubatuba",
    short: "Ubatuba",
    logo: "/images/logos/ubatuba.png",
    logoBg: "#f7f7f7",
    note: "Promoted to own the city's urgent and emergency healthcare systems: the software that has to work when lives are on the line. I am responsible for their architecture, reliability and delivery, and lead the squad through code review, design decisions and the roadmap.",
    current: true,
    tag: "Promoted",
  },
];

export type Row = {
  year: string;
  title: string;
  cta?: "case" | "live" | "repo" | "soon";
  href?: string;
  image?: string;
};

export const ROWS: Row[] = [
  { year: "2025 - Now", title: "Muno — POS & Digital Menu", cta: "live", href: "https://munoapp.com.br", image: "/images/muno-hero.jpg" },
  { year: "2026", title: "MyHub — Productivity SaaS", cta: "live", href: "https://usemyhub.com", image: "/images/myhub-hero.jpg" },
  { year: "2025", title: "PixLab — Pix & Boleto Reconciliation Lab", cta: "repo", href: "https://github.com/rodrigoscharp/PixLab" },
  { year: "2026", title: "PONTE — AAC App for Autistic Children", cta: "repo", href: "https://github.com/rodrigoscharp/PONTE" },
  { year: "2025", title: "Athena Matching Engine", cta: "repo", href: "https://github.com/rodrigoscharp/Athena-Matching-Engine" },
  { year: "2025", title: "HelpNote IA", cta: "repo", href: "https://github.com/rodrigoscharp/HelpNote_-IA" },
  { year: "2025", title: "WalletCore — Digital Wallet API", cta: "repo", href: "https://github.com/rodrigoscharp/WalletCore" },
  { year: "2025", title: "BETO IA — Self-hosted Assistant", cta: "repo", href: "https://github.com/rodrigoscharp/BETO-IA" },
];
