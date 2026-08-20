/**
 * CMS Provider Toggle
 *
 * Re-exports all data-fetching functions, picking the right implementation
 * based on process.env.CMS_PROVIDER.
 *
 *   CMS_PROVIDER=sanity  ->  ./sanity/*.js
 *   anything else         ->  existing Strapi files (./articles.js, etc.)
 */

const isSanityCms = process.env.CMS_PROVIDER === "sanity";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCmsProvider() {
  return isSanityCms ? "sanity" : "strapi";
}

export function isSanity() {
  return isSanityCms;
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function tryGetArticlesForHome(limit = 10) {
  if (isSanityCms) {
    const { tryGetArticlesForHome } = await import("./sanity/articles.js");
    return tryGetArticlesForHome(limit);
  }
  const { tryGetArticlesForHome } = await import("./articles.js");
  return tryGetArticlesForHome(limit);
}

export async function tryFindArticle(param) {
  if (isSanityCms) {
    const { tryFindArticle } = await import("./sanity/articles.js");
    return tryFindArticle(param);
  }
  const { tryFindArticle } = await import("./articles.js");
  return tryFindArticle(param);
}

export async function normalizeArticle(entry) {
  if (isSanityCms) {
    const { normalizeArticle } = await import("./sanity/articles.js");
    return normalizeArticle(entry);
  }
  const { normalizeArticle } = await import("./articles.js");
  return normalizeArticle(entry);
}

// ---------------------------------------------------------------------------
// Client Showcases
// ---------------------------------------------------------------------------

export async function tryGetClientShowcases(limit = 24) {
  if (isSanityCms) {
    const { tryGetClientShowcases } = await import("./sanity/clientShowcases.js");
    return tryGetClientShowcases(limit);
  }
  const { tryGetClientShowcases } = await import("./clientShowcases.js");
  return tryGetClientShowcases(limit);
}

export async function tryFindClientShowcase(param) {
  if (isSanityCms) {
    const { tryFindClientShowcase } = await import("./sanity/clientShowcases.js");
    return tryFindClientShowcase(param);
  }
  const { tryFindClientShowcase } = await import("./clientShowcases.js");
  return tryFindClientShowcase(param);
}

export async function normalizeClientShowcase(entry) {
  if (isSanityCms) {
    const { normalizeClientShowcase } = await import("./sanity/clientShowcases.js");
    return normalizeClientShowcase(entry);
  }
  const { normalizeClientShowcase } = await import("./clientShowcases.js");
  return normalizeClientShowcase(entry);
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export async function createMessage(payload) {
  if (isSanityCms) {
    const { createMessage } = await import("./sanity/messages.js");
    return createMessage(payload);
  }
  const { createMessage } = await import("./messages.js");
  return createMessage(payload);
}

// ---------------------------------------------------------------------------
// Subscribers
// ---------------------------------------------------------------------------

export async function createSubscriber(email) {
  if (isSanityCms) {
    const { createSubscriber } = await import("./sanity/subscribers.js");
    return createSubscriber(email);
  }
  const { createSubscriber } = await import("./subscribers.js");
  return createSubscriber(email);
}
