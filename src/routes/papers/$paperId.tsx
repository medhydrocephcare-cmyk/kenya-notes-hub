import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCourse, getLevel, getPaper } from "@/lib/data";
import {
  Star,
  Download,
  ShieldCheck,
  Calendar,
  RefreshCw,
  FileText,
  CheckCircle2,
  Lock,
  BookOpen,
  Users,
  Clock,
} from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

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
          { title: `${loaderData.paper.title} — ${loaderData.course.code} ${loaderData.level.name} past papers & answers` },
          { name: "description", content: `${loaderData.paper.description} Free preview. Instant PDF download. Pay securely with M-Pesa.` },
          { property: "og:title", content: `${loaderData.paper.title} — Kasneb Pastpapers` },
          { property: "og:description", content: loaderData.paper.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Paper not found" }, { name: "robots", content: "noindex" }],
  }),
  component: PaperDetail,
});

function PaperDetail() {
  const { paper, course, level } = Route.useLoaderData();
  const navigate = useNavigate();
  const discount = paper.originalPrice
    ? Math.round(((paper.originalPrice - paper.price) / paper.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Breadcrumbs bar */}
      <div className="border-b border-border/60 bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-3 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="mx-1.5">/</span>
          <Link to="/courses" className="hover:text-brand">Shop</Link>
          <span className="mx-1.5">/</span>
          <Link to="/courses/$courseSlug" params={{ courseSlug: course.slug }} className="hover:text-brand">
            {course.code}
          </Link>
          <span className="mx-1.5">/</span>
          <Link
            to="/courses/$courseSlug/$levelSlug"
            params={{ courseSlug: course.slug, levelSlug: level.slug }}
            className="hover:text-brand"
          >
            {level.name}
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">{paper.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          {/* Left: exam-paper preview + info */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand text-primary-foreground hover:bg-brand">{course.code}</Badge>
              <Badge variant="outline">{level.name}</Badge>
              {paper.bundleType && paper.bundleType !== "single" && (
                <Badge className="bg-gold capitalize text-gold-foreground hover:bg-gold">
                  {paper.bundleType} bundle
                </Badge>
              )}
              {discount > 0 && (
                <Badge className="bg-sale text-sale-foreground hover:bg-sale">-{discount}%</Badge>
              )}
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              {paper.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-foreground">{paper.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({paper.reviews.length})</span>
              </div>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> 1,240+ students
              </span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {paper.lastUpdated}
              </span>
            </div>

            {/* EXAM PAPER PREVIEW — mimics the real KASNEB paper */}
            <div className="mt-5 overflow-hidden rounded-xl border border-border shadow-card sm:mt-6">
              <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 text-[11px] sm:px-4 sm:py-2.5 sm:text-xs">
                <div className="flex min-w-0 items-center gap-1.5 font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="truncate">Sample from {paper.examSitting} paper</span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Free preview
                </span>
              </div>

              {/* Paper "page" — styled like a scanned KASNEB exam booklet */}
              <div className="relative overflow-hidden bg-[#fdfcf7] px-3 py-4 font-serif text-[11.5px] leading-relaxed text-[#1a1a1a] sm:px-8 sm:py-6 sm:text-[13.5px]">
                {/* Official-looking header */}
                <div className="mx-auto max-w-2xl border-b-2 border-[#1a1a1a] pb-3 text-center sm:pb-4">
                  <div className="break-words text-[8.5px] font-bold uppercase leading-snug tracking-[0.06em] text-[#1a1a1a] sm:text-[11px] sm:tracking-[0.25em]">
                    Kenya Accountants and Secretaries National Examinations Board
                  </div>
                  <div className="mt-2 break-words font-sans text-[13px] font-extrabold uppercase leading-tight tracking-wider sm:mt-3 sm:text-lg">
                    {course.code} — {level.name.toUpperCase()} LEVEL
                  </div>
                  <div className="mt-1 break-words text-[11px] font-semibold uppercase leading-snug sm:text-sm">{paper.title}</div>
                  <div className="mt-2 flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-[9.5px] font-semibold uppercase tracking-wide sm:mt-3 sm:text-[11px]">
                    <span className="truncate">{paper.examSitting}</span>
                    <span>Time: 3 hours</span>
                  </div>
                </div>

                <div className="mx-auto mt-5 max-w-2xl">
                  <div className="text-[11px] font-bold uppercase tracking-wider">Instructions to Candidates</div>
                  <ol className="mt-1.5 list-inside list-decimal space-y-0.5 text-[12px] text-[#333]">
                    <li>Answer <b>ALL</b> questions.</li>
                    <li>Marks allocated to each question are shown at the end of the question.</li>
                    <li>Show <b>ALL</b> your workings.</li>
                    <li>Do <b>NOT</b> write on this question paper.</li>
                  </ol>

                  <div className="mt-6 text-[11px] font-bold uppercase tracking-wider">Question One</div>
                  <p className="mt-2">
                    <b>(a)</b> Distinguish between <i>&ldquo;financial accounting&rdquo;</i> and{" "}
                    <i>&ldquo;management accounting&rdquo;</i>, giving <b>TWO</b> differences under each of the
                    following headings:
                  </p>
                  <ol className="ml-6 mt-2 list-[lower-roman] space-y-0.5">
                    <li>Users of the information;</li>
                    <li>Regulatory framework;</li>
                    <li>Time horizon of the reports produced.</li>
                  </ol>
                  <div className="mt-1 text-right text-[12px] font-semibold">(6 marks)</div>

                  <p className="mt-4">
                    <b>(b)</b> The following trial balance was extracted from the books of{" "}
                    <b>Kilele Traders Ltd.</b> as at 31 December 2025:
                  </p>

                  {/* Mini trial-balance table */}
                  <div className="mt-3 -mx-1 overflow-x-auto rounded border border-[#c9c4b3]">
                    <table className="w-full min-w-[420px] border-collapse text-[11.5px] sm:text-[12px]">
                      <thead className="bg-[#f2ede0]">
                        <tr>
                          <th className="border-b border-[#c9c4b3] px-2 py-1.5 text-left font-bold sm:px-3">Account</th>
                          <th className="border-b border-[#c9c4b3] px-2 py-1.5 text-right font-bold sm:px-3">Dr (Sh.)</th>
                          <th className="border-b border-[#c9c4b3] px-2 py-1.5 text-right font-bold sm:px-3">Cr (Sh.)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Sales", "", "4,820,000"],
                          ["Purchases", "2,940,000", ""],
                          ["Inventory (1 Jan 2025)", "310,000", ""],
                          ["Salaries and wages", "612,000", ""],
                          ["Rent and rates", "180,000", ""],
                          ["Trade receivables / payables", "410,000", "295,000"],
                        ].map(([a, d, c], i) => (
                          <tr key={i} className="odd:bg-white even:bg-[#faf7ed]">
                            <td className="border-b border-[#e6dfc8] px-2 py-1 sm:px-3">{a}</td>
                            <td className="border-b border-[#e6dfc8] px-2 py-1 text-right tabular-nums sm:px-3">{d}</td>
                            <td className="border-b border-[#e6dfc8] px-2 py-1 text-right tabular-nums sm:px-3">{c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-3">
                    Additional information:
                  </p>
                  <ol className="ml-6 mt-1 list-[lower-roman] space-y-0.5 text-[12px]">
                    <li>Inventory as at 31 December 2025 was valued at Sh. 385,000.</li>
                    <li>Depreciation is to be provided on motor vehicles at 20% p.a. on cost.</li>
                    <li>Rent prepaid amounted to Sh. 24,000.</li>
                  </ol>

                  <p className="mt-3"><b>Required:</b></p>
                  <ol className="ml-6 mt-1 list-[lower-roman] space-y-0.5">
                    <li>Statement of profit or loss for the year ended 31 December 2025.</li>
                    <li>Statement of financial position as at that date.</li>
                  </ol>
                  <div className="mt-1 text-right text-[12px] font-semibold">(14 marks)</div>
                  <div className="mt-2 text-right text-[12px] font-bold">(Total: 20 marks)</div>
                </div>

                {/* Fade + locked overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#fdfcf7] via-[#fdfcf7]/90 to-transparent" />
              </div>

              {/* Unlock CTA under the fade */}
              <div className="border-t border-border bg-surface/80 px-4 py-4 text-center backdrop-blur">
                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Full paper + model answers unlock after purchase
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    240-page PDF · tutor-written solutions · works offline
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs — what's inside / answers preview / reviews */}
            <Tabs defaultValue="inside" className="mt-8">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
                <TabsTrigger value="inside" className="flex-1 whitespace-nowrap text-xs sm:text-sm">Inside</TabsTrigger>
                <TabsTrigger value="answers" className="flex-1 whitespace-nowrap text-xs sm:text-sm">Answers</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 whitespace-nowrap text-xs sm:text-sm">Reviews ({paper.reviews.length})</TabsTrigger>
                <TabsTrigger value="faq" className="flex-1 whitespace-nowrap text-xs sm:text-sm">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="inside">
                <Card className="mt-4 p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      `Complete ${paper.examSitting} exam paper (past & mock)`,
                      "Tutor-written model answers with workings",
                      "Full syllabus notes aligned to KASNEB",
                      "Revision kit — past 5 sittings",
                      "Chapter summaries + formula sheets",
                      "Instant PDF, works offline on phone & laptop",
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="answers">
                <Card className="mt-4 overflow-hidden">
                  <div className="border-b border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Model answer — Question 1(a)
                  </div>
                  <div className="bg-[#fdfcf7] p-6 font-serif text-[13px] leading-relaxed text-[#1a1a1a]">
                    <p><b>Financial accounting</b> is concerned with the preparation of general-purpose
                      financial statements — the statement of profit or loss, statement of financial position
                      and statement of cash flows — for use by <i>external</i> users (shareholders, lenders,
                      KRA, regulators). It is governed by IFRS/IAS and produces reports at fixed intervals.</p>
                    <p className="mt-3"><b>Management accounting</b>, on the other hand, provides information
                      to <i>internal</i> users (mainly management) to support planning, control and
                      decision-making. It is not bound by external reporting standards, is forward-looking
                      (budgets, forecasts, variance analysis) and is prepared as frequently as management
                      requires.</p>
                    <p className="mt-3 text-muted-foreground">— preview truncated. Buy to unlock all 47 solved questions.</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="mt-4 space-y-3">
                  {paper.reviews.map((r: (typeof paper.reviews)[number], i: number) => (
                    <Card key={i} className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                            {r.author.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{r.author}</div>
                            <div className="text-[11px] text-muted-foreground">{r.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: r.rating }).map((_, k) => (
                            <Star key={k} className="h-3.5 w-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{r.body}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faq">
                <Card className="mt-4 divide-y divide-border p-0">
                  {[
                    ["How do I get the file after paying?", "You receive an instant download link on the confirmation page and by email the moment M-Pesa confirms."],
                    ["Which sitting does this cover?", `${paper.examSitting}. Future updates for this sitting are free.`],
                    ["Can I read on my phone?", "Yes — PDF works on any phone, tablet or laptop, online or offline."],
                    ["Is payment secure?", "Yes — 256-bit SSL encrypted checkout, paid securely with M-Pesa."],
                  ].map(([q, a]) => (
                    <details key={q} className="group p-4">
                      <summary className="cursor-pointer list-none font-medium">
                        <span className="mr-2 text-brand">＋</span>{q}
                      </summary>
                      <p className="mt-2 pl-6 text-sm text-muted-foreground">{a}</p>
                    </details>
                  ))}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Purchase sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden p-0 shadow-card">
              <div className="border-b border-border bg-surface px-6 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-extrabold text-brand">
                    KSh {paper.price.toLocaleString()}
                  </span>
                  {paper.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      KSh {paper.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="mt-1 text-xs font-semibold text-sale">
                    You save KSh {(paper.originalPrice! - paper.price).toLocaleString()} ({discount}% off)
                  </div>
                )}
              </div>

              <div className="p-6">
                <Button
                  className="w-full bg-brand text-primary-foreground hover:brightness-110"
                  size="lg"
                  onClick={() => {
                    addToCart(paper.id);
                    navigate({ to: "/checkout" });
                  }}
                >
                  Buy now — pay with M-Pesa
                </Button>
                <Button
                  variant="outline"
                  className="mt-2 w-full border-brand/30"
                  onClick={() => {
                    addToCart(paper.id);
                    toast.success("Added to cart");
                  }}
                >
                  Add to cart
                </Button>

                <div className="mt-5 space-y-2 rounded-lg bg-surface/60 p-3 text-xs">
                  <div className="flex items-center gap-2"><Download className="h-3.5 w-3.5 text-brand" /> Instant PDF download</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-brand" /> 256-bit SSL secure checkout</div>
                  <div className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-brand" /> Free updates this sitting</div>
                  <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-brand" /> 240 pages · notes + answers</div>
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-brand" /> Covers <b>{paper.examSitting}</b> sitting</div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-white">
                    <Lock className="h-3 w-3" /> Pay with M-Pesa
                  </span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
