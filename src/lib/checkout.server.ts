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
// ---------------- Core business ops (host-agnostic) ----------------

export type CheckoutInput = {
  buyerName: string;
  email: string;
  phone: string;
  items: { paperId: string; title: string; price: number }[];
};

export async function runInitiateCheckout(input: CheckoutInput, ctx: { userId: string | null; host: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { initiateStk } = await import("./palpluss.server");

  const requestedIds = [...new Set(input.items.map((i) => i.paperId))];
  const { data: dbPapers, error: papersError } = await supabaseAdmin
    .from("papers")
    .select("id, title, price_kes, discount_price_kes, full_pdf_key, published")
    .in("id", requestedIds)
    .eq("published", true);
  if (papersError) throw new Error(papersError.message);
  if (!dbPapers || dbPapers.length !== requestedIds.length) {
    throw new Error("One or more papers in your cart are no longer available");
  }
  const unavailable = dbPapers.find((p) => !p.full_pdf_key);
  if (unavailable) throw new Error(`${unavailable.title} is still processing and cannot be purchased yet`);

  const paperById = new Map(dbPapers.map((p) => [p.id, p]));
  const verifiedItems = requestedIds.map((paperId) => {
    const p = paperById.get(paperId)!;
    return {
      paperId: p.id,
      title: p.title,
      price: p.discount_price_kes ?? p.price_kes,
      fileKey: p.full_pdf_key ?? "",
    };
  });
  const subtotal = verifiedItems.reduce((s, i) => s + i.price, 0);
  const shortRef = "KP" + Math.random().toString(36).slice(2, 10).toUpperCase();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      reference: shortRef,
      email: input.email,
      phone: input.phone,
      buyer_name: input.buyerName,
      subtotal_kes: subtotal,
      status: "pending",
      user_id: ctx.userId,
    })
    .select("id, reference")
    .single();
  if (error || !order) throw new Error(error?.message ?? "Failed to create order");

  const itemsInsert = verifiedItems.map((i) => ({
    order_id: order.id,
    paper_id: i.paperId,
    title: i.title,
    price_kes: i.price,
    file_key: i.fileKey,
  }));
  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemsInsert);
  if (itemsError) {
    await supabaseAdmin.from("orders").update({ status: "failed", result_desc: itemsError.message }).eq("id", order.id);
    throw new Error(itemsError.message);
  }

  const webhookSecret = process.env.PALPLUSS_WEBHOOK_SECRET ?? "";
  const callbackUrl = `https://${ctx.host}/api/public/palpluss/webhook/${encodeURIComponent(webhookSecret)}`;

  try {
    const stk = await initiateStk({
      amount: subtotal,
      phone: input.phone,
      accountReference: order.reference,
      transactionDesc: "KasnebPaper",
      callbackUrl,
      channelId: process.env.PALPLUSS_CHANNEL_ID,
    });
    await supabaseAdmin.from("orders").update({ palpluss_transaction_id: stk.transactionId }).eq("id", order.id);
    return { reference: order.reference, transactionId: stk.transactionId };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Payment initiation failed";
    await supabaseAdmin.from("orders").update({ status: "failed", result_desc: msg }).eq("id", order.id);
    throw new Error(msg);
  }
}

export async function runGetOrderStatus(reference: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { getTransaction } = await import("./palpluss.server");
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, reference, status, subtotal_kes, mpesa_receipt, result_desc, palpluss_transaction_id, order_items(paper_id, title, price_kes)",
    )
    .eq("reference", reference)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) return null;

  if (order.status === "pending" && order.palpluss_transaction_id) {
    try {
      const tx = await getTransaction(order.palpluss_transaction_id);
      const raw = String(tx?.status ?? "").toUpperCase();
      const status =
        raw === "SUCCESS"
          ? "paid"
          : raw === "FAILED" || raw === "CANCELLED" || raw === "EXPIRED" || raw === "REVERSED"
            ? "failed"
            : "pending";
      if (status !== "pending") {
        const patch = {
          status,
          mpesa_receipt: tx?.mpesaReceipt ?? tx?.mpesa_receipt ?? order.mpesa_receipt,
          result_desc: tx?.resultDesc ?? tx?.result_desc ?? order.result_desc,
        };
        const { data: updated } = await supabaseAdmin
          .from("orders")
          .update(patch)
          .eq("id", order.id)
          .select(
            "id, reference, status, subtotal_kes, mpesa_receipt, result_desc, palpluss_transaction_id, order_items(paper_id, title, price_kes)",
          )
          .maybeSingle();
        return updated ?? { ...order, ...patch };
      }
    } catch (err) {
      console.warn("[palpluss] status poll failed", err);
    }
  }
  return order;
}

export async function runGetMyOrders(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, reference, status, subtotal_kes, mpesa_receipt, created_at, order_items(paper_id, title, price_kes)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
