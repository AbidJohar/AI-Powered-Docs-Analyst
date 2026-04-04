import { api, authApi } from "./client";


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