import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { corsHeaders, errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

const schema = z.object({
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

export const Route = createFileRoute("/api/public/checkout/initiate")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      POST: async ({ request }) => {
        const limited = rateLimit(request, { key: "checkout-initiate", limit: 10, windowMs: 60_000 });
        if (!limited.ok) return limited.response;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse(request, "Invalid JSON body");
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) return errorResponse(request, parsed.error.issues[0]?.message ?? "Invalid input");

        try {
          const { resolveUserIdFromToken, runInitiateCheckout } = await import("@/lib/checkout.server");
          const userId = await resolveUserIdFromToken(request.headers.get("authorization"));
          const host = request.headers.get("host") ?? new URL(request.url).host;
          const result = await runInitiateCheckout(parsed.data, { userId, host });
          return jsonResponse(request, result);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Checkout failed";
          console.error("[checkout/initiate]", msg);
          return errorResponse(request, msg, 400);
        }
      },
    },
  },
});
