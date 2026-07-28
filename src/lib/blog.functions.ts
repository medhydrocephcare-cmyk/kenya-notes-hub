import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { serverPublishableClient } from "./papers.server";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  content_md: string;
  author: string;
  tags: string[];
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
};

export const listBlogPosts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, cover_image_url, content_md, author, tags, reading_minutes, published_at, created_at")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as BlogPost[];
});

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublishableClient();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, cover_image_url, content_md, author, tags, reading_minutes, published_at, created_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as BlogPost | null;
  });
