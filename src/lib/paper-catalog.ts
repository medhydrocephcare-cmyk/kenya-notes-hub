import type { Paper } from "./data";
import { paperSlugFromFields, paperUrlParam } from "./paper-slugs";
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

const UUID_TAIL_RE = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export function findPaper(all: Paper[], id: string): Paper | undefined {
  const direct = all.find((paper) => paper.id === id || paper.slug === id || paperUrlParam(paper) === id);
  if (direct) return direct;
  // Legacy indexed URLs like /papers/cpa-advanced-1-<uuid> — resolve by the trailing id
  // so old crawled links redirect to the canonical slug instead of 404ing.
  const tail = UUID_TAIL_RE.exec(id)?.[1];
  return tail ? all.find((paper) => paper.id.toLowerCase() === tail.toLowerCase()) : undefined;
}

export function sittingLabel(paper: Paper): string {
  return paper.examSitting?.trim() ? paper.examSitting : "Updated to latest available sitting";
}