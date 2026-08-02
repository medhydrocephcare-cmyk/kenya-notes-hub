import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About ${SITE.name} — KASNEB Past Papers, Notes & Revision Kits` },
      { name: "description", content: "Who we are: a Kenyan study-materials shop giving KASNEB and KNEC students affordable past papers with model answers, notes and revision kits, delivered instantly by M-Pesa." },
      { name: "keywords", content: keywords("about kasneb papers", "kasneb study materials shop kenya") },
      { property: "og:title", content: `About ${SITE.name}` },
      { property: "og:description", content: "A Kenyan study-materials shop for KASNEB and KNEC students — past papers with answers, notes and revision kits." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/about` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="About us"
      title={`About ${SITE.name}`}
      intro="Affordable, exam-focused KASNEB and KNEC study material for Kenyan students."
    >
      <Section heading="Why we exist">
        <p>
          Most KASNEB candidates fail not because the syllabus is impossible, but because they walk
          into the exam room having never seen how questions are actually asked and marked. We
          collect, rewrite and organise past papers with model answers, plus condensed notes and
          revision kits, so every hour of revision maps directly to the exam.
        </p>
      </Section>

      <Section heading="What you get">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Past papers with step-by-step model answers for CPA, ATD, CS, CIFA, CCP, CICT, DCM, DICT and FAB.</li>
          <li>Topic notes written against the current KASNEB syllabus.</li>
          <li>Revision kits that group questions by topic so you can drill weak areas.</li>
          <li>A free preview of every single document before you pay.</li>
          <li>Instant PDF download after M-Pesa payment — no waiting, no email delays.</li>
        </ul>
      </Section>

      <Section heading="Honest pricing">
        <p>
          Most documents are priced at a flat, student-friendly rate, and bundles cut the cost per
          paper further. See <Link to="/pricing" className="text-primary underline">pricing</Link> or
          start browsing <Link to="/courses" className="text-primary underline">all courses and papers</Link>.
        </p>
      </Section>

      <Section heading="Independence">
        <p>
          {SITE.name} is an independent revision resource. We are not affiliated with, endorsed by,
          or connected to KASNEB or KNEC. All materials are our own original work produced for
          revision purposes.
        </p>
      </Section>
    </PageShell>
  );
}
