import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { serverPublishableClient } from "./papers.server";

export type PaperReview = {
  id: string;
  paper_id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export const listPaperReviews = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ paperId: z.string().min(1) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = serverPublishableClient();
    const { data: rows, error } = await supabase
      .from("paper_reviews")
      .select("id, paper_id, author_name, rating, comment, created_at")
      .eq("paper_id", data.paperId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return (rows ?? []) as PaperReview[];
  });
