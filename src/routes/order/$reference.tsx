import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getOrderStatus, getDownloadUrl } from "@/lib/checkout.functions";
import { Loader2, CheckCircle2, XCircle, Clock, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/order/$reference")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.reference} — Kasneb Pastpapers` },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

type OrderData = {
  reference: string;
  status: string;
  subtotal_kes: number;
  mpesa_receipt: string | null;
  result_desc: string | null;
  order_items: { paper_id: string; title: string; price_kes: number }[];
};

function OrderPage() {
  const { reference } = Route.useParams();
  const fetchStatus = useServerFn(getOrderStatus);
  const fetchDownload = useServerFn(getDownloadUrl);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    let stopped = false;
    async function poll() {
      try {
        const res = (await fetchStatus({ data: { reference } })) as OrderData | null;
        if (!alive) return;
        setOrder(res);
        setLoading(false);
        if (res && (res.status === "pending")) {
          if (!stopped) setTimeout(poll, 4000);
        }
      } catch {
        if (alive) setLoading(false);
      }
    }
    poll();
    return () => {
      alive = false;
      stopped = true;
    };
  }, [reference, fetchStatus]);

  async function download(paperId: string) {
    try {
      const res = await fetchDownload({ data: { reference, paperId } });
      window.open(res.url, "_blank");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Download unavailable");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Order</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">#{reference}</h1>

        {loading ? (
          <Card className="mt-8 flex items-center gap-3 p-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading order…
          </Card>
        ) : !order ? (
          <Card className="mt-8 p-8 text-center text-muted-foreground">Order not found.</Card>
        ) : (
          <>
            <StatusCard status={order.status} desc={order.result_desc} receipt={order.mpesa_receipt} />

            <Card className="mt-6 p-6">
              <h2 className="text-lg font-semibold">Your papers</h2>
              <ul className="mt-4 divide-y divide-border/60">
                {order.order_items.map((it) => (
                  <li key={it.paper_id} className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{it.title}</p>
                      <p className="text-xs text-muted-foreground">KSh {it.price_kes}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={order.status === "paid" ? "default" : "outline"}
                      disabled={order.status !== "paid"}
                      onClick={() => download(it.paper_id)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border/60 pt-4 font-semibold">
                <span>Total</span>
                <span>KSh {order.subtotal_kes}</span>
              </div>
            </Card>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}

function StatusCard({ status, desc, receipt }: { status: string; desc: string | null; receipt: string | null }) {
  if (status === "paid") {
    return (
      <Card className="mt-8 border-primary/40 bg-primary/5 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
          <div>
            <p className="font-semibold">Payment confirmed</p>
            <p className="text-xs text-muted-foreground">
              M-Pesa receipt {receipt ?? "—"} • Your downloads are ready below.
            </p>
          </div>
        </div>
      </Card>
    );
  }
  if (status === "failed") {
    return (
      <Card className="mt-8 border-destructive/40 bg-destructive/5 p-6">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-destructive" />
          <div>
            <p className="font-semibold">Payment failed</p>
            <p className="text-xs text-muted-foreground">{desc ?? "The payment was not completed."}</p>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="mt-8 border-amber-400/40 bg-amber-50/40 p-6 dark:bg-amber-950/20">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-amber-500" />
        <div>
          <p className="font-semibold">Waiting for M-Pesa confirmation…</p>
          <p className="text-xs text-muted-foreground">
            Check your phone for the STK PIN prompt. This page will update automatically.
          </p>
        </div>
      </div>
    </Card>
  );
}
