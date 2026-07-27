import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCourse, getLevel, getPaper } from "@/lib/data";
import { Star, Download, ShieldCheck, Calendar, RefreshCw } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/papers/$paperId")({
  loader: ({ params }) => {
    const paper = getPaper(params.paperId);
    if (!paper) throw notFound();
    const course = getCourse(paper.courseSlug)!;
    const level = getLevel(paper.courseSlug, paper.levelSlug)!;
    return { paper, course, level };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.paper.title} — ${loaderData.course.code} | Chapa Notes` },
          { name: "description", content: loaderData.paper.description },
          { property: "og:title", content: `${loaderData.paper.title} — Chapa Notes` },
          { property: "og:description", content: loaderData.paper.description },
        ]
      : [{ title: "Paper not found" }, { name: "robots", content: "noindex" }],
  }),
  component: PaperDetail,
});

function PaperDetail() {
  const { paper, course, level } = Route.useLoaderData();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <nav className="text-xs text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">Courses</Link>
          <span className="mx-2">/</span>
          <Link to="/courses/$courseSlug" params={{ courseSlug: course.slug }} className="hover:text-foreground">
            {course.code}
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/courses/$courseSlug/$levelSlug"
            params={{ courseSlug: course.slug, levelSlug: level.slug }}
            className="hover:text-foreground"
          >
            {level.name}
          </Link>
        </nav>

        <div className="mt-6 grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{course.code}</Badge>
              <Badge variant="outline">{level.name}</Badge>
              {paper.bundleType && paper.bundleType !== "single" && (
                <Badge className="capitalize">{paper.bundleType} bundle</Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{paper.title}</h1>
            <div className="mt-2 flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{paper.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({paper.reviews.length} reviews)</span>
            </div>
            <p className="mt-4 text-muted-foreground">{paper.description}</p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Covers <b>{paper.examSitting}</b> sitting</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
                <RefreshCw className="h-4 w-4 text-primary" />
                <span>Last updated <b>{paper.lastUpdated}</b></span>
              </div>
            </div>

            <Tabs defaultValue="preview" className="mt-10">
              <TabsList>
                <TabsTrigger value="preview">Free preview</TabsTrigger>
                <TabsTrigger value="contents">What's inside</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({paper.reviews.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <Card className="mt-4 p-6">
                  <div className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
                    Sample answer — first page
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <p><b>Question 1(a):</b> Distinguish between financial accounting and management accounting.</p>
                    <p>
                      <b>Answer:</b> Financial accounting is concerned with the preparation of general-purpose
                      financial statements — the statement of financial position, statement of profit or loss,
                      and statement of cash flows — for use by external users such as shareholders, lenders,
                      tax authorities and regulators. It is governed by IFRS/IAS and produces reports at
                      fixed intervals (usually annually).
                    </p>
                    <p>
                      Management accounting, by contrast, provides information to internal users — mainly
                      management — to support planning, control and decision-making. It is not bound by
                      external reporting standards, is forward-looking (budgets, forecasts, variance analysis)
                      and is prepared as frequently as management requires…
                    </p>
                    <p className="text-muted-foreground">— preview ends here. Full 240-page notes + answer kit unlocks after purchase.</p>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="contents">
                <Card className="mt-4 p-6 text-sm">
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    <li>Complete syllabus notes aligned to the {paper.examSitting} exam</li>
                    <li>Revision kit — past-paper questions from the last 5 sittings</li>
                    <li>Model answers written by qualified tutors</li>
                    <li>Chapter summaries and quick-reference formulas</li>
                    <li>PDF download, works offline on phone and laptop</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <div className="mt-4 space-y-3">
                  {paper.reviews.map((r, i) => (
                    <Card key={i} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.author}</div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, k) => (
                            <Star key={k} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                      <div className="mt-2 text-xs text-muted-foreground">{r.date}</div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase sidebar */}
          <div className="md:sticky md:top-24 md:h-fit">
            <Card className="p-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold">KSh {paper.price}</span>
                {paper.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">KSh {paper.originalPrice}</span>
                )}
              </div>
              {paper.originalPrice && (
                <div className="mt-1 text-xs font-medium text-emerald-600">
                  Save KSh {paper.originalPrice - paper.price}
                </div>
              )}
              <Button
                className="mt-4 w-full"
                size="lg"
                onClick={() => {
                  addToCart(paper.id);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy now
              </Button>
              <Button
                variant="outline"
                className="mt-2 w-full"
                onClick={() => {
                  addToCart(paper.id);
                  toast.success("Added to cart");
                }}
              >
                Add to cart
              </Button>
              <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Download className="h-3.5 w-3.5" /> Instant PDF download</div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" /> M-Pesa secured by Palpluss</div>
                <div className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5" /> Free updates for this sitting</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
