import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useMemo } from "react";
import { listPaperReviews, type PaperReview } from "@/lib/reviews.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, MessageSquareText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

export function PaperReviewsBlock({ paperId, paperTitle }: { paperId: string; paperTitle: string }) {
  const fetchReviews = useServerFn(listPaperReviews);
  const q = useQuery({
    queryKey: ["paper-reviews", paperId],
    queryFn: () => fetchReviews({ data: { paperId } }),
    staleTime: 30_000,
  });
  const reviews: PaperReview[] = q.data ?? [];
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);

  const summary = useMemo(() => {
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: sum / reviews.length, count: reviews.length };
  }, [reviews]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const comment = String(fd.get("comment") ?? "").trim();
    if (comment.length < 5) {
      toast.error("Please write at least 5 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("paper_reviews").insert({
      paper_id: paperId,
      user_id: user.id,
      author_name: user.email?.split("@")[0] ?? "Student",
      rating,
      comment,
      approved: true,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Thanks for your review!");
      (e.target as HTMLFormElement).reset();
      setRating(5);
      q.refetch();
    }
  }

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Student reviews</h2>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <Stars rating={Math.round(summary.avg)} />
            <span>
              {summary.count > 0
                ? `${summary.avg.toFixed(1)} out of 5 · ${summary.count} review${summary.count === 1 ? "" : "s"}`
                : "No reviews yet — be the first."}
            </span>
          </div>
        </div>
      </div>

      <Card className="mt-4 p-5">
        {user ? (
          <form onSubmit={submit} className="grid gap-3">
            <div>
              <Label>Your rating for &ldquo;{paperTitle}&rdquo;</Label>
              <div className="mt-1 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n} stars`}
                    className="rounded p-1 hover:bg-muted"
                  >
                    <Star className={`h-6 w-6 ${n <= rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Your review</Label>
              <Textarea id="comment" name="comment" rows={3} required placeholder="What did you like or dislike?" className="mt-1" />
            </div>
            <Button type="submit" disabled={busy} className="w-fit bg-brand hover:brightness-110">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Post review
            </Button>
          </form>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">Sign in to leave a review for this paper.</p>
            <Link to="/auth"><Button variant="outline">Sign in to review</Button></Link>
          </div>
        )}
      </Card>

      {q.isLoading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews…
        </div>
      ) : reviews.length === 0 ? null : (
        <ul className="mt-6 grid gap-3">
          {reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                  {r.author_name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{r.author_name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="mt-2 flex items-start gap-2 text-sm text-foreground">
                    <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{r.comment}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </ul>
      )}
    </section>
  );
}
