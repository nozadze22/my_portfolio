const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
  /** Internal: prevent infinite refresh loops */
  _retryAfterRefresh?: boolean;
};

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const url = new URL(`${API_URL}/auth/refresh`);
      const res = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

const NO_REFRESH_PATHS = ["/auth/refresh", "/auth/login", "/auth/register", "/auth/logout"];

function shouldAttemptRefresh(path: string, status: number, retried: boolean) {
  if (status !== 401 || retried) return false;
  return !NO_REFRESH_PATHS.some((p) => path === p || path.startsWith(`${p}?`));
}

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, headers, _retryAfterRefresh = false, ...fetchOptions } = options;

  const url = new URL(
    `${API_URL}${path.startsWith('/') ? path : `/${path}`}`,
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const isFormData = fetchOptions.body instanceof FormData;

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    credentials: "include",
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  if (shouldAttemptRefresh(path, response.status, _retryAfterRefresh)) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      return api<T>(path, { ...options, _retryAfterRefresh: true });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || `Request failed: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}