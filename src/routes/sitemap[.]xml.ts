import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { courses, levels } from "@/lib/data";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: { path: string; changefreq?: string; priority?: string }[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/courses", changefreq: "weekly", priority: "0.9" },
        ];
        try {
          const { syncR2Catalog } = await import("@/lib/cloudcode-catalog.server");
          await syncR2Catalog();
        } catch {
          // Keep sitemap available even if the file catalog sync is temporarily unavailable.
        }
        for (const c of courses) {
          entries.push({ path: `/courses/${c.slug}`, changefreq: "weekly", priority: "0.8" });
          for (const l of levels.filter((x) => x.courseSlug === c.slug)) {
            entries.push({ path: `/courses/${c.slug}/${l.slug}`, changefreq: "weekly", priority: "0.7" });
          }
        }
        try {
          const url = process.env.SUPABASE_URL!;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const supabase = createClient<Database>(url, key, {
            auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
            global: {
              fetch: (input, init) => {
                const h = new Headers(init?.headers);
                if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
                h.set("apikey", key);
                return fetch(input, { ...init, headers: h });
              },
            },
          });
          const { data } = await supabase.from("papers").select("id").eq("published", true);
          for (const p of data ?? []) {
            entries.push({ path: `/papers/${p.id}`, changefreq: "monthly", priority: "0.6" });
          }
        } catch {
          // If DB is unreachable, still emit the static portion of the sitemap.
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${SITE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n"),
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
