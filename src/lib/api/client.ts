import { env } from "@/config/env";
import { ApiError } from "@/lib/api/error";
import type { ApiRequestOptions, ApiResponse } from "@/types/api";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${env.apiUrl}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as unknown;
    if (payload && typeof payload === "object") {
      const record = payload as Record<string, unknown>;
      if (typeof record.error === "string") return record.error;
      if (typeof record.message === "string") return record.message;
    }
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }
  return response.statusText || `HTTP ${response.status}`;
}

export async function request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", query, body, headers, token, signal } = options;

  const resolvedHeaders = new Headers(headers);
  const resolvedToken = token !== undefined ? token : authToken;
  if (resolvedToken) resolvedHeaders.set("Authorization", `Bearer ${resolvedToken}`);
  if (body !== undefined && !resolvedHeaders.has("Content-Type")) {
    resolvedHeaders.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: resolvedHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("No se pudo conectar con el servidor", 0, true);
  }

  if (!response.ok) {
    throw new ApiError(await parseErrorMessage(response), response.status, true);
  }

  if (response.status === 204) {
    return { ok: true, status: response.status, data: undefined as T };
  }

  return { ok: true, status: response.status, data: (await response.json()) as T };
}

type WithoutMethod = Omit<ApiRequestOptions, "method" | "body">;

export const http = {
  get<T>(path: string, options?: WithoutMethod) {
    return request<T>(path, { ...options, method: "GET" });
  },
  post<T>(path: string, body?: unknown, options?: WithoutMethod) {
    return request<T>(path, { ...options, method: "POST", body });
  },
  put<T>(path: string, body?: unknown, options?: WithoutMethod) {
    return request<T>(path, { ...options, method: "PUT", body });
  },
  patch<T>(path: string, body?: unknown, options?: WithoutMethod) {
    return request<T>(path, { ...options, method: "PATCH", body });
  },
  del<T>(path: string, options?: WithoutMethod) {
    return request<T>(path, { ...options, method: "DELETE" });
  },
};