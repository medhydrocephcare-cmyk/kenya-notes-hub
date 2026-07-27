import { Link } from "@tanstack/react-router";
import { courses, countPapersInCourse, getLevelsForCourse, getPapersForLevel } from "@/lib/data";
import { ChevronRight } from "lucide-react";

export function CategorySidebar({ activeCourse }: { activeCourse?: string }) {
  return (
    <aside className="rounded-2xl border border-border/60 bg-card shadow-card">
      <div className="rounded-t-2xl bg-brand-gradient px-5 py-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-primary-foreground/80">
          Shop by course
        </div>
        <div className="mt-1 font-display text-lg font-extrabold text-primary-foreground">
          All categories
        </div>
      </div>
      <ul className="p-2">
        {courses.map((c) => {
          const active = activeCourse === c.slug;
          const levels = getLevelsForCourse(c.slug);
          return (
            <li key={c.slug}>
              <Link
                to="/courses/$courseSlug"
                params={{ courseSlug: c.slug }}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                  active ? "bg-brand/10 font-semibold text-brand" : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`grid h-7 w-7 place-items-center rounded-md text-[10px] font-bold ${
                    active ? "bg-brand text-primary-foreground" : "bg-muted text-brand"
                  }`}>
                    {c.code}
                  </span>
                  <span>{c.name.split(" ").slice(0, 2).join(" ")}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  ({countPapersInCourse(c.slug)}) <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
              {active && (
                <ul className="mb-2 ml-10 border-l border-border pl-3">
                  {levels.map((lv) => {
                    const n = getPapersForLevel(c.slug, lv.slug).length;
                    return (
                      <li key={lv.slug}>
                        <Link
                          to="/courses/$courseSlug/$levelSlug"
                          params={{ courseSlug: c.slug, levelSlug: lv.slug }}
                          className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground transition hover:text-brand"
                        >
                          <span>{lv.name}</span>
                          <span>({n})</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Promo block */}
      <div className="m-3 overflow-hidden rounded-xl bg-gold-gradient p-5 text-gold-foreground">
        <div className="text-[10px] font-bold uppercase tracking-wider">Save 40%</div>
        <div className="mt-1 font-display text-lg font-extrabold leading-tight">
          Full course bundles for the August sitting
        </div>
        <Link
          to="/courses"
          className="mt-3 inline-flex rounded-full bg-brand-dark px-3 py-1.5 text-xs font-bold text-primary-foreground"
        >
          Shop bundles →
        </Link>
      </div>
    </aside>
  );
}
