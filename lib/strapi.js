/**
 * Strapi REST API helpers for Next.js (Server Components, Route Handlers, etc.).
 * @see https://docs.strapi.io/dev-docs/api/rest
 */

const strapiUrl = process.env.STRAPI_URL?.replace(/\/$/, "") ?? "";

/**
 * @param {string} path - Path after the Strapi origin, e.g. `/api/articles` or `/api/articles?populate=*`
 */
export function getStrapiUrl(path) {
  if (!strapiUrl) {
    throw new Error("STRAPI_URL is not set");
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${strapiUrl}${normalized}`;
}

/**
 * @param {string} path - e.g. `api/articles?populate=*` (leading slash optional)
 * @param {RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }} [options]
 */
export async function fetchStrapi(path, options = {}) {
  const { next, headers: headerOverrides, ...init } = options;
  const url = getStrapiUrl(path);

  const headers = new Headers({ "Content-Type": "application/json" });
  if (headerOverrides) {
    new Headers(headerOverrides).forEach((value, key) => {
      headers.set(key, value);
    });
  }
  if (process.env.STRAPI_API_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.STRAPI_API_TOKEN}`);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    next: { revalidate: 60, ...next },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Strapi ${res.status} ${res.statusText}: ${body.slice(0, 500)}`,
    );
  }

  return res.json();
}

/**
 * Convenience: GET a collection by REST plural name (e.g. `articles` → `/api/articles`).
 * @param {string} pluralApiId - Strapi REST plural ID (Settings → Content-Type → API ID)
 * @param {Record<string, string | number | boolean | undefined>} [query] - e.g. { populate: '*', 'pagination[pageSize]': 10 }
 * @param {RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }} [options]
 */
export async function fetchStrapiCollection(
  pluralApiId,
  query = {},
  options = {},
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  const path = `api/${pluralApiId}${qs ? `?${qs}` : ""}`;
  return fetchStrapi(path, options);
}
