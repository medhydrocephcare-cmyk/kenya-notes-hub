import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site-config";
import { sitemapCacheHeader } from "@/lib/cache-control";

const entries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
];

export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((entry) => [
            `  <url>`,
            `    <loc>${SITE_URL}${entry.path}</loc>`,
            `    <changefreq>${entry.changefreq}</changefreq>`,
            `    <priority>${entry.priority}</priority>`,
            `  </url>`,
          ].join("\n")),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": sitemapCacheHeader() },
        });
      },
    },
  },
});