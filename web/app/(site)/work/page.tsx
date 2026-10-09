import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import WorkTable from "@/components/WorkTable";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and selected projects by Rodrigo Scharp — Muno, Ubatuba City Hall, PixLab and more.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <WorkTable />
    </PageShell>
  );
}
