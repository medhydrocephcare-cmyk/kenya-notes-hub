import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategorySidebar } from "@/components/category-sidebar";
import { getCourse, getLevelsForCourse } from "@/lib/data";
import { allPapersQueryOptions } from "@/lib/papers.queries";
import { papersByLevel } from "@/lib/paper-catalog";
import { SITE, SITE_URL } from "@/lib/site-config";
import { keywords, socialImageMeta } from "@/lib/seo";
import { ChevronRight, FileText, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/courses/$courseSlug/")({
  loader: ({ params, context }) => {
    const course = getCourse(params.courseSlug);
    if (!course) throw notFound();
    context.queryClient.ensureQueryData(allPapersQueryOptions);
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.code} Past Papers with Answers, Notes & Revision Kits` },
          { name: "description", content: `Download ${loaderData.course.code} (${loaderData.course.name}) KASNEB past papers with model answers, updated notes and revision kits for every level. Free preview, instant PDF, M-Pesa checkout.` },
          { name: "keywords", content: keywords(
            `${loaderData.course.code.toLowerCase()} past papers`,
            `${loaderData.course.code.toLowerCase()} past papers with answers`,
            `${loaderData.course.code.toLowerCase()} notes pdf`,
            `${loaderData.course.code.toLowerCase()} revision kit`,
            `${loaderData.course.name.toLowerCase()} kasneb`,
          ) },
          { property: "og:title", content: `${loaderData.course.code} past papers with answers — ${SITE.name}` },
          { property: "og:description", content: loaderData.course.description },
          { property: "og:type", content: "website" },
          { property: "og:url", content: `${SITE_URL}/courses/${loaderData.course.slug}` },
          { name: "twitter:card", content: "summary_large_image" },
          ...socialImageMeta(),
        ]
      : [{ title: "Course not found" }, { name: "robots", content: "noindex" }],
    links: loaderData ? [{ rel: "canonical", href: `${SITE_URL}/courses/${loaderData.course.slug}` }] : undefined,
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
                { "@type": "ListItem", position: 3, name: loaderData.course.code, item: `${SITE_URL}/courses/${loaderData.course.slug}` },
              ],
            }),
          },
        ]
      : undefined,
  }),

  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-sm">Course not found.</div>
  ),
  component: CourseLevels,
});

function CourseLevels() {
  const { course } = Route.useLoaderData();
  const { data: papers } = useSuspenseQuery(allPapersQueryOptions);
  const levels = getLevelsForCourse(course.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/70">
            <Link to="/courses" className="hover:text-white">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{course.code}</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-gold px-3 py-1.5 font-display text-sm font-extrabold text-gold-foreground">
              {course.code}
            </span>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">{course.name}</h1>
          </div>
          <p className="mt-3 max-w-2xl text-white/85">{course.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <CategorySidebar activeCourse={course.slug} />
          </div>

          <div>
            <h2 className="font-display text-2xl font-extrabold">Pick a level</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {levels.length} levels available in {course.code}. Each level lists every paper.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {levels.map((lv, i) => {
                const count = papersByLevel(papers, course.slug, lv.slug).length;
                return (
                  <Link
                    key={lv.slug}
                    to="/courses/$courseSlug/$levelSlug"
                    params={{ courseSlug: course.slug, levelSlug: lv.slug }}
                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card"
                  >
                    <div
                      aria-hidden
                      className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-60 blur-2xl ${
                        ["bg-emerald-300", "bg-amber-300", "bg-sky-300", "bg-rose-300", "bg-violet-300", "bg-cyan-300"][i % 6]
                      }`}
                    />
                    <div className="relative flex items-start gap-4">
                      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-brand-gradient text-primary-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-lg font-bold">{lv.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {count} paper{count === 1 ? "" : "s"} • Notes, revision kits &amp; model answers
                        </div>
                        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                          View papers <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
