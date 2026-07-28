import { createFileRoute } from "@tanstack/react-router";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

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
  discount_price_kes: z.number().int().positive().optional(),
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

/** Authenticated Supabase client bound to the caller's own bearer token, so
 * writes go through the `papers admin insert/update/delete` RLS policies —
 * only a user with the `admin` role can actually write, enforced by Postgres. */
async function requireAdminClient() {
  const request = getRequest();
  const authHeader = request?.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: Response.json({ error: "Unauthorized: missing Bearer token" }, { status: 401 }) };
  }
  const token = authHeader.replace("Bearer ", "");

  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return { error: Response.json({ error: "Server misconfigured: Supabase env vars missing" }, { status: 500 }) };
  }
  const supabase = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}`, apikey: key } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    return { error: Response.json({ error: "Unauthorized: invalid token" }, { status: 401 }) };
  }
  return { supabase };
}

export const Route = createFileRoute("/api/admin/papers")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await requireAdminClient();
        if ("error" in auth) return auth.error;

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

        const { data, error } = await auth.supabase
          .from("papers")
          .insert(parsed.data)
          .select("*")
          .single();

        if (error) {
          // RLS denial surfaces as a Postgres error here (e.g. caller lacks the admin role)
          return Response.json({ error: error.message, code: error.code }, { status: error.code === "42501" ? 403 : 400 });
        }
        return Response.json({ ok: true, paper: data }, { status: 201 });
      },

      PATCH: async ({ request }) => {
        const auth = await requireAdminClient();
        if ("error" in auth) return auth.error;

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = PaperUpdate.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
        }
        const { id, ...patch } = parsed.data;

        const { data, error } = await auth.supabase
          .from("papers")
          .update(patch)
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          return Response.json({ error: error.message, code: error.code }, { status: error.code === "42501" ? 403 : 400 });
        }
        return Response.json({ ok: true, paper: data });
      },

      DELETE: async ({ request }) => {
        const auth = await requireAdminClient();
        if ("error" in auth) return auth.error;

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = PaperDelete.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Validation failed", issues: parsed.error.issues }, { status: 400 });
        }

        const { error } = await auth.supabase.from("papers").delete().eq("id", parsed.data.id);
        if (error) {
          return Response.json({ error: error.message, code: error.code }, { status: error.code === "42501" ? 403 : 400 });
        }
        return Response.json({ ok: true });
      },

      GET: async () =>
        Response.json({
          usage:
            "POST/PATCH/DELETE require an Authorization: Bearer <supabase access token> for a user with the admin role (enforced by RLS). " +
            "POST body: { course, level, title, category?, sitting?, year?, description?, pages?, price_kes, discount_price_kes?, preview_pdf_key?, full_pdf_key?, file_size_bytes?, thumbnail_url?, syllabus_version?, tags?, featured?, published? }. " +
            "PATCH body: same fields, all optional, plus required id. DELETE body: { id }.",
        }),
    },
  },
});
