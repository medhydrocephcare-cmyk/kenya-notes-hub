import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Lock, Download, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

const authBenefits: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Download, title: "Instant unlock", description: "Files open as soon as M-Pesa confirms." },
  { icon: ShieldCheck, title: "Saved purchases", description: "Receipts and downloads stay in your account." },
  { icon: Smartphone, title: "Phone friendly", description: "Download on mobile, tablet or laptop." },
  { icon: Lock, title: "Protected access", description: "Your files are only visible to you." },
];

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Kasneb Pastpapers" },
      { name: "description", content: "Sign in or create an account to access your purchases and downloads." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Sign in — Kasneb Pastpapers" },
      { property: "og:description", content: "Access your KASNEB downloads, receipts and saved purchases." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/auth` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/auth` }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-[1.05fr_0.95fr] md:py-14">
        <section className="relative overflow-hidden rounded-2xl bg-brand-gradient p-7 text-primary-foreground shadow-card md:p-9">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
            <Lock className="h-3.5 w-3.5 text-gold" /> Secure student account
          </div>
          <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your revision library, ready anytime.</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
            Sign in to access every past paper, note and revision kit you've purchased —
            re-download anytime, on any device.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {authBenefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-gold-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-sm font-semibold">{title}</div>
                <div className="mt-1 text-xs leading-relaxed text-white/75">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <Card className="self-center p-6 shadow-card sm:p-8">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin"><SignInForm /></TabsContent>
            <TabsContent value="signup"><SignUpForm /></TabsContent>
          </Tabs>

          <div className="mt-6 border-t border-border/60 pt-4 text-center text-[11px] text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" /> Protected by SSL. We never share your data.
          </div>

          <div className="mt-2 text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-brand">← Back to shop</Link>
          </div>
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/account" });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="signin-email">Email</Label>
        <Input id="signin-email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input id="signin-password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
      </div>
      <Button type="submit" className="w-full bg-brand hover:brightness-110" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: name },
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're signed in.");
    navigate({ to: "/account" });
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="signup-name">Full name</Label>
        <Input id="signup-name" required value={name}
          onChange={(e) => setName(e.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input id="signup-email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
      </div>
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <Input id="signup-password" type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
        <p className="mt-1 text-[11px] text-muted-foreground">At least 6 characters.</p>
      </div>
      <Button type="submit" className="w-full bg-brand hover:brightness-110" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
      </Button>
    </form>
  );
}
