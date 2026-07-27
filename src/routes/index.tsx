import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses, countPapersInCourse, papers } from "@/lib/data";
import { Check, Star, Sparkles, ShieldCheck, Eye, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chapa Notes — KASNEB & KNEC notes, kits and past papers" },
      { name: "description", content: "Modern KASNEB and KNEC notes with model answers. Free preview on every product, updated for the current sitting. Pay with M-Pesa." },
      { property: "og:title", content: "Chapa Notes — KASNEB & KNEC notes and past papers" },
      { property: "og:description", content: "Notes and past-paper answers for CPA, ATD, CS, CIFA, CCP and KNEC. Preview before you buy." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = papers.slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.15fr_1fr] md:py-24">
          <div>
            <Badge variant="secondary" className="mb-4 gap-1">
              <Sparkles className="h-3 w-3" /> Updated for the August 2026 sitting
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Pass your KASNEB & KNEC papers with notes that actually match the syllabus.
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Complete notes, revision kits and past-paper answers for CPA, ATD, CS, CIFA, CCP and KNEC diplomas.
              Preview real answer content before you pay.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg">Browse all courses</Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline">See bundles</Button>
              </Link>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-sm">
              <Stat number="12,400+" label="students served" />
              <Stat number="4.8/5" label="avg. rating" />
              <Stat number="6" label="courses covered" />
            </div>
          </div>

          <div className="grid gap-3">
            <Feature icon={<Eye className="h-4 w-4" />} title="Free answer preview">
              See a full page of actual answer content on every product — not just the question.
            </Feature>
            <Feature icon={<RefreshCw className="h-4 w-4" />} title="Updated every sitting">
              Each product shows its exam sitting and last-updated date. No stale 2019 notes.
            </Feature>
            <Feature icon={<ShieldCheck className="h-4 w-4" />} title="Secure M-Pesa checkout">
              Pay with M-Pesa, card or bank transfer through Palpluss. Instant download after payment.
            </Feature>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Choose your course</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every KASNEB and KNEC course, organised the way KASNEB organises them.
            </p>
          </div>
          <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link
              key={c.slug}
              to="/courses/$courseSlug"
              params={{ courseSlug: c.slug }}
              className="group"
            >
              <Card className={`h-full overflow-hidden border-border/60 bg-gradient-to-br ${c.color} p-6 transition hover:border-primary/40 hover:shadow-lg`}>
                <div className="flex items-start justify-between">
                  <span className="rounded-md bg-background/80 px-2 py-1 text-xs font-medium">{c.code}</span>
                  <span className="text-xs text-muted-foreground">
                    {countPapersInCourse(c.slug)} papers
                  </span>
                </div>
                <div className="mt-6 text-lg font-semibold">{c.name}</div>
                <div className="mt-2 text-sm text-muted-foreground">{c.description}</div>
                <div className="mt-6 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Explore →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Popular this sitting</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.id} to="/papers/$paperId" params={{ paperId: p.id }}>
              <Card className="flex h-full flex-col p-5 transition hover:border-primary/40 hover:shadow-md">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({p.reviews.length} reviews)</span>
                </div>
                <div className="mt-2 font-semibold leading-snug">{p.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.examSitting} • updated {p.lastUpdated}</div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-lg font-semibold">KSh {p.price}</span>
                  {p.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">KSh {p.originalPrice}</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Why students choose Chapa</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Free preview of actual answer content — not just the exam question",
              "Every product shows exam sitting and last-updated date",
              "Smart bundles: whole level, whole course or current-sitting-only",
              "Written reviews from real Kenyan students, not just star ratings",
              "Mobile-first — designed for phones, works everywhere",
              "Instant download after M-Pesa payment via Palpluss",
            ].map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-4">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-semibold">{number}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
function Feature({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">{icon}</span>
        {title}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
