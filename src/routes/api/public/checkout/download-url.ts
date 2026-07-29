import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, jsonResponse, preflightResponse, rateLimit } from "@/lib/cors";

const schema = z.object({
  reference: z.string().min(4).max(40),
  paperId: z.string().min(1),
});

export const Route = createFileRoute("/api/public/checkout/download-url")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflightResponse(request),
      POST: async ({ request }) => {
        const limited = rateLimit(request, { key: "checkout-download-url", limit: 30, windowMs: 60_000 });
        if (!limited.ok) return limited.response;

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse(request, "Invalid JSON body");
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) return errorResponse(request, "Invalid input");

        try {
          const { resolveUserIdFromToken, getPaidDownloadFile, createDownloadToken } = await import(
            "@/lib/checkout.server"
          );
          const requestUserId = await resolveUserIdFromToken(request.headers.get("authorization"));
          const file = await getPaidDownloadFile(parsed.data.reference, parsed.data.paperId);
          if (file.userId && file.userId !== requestUserId) {
            return errorResponse(request, "Sign in to the account that purchased this paper", 403);
          }
          const token = createDownloadToken({
            reference: parsed.data.reference,
            paperId: parsed.data.paperId,
            ttlSeconds: 120,
          });
          const url = `/api/public/download/${encodeURIComponent(parsed.data.reference)}/${encodeURIComponent(parsed.data.paperId)}?token=${encodeURIComponent(token)}`;
          return jsonResponse(request, { url, expiresIn: 120 });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Download unavailable";
          return errorResponse(request, msg, 400);
        }
      },
    },
  },
});
