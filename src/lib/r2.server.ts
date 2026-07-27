// Cloudflare R2 (S3-compatible) signed URL helper. Server-only.
import { AwsClient } from "aws4fetch";

function endpoint() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !bucket) throw new Error("R2 not configured");
  return `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
}

export async function presignGet(key: string, expiresSeconds = 60 * 30) {
  const id = process.env.R2_ACCESS_KEY_ID;
  const secret = process.env.R2_SECRET_ACCESS_KEY;
  if (!id || !secret) throw new Error("R2 credentials missing");
  const client = new AwsClient({
    accessKeyId: id,
    secretAccessKey: secret,
    service: "s3",
    region: "auto",
  });
  const url = new URL(`${endpoint()}/${encodeURI(key)}`);
  url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
  const signed = await client.sign(url.toString(), { method: "GET", aws: { signQuery: true } });
  return signed.url;
}

export function publicUrl(key: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/${encodeURI(key)}`;
}
