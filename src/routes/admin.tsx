import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { courses, levels } from "@/lib/data";
import { listAdminPapers, listAdminOrders } from "@/lib/admin.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Loader2, ShieldAlert, Save, Trash2, CheckCircle2, XCircle, Clock, Plus, Eye, EyeOff, Star } from "lucide-react";
import { SITE, SITE_URL } from "@/lib/site-config";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Admin — ${SITE.name}` },
      { name: "description", content: "Manage courses, levels, papers and orders." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: `Admin — ${SITE.name}` },
      { property: "og:description", content: "Private catalog and order management for Kasneb Pastpapers." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/admin` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/admin` }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user.email}) does not have admin privileges.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="outline">← Back to shop</Button>
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return <AdminInner accessToken={session?.access_token ?? ""} email={user.email ?? ""} />;
}

function AdminInner({ accessToken, email }: { accessToken: string; email: string }) {
  const fetchPapers = useServerFn(listAdminPapers);
  const fetchOrders = useServerFn(listAdminOrders);

  const papersQ = useQuery({
    queryKey: ["admin", "papers"],
    queryFn: () => fetchPapers(),
    staleTime: 15_000,
  });
  const ordersQ = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => fetchOrders(),
    staleTime: 15_000,
  });

  const papers = papersQ.data ?? [];
  const orders = ordersQ.data ?? [];

  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const failedCount = orders.filter((o) => o.status === "failed").length;
  const revenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.subtotal_kes, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{email}</span> — admin.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Papers" value={papers.length} />
          <Stat label="Paid orders" value={paidCount} />
          <Stat label="Pending" value={pendingCount} />
          <Stat label="Revenue (KSh)" value={revenue.toLocaleString()} />
        </div>

        <Tabs defaultValue="papers" className="mt-10">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="papers">Papers ({papers.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="new">Add paper</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="courses">Courses & levels</TabsTrigger>
          </TabsList>

          <TabsContent value="papers">
            {papersQ.isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading papers…</div>
            ) : papersQ.error ? (
              <p className="mt-6 text-sm text-destructive">{(papersQ.error as Error).message}</p>
            ) : (
              <div className="mt-4 grid gap-3">
                {papers.map((p) => (
                  <PaperRowEditor key={p.id} paper={p} accessToken={accessToken} />
                ))}
                {papers.length === 0 && (
                  <Card className="p-8 text-center text-sm text-muted-foreground">
                    No papers yet. Use the "Add paper" tab or upload via CloudCode.
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            {ordersQ.isLoading ? (
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading orders…</div>
            ) : ordersQ.error ? (
              <p className="mt-6 text-sm text-destructive">{(ordersQ.error as Error).message}</p>
            ) : (
              <OrdersPanel
                orders={orders}
                counts={{ paid: paidCount, pending: pendingCount, failed: failedCount, all: orders.length }}
              />
            )}
          </TabsContent>

          <TabsContent value="new"><AddPaperForm accessToken={accessToken} /></TabsContent>

          <TabsContent value="categories"><AdminCategoriesPanel /></TabsContent>
          <TabsContent value="blog"><AdminBlogPanel /></TabsContent>
          <TabsContent value="testimonials"><AdminTestimonialsPanel /></TabsContent>
          <TabsContent value="reviews"><AdminReviewsPanel /></TabsContent>

          <TabsContent value="courses">
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {courses.map((c) => (
                <Card key={c.slug} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{c.name}</div>
                    <span className="text-xs text-muted-foreground">{c.code}</span>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {levels.filter((l) => l.courseSlug === c.slug).map((l) => (
                      <li key={l.slug}>• {l.name}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </Card>
  );
}

type AdminPaper = Awaited<ReturnType<typeof listAdminPapers>>[number];

function PaperRowEditor({ paper, accessToken }: { paper: AdminPaper; accessToken: string }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState(paper.title);
  const [price, setPrice] = useState(String(paper.price));
  const [discount, setDiscount] = useState(paper.originalPrice ? String(paper.price) : "");
  const [fullKey, setFullKey] = useState(paper.fullPdfKey);
  const [previewKey, setPreviewKey] = useState(paper.previewPdfKey);
  const [published, setPublished] = useState(paper.published);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/papers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        id: paper.id,
        title,
        price_kes: Number(price),
        discount_price_kes: discount ? Number(discount) : undefined,
        full_pdf_key: fullKey,
        preview_pdf_key: previewKey,
        published,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Paper updated");
      qc.invalidateQueries({ queryKey: ["admin", "papers"] });
      qc.invalidateQueries({ queryKey: ["papers"] });
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? "Update failed");
    }
  }

  async function remove() {
    if (!confirm(`Delete "${paper.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await fetch("/api/admin/papers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ id: paper.id }),
    });
    setDeleting(false);
    if (res.ok) {
      toast.success("Paper deleted");
      qc.invalidateQueries({ queryKey: ["admin", "papers"] });
      qc.invalidateQueries({ queryKey: ["papers"] });
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? "Delete failed");
    }
  }

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-2 py-0.5 font-mono">{paper.courseSlug.toUpperCase()}</span>
            <span>/</span>
            <span className="rounded bg-muted px-2 py-0.5 font-mono">{paper.levelSlug}</span>
            {published ? (
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-600">Published</span>
            ) : (
              <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-600">Draft</span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={save} disabled={saving} className="bg-brand hover:brightness-110">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </Button>
          <Button size="sm" variant="outline" onClick={remove} disabled={deleting}>
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label className="text-xs">Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Price (KSh)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Discount price (optional)</Label>
          <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Full PDF key (R2)</Label>
          <Input value={fullKey} onChange={(e) => setFullKey(e.target.value)} className="mt-1 font-mono text-xs" />
        </div>
        <div>
          <Label className="text-xs">Preview PDF key (R2)</Label>
          <Input value={previewKey} onChange={(e) => setPreviewKey(e.target.value)} className="mt-1 font-mono text-xs" />
        </div>
        <label className="mt-1 flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4" />
          Published (visible on the live site)
        </label>
      </div>
    </Card>
  );
}

type Order = Awaited<ReturnType<typeof listAdminOrders>>[number];

function OrdersPanel({ orders, counts }: { orders: Order[]; counts: { paid: number; pending: number; failed: number; all: number } }) {
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const filtered = orders.filter((o) => (filter === "all" ? true : o.status === filter));

  return (
    <div className="mt-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", "paid", "pending", "failed"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${counts.all})` : `${f} (${counts[f]})`}
          </Button>
        ))}
      </div>
      <div className="grid gap-3">
        {filtered.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <StatusPill status={o.status} />
                  #{o.reference}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {o.buyer_name} · {o.email} · {o.phone}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleString()}
                  {o.mpesa_receipt ? ` · M-Pesa ${o.mpesa_receipt}` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">KSh {o.subtotal_kes.toLocaleString()}</div>
              </div>
            </div>
            {o.order_items?.length ? (
              <ul className="mt-3 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                {o.order_items.map((it) => (
                  <li key={it.paper_id} className="flex justify-between">
                    <span>{it.title}</span>
                    <span>KSh {it.price_kes}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {o.result_desc && <p className="mt-2 text-xs text-destructive">{o.result_desc}</p>}
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">No {filter === "all" ? "" : filter} orders yet.</Card>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  if (status === "paid") return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600"><CheckCircle2 className="h-3 w-3" />paid</span>;
  if (status === "failed") return <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive"><XCircle className="h-3 w-3" />failed</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600"><Clock className="h-3 w-3" />pending</span>;
}

function AddPaperForm({ accessToken }: { accessToken: string }) {
  const qc = useQueryClient();
  const [course, setCourse] = useState(courses[0].slug);
  const [level, setLevel] = useState(levels.filter((l) => l.courseSlug === courses[0].slug)[0]?.slug ?? "");
  const [loading, setLoading] = useState(false);
  const courseLevels = levels.filter((l) => l.courseSlug === course);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const res = await fetch("/api/admin/papers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        course, level,
        title: form.get("title"),
        description: form.get("description"),
        price_kes: Number(form.get("price")),
        sitting: form.get("examSitting") || "Updated to latest available sitting",
        full_pdf_key: form.get("fullPdfKey"),
        preview_pdf_key: form.get("previewPdfKey"),
        thumbnail_url: form.get("thumbnailUrl") || undefined,
        published: form.get("published") === "on",
      }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success("Paper created");
      (e.target as HTMLFormElement).reset();
      qc.invalidateQueries({ queryKey: ["admin", "papers"] });
      qc.invalidateQueries({ queryKey: ["papers"] });
    } else {
      const body = await res.json().catch(() => ({}));
      toast.error(body?.error ?? "Failed to create paper");
    }
  }

  return (
    <Card className="mt-4 p-6">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Course</Label>
          <Select value={course} onValueChange={(v) => { setCourse(v); const first = levels.filter((l) => l.courseSlug === v)[0]?.slug ?? ""; setLevel(first); }}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{courses.map((c) => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Level</Label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{courseLevels.map((l) => <SelectItem key={l.slug} value={l.slug}>{l.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="price">Price (KSh)</Label>
          <Input id="price" name="price" type="number" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="examSitting">Exam sitting</Label>
          <Input id="examSitting" name="examSitting" placeholder="August 2026" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="fullPdfKey">Full PDF — R2 object key</Label>
          <Input id="fullPdfKey" name="fullPdfKey" placeholder="content/cpa/foundation-1/paper.pdf" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="previewPdfKey">Preview PDF — R2 object key</Label>
          <Input id="previewPdfKey" name="previewPdfKey" placeholder="content/cpa/foundation-1/paper-preview.pdf" className="mt-1.5" />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="thumbnailUrl">Thumbnail — public R2 URL</Label>
          <Input id="thumbnailUrl" name="thumbnailUrl" placeholder="https://files.kasnebpapers.com/…thumbnail.png" className="mt-1.5" />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input id="published" name="published" type="checkbox" className="h-4 w-4" defaultChecked />
          <Label htmlFor="published" className="!mt-0">Publish immediately (visible on the live site)</Label>
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading} className="bg-brand hover:brightness-110">
            {loading ? "Creating…" : "Create paper"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

/* ==================== Categories ==================== */

function AdminCategoriesPanel() {
  const q = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("paper_categories").select("*").order("sort_order");
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const cats = q.data ?? [];
  const [busy, setBusy] = useState(false);

  async function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("paper_categories").insert({
      slug: String(fd.get("slug")).trim().toLowerCase(),
      name: String(fd.get("name")).trim(),
      description: String(fd.get("description") ?? ""),
      icon: String(fd.get("icon") ?? "📚"),
      color: String(fd.get("color") ?? "emerald"),
      sort_order: Number(fd.get("sort_order") ?? 0),
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Category added");
      (e.target as HTMLFormElement).reset();
      q.refetch();
    }
  }
  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("paper_categories").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); q.refetch(); }
  }
  async function updateField(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("paper_categories").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); q.refetch(); }
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="grid gap-3">
        {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : cats.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl">{c.icon}</span>
              <div className="min-w-0 flex-1">
                <Input defaultValue={c.name} onBlur={(e) => e.target.value !== c.name && updateField(c.id, { name: e.target.value })} className="font-semibold" />
                <div className="mt-1 text-xs text-muted-foreground">/{c.slug}</div>
              </div>
              <Input type="number" defaultValue={c.sort_order} onBlur={(e) => Number(e.target.value) !== c.sort_order && updateField(c.id, { sort_order: Number(e.target.value) })} className="w-20" />
              <Button size="sm" variant="outline" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
            <Textarea defaultValue={c.description} onBlur={(e) => e.target.value !== c.description && updateField(c.id, { description: e.target.value })} rows={2} className="mt-3 text-sm" />
          </Card>
        ))}
        {cats.length === 0 && !q.isLoading && <Card className="p-8 text-center text-sm text-muted-foreground">No categories yet.</Card>}
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">Add category</h3>
        <form onSubmit={addCategory} className="mt-3 grid gap-3">
          <div><Label>Name</Label><Input name="name" required placeholder="Mock Exams" className="mt-1" /></div>
          <div><Label>Slug</Label><Input name="slug" required placeholder="mock-exams" className="mt-1 font-mono text-xs" /></div>
          <div><Label>Icon (emoji)</Label><Input name="icon" defaultValue="📚" className="mt-1" /></div>
          <div><Label>Color</Label><Input name="color" defaultValue="emerald" className="mt-1" /></div>
          <div><Label>Sort order</Label><Input name="sort_order" type="number" defaultValue={0} className="mt-1" /></div>
          <div><Label>Description</Label><Textarea name="description" rows={2} className="mt-1" /></div>
          <Button type="submit" disabled={busy} className="bg-brand hover:brightness-110">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />} Add
          </Button>
        </form>
      </Card>
    </div>
  );
}

/* ==================== Blog ==================== */

function AdminBlogPanel() {
  const q = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const posts = q.data ?? [];
  const [busy, setBusy] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function addPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.from("blog_posts").insert({
      slug: String(fd.get("slug")).trim().toLowerCase(),
      title: String(fd.get("title")).trim(),
      excerpt: String(fd.get("excerpt") ?? ""),
      content_md: String(fd.get("content_md") ?? ""),
      cover_image_url: String(fd.get("cover_image_url") ?? "") || null,
      reading_minutes: Number(fd.get("reading_minutes") ?? 5),
      tags: String(fd.get("tags") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      published: fd.get("published") === "on",
      published_at: fd.get("published") === "on" ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Post created");
      (e.target as HTMLFormElement).reset();
      q.refetch();
    }
  }
  async function togglePublish(id: string, current: boolean) {
    const { error } = await supabase.from("blog_posts").update({
      published: !current,
      published_at: !current ? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(current ? "Unpublished" : "Published"); q.refetch(); }
  }
  async function updatePost(id: string, patch: Record<string, unknown>) {
    const { error } = await supabase.from("blog_posts").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); q.refetch(); }
  }
  async function remove(id: string) {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); q.refetch(); }
  }

  return (
    <div className="mt-4 space-y-6">
      <Card className="p-5">
        <h3 className="font-semibold">Publish a new post</h3>
        <form onSubmit={addPost} className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="md:col-span-2"><Label>Title</Label><Input name="title" required className="mt-1" /></div>
          <div><Label>Slug</Label><Input name="slug" required placeholder="my-first-post" className="mt-1 font-mono text-xs" /></div>
          <div><Label>Reading minutes</Label><Input name="reading_minutes" type="number" defaultValue={5} className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Tags (comma-separated)</Label><Input name="tags" placeholder="cpa, study-tips" className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Cover image URL</Label><Input name="cover_image_url" placeholder="https://…" className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Excerpt</Label><Textarea name="excerpt" rows={2} required className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Content (Markdown)</Label><Textarea name="content_md" rows={8} required className="mt-1 font-mono text-xs" /></div>
          <label className="md:col-span-2 flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked className="h-4 w-4" /> Publish immediately
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={busy} className="bg-brand hover:brightness-110">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />} Create post
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-3">
        {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : posts.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {p.published ? <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">Live</span> : <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">Draft</span>}
                  <span className="text-xs text-muted-foreground">/{p.slug}</span>
                </div>
                <p className="mt-1 font-semibold">{p.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => togglePublish(p.id, p.published)}>
                  {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
            {expandedId === p.id && (
              <div className="mt-3 grid gap-2">
                <Input defaultValue={p.title} onBlur={(e) => e.target.value !== p.title && updatePost(p.id, { title: e.target.value })} />
                <Input defaultValue={p.excerpt} onBlur={(e) => e.target.value !== p.excerpt && updatePost(p.id, { excerpt: e.target.value })} />
                <Input defaultValue={p.cover_image_url ?? ""} placeholder="Cover image URL" onBlur={(e) => updatePost(p.id, { cover_image_url: e.target.value || null })} />
                <Textarea defaultValue={p.content_md} rows={10} className="font-mono text-xs" onBlur={(e) => e.target.value !== p.content_md && updatePost(p.id, { content_md: e.target.value })} />
              </div>
            )}
          </Card>
        ))}
        {posts.length === 0 && !q.isLoading && <Card className="p-8 text-center text-sm text-muted-foreground">No blog posts yet.</Card>}
      </div>
    </div>
  );
}

/* ==================== Testimonials ==================== */

function AdminTestimonialsPanel() {
  const q = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const items = q.data ?? [];

  async function approve(id: string, approved: boolean) {
    const { error } = await supabase.from("testimonials").update({ approved: !approved }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(approved ? "Unapproved" : "Approved"); q.refetch(); }
  }
  async function toggleFeatured(id: string, featured: boolean) {
    const { error } = await supabase.from("testimonials").update({ featured: !featured }).eq("id", id);
    if (error) toast.error(error.message); else q.refetch();
  }
  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); q.refetch(); }
  }
  async function addManual(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("testimonials").insert({
      author_name: String(fd.get("author_name")).trim(),
      role: String(fd.get("role") ?? "KASNEB student"),
      quote: String(fd.get("quote")).trim(),
      rating: Number(fd.get("rating") ?? 5),
      approved: true,
      featured: fd.get("featured") === "on",
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); (e.target as HTMLFormElement).reset(); q.refetch(); }
  }

  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="grid gap-3">
        {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : items.map((t) => (
          <Card key={t.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {t.approved ? <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">Approved</span> : <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">Pending</span>}
                  {t.featured && <span className="rounded bg-gold/20 px-2 py-0.5 text-xs text-gold-foreground">Featured</span>}
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 font-semibold">{t.author_name} <span className="text-xs font-normal text-muted-foreground">· {t.role}</span></p>
                <p className="mt-1 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={t.approved ? "outline" : "default"} onClick={() => approve(t.id, t.approved)}>
                  {t.approved ? "Unapprove" : "Approve"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleFeatured(t.id, t.featured)}>
                  <Star className={`h-4 w-4 ${t.featured ? "fill-gold text-gold" : ""}`} />
                </Button>
                <Button size="sm" variant="outline" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && !q.isLoading && <Card className="p-8 text-center text-sm text-muted-foreground">No testimonials yet.</Card>}
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">Add testimonial</h3>
        <form onSubmit={addManual} className="mt-3 grid gap-3">
          <div><Label>Name</Label><Input name="author_name" required className="mt-1" /></div>
          <div><Label>Role / course</Label><Input name="role" defaultValue="KASNEB student" className="mt-1" /></div>
          <div><Label>Rating (1-5)</Label><Input name="rating" type="number" min={1} max={5} defaultValue={5} className="mt-1" /></div>
          <div><Label>Quote</Label><Textarea name="quote" rows={3} required className="mt-1" /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" className="h-4 w-4" /> Feature on homepage</label>
          <Button type="submit" className="bg-brand hover:brightness-110"><Plus className="mr-1 h-4 w-4" /> Add</Button>
        </form>
      </Card>
    </div>
  );
}

/* ==================== Reviews ==================== */

function AdminReviewsPanel() {
  const q = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("paper_reviews").select("*, papers(title)").order("created_at", { ascending: false }).limit(200);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
  const items = q.data ?? [];
  async function approve(id: string, approved: boolean) {
    const { error } = await supabase.from("paper_reviews").update({ approved: !approved }).eq("id", id);
    if (error) toast.error(error.message); else q.refetch();
  }
  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    const { error } = await supabase.from("paper_reviews").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); q.refetch(); }
  }

  return (
    <div className="mt-4 grid gap-3">
      {q.isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : items.map((r: any) => (
        <Card key={r.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {r.approved ? <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">Approved</span> : <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600">Hidden</span>}
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/40"}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">on <b>{r.papers?.title ?? r.paper_id}</b></span>
              </div>
              <p className="mt-1 text-sm"><b>{r.author_name}:</b> {r.comment}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={r.approved ? "outline" : "default"} onClick={() => approve(r.id, r.approved)}>
                {r.approved ? "Hide" : "Approve"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      ))}
      {items.length === 0 && !q.isLoading && <Card className="p-8 text-center text-sm text-muted-foreground">No reviews yet.</Card>}
    </div>
  );
}
