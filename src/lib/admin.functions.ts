/**
 * Admin-only server functions. All handlers verify the caller has the
 * `admin` role via `has_role()` before touching privileged data.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { rowToPaper } from "./paper-catalog";
import type { Database } from "@/integrations/supabase/types";

type PaperRow = Database["public"]["Tables"]["papers"]["Row"];

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin only");
}

/** Admin: list every paper including unpublished/drafts. */
export const listAdminPapers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
  });

/** Admin: list every order along with items. */
export const listAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, reference, email, phone, buyer_name, subtotal_kes, status, mpesa_receipt, result_desc, created_at, order_items(paper_id, title, price_kes)")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return data ?? [];
  });
