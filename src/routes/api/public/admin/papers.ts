import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

const PaperInput = z.object({
  course: z.string().min(1),
  level: z.string().min(1),
  title: z.string().min(3),
  category: z.string().min(1).default("notes"),
  sitting: z.string().optional().default(""),
  year: z.number().int().optional(),
  description: z.string().optional().default(""),
  pages: z.number().int().positive().optional(),
  price_kes: z.number().int().positive(),
  discount_price_kes: z.number().int().positive().optional().nullable(),
  preview_pdf_key: z.string().optional().default(""),
  full_pdf_key: z.string().optional().default(""),
  file_size_bytes: z.number().int().positive().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")).default(""),
  syllabus_version: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
});

const PaperUpdate = PaperInput.partial().extend({ id: z.string().uuid() });
const PaperDelete = z.object({ id: z.string().uuid() });

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error("Invalid JSON");
  }
}

function statusFor(message: string) {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  return 400;
}

export const Route = createFileRoute("/api/public/admin/papers")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      GET: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-papers-list", limit: 90, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest, listAdminPapersForApi } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          return jsonResponse(request, await listAdminPapersForApi());
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to load papers";
          return errorResponse(request, message, statusFor(message));
        }
      },
      POST: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-papers-write", limit: 30, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          const json = await readJson(request);
          const parsed = PaperInput.safeParse(json);
          if (!parsed.success) return errorResponse(request, "Validation failed", 400);
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.from("papers").insert(parsed.data).select("*").single();
          if (error) throw new Error(error.message);
          return jsonResponse(request, { ok: true, paper: data }, 201);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create paper";
          return errorResponse(request, message, statusFor(message));
        }
      },
      PATCH: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-papers-write", limit: 30, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          const json = await readJson(request);
          const parsed = PaperUpdate.safeParse(json);
          if (!parsed.success) return errorResponse(request, "Validation failed", 400);
          const { id, ...patch } = parsed.data;
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.from("papers").update(patch).eq("id", id).select("*").single();
          if (error) throw new Error(error.message);
          return jsonResponse(request, { ok: true, paper: data });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update paper";
          return errorResponse(request, message, statusFor(message));
        }
      },
      DELETE: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-papers-write", limit: 30, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          const json = await readJson(request);
          const parsed = PaperDelete.safeParse(json);
          if (!parsed.success) return errorResponse(request, "Validation failed", 400);
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("papers").delete().eq("id", parsed.data.id);
          if (error) throw new Error(error.message);
          return jsonResponse(request, { ok: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to delete paper";
          return errorResponse(request, message, statusFor(message));
        }
      },
    },
  },
});