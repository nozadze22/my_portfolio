import { redirect } from "@tanstack/react-router";
import { getAuthMe } from "@/features/auth/api/auth";

export async function ensureAdminAuth() {
  let user;
  try {
    user = await getAuthMe();
  } catch {
    throw redirect({ to: "/login", search: { next: "/admin/dashboard" } });
  }

  if (user.role !== "ADMIN") {
    throw redirect({
      to: "/account",
      search: { forbidden: "admin" },
    });
  }

  return user;
}

export async function ensureUserAuth() {
  try {
    return await getAuthMe();
  } catch {
    throw redirect({ to: "/login", search: { next: "/account" } });
  }
}