import Image from "next/image";
import { createElement, Fragment } from "react";
import {
  createHeadingQueue,
  extractContentHeadings,
} from "../../lib/blockHeadings.js";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import styles from "./StrapiBlocksRenderer.module.css";

/**
 * Renders Sanity Portable Text blocks with the same visual output as
 * StrapiBlocksRenderer. Re-uses StrapiBlocksRenderer.module.css so
 * switching CMS provider produces identical styling.
 *
 * Portable Text shape:
 *   { _type: "block", style: "normal"|"h2"|"h3"|"blockquote", children: [{_type: "span", text, marks}], listItem?, level? }
 *   { _type: "image", asset: { _ref, url }, alt }
 *   { _type: "code", code: string, language?: string }
 */

/** @typedef {{ url: string; alt: string }} BodyImage */

/** @param {BodyImage[]} images */
function chunkImageRows(images) {
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

/** Extract image URL from a Sanity image block */
function sanityImageBlockUrl(block) {
  if (!block) return null;
  // Direct URL (set during migration)
  if (typeof block.url === "string") return block.url;
  // Asset with URL
  if (block.asset) {
    if (typeof block.asset.url === "string") return block.asset.url;
    if (typeof block.asset._ref === "string") {
      // Convert asset ref to CDN URL: image-abc123-800x600-png → https://cdn.sanity.io/images/projectId/dataset/abc123-800x600.png
      const ref = block.asset._ref;
      const match = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
      if (match) {
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "203ybdbh";
        return `https://cdn.sanity.io/images/${projectId}/production/${match[1]}-${match[2]}.${match[3]}`;
      }
    }
  }
  return null;
}

/** @param {unknown} span @param {string} key */
function renderSpan(span, key) {
  if (!span || typeof span !== "object") return null;
  if (span._type !== "span" && !("text" in span)) return null;

  const text = String(span.text ?? "");
  if (text === "") return null;

  const marks = Array.isArray(span.marks) ? span.marks : [];
  let el = text;

  if (marks.includes("code")) {
    return (
      <code key={key} className={styles.inlineCode}>
        {text}
      </code>
    );
  }
  if (marks.includes("strong")) el = <strong key={`${key}-b`}>{el}</strong>;
  if (marks.includes("em")) el = <em key={`${key}-i`}>{el}</em>;
  if (marks.includes("underline")) {
    el = (
      <span key={`${key}-u`} style={{ textDecoration: "underline" }}>
        {el}
      </span>
    );
  }
  if (marks.includes("strike-through") || marks.includes("strikethrough")) {
    el = <s key={`${key}-s`}>{el}</s>;
  }

  return <Fragment key={key}>{el}</Fragment>;
}

/** @param {unknown[]} children @param {unknown[]} markDefs */
function renderChildren(children, markDefs = []) {
  if (!Array.isArray(children)) return null;
  const out = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child || typeof child !== "object") continue;

    const marks = Array.isArray(child.marks) ? child.marks : [];
    // Check for link marks (non-decorator marks reference markDefs)
    const linkMark = marks.find((m) =>
      typeof m === "string" && markDefs.some((md) => md._key === m),
    );

    if (linkMark) {
      const def = markDefs.find((md) => md._key === linkMark);
      const href = def?.href ?? "#";
      const external = typeof href === "string" && href.startsWith("http");
      out.push(
        <a
          key={`l-${i}`}
          href={href}
          className={styles.link}
          rel={external ? "noopener noreferrer" : undefined}
          target={external ? "_blank" : undefined}
        >
          {String(child.text ?? "")}
        </a>,
      );
      continue;
    }

    const rendered = renderSpan(child, `s-${i}`);
    if (rendered) out.push(rendered);
  }

  return out.length ? out : null;
}

/**
 * @param {unknown[]} blocks
 * @param {string} keyPrefix
 * @param {{ next: () => string | undefined } | null} headingQueue
 */
function renderBlockSequence(blocks, keyPrefix, headingQueue) {
  const nodes = [];
  let pendingImages = [];
  let currentList = null;
  let currentListItems = [];

  const flushImages = () => {
    if (!pendingImages.length) return;
    nodes.push(
      ...renderImageRows(pendingImages, `${keyPrefix}-img-${nodes.length}`),
    );
    pendingImages = [];
  };

  const flushList = () => {
    if (!currentList || !currentListItems.length) return;
    const Tag = currentList === "number" ? "ol" : "ul";
    nodes.push(
      <Tag
        key={`${keyPrefix}-list-${nodes.length}`}
        className={styles.list}
      >
        {currentListItems}
      </Tag>,
    );
    currentList = null;
    currentListItems = [];
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block || typeof block !== "object") continue;

    const blockType = block._type;

    // Image block
    if (blockType === "image") {
      flushList();
      const url = sanityImageBlockUrl(block);
      if (url) {
        pendingImages.push({
          url,
          alt: typeof block.alt === "string" ? block.alt : "",
        });
      }
      continue;
    }

    // Code block
    if (blockType === "code") {
      flushList();
      flushImages();
      nodes.push(
        <pre
          key={`${keyPrefix}-code-${i}`}
          className={styles.pre}
        >
          <code>{String(block.code ?? "")}</code>
        </pre>,
      );
      continue;
    }

    // Regular block (paragraph, heading, list item, quote)
    if (blockType === "block") {
      const blockStyle = block.style ?? "normal";
      const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];

      // List item
      if (block.listItem) {
        flushImages();
        const listType = block.listItem; // "bullet" or "number"
        if (currentList && currentList !== listType) {
          flushList();
        }
        currentList = listType;
        currentListItems.push(
          <li
            key={`${keyPrefix}-li-${i}`}
            className={styles.listItem}
          >
            {renderChildren(block.children, markDefs)}
          </li>,
        );
        continue;
      }

      // Not a list item — flush any pending list
      flushList();
      flushImages();

      switch (blockStyle) {
        case "h1":
        case "h2": {
          nodes.push(
            createElement(
              blockStyle === "h1" ? "h2" : "h2",
              {
                key: `${keyPrefix}-${blockStyle}-${i}`,
                id: headingQueue?.next(),
                className: styles.h2,
              },
              renderChildren(block.children, markDefs),
            ),
          );
          break;
        }
        case "h3": {
          nodes.push(
            <h3
              key={`${keyPrefix}-h3-${i}`}
              id={headingQueue?.next()}
              className={styles.h3}
            >
              {renderChildren(block.children, markDefs)}
            </h3>,
          );
          break;
        }
        case "h4": {
          nodes.push(
            <h4
              key={`${keyPrefix}-h4-${i}`}
              id={headingQueue?.next()}
              className={styles.h4}
            >
              {renderChildren(block.children, markDefs)}
            </h4>,
          );
          break;
        }
        case "blockquote": {
          nodes.push(
            <blockquote
              key={`${keyPrefix}-bq-${i}`}
              className={styles.blockquote}
            >
              <p className={styles.quoteBody}>
                {renderChildren(block.children, markDefs)}
              </p>
            </blockquote>,
          );
          break;
        }
        case "normal":
        default: {
          const content = renderChildren(block.children, markDefs);
          if (content) {
            nodes.push(
              <p key={`${keyPrefix}-p-${i}`} className={styles.p}>
                {content}
              </p>,
            );
          }
          break;
        }
      }
      continue;
    }

    // Fallback: skip unknown types
  }

  flushList();
  flushImages();
  return nodes;
}

/**
 * Extract headings from Portable Text for the outline/heading queue.
 * @param {unknown[]} blocks
 */
function extractPortableTextHeadings(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter(
      (b) =>
        b?._type === "block" &&
        typeof b.style === "string" &&
        b.style.startsWith("h"),
    )
    .map((b) => {
      const text = (b.children ?? [])
        .map((c) => c.text ?? "")
        .join("");
      const level = Number.parseInt(b.style.slice(1), 10) || 2;
      return { text, level };
    });
}

/**
 * Renders Sanity Portable Text blocks with identical styling to StrapiBlocksRenderer.
 * @param {{ blocks: unknown }} props
 */
export default function SanityBlocksRenderer({ blocks }) {
  if (blocks == null) return null;

  if (typeof blocks === "string") {
    const s = blocks.trim();
    if (s.startsWith("<")) {
      return (
        <div
          className={styles.htmlFromCms}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML from Sanity CMS
          dangerouslySetInnerHTML={{ __html: blocks }}
        />
      );
    }
    return <div className={styles.prosePlain}>{blocks}</div>;
  }

  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const headings = extractPortableTextHeadings(blocks);
  const headingQueue = createHeadingQueue(headings);

  return (
    <div className={styles.prose}>
      {renderBlockSequence(blocks, "body", headingQueue)}
    </div>
  );
}
