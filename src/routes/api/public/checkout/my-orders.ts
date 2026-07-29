import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

export const Route = createFileRoute("/api/public/checkout/my-orders")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      GET: async ({ request }) => {
        const limited = rateLimit(request, { key: "checkout-my-orders", limit: 60, windowMs: 60_000 });
        if (!limited.ok) return limited.response;

        try {
          const { resolveUserIdFromToken, runGetMyOrders } = await import("@/lib/checkout.server");
          const userId = await resolveUserIdFromToken(request.headers.get("authorization"), {
            rejectInvalid: true,
          });
          if (!userId) return errorResponse(request, "Unauthorized", 401);
          const orders = await runGetMyOrders(userId);
          return jsonResponse(request, orders);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to load orders";
          const status = msg === "Invalid session" ? 401 : 400;
          return errorResponse(request, msg, status);
        }
      },
    },
  },
});
