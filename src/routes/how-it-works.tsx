import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";

const STEPS = [
  { t: "Find your paper", d: "Pick your course and level, or search by subject and sitting. Every KASNEB qualification and level is listed." },
  { t: "Read the free preview", d: "Open real pages of the document — questions and worked answers — before spending a shilling." },
  { t: "Pay with M-Pesa", d: "Enter your phone number, approve the STK push on your handset, done. No card, no bank transfer." },
  { t: "Download instantly", d: "Your PDF unlocks the second payment is confirmed. Signed-in buyers can re-download any time." },
];

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How to Buy & Download KASNEB Past Papers with M-Pesa | " + SITE.name },
      { name: "description", content: "Four steps to get KASNEB past papers with answers: pick your paper, read the free preview, pay with M-Pesa, download the PDF instantly. No account required." },
      { name: "keywords", content: keywords("how to download kasneb past papers", "buy kasneb past papers mpesa", "kasneb notes instant download") },
      { property: "og:title", content: "How it works — buy KASNEB papers with M-Pesa in 4 steps" },
      { property: "og:description", content: "Preview free, pay by M-Pesa, download the PDF instantly." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/how-it-works` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/how-it-works` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "How to buy and download KASNEB past papers with M-Pesa",
          step: STEPS.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.t,
            text: s.d,
          })),
        }),
      },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <PageShell
      eyebrow="Getting started"
      title="How it works"
      intro="From searching to studying in under two minutes."
    >
      <ol className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s, i) => (
          <li key={s.t} className="rounded-xl border border-border/60 bg-card p-5 shadow-card">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </div>
            <div className="mt-3 font-display text-lg font-bold">{s.t}</div>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>

      <Section heading="What if the M-Pesa prompt doesn't appear?">
        <p>
          Check that the number you entered is the one registered for M-Pesa and that your phone has
          network. If the prompt times out, simply retry the payment from the same order page — you
          are never charged twice for the same order.
        </p>
      </Section>

      <Section heading="Ready?">
        <p>
          Browse <Link to="/courses" className="text-primary underline">every course and paper</Link>,
          or read the <Link to="/faq" className="text-primary underline">FAQ</Link> first.
        </p>
      </Section>
    </PageShell>
  );
}
