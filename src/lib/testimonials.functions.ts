import { createServerFn } from "@tanstack/react-start";
import { serverPublishableClient } from "./papers.server";

export type Testimonial = {
  id: string;
  authorName: string;
  role: string;
  avatarUrl: string | null;
  rating: number;
  quote: string;
  featured: boolean;
};

export const listTestimonials = createServerFn({ method: "GET" }).handler(async (): Promise<Testimonial[]> => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, role, avatar_url, rating, quote, featured")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id, authorName: r.author_name, role: r.role,
    avatarUrl: r.avatar_url, rating: r.rating, quote: r.quote, featured: r.featured,
  }));
});
