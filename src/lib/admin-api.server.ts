import { createClient } from "@supabase/supabase-js";
import { rowToPaper } from "./paper-catalog";
import type { Database } from "@/integrations/supabase/types";

type PaperRow = Database["public"]["Tables"]["papers"]["Row"];

function serverEnv(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY") {
  const value = process.env[name] ?? process.env[`VITE_${name}`];
  if (!value) throw new Error("Backend environment is not configured");
  return value;
}

function bearerToken(authorization: string | null) {
  const token = authorization?.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw new Error("Unauthorized: missing session");
  return token;
}

function createUserClient(token: string) {
  const url = serverEnv("SUPABASE_URL");
  const key = serverEnv("SUPABASE_PUBLISHABLE_KEY");
  return createClient<Database>(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}`, apikey: key },
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export async function requireAdminFromRequest(request: Request) {
  const token = bearerToken(request.headers.get("authorization"));
  const supabase = createUserClient(token);
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) throw new Error("Unauthorized: invalid session");

  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (roleError) throw new Error(roleError.message);
  if (!isAdmin) throw new Error("Forbidden: admin only");
  return { userId: userData.user.id };
}

export async function listAdminPapersForApi() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("papers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    ...rowToPaper(row as PaperRow),
    published: (row as PaperRow).published,
    fullPdfKey: (row as PaperRow).full_pdf_key ?? "",
    previewPdfKey: (row as PaperRow).preview_pdf_key ?? "",
  }));
}

export async function listAdminOrdersForApi() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, reference, email, phone, buyer_name, subtotal_kes, status, mpesa_receipt, result_desc, created_at, order_items(paper_id, title, price_kes)")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function applyDefaultPaperPrice(priceKes: number) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error, count } = await supabaseAdmin
    .from("papers")
    .update({ discount_price_kes: priceKes })
    .eq("published", true);
  if (error) throw new Error(error.message);
  return { updated: count ?? 0 };
}

export async function revertDefaultPaperPrice() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error, count } = await supabaseAdmin
    .from("papers")
    .update({ discount_price_kes: null })
    .not("discount_price_kes", "is", null);
  if (error) throw new Error(error.message);
  return { updated: count ?? 0 };
}