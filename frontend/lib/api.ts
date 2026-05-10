/**
 * API helper — รวม base URL + helper สำหรับเรียก backend
 *
 * วิธีใช้:
 *   import { api, getCurrentUserId } from '../lib/api';
 *
 *   const data = await api.get('/api/me/U00001');
 *   const result = await api.post('/api/auth/login', { username, password });
 */

export const API_BASE = "http://localhost:5000";

class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T = unknown>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? (data as { message: string }).message
        : `HTTP ${res.status}`) ?? `HTTP ${res.status}`;
    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}

export const api = {
  get: <T = unknown>(path: string) => request<T>("GET", path),
  post: <T = unknown>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T = unknown>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T = unknown>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T = unknown>(path: string) => request<T>("DELETE", path),
};

export { ApiError };

/* =============================================================================
 * Session helpers — ใช้ localStorage เก็บ user หลัง login
 * (ในโปรเจคจริงควรใช้ JWT + httpOnly cookie แต่ตามสเปก "ชั่งแม่งเรื่อง Security")
 * ===========================================================================*/

export interface SessionUser {
  user_id: string;
  username: string;
  email: string;
  img_path: string | null;
  user_role: "admin" | "customer";
  country_code: string | null;
}

const STORAGE_KEY = "modtube_user";

export function setCurrentUser(user: SessionUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getCurrentUser(): SessionUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function getCurrentUserId(): string | null {
  return getCurrentUser()?.user_id ?? null;
}

export function clearCurrentUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}
