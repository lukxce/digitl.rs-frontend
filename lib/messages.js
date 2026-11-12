import { getStrapiUrl } from "./strapi.js";

/**
 * @param {{ email: string; text: string; page?: string }} payload
 */
export async function createMessage({ email, text }) {
  const payload = { email, text };
  const headers = new Headers({ "Content-Type": "application/json" });
  if (process.env.STRAPI_API_TOKEN) {
    headers.set("Authorization", `Bearer ${process.env.STRAPI_API_TOKEN}`);
  }

  const res = await fetch(getStrapiUrl("api/messages"), {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: payload,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Strapi ${res.status} ${res.statusText}: ${body.slice(0, 500)}`,
    );
  }

  return res.json();
}
