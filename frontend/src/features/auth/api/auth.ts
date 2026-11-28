import { api } from "@/lib/api";
import type { AuthUser, LoginInput, RegisterInput } from "../schema/auth.schema";

export async function registerUser(data: RegisterInput) {
  return api<{ user: AuthUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: LoginInput) {
  return api<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshAuthSession() {
  return api<{ user: AuthUser }>("/auth/refresh", { method: "POST" });
}

export async function logoutUser() {
  return api<{ ok: boolean }>("/auth/logout", { method: "POST" });
}

export async function getAuthMe() {
  return api<AuthUser>("/auth/me");
}