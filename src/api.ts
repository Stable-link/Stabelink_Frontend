/**
 * Backend API client for StableLink.
 * API key: VITE_API_KEY in .env or localStorage key "stablelink_api_key".
 */

const API_BASE_URL =
  typeof import.meta.env.VITE_API_URL === "string" && import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : "http://localhost:4000";

const API_KEY_STORAGE_KEY = "stablelink_api_key";

export function getApiKey(): string | null {
  const fromEnv = import.meta.env.VITE_API_KEY;
  if (typeof fromEnv === "string" && fromEnv.trim()) return fromEnv.trim();
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    return stored && stored.trim() ? stored.trim() : null;
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${p}`;
}

export async function fetchWithAuth(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith("http") ? path : apiUrl(path);
  const apiKey = getApiKey();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (apiKey) headers.set("x-api-key", apiKey);
  return fetch(url, { ...options, headers });
}

export async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetchWithAuth(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? res.statusText);
  return data as T;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Types (match backend responses) ---

export interface ApiInvoice {
  id: string;
  onchain_invoice_id: number;
  creator_wallet?: string;
  client_name: string | null;
  client_email: string | null;
  token: string;
  amount: string;
  status: string;
  tx_hash: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface ApiOrganization {
  id: string;
  name: string;
  primary_wallet: string;
  default_platform_fee: number;
  created_at: string;
  members: { user_id: string; email: string | null; role: string; status: string }[];
}

export interface ApiWebhook {
  id: string;
  url: string;
  subscribed_events: string[];
  created_at: string;
}

// --- API functions ---

export async function listInvoices(): Promise<{ invoices: ApiInvoice[] }> {
  return apiJson("/api/invoices");
}

export async function getInvoice(id: string): Promise<ApiInvoice> {
  return apiJson(`/api/invoices/${encodeURIComponent(id)}`);
}

export async function deleteInvoice(id: string): Promise<void> {
  const res = await fetchWithAuth(`/api/invoices/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(res.status, (data as { error?: string }).error ?? res.statusText);
  }
}

export async function createInvoice(body: {
  amount: number;
  token: string;
  client_name?: string;
  client_email?: string;
  splits: { wallet: string; percentage: number }[];
  onchain_invoice_id?: number;
  creator_wallet?: string;
  tx_hash?: string;
}): Promise<{
  id: string;
  onchain_invoice_id: number;
  amount: string;
  token: string;
  client_name: string | null;
  client_email: string | null;
  status: string;
  created_at: string;
}> {
  const res = await fetchWithAuth("/api/invoices", {
    method: "POST",
    body: JSON.stringify({
      amount: body.amount,
      token: body.token,
      client_name: body.client_name ?? undefined,
      client_email: body.client_email ?? undefined,
      splits: body.splits,
      ...(body.onchain_invoice_id != null && { onchain_invoice_id: body.onchain_invoice_id }),
      ...(body.creator_wallet && { creator_wallet: body.creator_wallet }),
      ...(body.tx_hash && { tx_hash: body.tx_hash }),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error ?? res.statusText);
  return data as never;
}

export async function getOrganization(): Promise<ApiOrganization> {
  return apiJson("/api/organization");
}

export async function listWebhooks(): Promise<{ webhooks: ApiWebhook[] }> {
  return apiJson("/api/webhooks");
}

export async function createWebhook(body: { url: string; subscribed_events: string[] }): Promise<ApiWebhook> {
  return apiJson("/api/webhooks", { method: "POST", body: JSON.stringify(body) });
}

export async function inviteTeamMember(body: { email: string; role: string }): Promise<{
  id: string;
  email: string;
  role: string;
  status: string;
}> {
  return apiJson("/api/team/invite", { method: "POST", body: JSON.stringify(body) });
}
