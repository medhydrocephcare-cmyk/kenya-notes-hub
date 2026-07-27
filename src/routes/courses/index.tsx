import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { courses, countPapersInCourse } from "@/lib/data";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "All courses — Chapa Notes" },
      { name: "description", content: "Browse every KASNEB and KNEC course we cover: CPA, ATD, CS, CIFA, CCP, CICT and more." },
      { property: "og:title", content: "All KASNEB & KNEC courses — Chapa Notes" },
      { property: "og:description", content: "Notes and past-paper answers organised by course and level." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">All courses</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pick a course to see its levels and papers.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link key={c.slug} to="/courses/$courseSlug" params={{ courseSlug: c.slug }}>
              <Card className={`h-full bg-gradient-to-br ${c.color} p-6 transition hover:shadow-md`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-md bg-background/80 px-2 py-1 font-medium">{c.code}</span>
                  <span className="text-muted-foreground">{countPapersInCourse(c.slug)} papers</span>
                </div>
                <div className="mt-4 text-lg font-semibold">{c.name}</div>
                <div className="mt-2 text-sm text-muted-foreground">{c.description}</div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
