import { createFileRoute } from "@tanstack/react-router";
import { courses, levels } from "@/lib/data";
import { SITE_URL } from "@/lib/site-config";
import { sitemapCacheHeader } from "@/lib/cache-control";

export const Route = createFileRoute("/sitemap-courses.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = courses.flatMap((course) => [
          { path: `/courses/${course.slug}`, changefreq: "daily", priority: "0.8" },
          ...levels
            .filter((level) => level.courseSlug === course.slug)
            .map((level) => ({ path: `/courses/${course.slug}/${level.slug}`, changefreq: "daily", priority: "0.7" })),
        ]);
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