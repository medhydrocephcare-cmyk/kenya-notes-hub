const LOVABLE_BASE = "https://project--6cb65918-caa8-4800-8ded-864211f7ab29.lovable.app";

export type AdminPaper = {
  id: string;
  slug?: string;
  courseSlug: string;
  levelSlug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  examSitting: string;
  lastUpdated: string;
  category?: string;
  pages?: number;
  fileSize?: number;
  thumbnailUrl?: string;
  syllabusVersion?: string;
  tags?: string[];
  downloadCount?: number;
  previewAvailable?: boolean;
  downloadAvailable?: boolean;
  featured?: boolean;
  year?: number;
  published: boolean;
  fullPdfKey: string;
  previewPdfKey: string;
};

export type AdminOrder = {
  id: string;
  reference: string;
  email: string;
  phone: string;
  buyer_name: string;
  subtotal_kes: number;
  status: string;
  mpesa_receipt: string | null;
  result_desc: string | null;
  created_at: string;
  order_items: { paper_id: string; title: string; price_kes: number }[];
};

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${LOVABLE_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...authHeader,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(await errorMessage(res));
  return res.json() as Promise<T>;
}

async function errorMessage(res: Response) {
  try {
    const body = await res.json();
    if (typeof body?.error === "string" && body.error) return body.error;
  } catch {
    // ignore non-JSON bodies
  }
  return `Request failed: ${res.status}`;
}

export const listAdminPapers = () => adminRequest<AdminPaper[]>("/api/public/admin/papers");
export const listAdminOrders = () => adminRequest<AdminOrder[]>("/api/public/admin/orders");

export function createAdminPaper(payload: Record<string, unknown>) {
  return adminRequest<{ ok: true; paper: unknown }>("/api/public/admin/papers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminPaper(payload: Record<string, unknown>) {
  return adminRequest<{ ok: true; paper: unknown }>("/api/public/admin/papers", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteAdminPaper(id: string) {
  return adminRequest<{ ok: true }>("/api/public/admin/papers", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export function applyAdminDefaultPrice(priceKes: number) {
  return adminRequest<{ ok: true; updated: number }>("/api/public/admin/prices", {
    method: "POST",
    body: JSON.stringify({ action: "apply", priceKes }),
  });
}

export function revertAdminDefaultPrice() {
  return adminRequest<{ ok: true; updated: number }>("/api/public/admin/prices", {
    method: "POST",
    body: JSON.stringify({ action: "revert" }),
  });
}