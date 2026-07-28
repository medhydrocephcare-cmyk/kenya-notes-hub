import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialsSection } from "@/components/testimonials-section";
import { listBlogPosts, type BlogPost } from "@/lib/blog.functions";
import { SITE, SITE_URL } from "@/lib/site-config";
import { Clock, ArrowRight, PenLine } from "lucide-react";

const blogPostsQuery = queryOptions({
  queryKey: ["blog", "list"],
  queryFn: () => listBlogPosts(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(blogPostsQuery),
  head: () => ({
    meta: [
      { title: `Blog — Study tips & KASNEB updates | ${SITE.name}` },
      { name: "description", content: "KASNEB and KNEC study tips, exam updates, revision blueprints and student success stories from Kasneb Pastpapers." },
      { property: "og:title", content: `Blog — Study tips & KASNEB updates | ${SITE.name}` },
      { property: "og:description", content: "KASNEB & KNEC study tips, sitting updates and revision blueprints." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(blogPostsQuery);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border/60 bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">The Kasneb Pastpapers Journal</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            Study smarter. Pass faster. Stay updated with every KASNEB sitting.
          </h1>
          <p className="mt-4 max-w-2xl text-sm opacity-90 sm:text-base">
            Revision blueprints, syllabus updates, student success stories and practical exam tips — written by tutors and top-performing candidates.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
        {posts.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            <PenLine className="mx-auto h-8 w-8" />
            <p className="mt-3">No posts yet. Check back soon.</p>
          </Card>
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}

            {rest.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => <PostCard key={p.id} post={p} />)}
              </div>
            )}
          </>
        )}
      </div>

      <TestimonialsSection variant="blog" title="What readers are saying" subtitle="Students who used our notes, kits and blog blueprints to pass their sittings." />

      <SiteFooter />
    </div>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
      <Card className="grid overflow-hidden shadow-sm transition hover:shadow-xl md:grid-cols-2">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-gradient md:aspect-auto md:h-full">
          {post.cover_image_url ? (
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center text-primary-foreground/90">
              <PenLine className="h-16 w-16 opacity-60" />
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-gold-foreground">
            Featured
          </span>
        </div>
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {post.reading_minutes} min read
              <span>·</span>
              <span>{new Date(post.published_at ?? post.created_at).toLocaleDateString()}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-foreground group-hover:text-brand sm:text-3xl">
              {post.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{post.excerpt}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-[10px] uppercase">{t}</Badge>)}
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">
              Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
      <Card className="flex h-full flex-col overflow-hidden shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-gradient">
          {post.cover_image_url ? (
            <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover transition group-hover:scale-105" />
          ) : (
            <div className="grid h-full w-full place-items-center text-primary-foreground/80">
              <PenLine className="h-10 w-10 opacity-60" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.reading_minutes} min
            <span>·</span>
            <span>{new Date(post.published_at ?? post.created_at).toLocaleDateString()}</span>
          </div>
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground group-hover:text-brand">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((t) => <Badge key={t} variant="secondary" className="text-[10px] uppercase">{t}</Badge>)}
            </div>
            <span className="text-xs font-semibold text-brand">Read →</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
