/**
 * Remote hosts that are whitelisted in `next.config.mjs` → `images.remotePatterns`.
 * Images from these hosts go through the Next.js image optimizer (resized,
 * compressed, WebP/AVIF). Anything else is rendered `unoptimized` so an
 * unexpected host in CMS content can never crash the page.
 *
 * Keep this list in sync with next.config.mjs.
 */
const OPTIMIZED_IMAGE_HOSTS = new Set(["api.digitl.me", "localhost"]);

/** @param {unknown} src @returns {boolean} true when next/image may optimize this src */
export function canOptimizeImage(src) {
  if (typeof src !== "string") return true; // static imports are always optimizable
  if (!/^https?:\/\//i.test(src)) return true; // relative/public assets
  try {
    return OPTIMIZED_IMAGE_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}
