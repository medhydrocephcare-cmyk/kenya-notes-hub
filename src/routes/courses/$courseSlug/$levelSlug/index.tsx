import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCourse, getLevel, getPapersForLevel } from "@/lib/data";
import { Star, Eye } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/courses/$courseSlug/$levelSlug/")({
  loader: ({ params }) => {
    const course = getCourse(params.courseSlug);
    const level = getLevel(params.courseSlug, params.levelSlug);
    if (!course || !level) throw notFound();
    return { course, level };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.course.code} ${loaderData.level.name} — Notes & past papers` },
          { name: "description", content: `${loaderData.course.name} ${loaderData.level.name} notes, revision kits and past-paper answers. Free preview on every paper.` },
          { property: "og:title", content: `${loaderData.course.code} ${loaderData.level.name} — Chapa Notes` },
          { property: "og:description", content: `Papers, notes and answers for ${loaderData.course.name} ${loaderData.level.name}.` },
        ]
      : [{ title: "Not found" }, { name: "robots", content: "noindex" }],
  }),
  component: LevelPapers,
});

function LevelPapers() {
  const { course, level } = Route.useLoaderData();
  const papers = getPapersForLevel(course.slug, level.slug);
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <nav className="text-xs text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">Courses</Link>
          <span className="mx-2">/</span>
          <Link to="/courses/$courseSlug" params={{ courseSlug: course.slug }} className="hover:text-foreground">
            {course.code}
          </Link>
          <span className="mx-2">/</span>
          <span>{level.name}</span>
        </nav>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {course.code} {level.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {papers.length} paper{papers.length === 1 ? "" : "s"} available. Each product includes a free answer preview.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((p) => (
            <Card key={p.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{p.rating.toFixed(1)}</span>
                </div>
                {p.bundleType && p.bundleType !== "single" && (
                  <Badge variant="secondary" className="capitalize">{p.bundleType} bundle</Badge>
                )}
              </div>
              <Link to="/papers/$paperId" params={{ paperId: p.id }} className="mt-3">
                <div className="font-semibold leading-snug hover:text-primary">{p.title}</div>
              </Link>
              <div className="mt-1 text-xs text-muted-foreground">
                {p.examSitting} • updated {p.lastUpdated}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-lg font-semibold">KSh {p.price}</span>
                {p.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">KSh {p.originalPrice}</span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/papers/$paperId" params={{ paperId: p.id }} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    addToCart(p.id);
                    toast.success("Added to cart");
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
