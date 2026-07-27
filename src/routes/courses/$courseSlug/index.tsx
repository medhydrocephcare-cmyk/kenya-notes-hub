import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { getCourse, getLevelsForCourse, getPapersForLevel } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/courses/$courseSlug/")({
  loader: ({ params }) => {
    const course = getCourse(params.courseSlug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.name} — Notes & past papers | Chapa Notes` },
          { name: "description", content: `${loaderData.course.name} (${loaderData.course.code}) notes, revision kits and past-paper answers organised by level.` },
          { property: "og:title", content: `${loaderData.course.name} — Chapa Notes` },
          { property: "og:description", content: loaderData.course.description },
        ]
      : [{ title: "Course not found" }, { name: "robots", content: "noindex" }],
  }),
  component: CourseLevels,
});

function CourseLevels() {
  const { course } = Route.useLoaderData();
  const levels = getLevelsForCourse(course.slug);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="text-xs text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">Courses</Link>
          <span className="mx-2">/</span>
          <span>{course.code}</span>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{course.name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{course.description}</p>

        <h2 className="mt-10 text-lg font-semibold">Levels</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((lv) => {
            const count = getPapersForLevel(course.slug, lv.slug).length;
            return (
              <Link
                key={lv.slug}
                to="/courses/$courseSlug/$levelSlug"
                params={{ courseSlug: course.slug, levelSlug: lv.slug }}
              >
                <Card className="flex items-center justify-between p-5 transition hover:border-primary/40 hover:shadow-md">
                  <div>
                    <div className="font-medium">{lv.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{count} papers available</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
