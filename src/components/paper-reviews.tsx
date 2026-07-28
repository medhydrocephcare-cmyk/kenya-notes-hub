import { useEffect, useState } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

function Stars({ n, size = 3.5 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`fill-current ${i < n ? "text-gold" : "text-muted-foreground/25"}`} style={{ height: `${size * 4}px`, width: `${size * 4}px` }} />
      ))}
    </div>
  );
}

export function PaperReviewsBlock({ paperId, paperTitle }: { paperId: string; paperTitle: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("paper_reviews")
      .select("id, author_name, rating, comment, created_at")
      .eq("paper_id", paperId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(30);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setReviews(data ?? []);
  }

  useEffect(() => { load(); }, [paperId]);

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const comment = String(fd.get("comment") ?? "").trim();
    const name = String(fd.get("name") ?? "").trim() || (user.email ?? "Student");
    if (comment.length < 6) return toast.error("Please write a slightly longer review");
    setSaving(true);
    const { error } = await supabase.from("paper_reviews").insert({
      paper_id: paperId,
      user_id: user.id,
      author_name: name,
      rating,
      comment,
      approved: true,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks for reviewing!");
    (e.target as HTMLFormElement).reset();
    setRating(5);
    load();
  }

  return (
    <section className="mt-10 rounded-2xl border border-border/60 bg-background p-5 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold sm:text-2xl">Student reviews</h2>
          <p className="text-xs text-muted-foreground">Verified feedback from buyers of “{paperTitle}”.</p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
            <Stars n={Math.round(avg)} />
            <span className="text-sm font-semibold">{avg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <Card className="mt-4 p-6 text-center text-sm text-muted-foreground">
          <MessageSquare className="mx-auto mb-2 h-6 w-6 text-brand/50" />
          No reviews yet. Be the first to help other students.
        </Card>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-border/60 p-4">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {r.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{r.author_name}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                </div>
                <div className="ml-auto"><Stars n={r.rating} /></div>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 border-t border-border/60 pt-6">
        {!user ? (
          <div className="rounded-lg bg-surface/60 p-4 text-sm">
            <Link to="/auth" className="font-semibold text-brand hover:underline">Sign in</Link> to leave a review.
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Display name</Label>
              <Input name="name" defaultValue={user.email?.split("@")[0] ?? ""} className="mt-1.5" />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                    <Star className={`h-6 w-6 ${n <= rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <Label>Your review</Label>
              <Textarea name="comment" required minLength={6} rows={3} className="mt-1.5" placeholder="Was this paper helpful? Any tips for other students?" />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={saving} className="bg-brand hover:brightness-110">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post review"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
