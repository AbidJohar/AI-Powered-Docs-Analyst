import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Instance for calls that REQUIRE a session
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Instance for Auth (Login/Refresh) to avoid interceptor recursion
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    console.log("Error in interceptors:", error);
    console.log("origingal Reuqest:", originalRequest);
    // ─── Skip interceptor for auth-check endpoint ────────────
    // if /my-profile 401s, it just means user is not logged in
    // let it fail naturally so useMe → isError: true → isLoading: false
    const isAuthCheck = originalRequest.url?.includes("/auth/my-profile");
    if (isAuthCheck) {
      return Promise.reject(error); // ← pass straight through, no refresh attempt
    }

    // Only retry if status is 401 and it's not a retry already
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await authApi.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest); // Retries the 'ask' or 'getMe' call
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);