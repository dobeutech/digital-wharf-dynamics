/**
 * Netlify Functions API client with Auth0 token support
 * Use this in React components via useApi hook
 */

import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { apiRequest, RequestOptions } from "./api-client";

class ApiClient {
  private baseUrl: string;
  private getToken: () => Promise<string | null>;

  constructor(getToken: () => Promise<string | null>) {
    // Use Netlify Functions URL in production, localhost in development
    this.baseUrl = import.meta.env.PROD
      ? "/.netlify/functions"
      : "http://localhost:8888/.netlify/functions";
    this.getToken = getToken;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = await this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const headers = await this.getHeaders();
    return apiRequest<T>(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "GET",
      headers: { ...headers, ...options?.headers },
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const headers = await this.getHeaders();
    return apiRequest<T>(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "POST",
      headers: { ...headers, ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    const headers = await this.getHeaders();
    return apiRequest<T>(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "PUT",
      headers: { ...headers, ...options?.headers },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const headers = await this.getHeaders();
    return apiRequest<T>(`${this.baseUrl}${endpoint}`, {
      ...options,
      method: "DELETE",
      headers: { ...headers, ...options?.headers },
    });
  }
}

/**
 * React hook to get API client with Auth0 token support
 */
export function useApi() {
  const { getAccessToken } = useAuth();

  return useMemo(() => {
    return new ApiClient(getAccessToken);
  }, [getAccessToken]);
}
