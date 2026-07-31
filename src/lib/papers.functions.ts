/**
 * Public catalog server functions + client-side query options.
 *
 * All reads use the publishable (anon) Supabase client and rely on the
 * `papers public read published` RLS policy, so anyone can fetch published
 * papers without an auth session. Any row inserted by Claude Code / admin
 * that has `published = true` shows up automatically — no code changes.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { rowToPaper } from "./paper-catalog";
import { serverPublishableClient } from "./papers.server";

type PaperRow = Database["public"]["Tables"]["papers"]["Row"];

/** Public: list every published paper (memoized per server instance for speed). */
export const listPapers = createServerFn({ method: "GET" }).handler(async () => {
  const { cached } = await import("./server-cache");
  return cached("papers:all", 120_000, async () => {
    const supabase = serverPublishableClient();
    const { data, error } = await supabase
      .from("papers")
      .select("id, course, level, title, description, price_kes, discount_price_kes, sitting, updated_at, created_at, category, pages, file_size_bytes, thumbnail_url, syllabus_version, tags, download_count, preview_pdf_key, full_pdf_key, featured, year, published")
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => rowToPaper(row as PaperRow));
  });
});


/** Public: heavy indexed PDF text only for the opened paper page. */
export const getPaperIndexContent = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ paperId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublishableClient();
    const { data: paper, error } = await supabase
      .from("papers")
      .select("preview_text")
      .eq("id", data.paperId)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return paper?.preview_text ?? "";
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

/** Public: aggregate rating + a handful of reviews, for the paper detail page's Product structured data. */
export const getPaperReviewsSummary = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ paperId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublishableClient();
    const { data: rows, error } = await supabase
      .from("paper_reviews")
      .select("author_name, rating, comment, created_at")
      .eq("paper_id", data.paperId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    const reviews = rows ?? [];
    if (reviews.length === 0) return null;
    const ratingCount = reviews.length;
    const ratingValue = reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount;
    return {
      ratingValue: Math.round(ratingValue * 10) / 10,
      ratingCount,
      reviews: reviews.slice(0, 5).map((r) => ({
        author: r.author_name,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at,
      })),
    };
  });

/** Public: presigned URL for a paper's free preview PDF — no payment required. */
export const getPreviewUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ paperId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublishableClient();
    const { data: paper, error } = await supabase
      .from("papers")
      .select("preview_pdf_key, published")
      .eq("id", data.paperId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!paper || !paper.published) throw new Error("Paper not found");
    if (!paper.preview_pdf_key) throw new Error("No preview available for this paper");

    const { presignGet } = await import("./r2.server");
    const url = await presignGet(paper.preview_pdf_key, 60 * 30);
    return { url, expiresIn: 1800 };
  });

