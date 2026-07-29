// PalPluss API client. Server-only.
// Docs: https://docs.palpluss.com — HTTP Basic auth with API key as username, empty password.

const BASE_URL = "https://api.palpluss.com/v1";

function authHeader() {
  const key = process.env.PALPLUSS_API_KEY;
  if (!key) throw new Error("PALPLUSS_API_KEY not configured");
  return "Basic " + btoa(`${key}:`);
}

export type StkInitiateInput = {
  amount: number;
  phone: string;
  accountReference: string; // <=12 chars
  transactionDesc: string; // <=13 chars
  callbackUrl: string;
  channelId?: string;
};

export type StkInitiateResponse = {
  transactionId: string;
  status: string;
  amount: number;
  phone: string;
  accountReference: string;
  providerCheckoutId: string | null;
};

export type PalplussTransaction = {
  transactionId?: string;
  id?: string;
  status?: string;
  accountReference?: string | null;
  external_reference?: string | null;
  mpesaReceipt?: string | null;
  mpesa_receipt?: string | null;
  resultDesc?: string | null;
  result_desc?: string | null;
};

export async function initiateStk(input: StkInitiateInput): Promise<StkInitiateResponse> {
  const body: Record<string, unknown> = {
    amount: input.amount,
    phone: input.phone,
    accountReference: input.accountReference.slice(0, 12),
    transactionDesc: input.transactionDesc.slice(0, 13),
    callbackUrl: input.callbackUrl,
  };
  if (input.channelId) body.channelId = input.channelId;

  const res = await fetch(`${BASE_URL}/payments/stk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: StkInitiateResponse;
    error?: { message?: string; code?: string };
  };
  if (!res.ok || !json.success || !json.data) {
    const msg = json.error?.message || `PalPluss error (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return json.data;
}

export async function getTransaction(transactionId: string): Promise<PalplussTransaction | null> {
  const res = await fetch(`${BASE_URL}/transactions/${encodeURIComponent(transactionId)}`, {
    method: "GET",
    headers: { Authorization: authHeader() },
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: PalplussTransaction;
    error?: { message?: string; code?: string };
  };
  if (!res.ok || !json.success) {
    const msg = json.error?.message || `PalPluss transaction check failed (HTTP ${res.status})`;
    throw new Error(msg);
  }
  return json.data ?? null;
}
