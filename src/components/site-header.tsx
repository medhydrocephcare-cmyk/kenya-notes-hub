import { Link } from "@tanstack/react-router";
import { ShoppingCart, User, Menu, Search, Phone, Mail, ChevronDown, X, LogOut, LayoutDashboard } from "lucide-react";
import { useCart, openCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { courses } from "@/lib/data";
import logo from "@/assets/logo.png";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-brand-gradient text-primary-foreground">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-2 px-3 text-[11px] sm:text-xs sm:px-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Phone className="h-3 w-3" /> 0712 345 678
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <Mail className="h-3 w-3" /> hello@casneb.com
            </span>
            <span className="truncate sm:hidden">📞 0712 345 678 · Pay with M-Pesa</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-foreground">
              Sale
            </span>
            <span className="hidden sm:inline">Free preview on every paper • August 2026 sitting live</span>
          </div>
        </div>
      </div>

      <div className="border-b border-border/60 bg-background/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 sm:px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Kasneb Pastpapers logo" width={40} height={40} className="h-10 w-10" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">Kasneb</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand">Pastpapers</span>
            </span>
          </Link>

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

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden gap-2 md:inline-flex">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                      {(user.email ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[140px] truncate text-sm">{user.email}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate({ to: "/account" })}>
                    <User className="mr-2 h-4 w-4" /> My account
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Admin dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" /> Sign in
                </Button>
              </Link>
            )}

            <Button
              variant="outline"
              size="sm"
              className="relative gap-2 border-brand/30"
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4 text-brand" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-gold-foreground">
                  {count}
                </span>
              )}
            </Button>

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
                <div className="absolute left-0 top-11 z-50 w-80 rounded-b-xl border border-border/60 bg-background shadow-xl">
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
            <Link to="/" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">Home</Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">All papers</Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">Revision kits</Link>
            <Link to="/courses" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">Bundles</Link>
            {user && (
              <Link to="/account" className="rounded-md px-3 py-2 font-medium text-foreground hover:bg-muted">
                My downloads
              </Link>
            )}
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[10px] font-black text-gold-foreground">M</span>
              M-Pesa • Card • Bank
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-b border-border/60 bg-background lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <form onSubmit={(e) => e.preventDefault()} className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search papers, notes, kits…"
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
              {user ? (
                <>
                  <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">
                    My account & downloads
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">
                      Admin dashboard
                    </Link>
                  )}
                  <button
                    onClick={async () => { setOpen(false); await signOut(); navigate({ to: "/" }); }}
                    className="rounded-md px-3 py-2.5 text-left hover:bg-muted"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 hover:bg-muted">
                  Sign in / Create account
                </Link>
              )}
              <button
                onClick={() => { setOpen(false); openCart(); }}
                className="rounded-md px-3 py-2.5 text-left hover:bg-muted"
              >
                View cart ({count})
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
