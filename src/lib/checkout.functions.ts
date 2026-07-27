import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { z } from "zod";

const initiateSchema = z.object({
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
});

export const initiateCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => initiateSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { initiateStk } = await import("./palpluss.server");

    const subtotal = data.items.reduce((s, i) => s + i.price, 0);
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
      })
      .select("id, reference")
      .single();
    if (error || !order) throw new Error(error?.message ?? "Failed to create order");

    const itemsInsert = data.items.map((i) => ({
      order_id: order.id,
      paper_id: i.paperId,
      title: i.title,
      price_kes: i.price,
    }));
    await supabaseAdmin.from("order_items").insert(itemsInsert);

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
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "reference, status, subtotal_kes, mpesa_receipt, result_desc, order_items(paper_id, title, price_kes)",
      )
      .eq("reference", data.reference)
      .maybeSingle();
    if (!order) return null;
    return order;
  });

export const getDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().min(4), paperId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { presignGet } = await import("./r2.server");

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, status, order_items(paper_id, file_key)")
      .eq("reference", data.reference)
      .maybeSingle();
    if (!order || order.status !== "paid") throw new Error("Order not paid");

    const item = order.order_items?.find((i: { paper_id: string }) => i.paper_id === data.paperId);
    if (!item) throw new Error("Paper not part of order");

    // Fallback key convention: papers/<paperId>.pdf when no explicit file_key set yet.
    const key = (item as { file_key: string | null }).file_key ?? `papers/${data.paperId}.pdf`;
    const url = await presignGet(key, 60 * 30);
    return { url, expiresIn: 1800 };
  });
