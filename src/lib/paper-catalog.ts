import type { Paper } from "./data";
import { paperSlugFromFields } from "./paper-slugs";
import type { Database } from "@/integrations/supabase/types";

type PaperRow = Database["public"]["Tables"]["papers"]["Row"];

export function rowToPaper(row: PaperRow): Paper {
  const price = row.discount_price_kes ?? row.price_kes;
  const originalPrice = row.discount_price_kes ? row.price_kes : undefined;
  const tags = row.tags ?? [];
  const bundleType: Paper["bundleType"] =
    (["single", "level", "course", "sitting"] as const).find((type) => tags.includes(type)) ??
    (row.category === "bundle" ? "level" : undefined);

  return {
    id: row.id,
    slug: paperSlugFromFields({
      course: row.course,
      level: row.level,
      title: row.title,
      fullPdfKey: row.full_pdf_key,
      previewPdfKey: row.preview_pdf_key,
    }),
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
    previewAvailable: Boolean(row.preview_pdf_key),
    downloadAvailable: Boolean(row.full_pdf_key),
    featured: row.featured,
    year: row.year ?? undefined,
    previewText: (row as unknown as { preview_text?: string | null }).preview_text ?? undefined,
  };
}

export function papersByCourse(all: Paper[], courseSlug: string): Paper[] {
  return all.filter((paper) => paper.courseSlug === courseSlug);
}

export function papersByLevel(all: Paper[], courseSlug: string, levelSlug: string): Paper[] {
  return all.filter((paper) => paper.courseSlug === courseSlug && paper.levelSlug === levelSlug);
}

export function countByCourse(all: Paper[], courseSlug: string): number {
  return papersByCourse(all, courseSlug).length;
}

export function findPaper(all: Paper[], id: string): Paper | undefined {
  return all.find((paper) => paper.id === id || paper.slug === id);
}

export function sittingLabel(paper: Paper): string {
  return paper.examSitting?.trim() ? paper.examSitting : "Updated to latest available sitting";
}