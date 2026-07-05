import Image from "next/image";
import { createElement, Fragment } from "react";
import {
  createHeadingQueue,
  extractContentHeadings,
} from "../../lib/blockHeadings.js";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import { escapeHtml, safeLinkHref } from "../../lib/sanitizeHtml.js";
import { strapiMediaUrl, toAbsoluteStrapiUrl } from "../../lib/strapiMedia.js";
import styles from "./ProjectBlocksRenderer.module.css";

const MARKDOWN_IMAGE_RE = /^!\[(.*?)\]\((.*?)\)$/;
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const MARKDOWN_EMPHASIS_RE = /\*([^*]+)\*/g;

/** @param {string} text */
function renderInlineMarkdown(text) {
  const escaped = escapeHtml(text);
  const withLinks = escaped.replace(
    MARKDOWN_LINK_RE,
    (_match, label, href) => `<a href="${safeLinkHref(href)}">${label}</a>`,
  );
  const withEmphasis = withLinks.replace(MARKDOWN_EMPHASIS_RE, "<em>$1</em>");
  return withEmphasis;
}

/** @param {string} markdown @param {string} key @param {{ next: () => string | undefined } | null} headingQueue */
function renderMarkdownBody(markdown, key, headingQueue) {
  const blocks = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph = [];
  /** @type {BodyImage[]} */
  let pendingImages = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;
    blocks.push(
      <p
        key={`${key}-p-${blocks.length}`}
        className={styles.p}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown from Strapi CMS
        dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(text) }}
      />,
    );
  };

  const flushImages = () => {
    if (!pendingImages.length) return;
    blocks.push(
      ...renderImageRows(pendingImages, `${key}-md-${blocks.length}`),
    );
    pendingImages = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      flushParagraph();
      flushImages();
      continue;
    }

    const imageMatch = line.match(MARKDOWN_IMAGE_RE);
    if (imageMatch) {
      flushParagraph();
      const [, alt, src] = imageMatch;
      const url = toAbsoluteStrapiUrl(src);
      pendingImages.push({ url, alt: alt ?? "" });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushImages();
      blocks.push(
        <h3
          key={`${key}-h3-${blocks.length}`}
          id={headingQueue?.next()}
          className={styles.h3}
        >
          {line.slice(4)}
        </h3>,
      );
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      flushImages();
      blocks.push(
        <h2
          key={`${key}-h2-${blocks.length}`}
          id={headingQueue?.next()}
          className={styles.h2}
        >
          {line.slice(3)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      flushImages();
      blocks.push(
        <h2
          key={`${key}-h1-${blocks.length}`}
          id={headingQueue?.next()}
          className={styles.h2}
        >
          {line.slice(2)}
        </h2>,
      );
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      flushImages();
      blocks.push(
        <ul key={`${key}-ul-${blocks.length}`} className={styles.list}>
          <li className={styles.listItem}>{line.slice(2)}</li>
        </ul>,
      );
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushImages();
  return blocks.length ? blocks : null;
}

/** @param {unknown} value */
function mediaItemsFromField(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && Array.isArray(value.data)) {
    return value.data;
  }
  return [value];
}

/** @typedef {{ url: string; alt: string }} BodyImage */

/** @param {unknown} media */
function imageAltFromMedia(media) {
  if (media && typeof media === "object" && "alternativeText" in media) {
    const alt = media.alternativeText;
    if (typeof alt === "string") return alt;
  }
  return "";
}

/** @param {BodyImage[]} images */
function chunkImageRows(images) {
  /** @type {BodyImage[][]} */
  const rows = [];
  for (let i = 0; i < images.length; ) {
    const remaining = images.length - i;
    const size = remaining >= 3 ? 3 : remaining;
    rows.push(images.slice(i, i + size));
    i += size;
  }
  return rows;
}

/** @param {BodyImage[]} images @param {string} key */
function renderImageRow(images, key) {
  if (!images.length) return null;
  const layout =
    images.length === 1 ? "one" : images.length === 2 ? "two" : "three";
  const rowClass =
    layout === "one"
      ? styles.imageRowOne
      : layout === "two"
        ? styles.imageRowTwo
        : styles.imageRowThree;
  const sizes =
    layout === "one"
      ? "(max-width: 1010px) 100vw, 1010px"
      : layout === "two"
        ? "(max-width: 1010px) 50vw, 505px"
        : "(max-width: 1010px) 50vw, 505px";

  const renderFigure = (image, index, figureSizes) => (
    <figure
      key={`${key}-img-${index}`}
      className={`${styles.figure} ${styles.imageRowFigure}`.trim()}
    >
      <Image
        src={image.url}
        alt={image.alt}
        width={1200}
        height={800}
        className={styles.blockImage}
        sizes={figureSizes}
        unoptimized={!canOptimizeImage(image.url)}
      />
    </figure>
  );

  if (layout === "three") {
    return (
      <div key={key} className={styles.imageRowBreakout}>
        <div className={styles.imageRowThreeLayout}>
          <div className={styles.imageRowThreeTop}>
            {renderFigure(images[0], 0, sizes)}
            {renderFigure(images[1], 1, sizes)}
          </div>
          {renderFigure(images[2], 2, "(max-width: 1010px) 100vw, 1010px")}
        </div>
      </div>
    );
  }

  return (
    <div key={key} className={styles.imageRowBreakout}>
      <div className={`${styles.imageRow} ${rowClass}`.trim()}>
        {images.map((image, index) => renderFigure(image, index, sizes))}
      </div>
    </div>
  );
}

/** @param {BodyImage[]} images @param {string} keyPrefix */
function renderImageRows(images, keyPrefix) {
  return chunkImageRows(images).map((row, index) =>
    renderImageRow(row, `${keyPrefix}-row-${index}`),
  );
}

/** @param {Record<string, unknown>} block */
function extractBlocksJsonImage(block) {
  if (!block || typeof block !== "object" || block.type !== "image")
    return null;
  const url = imageBlockUrl(block);
  if (!url) return null;
  const media = block.image ?? block.media ?? block.file;
  const alt =
    imageAltFromMedia(media && typeof media === "object" ? media : null) ||
    imageAltFromMedia(
      media &&
        typeof media === "object" &&
        "attributes" in media &&
        media.attributes &&
        typeof media.attributes === "object"
        ? media.attributes
        : null,
    );
  return { url, alt };
}

/** @param {Record<string, unknown>} item */
function extractDynamicZoneImage(item) {
  const comp = item.__component;
  if (typeof comp !== "string") return null;
  if (comp.includes("slider")) return null;

  if (
    comp.includes("image") ||
    comp.includes("media") ||
    comp.includes("photo")
  ) {
    const media = item.image ?? item.media ?? item.file ?? item.cover;
    const url = strapiMediaUrl(media);
    if (!url) return null;
    return { url, alt: imageAltFromMedia(media) };
  }

  return null;
}

/** @param {Record<string, unknown>} item */
function extractSliderImages(item) {
  const comp = item.__component;
  if (typeof comp !== "string" || !comp.includes("slider")) return [];

  return mediaItemsFromField(
    item.files ?? item.images ?? item.media ?? item.gallery,
  )
    .map((entry) => {
      const url = strapiMediaUrl(entry);
      if (!url) return null;
      return { url, alt: imageAltFromMedia(entry) };
    })
    .filter((image) => image != null);
}

/** @param {unknown} block */
function isDynamicZoneItem(block) {
  return (
    block != null &&
    typeof block === "object" &&
    typeof block.__component === "string"
  );
}

/** @param {unknown[]} blocks @param {string} keyPrefix @param {{ next: () => string | undefined } | null} headingQueue */
function renderBlockSequence(blocks, keyPrefix, headingQueue) {
  /** @type {import("react").ReactNode[]} */
  const nodes = [];
  /** @type {BodyImage[]} */
  let pendingImages = [];

  const flushImages = () => {
    if (!pendingImages.length) return;
    nodes.push(
      ...renderImageRows(pendingImages, `${keyPrefix}-img-${nodes.length}`),
    );
    pendingImages = [];
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block || typeof block !== "object") continue;

    if (isDynamicZoneItem(block)) {
      const sliderImages = extractSliderImages(block);
      if (sliderImages.length > 0) {
        flushImages();
        nodes.push(
          ...renderImageRows(sliderImages, `${keyPrefix}-slider-${i}`),
        );
        continue;
      }

      const dynamicImage = extractDynamicZoneImage(block);
      if (dynamicImage) {
        pendingImages.push(dynamicImage);
        continue;
      }

      flushImages();
      const rendered = renderDynamicComponent(
        block,
        `${keyPrefix}-dz-${i}`,
        headingQueue,
      );
      if (rendered) nodes.push(rendered);
      continue;
    }

    const jsonImage = extractBlocksJsonImage(block);
    if (jsonImage) {
      pendingImages.push(jsonImage);
      continue;
    }

    flushImages();
    const rendered = renderBlock(block, `${keyPrefix}-blk-${i}`, headingQueue);
    if (rendered) nodes.push(rendered);
  }

  flushImages();
  return nodes;
}

/** @param {Record<string, unknown>} block */
function imageBlockUrl(block) {
  const img = block.image ?? block.media ?? block.file;
  if (!img) return null;
  if (typeof img === "string") return toAbsoluteStrapiUrl(img);
  if (typeof img === "object" && img !== null && typeof img.url === "string") {
    return toAbsoluteStrapiUrl(img.url);
  }
  return strapiMediaUrl(img);
}

/** @param {unknown} node @param {string} key */
function renderTextLeaf(node, key) {
  if (!node || typeof node !== "object" || node.text == null) return null;
  const text = String(node.text);
  if (text === "") return null;

  let el = text;
  if (node.code) {
    return (
      <code key={key} className={styles.inlineCode}>
        {text}
      </code>
    );
  }
  if (node.bold) el = <strong key={`${key}-b`}>{el}</strong>;
  if (node.italic) el = <em key={`${key}-i`}>{el}</em>;
  if (node.underline) {
    el = (
      <span key={`${key}-u`} style={{ textDecoration: "underline" }}>
        {el}
      </span>
    );
  }
  if (node.strikethrough) {
    el = <s key={`${key}-s`}>{el}</s>;
  }
  return <Fragment key={key}>{el}</Fragment>;
}

/** @param {unknown[]} children */
function renderInlines(children) {
  if (!Array.isArray(children)) return null;
  const out = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    if (!node || typeof node !== "object") continue;
    if ("text" in node) {
      const t = renderTextLeaf(node, `t-${i}`);
      if (t) out.push(t);
      continue;
    }
    if (node.type === "link") {
      const href = typeof node.url === "string" ? node.url : "#";
      const external = href.startsWith("http");
      out.push(
        <a
          key={`l-${i}`}
          href={href}
          className={styles.link}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {renderInlines(Array.isArray(node.children) ? node.children : [])}
        </a>,
      );
    }
  }
  return out.length ? out : null;
}

/** @param {Record<string, unknown>} block @param {string} key @param {{ next: () => string | undefined } | null} headingQueue */
function renderBlock(block, key, headingQueue) {
  if (!block || typeof block !== "object") return null;
  const type = block.type;

  switch (type) {
    case "paragraph":
      return (
        <p key={key} className={styles.p}>
          {renderInlines(Array.isArray(block.children) ? block.children : [])}
        </p>
      );
    case "heading": {
      const level =
        typeof block.level === "number"
          ? Math.min(6, Math.max(1, block.level))
          : 2;
      const tagName = `h${level}`;
      const cls = level <= 2 ? styles.h2 : level === 3 ? styles.h3 : styles.h4;
      return createElement(
        tagName,
        { key, id: headingQueue?.next(), className: cls },
        renderInlines(Array.isArray(block.children) ? block.children : []),
      );
    }
    case "list": {
      const ordered = block.format === "ordered";
      const Tag = ordered ? "ol" : "ul";
      return (
        <Tag key={key} className={styles.list}>
          {(Array.isArray(block.children) ? block.children : []).map((li) => {
            if (!li || typeof li !== "object") return null;
            const liKey = `${key}-li-${li.type ?? "item"}-${String(li.children?.[0]?.text ?? "").slice(0, 24)}`;
            return (
              <li key={liKey} className={styles.listItem}>
                {(Array.isArray(li.children) ? li.children : []).map(
                  (inner, k) =>
                    renderBlock(inner, `${liKey}-${k}`, headingQueue),
                )}
              </li>
            );
          })}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote key={key} className={styles.blockquote}>
          {renderInlines(Array.isArray(block.children) ? block.children : [])}
        </blockquote>
      );
    case "code": {
      const code =
        typeof block.plainText === "string"
          ? block.plainText
          : typeof block.code === "string"
            ? block.code
            : "";
      return (
        <pre key={key} className={styles.pre}>
          <code>{code}</code>
        </pre>
      );
    }
    case "image": {
      const url = imageBlockUrl(block);
      if (!url) return null;
      const alt =
        (typeof block.image === "object" &&
          block.image &&
          typeof block.image.alternativeText === "string" &&
          block.image.alternativeText) ||
        "";
      return renderImageRow([{ url, alt }], key);
    }
    case "horizontal-rule":
    case "horizontal_rule":
      return <hr key={key} className={styles.hr} />;
    default:
      return null;
  }
}

/** @param {Record<string, unknown>} item @param {string} key @param {{ next: () => string | undefined } | null} headingQueue */
function renderDynamicComponent(item, key, headingQueue) {
  const comp = item.__component;
  if (typeof comp !== "string") return null;

  if (comp.includes("quote")) {
    const body = item.body ?? item.text ?? item.quote ?? item.content;
    const attribution = item.title ?? item.author ?? item.attribution;
    if (!body && !attribution) return null;
    return (
      <blockquote key={key} className={styles.blockquote}>
        {body ? <p className={styles.quoteBody}>{String(body)}</p> : null}
        {attribution
          ? <cite className={styles.quoteAttribution}>
              {String(attribution)}
            </cite>
          : null}
      </blockquote>
    );
  }

  if (comp.includes("slider")) {
    const images = extractSliderImages(item);
    if (!images.length) return null;
    return <Fragment key={key}>{renderImageRows(images, key)}</Fragment>;
  }

  if (
    comp.includes("rich-text") ||
    comp.includes("richtext") ||
    comp.includes("wysiwyg") ||
    comp.endsWith(".paragraph") ||
    comp.includes("text-block")
  ) {
    const inner =
      item.body ?? item.content ?? item.text ?? item.richText ?? item.copy;
    if (Array.isArray(inner)) {
      return (
        <div key={key} className={styles.dynamicBlock}>
          {renderBlockSequence(inner, key, headingQueue)}
        </div>
      );
    }
    if (typeof inner === "string") {
      if (inner.trim().startsWith("<")) {
        return (
          <div
            key={key}
            className={styles.htmlFromCms}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML from Strapi CMS
            dangerouslySetInnerHTML={{ __html: inner }}
          />
        );
      }
      const markdown = renderMarkdownBody(inner, key, headingQueue);
      if (markdown) {
        return (
          <div key={key} className={styles.dynamicBlock}>
            {markdown}
          </div>
        );
      }
      return (
        <p key={key} className={styles.p}>
          {inner}
        </p>
      );
    }
  }

  if (
    comp.includes("image") ||
    comp.includes("media") ||
    comp.includes("photo")
  ) {
    const image = extractDynamicZoneImage(item);
    if (!image) return null;
    return <Fragment key={key}>{renderImageRows([image], key)}</Fragment>;
  }

  return null;
}

/**
 * Renders Strapi Blocks JSON, dynamic-zone arrays, HTML strings, or plain text.
 * @param {{ blocks: unknown }} props
 */
export default function StrapiBlocksRenderer({ blocks }) {
  if (blocks == null) return null;

  const headingQueue = createHeadingQueue(extractContentHeadings(blocks));

  if (typeof blocks === "string") {
    const s = blocks.trim();
    if (s.startsWith("<")) {
      return (
        <div
          className={styles.htmlFromCms}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML from Strapi CMS
          dangerouslySetInnerHTML={{ __html: blocks }}
        />
      );
    }
    return <div className={styles.prosePlain}>{blocks}</div>;
  }

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className={styles.prose}>
      {renderBlockSequence(blocks, "body", headingQueue)}
    </div>
  );
}
