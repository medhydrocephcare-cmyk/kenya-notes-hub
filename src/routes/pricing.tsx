import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Single paper",
    price: "KSh 300",
    blurb: "One past paper, note set or revision kit.",
    points: ["Full model answers", "Free preview before paying", "Instant PDF download", "Re-download from your account"],
  },
  {
    name: "Level bundle",
    price: "From KSh 1,200",
    blurb: "Every subject in one KASNEB level.",
    points: ["All subjects for the level", "Cheaper per paper", "Same instant delivery", "Best for a full sitting"],
    highlight: true,
  },
  {
    name: "Course bundle",
    price: "From KSh 3,500",
    blurb: "Every level of a full qualification.",
    points: ["Whole qualification covered", "Lowest cost per paper", "Great for early planners", "Lifetime re-download"],
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — KASNEB Past Papers, Notes & Bundles from KSh 300 | " + SITE.name },
      { name: "description", content: "Transparent pricing for KASNEB past papers with answers: single papers from KSh 300, level bundles and full course bundles. Pay by M-Pesa, download instantly." },
      { name: "keywords", content: keywords("kasneb past papers price", "cheap kasneb notes kenya", "kasneb revision kit bundle price") },
      { property: "og:title", content: `Pricing — ${SITE.name}` },
      { property: "og:description", content: "Single papers from KSh 300, plus level and full-course bundles. M-Pesa, instant download." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/pricing` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/pricing` }],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <PageShell
      eyebrow="Pricing"
      title="Simple, student-friendly pricing"
      intro="No subscriptions. Pay for what you need, keep it forever."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`rounded-xl border bg-card p-5 shadow-card ${t.highlight ? "border-primary ring-1 ring-primary/30" : "border-border/60"}`}
          >
            {t.highlight ? (
              <div className="mb-2 inline-block rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase text-gold-foreground">
                Most popular
              </div>
            ) : null}
            <div className="font-display text-lg font-bold">{t.name}</div>
            <div className="mt-1 font-display text-2xl font-extrabold text-primary">{t.price}</div>
            <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {t.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section heading="Payment methods">
        <p>
          M-Pesa only, via a secure STK push to your phone. We never see or store your PIN. See
          <Link to="/how-it-works" className="text-primary underline"> how it works</Link>.
        </p>
      </Section>

      <Section heading="Refunds">
        <p>
          Digital downloads are non-refundable, which is why every document has a free preview. If a
          file is corrupted or does not match its description, we replace or refund it — see the
          <Link to="/refunds" className="text-primary underline"> refund policy</Link>.
        </p>
      </Section>
    </PageShell>
  );
}
