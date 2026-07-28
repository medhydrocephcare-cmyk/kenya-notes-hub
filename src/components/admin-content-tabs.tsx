import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Save, Plus, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

/* ------------------------------ Categories ------------------------------ */

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
};

export function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("paper_categories").select("*").order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    const { error } = await supabase.from("paper_categories").insert({
      slug: String(fd.get("slug") ?? "").trim(),
      name: String(fd.get("name") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      icon: String(fd.get("icon") ?? "📚"),
      color: String(fd.get("color") ?? "emerald"),
      sort_order: Number(fd.get("sort_order") ?? 0),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Category added");
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("paper_categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="p-5">
        <h3 className="font-semibold">Add category</h3>
        <form onSubmit={add} className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label><Input name="name" required className="mt-1.5" /></div>
            <div><Label>Slug</Label><Input name="slug" required className="mt-1.5" placeholder="revision-kits" /></div>
          </div>
          <div><Label>Description</Label><Textarea name="description" rows={2} className="mt-1.5" /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label>Icon (emoji)</Label><Input name="icon" defaultValue="📚" className="mt-1.5" /></div>
            <div><Label>Color</Label><Input name="color" defaultValue="emerald" className="mt-1.5" /></div>
            <div><Label>Sort order</Label><Input type="number" name="sort_order" defaultValue={0} className="mt-1.5" /></div>
          </div>
          <Button type="submit" disabled={saving} className="bg-brand hover:brightness-110">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Add category</>}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="mb-3 font-semibold">All categories ({items.length})</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="grid gap-2">
            {items.map((c) => (
              <Card key={c.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.icon}</span>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug} · {c.description || "—"}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
              </Card>
            ))}
            {items.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">No categories yet.</Card>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Blog ------------------------------- */

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  content_md: string;
  author: string;
  tags: string[];
  reading_minutes: number;
  published: boolean;
  published_at: string | null;
};

export function BlogAdmin() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as BlogPost[]);
  }
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      slug: String(fd.get("slug") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      excerpt: String(fd.get("excerpt") ?? "").trim(),
      cover_image_url: String(fd.get("cover_image_url") ?? "").trim() || null,
      content_md: String(fd.get("content_md") ?? ""),
      author: String(fd.get("author") ?? "Kasneb Pastpapers Team"),
      tags: String(fd.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      reading_minutes: Number(fd.get("reading_minutes") ?? 5),
      published: fd.get("published") === "on",
      published_at: fd.get("published") === "on" ? new Date().toISOString() : null,
    };
    setSaving(true);
    const { error } = editing
      ? await supabase.from("blog_posts").update(payload).eq("id", editing.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Post updated" : "Post created");
    setEditing(null);
    (e.target as HTMLFormElement).reset();
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{editing ? "Edit post" : "Create post"}</h3>
          {editing && <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>Cancel edit</Button>}
        </div>
        <form key={editing?.id ?? "new"} onSubmit={save} className="mt-3 grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Title</Label><Input name="title" required defaultValue={editing?.title ?? ""} className="mt-1.5" /></div>
            <div><Label>Slug</Label><Input name="slug" required defaultValue={editing?.slug ?? ""} className="mt-1.5" placeholder="cpa-exam-tips" /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea name="excerpt" rows={2} required defaultValue={editing?.excerpt ?? ""} className="mt-1.5" /></div>
          <div><Label>Cover image URL</Label><Input name="cover_image_url" defaultValue={editing?.cover_image_url ?? ""} className="mt-1.5" placeholder="https://…" /></div>
          <div><Label>Content (Markdown)</Label><Textarea name="content_md" rows={10} required defaultValue={editing?.content_md ?? ""} className="mt-1.5 font-mono text-xs" /></div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label>Author</Label><Input name="author" defaultValue={editing?.author ?? "Kasneb Pastpapers Team"} className="mt-1.5" /></div>
            <div><Label>Tags (comma)</Label><Input name="tags" defaultValue={editing?.tags?.join(", ") ?? ""} className="mt-1.5" /></div>
            <div><Label>Read time (min)</Label><Input type="number" name="reading_minutes" defaultValue={editing?.reading_minutes ?? 5} className="mt-1.5" /></div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={editing?.published ?? true} className="h-4 w-4" />
            Publish (visible on the site)
          </label>
          <Button type="submit" disabled={saving} className="bg-brand hover:brightness-110">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {editing ? "Update" : "Publish"}</>}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="mb-3 font-semibold">All posts ({items.length})</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="grid gap-2">
            {items.map((p) => (
              <Card key={p.id} className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] ${p.published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                      <span className="truncate text-sm font-semibold">{p.title}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">/blog/{p.slug}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
            {items.length === 0 && <Card className="p-6 text-center text-sm text-muted-foreground">No posts yet.</Card>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Testimonials ------------------------------- */

type Testimonial = {
  id: string;
  author_name: string;
  role: string;
  rating: number;
  quote: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
};

export function TestimonialsAdmin() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Testimonial[]);
  }
  useEffect(() => { load(); }, []);

  async function update(id: string, patch: Partial<Testimonial>) {
    const { error } = await supabase.from("testimonials").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  const pending = items.filter((i) => !i.approved);
  const approved = items.filter((i) => i.approved);

  return (
    <div className="mt-4 grid gap-6">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : (
        <>
          <section>
            <h3 className="mb-2 font-semibold">Pending approval ({pending.length})</h3>
            <div className="grid gap-2">
              {pending.map((t) => (
                <TestimonialRow key={t.id} t={t} onApprove={() => update(t.id, { approved: true })} onFeature={() => update(t.id, { featured: !t.featured })} onDelete={() => remove(t.id)} />
              ))}
              {pending.length === 0 && <Card className="p-4 text-center text-sm text-muted-foreground">Nothing pending.</Card>}
            </div>
          </section>
          <section>
            <h3 className="mb-2 font-semibold">Approved ({approved.length})</h3>
            <div className="grid gap-2">
              {approved.map((t) => (
                <TestimonialRow key={t.id} t={t} onUnapprove={() => update(t.id, { approved: false })} onFeature={() => update(t.id, { featured: !t.featured })} onDelete={() => remove(t.id)} />
              ))}
              {approved.length === 0 && <Card className="p-4 text-center text-sm text-muted-foreground">No approved testimonials yet.</Card>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function TestimonialRow({ t, onApprove, onUnapprove, onFeature, onDelete }: {
  t: Testimonial;
  onApprove?: () => void;
  onUnapprove?: () => void;
  onFeature: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold">{t.author_name} <span className="text-xs font-normal text-muted-foreground">· {t.role} · {t.rating}★</span></div>
          <p className="mt-1 text-sm">"{t.quote}"</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {onApprove && <Button size="sm" onClick={onApprove} className="bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4" /></Button>}
          {onUnapprove && <Button size="sm" variant="outline" onClick={onUnapprove}><XCircle className="h-4 w-4" /></Button>}
          <Button size="sm" variant="outline" onClick={onFeature} className={t.featured ? "border-gold text-gold" : ""}>★</Button>
          <Button size="sm" variant="outline" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------- Paper reviews ------------------------------- */

type Review = {
  id: string;
  paper_id: string;
  author_name: string;
  rating: number;
  comment: string;
  approved: boolean;
  created_at: string;
};

export function ReviewsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("paper_reviews").select("*").order("created_at", { ascending: false }).limit(200);
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Review[]);
  }
  useEffect(() => { load(); }, []);

  async function toggle(id: string, approved: boolean) {
    const { error } = await supabase.from("paper_reviews").update({ approved }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete review?")) return;
    const { error } = await supabase.from("paper_reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="mt-4 grid gap-2">
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">No reviews yet.</Card>
      ) : (
        items.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  {r.author_name}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">{r.rating}★ · {new Date(r.created_at).toLocaleDateString()}</span>
                  <span className={`ml-2 rounded px-1.5 py-0.5 text-[10px] ${r.approved ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
                    {r.approved ? "Public" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 text-sm">{r.comment}</p>
                <div className="mt-1 truncate text-[10px] text-muted-foreground">paper: {r.paper_id}</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="outline" onClick={() => toggle(r.id, !r.approved)}>
                  {r.approved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
