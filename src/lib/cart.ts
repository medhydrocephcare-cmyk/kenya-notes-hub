import { useEffect, useState, useSyncExternalStore } from "react";
import type { Paper } from "./data";

/**
 * Cart items store a self-contained snapshot of the paper at add-to-cart
 * time. This decouples the cart from any per-page data fetch and lets the
 * drawer / checkout render without waiting on the papers query.
 */
export type CartPaper = {
  id: string;
  title: string;
  price: number;
  courseSlug: string;
  levelSlug?: string;
  examSitting?: string;
};

type CartItem = { paper: CartPaper; qty: number };

const KEY = "kasneb_cart_v2";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Skip legacy id-only rows silently.
    return parsed.filter((r): r is CartItem => r && typeof r === "object" && r.paper && r.paper.id);
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  emit();
}

// --- Drawer open state ---
let drawerOpen = false;
const drawerListeners = new Set<() => void>();
function emitDrawer() { drawerListeners.forEach((l) => l()); }
export function openCart() { drawerOpen = true; emitDrawer(); }
export function closeCart() { drawerOpen = false; emitDrawer(); }
export function useCartOpen() {
  return useSyncExternalStore(
    (cb) => { drawerListeners.add(cb); return () => drawerListeners.delete(cb); },
    () => drawerOpen,
    () => false,
  );
}

function toSnapshot(p: Paper | CartPaper): CartPaper {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    courseSlug: p.courseSlug,
    levelSlug: (p as Paper).levelSlug,
    examSitting: p.examSitting,
  };
}

export function addToCart(paper: Paper | CartPaper, opts?: { openDrawer?: boolean }) {
  const items = read();
  if (!items.find((i) => i.paper.id === paper.id)) {
    write([...items, { paper: toSnapshot(paper), qty: 1 }]);
  }
  if (opts?.openDrawer !== false) openCart();
}
export function removeFromCart(paperId: string) {
  write(read().filter((i) => i.paper.id !== paperId));
}
export function clearCart() { write([]); }
export function isInCart(paperId: string): boolean {
  return read().some((i) => i.paper.id === paperId);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
}

export function useCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const snap = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(KEY) || "[]",
    () => "[]",
  );
  let parsed: CartItem[] = [];
  if (hydrated) {
    try {
      const arr = JSON.parse(snap);
      if (Array.isArray(arr)) parsed = arr.filter((r): r is CartItem => r && r.paper && r.paper.id);
    } catch { /* ignore */ }
  }
  const subtotal = parsed.reduce((s, d) => s + d.paper.price * d.qty, 0);
  return { items: parsed, count: parsed.length, subtotal, hydrated };
}
