/**
 * Strapi Client Showcase collection helpers (REST plural defaults to `client-showcases`).
 */

import { normalizeKeyTakeaways } from "./keyTakeaways.js";
import { fetchStrapiCollection } from "./strapi.js";
import { strapiMediaUrl } from "./strapiMedia.js";

function showcasePlural() {
  return process.env.STRAPI_CLIENT_SHOWCASE_PLURAL ?? "client-showcases";
}

/** Strapi v5: `populate=*` includes first-level components such as `successRate`. */
function showcaseFetchQuery(extra = {}) {
  return {
    populate: "*",
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
    "coverPhoto",
    "coverImage",
    "thumbnail",
    "heroImage",
    "featuredImage",
    "image",
    "hero",
    "background",
    "backgroundImage",
    "projectCover",
    "banner",
  ];
  for (const key of keys) {
    const u = strapiMediaUrl(raw[key]);
    if (u) return u;
  }
  return null;
}

/** @param {unknown} blocks */
function firstContentImageUrl(blocks) {
  if (!Array.isArray(blocks)) return null;
  for (const block of blocks) {
    if (block?.type !== "image") continue;
    const url = strapiMediaUrl(block.image ?? block.media ?? block.file);
    if (url) return url;
  }
  return null;
}

/** @param {Record<string, unknown>} raw */
function pickSubtitle(raw) {
  const category = pickCategory(raw);
  const clientName =
    typeof raw.clientName === "string" && raw.clientName.trim().length > 0
      ? raw.clientName.trim()
      : null;
  const publishedAt = raw.publishedAt ?? raw.createdAt ?? null;
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

/** @param {Record<string, unknown>} raw */
function pickSlug(raw) {
  if (typeof raw.slug === "string" && raw.slug.trim().length > 0) {
    return raw.slug.trim();
  }
  const id = raw.documentId ?? raw.id;
  return id != null ? String(id) : "";
}

/** @param {Record<string, unknown>} raw */
function pickWebsite(raw) {
  const keys = [
    "clientWebsite",
    "website",
    "siteUrl",
    "url",
    "link",
    "liveUrl",
    "clientUrl",
  ];

  for (const key of keys) {
    const value = raw[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  return null;
}

/** @param {Record<string, unknown>} raw */
function pickHref(raw) {
  const slug = pickSlug(raw);
  return slug ? `/projects/${encodeURIComponent(slug)}` : "/projects";
}

/** @param {unknown} value */
function pickScalar(value) {
  if (value == null) return null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "object") {
    const record = value.attributes ?? value;
    if (Array.isArray(record.children)) {
      const text = record.children
        .map((child) => (typeof child?.text === "string" ? child.text : ""))
        .join("")
        .trim();
      return text.length > 0 ? text : null;
    }
    if (Array.isArray(record)) {
      const text = record
        .map((child) => pickScalar(child))
        .filter(Boolean)
        .join(" ")
        .trim();
      return text.length > 0 ? text : null;
    }
  }
  return null;
}

/** @param {unknown} value */
function pickCategoryValue(value) {
  if (value == null) return null;

  const scalar = pickScalar(value);
  if (scalar) return scalar;

  if (typeof value !== "object") return null;

  const record =
    value.data?.attributes ?? value.data ?? value.attributes ?? value;

  if (Array.isArray(record)) {
    const labels = record
      .map((item) => pickCategoryValue(item))
      .filter(Boolean);
    return labels.length > 0 ? labels.join(", ") : null;
  }

  if (typeof record !== "object" || record === null) return null;

  const nameKeys = ["name", "title", "label", "value", "category", "slug"];
  for (const key of nameKeys) {
    const nested = pickCategoryValue(record[key]);
    if (nested) return nested;
  }

  return null;
}

/** @param {Record<string, unknown>} raw */
function pickCategory(raw) {
  const keys = [
    "category",
    "categories",
    "projectCategory",
    "project_category",
    "categoryName",
    "type",
    "industry",
  ];

  for (const key of keys) {
    const value = pickCategoryValue(raw[key]);
    if (value) return value;
  }

  return null;
}

/** @param {Record<string, unknown>} record */
function pickSuccessRateTitle(record) {
  const keys = [
    "title",
    "Title",
    "heading",
    "headline",
    "value",
    "metric",
    "name",
  ];
  for (const key of keys) {
    const value = pickScalar(record[key]);
    if (value) return value;
  }
  return null;
}

/** @param {Record<string, unknown>} record */
function pickSuccessRateSubtitle(record) {
  const keys = [
    "subtitle",
    "subTitle",
    "sub_title",
    "description",
    "label",
    "caption",
    "text",
  ];
  for (const key of keys) {
    const value = pickScalar(record[key]);
    if (value) return value;
  }
  return null;
}

/** @param {unknown} item */
function normalizeSuccessRateItem(item) {
  if (!item || typeof item !== "object") return null;

  const record = item.attributes ?? item;
  const title = pickSuccessRateTitle(record);
  const subtitle = pickSuccessRateSubtitle(record);

  if (!title && !subtitle) return null;

  return {
    title: title ?? "",
    subtitle: subtitle ?? "",
  };
}

/** @param {unknown} value */
function successRateEntries(value) {
  if (value == null) return [];

  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return successRateEntries(parsed);
    } catch {
      return [];
    }
  }

  if (typeof value !== "object") return [];

  const record = value.attributes ?? value;
  if (Array.isArray(record)) return record;
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.entries)) return record.entries;

  const single = normalizeSuccessRateItem(record);
  return single ? [single] : [];
}

/** @param {Record<string, unknown>} raw */
function normalizeSuccessRate(raw) {
  const value =
    raw.successRate ?? raw.success_rate ?? raw["success-rate"] ?? null;

  return successRateEntries(value)
    .map(normalizeSuccessRateItem)
    .filter(Boolean);
}

/** @param {unknown} content */
function normalizeContentBlocks(content) {
  if (content == null) return null;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content;
  if (typeof content === "object" && Array.isArray(content.data)) {
    return content.data;
  }
  return null;
}

/** @param {unknown} entry */
export function normalizeClientShowcase(entry) {
  const raw = unwrapEntry(entry);
  if (!raw?.title) return null;

  const id = raw.documentId ?? raw.id;
  const logo =
    raw.clientLogo ??
    raw.logo ??
    raw.thumb ??
    raw.thumbnail ??
    raw.clientImage ??
    raw.avatar;
  const logoUrl = strapiMediaUrl(logo);
  const logoAttrs =
    logo && typeof logo === "object" ? (logo.attributes ?? logo) : null;
  const coverUrl =
    firstCoverUrl(raw) ?? firstContentImageUrl(raw.content) ?? null;
  const backgroundUrl = coverUrl ?? logoUrl ?? null;
  const thumbUrl = logoUrl ?? coverUrl ?? null;

  const slug = pickSlug(raw);
  const category = pickCategory(raw);
  const clientName =
    typeof raw.clientName === "string" && raw.clientName.trim().length > 0
      ? raw.clientName.trim()
      : null;

  return {
    id,
    documentId: raw.documentId,
    slug,
    href: pickHref(raw),
    category,
    clientName,
    websiteUrl: pickWebsite(raw),
    publishedAt: raw.publishedAt ?? raw.createdAt ?? null,
    content: normalizeContentBlocks(raw.content),
    coverUrl: backgroundUrl,
    backgroundSrc: backgroundUrl,
    backgroundAlt:
      (typeof raw.title === "string" && raw.title) ||
      (typeof logoAttrs?.alternativeText === "string" &&
        logoAttrs.alternativeText) ||
      "",
    thumbSrc: thumbUrl,
    thumbAlt:
      (typeof logoAttrs?.alternativeText === "string" &&
        logoAttrs.alternativeText) ||
      (typeof raw.clientName === "string" && raw.clientName) ||
      "",
    title: String(raw.title),
    description:
      typeof raw.description === "string" && raw.description.trim().length > 0
        ? raw.description.trim()
        : null,
    subtitle: pickSubtitle(raw),
    successRate: normalizeSuccessRate(raw),
    keyTakeaways: normalizeKeyTakeaways(raw),
  };
}

/** @param {unknown} json */
export function normalizeClientShowcasesResponse(json) {
  const raw = json?.data;
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeClientShowcase).filter(Boolean);
}

export async function getClientShowcases(limit = 24) {
  const plural = showcasePlural();
  const json = await fetchStrapiCollection(
    plural,
    showcaseFetchQuery({
      sort: "publishedAt:desc",
      "pagination[pageSize]": String(limit),
    }),
  );
  return normalizeClientShowcasesResponse(json).filter((card) =>
    Boolean(card.backgroundSrc && card.thumbSrc),
  );
}

export async function tryGetClientShowcases(limit = 24) {
  try {
    return await getClientShowcases(limit);
  } catch {
    return [];
  }
}

/**
 * Single client showcase by slug, documentId, or numeric id for `/projects/[param]`.
 * @param {string} param URL segment from Next route
 */
export async function findClientShowcaseBySlugOrId(param) {
  const plural = showcasePlural();
  const base = showcaseFetchQuery({
    "pagination[pageSize]": "1",
  });

  const first = async (extra) => {
    try {
      const json = await fetchStrapiCollection(plural, { ...base, ...extra });
      const item = json?.data?.[0];
      return item ? normalizeClientShowcase(item) : null;
    } catch {
      return null;
    }
  };

  // Real URLs use slugs, so try that first and fall back to ids.
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

export async function tryFindClientShowcase(param) {
  try {
    return await findClientShowcaseBySlugOrId(param);
  } catch {
    return null;
  }
}
