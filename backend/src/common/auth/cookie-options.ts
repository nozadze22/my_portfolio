import type { CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const prod = () => process.env.NODE_ENV === "production";

/** Lax on localhost; `none` when API and Next.js are on different hosts (e.g. Fly + Vercel). */
function cookieSameSite(): CookieOptions["sameSite"] {
  if (!prod()) return "lax";
  const cors = process.env.CORS_ORIGIN ?? "";
  const crossOrigin =
    cors.length > 0 &&
    !cors.split(",").some((o) => /localhost|127\.0\.0\.1/i.test(o.trim()));
  return crossOrigin ? "none" : "lax";
}

export function accessTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: prod(),
    sameSite: cookieSameSite(),
    path: "/",
    maxAge: Number(process.env.JWT_EXPIRES_MS ?? 15 * 60 * 1000),
  };
}

export function refreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: prod(),
    sameSite: cookieSameSite(),
    path: "/",
    maxAge: Number(process.env.JWT_REFRESH_EXPIRES_MS ?? 30 * 24 * 60 * 60 * 1000),
  };
}