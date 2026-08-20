import SanityBlocksRenderer from "./SanityBlocksRenderer";
import StrapiBlocksRenderer from "./StrapiBlocksRenderer";

/**
 * Auto-detecting blocks renderer.
 * Inspects the data shape to decide between Sanity Portable Text and
 * Strapi Blocks JSON, so page components don't need to know which CMS
 * produced the content.
 *
 * Sanity Portable Text blocks have `_type` (e.g. "block", "image").
 * Strapi blocks have `type` (e.g. "paragraph") or `__component`.
 */
function isSanityBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return false;
  const first = blocks[0];
  if (!first || typeof first !== "object") return false;
  return typeof first._type === "string";
}

/** @param {{ blocks: unknown }} props */
export default function BlocksRenderer({ blocks }) {
  if (blocks == null) return null;

  // String content (HTML/plain) — both renderers handle it the same way
  if (typeof blocks === "string") {
    return <StrapiBlocksRenderer blocks={blocks} />;
  }

  if (isSanityBlocks(blocks)) {
    return <SanityBlocksRenderer blocks={blocks} />;
  }

  return <StrapiBlocksRenderer blocks={blocks} />;
}
