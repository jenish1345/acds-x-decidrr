/**
 * API response types for type-safe API calls
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiRequestConfig {
  timeout?: number;
  retry?: boolean;
  maxRetries?: number;
  headers?: Record<string, string>;
}
