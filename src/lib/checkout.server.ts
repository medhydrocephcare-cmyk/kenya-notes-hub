import { getRequestHeader } from "@tanstack/react-start/server";

export async function resolveUserIdFromBearer(): Promise<string | null> {
  const auth = getRequestHeader("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data.user?.id ?? null;
}