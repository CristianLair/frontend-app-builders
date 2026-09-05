export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | undefined;

export interface ApiRequestOptions {
  method?: HttpMethod;
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: HeadersInit;
  token?: string | null;
  signal?: AbortSignal;
}

export type ApiResponse<T> = {
  ok: true;
  status: number;
  data: T;
};