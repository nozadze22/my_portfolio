/** Trim and strip accidental quotes from env-sourced or pasted URLs. */
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (url == null) return null;
  const trimmed = url.trim().replace(/^["']|["']$/g, "");
  return trimmed.length > 0 ? trimmed : null;
}

const LOCAL_UPLOAD_PATH =
  /^(?:https?:\/\/[^/]+)?\/uploads\/(projects|profile|misc)\/(.+)$/i;

/** Legacy URLs served from Nest `uploads/` — map to R2 public object path (same key layout). */
export function localUploadUrlToR2Public(
  url: string,
  publicBaseUrl: string,
): string | null {
  const normalized = normalizeMediaUrl(url);
  if (!normalized) return null;

  const base = publicBaseUrl.replace(/\/$/, "");
  const match = normalized.match(LOCAL_UPLOAD_PATH);
  if (!match) return null;

  const [, scope, filename] = match;
  return `${base}/${scope}/${filename}`;
}

export function isLegacyLocalUploadUrl(url: string): boolean {
  const normalized = normalizeMediaUrl(url);
  if (!normalized) return false;
  if (LOCAL_UPLOAD_PATH.test(normalized)) return true;
  return normalized.includes("/uploads/") && normalized.includes("localhost");
}