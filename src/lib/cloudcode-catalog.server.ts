import { AwsClient } from "aws4fetch";
import { courses, getCourse, getLevel } from "./data";

type R2Object = {
  key: string;
  size: number;
  lastModified: string;
};

type CandidatePaper = {
  course: string;
  level: string;
  title: string;
  category: string;
  sitting: string;
  year: number;
  description: string;
  pages?: number;
  price_kes: number;
  discount_price_kes?: number;
  preview_pdf_key: string;
  full_pdf_key: string;
  file_size_bytes: number;
  thumbnail_url: string;
  syllabus_version: string;
  tags: string[];
  featured: boolean;
  published: boolean;
};

const PRICE_KES = 150;
const CONTENT_PREFIX = "content/";

const TITLE_OVERRIDES: Record<string, string> = {
  "advanced-taxation-business-income": "Advanced Taxation — Business Income",
  "business-environment": "Business Environment",
  "business-law": "Business Law",
  "business-mathematics-and-statistics": "Business Mathematics and Statistics",
  "company-law": "Company Law",
  "corporate-governance-and-ethics": "Corporate Governance and Ethics",
  "communication-skills": "Communication Skills",
  "credit-management": "Credit Management",
  economics: "Economics",
  "entrepreneurship-and-communication": "Entrepreneurship and Communication",
  "financial-accounting": "Financial Accounting",
  "financial-management": "Financial Management",
  "foundation-accountancy-business": "Foundation Accountancy & Business",
  "fundamentals-of-credit-management": "Fundamentals of Credit Management",
  "fundamentals-of-finance": "Fundamentals of Finance",
  "fundamentals-of-management-accounting": "Fundamentals of Management Accounting",
  "information-communication-technology": "Information Communication Technology",
  "introduction-to-accounting": "Introduction to Accounting",
  "introduction-to-computing": "Introduction to Computing",
  "introduction-to-law-and-ethics": "Introduction to Law and Ethics",
  "introduction-to-law-and-governance": "Introduction to Law and Governance",
  "law-governing-credit-practice": "Law Governing Credit Practice",
  "management-accounting": "Management Accounting",
  "portfolio-management": "Portfolio Management",
  "principles-of-auditing": "Principles of Auditing",
  "principles-of-economics": "Principles of Economics",
  "principles-of-management": "Principles of Management",
  "principles-of-taxation": "Principles of Taxation",
  "quantitative-analysis": "Quantitative Analysis",
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function endpoint() {
  return `https://${requiredEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com/${requiredEnv("R2_BUCKET")}`;
}

function decodeXml(text: string) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function titleFromSlug(slug: string) {
  const base = TITLE_OVERRIDES[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  return `${base} — Notes + Revision Kit`;
}

function publicUrl(key: string) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  return base ? `${base.replace(/\/$/, "")}/${encodeURI(key)}` : "";
}

function parseObjects(xml: string): R2Object[] {
  const objects: R2Object[] = [];
  for (const match of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
    const chunk = match[1] ?? "";
    const key = decodeXml(chunk.match(/<Key>([\s\S]*?)<\/Key>/)?.[1] ?? "");
    const size = Number(chunk.match(/<Size>(\d+)<\/Size>/)?.[1] ?? 0);
    const lastModified = chunk.match(/<LastModified>([\s\S]*?)<\/LastModified>/)?.[1] ?? "";
    if (key) objects.push({ key, size, lastModified });
  }
  return objects;
}

export async function listR2ContentObjects(prefix = CONTENT_PREFIX): Promise<R2Object[]> {
  const client = new AwsClient({
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });

  const all: R2Object[] = [];
  let continuationToken = "";
  for (let page = 0; page < 20; page += 1) {
    const url = new URL(endpoint());
    url.searchParams.set("list-type", "2");
    url.searchParams.set("max-keys", "1000");
    url.searchParams.set("prefix", prefix);
    if (continuationToken) url.searchParams.set("continuation-token", continuationToken);

    const response = await client.fetch(url.toString(), { method: "GET" });
    const xml = await response.text();
    if (!response.ok) throw new Error(`R2 list failed with ${response.status}: ${xml.slice(0, 180)}`);
    all.push(...parseObjects(xml));
    if (!xml.includes("<IsTruncated>true</IsTruncated>")) break;
    continuationToken = decodeXml(xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1] ?? "");
    if (!continuationToken) break;
  }
  return all;
}

export function inferPapersFromR2Objects(objects: R2Object[]): CandidatePaper[] {
  const byKey = new Map(objects.map((object) => [object.key, object]));
  const knownCourses = new Set(courses.map((course) => course.slug));
  const candidates: CandidatePaper[] = [];

  for (const object of objects) {
    if (!object.key.startsWith(CONTENT_PREFIX)) continue;
    if (!object.key.endsWith(".pdf") || object.key.endsWith("-preview.pdf")) continue;

    const parts = object.key.split("/");
    if (parts.length < 4) continue;
    const [, course, level, filename] = parts;
    if (!course || !level || !filename || !knownCourses.has(course)) continue;
    if (!getLevel(course, level)) continue;

    const slug = filename.replace(/\.pdf$/i, "");
    const previewKey = `${CONTENT_PREFIX}${course}/${level}/${slug}-preview.pdf`;
    const thumbnailKey = `${CONTENT_PREFIX}${course}/${level}/${slug}-thumbnail.png`;
    const courseInfo = getCourse(course);
    const levelInfo = getLevel(course, level);
    const latestDate = object.lastModified ? new Date(object.lastModified) : new Date();
    const year = Number.isFinite(latestDate.getFullYear()) ? latestDate.getFullYear() : new Date().getFullYear();
    const title = titleFromSlug(slug);

    candidates.push({
      course,
      level,
      title,
      category: "notes",
      sitting: "",
      year,
      description: `${title} for ${courseInfo?.code ?? course.toUpperCase()} ${levelInfo?.name ?? level}. Includes concise notes, revision practice and tutor-written model answers for exam preparation in Kenya.`,
      price_kes: PRICE_KES,
      preview_pdf_key: byKey.has(previewKey) ? previewKey : "",
      full_pdf_key: object.key,
      file_size_bytes: object.size,
      thumbnail_url: byKey.has(thumbnailKey) ? publicUrl(thumbnailKey) : "",
      syllabus_version: "current",
      tags: ["notes", "revision-kit", "auto-synced"],
      featured: false,
      published: true,
    });
  }

  return candidates.sort((a, b) => a.course.localeCompare(b.course) || a.level.localeCompare(b.level) || a.title.localeCompare(b.title));
}

let lastSyncAt = 0;
let inFlightSync: Promise<Awaited<ReturnType<typeof syncR2CatalogNow>>> | null = null;

export async function syncR2Catalog(options: { force?: boolean } = {}) {
  const now = Date.now();
  if (!options.force && now - lastSyncAt < 45_000) {
    return { ok: true, skipped: true, reason: "recently synced" as const };
  }
  if (!options.force && inFlightSync) return inFlightSync;
  inFlightSync = syncR2CatalogNow().finally(() => {
    lastSyncAt = Date.now();
    inFlightSync = null;
  });
  return inFlightSync;
}

async function safeExtract(key: string) {
  if (!key) return "";
  try {
    const { extractPdfText } = await import("./pdf-text.server");
    return await extractPdfText(key);
  } catch (err) {
    console.warn("PDF text extraction failed for", key, err);
    return "";
  }
}

async function syncR2CatalogNow() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const objects = await listR2ContentObjects();
  const candidates = inferPapersFromR2Objects(objects);
  if (candidates.length === 0) {
    return { ok: true, objectCount: objects.length, candidates: 0, inserted: 0, updated: 0, indexed: 0 };
  }

  const { data: existingRows, error: existingError } = await supabaseAdmin
    .from("papers")
    .select("id, course, level, title, preview_pdf_key, full_pdf_key, file_size_bytes, thumbnail_url, published, preview_text");
  if (existingError) throw new Error(existingError.message);

  type ExistingRow = {
    id: string;
    course: string;
    level: string;
    title: string;
    preview_pdf_key: string | null;
    full_pdf_key: string | null;
    file_size_bytes: number | null;
    thumbnail_url: string | null;
    published: boolean;
    preview_text: string | null;
  };
  const rows = (existingRows ?? []) as unknown as ExistingRow[];
  const existingByFullKey = new Map(rows.map((row) => [row.full_pdf_key, row]));
  const existingByIdentity = new Map(rows.map((row) => [`${row.course}|${row.level}|${row.title.toLowerCase()}`, row]));
  const toInsert: (CandidatePaper & { preview_text?: string })[] = [];
  let updated = 0;
  let indexed = 0;

  for (const candidate of candidates) {
    const existing = existingByFullKey.get(candidate.full_pdf_key) ?? existingByIdentity.get(`${candidate.course}|${candidate.level}|${candidate.title.toLowerCase()}`);
    if (!existing) {
      // Extract text from the preview (fallback: full) so the very first sync ships SEO content.
      const text = await safeExtract(candidate.preview_pdf_key || candidate.full_pdf_key);
      if (text) indexed += 1;
      toInsert.push({ ...candidate, preview_text: text || undefined });
      continue;
    }

    const patch: Record<string, unknown> = {};
    if (!existing.full_pdf_key) patch.full_pdf_key = candidate.full_pdf_key;
    if (!existing.preview_pdf_key && candidate.preview_pdf_key) patch.preview_pdf_key = candidate.preview_pdf_key;
    if (!existing.thumbnail_url && candidate.thumbnail_url) patch.thumbnail_url = candidate.thumbnail_url;
    if (!existing.file_size_bytes && candidate.file_size_bytes) patch.file_size_bytes = candidate.file_size_bytes;
    if (!existing.published) patch.published = true;

    // Backfill preview_text for rows missing indexed content.
    if (!existing.preview_text) {
      const text = await safeExtract(existing.preview_pdf_key || candidate.preview_pdf_key || candidate.full_pdf_key);
      if (text) {
        patch.preview_text = text;
        indexed += 1;
      }
    }

    if (Object.keys(patch).length > 0) {
      const { error } = await supabaseAdmin.from("papers").update(patch as never).eq("id", existing.id);
      if (error) throw new Error(error.message);
      updated += 1;
    }
  }

  if (toInsert.length > 0) {
    const { error } = await supabaseAdmin.from("papers").insert(toInsert as never);
    if (error) throw new Error(error.message);
  }

  return {
    ok: true,
    objectCount: objects.length,
    candidates: candidates.length,
    inserted: toInsert.length,
    updated,
    indexed,
  };
}