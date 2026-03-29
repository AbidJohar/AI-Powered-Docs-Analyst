import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { googleLoginApi, logoutApi, getMeApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const queryKeys = {
  me: ["me"] as const,
};

// ─── Get current user ─────────────────────────────────────────
export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMeApi,
    // select allows you to transform the data before returning it
    select: (response) => response?.data ?? null, // only return the 'data' property
    retry: false,
    staleTime: 0,              // ← no retries on failure
    refetchOnWindowFocus: false, // ← no refetch on tab switch
    refetchOnMount: true,       // ← no refetch on remount
  });
}


// ─── Google Login ─────────────────────────────────────────────
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (code: string) => googleLoginApi(code),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.me,
      });

      navigate("/chat-panel");
    }
  });
};

// ─── Logout ───────────────────────────────────────────────────
export const useLogout = () => {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear(); // clear ALL cached data
      window.location.href = "/";
    },
  });
};