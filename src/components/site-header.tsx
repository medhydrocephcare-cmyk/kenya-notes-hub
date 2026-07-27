import { Link } from "@tanstack/react-router";
import { ShoppingCart, GraduationCap, User, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="tracking-tight">Chapa Notes</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link to="/courses" className="text-muted-foreground transition hover:text-foreground">
            Courses
          </Link>
          <Link to="/courses" search={{}} className="text-muted-foreground transition hover:text-foreground">
            Bundles
          </Link>
          <Link to="/account" className="text-muted-foreground transition hover:text-foreground">
            My downloads
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/account" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" /> Account
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm">
            <Link to="/courses" className="rounded-md px-2 py-2 hover:bg-muted" onClick={() => setOpen(false)}>
              Courses
            </Link>
            <Link to="/account" className="rounded-md px-2 py-2 hover:bg-muted" onClick={() => setOpen(false)}>
              My downloads
            </Link>
            <Link to="/admin" className="rounded-md px-2 py-2 hover:bg-muted" onClick={() => setOpen(false)}>
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
