import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("apply"), priceKes: z.number().int().positive().max(100_000) }),
  z.object({ action: z.literal("revert") }),
]);

function statusFor(message: string) {
  if (message.startsWith("Unauthorized")) return 401;
  if (message.startsWith("Forbidden")) return 403;
  return 400;
}

export const Route = createFileRoute("/api/public/admin/prices")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      POST: async ({ request }) => {
        const limited = rateLimit(request, { key: "admin-prices", limit: 12, windowMs: 60_000 });
        if (!limited.ok) return limited.response;
        try {
          const { requireAdminFromRequest, applyDefaultPaperPrice, revertDefaultPaperPrice } = await import("@/lib/admin-api.server");
          await requireAdminFromRequest(request);
          const parsed = schema.safeParse(await request.json());
          if (!parsed.success) return errorResponse(request, "Invalid price action", 400);
          const result = parsed.data.action === "apply"
            ? await applyDefaultPaperPrice(parsed.data.priceKes)
            : await revertDefaultPaperPrice();
          return jsonResponse(request, { ok: true, ...result });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update prices";
          return errorResponse(request, message, statusFor(message));
        }
      },
    },
  },
});