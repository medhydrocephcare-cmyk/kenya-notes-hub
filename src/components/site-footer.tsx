import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, ShieldCheck, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { courses } from "@/lib/data";
import { SITE } from "@/lib/site-config";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

export function SiteFooter() {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubLoading(true);
    try {
      await subscribe({ data: { email } });
      toast.success("You're subscribed — watch your inbox for sitting alerts");
      setEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setSubLoading(false);
    }
  }
  return (
    <footer className="mt-24">
      {/* Trust strip */}
      <div className="border-y border-border/60 bg-surface/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {[
            { t: "Free answer preview", s: "See real content on every product" },
            { t: "Instant M-Pesa payment", s: "STK push, download unlocks in seconds" },
            { t: "Updated every sitting", s: "Sitting date shown on every product" },
            { t: "Trusted by 12,400+ students", s: "Nairobi, Mombasa, Kisumu & beyond" },
          ].map((f) => (
            <div key={f.t} className="flex items-start gap-3">
              <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-semibold">{f.t}</div>
                <div className="text-xs text-muted-foreground">{f.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-gradient text-gold-foreground">
                <span className="font-display text-lg font-extrabold">K</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight">Kasneb</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold">Pastpapers</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-sidebar-foreground/80">
              Kenya's home for updated KASNEB & KNEC study notes, revision kits and past papers with model answers.
              Preview real answers before you pay.
            </p>
            <div className="mt-5 space-y-2 text-sm text-sidebar-foreground/80">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> {SITE.supportPhone}</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> {SITE.supportEmail}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Nairobi, Kenya · {SITE.domain}</div>
            </div>
            <div className="mt-5 flex gap-2">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent transition hover:bg-gold hover:text-gold-foreground">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gold">Courses</div>
            <ul className="mt-4 space-y-2.5 text-sm text-sidebar-foreground/80">
              {courses.map((c) => (
                <li key={c.slug}>
                  <Link to="/courses/$courseSlug" params={{ courseSlug: c.slug }} className="transition hover:text-gold">
                    <span className="font-semibold text-gold/90">{c.code}</span>
                    <span className="text-sidebar-foreground/70"> · {c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gold">Shop</div>
            <ul className="mt-4 space-y-2.5 text-sm text-sidebar-foreground/80">
              <li><Link to="/courses" className="hover:text-gold">All papers</Link></li>
              <li><Link to="/blog" className="hover:text-gold">Blog</Link></li>
              <li><Link to="/pricing" className="hover:text-gold">Pricing</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gold">How it works</Link></li>
              <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-gold">About us</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
              <li><Link to="/cart" className="hover:text-gold">Cart</Link></li>
              <li><Link to="/account" className="hover:text-gold">My downloads</Link></li>

            </ul>
          </div>

          <div>
            <div className="text-sm font-bold uppercase tracking-wider text-gold">Get updates</div>
            <p className="mt-4 text-sm text-sidebar-foreground/80">
              Sitting alerts and free past-paper drops. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="mt-3 flex overflow-hidden rounded-full bg-sidebar-accent">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-transparent px-4 py-2.5 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 outline-none"
              />
              <button
                type="submit"
                disabled={subLoading}
                className="inline-flex items-center gap-1 bg-gold px-4 text-xs font-bold uppercase text-gold-foreground disabled:opacity-70"
              >
                {subLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Join"}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-sidebar-border/50">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-sidebar-foreground/70 md:flex-row">
            <div>© {new Date().getFullYear()} {SITE.name}. Not affiliated with KASNEB or KNEC.</div>
            <div className="flex gap-4">
              <Link to="/terms" className="hover:text-gold">Terms</Link>
              <Link to="/privacy" className="hover:text-gold">Privacy</Link>
              <Link to="/refunds" className="hover:text-gold">Refunds</Link>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
