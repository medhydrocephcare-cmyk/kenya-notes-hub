import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { papers } from "@/lib/data";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Chapa Notes" },
      { name: "description", content: "Your purchases and downloads." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  // Placeholder: sample purchases. Real data comes from the orders table once
  // Lovable Cloud is enabled and auth is wired up.
  const purchases = papers.slice(0, 2).map((p) => ({
    paper: p,
    ref: "PP-" + p.id.toUpperCase().slice(0, 6),
    date: "2026-07-01",
  }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">demo@chapanotes.co.ke</span>
          &nbsp;· Login flow ships when authentication is enabled.
        </p>

        <h2 className="mt-10 text-lg font-semibold">Purchases & downloads</h2>
        <div className="mt-4 space-y-3">
          {purchases.map((o) => (
            <Card key={o.ref} className="flex flex-wrap items-center gap-4 p-5">
              <div className="flex-1">
                <Link to="/papers/$paperId" params={{ paperId: o.paper.id }} className="font-medium hover:text-primary">
                  {o.paper.title}
                </Link>
                <div className="mt-1 text-xs text-muted-foreground">
                  Ref {o.ref} · Purchased {o.date} · KSh {o.paper.price}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </Card>
          ))}
        </div>

        <h2 className="mt-10 text-lg font-semibold">Order history</h2>
        <Card className="mt-4 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((o) => (
                <tr key={o.ref} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs">{o.ref}</td>
                  <td className="px-4 py-3">{o.date}</td>
                  <td className="px-4 py-3">KSh {o.paper.price}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}
