import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { getBlogPost } from "@/lib/blog.functions";
import { renderMarkdown } from "@/lib/markdown";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";


export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return {
      post,
      html: renderMarkdown(post.contentMd),
      canonical: `${SITE_URL}/blog/${post.slug}`,
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — ${SITE.name}` },
          { name: "description", content: loaderData.post.excerpt.slice(0, 160) },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt.slice(0, 200) },
          { property: "og:type", content: "article" },
          { property: "og:url", content: loaderData.canonical },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "keywords", content: keywords(loaderData.post.title.toLowerCase(), "kasneb study guide") },
          ...(loaderData.post.coverImageUrl?.startsWith("https://")
            ? socialImageMeta(loaderData.post.coverImageUrl)
            : socialImageMeta()),
        ]

      : [{ title: "Article not found" }, { name: "robots", content: "noindex" }],
    links: loaderData ? [{ rel: "canonical", href: loaderData.canonical }] : undefined,
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: loaderData.post.title,
              description: loaderData.post.excerpt,
              author: { "@type": "Person", name: loaderData.post.author },
              datePublished: loaderData.post.publishedAt ?? undefined,
              image: loaderData.post.coverImageUrl ?? undefined,
              publisher: { "@type": "Organization", name: SITE.name },
              url: loaderData.canonical,
            }),
          },
        ]
      : undefined,
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-extrabold">Article not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This post may have been unpublished.</p>
        <Link to="/blog" className="mt-6 inline-flex">
          <Button variant="outline">← Back to blog</Button>
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-sm text-muted-foreground">
      Failed to load article: {error.message}
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, html } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to blog
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags?.slice(0, 3).map((t: string) => (
            <Badge key={t} variant="outline" className="border-brand/30 text-brand">{t}</Badge>
          ))}
        </div>

        <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{post.author}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingMinutes} min read</span>
          {post.publishedAt && (<><span>·</span><span>{new Date(post.publishedAt).toLocaleDateString()}</span></>)}
        </div>

        <img
          src={post.coverImageUrl || `https://source.unsplash.com/1600x900/?${encodeURIComponent(post.tags?.[0] ?? "study,books")},kenya`}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://source.unsplash.com/1600x900/?study,books,kenya,${encodeURIComponent(post.slug)}`; }}
          alt={post.title}
          className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
        />

        <div
          className="blog-content mt-8 text-[15px] leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      <SiteFooter />
    </div>
  );
}
