const LOVABLE_BASE = "https://project--6cb65918-caa8-4800-8ded-864211f7ab29.lovable.app";

async function getAuthHeader(): Promise<Record<string, string>> {
  // Adjust this import to match how you get the current Supabase session elsewhere in your app
  const { supabase } = await import("@/integrations/supabase/client");
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function initiateCheckout(payload: {
  buyerName: string;
  email: string;
  phone: string;
  items: { paperId: string; title: string; price: number }[];
}) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${LOVABLE_BASE}/api/public/checkout/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, "Checkout failed"));
  return res.json();
}

export async function getOrderStatus(reference: string) {
  const res = await fetch(
    `${LOVABLE_BASE}/api/public/checkout/status?reference=${encodeURIComponent(reference)}`
  );
  if (!res.ok) throw new Error(await getErrorMessage(res, "Status check failed"));
  return res.json();
}

export async function getDownloadUrl(payload: { reference: string; paperId: string }) {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${LOVABLE_BASE}/api/public/checkout/download-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, "Download URL failed"));
  const data = await res.json();
  return { ...data, url: `${LOVABLE_BASE}${data.url}` }; // prepend base since url is relative
}

export async function getMyOrders() {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${LOVABLE_BASE}/api/public/checkout/my-orders`, {
    headers: authHeader,
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, "My orders failed"));
  return res.json();
}

async function getErrorMessage(res: Response, fallback: string) {
  try {
    const data = await res.json();
    if (typeof data?.error === "string" && data.error.trim()) return data.error;
  } catch {
    // ignore non-JSON error bodies
  }
  return `${fallback}: ${res.status}`;
}
