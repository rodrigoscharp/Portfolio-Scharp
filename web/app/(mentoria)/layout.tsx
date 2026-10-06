import { Anton, Archivo, Caveat, Fraunces } from "next/font/google";
import "./lando-system.css";
import "./mentoria.css";

// Own root layout: the mentoria LP keeps the Lando design system, whose global
// resets would leak into the portfolio if both shared one <html>.
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

export default function MentoriaLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${archivo.variable} ${caveat.variable} ${fraunces.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
