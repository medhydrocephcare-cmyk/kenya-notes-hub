import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const PaperInput = z.object({
  course: z.string().min(1),
  level: z.string().min(1),
  title: z.string().min(3),
  description: z.string().optional().default(""),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  fileUrl: z.string().url().optional().or(z.literal("")).default(""),
  previewUrl: z.string().url().optional().or(z.literal("")).default(""),
  examSitting: z.string().optional().default(""),
  lastUpdated: z.string().optional().default(new Date().toISOString().slice(0, 10)),
});

export const Route = createFileRoute("/api/admin/papers")({
  server: {
    handlers: {
      // NOTE: in-memory / dev-only handler.
      // When Lovable Cloud is enabled this will insert into the `papers` table
      // and require an admin-role check via requireSupabaseAuth middleware.
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = PaperInput.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
        }
        const paper = {
          id: `${parsed.data.course}-${parsed.data.level}-${Date.now().toString(36)}`,
          ...parsed.data,
        };
        console.log("[admin/papers] created (in-memory)", paper);
        return Response.json({ ok: true, paper }, { status: 201 });
      },
      GET: async () =>
        Response.json({
          usage: "POST JSON: { course, level, title, description, price, fileUrl, previewUrl, examSitting, lastUpdated }",
        }),
    },
  },
});
