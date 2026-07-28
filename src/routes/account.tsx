import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getMyOrders, getDownloadUrl } from "@/lib/checkout.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/site-config";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My account — Kasneb Pastpapers" },
      { name: "description", content: "Your orders, downloads and account settings." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "My account — Kasneb Pastpapers" },
      { property: "og:description", content: "Access your saved KASNEB downloads, receipts and account settings." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/account` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/account` }],
  }),
  component: AccountPage,
});

type Order = {
  id: string;
  reference: string;
  status: string;
  subtotal_kes: number;
  mpesa_receipt: string | null;
  created_at: string;
  order_items: { paper_id: string; title: string; price_kes: number }[];
};

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const fetchOrders = useServerFn(getMyOrders);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    setLoadingOrders(true);
    (fetchOrders as unknown as () => Promise<Order[]>)()
      .then((data) => { setOrders(data); setLoadingOrders(false); })
      .catch((e) => {
        toast.error(e instanceof Error ? e.message : "Failed to load orders");
        setLoadingOrders(false);
      });
  }, [user, fetchOrders]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const paidOrders = (orders ?? []).filter((o) => o.status === "paid");
  const purchasedItems = paidOrders.flatMap((o) =>
    o.order_items.map((i) => ({ ...i, reference: o.reference, date: o.created_at })),
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Header card */}
        <Card className="flex flex-wrap items-center gap-4 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-lg font-bold text-brand">
            {(user.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Signed in as</div>
            <div className="truncate font-semibold">{user.email}</div>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
            Sign out
          </Button>
        </Card>

        <Tabs defaultValue="downloads" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="downloads">
            {loadingOrders ? (
              <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : purchasedItems.length === 0 ? (
              <Card className="p-10 text-center">
                <UserIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-muted-foreground">You haven't purchased anything yet.</p>
                <Link to="/courses" className="mt-4 inline-block">
                  <Button>Browse papers</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {purchasedItems.map((it) => (
                  <DownloadRow key={`${it.reference}:${it.paper_id}`} item={it} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Reference</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orders ?? []).length === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No orders yet.</td></tr>
                    ) : (orders ?? []).map((o) => (
                      <tr key={o.id} className="border-t border-border/60">
                        <td className="px-4 py-3 font-mono text-xs">
                          <Link to="/order/$reference" params={{ reference: o.reference }} className="hover:text-brand">
                            {o.reference}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{new Date(o.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3">KSh {o.subtotal_kes.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={o.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </div>
  );
}

function DownloadRow({ item }: { item: { paper_id: string; title: string; price_kes: number; reference: string; date: string } }) {
  const download = useServerFn(getDownloadUrl);
  const [busy, setBusy] = useState(false);
  return (
    <Card className="flex flex-wrap items-center gap-4 p-5">
      <div className="min-w-0 flex-1">
        <div className="line-clamp-1 font-medium">{item.title}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Ref <span className="font-mono">{item.reference}</span> · {new Date(item.date).toLocaleDateString()} · KSh {item.price_kes.toLocaleString()}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const { url } = await download({ data: { reference: item.reference, paperId: item.paper_id } });
            window.open(url, "_blank", "noopener");
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Download unavailable");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Download className="h-4 w-4" /> Download PDF</>}
      </Button>
    </Card>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-700",
    pending: "bg-amber-500/10 text-amber-700",
    failed: "bg-rose-500/10 text-rose-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function SettingsPanel() {
  const { user } = useAuth();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords don't match");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPw(""); setPw2("");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-sm font-semibold">Profile</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{user?.email}</span></div>
          <div><span className="text-muted-foreground">User ID:</span> <span className="font-mono text-[11px]">{user?.id}</span></div>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-brand" /> Change password
        </h3>
        <form onSubmit={changePassword} className="mt-3 space-y-3">
          <div>
            <Label htmlFor="new-pw">New password</Label>
            <Input id="new-pw" type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="new-pw2">Confirm new password</Label>
            <Input id="new-pw2" type="password" required minLength={6} value={pw2} onChange={(e) => setPw2(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="submit" disabled={busy} className="bg-brand hover:brightness-110">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
