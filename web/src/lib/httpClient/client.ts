/**
 * Filename: utils/httpClient/client.ts
 * Author: Thilina Lakshan <thilinalakshanmail@gmail.com>
 * Created: 5th Oct 2023
 * Description: API client using Fetch API to interact with a RESTful service.
 *
 * Copyright (C) 2023 by Thilina Lakshan. All Rights Reserved.
 */

import {
  type ApiClientConfig,
  type ApiClientInterceptor,
  type ApiRequest,
  type ApiResponse
} from './types'
import * as _ from 'lodash'

export class ApiClient {
  private readonly baseUrl: Promise<string> | string
  private readonly globalHeaders: Record<string, string> = {}
  private readonly interceptors: ApiClientInterceptor[] = []

  constructor (config: ApiClientConfig) {
    if (config.interceptors) {
      this.interceptors.push(...config.interceptors)
    }
    this.baseUrl = config.baseUrl
    this.globalHeaders = config.globalHeaders ?? {}
    this.globalHeaders = { ...this.globalHeaders }
  }

  /**
   * Sends a GET request to the specified endpoint
   * @param endpoint
   * @param config
   * @throws HttpClientException
   * @returns {Promise<ApiResponse>}
   */
  public async get<T>(endpoint: string, config?: Omit<ApiRequest, 'method'>): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: 'GET', ...config })
  }

  /**
   * Sends a POST request to the specified endpoint
   * @param endpoint
   * @param config
   * @throws HttpClientException
   * @returns {Promise<ApiResponse>}
   */
  public async post<T>(endpoint: string, config?: Omit<ApiRequest, 'method'>): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: 'POST', ...config })
  }

  /**
   * Sends a PUT request to the specified endpoint
   * @param endpoint
   * @param config
   * @throws HttpClientException
   * @returns {Promise<ApiResponse>}
   */
  public async put<T>(endpoint: string, config?: Omit<ApiRequest, 'method'>): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: 'PUT', ...config })
  }

  /**
   * Sends a DELETE request to the specified endpoint
   * @param endpoint
   * @param config
   * @throws HttpClientException
   * @returns {Promise<ApiResponse>}
   */
  public async delete<T>(endpoint: string, config?: Omit<ApiRequest, 'method'>): Promise<ApiResponse<T>> {
    return await this.request<T>(endpoint, { method: 'DELETE', ...config })
  }

  /**
   * Sends a request to the specified endpoint
   * @param endpoint
   * @param config
   * @throws HttpClientException
   * @returns {Promise<ApiResponse>}
   * @private
   */
  private async request<T>(endpoint: string, config: ApiRequest): Promise<ApiResponse<T>> {
    for (const interceptor of this.interceptors) {
      config = await interceptor(config)
    }

    const url = new URL(endpoint, await this.baseUrl)

    const queryParameters = _.omitBy(config.query, (value: string | undefined )=> value === '' || value === undefined)
    Object.keys(queryParameters).forEach(key => {
      url.searchParams.append(key, String(queryParameters[key]))
    })

    const pathParameters = _.omitBy(config.params ?? {}, _.isNil)
    Object.keys(pathParameters).forEach(key => {
      url.pathname = url.pathname.replace(encodeURIComponent(`{${key}}`), String(pathParameters[key]))
    })

    if (url.pathname.includes('{')) { // check if there are any unused path parameters
      throw new Error(`Missing path parameters: ${url.pathname.match(/{([^}]+)}/g)?.join(', ') ?? ''}`)
    }

    const response: Response = await fetch(url.toString(), {
      method: config.method,
      headers: { ...this.globalHeaders, ...config.headers },
      body: config.method === 'GET' || config.method === 'DELETE' ? null : JSON.stringify(config.body)
    })

    if (config.streamResponse) {
      return {
        body: response.body,
        status: response.status,
        headers: response.headers,
        ok: response.ok
      } as ApiResponse<T>
    }

    if (!response.ok) {
      return {
        body: await response.json(),
        status: response.status,
        headers: response.headers,
        ok: false
      } as ApiResponse<T>
    }

    return {
      body: await response.json(),
      status: response.status,
      headers: response.headers,
      ok: true
    } as ApiResponse<T>
  }
}
