import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const initiateCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({
      buyerName: z.string().min(2).max(120),
      email: z.string().email(),
      phone: z.string().min(9).max(20),
      items: z
        .array(
          z.object({
            paperId: z.string().min(1),
            title: z.string().min(1),
            price: z.number().int().positive(),
          }),
        )
        .min(1)
        .max(50),
    }).parse(data),
  )
  .handler(async ({ data }) => {
    const { callCheckoutApi } = await import("./checkout-remote.server");
    return callCheckoutApi<{ reference: string; transactionId?: string }>("/api/public/checkout/initiate", {
      method: "POST",
      body: data,
      includeAuth: true,
    });
  });

export const getOrderStatus = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().min(4).max(40) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { callCheckoutApi } = await import("./checkout-remote.server");
    return callCheckoutApi(`/api/public/checkout/status?reference=${encodeURIComponent(data.reference)}`);
  });

export const getDownloadUrl = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ reference: z.string().min(4), paperId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { callCheckoutApi, checkoutBaseUrl } = await import("./checkout-remote.server");
    const result = await callCheckoutApi<{ url: string; expiresIn: number }>("/api/public/checkout/download-url", {
      method: "POST",
      body: data,
      includeAuth: true,
    });
    return { ...result, url: result.url.startsWith("http") ? result.url : `${checkoutBaseUrl()}${result.url}` };
  });

export const getMyOrders = createServerFn({ method: "GET" })
  .handler(async () => {
    const { callCheckoutApi } = await import("./checkout-remote.server");
    return callCheckoutApi("/api/public/checkout/my-orders", { includeAuth: true });
  });
