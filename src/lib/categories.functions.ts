import { createServerFn } from "@tanstack/react-start";
import { serverPublishableClient } from "./papers.server";

export type PaperCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
};

export const listCategories = createServerFn({ method: "GET" }).handler(async (): Promise<PaperCategory[]> => {
  const supabase = serverPublishableClient();
  const { data, error } = await supabase
    .from("paper_categories")
    .select("id, slug, name, description, icon, color, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id, slug: r.slug, name: r.name, description: r.description,
    icon: r.icon, color: r.color, sortOrder: r.sort_order,
  }));
});
