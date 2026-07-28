import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/lib/data";
import {
  allPapersQueryOptions,
  catalogStatsQueryOptions,
} from "@/lib/papers.queries";
import { countByCourse } from "@/lib/paper-catalog";
import { listBlogPosts } from "@/lib/blog.functions";
import { listCategories } from "@/lib/categories.functions";
import { SITE, SITE_URL } from "@/lib/site-config";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Download,
  Clock,
  BookOpen,
  Flame,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(allPapersQueryOptions),
      context.queryClient.ensureQueryData(catalogStatsQueryOptions),
    ]);
  },
  head: () => ({
    meta: [
      { title: `KASNEB Past Papers & Notes Kenya | ${SITE.name}` },
      { name: "description", content: `Updated KASNEB & KNEC notes, revision kits and past papers with answers. CPA, ATD, CS, CIFA and more. Pay with M-Pesa, download instantly.` },
      { property: "og:title", content: `${SITE.name} — KASNEB & KNEC study notes` },
      { property: "og:description", content: "Kenya's fastest-growing shop for updated KASNEB notes and past-paper answers. Free preview on every product." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-center text-sm text-muted-foreground">
      Failed to load catalog: {error.message}
    </div>
  ),
  component: Home,
});

function Home() {
  const { data: papers } = useSuspenseQuery(allPapersQueryOptions);
  const { data: stats } = useSuspenseQuery(catalogStatsQueryOptions);

  const featured = [...papers].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 4);
  const bundles = papers.filter((p) => p.bundleType && p.bundleType !== "single").slice(0, 4);

  const latest = stats.latestUpdate ? new Date(stats.latestUpdate).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden bg-brand-gradient">
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
              Fresh content added regularly — latest update {latest}
            </div>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Pass your <span className="text-gold">KASNEB</span> &amp; <span className="text-gold">KNEC</span> papers on the first sitting.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
              Complete notes, revision kits and past-paper model answers for
              <b> CPA, ATD, CS, CIFA, CCP</b> and <b>CICT</b> — written by qualified Kenyan tutors.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/courses">
                <Button size="lg" className="bg-gold text-gold-foreground hover:brightness-105">
                  Browse all courses <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20">
                  See bundles &amp; save
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6 text-primary-foreground">
              <Stat number={stats.totalPapers.toLocaleString()} label="products in shop" />
              <Stat number={stats.totalCourses.toString()} label="KASNEB courses" />
              <Stat number={latest} label="last updated" />
            </div>
          </div>

          <div className="relative hidden md:block" />
        </div>

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
                        {countByCourse(papers, c.slug)} papers
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

      {featured.length > 0 && (
        <section className="bg-surface/60 py-14">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand">
                  <Flame className="mr-1 inline h-3 w-3 -translate-y-0.5" />
                  Fresh from the shop
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
      )}

      {bundles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-12">
            <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div className="text-primary-foreground">
                <div className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold-foreground">
                  Save up to 50%
                </div>
                <h2 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">
                  Whole-level and full-course bundles
                </h2>
                <p className="mt-3 max-w-xl text-white/85">
                  Every paper for a level — or the entire course journey — at a fraction of the individual price.
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
      )}

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
              { n: "02", t: "Pay with M-Pesa", d: "Enter your Safaricom number, approve the STK push." },
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

      <section className="bg-brand-dark py-14 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-gold">Why {SITE.name}</div>
              <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Built by Kenyans, for Kenyan students.
              </h2>
              <p className="mt-4 text-white/80">
                Every product is written by qualified tutors, previewed openly and priced fairly for students.
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

      <CategoryStrip />

      <TestimonialsSection />

      <LatestBlogStrip />

      <SiteFooter />
    </div>
  );
}

function CategoryStrip() {
  const fetchCats = useServerFn(listCategories);
  const q = useQuery({ queryKey: ["categories"], queryFn: () => fetchCats(), staleTime: 60_000 });
  const cats = q.data ?? [];
  if (cats.length === 0) return null;
  return (
    <section className="border-y border-border/60 bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Shop by category</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Find exactly what you need</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.id} to="/courses" className="group">
              <Card className="flex h-full flex-col p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <span className="text-4xl">{c.icon}</span>
                <h3 className="mt-3 font-display text-lg font-bold group-hover:text-brand">{c.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-4 text-xs font-semibold text-brand">Browse →</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LatestBlogStrip() {
  const fetchPosts = useServerFn(listBlogPosts);
  const q = useQuery({ queryKey: ["blog", "list"], queryFn: () => fetchPosts(), staleTime: 60_000 });
  const posts = (q.data ?? []).slice(0, 3);
  if (posts.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">From the blog</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Study tips & KASNEB updates</h2>
          </div>
          <Link to="/blog" className="text-sm font-semibold text-brand hover:underline">All articles →</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
              <Card className="flex h-full flex-col overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-gradient">
                  {p.cover_image_url ? (
                    <img src={p.cover_image_url} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-primary-foreground/70">
                      <span className="font-display text-3xl font-black">{SITE.name.split(" ")[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="text-[11px] text-muted-foreground">
                    {p.reading_minutes} min · {new Date(p.published_at ?? p.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-[10px] uppercase">{t}</Badge>)}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
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
