import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// In-memory auth state, hydrated by AuthTokensBridge.
let accessToken: string | null = null;
let refreshToken: string | null = null;
let isAuthenticated = false;
let loggingOut = false;

export function setAuthTokens(at: string | null, rt: string | null) {
  accessToken = at;
  refreshToken = rt;
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
}

export function setAuthState(auth: boolean) {
  isAuthenticated = auth;
}

// Queue requests while refresh is in progress.
let isRefreshing = false;
let pendingQueue: Array<(t: string | null) => void> = [];
const queueUntilRefreshed = () => new Promise<string | null>((res) => pendingQueue.push(res));
const flushQueue = (t: string | null) => {
  pendingQueue.forEach((r) => r(t));
  pendingQueue = [];
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config: any) => {
  if (accessToken) {
    if (!config.headers) config.headers = {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !original?._retry && refreshToken) {
      original._retry = true;
      try {
        if (isRefreshing) {
          const newToken = await queueUntilRefreshed();
          if (!newToken) throw new Error("refresh failed");
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          return apiClient(original);
        }
        isRefreshing = true;
        const { data } = await axios.post(
          `${BASE_URL}/api/auth/token/refresh/`,
          { refresh: refreshToken },
          { withCredentials: true }
        );
        const newAccess = (data as any)?.access as string | undefined;
        if (!newAccess) throw new Error("no access");

        accessToken = newAccess;
        flushQueue(newAccess);
        isRefreshing = false;

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return apiClient(original);
      } catch {
        isRefreshing = false;
        flushQueue(null);
        clearAuthTokens();
        if (isAuthenticated && !loggingOut) {
          loggingOut = true;
          await signOut({ callbackUrl: "/login" }).catch(() => {});
          loggingOut = false;
        }
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      if (isAuthenticated && !loggingOut) {
        loggingOut = true;
        clearAuthTokens();
        await signOut({ callbackUrl: "/login" }).catch(() => {});
        loggingOut = false;
      }
    }
    return Promise.reject(error);
  }
);
