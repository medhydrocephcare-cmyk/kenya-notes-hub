import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { SITE_URL } from "@/lib/site-config";
import { paperSlugFromFields } from "@/lib/paper-slugs";
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

export const Route = createFileRoute("/sitemap-papers.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; lastmod?: string; changefreq?: string; priority?: string }[] = [];
        try {
          const { data } = await publicClient()
            .from("papers")
            .select("course, level, title, full_pdf_key, preview_pdf_key, updated_at")
            .eq("published", true)
            .order("updated_at", { ascending: false })
            .limit(50000);
          for (const paper of data ?? []) {
            entries.push({
              path: `/papers/${paperSlugFromFields({
                course: paper.course,
                level: paper.level,
                title: paper.title,
                fullPdfKey: paper.full_pdf_key,
                previewPdfKey: paper.preview_pdf_key,
              })}`,
              lastmod: paper.updated_at?.slice(0, 10),
              changefreq: "weekly",
              priority: "0.6",
            });
          }
        } catch {
          // Empty sitemap is preferable to failing the sitemap index.
        }
        const uniqueEntries = Array.from(new Map(entries.map((entry) => [entry.path, entry])).values());
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...uniqueEntries.map((entry) => [
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