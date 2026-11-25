const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

export async function api<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

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
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

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