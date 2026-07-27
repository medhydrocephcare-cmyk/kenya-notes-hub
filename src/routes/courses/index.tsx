import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CategorySidebar } from "@/components/category-sidebar";
import { ProductCard } from "@/components/product-card";
import { papers, courses } from "@/lib/data";
import { LayoutGrid } from "lucide-react";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Shop all KASNEB & KNEC papers — Kasneb Pastpapers" },
      { name: "description", content: "Browse every KASNEB and KNEC paper, note and revision kit. CPA, ATD, CS, CIFA, CCP, CICT and more. Free preview on every product." },
      { property: "og:title", content: "All KASNEB & KNEC papers — Kasneb Pastpapers" },
      { property: "og:description", content: "Notes, revision kits and past-paper answers organised by course and level." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Page header */}
      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-gold">Shop</div>
          <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">All courses &amp; papers</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            {papers.length} products across {courses.length} KASNEB courses. Every product has a free answer preview.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm shadow-card">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LayoutGrid className="h-4 w-4" />
                Showing <b className="text-foreground">{papers.length}</b> results
              </div>
              <select className="rounded-md border border-border bg-background px-2 py-1.5 text-xs">
                <option>Sort: Popularity</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {papers.map((p) => (
                <ProductCard key={p.id} paper={p} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
