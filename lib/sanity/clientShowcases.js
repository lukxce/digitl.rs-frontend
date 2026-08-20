/**
 * Sanity Client Showcase helpers — drop-in replacement for the Strapi-backed
 * lib/clientShowcases.js.  Every exported function returns the same normalized
 * shape so the rest of the app is agnostic to the data source.
 */

import { sanityClient, sanityImageSrc } from "./client.js";

/* -------------------------------------------------------------------------- */
/*  GROQ fragments                                                            */
/* -------------------------------------------------------------------------- */

const showcaseProjection = `{
  _id,
  title,
  slug,
  description,
  category,
  clientName,
  clientWebsite,
  websiteUrl,
  publishedAt,
  coverPhoto,
  clientLogo,
  content,
  successRate,
  keyTakeaways
}`;

/* -------------------------------------------------------------------------- */
/*  Normalisers                                                               */
/* -------------------------------------------------------------------------- */

/** @param {unknown} item */
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

/** @param {unknown} item */
function normalizeSuccessRateItem(item) {
  if (!item || typeof item !== "object") return null;

  const title =
    typeof item.title === "string" && item.title.trim().length > 0
      ? item.title.trim()
      : typeof item.value === "string" && item.value.trim().length > 0
        ? item.value.trim()
        : typeof item.metric === "string" && item.metric.trim().length > 0
          ? item.metric.trim()
          : null;

  const subtitle =
    typeof item.subtitle === "string" && item.subtitle.trim().length > 0
      ? item.subtitle.trim()
      : typeof item.description === "string" &&
          item.description.trim().length > 0
        ? item.description.trim()
        : typeof item.label === "string" && item.label.trim().length > 0
          ? item.label.trim()
          : null;

  if (!title && !subtitle) return null;
  return { title: title ?? "", subtitle: subtitle ?? "" };
}

/** @param {unknown} raw */
function normalizeSuccessRate(raw) {
  const value = raw?.successRate ?? raw?.success_rate ?? null;
  if (!Array.isArray(value)) return [];
  return value.map(normalizeSuccessRateItem).filter(Boolean);
}

/** @param {Record<string, unknown>} raw */
function pickSlug(raw) {
  if (typeof raw.slug === "string" && raw.slug.trim().length > 0) {
    return raw.slug.trim();
  }
  if (
    raw.slug &&
    typeof raw.slug === "object" &&
    typeof raw.slug.current === "string" &&
    raw.slug.current.trim().length > 0
  ) {
    return raw.slug.current.trim();
  }
  return raw._id != null ? String(raw._id) : "";
}

/** @param {string} slug */
function pickHref(slug) {
  return slug ? `/projects/${encodeURIComponent(slug)}` : "/projects";
}

/** @param {Record<string, unknown>} raw */
function pickSubtitle(raw) {
  const category =
    typeof raw.category === "string" && raw.category.trim().length > 0
      ? raw.category.trim()
      : null;
  const clientName =
    typeof raw.clientName === "string" && raw.clientName.trim().length > 0
      ? raw.clientName.trim()
      : null;
  const publishedAt = raw.publishedAt ?? null;
  const year =
    typeof publishedAt === "string"
      ? new Date(publishedAt).getFullYear()
      : null;

  if (category && year) return `${category} · ${year}`;
  if (category && clientName) return `${category} · ${clientName}`;
  if (category) return category;
  if (clientName && year) return `${clientName} · ${year}`;
  if (clientName) return clientName;
  if (year) return String(year);
  return "";
}

/** @param {string} value */
function ensureUrl(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** @param {unknown} entry  A single Sanity showcase document */
export function normalizeClientShowcase(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (!entry.title) return null;

  const id = entry._id;
  const slug = pickSlug(entry);
  const coverUrl = sanityImageSrc(entry.coverPhoto ?? entry.cover);
  const logoUrl = sanityImageSrc(entry.clientLogo ?? entry.logo);
  const backgroundUrl = coverUrl ?? logoUrl ?? null;
  const thumbUrl = logoUrl ?? coverUrl ?? null;

  const category =
    typeof entry.category === "string" && entry.category.trim().length > 0
      ? entry.category.trim()
      : null;
  const clientName =
    typeof entry.clientName === "string" && entry.clientName.trim().length > 0
      ? entry.clientName.trim()
      : null;

  return {
    id,
    documentId: id,
    slug,
    href: pickHref(slug),
    category,
    clientName,
    websiteUrl: ensureUrl(entry.clientWebsite ?? entry.websiteUrl),
    publishedAt: entry.publishedAt ?? null,
    content: Array.isArray(entry.content) ? entry.content : null,
    coverUrl: backgroundUrl,
    backgroundSrc: backgroundUrl,
    backgroundAlt:
      (typeof entry.title === "string" && entry.title) || "",
    thumbSrc: thumbUrl,
    thumbAlt:
      (typeof entry.clientName === "string" && entry.clientName) || "",
    title: String(entry.title),
    description:
      typeof entry.description === "string" &&
      entry.description.trim().length > 0
        ? entry.description.trim()
        : null,
    subtitle: pickSubtitle(entry),
    successRate: normalizeSuccessRate(entry),
    keyTakeaways: normalizeKeyTakeaways(entry),
  };
}

/** @param {unknown} json  Kept for parity with the Strapi version. */
export function normalizeClientShowcasesResponse(json) {
  if (!Array.isArray(json)) return [];
  return json.map(normalizeClientShowcase).filter(Boolean);
}

/* -------------------------------------------------------------------------- */
/*  Data-fetching                                                             */
/* -------------------------------------------------------------------------- */

export async function getClientShowcases(limit = 24) {
  const query = `*[_type == "clientShowcase"] | order(publishedAt desc) [0...$limit] ${showcaseProjection}`;
  const results = await sanityClient.fetch(query, { limit });
  return normalizeClientShowcasesResponse(results).filter(
    (card) => Boolean(card.backgroundSrc && card.thumbSrc),
  );
}

/** Safe wrapper — returns [] when Sanity is unreachable or misconfigured. */
export async function tryGetClientShowcases(limit = 24) {
  try {
    return await getClientShowcases(limit);
  } catch {
    return [];
  }
}

/**
 * Single client showcase by slug or _id for `/projects/[param]`.
 * @param {string} param  URL segment from Next route
 */
export async function findClientShowcaseBySlugOrId(param) {
  // Try by slug first (most common for real URLs)
  const bySlugQuery = `*[_type == "clientShowcase" && (slug == $param || slug.current == $param)] [0] ${showcaseProjection}`;
  const bySlug = await sanityClient.fetch(bySlugQuery, { param });
  if (bySlug) return normalizeClientShowcase(bySlug);

  // Fall back to _id
  const byIdQuery = `*[_type == "clientShowcase" && _id == $param] [0] ${showcaseProjection}`;
  const byId = await sanityClient.fetch(byIdQuery, { param });
  if (byId) return normalizeClientShowcase(byId);

  return null;
}

export async function tryFindClientShowcase(param) {
  try {
    return await findClientShowcaseBySlugOrId(param);
  } catch {
    return null;
  }
}
