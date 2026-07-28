import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { serverPublishableClient } from "./papers.server";

export type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  author: string;
  tags: string[];
  readingMinutes: number;
  publishedAt: string | null;
};

export type BlogPost = BlogPostListItem & { contentMd: string };

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPostListItem[]> => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, author, tags, reading_minutes, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id, slug: r.slug, title: r.title, excerpt: r.excerpt,
    coverImageUrl: r.cover_image_url, author: r.author, tags: r.tags ?? [],
    readingMinutes: r.reading_minutes, publishedAt: r.published_at,
  }));
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const supabase = serverPublishableClient();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, author, tags, reading_minutes, published_at, content_md, published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row || !row.published) return null;
    return {
      id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt,
      coverImageUrl: row.cover_image_url, author: row.author, tags: row.tags ?? [],
      readingMinutes: row.reading_minutes, publishedAt: row.published_at,
      contentMd: row.content_md ?? "",
    };
  });
