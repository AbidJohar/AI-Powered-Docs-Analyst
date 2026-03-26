// authapi.tsimport axios from "axios";
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ← sends cookies automatically
});

export const googleLoginApi = async (code: string) => {
    const { data } = await api.post("/auth/google-login", { code });

    return data;
};

export const refreshTokenApi = async () => {
    const { data } = await api.post("/auth/refresh");
    return data;
};

export const logoutApi = async () => {
    const { data } = await api.get("/auth/logout");
    return data;
};

export const getMeApi = async () => {
    const { data } = await api.get("/auth/my-profile");
    return data;
};