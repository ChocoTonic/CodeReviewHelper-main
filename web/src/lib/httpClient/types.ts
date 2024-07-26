import { type HttpCode } from './codes'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiClientInterceptor = (request: ApiRequest) => ApiRequest | Promise<ApiRequest>

export interface ApiClientConfig {
  baseUrl: Promise<string> | string;
  globalHeaders?: Record<string, string>;
  interceptors?: ApiClientInterceptor[];
}

export interface ApiResponse<T = unknown> {
  body: T;
  status: HttpCode;
  headers: Headers;
  ok: boolean;
}

export interface ApiRequest {
  method: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  params?: Record<string, unknown>;
  streamResponse?: boolean;
}

export class HttpClientException extends Error {
  public readonly status: HttpCode
  public readonly response: ApiResponse

  constructor (message: string, code: HttpCode, response: ApiResponse) {
    super(message)
    this.status = code
    this.response = response
  }
}
