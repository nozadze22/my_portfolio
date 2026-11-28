import type { AuthUser } from "@/features/auth/schema/auth.schema";

export function pathAfterLogin(user: AuthUser) {
  return user.role === "ADMIN" ? "/admin/dashboard" : "/account";
}