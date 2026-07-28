import { createServerFn } from "@tanstack/react-start";
import { serverPublishableClient } from "./papers.server";

export type Testimonial = {
  id: string;
  author_name: string;
  role: string;
  avatar_url: string | null;
  rating: number;
  quote: string;
  featured: boolean;
  created_at: string;
};

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, role, avatar_url, rating, quote, featured, created_at")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return (data ?? []) as Testimonial[];
});
