import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import AboutPage from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Rodrigo Scharp — Java software engineer, Founder & CTO at Muno App, and Tech Lead at the Municipality of Ubatuba.",
};

export default function About() {
  return (
    <PageShell>
      <AboutPage />
    </PageShell>
  );
}
