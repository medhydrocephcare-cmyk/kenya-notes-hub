import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

function statusFor(message: string) {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  return 400;
}

export const Route = createFileRoute("/api/public/admin/orders")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      GET: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-orders-list", limit: 90, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest, listAdminOrdersForApi } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          return jsonResponse(request, await listAdminOrdersForApi());
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to load orders";
          return errorResponse(request, message, statusFor(message));
        }
      },
    },
  },
});