import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { googleLoginApi, logoutApi, getMeApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const queryKeys = {
  me: ["me"] as const,
};

// ─── Get current user ─────────────────────────────────────────
export const useMe = () =>
  useQuery({
    queryKey: queryKeys.me,
    queryFn: getMeApi,
    select: (response) => response.data,
    retry: false,        // don't retry on 401 — user is just not logged in
    staleTime: 1000 * 60 * 5, // 5 min
  });

// ─── Google Login ─────────────────────────────────────────────
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (code: string) => googleLoginApi(code),
    onSuccess: async () => {
      // Wait for useMe to refetch BEFORE navigating
      await queryClient.invalidateQueries({ 
        queryKey: queryKeys.me,
        refetchType: "all", // ← force immediate refetch
      });
      navigate("/chat-panel");
    },
  });
};

// ─── Logout ───────────────────────────────────────────────────
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear(); // clear ALL cached data
      navigate("/");
    },
  });
};