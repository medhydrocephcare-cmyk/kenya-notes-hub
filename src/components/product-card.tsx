import { Link } from "@tanstack/react-router";
import { Star, Eye, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import { toast } from "sonner";
import type { Paper } from "@/lib/data";
import { getCourse } from "@/lib/data";

export function ProductCard({ paper }: { paper: Paper }) {
  const course = getCourse(paper.courseSlug);
  const discount = paper.originalPrice
    ? Math.round(((paper.originalPrice - paper.price) / paper.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card">
      {/* Thumbnail */}
      <Link
        to="/papers/$paperId"
        params={{ paperId: paper.id }}
        className="relative block aspect-[4/3] overflow-hidden bg-brand-gradient"
      >
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
          backgroundSize: "24px 24px, 32px 32px",
        }} />
        <div className="relative flex h-full flex-col justify-between p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
              {course?.code}
            </span>
            <FileText className="h-5 w-5 opacity-70" />
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Notes • Kit • Answers</div>
            <div className="mt-1 line-clamp-2 font-display text-base font-bold leading-tight">
              {paper.title.split("—")[0]}
            </div>
          </div>
        </div>

        {discount > 0 && (
          <div className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-sale text-xs font-black text-white shadow-lg">
            -{discount}%
          </div>
        )}
        {paper.bundleType && paper.bundleType !== "single" && (
          <div className="absolute left-3 bottom-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground">
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
