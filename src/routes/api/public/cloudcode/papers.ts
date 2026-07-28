import { createFileRoute } from "@tanstack/react-router";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
};

export const Route = createFileRoute("/api/public/cloudcode/papers")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async () => {
        try {
          const { listR2ContentObjects, inferPapersFromR2Objects } = await import("@/lib/cloudcode-catalog.server");
          const objects = await listR2ContentObjects();
          const candidates = inferPapersFromR2Objects(objects);
          return Response.json(
            {
              ok: true,
              mode: "inspect",
              objectCount: objects.length,
              detectedPapers: candidates.length,
              usage: "POST this endpoint after CloudCode uploads files to sync R2 PDFs into the live paper catalog. Rows are inferred from content/<course>/<level>/<slug>.pdf.",
              detected: candidates.map((paper) => ({
                course: paper.course,
                level: paper.level,
                title: paper.title,
                full_pdf_key: paper.full_pdf_key,
                preview_pdf_key: paper.preview_pdf_key,
                thumbnail_url: paper.thumbnail_url,
              })),
            },
            { headers: corsHeaders },
          );
        } catch (error) {
          const message = error instanceof Error ? error.message : "CloudCode inspection failed";
          return Response.json({ ok: false, error: message }, { status: 500, headers: corsHeaders });
        }
      },
      POST: async () => {
        try {
          const { syncR2Catalog } = await import("@/lib/cloudcode-catalog.server");
          const result = await syncR2Catalog({ force: true });
          return Response.json(result, { headers: corsHeaders });
        } catch (error) {
          const message = error instanceof Error ? error.message : "CloudCode sync failed";
          return Response.json({ ok: false, error: message }, { status: 500, headers: corsHeaders });
        }
      },
    },
  },
});