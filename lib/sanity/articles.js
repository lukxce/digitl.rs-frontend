/**
 * Sanity Article helpers — drop-in replacement for the Strapi-backed lib/articles.js.
 * Every exported function returns the same normalized shape so the rest of the app
 * is agnostic to the data source.
 */

import { sanityClient, sanityImageSrc } from "./client.js";

/* -------------------------------------------------------------------------- */
/*  GROQ fragments                                                            */
/* -------------------------------------------------------------------------- */

const articleProjection = `{
  _id,
  title,
  slug,
  description,
  excerpt,
  subtitle,
  publishedAt,
  cover,
  author,
  blocks,
  keyTakeaways
}`;

/* -------------------------------------------------------------------------- */
/*  Normalisers                                                               */
/* -------------------------------------------------------------------------- */

/** @param {unknown} raw Sanity key-takeaway item */
function normalizeKeyTakeawayItem(item) {
  if (!item || typeof item !== "object") return null;

  const title =
    typeof item.title === "string" && item.title.trim().length > 0
      ? item.title.trim()
      : typeof item.heading === "string" && item.heading.trim().length > 0
        ? item.heading.trim()
        : null;

  const description =
    typeof item.description === "string" && item.description.trim().length > 0
      ? item.description.trim()
      : typeof item.subtitle === "string" && item.subtitle.trim().length > 0
        ? item.subtitle.trim()
        : typeof item.text === "string" && item.text.trim().length > 0
          ? item.text.trim()
          : null;

  if (!title && !description) return null;
  return { title: title ?? "", description: description ?? "" };
}

/** @param {unknown} raw */
function normalizeKeyTakeaways(raw) {
  const value = raw?.keyTakeaways ?? raw?.key_takeaways ?? null;
  if (!Array.isArray(value)) return [];
  return value.map(normalizeKeyTakeawayItem).filter(Boolean);
}

/** @param {unknown} author */
function normalizeAuthor(author) {
  if (author == null || typeof author !== "object") {
    return { name: null, imageUrl: null, imageAlt: null };
  }

  const name =
    typeof author.name === "string" && author.name.trim().length > 0
      ? author.name.trim()
      : null;

  const imageUrl = sanityImageSrc(author.avatar);
  const imageAlt = name;

  return { name, imageUrl, imageAlt };
}

/** @param {unknown} entry  A single Sanity article document */
export function normalizeArticle(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (!entry.title) return null;

  const id = entry._id;
  const slug =
    typeof entry.slug === "string" && entry.slug.length > 0
      ? entry.slug
      : typeof entry.slug?.current === "string" && entry.slug.current.length > 0
        ? entry.slug.current
        : String(id ?? "");

  return {
    id,
    documentId: id,
    slug,
    title: String(entry.title),
    subtitle:
      typeof entry.subtitle === "string" && entry.subtitle.trim().length > 0
        ? entry.subtitle.trim()
        : null,
    description:
      typeof entry.description === "string" &&
      entry.description.trim().length > 0
        ? entry.description.trim()
        : null,
    author: normalizeAuthor(entry.author),
    publishedAt: entry.publishedAt ?? null,
    excerpt:
      typeof entry.excerpt === "string" ? entry.excerpt : (entry.excerpt ?? null),
    blocks: Array.isArray(entry.blocks) ? entry.blocks : null,
    coverUrl: sanityImageSrc(entry.cover),
    keyTakeaways: normalizeKeyTakeaways(entry),
  };
}

/** @param {unknown} json  Kept for parity with the Strapi version. */
export function normalizeArticlesResponse(json) {
  if (!Array.isArray(json)) return [];
  return json.map(normalizeArticle).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Data-fetching                                                             */
/* -------------------------------------------------------------------------- */

/** Home page list (newest first). */
export async function getArticlesForHome(limit = 10) {
  const query = `*[_type == "article"] | order(publishedAt desc) [0...$limit] ${articleProjection}`;
  const results = await sanityClient.fetch(query, { limit });
  return normalizeArticlesResponse(results);
}

/** Safe wrapper — returns [] when Sanity is unreachable or misconfigured. */
export async function tryGetArticlesForHome(limit = 10) {
  try {
    return await getArticlesForHome(limit);
  } catch {
    return [];
  }
}

/**
 * Single article by slug or _id for `/journal/[param]`.
 * @param {string} param  URL segment from Next route
 */
export async function findArticleBySlugOrId(param) {
  // Try by slug first (most common for real URLs)
  const bySlugQuery = `*[_type == "article" && (slug == $param || slug.current == $param)] [0] ${articleProjection}`;
  const bySlug = await sanityClient.fetch(bySlugQuery, { param });
  if (bySlug) return normalizeArticle(bySlug);

  // Fall back to _id
  const byIdQuery = `*[_type == "article" && _id == $param] [0] ${articleProjection}`;
  const byId = await sanityClient.fetch(byIdQuery, { param });
  if (byId) return normalizeArticle(byId);

  return null;
}

export async function tryFindArticle(param) {
  try {
    return await findArticleBySlugOrId(param);
  } catch {
    return null;
  }
}
