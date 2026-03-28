import { api, authApi } from "./client";


// // ─── Main API (with interceptor) — for protected endpoints ────
// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: { "Content-Type": "application/json" },
//     withCredentials: true,
// });

// // ─── Auth API (NO interceptor) — for auth endpoints only ──────
// const authApi = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL,
//     headers: { "Content-Type": "application/json" },
//     withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

// const processQueue = (error: any) => {
//     failedQueue.forEach((prom) =>
//         error ? prom.reject(error) : prom.resolve(null)
//     );
//     failedQueue = [];
// };

// // Interceptor ONLY on main api
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // ─── Skip refresh for auth-specific endpoints ──────────────
//         if (
//             originalRequest._retry ||
//             originalRequest.url?.includes("/auth/refresh") ||
//             originalRequest.url?.includes("/auth/google-login") ||
//             originalRequest.url?.includes("/auth/logout")
//         ) {
//             return Promise.reject(error);
//         }

//         if (error.response?.status === 401) {
//             // ─── Queue subsequent 401s while refresh is in progress ───
//             if (isRefreshing) {
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then(() => api(originalRequest))
//                     .catch((err) => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 await authApi.post("/auth/refresh");
//                 console.log("✅ Refresh succeeded, retrying:", originalRequest.url);
//                 console.log("Request data:", originalRequest.data);  // ← is the body still there?
//                 processQueue(null);
//                 const retryResult = await api({ ...originalRequest });
//                 console.log("✅ Retry succeeded:", retryResult.status);
//                 return retryResult;
//             } catch (refreshError: any) {
//                 processQueue(refreshError);
//                 isRefreshing = false;
              
//                 return Promise.reject(refreshError);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// ─────────────────────────────────────────────────────────────
// getMeApi uses `api` (with interceptor), because
// This allows the 401 → refresh → retry flow to work correctly
// ─────────────────────────────────────────────────────────────
export const getMeApi = async () => {
    try {
        const { data } = await api.get("/auth/my-profile"); // ← was authApi, now api
        return data;
    } catch (err: any) {
        // After refresh attempt fails (interceptor already tried), return null
        if (err.response?.status === 401) return null;
        throw err;
    }
};

export const googleLoginApi = async (code: string) => {
    const { data } = await authApi.post("/auth/google-login", { code });
    return data;
};

export const refreshTokenApi = async () => {
    const { data } = await authApi.post("/auth/refresh");
    return data;
};

export const logoutApi = async () => {
    const { data } = await authApi.get("/auth/logout");
    console.log("logout data:", data);

    return data;
};

export default api;