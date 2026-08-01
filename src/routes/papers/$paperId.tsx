import { createFileRoute, Link, notFound, redirect, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCourse, getLevel } from "@/lib/data";
import { getPaperIndexContent, getPaperReviewsSummary } from "@/lib/papers.functions";
import { allPapersQueryOptions } from "@/lib/papers.queries";
import { findPaper, sittingLabel } from "@/lib/paper-catalog";
import { SITE, SITE_URL } from "@/lib/site-config";
import { digitalOffer } from "@/lib/product-schema";
import { subjectImageFor } from "@/lib/subject-image";
import { keywords } from "@/lib/seo";



import { paperPath, paperUrlParam } from "@/lib/paper-slugs";
import {
  Download,
  ShieldCheck,
  Calendar,
  RefreshCw,
  FileText,
  CheckCircle2,
  Lock,
  BookOpen,
  Clock,
  HardDrive,
} from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import { PaperReviewsBlock } from "@/components/paper-reviews";

export const Route = createFileRoute("/papers/$paperId")({
  loader: async ({ params, context }) => {
    const papers = await context.queryClient.ensureQueryData(allPapersQueryOptions);
    const paper = findPaper(papers, params.paperId);
    if (!paper) throw notFound();
    const canonicalParam = paperUrlParam(paper);
    if (params.paperId !== canonicalParam) {
      throw redirect({ to: "/papers/$paperId", params: { paperId: canonicalParam }, replace: true });
    }
    const course = getCourse(paper.courseSlug);
    const level = getLevel(paper.courseSlug, paper.levelSlug);
    if (!course || !level) throw notFound();
    // Fetch preview text + reviews in parallel instead of sequentially (faster TTFB).
    const [rawPreviewText, reviewsSummary] = await Promise.all([
      getPaperIndexContent({ data: { paperId: paper.id } }),
      getPaperReviewsSummary({ data: { paperId: paper.id } }),
    ]);
    // Cap indexed text so the SSR payload stays small; crawlers only need a sample.
    const previewText = rawPreviewText ? rawPreviewText.slice(0, 8000) : "";
    const canonicalPath = paperPath(paper);
    // Google Merchant listings require an `image` on every Product — always resolve one.
    const rawImage = paper.thumbnailUrl?.startsWith("https://")
      ? paper.thumbnailUrl
      : `${SITE_URL}${subjectImageFor(paper.title, paper.courseSlug)}`;
    return {
      paperId: paper.id,
      canonicalPath,
      course,
      level,
      seoTitle: paper.title,
      seoDesc: paper.description,
      price: paper.price,
      thumbnailUrl: paper.thumbnailUrl,
      imageUrl: rawImage,
      previewText,
      reviewsSummary,
    };

  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.seoTitle} — ${loaderData.course.code} ${loaderData.level.name} past papers & answers` },
          { name: "description", content: `${loaderData.seoDesc} Free preview. Instant PDF download. Pay securely with M-Pesa.` },
          { property: "og:title", content: `${loaderData.seoTitle} — ${SITE.name}` },
          { property: "og:description", content: loaderData.seoDesc },
          { property: "og:type", content: "product" },
          { property: "og:url", content: `${SITE_URL}${loaderData.canonicalPath}` },
          { name: "twitter:card", content: "summary_large_image" },
          { property: "og:image", content: loaderData.imageUrl },
          { property: "og:image:alt", content: loaderData.seoTitle },
          { name: "twitter:image", content: loaderData.imageUrl },
          { name: "keywords", content: keywords(
            loaderData.seoTitle.toLowerCase(),
            `${loaderData.course.code.toLowerCase()} ${loaderData.level.name.toLowerCase()} past papers`,
            `${loaderData.course.code.toLowerCase()} past papers with answers pdf`,
          ) },


        ]
      : [{ title: "Paper not found" }, { name: "robots", content: "noindex" }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: loaderData.seoTitle,
              description: loaderData.seoDesc,
              category: `${loaderData.course.code} ${loaderData.level.name} study material`,
              image: [loaderData.imageUrl],
              brand: { "@type": "Brand", name: SITE.name },
              offers: digitalOffer({
                price: loaderData.price,
                url: `${SITE_URL}${loaderData.canonicalPath}`,
              }),

              ...(loaderData.reviewsSummary
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: loaderData.reviewsSummary.ratingValue,
                      reviewCount: loaderData.reviewsSummary.ratingCount,
                      bestRating: 5,
                      worstRating: 1,
                    },
                    review: loaderData.reviewsSummary.reviews.map((r) => ({
                      "@type": "Review",
                      author: { "@type": "Person", name: r.author },
                      datePublished: r.createdAt,
                      reviewBody: r.comment,
                      reviewRating: {
                        "@type": "Rating",
                        ratingValue: r.rating,
                        bestRating: 5,
                        worstRating: 1,
                      },
                    })),
                  }
                : {}),
            }),
          },
          ...(loaderData.previewText
            ? [
                {
                  type: "application/ld+json",
                  children: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: loaderData.seoTitle,
                    description: loaderData.seoDesc,
                    articleBody: loaderData.previewText.slice(0, 5000),
                    inLanguage: "en-KE",
                    isAccessibleForFree: false,
                    hasPart: {
                      "@type": "WebPageElement",
                      isAccessibleForFree: false,
                      cssSelector: "#full-content-paywall",
                    },
                    about: `${loaderData.course.code} ${loaderData.level.name}`,
                    url: `${SITE_URL}${loaderData.canonicalPath}`,
                  }),
                },
              ]
            : []),
        ]
      : undefined,
    links: loaderData ? [{ rel: "canonical", href: `${SITE_URL}${loaderData.canonicalPath}` }] : undefined,
  }),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-sm">Paper not found.</div>
  ),
  component: PaperDetail,
});

function formatBytes(bytes?: number) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${Math.round(bytes / 1024)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function PaperDetail() {
  const { paperId, course, level, previewText } = Route.useLoaderData();
  const { data: papers } = useSuspenseQuery(allPapersQueryOptions);
  const paper = findPaper(papers, paperId);
  const navigate = useNavigate();

  if (!paper) {
    return <div className="grid min-h-screen place-items-center p-8 text-sm">Paper no longer available.</div>;
  }

  const discount = paper.originalPrice
    ? Math.round(((paper.originalPrice - paper.price) / paper.originalPrice) * 100)
    : 0;
  const sitting = sittingLabel(paper);
  const size = formatBytes(paper.fileSize);
  const canBuy = paper.downloadAvailable !== false;
  const indexedPreviewText = previewText || paper.previewText;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

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
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand text-primary-foreground hover:bg-brand">{course.code}</Badge>
              <Badge variant="outline">{level.name}</Badge>
              {paper.category && paper.category !== "notes" && (
                <Badge variant="secondary" className="capitalize">{paper.category}</Badge>
              )}
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
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Updated {paper.lastUpdated}
              </span>
              {paper.pages ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" /> {paper.pages} pages
                </span>
              ) : null}
              {size ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <HardDrive className="h-3.5 w-3.5" /> {size}
                </span>
              ) : null}
              {paper.downloadCount ? (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Download className="h-3.5 w-3.5" /> {paper.downloadCount.toLocaleString()} downloads
                </span>
              ) : null}
            </div>

            {paper.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{paper.description}</p>
            )}

            {/* Preview panel */}
            <div className="mt-5 overflow-hidden rounded-xl border border-border shadow-card sm:mt-6">
              <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 text-[11px] sm:px-4 sm:py-2.5 sm:text-xs">
                <div className="flex min-w-0 items-center gap-1.5 font-medium text-muted-foreground">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-brand" />
                  <span className="truncate">Sample from {sitting}</span>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {paper.previewAvailable ? "Free preview" : "Preview coming soon"}
                </span>
              </div>

              <div className="relative overflow-hidden bg-[#fdfcf7] px-3 py-4 font-serif text-[11.5px] leading-relaxed text-[#1a1a1a] sm:px-8 sm:py-6 sm:text-[13.5px]">
                <div className="mx-auto max-w-2xl border-b-2 border-[#1a1a1a] pb-3 text-center sm:pb-4">
                  <div className="break-words text-[8.5px] font-bold uppercase leading-snug tracking-[0.06em] text-[#1a1a1a] sm:text-[11px] sm:tracking-[0.25em]">
                    Kenya Accountants and Secretaries National Examinations Board
                  </div>
                  <div className="mt-2 break-words font-sans text-[13px] font-extrabold uppercase leading-tight tracking-wider sm:mt-3 sm:text-lg">
                    {course.code} — {level.name.toUpperCase()}
                  </div>
                  <div className="mt-1 break-words text-[11px] font-semibold uppercase leading-snug sm:text-sm">{paper.title}</div>
                  <div className="mt-2 flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-[9.5px] font-semibold uppercase tracking-wide sm:mt-3 sm:text-[11px]">
                    <span className="truncate">{sitting}</span>
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
                    A sample question from the full paper is shown here. Buy to unlock the entire booklet
                    together with tutor-written model answers and workings.
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fdfcf7] via-[#fdfcf7]/90 to-transparent" />
              </div>


              <div className="border-t border-border bg-surface/80 px-4 py-4 text-center backdrop-blur">
                <div className="flex flex-col items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Full paper + model answers unlock after purchase
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {paper.pages ? `${paper.pages}-page PDF` : "PDF"} · works offline
                    {paper.syllabusVersion ? ` · syllabus ${paper.syllabusVersion}` : ""}
                  </div>
                </div>
              </div>
            </div>

            {indexedPreviewText && (
              <section
                id="full-content-paywall"
                aria-label="Indexed content preview"
                className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-card"
              >
                <header className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2.5 text-xs">
                  <div className="flex min-w-0 items-center gap-1.5 font-medium text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-brand" />
                    <span className="truncate">Content from this document</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Read-only excerpt
                  </span>
                </header>
                <div className="relative max-h-[520px] overflow-hidden px-4 py-5 sm:px-6 sm:py-6">
                  <article className="prose prose-sm max-w-none whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground/90 selection:bg-brand/10">
                    {indexedPreviewText}
                  </article>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-card via-card/90 to-transparent" />
                </div>
                <footer className="flex flex-col items-center gap-1 border-t border-border bg-surface/80 px-4 py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    Full PDF + model answers unlock after purchase
                  </div>
                  <p className="max-w-md text-[11px] leading-relaxed text-muted-foreground">
                    You can read and search this excerpt for free. Download of the complete file is
                    reserved for buyers.
                  </p>
                </footer>
              </section>
            )}



            <Tabs defaultValue="inside" className="mt-8">
              <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/40 p-1">
                <TabsTrigger value="inside" className="flex-1 whitespace-nowrap text-xs sm:text-sm">Inside</TabsTrigger>
                <TabsTrigger value="details" className="flex-1 whitespace-nowrap text-xs sm:text-sm">Details</TabsTrigger>
                <TabsTrigger value="faq" className="flex-1 whitespace-nowrap text-xs sm:text-sm">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="inside">
                <Card className="mt-4 p-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      `Complete ${sitting} paper`,
                      "Tutor-written model answers with workings",
                      "Full syllabus notes aligned to KASNEB",
                      "Chapter summaries + formula sheets",
                      "Instant PDF, works offline on phone & laptop",
                      "Free updates for this sitting",
                    ].map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card className="mt-4 p-6 text-sm">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <DetailRow label="Course" value={`${course.code} — ${course.name}`} />
                    <DetailRow label="Level" value={level.name} />
                    <DetailRow label="Category" value={paper.category ?? "—"} />
                    <DetailRow label="Sitting" value={sitting} />
                    <DetailRow label="Pages" value={paper.pages ? String(paper.pages) : "—"} />
                    <DetailRow label="File size" value={size ?? "—"} />
                    <DetailRow label="Syllabus version" value={paper.syllabusVersion ?? "—"} />
                    <DetailRow label="Last updated" value={paper.lastUpdated} />
                    <DetailRow label="Downloads" value={(paper.downloadCount ?? 0).toLocaleString()} />
                    <DetailRow label="Preview" value={paper.previewAvailable ? "Available" : "Coming soon"} />
                  </dl>
                  {paper.tags && paper.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {paper.tags.map((t) => (
                        <span key={t} className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="faq">
                <Card className="mt-4 divide-y divide-border p-0">
                  {[
                    ["How do I get the file after paying?", "You receive an instant download link on the confirmation page and by email the moment M-Pesa confirms."],
                    ["Which sitting does this cover?", `${sitting}. Future updates for this sitting are free.`],
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
                    You save KSh {((paper.originalPrice ?? paper.price) - paper.price).toLocaleString()} ({discount}% off)
                  </div>
                )}
              </div>

              <div className="p-6">
                <Button
                  className="w-full bg-brand text-primary-foreground hover:brightness-110"
                  size="lg"
                  disabled={!canBuy}
                  onClick={() => {
                    if (!canBuy) return toast.info("This file is still being prepared for download");
                    addToCart(paper, { openDrawer: false });
                    navigate({ to: "/checkout" });
                  }}
                >
                  {canBuy ? "Buy now — pay with M-Pesa" : "File processing"}
                </Button>
                <Button
                  variant="outline"
                  className="mt-2 w-full border-brand/30"
                  disabled={!canBuy}
                  onClick={() => {
                    if (!canBuy) return toast.info("This file is still being prepared for download");
                    addToCart(paper);
                    toast.success("Added to cart");
                  }}
                >
                  {canBuy ? "Add to cart" : "Not ready yet"}
                </Button>

                <div className="mt-5 space-y-2 rounded-lg bg-surface/60 p-3 text-xs">
                  <div className="flex items-center gap-2"><Download className="h-3.5 w-3.5 text-brand" /> {canBuy ? "Instant PDF download" : "Download file still processing"}</div>
                  <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-brand" /> 256-bit SSL secure checkout</div>
                  <div className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-brand" /> Free updates this sitting</div>
                  {paper.pages ? (
                    <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-brand" /> {paper.pages} pages{size ? ` · ${size}` : ""}</div>
                  ) : null}
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-brand" /> {sitting}</div>
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

        <PaperReviewsBlock paperId={paper.id} paperTitle={paper.title} />
      </div>

      <SiteFooter />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  );
}
