/**
 * Shared schema.org Offer fragments for digital (instant-download) products.
 *
 * Google Merchant listings warn when an Offer omits `shippingDetails` and
 * `hasMerchantReturnPolicy`. Our products are digital PDFs: no shipping and a
 * no-return policy (digital goods), so we declare that explicitly.
 *
 * Always spread `digitalOfferExtras()` into any Offer node we emit.
 */
import { SITE_URL } from "./site-config";

export function digitalOfferExtras() {
  return {
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: 0,
        currency: "KES",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "KE",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "KE",
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      merchantReturnLink: `${SITE_URL}/refund-policy`,
    },
  };
}

/** Build a complete digital-product Offer node. */
export function digitalOffer(params: { price: number | string; url: string; priceCurrency?: string }) {
  return {
    "@type": "Offer",
    priceCurrency: params.priceCurrency ?? "KES",
    price: params.price,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url: params.url,
    ...digitalOfferExtras(),
  };
}
