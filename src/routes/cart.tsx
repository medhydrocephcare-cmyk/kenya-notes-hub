import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart, removeFromCart } from "@/lib/cart";
import { Trash2, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Kasneb Pastpapers" },
      { name: "description", content: "Review the notes and past papers in your cart." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, hydrated } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>

        {!hydrated ? null : items.length === 0 ? (
          <Card className="mt-8 p-10 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">Your cart is empty.</p>
            <Link to="/courses" className="mt-4 inline-block">
              <Button>Browse courses</Button>
            </Link>
          </Card>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <div className="space-y-3">
              {items.map(({ paper }) => (
                <Card key={paper.id} className="flex items-center gap-4 p-4">
                  <div className="flex-1">
                    <Link to="/papers/$paperId" params={{ paperId: paper.id }} className="font-medium hover:text-primary">
                      {paper.title}
                    </Link>
                    <div className="mt-1 text-xs text-muted-foreground">{paper.examSitting}</div>
                  </div>
                  <div className="text-sm font-medium">KSh {paper.price}</div>
                  <button
                    onClick={() => removeFromCart(paper.id)}
                    className="text-muted-foreground transition hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </Card>
              ))}
            </div>
            <Card className="h-fit p-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">KSh {subtotal}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Processing fee</span>
                <span className="font-medium">KSh 0</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-border/60 pt-4 text-base font-semibold">
                <span>Total</span>
                <span>KSh {subtotal}</span>
              </div>
              <Link to="/checkout">
                <Button size="lg" className="mt-6 w-full">Checkout with Palpluss</Button>
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure M-Pesa, card and bank transfer
              </p>
            </Card>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
