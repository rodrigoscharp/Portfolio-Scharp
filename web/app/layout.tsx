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

export const metadata: Metadata = {
  title: "Rodrigo Scharp — Java Back-end Engineer",
  description:
    "Java Back-end Engineer (Spring Boot, AWS, Docker). Founder/CTO at Muno and founder of Bitwise Software Solutions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${doto.variable} ${archivo.variable} ${instrumentSerif.variable} ${spaceMono.variable}`}
    >
      <body>
        <Providers>
          {children}
          <Cursor />
        </Providers>
      </body>
    </html>
  );
}
