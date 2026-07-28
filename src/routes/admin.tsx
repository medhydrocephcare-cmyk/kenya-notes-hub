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
import { Loader2, ShieldAlert, Save, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { SITE, SITE_URL } from "@/lib/site-config";

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
