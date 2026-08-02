import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: `Refund Policy — Digital KASNEB Downloads | ${SITE.name}` },
      { name: "description", content: "Our refund policy for instantly delivered KASNEB past papers and notes: free previews before you buy, and replacement or refund for corrupted or mis-described files." },
      { property: "og:title", content: `Refund Policy — ${SITE.name}` },
      { property: "og:description", content: "Preview free before buying; corrupted or wrong files are replaced or refunded." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/refunds` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/refunds` }],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <PageShell eyebrow="Legal" title="Refund Policy" intro="Digital goods, delivered instantly — here is exactly where you stand.">
      <Section heading="The general rule">
        <p>Because every purchase is a digital file delivered immediately after payment, purchases are non-refundable once the download has been unlocked. This is why we publish a free preview of every single document.</p>
      </Section>
      <Section heading="When we do refund">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>The file is corrupted, incomplete or will not open.</li>
          <li>The document does not match the course, level, subject or sitting advertised.</li>
          <li>You were charged twice for the same order.</li>
          <li>Payment was taken but no download was ever unlocked.</li>
        </ul>
        <p>In these cases we replace the file or refund the full amount to the M-Pesa number used, normally within 3 working days.</p>
      </Section>
      <Section heading="How to claim">
        <p>
          Send your order reference and a short description of the problem via the
          <Link to="/contact" className="text-primary underline"> contact page</Link>, or WhatsApp {SITE.supportPhone}.
          Claims should be made within 7 days of purchase.
        </p>
      </Section>
    </PageShell>
  );
}
