import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { getCourse, getLevel } from "@/lib/data";
import { allPapersQueryOptions, papersByLevel } from "@/lib/papers.functions";
import { SITE } from "@/lib/site-config";
import { ChevronRight, LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/courses/$courseSlug/$levelSlug/")({
  loader: ({ params, context }) => {
    const course = getCourse(params.courseSlug);
    const level = getLevel(params.courseSlug, params.levelSlug);
    if (!course || !level) throw notFound();
    context.queryClient.ensureQueryData(allPapersQueryOptions);
    return { course, level };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.code} ${loaderData.level.name} — Notes & past papers | ${SITE.name}` },
          { name: "description", content: `${loaderData.course.name} ${loaderData.level.name} notes, revision kits and past-paper answers. Free preview on every paper.` },
          { property: "og:title", content: `${loaderData.course.code} ${loaderData.level.name} — ${SITE.name}` },
          { property: "og:description", content: `Papers, notes and answers for ${loaderData.course.name} ${loaderData.level.name}.` },
        ]
      : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-8 text-sm text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-8 text-sm">Level not found.</div>
  ),
  component: LevelPapers,
});

function LevelPapers() {
  const { course, level } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(allPapersQueryOptions);
  const papers = papersByLevel(all, course.slug, level.slug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/70">
            <Link to="/courses" className="hover:text-white">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/courses/$courseSlug" params={{ courseSlug: course.slug }} className="hover:text-white">
              {course.code}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{level.name}</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-gold px-3 py-1.5 font-display text-sm font-extrabold text-gold-foreground">
              {course.code}
            </span>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">{level.name}</h1>
          </div>
          <p className="mt-3 text-white/85">
            {papers.length} product{papers.length === 1 ? "" : "s"} • Free preview on every paper
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <CategorySidebar activeCourse={course.slug} />
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm shadow-card">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayoutGrid className="h-4 w-4" />
                <b className="text-foreground">{papers.length}</b> product{papers.length === 1 ? "" : "s"}
              </div>
            </div>

            {papers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No papers published for this level yet — check back soon.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {papers.map((p) => (
                  <ProductCard key={p.id} paper={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
