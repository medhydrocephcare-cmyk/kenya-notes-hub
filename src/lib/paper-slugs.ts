import type { Paper } from "./data";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function slugifySegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function fileSlugFromKey(key?: string | null) {
  if (!key) return "";
  const filename = key.split("?")[0].split("/").pop() ?? "";
  return slugifySegment(filename.replace(/\.[a-z0-9]+$/i, "").replace(/-(preview|thumbnail)$/i, ""));
}

export function paperSlugFromFields(input: {
  course: string;
  level: string;
  title: string;
  fullPdfKey?: string | null;
  previewPdfKey?: string | null;
}) {
  const fileSlug = fileSlugFromKey(input.fullPdfKey) || fileSlugFromKey(input.previewPdfKey);
  const titleSlug = slugifySegment(input.title.replace(/—/g, " "));
  const base = fileSlug || titleSlug || "paper";
  return [input.course, input.level, base].map(slugifySegment).filter(Boolean).join("-");
}

export function paperUrlParam(paper: Paper) {
  return paper.slug && !UUID_RE.test(paper.slug) ? paper.slug : paper.id;
}

export function paperPath(paper: Paper) {
  return `/papers/${paperUrlParam(paper)}`;
}