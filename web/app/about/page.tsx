import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = { title: "About — Rodrigo Scharp" };

export default function About() {
  return (
    <PageShell>
      <AboutPage />
    </PageShell>
  );
}
