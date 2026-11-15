/* Content for the link-in-bio page (links.rodrigoscharp.com). Add new cards here. */

const UTM = "utm_source=instagram&utm_medium=bio&utm_campaign=links";

export type LinkCard = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  kind: "featured" | "product";
  /** Short label shown above the title. */
  eyebrow: string;
  /** Featured card: tech names scrolling along the bottom edge. */
  tags?: string[];
  image?: string;
  /** Phone mockup aspect ratio, for product cards. */
  aspect?: string;
  /** Product cards: solid brand background, accent color, the brand symbol
      drawn huge behind the phone, and two drifting glows. */
  bg?: string;
  accent?: string;
  mark?: string;
  glow?: [string, string];
};

export const LINK_PROFILE = {
  name: "Rodrigo Scharp",
  role: "Engenheiro de software Java",
  bio: "Founder da Muno e do MyHub · Tech Lead na Prefeitura de Ubatuba",
  shareUrl: "https://links.rodrigoscharp.com",
};

export const LINK_SOCIALS = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/rodrigoscharp" },
  { id: "github", label: "GitHub", href: "https://github.com/rodrigoscharp" },
  { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@rodrigoscharp" },
  { id: "email", label: "E-mail", href: "mailto:rodrigoscharp@gmail.com" },
] as const;

export const LINK_CARDS: LinkCard[] = [
  {
    id: "about",
    kind: "featured",
    eyebrow: "About me",
    title: "Quem é o Rodrigo",
    subtitle: "Da primeira linha de código a C-Level em 3 anos",
    href: `https://rodrigoscharp.com?${UTM}`,
    image: "/images/rodrigo-portrait.jpg",
    tags: ["Java", "Spring Boot", "AWS", "Docker", "PostgreSQL", "Next.js"],
  },
  {
    id: "muno",
    kind: "product",
    eyebrow: "Founder",
    title: "Muno",
    subtitle: "PDV e cardápio digital para restaurantes",
    href: `https://munoapp.com.br?${UTM}`,
    image: "/images/muno-iphone-app.jpg",
    aspect: "393 / 852",
    bg: "#c4521e",
    accent: "#fd601a",
    mark: "/images/logos/muno-mark.png",
    glow: ["#ff9a5c", "#1e3d2f"],
  },
  {
    id: "myhub",
    kind: "product",
    eyebrow: "Founder",
    title: "MyHub",
    subtitle: "Sua rotina inteira em um só lugar",
    href: `https://usemyhub.com?${UTM}`,
    image: "/images/myhub-iphone-app.jpg",
    aspect: "393 / 852",
    bg: "#0b0b0d",
    accent: "#b8f04f",
    mark: "/images/logos/myhub-mark.svg",
    glow: ["#8c8c91", "#4a4a4f"],
  },
];

/* Discount coupons from partners. Every code is the same: my surname. */
export type Coupon = {
  id: string;
  brand: string;
  what: string;
  code: string;
  href: string;
  /** Card colors: background and accent. */
  bg: string;
  accent: string;
};

export const LINK_COUPONS: Coupon[] = [
  {
    id: "rocketseat",
    brand: "Rocketseat",
    what: "Cursos e formações de programação",
    code: "SCHARP",
    href: "https://www.rocketseat.com.br/oferta/influencer/v2/scharp",
    bg: "#121214",
    accent: "#8257e5",
  },
  {
    id: "minimal",
    brand: "Minimal Club",
    what: "Roupas básicas masculinas",
    code: "SCHARP",
    href: "https://minimalclub.com.br",
    bg: "#f2f0ea",
    accent: "#111111",
  },
];
