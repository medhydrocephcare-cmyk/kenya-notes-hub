import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { allPapersQueryOptions } from "@/lib/papers.queries";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Loader2, ShieldAlert } from "lucide-react";
import { SITE, SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/admin")({
  loader: ({ context }) => context.queryClient.ensureQueryData(allPapersQueryOptions),
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
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-sm text-muted-foreground">{error.message}</div>
  ),
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: papers } = useSuspenseQuery(allPapersQueryOptions);

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

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Admin dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span> — admin.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Courses" value={courses.length} />
          <Stat label="Levels" value={levels.length} />
          <Stat label="Papers" value={papers.length} />
          <Stat label="Orders" value="—" />
        </div>

        <Tabs defaultValue="papers" className="mt-10">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="papers">Papers</TabsTrigger>
            <TabsTrigger value="new">Add paper</TabsTrigger>
            <TabsTrigger value="courses">Courses & levels</TabsTrigger>
          </TabsList>

          <TabsContent value="papers">
            <Card className="mt-4 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Course / Level</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Sitting</th>
                      <th className="px-4 py-3">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {papers.map((p) => (
                      <tr key={p.id} className="border-t border-border/60">
                        <td className="px-4 py-3 font-medium">{p.title}</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.courseSlug.toUpperCase()} / {p.levelSlug}</td>
                        <td className="px-4 py-3">KSh {p.price}</td>
                        <td className="px-4 py-3">{p.examSitting || "—"}</td>
                        <td className="px-4 py-3">{p.lastUpdated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="new"><AddPaperForm /></TabsContent>

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

function AddPaperForm() {
  const { session } = useAuth();
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
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
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
          <input id="published" name="published" type="checkbox" className="h-4 w-4" />
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
