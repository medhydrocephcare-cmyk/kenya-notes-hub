import { SITE_URL } from "@/lib/site-config";
import { sitemapCacheHeader } from "@/lib/cache-control";
import { createFileRoute } from "@tanstack/react-router";

const sitemapFiles = ["pages", "courses", "papers", "blog"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...sitemapFiles.map((name) =>
            [
              `  <sitemap>`,
              `    <loc>${SITE_URL}/sitemap-${name}.xml</loc>`,
              `  </sitemap>`,
            ].filter(Boolean).join("\n"),
          ),
          `</sitemapindex>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": sitemapCacheHeader() },
        });
      },
    },
  },
});
