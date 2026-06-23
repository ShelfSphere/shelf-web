import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
}

if (typeof window !== "undefined") {
  // Attach access token to every request
  api.interceptors.request.use(async (config) => {
    const session = await getSession();
    if (session?.user?.accessToken) {
      config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    }
    return config;
  });

  // On 401 — refresh the token, retry the original request
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;

      if (error.response?.status !== 401 || original._retry) {
        return Promise.reject(error);
      }

      original._retry = true;

      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const session = await getSession();
        const refreshToken = session?.user?.refreshToken;

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken: string = data.accessToken;

        // Update the NextAuth session with the new access token
        await fetch("/api/auth/session", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Store new token for immediate use in queued requests
        processQueue(null, newAccessToken);

        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh failed — sign out and redirect to login
        await signOut({ callbackUrl: "/sign-in" });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
