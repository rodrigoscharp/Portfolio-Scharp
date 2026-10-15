import type { Metadata, Viewport } from "next";
import { Archivo, Poppins, Space_Mono } from "next/font/google";
import { LINK_PROFILE } from "@/lib/links";
import "./links.css";

// Own root layout: the link-in-bio page is a standalone mobile screen, without
// the portfolio's navbar, cursor or theme toggle.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  axes: ["wdth"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const TITLE = "Rodrigo Scharp · Links";
const DESCRIPTION = `${LINK_PROFILE.role}. ${LINK_PROFILE.bio}.`;

export const metadata: Metadata = {
  metadataBase: new URL(LINK_PROFILE.shareUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: LINK_PROFILE.shareUrl,
    siteName: "Rodrigo Scharp",
    title: TITLE,
    description: DESCRIPTION,
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  alternates: { canonical: LINK_PROFILE.shareUrl },
};

export const viewport: Viewport = {
  themeColor: "#09090d",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function LinksLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${archivo.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
