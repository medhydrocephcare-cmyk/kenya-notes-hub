import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, Menu, Search, Phone, Mail, ChevronDown, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { courses } from "@/lib/data";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement bar */}
      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Phone className="h-3 w-3" /> 0712 345 678
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Mail className="h-3 w-3" /> hello@kasneb.com
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
              Sale
            </span>
            <span className="hidden sm:inline">Free preview on every paper • August 2026 sitting live</span>
            <span className="sm:hidden">Aug 2026 sitting live</span>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-primary-foreground shadow-card">
              <span className="font-display text-lg font-extrabold">K</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold tracking-tight">Kasneb</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">Pastpapers</span>
            </span>
          </Link>

          {/* Desktop search */}
          <form className="ml-4 hidden flex-1 lg:block" onSubmit={(e) => e.preventDefault()}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search papers, notes, revision kits…"
                className="h-11 w-full rounded-full border border-border bg-muted/40 pl-10 pr-28 text-sm outline-none transition focus:border-brand focus:bg-background focus:ring-4 focus:ring-brand/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Search
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link to="/account" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" /> Account
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative gap-2 border-brand/30">
                <ShoppingCart className="h-4 w-4 text-brand" />
                <span className="hidden sm:inline">Cart</span>
                {count > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                    {count}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Category nav */}
        <div className="hidden border-t border-border/60 bg-surface/60 lg:block">
          <div className="mx-auto flex h-11 max-w-7xl items-center gap-1 px-4 text-sm">
            <div className="relative">
              <button
                onClick={() => setBrowseOpen((v) => !v)}
                onBlur={() => setTimeout(() => setBrowseOpen(false), 150)}
                className="flex h-11 items-center gap-2 rounded-t-md bg-brand px-4 font-semibold text-primary-foreground"
              >
                <Menu className="h-4 w-4" /> Browse courses
                <ChevronDown className="h-3 w-3" />
              </button>
              {browseOpen && (
                <div className="absolute left-0 top-11 z-50 w-72 rounded-b-xl border border-border/60 bg-background shadow-xl">
                  {courses.map((c) => (
                    <Link
                      key={c.slug}
                      to="/courses/$courseSlug"
                      params={{ courseSlug: c.slug }}
                      className="flex items-center justify-between border-b border-border/40 px-4 py-3 last:border-0 hover:bg-muted"
                    >
                      <span>
                        <span className="font-semibold text-brand">{c.code}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{c.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
              Home
            </Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
              All papers
            </Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
              Revision kits
            </Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
              Bundles
            </Link>
            <Link to="/account" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
              My downloads
            </Link>
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[10px] font-black text-gold-foreground">M</span>
              M-Pesa • Card • Bank
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-b border-border/60 bg-background lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search…"
                className="h-11 w-full rounded-full border border-border bg-muted/40 pl-10 pr-4 text-sm outline-none focus:border-brand"
              />
            </form>
            <nav className="grid gap-1 text-sm">
              <div className="mt-1 mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Courses</div>
              {courses.map((c) => (
                <Link
                  key={c.slug}
                  to="/courses/$courseSlug"
                  params={{ courseSlug: c.slug }}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-muted"
                  onClick={() => setOpen(false)}
                >
                  <span><b className="text-brand">{c.code}</b> — {c.name}</span>
                </Link>
              ))}
              <div className="mt-3 mb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Account</div>
              <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">My downloads</Link>
              <Link to="/cart" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">Cart</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">Admin</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
