// Server-only: extract plain text from a PDF stored in R2 (public URL).
// Uses unpdf which ships a Workers/edge-compatible pdfjs build.
import { extractText, getDocumentProxy } from "unpdf";

function publicUrl(key: string) {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base || !key) return "";
  return `${base.replace(/\/$/, "")}/${encodeURI(key)}`;
}

/** Fetch a PDF from R2's public base URL and return cleaned plain text (capped). */
export async function extractPdfText(key: string, maxChars = 60_000): Promise<string> {
  const url = publicUrl(key);
  if (!url) return "";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PDF fetch failed ${res.status} for ${key}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const pdf = await getDocumentProxy(buf);
  const { text } = await extractText(pdf, { mergePages: true });
  const raw = Array.isArray(text) ? text.join("\n\n") : String(text ?? "");
  const cleaned = raw
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
}
