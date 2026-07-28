import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialsSection } from "@/components/testimonials-section";
import { getBlogPost } from "@/lib/blog.functions";
import { SITE, SITE_URL } from "@/lib/site-config";
import { Clock, ArrowLeft, User as UserIcon } from "lucide-react";
import { marked } from "marked";
import { useMemo } from "react";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog", "post", slug],
    queryFn: () => getBlogPost({ data: { slug } }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, params }) => {
    const p = loaderData;
    const title = p ? `${p.title} — ${SITE.name} Blog` : `Blog — ${SITE.name}`;
    const description = p?.excerpt ?? "Read the latest KASNEB study tips and updates.";
    const url = `${SITE_URL}/blog/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(p?.cover_image_url ? [
          { property: "og:image", content: p.cover_image_url },
          { name: "twitter:image", content: p.cover_image_url },
        ] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">The post you are looking for does not exist or was unpublished.</p>
        <Link to="/blog" className="mt-6 inline-block text-brand hover:underline">← Back to blog</Link>
      </div>
      <SiteFooter />
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  const html = useMemo(
    () => marked.parse(post.content_md, { async: false, breaks: true, gfm: true }) as string,
    [post.content_md],
  );

  const publishedIso = post.published_at ?? post.created_at;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ?? undefined,
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-brand hover:underline">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.reading_minutes} min read</span>
          <span>·</span>
          <span>{new Date(publishedIso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><UserIcon className="h-3 w-3" /> {post.author}</span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{post.excerpt}</p>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px] uppercase">{t}</Badge>)}
          </div>
        )}

        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-lg"
          />
        )}

        <div
          className="prose prose-neutral mt-10 max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-brand prose-strong:text-foreground prose-blockquote:border-l-brand prose-blockquote:bg-brand/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md prose-blockquote:not-italic dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <Card className="mt-12 bg-brand-gradient p-6 text-primary-foreground sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Ready to pass?</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            Grab the exact notes and past papers used by top-scoring candidates.
          </h2>
          <Link
            to="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-gold-foreground shadow hover:brightness-110"
          >
            Browse the catalog →
          </Link>
        </Card>
      </article>

      <TestimonialsSection variant="blog" title="What our students say" subtitle="Real reviews from KASNEB candidates across Kenya." />

      <SiteFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
    </div>
  );
}
