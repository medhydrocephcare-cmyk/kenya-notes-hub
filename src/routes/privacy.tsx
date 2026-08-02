import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${SITE.name}` },
      { name: "description", content: "How we collect, use and protect your data when you buy KASNEB past papers: phone numbers for M-Pesa, email for receipts, and nothing sold to third parties." },
      { property: "og:title", content: `Privacy Policy — ${SITE.name}` },
      { property: "og:description", content: "What we collect, why we collect it, and how long we keep it." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell eyebrow="Legal" title="Privacy Policy" intro="Plain-English summary of what we collect and why.">
      <Section heading="What we collect">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your name, phone number and (optionally) email address, to process the M-Pesa payment and deliver your download.</li>
          <li>Order records: which documents you bought and when, so you can re-download them.</li>
          <li>Basic analytics about page visits, to understand which materials students need.</li>
        </ul>
      </Section>
      <Section heading="What we never do">
        <p>We never see or store your M-Pesa PIN, and we do not sell or rent your personal data to anyone.</p>
      </Section>
      <Section heading="Who we share with">
        <p>Only the service providers needed to run the shop: our payment processor (to take payment), our hosting and database providers (to store your order), and our email provider (to send receipts).</p>
      </Section>
      <Section heading="How long we keep it">
        <p>Order records are kept for as long as your account exists so you can re-download purchases, and thereafter only as long as required for tax and accounting purposes.</p>
      </Section>
      <Section heading="Your rights">
        <p>You may ask us to show, correct or delete the personal data we hold about you. Email {SITE.supportEmail} and we will action the request.</p>
      </Section>
    </PageShell>
  );
}
