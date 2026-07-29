import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().email().max(200) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Table `newsletter_subscribers` is created via migration; cast to bypass
    // stale generated types until the next regeneration.
    const client = supabaseAdmin as unknown as {
      from: (t: string) => {
        upsert: (r: unknown, o: { onConflict: string }) => Promise<{ error: { message: string } | null }>;
      };
    };
    const { error } = await client
      .from("newsletter_subscribers")
      .upsert({ email: data.email.toLowerCase().trim() }, { onConflict: "email" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
