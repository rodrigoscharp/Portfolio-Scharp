export type EventSlide = {
  slug: string;
  title: string;
  place: string;
  date: string;
  text: string;
  image: string;
  focus: string;
  bg: string;
  accent: string;
  ink: string;
};

/* order = newest first, as on the previous site */
export const EVENTS: EventSlide[] = [
  {
    slug: "codecon",
    title: "CODECON",
    place: "Curitiba",
    date: "August 2026",
    text: "CODECON Summit '26: connecting with Brazil's developer community.",
    image: "/images/events/codecon-summit-curitiba-2026.jpg",
    focus: "50% 62%",
    bg: "#46647f",
    accent: "#d5dedd",
    ink: "#ffffff",
  },
  {
    slug: "web-summit",
    title: "Web Summit",
    place: "Rio de Janeiro",
    date: "June 2026",
    text: "Web Summit Rio: attended at GitHub's invitation, representing MUNO as Founder.",
    image: "/images/events/web-summit-rio-2026.jpg",
    focus: "50% 55%",
    bg: "#f5f6fb",
    accent: "#f0344f",
    ink: "#0d0d0d",
  },
  {
    slug: "geopixel",
    title: "GeoPixel",
    place: "São José dos Campos",
    date: "May 2026",
    text: "EU GEOPIXEL: debating georeferencing success cases in Brazilian cities.",
    image: "/images/events/geopixel-sjc-2026.jpg",
    focus: "50% 62%",
    bg: "#c8365a",
    accent: "#d6d6d6",
    ink: "#ffffff",
  },
  {
    slug: "tdc-summit",
    title: "TDC Summit",
    place: "São Paulo",
    date: "April 2026",
    text: "As Director of Technology and Innovation of Ubatuba.",
    image: "/images/events/tdc-summit-sp-2026.jpg",
    focus: "50% 58%",
    bg: "#00596a",
    accent: "#c8b083",
    ink: "#ffffff",
  },
  {
    slug: "forum",
    title: "Fórum",
    place: "Pindamonhangaba",
    date: "April 2026",
    text: "Fórum de Cidades Digitais e Inteligentes: invited as Ubatuba's Director of Technology to the smart-cities forum.",
    image: "/images/events/forum-cidades-inteligentes-2026.jpg",
    focus: "50% 55%",
    bg: "#1b2f38",
    accent: "#b98f66",
    ink: "#ffffff",
  },
  {
    slug: "smart-cities",
    title: "Smart Cities",
    place: "Curitiba",
    date: "March 2026",
    text: "As C-Level Director of Technology, alongside Ubatuba's Secretary of Technology.",
    image: "/images/events/smart-cities-curitiba-2026.jpg",
    focus: "50% 45%",
    bg: "#3a5a40",
    accent: "#dad7cd",
    ink: "#ffffff",
  },
  {
    slug: "microsoft",
    title: "Microsoft",
    place: "Microsoft Office",
    date: "February 2026",
    text: "AI debate: a debate on Artificial Intelligence at Microsoft's office.",
    image: "/images/events/microsoft-debate-ia-2026.jpg",
    focus: "50% 58%",
    bg: "#2b2d42",
    accent: "#e9c46a",
    ink: "#ffffff",
  },
  {
    slug: "feira",
    title: "Empreendedor",
    place: "São Paulo",
    date: "October 2025",
    text: "Feira do Empreendedor: attended at SEBRAE's invitation.",
    image: "/images/events/feira-empreendedor-2025.jpg",
    focus: "50% 40%",
    bg: "#f2e9dc",
    accent: "#1d3557",
    ink: "#1d1d1d",
  },
  {
    slug: "tdc-sp",
    title: "TDC SP",
    place: "São Paulo",
    date: "September 2025",
    text: "TDC São Paulo, The Developer's Conference: representing Prescon Assessoria as Junior Java Developer.",
    image: "/images/events/tdc-sp-2025.jpg",
    focus: "50% 55%",
    bg: "#5e3b57",
    accent: "#f3c98b",
    ink: "#ffffff",
  },
];
