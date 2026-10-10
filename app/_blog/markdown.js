/* Article bodies arrive as Strapi-style blocks: rich text written in Markdown,
   and media. This turns them into a flat list of nodes the page can render
   and build its table of contents from. Same grammar the old renderer read
   (headings, paragraphs, bold, italic, links, images, lists), plus what it
   left out: grouped and ordered lists, quotes, tables, code and rules. */

import { strapiMediaUrl, toAbsoluteStrapiUrl } from "../../lib/strapiMedia.js";
import { imgSize, slug } from "./util";

const FILE_NAME = /\.(png|jpe?g|webp|gif|avif|svg)$/i;
const IMAGE = /^!\[([^\]]*)\]\(\s*(\S+?)(?:\s+"([^"]*)")?\s*\)$/;
const HEADING = /^(#{1,6})\s+(.+?)\s*#*$/;
const RULE = /^([-*_])(?:\s*\1){2,}$/;
const BULLET = /^[-*+]\s+(.*)$/;
const NUMBER = /^(\d{1,3})[.)]\s+(.*)$/;
const FENCE = /^(```|~~~)/;
const TABLE_RULE = /^\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?$/;
const SENTENCE_END = /[.!?:;…"”)]$/;

/** Markdown marks off, for ids, the contents list and alt text. */
export function plain(md) {
  return String(md)
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|\*|_|`)/g, "")
    .trim();
}

function cells(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));
}

function picture(src, alt, caption, size) {
  const url = toAbsoluteStrapiUrl(src);
  const dims = size ?? imgSize(url);
  return {
    type: "figure",
    src: url,
    alt,
    caption: caption || null,
    width: dims?.width ?? 1600,
    height: dims?.height ?? 900,
  };
}

/** @param {string} md @param {object} ctx  running state shared by all blocks */
function parseMarkdown(md, ctx) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let para = [];

  const flush = () => {
    if (!para.length) return;
    // Lines typed one under another, each a full sentence, are separate
    // thoughts (a checklist without bullets); anything else is one paragraph
    // that happens to be wrapped.
    const apart =
      para.length > 1 && para.slice(0, -1).every((l) => SENTENCE_END.test(l));
    if (apart) for (const l of para) out.push({ type: "p", text: l });
    else out.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  // the next line with something on it, at or after `from`
  const nextFilled = (from) => {
    let j = from;
    while (j < lines.length && !lines[j].trim()) j++;
    return j;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flush();
      continue;
    }

    if (FENCE.test(line)) {
      flush();
      const fence = line.slice(0, 3);
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence))
        code.push(lines[i++]);
      out.push({ type: "code", text: code.join("\n") });
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flush();
      // "#" and "##" are both section titles, as on the old page
      const level = Math.min(4, Math.max(2, heading[1].length));
      const label = plain(heading[2]);
      // an id that is also a valid CSS selector, and not taken yet
      const base = slug(label) || "odeljak";
      const root = /^\d/.test(base) ? `deo-${base}` : base;
      let id = root;
      for (let n = 2; ctx.ids.has(id); n++) id = `${root}-${n}`;
      ctx.ids.add(id);
      if (level === 2) ctx.section = label;
      out.push({ type: "heading", level, text: heading[2], label, id });
      continue;
    }

    if (RULE.test(line)) {
      flush();
      out.push({ type: "rule" });
      continue;
    }

    const image = line.match(IMAGE);
    if (image) {
      flush();
      const [, alt, src, title] = image;
      // Editors leave the file name as the alt text; say what it sits under.
      const real = alt.trim() && !FILE_NAME.test(alt.trim());
      out.push(
        picture(
          src,
          real ? alt.trim() : `Ilustracija: ${ctx.section ?? ctx.title}`,
          title,
        ),
      );
      continue;
    }

    if (line.startsWith(">")) {
      flush();
      const quote = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      i--;
      out.push({
        type: "quote",
        paragraphs: quote
          .join("\n")
          .split(/\n\s*\n/)
          .map((p) => p.replace(/\n/g, " ").trim())
          .filter(Boolean),
      });
      continue;
    }

    if (BULLET.test(line)) {
      flush();
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(BULLET);
        if (m) items.push(m[1]);
        else if (t && /^\s{2,}/.test(lines[i]))
          items[items.length - 1] += ` ${t}`;
        else if (!t && BULLET.test(lines[nextFilled(i)]?.trim() ?? "")) {
          // a blank line between two items is still one list
        } else break;
        i++;
      }
      i--;
      out.push({ type: "list", ordered: false, items });
      continue;
    }

    // A numbered list is "1." followed by "2."; a lone "17. avgusta…" at the
    // start of a line is a date, not a list.
    const first = line.match(NUMBER);
    if (first) {
      const items = [first[2]];
      let n = Number(first[1]);
      let j = nextFilled(i + 1);
      while (j < lines.length) {
        const m = lines[j].trim().match(NUMBER);
        if (!m || Number(m[1]) !== n + 1) break;
        items.push(m[2]);
        n++;
        j = nextFilled(j + 1);
      }
      if (items.length > 1) {
        flush();
        out.push({
          type: "list",
          ordered: true,
          start: Number(first[1]),
          items,
        });
        i = j - 1;
        continue;
      }
    }

    if (
      line.includes("|") &&
      lines[i + 1]?.includes("-") &&
      TABLE_RULE.test(lines[i + 1].trim())
    ) {
      flush();
      const head = cells(line);
      const align = cells(lines[i + 1]).map((c) =>
        c.startsWith(":") && c.endsWith(":")
          ? "center"
          : c.endsWith(":")
            ? "right"
            : null,
      );
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(cells(lines[i]));
        i++;
      }
      i--;
      out.push({ type: "table", head, align, rows });
      continue;
    }

    para.push(line);
  }
  flush();
  return out;
}

/* Uploads that never moved off the old CMS host may be gone. A figure whose
   file cannot be reached is left out on the server: the reader gets no empty
   frame, and the text does not jump when the browser gives up on the file. */
async function exists(url) {
  if (url.startsWith("https://cdn.sanity.io/")) return true;
  // a bare /uploads path with no CMS host configured: nowhere to load it from
  if (!/^https?:\/\//i.test(url)) return !url.startsWith("/uploads/");
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });
    return res.status !== 404 && res.status !== 410;
  } catch {
    return false;
  }
}

/** The nodes, minus figures whose image is not there any more. */
export async function withoutMissing(nodes) {
  const ok = await Promise.all(
    nodes.map((n) => (n.type === "figure" ? exists(n.src) : true)),
  );
  return nodes.filter((_, i) => ok[i]);
}

const BODY_KEYS = ["body", "content", "text", "richText", "copy"];

/** One media item of a Strapi block as a figure node. */
function media(file, caption, ctx) {
  const url = strapiMediaUrl(file);
  if (!url) return null;
  const f = file?.attributes ?? file ?? {};
  const cap =
    (typeof caption === "string" && caption.trim()) ||
    (typeof f.caption === "string" && f.caption.trim()) ||
    null;
  const alt =
    (typeof f.alternativeText === "string" && f.alternativeText.trim()) ||
    `Ilustracija: ${cap ?? ctx.section ?? ctx.title}`;
  const size =
    Number(f.width) > 0 && Number(f.height) > 0
      ? { width: Number(f.width), height: Number(f.height) }
      : null;
  return picture(url, alt, cap, size);
}

/** True when every block is a Strapi component this parser reads. */
export function canParse(blocks) {
  return (
    Array.isArray(blocks) &&
    blocks.length > 0 &&
    blocks.every((x) => x && typeof x.__component === "string")
  );
}

/**
 * @param {unknown[]} blocks  article.blocks
 * @param {string} title      article title, the fallback subject of alt text
 * @returns {{ nodes: object[], toc: { id: string, label: string }[] }}
 */
export function parseBlocks(blocks, title) {
  // ids the page already uses, so a heading can never take one of them
  const ctx = {
    title,
    section: null,
    ids: new Set(["top", "kontakt", "tekst", "kljucne-poruke", "home-news"]),
  };
  const nodes = [];

  for (const block of blocks) {
    const comp = block.__component;

    if (comp.includes("quote")) {
      const body = block.body ?? block.text ?? block.quote ?? block.content;
      const cite = block.title ?? block.author ?? block.attribution;
      if (body || cite)
        nodes.push({
          type: "quote",
          paragraphs: body
            ? String(body)
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
            : [],
          cite: cite ? String(cite) : null,
        });
      continue;
    }

    if (comp.includes("slider")) {
      const files =
        block.files ?? block.images ?? block.media ?? block.gallery ?? [];
      const list = Array.isArray(files) ? files : (files?.data ?? [files]);
      for (const f of list) {
        const node = media(f, null, ctx);
        if (node) nodes.push(node);
      }
      continue;
    }

    if (/media|image|photo/.test(comp)) {
      const node = media(
        block.file ?? block.image ?? block.media ?? block.cover,
        block.text ?? block.caption,
        ctx,
      );
      if (node) nodes.push(node);
      continue;
    }

    const key = BODY_KEYS.find((k) => typeof block[k] === "string");
    if (key) {
      const text = block[key];
      // HTML or Strapi's own block JSON: left to the renderer that knows them
      if (text.trim().startsWith("<")) nodes.push({ type: "legacy", block });
      else nodes.push(...parseMarkdown(text, ctx));
      continue;
    }
    if (BODY_KEYS.some((k) => Array.isArray(block[k])))
      nodes.push({ type: "legacy", block });
  }

  const toc = nodes
    .filter((n) => n.type === "heading" && n.level === 2)
    .map((n) => ({ id: n.id, label: n.label.replace(/:$/, "") }));
  return { nodes, toc };
}
