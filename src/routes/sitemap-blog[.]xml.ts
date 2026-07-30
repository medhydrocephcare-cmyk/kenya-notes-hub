import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SITE_URL } from "@/lib/site-config";
import { sitemapCacheHeader } from "@/lib/cache-control";

function publicClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Backend catalog environment is not configured");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const Route = createFileRoute("/sitemap-blog.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; lastmod?: string; changefreq?: string; priority?: string }[] = [
          { path: "/blog", changefreq: "daily", priority: "0.8" },
        ];
        try {
          const { data } = await publicClient()
            .from("blog_posts")
            .select("slug, published_at, updated_at")
            .eq("published", true)
            .order("published_at", { ascending: false, nullsFirst: false })
            .limit(1000);
          for (const post of data ?? []) {
            entries.push({
              path: `/blog/${post.slug}`,
              lastmod: (post.updated_at ?? post.published_at ?? "").slice(0, 10) || undefined,
              changefreq: "monthly",
              priority: "0.7",
            });
          }
        } catch {
          // Keep the blog index discoverable even if dynamic rows are temporarily unavailable.
        }
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((entry) => [
            `  <url>`,
            `    <loc>${SITE_URL}${entry.path}</loc>`,
            entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
            entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
            entry.priority ? `    <priority>${entry.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n")),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": sitemapCacheHeader() },
        });
      },
    },
  },
});