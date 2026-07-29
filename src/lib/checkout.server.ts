import { getRequestHeader } from "@tanstack/react-start/server";
import { createHmac, timingSafeEqual } from "crypto";

type DownloadTokenPayload = {
  reference: string;
  paperId: string;
  expiresAt: number;
};

export async function resolveUserIdFromToken(
  rawToken: string | null | undefined,
  options: { rejectInvalid?: boolean } = {},
): Promise<string | null> {
  const token = rawToken?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    if (options.rejectInvalid) throw new Error("Invalid session");
    return null;
  }
  return data.user?.id ?? null;
}

export async function resolveUserIdFromBearer(options: { rejectInvalid?: boolean } = {}): Promise<string | null> {
  const auth = getRequestHeader("authorization");
  return resolveUserIdFromToken(auth, options);
}

function downloadSecret() {
  const secret = process.env.PALPLUSS_WEBHOOK_SECRET || process.env.LOVABLE_API_KEY;
  if (!secret) throw new Error("Download security secret is not configured");
  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", downloadSecret()).update(payload).digest("base64url");
}

export function createDownloadToken(input: { reference: string; paperId: string; ttlSeconds?: number }) {
  const payload: DownloadTokenPayload = {
    reference: input.reference,
    paperId: input.paperId,
    expiresAt: Date.now() + (input.ttlSeconds ?? 120) * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifyDownloadToken(token: string, expected: { reference: string; paperId: string }) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;
  const expectedSignature = signPayload(encoded);
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expectedSignature);
  if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) return false;

  let payload: DownloadTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as DownloadTokenPayload;
  } catch {
    return false;
  }

  return (
    payload.reference === expected.reference &&
    payload.paperId === expected.paperId &&
    Number.isFinite(payload.expiresAt) &&
    payload.expiresAt > Date.now()
  );
}

export async function getPaidDownloadFile(reference: string, paperId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, status, user_id, order_items(paper_id, file_key)")
    .eq("reference", reference)
    .maybeSingle();
  if (orderError) throw new Error(orderError.message);
  if (!order) throw new Error("Order not found");
  if (order.status !== "paid") throw new Error("Payment required before download");

  const item = order.order_items?.find((i: { paper_id: string }) => i.paper_id === paperId);
  if (!item) throw new Error("Paper not part of order");

  const { data: paper, error: paperError } = await supabaseAdmin
    .from("papers")
    .select("title, full_pdf_key")
    .eq("id", paperId)
    .maybeSingle();
  if (paperError) throw new Error(paperError.message);

  const itemKey = (item as { file_key: string | null }).file_key;
  const key = paper?.full_pdf_key || itemKey;
  if (!key) throw new Error("File not available yet");

  return { key, title: paper?.title ?? "Kasneb paper", userId: order.user_id };
}