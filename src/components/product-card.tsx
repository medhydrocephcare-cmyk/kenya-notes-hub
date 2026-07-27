import { Link } from "@tanstack/react-router";
import { Star, Eye, ShoppingCart, Check, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart, isInCart } from "@/lib/cart";
import { toast } from "sonner";
import { useSyncExternalStore } from "react";
import type { Paper } from "@/lib/data";
import { getCourse } from "@/lib/data";
import { subjectImageFor } from "@/lib/subject-image";


/** Subtle course palette used by the thumbnail. */
const COURSE_TINT: Record<string, { bg: string; ring: string; icon: string }> = {
  cpa:  { bg: "from-emerald-500 to-emerald-700",  ring: "ring-emerald-600/30",  icon: "text-emerald-50" },
  atd:  { bg: "from-sky-500 to-sky-700",          ring: "ring-sky-600/30",      icon: "text-sky-50" },
  cs:   { bg: "from-violet-500 to-violet-700",    ring: "ring-violet-600/30",   icon: "text-violet-50" },
  cifa: { bg: "from-amber-500 to-amber-700",      ring: "ring-amber-600/30",    icon: "text-amber-50" },
  ccp:  { bg: "from-rose-500 to-rose-700",        ring: "ring-rose-600/30",     icon: "text-rose-50" },
  cict: { bg: "from-cyan-500 to-cyan-700",        ring: "ring-cyan-600/30",     icon: "text-cyan-50" },
  dcm:  { bg: "from-pink-500 to-pink-700",        ring: "ring-pink-600/30",     icon: "text-pink-50" },
  dict: { bg: "from-teal-500 to-teal-700",        ring: "ring-teal-600/30",     icon: "text-teal-50" },
  fab:  { bg: "from-lime-500 to-lime-700",        ring: "ring-lime-600/30",     icon: "text-lime-50" },
};

export function ProductCard({ paper }: { paper: Paper }) {
  const course = getCourse(paper.courseSlug);
  const tint = COURSE_TINT[paper.courseSlug] ?? COURSE_TINT.cpa;
  const discount = paper.originalPrice
    ? Math.round(((paper.originalPrice - paper.price) / paper.originalPrice) * 100)
    : 0;

  // Reactive in-cart state
  const inCart = useSyncExternalStore(
    (cb) => {
      const onStorage = () => cb();
      window.addEventListener("storage", onStorage);
      // rely on cart internal emit via storage event fallback + micro-poll
      const t = setInterval(cb, 500);
      return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
    },
    () => (isInCart(paper.id) ? "1" : "0"),
    () => "0",
  ) === "1";

  const shortTitle = paper.title.split("—")[0].trim();
  const cover = subjectImageFor(paper.title, paper.courseSlug);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card">
      <Link
        to="/papers/$paperId"
        params={{ paperId: paper.id }}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        {/* Subject photo */}
        <img
          src={cover}
          alt={shortTitle}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        {/* Color wash for readability + brand */}
        <div className={`absolute inset-0 bg-gradient-to-br ${tint.bg} opacity-55 mix-blend-multiply`} />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative flex h-full flex-col p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-white/25 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider backdrop-blur">
              {course?.code}
            </span>
            <span className="rounded-md bg-black/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
              {paper.levelSlug.replace(/-/g, " ")}
            </span>
          </div>

          <div className="mt-auto">
            <div className="line-clamp-3 font-display text-[15px] font-extrabold leading-tight drop-shadow-md">
              {shortTitle}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/85">
              {paper.examSitting} · KASNEB
            </div>
          </div>
        </div>

        {discount > 0 && (
          <div className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white text-[11px] font-black text-sale shadow-lg">
            -{discount}%
          </div>
        )}
        {paper.bundleType && paper.bundleType !== "single" && (
          <div className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-foreground shadow">
            <Layers className="h-3 w-3" /> {paper.bundleType} bundle
          </div>
        )}
      </Link>

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
          <h3 className="line-clamp-2 min-h-[2.6rem] text-sm font-semibold leading-snug transition group-hover:text-brand">
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
            className={`flex-1 gap-1.5 ${inCart ? "bg-emerald-600 hover:bg-emerald-700" : "bg-brand hover:brightness-110"}`}
            onClick={() => {
              if (inCart) return toast.info("Already in your cart");
              addToCart(paper.id);
              toast.success("Added to cart");
            }}
          >
            {inCart ? (<><Check className="h-3.5 w-3.5" /> In cart</>) : (<><ShoppingCart className="h-3.5 w-3.5" /> Add</>)}
          </Button>
        </div>
      </div>
    </div>
  );
}
