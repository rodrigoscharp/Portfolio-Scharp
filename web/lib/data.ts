export const SITE = {
  name: "Rodrigo Scharp",
  email: "rodrigoscharp@gmail.com",
  linkedin: "https://www.linkedin.com/in/rodrigoscharp",
  github: "https://github.com/rodrigoscharp",
  startYear: "2023",
  portrait: "/images/rodrigo-portrait.jpg",
};

export const CV_PDF = "/RodrigoScharpCV-ENG.pdf";

export const NAV = [
  { label: "Work", href: "/work" },
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
  caseHref?: string;
  soon?: boolean;
  layout: "full" | "half";
  dark: boolean;
};

export const CASES: Case[] = [
  {
    slug: "muno",
    n: "01",
    read: "5 min Read",
    headline: [
      { text: "Muno", bold: true },
      { text: ": a POS & digital menu platform serving " },
      { text: "120+ restaurants", bold: true },
    ],
    tags: ["WEB", "MOBILE", "SAAS"],
    bg: "linear-gradient(135deg,#fd601a 0%,#d93f00 100%)",
    device: "laptop",
    image: "/images/muno-hero.jpg",
    // FAKE numbers: placeholders until the real Muno metrics are filled in
    insights: [
      { value: "120+", label: "restaurants running on Muno" },
      { value: "38k", label: "orders processed per month" },
    ],
    live: "https://munoapp.com.br",
    layout: "full",
    dark: false,
  },
  {
    slug: "myhub",
    n: "02",
    read: "Coming soon ✦ Em breve",
    headline: [
      { text: "MyHub", bold: true },
      { text: ": a low-ticket productivity SaaS to run your " },
      { text: "whole routine", bold: true },
      { text: " in one place" },
    ],
    tags: ["WEB", "SAAS", "PRODUCTIVITY"],
    bg: "linear-gradient(135deg,#9342fc 0%,#5b21b6 100%)",
    device: "laptop",
    image: "/images/myhub-hero.jpg",
    insights: [],
    soon: true,
    layout: "full",
    dark: false,
  },
  {
    slug: "prefeitura",
    n: "03",
    read: "[X] min Read",
    headline: [
      { text: "Ubatuba City Hall", bold: true },
      { text: ": one of the people behind Ubatuba's digital innovation, reaching " },
      { text: "+100k residents", bold: true },
    ],
    tags: ["GOVTECH", "WEB", "INNOVATION"],
    bg: "linear-gradient(135deg,#0b1f33 0%,#1d5a85 100%)",
    device: "laptop",
    image: "/images/prefeitura-hero.jpg",
    insights: [
      { value: "+100k", label: "residents reached by Ubatuba's digital innovation" },
      { value: "2", label: "national awards, incl. Smart City" },
    ],
    layout: "full",
    dark: true,
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
  { year: "2026", title: "Ubatuba City Hall — Tech & Innovation", image: "/images/prefeitura-hero.jpg" },
  { year: "2025 - Now", title: "Muno — POS & Digital Menu", cta: "live", href: "https://munoapp.com.br", image: "/images/muno-hero.jpg" },
  { year: "2026", title: "MyHub — Productivity SaaS", cta: "soon", href: "", image: "/images/myhub-hero.jpg" },
  { year: "2026", title: "PONTE — AAC App for Autistic Children", cta: "repo", href: "https://github.com/rodrigoscharp/PONTE" },
  { year: "2025", title: "Athena Matching Engine", cta: "repo", href: "https://github.com/rodrigoscharp/Athena-Matching-Engine" },
  { year: "2025", title: "HelpNote IA", cta: "repo", href: "https://github.com/rodrigoscharp/HelpNote_-IA" },
  { year: "2025", title: "WalletCore — Digital Wallet API", cta: "repo", href: "https://github.com/rodrigoscharp/WalletCore" },
  { year: "2025", title: "BETO IA — Self-hosted Assistant", cta: "repo", href: "https://github.com/rodrigoscharp/BETO-IA" },
];
