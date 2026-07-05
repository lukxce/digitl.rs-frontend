/** @param {string} text */
export function slugifyHeading(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * @param {string} text
 * @param {Set<string>} usedIds
 */
function registerHeading(text, usedIds) {
  const label = text.trim();
  if (!label) return null;

  const base = slugifyHeading(label) || "section";
  let id = base;
  let counter = 2;

  while (usedIds.has(id)) {
    id = `${base}-${counter}`;
    counter += 1;
  }

  usedIds.add(id);
  return { id, label };
}

/** @param {unknown} children */
function plainTextFromChildren(children) {
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => {
      if (!child || typeof child !== "object") return "";
      if (typeof child.text === "string") return child.text;
      if (Array.isArray(child.children))
        return plainTextFromChildren(child.children);
      return "";
    })
    .join("");
}

/** @param {string} markdown @param {Set<string>} usedIds @param {Array<{ id: string; label: string }>} items */
function collectMarkdownHeadings(markdown, usedIds, items) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("### ")) {
      const entry = registerHeading(line.slice(4), usedIds);
      if (entry) items.push(entry);
      continue;
    }
    if (line.startsWith("## ")) {
      const entry = registerHeading(line.slice(3), usedIds);
      if (entry) items.push(entry);
      continue;
    }
    if (line.startsWith("# ")) {
      const entry = registerHeading(line.slice(2), usedIds);
      if (entry) items.push(entry);
    }
  }
}

/** @param {unknown} block @param {Set<string>} usedIds @param {Array<{ id: string; label: string }>} items */
function collectBlockHeadings(block, usedIds, items) {
  if (!block || typeof block !== "object") return;

  if (typeof block.__component === "string") {
    const comp = block.__component;
    if (
      comp.includes("rich-text") ||
      comp.includes("richtext") ||
      comp.includes("wysiwyg") ||
      comp.endsWith(".paragraph") ||
      comp.includes("text-block")
    ) {
      const inner =
        block.body ??
        block.content ??
        block.text ??
        block.richText ??
        block.copy;
      if (typeof inner === "string") {
        collectMarkdownHeadings(inner, usedIds, items);
        return;
      }
      if (Array.isArray(inner)) {
        for (const child of inner) {
          collectBlockHeadings(child, usedIds, items);
        }
      }
    }
    return;
  }

  if (block.type === "heading") {
    const entry = registerHeading(
      plainTextFromChildren(block.children),
      usedIds,
    );
    if (entry) items.push(entry);
    return;
  }

  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      collectBlockHeadings(child, usedIds, items);
    }
  }
}

/**
 * @param {unknown} blocks
 * @returns {Array<{ id: string; label: string }>}
 */
export function extractContentHeadings(blocks) {
  const usedIds = new Set();
  const items = [];

  if (blocks == null) return items;

  if (typeof blocks === "string") {
    collectMarkdownHeadings(blocks, usedIds, items);
    return items;
  }

  if (!Array.isArray(blocks)) return items;

  for (const block of blocks) {
    collectBlockHeadings(block, usedIds, items);
  }

  return items;
}

/**
 * @param {Array<{ id: string; label: string }>} headings
 */
export function createHeadingQueue(headings) {
  let index = 0;

  return {
    next() {
      const item = headings[index];
      index += 1;
      return item?.id;
    },
  };
}
