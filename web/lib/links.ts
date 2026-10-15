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
  /** Product cards: background gradient and accent color. */
  bg?: string;
  accent?: string;
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
    image: "/images/muno-mobile-v4.png",
    aspect: "714 / 953",
    bg: "linear-gradient(160deg,#ff8a3d 0%,#fd601a 45%,#b83200 100%)",
    accent: "#fd601a",
  },
  {
    id: "myhub",
    kind: "product",
    eyebrow: "Founder",
    title: "MyHub",
    subtitle: "Sua rotina inteira em um só lugar",
    href: `https://usemyhub.com?${UTM}`,
    image: "/images/myhub-mobile-v2.png",
    aspect: "581 / 921",
    bg: "linear-gradient(160deg,#a970ff 0%,#7b2ff2 50%,#3b1180 100%)",
    accent: "#b8f04f",
  },
];
