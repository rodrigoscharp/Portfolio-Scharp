import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import CaseStudyView from "@/components/CaseStudyView";
import { CASE_STUDIES, caseBySlug } from "@/lib/caseStudies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  if (!c) return {};
  return { title: `${c.name} case study`, description: c.tagline };
}

export default async function CaseStudyPage({ params }: Props) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();

  return (
    <PageShell>
      <CaseStudyView slug={c.slug} />
    </PageShell>
  );
}
