import type { Metadata } from "next";
import {
  Archivo,
  Doto,
  Instrument_Serif,
  Poppins,
  Space_Mono,
} from "next/font/google";
import Providers from "@/components/Providers";
import Cursor from "@/components/Cursor";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: "variable",
  axes: ["ROND"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rodrigoscharp.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rodrigo Scharp — Java Back-end Engineer",
    template: "%s · Rodrigo Scharp",
  },
  description:
    "Java back-end engineer (Spring Boot, AWS, Docker), Founder & CTO at Muno App and Tech Lead at the Municipality of Ubatuba.",
  authors: [{ name: "Rodrigo Scharp", url: SITE_URL }],
  creator: "Rodrigo Scharp",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Rodrigo Scharp",
    title: "Rodrigo Scharp — Java Back-end Engineer",
    description:
      "Java back-end engineer (Spring Boot, AWS, Docker), Founder & CTO at Muno App and Tech Lead at the Municipality of Ubatuba.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo Scharp — Java Back-end Engineer",
    description:
      "Java back-end engineer, Founder & CTO at Muno App and Tech Lead at the Municipality of Ubatuba.",
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${doto.variable} ${archivo.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
