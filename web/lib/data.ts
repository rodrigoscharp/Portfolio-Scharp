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

/* Impact strip on the home page. Every number is also stated in CAREER or CASES. */
export const METRICS: { tag: string; value: number; prefix?: string; suffix?: string; label: string }[] = [
  { tag: "Muno", value: 120, suffix: "+", label: "restaurants running on a POS I built from zero" },
  { tag: "Ubatuba", value: 100, suffix: "k+", label: "citizens served by public systems I helped ship" },
  { tag: "Gov", value: 6, suffix: "+", label: "government systems my squad took to production" },
  { tag: "Consulting", value: 30, suffix: "+", label: "Java and Spring Boot back-ends delivered" },
  { tag: "Awards", value: 2, label: "national awards, including Smart City" },
];

export type Slide = {
  kind: "laptop" | "phone" | "art" | "mark" | "device" | "devices";
  image: string;
  /** "devices" only: iPhone screenshot (393x852 viewport) and its status bar. */
  phone?: string;
  statusBg?: string;
  statusDark?: boolean;
  bg: string;
  /** Two brand glows drifting over the solid background. */
  glow?: [string, string];
  /** Brand symbol drawn huge behind the devices, as a gradient "shadow". */
  mark?: string;
  markAspect?: string;
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
  /** App icon shown in the top-left corner of the slide. */
  logo?: string;
  /** The logo is a wordmark (shown alone on a light pill) instead of an app icon. */
  logoWide?: boolean;
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
      {
        kind: "devices",
        image: "/images/muno-desktop.jpg",
        phone: "/images/muno-iphone-app.jpg",
        statusBg: "#1e3d2f",
        bg: "#c4521e",
        glow: ["#ff9a5c", "#1e3d2f"],
        mark: "/images/logos/muno-mark.png",
        markAspect: "491 / 461",
      },
    ],
    logo: "/images/logos/muno-wordmark.png",
    logoWide: true,
    image: "/images/muno-desktop.jpg",
    insights: [
      { value: "Live", label: "100% digital POS replacing paper-based tickets" },
      { value: "02/2025", label: "shipped from zero as sole founder & CTO" },
    ],
    live: "https://munoapp.com.br",
    caseHref: "/work/muno",
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
      {
        kind: "devices",
        image: "/images/myhub-desktop-app.jpg",
        phone: "/images/myhub-iphone-app.jpg",
        statusBg: "#0f0e0e",
        bg: "#0b0b0d",
        glow: ["#8c8c91", "#4a4a4f"],
        mark: "/images/logos/myhub-mark.svg",
        markAspect: "1 / 1",
      },
    ],
    logo: "/images/logos/myhub-app.svg",
    image: "/images/myhub-desktop-app.jpg",
    insights: [
      { value: "Live", label: "productivity SaaS to run your whole routine in one place" },
    ],
    live: "https://usemyhub.com",
    caseHref: "/work/myhub",
    layout: "half",
  },
  {
    slug: "campo",
    n: "03",
    read: "Franquias",
    headline: [
      { text: "Campo", bold: true },
      { text: ": a virtual field consultant that shows " },
      { text: "franchise networks", bold: true },
      { text: " where each store leaves money on the table" },
    ],
    tags: ["STARTUP", "WEB", "SAAS"],
    slides: [
      {
        kind: "devices",
        image: "/images/campo-desktop-app.jpg",
        phone: "/images/campo-iphone-app.jpg",
        statusBg: "#f1f4ec",
        statusDark: true,
        bg: "#1d2a1f",
        glow: ["#2f8f5b", "#7fd3a0"],
        mark: "/images/logos/campo-mark.svg",
        markAspect: "45 / 53",
      },
    ],
    logo: "/images/logos/campo-app.svg",
    image: "/images/campo-desktop-app.jpg",
    insights: [
      { value: "Startup", label: "every store compared with stores of the same profile, every day" },
    ],
    soon: true,
    caseHref: "/work/campo",
    layout: "half",
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
  /** Case studies of what was built in this role. */
  built?: { label: string; href: string }[];
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
    note: "Founded Muno to take restaurants off paper: a 100% digital POS and menu platform, from the order on the table to the ticket in the kitchen, now serving 120+ restaurants. I lead product, engineering and operations, and built the whole platform myself.",
    built: [{ label: "Muno case study", href: "/work/muno" }],
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

/* Real quotes only: name, role and the person's OK to publish.
   The section stays hidden while this list is empty. */
export const TESTIMONIALS: { quote: string; name: string; role: string; photo?: string }[] = [];

export type Row = {
  year: string;
  title: string;
  cta?: "case" | "live" | "repo" | "soon";
  href?: string;
  image?: string;
};

export const ROWS: Row[] = [
  { year: "2025 - Now", title: "Muno — POS & Digital Menu", cta: "case", href: "/work/muno", image: "/images/muno-desktop.jpg" },
  { year: "2026", title: "MyHub — Productivity SaaS", cta: "case", href: "/work/myhub", image: "/images/myhub-desktop-app.jpg" },
  { year: "2026", title: "Campo — Virtual Field Consultant for Franchises", cta: "case", href: "/work/campo", image: "/images/campo-desktop-app.jpg" },
  { year: "2025", title: "PixLab — Pix & Boleto Reconciliation Lab", cta: "case", href: "/work/pixlab" },
  { year: "2026", title: "PONTE — AAC App for Autistic Children", cta: "case", href: "/work/ponte" },
  { year: "2025", title: "Athena — Order Matching Engine", cta: "case", href: "/work/athena" },
  { year: "2025", title: "WalletCore — Digital Wallet API", cta: "case", href: "/work/walletcore" },
];
