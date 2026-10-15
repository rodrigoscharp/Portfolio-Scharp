import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Career from "@/components/Career";
import WorkTable from "@/components/WorkTable";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Career path, case studies and selected projects by Rodrigo Scharp — Muno, Ubatuba City Hall, PixLab and more.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <Career />
      <WorkTable />
    </PageShell>
  );
}
