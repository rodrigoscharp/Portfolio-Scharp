import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ResumePaper from "@/components/ResumePaper";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Rodrigo Scharp — resume, roles, and tech stack. Java, Spring Boot, AWS, system design, team leadership. Download the PDF.",
};

export default function ResumePage() {
  return (
    <PageShell>
      <ResumePaper />
    </PageShell>
  );
}
