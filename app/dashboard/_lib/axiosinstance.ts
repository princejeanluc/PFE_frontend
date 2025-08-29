// dashboard/_lib/axiosinstance.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { signOut } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// --- petit store mémoire alimenté par AuthProvider ---
let accessToken: string | null = null;
let refreshToken: string | null = null;
let isAuthenticated = false;      // <— état courant
let loggingOut = false;           // <— évite les logout multiples

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

// --- file d’attente quand un refresh est en cours ---
let isRefreshing = false;
let pendingQueue: Array<(t: string | null) => void> = [];
const queueUntilRefreshed = () => new Promise<string | null>(res => pendingQueue.push(res));
const flushQueue = (t: string | null) => { pendingQueue.forEach(r => r(t)); pendingQueue = []; };

// --- instance ---
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ok si CORS_allow_credentials = true
});

// --- Authorization header sur chaque requête ---
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${accessToken}` };
  }
  return config;
});

// --- Refresh sur 401 / Logout unique sinon ---
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean });

    // 401 + on a un refresh → tente un refresh une fois
    if (error.response?.status === 401 && !original?._retry && refreshToken) {
      original._retry = true;
      try {
        if (isRefreshing) {
          const newToken = await queueUntilRefreshed();
          if (!newToken) throw new Error("refresh failed");
          original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
          return api(original);
        }
        isRefreshing = true;
        const { data } = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, { refresh: refreshToken }, { withCredentials: true });
        const newAccess = (data as any)?.access as string | undefined;
        if (!newAccess) throw new Error("no access");

        accessToken = newAccess;
        flushQueue(newAccess);
        isRefreshing = false;

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return api(original);
      } catch {
        isRefreshing = false;
        flushQueue(null);
        clearAuthTokens();
        // important: ne déconnecte que si on était authentifié
        if (isAuthenticated && !loggingOut) {
          loggingOut = true;
          await signOut({ callbackUrl: "/login" }).catch(() => {});
          loggingOut = false;
        }
        return Promise.reject(error);
      }
    }

    // 401 sans refresh → ne tente pas de logout si visiteur anonyme
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

export default api;
