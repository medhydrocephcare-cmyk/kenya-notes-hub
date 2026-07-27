import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart, clearCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Lock, CreditCard, Smartphone } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { initiateCheckout } from "@/lib/checkout.functions";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure checkout — Kasneb Pastpapers" },
      { name: "description", content: "Pay securely with M-Pesa, card or bank. 256-bit SSL encryption." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, hydrated } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [createAccount, setCreateAccount] = useState(true);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initiate = useServerFn(initiateCheckout);

  // Prefill email when signed in
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      // Optionally create the account first so the order is linked to it.
      if (!user && createAccount) {
        if (password.length < 6) throw new Error("Password must be at least 6 characters");
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: name },
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });
        if (error && !/already registered/i.test(error.message)) throw error;
      }

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
      toast.success("Check your phone — M-Pesa PIN prompt sent");
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

      {/* Trust ribbon */}
      <div className="border-b border-border/60 bg-surface/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-2.5 text-[11px] font-medium text-muted-foreground sm:text-xs">
          <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-brand" /> 256-bit SSL encrypted</span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-brand" /> Verified secure checkout</span>
          <span className="text-border">•</span>
          <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-brand" /> Pay with M-Pesa</span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Secure checkout</h1>
          <Link to="/courses" className="text-xs text-muted-foreground hover:text-brand">← Continue shopping</Link>
        </div>

        {hydrated && items.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">Your cart is empty.</Card>
        ) : (
          <form onSubmit={handlePay} className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">1</div>
                  <h2 className="text-base font-semibold">Contact details</h2>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" required value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      readOnly={!!user}
                      className="mt-1.5" />
                    <p className="mt-1 text-[11px] text-muted-foreground">Receipts & download links go here.</p>
                  </div>
                  <div>
                    <Label htmlFor="phone">M-Pesa phone number</Label>
                    <Input id="phone" required placeholder="07XX XXX XXX"
                      value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
                  </div>
                </div>
              </Card>

              {!user && (
                <Card className="p-6">
                  <label className="flex items-start gap-3">
                    <Checkbox
                      checked={createAccount}
                      onCheckedChange={(v) => setCreateAccount(!!v)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">Create an account so I can re-download later</div>
                      <p className="text-xs text-muted-foreground">
                        Recommended. We'll save your purchases to your account so you can access them anytime.
                      </p>
                    </div>
                  </label>
                  {createAccount && (
                    <div className="mt-4">
                      <Label htmlFor="password">Choose a password</Label>
                      <Input id="password" type="password" minLength={6}
                        placeholder="At least 6 characters"
                        value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
                    </div>
                  )}
                </Card>
              )}

              {user && (
                <Card className="flex items-center gap-3 border-brand/30 bg-brand/5 p-4 text-sm">
                  <ShieldCheck className="h-4 w-4 text-brand" />
                  Signed in as <span className="font-semibold">{user.email}</span> — this order will be saved to your account.
                </Card>
              )}

              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-brand text-xs font-bold text-primary-foreground">2</div>
                  <h2 className="text-base font-semibold">Payment method</h2>
                </div>
                <div className="mt-4 rounded-xl border-2 border-emerald-600/40 bg-emerald-50/60 p-4 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-600 text-white shadow-md">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">M-Pesa</div>
                      <div className="text-xs text-muted-foreground">You'll receive an STK push on your phone to enter your PIN.</div>
                    </div>
                    <div className="ml-auto shrink-0 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">Selected</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border/60 bg-surface/60 p-3 text-center">
                  <div className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Lock className="h-4 w-4 text-brand" /> SSL
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-brand" /> Verified
                  </div>
                  <div className="flex flex-col items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <CreditCard className="h-4 w-4 text-brand" /> Encrypted
                  </div>
                </div>
              </Card>
            </div>

            <Card className="h-fit p-0 lg:sticky lg:top-24">
              <div className="border-b border-border/60 px-6 py-4">
                <h2 className="text-base font-semibold">Order summary</h2>
              </div>
              <div className="max-h-72 space-y-3 overflow-y-auto px-6 py-4 text-sm">
                {items.map(({ paper }) => (
                  <div key={paper.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="line-clamp-2 font-medium">{paper.title}</div>
                      <div className="text-[11px] text-muted-foreground">{paper.examSitting}</div>
                    </div>
                    <div className="shrink-0 font-semibold">KSh {paper.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/60 px-6 py-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                  <span>Processing fee</span><span>Free</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-border/60 pt-3 text-lg font-extrabold">
                  <span>Total</span><span className="text-brand">KSh {subtotal.toLocaleString()}</span>
                </div>
                <Button type="submit" size="lg" className="mt-5 w-full gap-2 bg-brand hover:brightness-110" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending STK…</>
                  ) : (
                    <><Lock className="h-4 w-4" /> Pay KSh {subtotal.toLocaleString()} securely</>
                  )}
                </Button>
                <p className="mt-3 text-center text-[11px] text-muted-foreground">
                  By paying you agree to our terms. Your data is protected with 256-bit SSL.
                </p>
              </div>
            </Card>
          </form>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
