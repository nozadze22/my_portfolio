import type { CookieOptions } from "express";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const prod = () => process.env.NODE_ENV === "production";

export function accessTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: prod(),
    sameSite: "lax",
    path: "/",
    maxAge: Number(process.env.JWT_EXPIRES_MS ?? 15 * 60 * 1000),
  };
}

export function refreshTokenCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: prod(),
    sameSite: "lax",
    path: "/",
    maxAge: Number(process.env.JWT_REFRESH_EXPIRES_MS ?? 30 * 24 * 60 * 60 * 1000),
  };
}