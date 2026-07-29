import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

export const Route = createFileRoute("/api/public/checkout/status")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      GET: async ({ request }) => {
        const limited = rateLimit(request, { key: "checkout-status", limit: 120, windowMs: 60_000 });
        if (!limited.ok) return limited.response;

        const reference = new URL(request.url).searchParams.get("reference") ?? "";
        if (reference.length < 4 || reference.length > 40) {
          return errorResponse(request, "Invalid reference");
        }
        try {
          const { runGetOrderStatus } = await import("@/lib/checkout.server");
          const order = await runGetOrderStatus(reference);
          return jsonResponse(request, order);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Status lookup failed";
          return errorResponse(request, msg, 400);
        }
      },
    },
  },
});
