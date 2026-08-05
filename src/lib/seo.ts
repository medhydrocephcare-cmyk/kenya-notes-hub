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
  "kasneb past papers",
  "kasneb past papers with answers",
  "kasneb notes",
  "kasneb revision kits",
  "kasneb past papers pdf",
  "kasneb past papers free download",
  "knec past papers",
  "knec notes",
  "cpa past papers",
  "cpa past papers with answers pdf",
  "cpa notes kenya",
  "cpa revision kit",
  "atd past papers",
  "atd notes",
  "cs past papers",
  "cifa past papers",
  "ccp past papers",
  "cict past papers",
  "dcm past papers",
  "dict past papers",
  "kasneb past papers 2026",
  "kasneb april 2026 past papers",
  "kasneb december past papers",
  "financial accounting past papers",
  "financial management past papers",
  "advanced taxation past papers",
  "auditing and assurance past papers",
  "quantitative analysis past papers",
  "kasneb study materials kenya",
  "kasneb exam preparation",
  "past papers with model answers kenya",
  "download kasneb papers mpesa",
];

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
