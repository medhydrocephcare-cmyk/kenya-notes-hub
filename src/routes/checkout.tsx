import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart, clearCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { initiateCheckout } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Kasneb Pastpapers" },
      { name: "description", content: "Pay securely with Palpluss M-Pesa STK Push." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, hydrated } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initiate = useServerFn(initiateCheckout);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      const res = await initiate({
        data: {
          buyerName: name,
          email,
          phone,
          items: items.map(({ paper }) => ({
            paperId: paper.id,
            title: paper.title,
            price: paper.price,
          })),
        },
      });
      toast.success("STK push sent — check your phone for the M-Pesa PIN prompt");
      clearCart();
      navigate({ to: "/order/$reference", params: { reference: res.reference } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed to start";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        {hydrated && items.length === 0 ? (
          <Card className="mt-8 p-10 text-center text-muted-foreground">Your cart is empty.</Card>
        ) : (
          <form onSubmit={handlePay} className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Buyer details</h2>
              <div className="mt-4 grid gap-4">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email">Email (for receipt & downloads)</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="phone">M-Pesa phone number</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="07XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-border/60 bg-muted/40 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Payment via Palpluss M-Pesa
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  We'll send an M-Pesa STK Push to your phone. Enter your PIN to confirm — downloads unlock instantly once payment is received.
                </p>
              </div>
            </Card>

            <Card className="h-fit p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                {items.map(({ paper }) => (
                  <div key={paper.id} className="flex justify-between gap-4">
                    <span className="line-clamp-1 text-muted-foreground">{paper.title}</span>
                    <span className="font-medium">KSh {paper.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border/60 pt-4">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>KSh {subtotal}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending STK push…</>
                ) : (
                  <>Pay KSh {subtotal} with M-Pesa</>
                )}
              </Button>
            </Card>
          </form>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
