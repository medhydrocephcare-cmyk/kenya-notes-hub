import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, Section } from "@/components/page-shell";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";
import { Mail, Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact ${SITE.name} — Support for KASNEB Past Paper Downloads` },
      { name: "description", content: "Need help with a download, an M-Pesa payment or finding a KASNEB paper? Call, WhatsApp or email our Kenyan support team — we reply the same day." },
      { name: "keywords", content: keywords("kasneb past papers contact", "kasneb notes support kenya") },
      { property: "og:title", content: `Contact ${SITE.name}` },
      { property: "og:description", content: "Same-day help with downloads, M-Pesa payments and finding the right KASNEB paper." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
      ...socialImageMeta(),
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `Contact ${SITE.name}`,
          url: `${SITE_URL}/contact`,
          mainEntity: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE_URL,
            email: SITE.supportEmail,
            telephone: SITE.supportPhone,
            areaServed: "KE",
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const tel = SITE.supportPhone.replace(/\s+/g, "");
  return (
    <PageShell
      eyebrow="Support"
      title="Contact us"
      intro="Payment issue, download problem, or you can't find a paper? Talk to a human."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <a href={`tel:${tel}`} className="rounded-xl border border-border/60 bg-card p-5 shadow-card transition hover:border-primary">
          <Phone className="h-5 w-5 text-primary" />
          <div className="mt-2 text-sm font-bold">Call us</div>
          <div className="mt-1 text-sm text-muted-foreground">{SITE.supportPhone}</div>
        </a>
        <a href={`https://wa.me/254${tel.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border/60 bg-card p-5 shadow-card transition hover:border-primary">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div className="mt-2 text-sm font-bold">WhatsApp</div>
          <div className="mt-1 text-sm text-muted-foreground">Fastest reply, 8am–9pm</div>
        </a>
        <a href={`mailto:${SITE.supportEmail}`} className="rounded-xl border border-border/60 bg-card p-5 shadow-card transition hover:border-primary">
          <Mail className="h-5 w-5 text-primary" />
          <div className="mt-2 text-sm font-bold">Email</div>
          <div className="mt-1 break-all text-sm text-muted-foreground">{SITE.supportEmail}</div>
        </a>
      </div>

      <Section heading="Before you contact us">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Paid but no download? Open your order link again — downloads unlock automatically once M-Pesa confirms.</li>
          <li>Signed in? Every purchase is listed under <Link to="/account" className="text-primary underline">My downloads</Link>.</li>
          <li>Most answers are already on the <Link to="/faq" className="text-primary underline">FAQ page</Link>.</li>
        </ul>
      </Section>

      <Section heading="Requesting a paper we don't stock">
        <p>
          Tell us the course, level, subject and sitting (for example “CPA Intermediate 1, Financial
          Management, December 2024”) and we will add it to the production queue and message you when
          it goes live.
        </p>
      </Section>
    </PageShell>
  );
}
