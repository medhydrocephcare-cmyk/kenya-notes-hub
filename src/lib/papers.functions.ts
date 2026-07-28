/**
 * Public catalog server functions + client-side query options.
 *
 * All reads use the publishable (anon) Supabase client and rely on the
 * `papers public read published` RLS policy, so anyone can fetch published
 * papers without an auth session. Any row inserted by Claude Code / admin
 * that has `published = true` shows up automatically — no code changes.
 */
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Paper } from "./data";

type PaperRow = Database["public"]["Tables"]["papers"]["Row"];

function serverPublishableClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // Opaque sb_ keys aren't JWTs; strip Authorization bearer, use apikey.
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/** Map a raw DB row into the front-end `Paper` shape. */
export function rowToPaper(row: PaperRow): Paper {
  const price = row.discount_price_kes ?? row.price_kes;
  const originalPrice = row.discount_price_kes ? row.price_kes : undefined;
  const tags = row.tags ?? [];
  const bundleType: Paper["bundleType"] =
    (["single", "level", "course", "sitting"] as const).find((t) => tags.includes(t)) ??
    (row.category === "bundle" ? "level" : undefined);

  return {
    id: row.id,
    courseSlug: row.course,
    levelSlug: row.level,
    title: row.title,
    description: row.description ?? "",
    price,
    originalPrice,
    examSitting: row.sitting ?? "",
    lastUpdated: (row.updated_at ?? row.created_at).slice(0, 10),
    bundleType,
    category: row.category,
    pages: row.pages ?? undefined,
    fileSize: row.file_size_bytes ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    syllabusVersion: row.syllabus_version ?? undefined,
    tags,
    downloadCount: row.download_count ?? 0,
    previewAvailable: !!row.preview_pdf_key,
    featured: row.featured,
    year: row.year ?? undefined,
  };
}

/** Public: list every published paper. */
export const listPapers = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("papers")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToPaper);
});

/** Public: catalog-wide stats calculated from real DB rows. */
export const getCatalogStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("papers")
    .select("course, updated_at")
    .eq("published", true);
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const courses = new Set(rows.map((r) => r.course));
  const latest = rows.reduce<string | null>(
    (acc, r) => (!acc || r.updated_at > acc ? r.updated_at : acc),
    null,
  );
  return {
    totalPapers: rows.length,
    totalCourses: courses.size,
    latestUpdate: latest,
  };
});

// ----- Client-side query options -----

export const allPapersQueryOptions = queryOptions({
  queryKey: ["papers", "all"],
  queryFn: () => listPapers(),
  staleTime: 60_000,
});

export const catalogStatsQueryOptions = queryOptions({
  queryKey: ["papers", "stats"],
  queryFn: () => getCatalogStats(),
  staleTime: 60_000,
});

// ----- Small helpers used by pages -----

export function papersByCourse(all: Paper[], courseSlug: string): Paper[] {
  return all.filter((p) => p.courseSlug === courseSlug);
}
export function papersByLevel(all: Paper[], courseSlug: string, levelSlug: string): Paper[] {
  return all.filter((p) => p.courseSlug === courseSlug && p.levelSlug === levelSlug);
}
export function countByCourse(all: Paper[], courseSlug: string): number {
  return papersByCourse(all, courseSlug).length;
}
export function findPaper(all: Paper[], id: string): Paper | undefined {
  return all.find((p) => p.id === id);
}

/**
 * Sitting label per product spec:
 * - if the paper has a specific sitting, show it;
 * - otherwise, show a generic "latest available sitting" hint.
 */
export function sittingLabel(paper: Paper): string {
  return paper.examSitting?.trim() ? paper.examSitting : "Updated to latest available sitting";
}

// Reserved for future use (Zod-validated search endpoint).
export const _searchInput = z.object({ q: z.string().min(1).max(80) });
