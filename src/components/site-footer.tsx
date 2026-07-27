import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="font-semibold">Chapa Notes</div>
          <p className="mt-2 text-sm text-muted-foreground">
            KASNEB & KNEC study notes, revision kits and past papers with model answers.
            Updated every sitting.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium">Courses</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">All courses</Link></li>
            <li><Link to="/courses" className="hover:text-foreground">CPA</Link></li>
            <li><Link to="/courses" className="hover:text-foreground">ATD</Link></li>
            <li><Link to="/courses" className="hover:text-foreground">CS / CIFA / CCP</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Account</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/account" className="hover:text-foreground">My downloads</Link></li>
            <li><Link to="/cart" className="hover:text-foreground">Cart</Link></li>
            <li><Link to="/admin" className="hover:text-foreground">Admin</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium">Payments</div>
          <p className="mt-3 text-sm text-muted-foreground">
            Secure checkout powered by <span className="font-medium text-foreground">Palpluss</span>.
            M-Pesa, card and bank transfer.
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Chapa Notes. Not affiliated with KASNEB or KNEC.
      </div>
    </footer>
  );
}
