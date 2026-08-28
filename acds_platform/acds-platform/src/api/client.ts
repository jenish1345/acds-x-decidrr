/**
 * HTTP client with retry, timeout, and error handling
 */

import { env } from '../config/env';
import { NetworkError, AppError } from '../utils/errorHandler';
import { retry } from '../utils/retry';
import { logger } from '../utils/logger';

interface RequestConfig extends RequestInit {
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string = env.apiUrl, timeout: number = env.apiTimeout) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response> {
    const { timeout = this.defaultTimeout, ...fetchConfig } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const { retry: shouldRetry = true, maxRetries = 3, ...fetchConfig } = config;

    logger.debug(`API Request: ${config.method || 'GET'} ${endpoint}`);

    const makeRequest = async (): Promise<T> => {
      const response = await this.fetchWithTimeout(url, fetchConfig);

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          errorText || `HTTP ${response.status}: ${response.statusText}`,
          'API_ERROR',
          response.status
        );
      }

      return response.json();
    };

    try {
      if (shouldRetry) {
        return await retry(makeRequest, { maxAttempts: maxRetries });
      }
      return await makeRequest();
    } catch (error) {
      logger.error(`API Error: ${endpoint}`, { error });
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data)
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
