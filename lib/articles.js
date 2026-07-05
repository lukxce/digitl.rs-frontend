/**
 * Strapi Article collection helpers (REST plural API ID defaults to `articles`).
 */

import { normalizeKeyTakeaways } from "./keyTakeaways.js";
import { fetchStrapiCollection } from "./strapi.js";
import { strapiMediaUrl } from "./strapiMedia.js";

function articlePlural() {
  return process.env.STRAPI_ARTICLE_PLURAL ?? "articles";
}

/** Strapi v5 blog template: list every dynamic-zone component in `on`. */
function articleFetchQuery(extra = {}) {
  return {
    "populate[cover][fields][0]": "url",
    "populate[cover][fields][1]": "alternativeText",
    "populate[author][fields][0]": "name",
    "populate[author][populate][avatar][fields][0]": "url",
    "populate[author][populate][avatar][fields][1]": "alternativeText",
    "populate[blocks][on][shared.rich-text]": "true",
    "populate[blocks][on][shared.quote]": "true",
    "populate[blocks][on][shared.media][populate][file][fields][0]": "url",
    "populate[blocks][on][shared.slider][populate][files][fields][0]": "url",
    "populate[keyTakeaways][populate]": "*",
    ...extra,
  };
}

function unwrapEntry(entry) {
  if (!entry) return null;
  if (entry.attributes) {
    return {
      id: entry.id,
      documentId: entry.documentId,
      ...entry.attributes,
    };
  }
  return entry;
}

/** @param {Record<string, unknown>} raw */
function firstCoverUrl(raw) {
  if (typeof raw !== "object" || raw === null) return null;
  const keys = [
    "cover",
    "thumbnail",
    "heroImage",
    "featuredImage",
    "image",
    "hero",
  ];
  for (const key of keys) {
    const u = strapiMediaUrl(raw[key]);
    if (u) return u;
  }
  return null;
}

/** @param {Record<string, unknown>} raw */
function pickSubtitle(raw) {
  const candidates = [
    raw.subtitle,
    raw.subTitle,
    raw.deck,
    raw.lead,
    raw.introduction,
    raw.summary,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return null;
}

/** @param {Record<string, unknown>} raw */
function pickDescription(raw) {
  if (typeof raw.description !== "string") return null;
  const description = raw.description.trim();
  return description.length > 0 ? description : null;
}

/** @param {unknown} author */
function normalizeAuthor(author) {
  if (author == null || typeof author !== "object") {
    return { name: null, imageUrl: null, imageAlt: null };
  }

  const record = author.attributes ?? author;
  const name =
    typeof record.name === "string" && record.name.trim().length > 0
      ? record.name.trim()
      : typeof record.email === "string" && record.email.trim().length > 0
        ? record.email.trim()
        : null;
  const avatar = record.avatar ?? record.image ?? record.photo ?? null;
  const imageUrl = strapiMediaUrl(avatar);
  const avatarAttrs =
    avatar && typeof avatar === "object" ? (avatar.attributes ?? avatar) : null;
  const imageAlt =
    typeof avatarAttrs?.alternativeText === "string"
      ? avatarAttrs.alternativeText
      : name;

  return { name, imageUrl, imageAlt };
}

/** @param {Record<string, unknown>} raw */
function normalizeBodyBlocks(raw) {
  const b = raw.body ?? raw.content ?? raw.richText ?? raw.blocks ?? null;
  if (b == null) return null;
  if (typeof b === "string") return b;
  if (Array.isArray(b)) return b;
  if (typeof b === "object" && Array.isArray(b.data)) return b.data;
  return null;
}

/** @param {unknown} entry */
export function normalizeArticle(entry) {
  const raw = unwrapEntry(entry);
  if (!raw?.title) return null;

  const id = raw.documentId ?? raw.id;
  const slug =
    typeof raw.slug === "string" && raw.slug.length > 0
      ? raw.slug
      : String(id ?? "");

  return {
    id,
    documentId: raw.documentId,
    slug,
    title: String(raw.title),
    subtitle: pickSubtitle(raw),
    description: pickDescription(raw),
    author: normalizeAuthor(raw.author),
    publishedAt: raw.publishedAt ?? raw.createdAt ?? null,
    excerpt:
      typeof raw.excerpt === "string" ? raw.excerpt : (raw.excerpt ?? null),
    blocks: normalizeBodyBlocks(raw),
    coverUrl: firstCoverUrl(raw),
    keyTakeaways: normalizeKeyTakeaways(raw),
  };
}

/** @param {unknown} json */
export function normalizeArticlesResponse(json) {
  const raw = json?.data;
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeArticle).filter(Boolean);
}

/** Home page list (newest first). */
export async function getArticlesForHome(limit = 10) {
  const plural = articlePlural();
  const json = await fetchStrapiCollection(
    plural,
    articleFetchQuery({
      sort: "publishedAt:desc",
      "pagination[pageSize]": String(limit),
    }),
  );
  return normalizeArticlesResponse(json);
}

/** Safe wrapper — returns [] when Strapi is unreachable or misconfigured. */
export async function tryGetArticlesForHome(limit = 10) {
  try {
    return await getArticlesForHome(limit);
  } catch {
    return [];
  }
}

/**
 * Single article by slug, documentId, or numeric id for `/journal/[param]`.
 * @param {string} param URL segment from Next route
 */
export async function findArticleBySlugOrId(param) {
  const plural = articlePlural();
  const base = articleFetchQuery({
    "pagination[pageSize]": "1",
  });

  const first = async (extra) => {
    const json = await fetchStrapiCollection(plural, { ...base, ...extra });
    const item = json?.data?.[0];
    return item ? normalizeArticle(item) : null;
  };

  const bySlug = await first({ "filters[slug][$eq]": param });
  if (bySlug) return bySlug;

  const byDoc = await first({ "filters[documentId][$eq]": param });
  if (byDoc) return byDoc;

  const n = Number.parseInt(param, 10);
  if (String(n) === param && !Number.isNaN(n)) {
    const byId = await first({ "filters[id][$eq]": String(n) });
    if (byId) return byId;
  }

  return null;
}

export async function tryFindArticle(param) {
  try {
    return await findArticleBySlugOrId(param);
  } catch {
    return null;
  }
}
