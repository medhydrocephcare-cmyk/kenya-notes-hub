import { getRequestHeader } from "@tanstack/react-start/server";

export async function resolveUserIdFromBearer(options: { rejectInvalid?: boolean } = {}): Promise<string | null> {
  const auth = getRequestHeader("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    if (options.rejectInvalid) throw new Error("Invalid session");
    return null;
  }
  return data.user?.id ?? null;
}