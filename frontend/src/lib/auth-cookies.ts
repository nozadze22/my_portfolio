export const ACCESS_TOKEN_COOKIE = "restaurants_access_token";
export const REFRESH_TOKEN_COOKIE = "restaurants_refresh_token";
export const USER_ROLE_COOKIE = "restaurants_role";
export const SESSION_INDICATOR_COOKIE = "restaurants_session";
export const HUMAN_VERIFIED_COOKIE = "supra_human_verified";
export type ClientUserRole =
  | "admin"
  | "accountant"
  | "restaurant_owner"
  | "waiter"
  | "user";

const HUMAN_VERIFIED_MAX_AGE_SECONDS = 60 * 60 * 24;

function buildCookie(
  name: string,
  value: string,
  maxAge: number,
): string {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  if (!match) return null;

  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function getClientUserRoleCookie(): ClientUserRole | null {
  const value = readCookie(USER_ROLE_COOKIE);
  if (
    value === "admin" ||
    value === "accountant" ||
    value === "restaurant_owner" ||
    value === "waiter" ||
    value === "user"
  ) {
    return value;
  }
  return null;
}

export function isHumanVerifiedCookieSet(): boolean {
  return readCookie(HUMAN_VERIFIED_COOKIE) === "1";
}

export function setHumanVerifiedCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = buildCookie(
    HUMAN_VERIFIED_COOKIE,
    "1",
    HUMAN_VERIFIED_MAX_AGE_SECONDS,
  );
}

export function clearHumanVerifiedCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${HUMAN_VERIFIED_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** @deprecated Auth tokens are HttpOnly — set via /api/auth/* route handlers. */
export function setClientAccessTokenCookie(...args: [string]): void {
  void args;
}

/** @deprecated Auth tokens are HttpOnly — set via /api/auth/* route handlers. */
export function setClientRefreshTokenCookie(...args: [string]): void {
  void args;
}

/** @deprecated Auth tokens are HttpOnly — set via /api/auth/* route handlers. */
export function setClientAuthCookies(...args: [string, ClientUserRole, string?]): void {
  void args;
}

export function clearClientAuthCookies(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_INDICATOR_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${USER_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasClientAuthSession(): boolean {
  return readCookie(SESSION_INDICATOR_COOKIE) === "1";
}
