/**
 * Minimal HTML sanitization helpers for CMS text that ends up in
 * `dangerouslySetInnerHTML` (markdown → inline HTML conversion).
 */

/** Escape text so it can be embedded in HTML markup. @param {string} text */
export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Allow only safe link destinations (http/https/mailto/tel, relative paths,
 * anchors). Anything else — e.g. `javascript:` — collapses to `#`.
 * @param {string} href
 */
export function safeLinkHref(href) {
  const trimmed = href.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  return "#";
}
