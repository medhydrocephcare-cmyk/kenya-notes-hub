import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/palpluss/webhook/$secret")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const expected = process.env.PALPLUSS_WEBHOOK_SECRET;
        if (!expected || params.secret !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: {
          event_type?: string;
          transaction?: {
            id?: string;
            status?: string;
            external_reference?: string;
            mpesa_receipt?: string | null;
            result_desc?: string | null;
          };
        };
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const tx = payload.transaction;
        if (!tx?.external_reference) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const status =
          tx.status === "SUCCESS"
            ? "paid"
            : tx.status === "FAILED" || tx.status === "CANCELLED" || tx.status === "EXPIRED"
              ? "failed"
              : "pending";

        await supabaseAdmin
          .from("orders")
          .update({
            status,
            mpesa_receipt: tx.mpesa_receipt ?? null,
            result_desc: tx.result_desc ?? null,
            palpluss_transaction_id: tx.id ?? undefined,
          })
          .eq("reference", tx.external_reference);

        return new Response("ok", { status: 200 });
      },
    },
  },
});
