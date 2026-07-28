import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { listTestimonials, type Testimonial } from "@/lib/testimonials.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Quote, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-5 w-5" : "h-4 w-4";
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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export function TestimonialsSection({
  variant = "home",
  title = "Loved by KASNEB & KNEC students across Kenya",
  subtitle = "Real reviews from candidates who passed their sittings using our notes, revision kits and past papers.",
}: {
  variant?: "home" | "blog";
  title?: string;
  subtitle?: string;
}) {
  const fetchTestimonials = useServerFn(listTestimonials);
  const q = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => fetchTestimonials(),
    staleTime: 60_000,
  });

  const items: Testimonial[] = q.data ?? [];
  const [showForm, setShowForm] = useState(false);

  return (
    <section
      className={`${variant === "home" ? "border-y border-border/60 bg-surface/40" : ""} py-12 sm:py-16`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Student reviews</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-brand/30 text-brand hover:bg-brand/5"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? "Close form" : "Leave a review"}
          </Button>
        </div>

        {showForm && <SubmitForm onDone={() => { setShowForm(false); q.refetch(); }} />}

        {q.isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, variant === "home" ? 6 : 24).map((t) => (
              <Card
                key={t.id}
                className="relative flex flex-col justify-between p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Quote className="absolute right-4 top-4 h-8 w-8 text-brand/10" />
                <div>
                  <Stars rating={t.rating} />
                  <p className="mt-3 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                    {initials(t.author_name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.author_name}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SubmitForm({ onDone }: { onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const author_name = String(fd.get("author_name") ?? "").trim();
    const role = String(fd.get("role") ?? "").trim() || "KASNEB student";
    const quote = String(fd.get("quote") ?? "").trim();
    if (author_name.length < 2 || quote.length < 10) {
      toast.error("Please add your name and a review of at least 10 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("testimonials").insert({
      author_name,
      role,
      quote,
      rating,
      approved: false,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Thanks! Your review will appear once approved.");
      (e.target as HTMLFormElement).reset();
      setRating(5);
      onDone();
    }
  }

  return (
    <Card className="mt-6 p-6">
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="author_name">Your name</Label>
          <Input id="author_name" name="author_name" required className="mt-1.5" placeholder="Jane Wanjiku" />
        </div>
        <div>
          <Label htmlFor="role">Course / role (optional)</Label>
          <Input id="role" name="role" className="mt-1.5" placeholder="CPA Foundation, Nairobi" />
        </div>
        <div className="sm:col-span-2">
          <Label>Your rating</Label>
          <div className="mt-1.5 flex items-center gap-1">
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
        <div className="sm:col-span-2">
          <Label htmlFor="quote">Your review</Label>
          <Textarea id="quote" name="quote" required rows={4} className="mt-1.5" placeholder="What did you like about our papers/notes?" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy} className="bg-brand hover:brightness-110">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit review
          </Button>
        </div>
      </form>
    </Card>
  );
}
