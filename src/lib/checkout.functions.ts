import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const initiateCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      buyerName: z.string().min(2).max(120),
      email: z.string().email(),
      phone: z.string().min(9).max(20),
      items: z
        .array(
          z.object({
            paperId: z.string().min(1),
            title: z.string().min(1),
            price: z.number().int().positive(),
          }),
        )
        .min(1)
        .max(50),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { initiateStk } = await import("./palpluss.server");
    const { resolveUserIdFromBearer } = await import("./checkout.server");

    const userId = await resolveUserIdFromBearer({ rejectInvalid: false });

    const requestedIds = [...new Set(data.items.map((item) => item.paperId))];
    const { data: dbPapers, error: papersError } = await supabaseAdmin
      .from("papers")
      .select("id, title, price_kes, discount_price_kes, full_pdf_key, published")
      .in("id", requestedIds)
      .eq("published", true);
    if (papersError) throw new Error(papersError.message);
    if (!dbPapers || dbPapers.length !== requestedIds.length) {
      throw new Error("One or more papers in your cart are no longer available");
    }

    const unavailable = dbPapers.find((paper) => !paper.full_pdf_key);
    if (unavailable) {
      throw new Error(`${unavailable.title} is still processing and cannot be purchased yet`);
    }

    const paperById = new Map(dbPapers.map((paper) => [paper.id, paper]));
    const verifiedItems = requestedIds.map((paperId) => {
      const paper = paperById.get(paperId);
      if (!paper) throw new Error("Paper not found");
      return {
        paperId: paper.id,
        title: paper.title,
        price: paper.discount_price_kes ?? paper.price_kes,
        fileKey: paper.full_pdf_key ?? "",
      };
    });

    const subtotal = verifiedItems.reduce((sum, item) => sum + item.price, 0);
    const shortRef = "KP" + Math.random().toString(36).slice(2, 10).toUpperCase();

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        reference: shortRef,
        email: data.email,
        phone: data.phone,
        buyer_name: data.buyerName,
        subtotal_kes: subtotal,
        status: "pending",
        user_id: userId,
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
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed", result_desc: itemsError.message })
        .eq("id", order.id);
      throw new Error(itemsError.message);
    }

    const host = getRequestHost();
    const webhookSecret = process.env.PALPLUSS_WEBHOOK_SECRET ?? "";
    const callbackUrl = `https://${host}/api/public/palpluss/webhook/${encodeURIComponent(webhookSecret)}`;

    try {
      const stk = await initiateStk({
        amount: subtotal,
        phone: data.phone,
        accountReference: order.reference,
        transactionDesc: "KasnebPaper",
        callbackUrl,
        channelId: process.env.PALPLUSS_CHANNEL_ID,
      });
      await supabaseAdmin
        .from("orders")
        .update({ palpluss_transaction_id: stk.transactionId })
        .eq("id", order.id);
      return { reference: order.reference, transactionId: stk.transactionId };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment initiation failed";
      await supabaseAdmin
        .from("orders")
        .update({ status: "failed", result_desc: msg })
        .eq("id", order.id);
      throw new Error(msg);
    }
  });

export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().min(4).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getTransaction } = await import("./palpluss.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        "id, reference, status, subtotal_kes, mpesa_receipt, result_desc, palpluss_transaction_id, order_items(paper_id, title, price_kes)",
      )
      .eq("reference", data.reference)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!order) return null;

    if (order.status === "pending" && order.palpluss_transaction_id) {
      try {
        const tx = await getTransaction(order.palpluss_transaction_id);
        const rawStatus = String(tx?.status ?? "").toUpperCase();
        const status =
          rawStatus === "SUCCESS"
            ? "paid"
            : rawStatus === "FAILED" || rawStatus === "CANCELLED" || rawStatus === "EXPIRED" || rawStatus === "REVERSED"
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
        console.warn("[palpluss] transaction status poll failed", err);
      }
    }

    return order;
  });

export const getDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().min(4), paperId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { createDownloadToken, getPaidDownloadFile, resolveUserIdFromBearer } = await import("./checkout.server");

    const requestUserId = await resolveUserIdFromBearer({ rejectInvalid: false });
    const file = await getPaidDownloadFile(data.reference, data.paperId);
    if (file.userId && file.userId !== requestUserId) {
      throw new Error("Sign in to the account that purchased this paper");
    }

    const token = createDownloadToken({ reference: data.reference, paperId: data.paperId, ttlSeconds: 120 });
    const url = `/api/public/download/${encodeURIComponent(data.reference)}/${encodeURIComponent(data.paperId)}?token=${encodeURIComponent(token)}`;
    return { url, expiresIn: 120 };
  });

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select(
        "id, reference, status, subtotal_kes, mpesa_receipt, created_at, order_items(paper_id, title, price_kes)",
      )
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
