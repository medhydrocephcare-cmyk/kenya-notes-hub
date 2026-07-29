import { getRequestHeader } from "@tanstack/react-start/server";

const CHECKOUT_BASE = "https://project--6cb65918-caa8-4800-8ded-864211f7ab29.lovable.app";

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  includeAuth?: boolean;
};

export async function callCheckoutApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    Origin: "https://www.kasnebpapers.com",
  };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  if (options.includeAuth) {
    const auth = getRequestHeader("authorization");
    if (auth) headers.Authorization = auth;
  }

  const response = await fetch(`${CHECKOUT_BASE}${path}`, {
    method: options.method ?? (options.body === undefined ? "GET" : "POST"),
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    // Keep the original fallback below for non-JSON failures.
  }

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
        ? payload.error
        : `Checkout request failed: ${response.status}`;
    throw new Error(message);
  }

  return payload as T;
}

export function checkoutBaseUrl() {
  return CHECKOUT_BASE;
}