import SanityBlocksRenderer from "./SanityBlocksRenderer";
import ProjectBlocksRenderer from "./ProjectBlocksRenderer";

/**
 * Auto-detecting project blocks renderer.
 * Same detection logic as BlocksRenderer, but falls back to
 * ProjectBlocksRenderer (which uses its own CSS module) for Strapi content.
 */
function isSanityBlocks(blocks) {
  if (!Array.isArray(blocks) || blocks.length === 0) return false;
  const first = blocks[0];
  if (!first || typeof first !== "object") return false;
  return typeof first._type === "string";
}

/** @param {{ blocks: unknown }} props */
export default function ProjectBlocksRendererAuto({ blocks }) {
  if (blocks == null) return null;

  if (typeof blocks === "string") {
    return <ProjectBlocksRenderer blocks={blocks} />;
  }

  if (isSanityBlocks(blocks)) {
    return <SanityBlocksRenderer blocks={blocks} />;
  }

  return <ProjectBlocksRenderer blocks={blocks} />;
}
