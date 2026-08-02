import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms of Service — ${SITE.name}` },
      { name: "description", content: "The terms that govern your use of our KASNEB and KNEC study material shop: licensing of downloads, acceptable use, payments and liability." },
      { property: "og:title", content: `Terms of Service — ${SITE.name}` },
      { property: "og:description", content: "Licensing, acceptable use, payments and liability for our digital study materials." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/terms` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/terms` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell eyebrow="Legal" title="Terms of Service" intro="Last updated: this version applies to all orders placed today.">
      <Section heading="1. Who we are">
        <p>{SITE.name} sells digital study materials for KASNEB and KNEC candidates in Kenya. We are independent and not affiliated with KASNEB or KNEC.</p>
      </Section>
      <Section heading="2. Your licence">
        <p>When you buy a document you receive a personal, non-transferable licence to use it for your own revision. You may print a copy for yourself. You may not resell, republish, upload to file-sharing sites, or distribute the file to others.</p>
      </Section>
      <Section heading="3. Payment">
        <p>All prices are in Kenyan Shillings and payable by M-Pesa. Your download unlocks once payment is confirmed by the payment provider. Orders that are not confirmed within the payment window are cancelled automatically and no money is taken.</p>
      </Section>
      <Section heading="4. Accounts">
        <p>Accounts are optional. If you create one, keep your credentials secure — you are responsible for activity under your account.</p>
      </Section>
      <Section heading="5. Accuracy">
        <p>Our materials are prepared carefully but are revision aids, not official KASNEB publications. We do not guarantee exam results.</p>
      </Section>
      <Section heading="6. Liability">
        <p>To the maximum extent permitted by Kenyan law, our liability for any claim relating to a purchase is limited to the amount you paid for that purchase.</p>
      </Section>
      <Section heading="7. Contact">
        <p>Questions about these terms: {SITE.supportEmail} or {SITE.supportPhone}.</p>
      </Section>
    </PageShell>
  );
}
