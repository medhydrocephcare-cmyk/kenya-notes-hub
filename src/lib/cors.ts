// Shared CORS helpers for public HTTP routes.

const ALLOWED_ORIGINS = [
  "https://www.kasnebpapers.com",
  "https://kasnebpapers.com",
  "https://kenya-notes-hub.lovable.app",
  "https://project--6cb65918-caa8-4800-8ded-864211f7ab29.lovable.app",
  "https://project--6cb65918-caa8-4800-8ded-864211f7ab29-dev.lovable.app",
  "https://id-preview--6cb65918-caa8-4800-8ded-864211f7ab29.lovable.app",
];

// Match any vercel.app subdomain (previews) and localhost dev.
const ORIGIN_PATTERNS: RegExp[] = [
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];

export function resolveAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (ORIGIN_PATTERNS.some((re) => re.test(origin))) return origin;
  return null;
}

export function corsHeaders(request: Request, extra: HeadersInit = {}): HeadersInit {
  const allowed = resolveAllowedOrigin(request);
  const base: Record<string, string> = {
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
    "Access-Control-Max-Age": "86400",
  };
  if (allowed) {
    base["Access-Control-Allow-Origin"] = allowed;
    base["Access-Control-Allow-Credentials"] = "true";
  }
  return { ...base, ...(extra as Record<string, string>) };
}

export function preflightResponse(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export function jsonResponse(request: Request, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(request, {
      "Content-Type": "application/json",
      "X-Content-Type-Options": "nosniff",
    }),
  });
}

export function errorResponse(request: Request, message: string, status = 400): Response {
  return jsonResponse(request, { error: message }, status);
}

// Simple in-memory sliding-window rate limiter (per worker instance).
// Not distributed, but blocks trivial floods.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  request: Request,
  opts: { key: string; limit: number; windowMs: number },
): { ok: true } | { ok: false; response: Response } {
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const bucketKey = `${opts.key}:${ip}`;
  const now = Date.now();
  const entry = buckets.get(bucketKey);
  if (!entry || entry.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > opts.limit) {
    return {
      ok: false,
      response: errorResponse(request, "Too many requests. Slow down and try again.", 429),
    };
  }
  return { ok: true };
}
