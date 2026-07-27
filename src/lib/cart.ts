import { useEffect, useState, useSyncExternalStore } from "react";
import { getPaper, type Paper } from "./data";

const KEY = "chapa_cart_v1";
type CartItem = { paperId: string; qty: number };

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  emit();
}

export function addToCart(paperId: string) {
  const items = read();
  if (items.find((i) => i.paperId === paperId)) return;
  write([...items, { paperId, qty: 1 }]);
}
export function removeFromCart(paperId: string) {
  write(read().filter((i) => i.paperId !== paperId));
}
export function clearCart() {
  write([]);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCart() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const items = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(KEY) || "[]",
    () => "[]",
  );
  const parsed: CartItem[] = hydrated ? JSON.parse(items) : [];
  const detailed: { item: CartItem; paper: Paper }[] = parsed
    .map((i) => {
      const paper = getPaper(i.paperId);
      return paper ? { item: i, paper } : null;
    })
    .filter(Boolean) as { item: CartItem; paper: Paper }[];
  const subtotal = detailed.reduce((s, d) => s + d.paper.price * d.item.qty, 0);
  return { items: detailed, count: detailed.length, subtotal, hydrated };
}
