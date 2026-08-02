import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="text-xs font-bold uppercase tracking-widest text-gold">{eyebrow}</div>
          <h1 className="mt-1 font-display text-3xl font-extrabold md:text-4xl">{title}</h1>
          {intro ? <p className="mt-2 max-w-2xl text-white/80">{intro}</p> : null}
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-6 text-[15px] leading-relaxed text-foreground/90">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-5 shadow-card">
      <h2 className="font-display text-xl font-bold">{heading}</h2>
      <div className="mt-3 space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}
