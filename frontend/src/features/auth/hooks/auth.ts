"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthMe, loginUser, logoutUser, registerUser } from "../api/auth";
import type { LoginInput, RegisterInput } from "../schema/auth.schema";

export const AUTH_ME_KEY = ["auth", "me"] as const;

export function useAuthMe() {
  return useQuery({
    queryKey: AUTH_ME_KEY,
    queryFn: getAuthMe,
    retry: false,
    staleTime: 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginInput) => loginUser(data),
    onSuccess: (res) => {
      qc.setQueryData(AUTH_ME_KEY, res.user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RegisterInput) => registerUser(data),
    onSuccess: (res) => {
      qc.setQueryData(AUTH_ME_KEY, res.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      qc.setQueryData(AUTH_ME_KEY, null);
      qc.removeQueries({ queryKey: AUTH_ME_KEY });
    },
  });
}