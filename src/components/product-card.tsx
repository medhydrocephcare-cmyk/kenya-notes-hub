import { Link } from "@tanstack/react-router";
import { Star, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import type { Paper } from "@/lib/data";
import { getCourse } from "@/lib/data";
import { subjectImageFor } from "@/lib/subject-image";

export function ProductCard({ paper }: { paper: Paper }) {
  const course = getCourse(paper.courseSlug);
  const discount = paper.originalPrice
    ? Math.round(((paper.originalPrice - paper.price) / paper.originalPrice) * 100)
    : 0;
  const cover = subjectImageFor(paper.title, paper.courseSlug);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
      {/* Thumbnail */}
      <Link
        to="/papers/$paperId"
        params={{ paperId: paper.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-surface"
      >
        <img
          src={cover}
          alt={paper.title}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow">
          {course?.code}
        </div>
        <div className="absolute inset-x-3 bottom-3 line-clamp-2 font-display text-sm font-bold leading-tight text-white drop-shadow">
          {paper.title.split("—")[0]}
        </div>

        {discount > 0 && (
          <div className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-sale text-[11px] font-black text-white shadow-lg">
            -{discount}%
          </div>
        )}
        {paper.bundleType && paper.bundleType !== "single" && (
          <div className="absolute right-3 bottom-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow">
            {paper.bundleType} bundle
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1.5 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-semibold">{paper.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({paper.reviews.length})</span>
          <span className="ml-auto text-[10px] font-medium text-muted-foreground">
            {paper.examSitting}
          </span>
        </div>
        <Link to="/papers/$paperId" params={{ paperId: paper.id }}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition group-hover:text-brand">
            {paper.title}
          </h3>
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-brand">KSh {paper.price.toLocaleString()}</span>
          {paper.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              KSh {paper.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Link to="/papers/$paperId" params={{ paperId: paper.id }} className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-1.5 border-brand/20">
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
          </Link>
          <Button
            size="sm"
            className="flex-1 gap-1.5 bg-brand hover:brightness-110"
            onClick={() => {
              addToCart(paper.id);
              toast.success("Added to cart");
            }}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
