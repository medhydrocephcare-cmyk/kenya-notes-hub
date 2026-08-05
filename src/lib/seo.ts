/**
 * Shared SEO helpers: keyword sets and default social-preview image.
 *
 * Keep keyword lists focused on what Kenyan KASNEB/KNEC students actually
 * search for — course codes, sitting months, "past papers with answers",
 * "revision kit", "notes pdf", "download".
 */
import { SITE_URL } from "./site-config";

export const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

export const BASE_KEYWORDS = [
  // Core head terms
  "kasneb past papers",
  "kasneb past papers with answers",
  "kasneb notes",
  "kasneb revision kits",
  "kasneb past papers pdf",
  "kasneb past papers free download",
  "kasneb materials",
  "kasneb study notes pdf",
  "kasneb revision materials",
  "kasneb answers pdf",
  "knec past papers",
  "knec notes",
  "knec past papers with answers",
  "knec exam papers pdf",
  // Course-level terms
  "cpa past papers",
  "cpa past papers with answers pdf",
  "cpa notes kenya",
  "cpa revision kit",
  "cpa foundation past papers",
  "cpa intermediate past papers",
  "cpa advanced past papers",
  "atd past papers",
  "atd notes",
  "atd level 1 past papers",
  "atd level 2 past papers",
  "atd level 3 past papers",
  "cs past papers",
  "cs notes kenya",
  "certified secretaries past papers",
  "cifa past papers",
  "cifa notes",
  "ccp past papers",
  "ccp notes",
  "cict past papers",
  "cict notes",
  "dcm past papers",
  "dict past papers",
  "fab past papers",
  // Sitting / recency terms
  "kasneb past papers 2026",
  "kasneb april 2026 past papers",
  "kasneb august 2026 past papers",
  "kasneb december past papers",
  "kasneb november 2025 past papers",
  "latest kasneb past papers",
  "kasneb new syllabus notes",
  "kasneb revised syllabus past papers",
  // Subject terms
  "financial accounting past papers",
  "financial management past papers",
  "management accounting past papers",
  "advanced taxation past papers",
  "public finance and taxation past papers",
  "auditing and assurance past papers",
  "quantitative analysis past papers",
  "company law past papers",
  "economics past papers kasneb",
  "business law past papers kenya",
  "corporate governance past papers",
  "information communication technology past papers",
  "entrepreneurship and communication past papers",
  "principles of management past papers",
  "credit management past papers",
  // Intent / action terms
  "kasneb study materials kenya",
  "kasneb exam preparation",
  "past papers with model answers kenya",
  "download kasneb papers mpesa",
  "buy kasneb notes online kenya",
  "kasneb marking scheme pdf",
  "kasneb model answers",
  "kasneb revision questions and answers",
  "kasneb mock exams",
  "kasneb exam questions and answers pdf",
  "how to pass kasneb exams",
  "kasneb notes free pdf download",
  "kasneb past papers nairobi",
  "kasneb online notes kenya",
  "kasnebpapers",
  "kasneb papers kenya",
];

/** Keyword sets per course code, appended automatically for course pages. */
export const COURSE_KEYWORDS: Record<string, string[]> = {
  cpa: ["cpa past papers with answers", "cpa notes pdf kenya", "cpa revision kit download", "kasneb cpa materials"],
  atd: ["atd past papers with answers", "atd notes pdf", "accounting technicians diploma past papers"],
  cs: ["cs past papers with answers", "certified secretaries notes", "cs kasneb revision kit"],
  cifa: ["cifa past papers with answers", "cifa notes pdf", "certified investment financial analysts past papers"],
  ccp: ["ccp past papers with answers", "certified credit professionals notes"],
  cict: ["cict past papers with answers", "certified information communication technologists notes"],
  dcm: ["dcm past papers", "diploma in credit management notes"],
  dict: ["dict past papers", "diploma in ict notes kenya"],
  fab: ["fab past papers", "foundation in accountancy and business notes"],
};

/** Keywords for a course (and optional level), merged with the base bank. */
export function courseKeywords(courseSlug: string, levelName?: string): string {
  const code = courseSlug.toLowerCase();
  const extra = COURSE_KEYWORDS[code] ?? [];
  const level = levelName
    ? [`${code} ${levelName.toLowerCase()} past papers`, `${code} ${levelName.toLowerCase()} notes pdf`]
    : [];
  return keywords(...level, ...extra);
}


/** Build a comma-joined keywords string, base terms first then page-specific. */
export function keywords(...extra: string[]): string {
  return [...extra, ...BASE_KEYWORDS].join(", ");
}

/** Trim to a max length on a word boundary, without a trailing ellipsis for titles. */
function clamp(value: string, max: number, ellipsis: boolean) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const budget = ellipsis ? max - 1 : max;
  const cut = text.slice(0, budget);
  const trimmed = cut.slice(0, Math.max(cut.lastIndexOf(" "), Math.floor(budget * 0.6))).replace(/[\s,;:\-–—]+$/, "");
  return ellipsis ? `${trimmed}…` : trimmed;
}

/** Keep <title> within Google's ~60 character display limit. */
export function clampTitle(value: string, max = 60): string {
  return clamp(value, max, false);
}

/** Keep meta descriptions between ~70 and ~155 characters. */
export function clampDescription(value: string, max = 155): string {
  return clamp(value, max, true);
}


/** Standard social-preview meta entries for a page (absolute image URL). */
export function socialImageMeta(image: string = OG_IMAGE) {
  return [
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: "KASNEB past papers, notes and revision kits with answers" },
    { name: "twitter:image", content: image },
  ];
}
