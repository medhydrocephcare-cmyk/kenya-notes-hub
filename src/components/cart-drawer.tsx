import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, useCartOpen, closeCart, removeFromCart } from "@/lib/cart";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const open = useCartOpen();
  const { items, subtotal, hydrated } = useCart();

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="h-4 w-4 text-brand" />
            Your cart{" "}
            <span className="ml-auto rounded-full bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
              {items.length}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!hydrated ? null : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-muted">
                <ShoppingBag className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              <Link to="/courses" onClick={() => closeCart()}>
                <Button variant="outline" size="sm">Browse papers</Button>
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map(({ paper }) => (
                <li key={paper.id} className="flex items-start gap-3 p-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/15 to-brand/5 font-display text-xs font-black uppercase text-brand">
                    {paper.courseSlug}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/papers/$paperId"
                      params={{ paperId: paper.id }}
                      onClick={() => closeCart()}
                      className="line-clamp-2 text-sm font-medium leading-snug hover:text-brand"
                    >
                      {paper.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{paper.examSitting}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-brand">
                        KSh {paper.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeFromCart(paper.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-surface/50 p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-extrabold">KSh {subtotal.toLocaleString()}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Taxes and any processing fees calculated at checkout.
            </p>
            <Link to="/checkout" onClick={() => closeCart()}>
              <Button size="lg" className="mt-3 w-full gap-2 bg-brand hover:brightness-110">
                Secure checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              256-bit SSL · M-Pesa · Visa · Mastercard
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
