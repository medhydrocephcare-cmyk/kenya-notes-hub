import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site-config";
import { sitemapCacheHeader } from "@/lib/cache-control";

const entries = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/how-it-works", changefreq: "monthly", priority: "0.7" },
  { path: "/pricing", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/refunds", changefreq: "yearly", priority: "0.3" },
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