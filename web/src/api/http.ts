import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '@/types';
import { storage, StorageKeys } from '@/utils/storage';

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// 请求拦截：自动加 token 和 X-User-Id
http.interceptors.request.use((config) => {
  const token = storage.get<string | null>(StorageKeys.token, null);
  const userId = storage.get<number | null>(StorageKeys.userId, null);
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (userId) config.headers['X-User-Id'] = String(userId);
  return config;
});

// 响应拦截：拆出 data 字段
http.interceptors.response.use(
  (resp) => {
    const body = resp.data as ApiResponse<unknown>;
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 0) {
        return body.data as never;
      }
      return Promise.reject(new Error(body.message || '请求失败'));
    }
    return resp.data as never;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const msg = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(msg));
  }
);

// 泛型请求助手
export function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return http.get<unknown, T>(url, { params });
}
export function post<T>(url: string, data?: unknown): Promise<T> {
  return http.post<unknown, T>(url, data);
}
export function put<T>(url: string, data?: unknown): Promise<T> {
  return http.put<unknown, T>(url, data);
}
export function del<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  return http.delete<unknown, T>(url, { params });
}
