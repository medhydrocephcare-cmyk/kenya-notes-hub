/**
 * Central site branding + support contact configuration.
 *
 * All values are safe for the browser; drive them with VITE_* env vars in
 * `.env` (or the equivalent NEXT_PUBLIC_* if you migrate later).
 */

function envValue(key: string, fallback: string): string {
  const fromVite =
    typeof import.meta !== "undefined" && (import.meta as { env?: Record<string, string | undefined> }).env
      ? (import.meta as { env: Record<string, string | undefined> }).env[key]
      : undefined;
  const fromNode = typeof process !== "undefined" ? process.env?.[key] : undefined;
  return fromVite ?? fromNode ?? fallback;
}

export const SITE = {
  name: envValue("VITE_SITE_NAME", "Kasneb Pastpapers"),
  domain: envValue("VITE_SITE_DOMAIN", "kasnebpapers.com"),
  supportPhone: envValue("VITE_SUPPORT_PHONE", "0712 345 678"),
  supportEmail: envValue("VITE_SUPPORT_EMAIL", "hello@kasnebpapers.com"),
  tagline: "KASNEB & KNEC notes, revision kits and past papers with model answers.",
} as const;

export const SITE_URL = `https://${SITE.domain}`;
