import { createServerFn } from "@tanstack/react-start";
import { serverPublishableClient } from "./papers.server";

export type PaperCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
};

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("paper_categories")
    .select("id, slug, name, description, icon, color, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PaperCategory[];
});
