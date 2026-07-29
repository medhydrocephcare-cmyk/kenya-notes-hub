import { createFileRoute } from "@tanstack/react-router";

function filenameFromTitle(title: string) {
  const base = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "kasneb-paper"}.pdf`;
}

export const Route = createFileRoute("/api/public/download/$reference/$paperId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const token = new URL(request.url).searchParams.get("token") ?? "";
        const { getPaidDownloadFile, verifyDownloadToken } = await import("@/lib/checkout.server");
        if (!verifyDownloadToken(token, { reference: params.reference, paperId: params.paperId })) {
          return new Response("Download link expired", { status: 401 });
        }

        try {
          const { key, title } = await getPaidDownloadFile(params.reference, params.paperId);
          const { presignGet } = await import("@/lib/r2.server");
          const signedUrl = await presignGet(key, 60);
          const upstream = await fetch(signedUrl);
          if (!upstream.ok || !upstream.body) {
            return new Response("File unavailable", { status: 502 });
          }
          return new Response(upstream.body, {
            status: 200,
            headers: {
              "Content-Type": upstream.headers.get("content-type") || "application/pdf",
              "Content-Disposition": `attachment; filename="${filenameFromTitle(title)}"`,
              "Cache-Control": "private, no-store",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Download unavailable";
          return new Response(message, { status: 400 });
        }
      },
    },
  },
});