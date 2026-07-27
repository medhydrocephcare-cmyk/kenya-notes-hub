import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/palpluss/webhook/$secret")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expected = process.env.PALPLUSS_WEBHOOK_SECRET;
        if (!expected || params.secret !== expected) {
          console.warn("[palpluss webhook] rejected: bad secret");
          return new Response("Unauthorized", { status: 401 });
        }

        const raw = await request.text();
        console.log("[palpluss webhook] payload:", raw);

        let payload: Record<string, unknown> = {};
        try {
          payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        // Palpluss sends either { transaction: {...} } or a flat payload.
        const tx = (payload.transaction ?? payload.data ?? payload) as Record<string, unknown>;
        const reference = (tx.external_reference ?? tx.accountReference ?? tx.reference ?? payload.reference) as
          | string
          | undefined;
        const rawStatus = String(
          tx.status ?? payload.status ?? payload.event_type ?? "",
        ).toUpperCase();
        const receipt = (tx.mpesa_receipt ?? tx.mpesaReceipt ?? tx.receipt ?? null) as string | null;
        const desc = (tx.result_desc ?? tx.resultDesc ?? tx.message ?? null) as string | null;
        const providerTxId = (tx.id ?? tx.transactionId ?? null) as string | null;

        if (!reference) {
          console.warn("[palpluss webhook] no reference in payload");
          return new Response("ok");
        }

        const status =
          rawStatus.includes("SUCCESS") || rawStatus.includes("COMPLETED") || rawStatus.includes("PAID")
            ? "paid"
            : rawStatus.includes("FAIL") ||
                rawStatus.includes("CANCEL") ||
                rawStatus.includes("EXPIR") ||
                rawStatus.includes("REJECT")
              ? "failed"
              : "pending";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const patch: Record<string, unknown> = { status, mpesa_receipt: receipt, result_desc: desc };
        if (providerTxId) patch.palpluss_transaction_id = providerTxId;

        const { error } = await supabaseAdmin.from("orders").update(patch).eq("reference", reference);
        if (error) {
          console.error("[palpluss webhook] db error:", error.message);
          return new Response("db error", { status: 500 });
        }

        console.log(`[palpluss webhook] ref=${reference} status=${status}`);
        return new Response("ok", { status: 200 });
      },
    },
  },
});
