import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import ResumePaper from "@/components/ResumePaper";

export const metadata: Metadata = { title: "Resume — Rodrigo Scharp" };

export default function ResumePage() {
  return (
    <PageShell>
      <ResumePaper />
    </PageShell>
  );
}
