const KENYA_UTC_OFFSET_HOURS = 3;

export function secondsUntilKenyaMidnight(now = new Date()) {
  const kenyaNowMs = now.getTime() + KENYA_UTC_OFFSET_HOURS * 60 * 60 * 1000;
  const kenyaNow = new Date(kenyaNowMs);
  const nextKenyaMidnightMs = Date.UTC(
    kenyaNow.getUTCFullYear(),
    kenyaNow.getUTCMonth(),
    kenyaNow.getUTCDate() + 1,
    0,
    0,
    0,
  );
  return Math.max(60, Math.floor((nextKenyaMidnightMs - kenyaNowMs) / 1000));
}

export function dailyPublicCacheHeader() {
  return `public, max-age=${secondsUntilKenyaMidnight()}, stale-while-revalidate=3600`;
}

export function sitemapCacheHeader() {
  return `public, max-age=${secondsUntilKenyaMidnight()}, stale-while-revalidate=7200`;
}