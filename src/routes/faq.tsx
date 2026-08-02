import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";

const FAQS = [
  {
    q: "Are these real KASNEB past papers with answers?",
    a: "Yes — every product is built around the questions asked in real KASNEB sittings, rewritten in our own words with full step-by-step model answers so you can see exactly how marks are earned.",
  },
  {
    q: "How do I pay?",
    a: "M-Pesa only. You enter your phone number at checkout, an STK push pops up on your phone, you enter your PIN, and your download unlocks the moment payment is confirmed.",
  },
  {
    q: "How fast do I get the PDF?",
    a: "Instantly. There is no waiting for an agent or an email — the download link appears on your order page as soon as M-Pesa confirms the payment.",
  },
  {
    q: "Can I see the paper before paying?",
    a: "Yes. Every paper, note and revision kit has a free preview showing real pages from the document, so you know exactly what you are buying.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can check out as a guest. Creating an account is optional but keeps all your downloads in one place so you can re-download any time.",
  },
  {
    q: "Can I download the same file more than once?",
    a: "Yes. Signed-in buyers can re-download any purchased document from the My downloads page. Guests should save the PDF as soon as they receive it.",
  },
  {
    q: "Which courses do you cover?",
    a: "CPA, ATD, CS, CIFA, CCP, CICT, DCM, DICT and FAB — every level of each qualification, plus KNEC-aligned material.",
  },
  {
    q: "Do you offer refunds?",
    a: "Because these are digital files delivered instantly, purchases are non-refundable. That is exactly why every document has a free preview. If a file is corrupted or wrong, we replace it or refund it.",
  },
  {
    q: "Are you affiliated with KASNEB?",
    a: "No. We are an independent revision resource and are not affiliated with, endorsed by, or connected to KASNEB or KNEC.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "KASNEB Past Papers FAQ — Payment, Downloads & Answers | " + SITE.name },
      { name: "description", content: "Answers to the most common questions about buying KASNEB past papers with answers: M-Pesa payment, instant PDF download, previews, accounts and refunds." },
      { name: "keywords", content: keywords("kasneb past papers faq", "how to download kasneb past papers", "buy kasneb notes mpesa") },
      { property: "og:title", content: `Frequently asked questions — ${SITE.name}` },
      { property: "og:description", content: "M-Pesa payment, instant downloads, free previews and refunds — everything explained." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PageShell
      eyebrow="Help centre"
      title="Frequently asked questions"
      intro="Payment, downloads, previews and refunds — answered in plain English."
    >
      <div className="space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="group rounded-xl border border-border/60 bg-card p-5 shadow-card">
            <summary className="cursor-pointer list-none font-display text-base font-bold marker:hidden">
              {f.q}
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Still stuck? <Link to="/contact" className="text-primary underline">Contact support</Link> or
        browse <Link to="/courses" className="text-primary underline">all papers</Link>.
      </p>
    </PageShell>
  );
}
