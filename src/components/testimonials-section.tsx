import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, Quote, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { listTestimonials } from "@/lib/testimonials.functions";
import { supabase } from "@/integrations/supabase/client";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < n ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export function TestimonialsSection({ compact = false }: { compact?: boolean }) {
  const fetchAll = useServerFn(listTestimonials);
  const q = useQuery({ queryKey: ["testimonials"], queryFn: () => fetchAll(), staleTime: 60_000 });
  const items = q.data ?? [];
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="bg-surface/40 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-brand">Student stories</div>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
              Loved by KASNEB & KNEC students
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Real reviews from students who passed their sittings with our notes and past papers.
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowForm((v) => !v)} className="border-brand/30">
            {showForm ? "Close form" : "Share your story"}
          </Button>
        </div>

        {showForm && <SubmitForm onDone={() => { setShowForm(false); q.refetch(); }} />}

        {q.isLoading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading stories…
          </div>
        ) : items.length === 0 ? (
          <Card className="mt-8 p-8 text-center text-sm text-muted-foreground">
            No approved reviews yet — be the first to share your experience.
          </Card>
        ) : (
          <div className={`mt-8 grid gap-4 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {items.slice(0, compact ? 4 : 9).map((t) => (
              <Card key={t.id} className="relative overflow-hidden p-6">
                {t.featured && (
                  <span className="absolute right-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
                    Featured
                  </span>
                )}
                <Quote className="h-6 w-6 text-brand/30" />
                <Stars n={t.rating} />
                <p className="mt-3 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {t.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{t.authorName}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.role}</div>
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
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(5);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const authorName = String(fd.get("name") ?? "").trim();
    const role = String(fd.get("role") ?? "KASNEB student").trim();
    const quote = String(fd.get("quote") ?? "").trim();
    if (!authorName || quote.length < 12) return toast.error("Add your name and a longer review");
    setSaving(true);
    const { data: sess } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      author_name: authorName,
      role: role || "KASNEB student",
      rating,
      quote,
      approved: false,
    };
    const { error } = await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(sess?.user ? "Thanks! Your review is pending approval." : "Thanks! Pending admin approval.");
    (e.target as HTMLFormElement).reset();
    setRating(5);
    onDone();
  }

  return (
    <Card className="mt-6 p-6">
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <div>
          <Label>Your name</Label>
          <Input name="name" required className="mt-1.5" placeholder="Jane Wanjiku" />
        </div>
        <div>
          <Label>Course / role</Label>
          <Input name="role" className="mt-1.5" placeholder="CPA Foundation student" />
        </div>
        <div className="md:col-span-2">
          <Label>Rating</Label>
          <div className="mt-1.5 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <Label>Your review</Label>
          <Textarea name="quote" required minLength={12} rows={4} className="mt-1.5" placeholder="How did our notes help you pass?" />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving} className="bg-brand hover:brightness-110">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit review"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
