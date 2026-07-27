import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { courses, countPapersInCourse, papers } from "@/lib/data";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Download,
  Clock,
  Star,
  Quote,
  BookOpen,
  Award,
  Flame,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kasneb Pastpapers — KASNEB & KNEC notes, kits & past papers with answers" },
      { name: "description", content: "Buy updated KASNEB & KNEC study notes, revision kits and past papers with model answers. CPA, ATD, CS, CIFA, CCP, CICT. Pay with M-Pesa. Instant download." },
      { property: "og:title", content: "Kasneb Pastpapers — KASNEB & KNEC study notes" },
      { property: "og:description", content: "Kenya's fastest-growing shop for updated KASNEB notes and past-paper answers. Free preview on every product." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = papers.slice(0, 4);
  const bundles = papers.filter((p) => p.bundleType && p.bundleType !== "single").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-gradient">
        {/* pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1.5px, transparent 1.5px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px, 60px 60px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.15fr_1fr] md:py-20 lg:py-24">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3 w-3 text-gold" />
              Updated for the August 2026 sitting
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Pass your <span className="text-gold">KASNEB</span> &amp; <span className="text-gold">KNEC</span> papers on the first sitting.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Complete notes, revision kits and past-paper model answers for
              <b> CPA, ATD, CS, CIFA, CCP</b> and <b>CICT</b> — written by qualified Kenyan tutors,
              refreshed every sitting.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" className="bg-gold text-gold-foreground hover:brightness-105">
                  Browse all courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  See bundles &amp; save 40%
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6 text-primary-foreground">
              <Stat number="12,400+" label="students served" />
              <Stat number="4.8/5" label="average rating" />
              <Stat number="8 min" label="avg. delivery" />
            </div>
          </div>

          {/* Right — hero card cluster */}
          <div className="relative hidden md:block">
            <div className="absolute -right-10 top-4 rotate-3 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3 text-white">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-gold-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/60">Bestseller</div>
                  <div className="text-sm font-bold">CPA Foundation Level 1 Bundle</div>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-2xl font-extrabold text-gold">KSh 1,200</span>
                <span className="text-sm text-white/60 line-through">KSh 2,000</span>
              </div>
            </div>
            <div className="absolute -left-4 top-40 -rotate-2 rounded-2xl border border-white/20 bg-white p-5 shadow-2xl">
              <div className="flex items-center gap-2 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-2 text-sm text-foreground">
                "Passed my Financial Accounting paper on first try. The model answers are gold."
              </blockquote>
              <div className="mt-2 text-xs font-medium text-muted-foreground">— Brian K., Nairobi</div>
            </div>
            <div className="absolute right-10 bottom-0 rotate-1 rounded-2xl border border-white/20 bg-gold-gradient p-5 text-gold-foreground shadow-2xl">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Hot deal</span>
              </div>
              <div className="mt-2 font-display text-xl font-extrabold leading-tight">
                CPA Full Course<br />– 50% off
              </div>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="relative border-t border-white/10 bg-black/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-5 text-primary-foreground md:grid-cols-4">
            {[
              { icon: Download, t: "Instant download" },
              { icon: ShieldCheck, t: "Secure M-Pesa" },
              { icon: Clock, t: "Updated every sitting" },
              { icon: BookOpen, t: "Free answer preview" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-gold">
                  <f.icon className="h-4 w-4" />
                </span>
                <span className="font-semibold">{f.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN SHOP GRID with sidebar */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand">Shop by course</div>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Choose your KASNEB path</h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-semibold text-brand hover:underline sm:inline">
            View all →
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>

          <div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((c, i) => (
                <Link
                  key={c.slug}
                  to="/courses/$courseSlug"
                  params={{ courseSlug: c.slug }}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
                >
                  <div
                    aria-hidden
                    className={`absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-70 blur-2xl ${
                      ["bg-emerald-300", "bg-amber-300", "bg-violet-300", "bg-sky-300", "bg-rose-300", "bg-cyan-300"][i % 6]
                    }`}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg bg-brand px-2.5 py-1 text-xs font-bold text-primary-foreground">
                        {c.code}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {countPapersInCourse(c.slug)} papers
                      </span>
                    </div>
                    <div className="mt-6 font-display text-lg font-bold">{c.name}</div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                      Explore levels <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-surface/60 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-brand">
                <Flame className="mr-1 inline h-3 w-3 -translate-y-0.5" />
                Trending this sitting
              </div>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Popular papers &amp; kits</h2>
            </div>
            <Link to="/courses" className="text-sm font-semibold text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} paper={p} />
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLES BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 30% 30%, white 1.5px, transparent 1.5px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-foreground">
                Save up to 50%
              </div>
              <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                Whole-level and full-course bundles
              </h2>
              <p className="mt-3 max-w-xl text-white/85">
                Grab every paper for a level — or the entire course journey — at a fraction of the individual price.
                One download, everything you need.
              </p>
            </div>
            <Link to="/courses">
              <Button size="lg" className="bg-white text-brand hover:bg-white/90">
                Shop bundles <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="relative mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bundles.map((p) => (
              <ProductCard key={p.id} paper={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-surface/60 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-brand">How it works</div>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
              From cart to download in under 2 minutes
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "01", t: "Pick your paper", d: "Browse by course and level. Preview real answer content before you buy." },
              { n: "02", t: "Pay with M-Pesa", d: "Enter your Safaricom number, approve the STK push. Card & bank also supported." },
              { n: "03", t: "Download instantly", d: "PDF unlocks the moment payment confirms. Access it any time from your account." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-card">
                <div className="absolute -top-4 left-6 grid h-9 w-16 place-items-center rounded-full bg-brand-gradient font-display text-sm font-extrabold text-primary-foreground">
                  {s.n}
                </div>
                <div className="mt-3 font-display text-lg font-bold">{s.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-brand">Real students, real results</div>
          <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight">Loved by Kenyan students</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { n: "Faith W.", c: "Kisumu • CPA Foundation", t: "The preview convinced me — I could see actual answers, not just the questions. Passed both papers on first sitting." },
            { n: "Peter M.", c: "Nakuru • ATD Level II", t: "Notes are actually up-to-date. Every diagram, every formula, exactly matched what came in the exam." },
            { n: "Cynthia A.", c: "Nairobi • CS Intermediate", t: "Instant M-Pesa unlock and clean PDFs that read well on my phone. Highly recommended." },
          ].map((r) => (
            <div key={r.n} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <Quote className="h-6 w-6 text-brand/40" />
              <p className="mt-3 text-sm text-foreground/90">"{r.t}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient font-display font-bold text-primary-foreground">
                  {r.n.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-brand-dark py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gold">Why Kasneb Pastpapers</div>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Built by Kenyans, for Kenyan students.
              </h2>
              <p className="mt-4 text-white/80">
                Every product is written by qualified tutors, previewed openly, updated every sitting, and priced fairly
                for students. No stale 2019 notes, no locked previews, no games.
              </p>
              <Link to="/courses" className="mt-6 inline-flex">
                <Button size="lg" className="bg-gold text-gold-foreground hover:brightness-105">
                  Start browsing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Free preview of actual answer content — not just the question",
                "Every product shows exam sitting & last-updated date",
                "Smart bundles: whole level, full course, or current sitting",
                "Written reviews from real Kenyan students",
                "Mobile-first — designed for phones, works everywhere",
                "Instant download after M-Pesa STK push",
              ].map((t) => (
                <div key={t} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                  <span className="text-sm">{t}</span>
                </div>
              ))}
            </div>
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
      <div className="font-display text-2xl font-extrabold text-gold sm:text-3xl">{number}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-white/70">{label}</div>
    </div>
  );
}
