import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { listBlogPosts } from "@/lib/blog.functions";
import { SITE, SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Study Tips & KASNEB Guides — ${SITE.name} Blog` },
      { name: "description", content: "Study strategies, KASNEB syllabus updates, revision tips and career guides for accounting, IT and credit students in Kenya." },
      { property: "og:title", content: `${SITE.name} Blog — KASNEB study tips` },
      { property: "og:description", content: "Fresh study guides and past-paper walkthroughs from qualified Kenyan tutors." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const fetchPosts = useServerFn(listBlogPosts);
  const q = useQuery({ queryKey: ["blog", "list"], queryFn: () => fetchPosts(), staleTime: 60_000 });
  const posts = q.data ?? [];
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="border-b border-border/60 bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <Badge className="bg-gold text-gold-foreground">Kasneb Journal</Badge>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Study tips, syllabus updates & revision guides.
          </h1>
          <p className="mt-3 max-w-2xl text-white/85">
            Written by qualified Kenyan tutors — practical advice for CPA, ATD, CS, CIFA, CCP and ICT students.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {q.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading articles…
          </div>
        ) : posts.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-brand/50" />
            <h2 className="mt-3 text-lg font-semibold">Fresh articles coming soon</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              We're preparing in-depth guides for the next sitting. Check back shortly.
            </p>
            <Link to="/courses" className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">
              Browse past papers instead →
            </Link>
          </Card>
        ) : (
          <>
            {featured && (
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="group grid gap-6 overflow-hidden rounded-2xl border border-border/60 bg-surface/40 p-4 transition hover:shadow-lg md:grid-cols-[1.2fr_1fr] md:p-6"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-brand/10 md:aspect-auto md:min-h-[280px]">
                  <img
                    src={featured.coverImageUrl || `https://source.unsplash.com/1200x750/?${encodeURIComponent((featured.tags?.[0] ?? "study,books,kenya"))}`}
                    alt={featured.title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/1200x750/?study,books,kenya,${encodeURIComponent(featured.slug)}`; }}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <Badge variant="outline" className="w-fit border-brand/30 text-brand">Featured</Badge>
                  <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{featured.author}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readingMinutes} min read</span>
                    {featured.publishedAt && <><span>·</span><span>{new Date(featured.publishedAt).toLocaleDateString()}</span></>}
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                    Read article <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )}

            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link
                    key={p.id}
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-background transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-brand/10">
                      <img
                        src={p.coverImageUrl || `https://source.unsplash.com/800x500/?${encodeURIComponent(p.tags?.[0] ?? "study,books")},kenya`}
                        alt={p.title}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/800x500/?study,books,kenya,${encodeURIComponent(p.slug)}`; }}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {p.tags?.[0] && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand">{p.tags[0]}</span>
                      )}
                      <h3 className="mt-2 line-clamp-2 font-display text-lg font-extrabold leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{p.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{p.author}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readingMinutes} min</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <TestimonialsSection compact />
      <SiteFooter />
    </div>
  );
}
