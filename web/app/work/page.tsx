import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import WorkTable from "@/components/WorkTable";

export const metadata: Metadata = { title: "Work — Rodrigo Scharp" };

export default function WorkPage() {
  return (
    <PageShell>
      <WorkTable />
    </PageShell>
  );
}
