import { safeLinkHref } from "../../lib/sanitizeHtml.js";
import BlocksRenderer from "../components/BlocksRenderer";
import Figure from "./Figure";
import p from "./prose.module.css";
import Tie from "./Tie";
import { img, imgSet } from "./util";

/* ── inline Markdown → React nodes (nothing is injected as HTML) ───────── */
const L = "[\\p{L}\\p{N}";
const INLINE = new RegExp(
  [
    "\\*\\*(?=\\S)(.+?)(?<=\\S)\\*\\*", // 1 bold
    `(?<!${L}_])__(?=\\S)(.+?)(?<=\\S)__(?!${L}_])`, // 2 bold
    "`([^`]+)`", // 3 code
    '(!?)\\[([^\\]]+)\\]\\(\\s*([^)\\s]+)(?:\\s+"([^"]*)")?\\s*\\)', // 4-7 link, image
    `(?<!${L}*])\\*(?=\\S)([^*]+?)(?<=\\S)\\*(?!${L}*])`, // 8 italic
    `(?<!${L}_])_(?=\\S)([^_]+?)(?<=\\S)_(?!${L}_])`, // 9 italic
  ].join("|"),
  "gu",
);

// "\*" is a star, not the start of italics: escaped marks sit out the
// parsing as private-use characters and come back when text is written.
const MARKS = "\\`*_{}[]()#+-.!>|~";
const hide = (s) =>
  s.replace(/\\([\\`*_{}[\]()#+\-.!>|~])/g, (_, c) =>
    String.fromCharCode(0xe000 + MARKS.indexOf(c)),
  );
const show = (s) =>
  s.replace(/[-]/g, (c) => MARKS[c.charCodeAt(0) - 0xe000] ?? "");

const OURS = /^https?:\/\/(www\.)?digitl\.rs(\/|$)/i;

function spans(text, k) {
  const out = [];
  let last = 0;
  let n = 0;
  const say = (s) => {
    if (s) out.push(<Tie key={`${k}t${n++}`}>{show(s)}</Tie>);
  };
  for (const m of text.matchAll(INLINE)) {
    say(text.slice(last, m.index));
    last = m.index + m[0].length;
    const key = `${k}m${n++}`;
    if (m[1] ?? m[2])
      out.push(<strong key={key}>{spans(m[1] ?? m[2], key)}</strong>);
    else if (m[3]) out.push(<code key={key}>{show(m[3])}</code>);
    else if (m[5] != null) {
      const href = safeLinkHref(show(m[6]));
      if (m[4])
        out.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={key} src={href} alt={show(m[5])} loading="lazy" />,
        );
      else {
        const away = /^https?:\/\//i.test(href) && !OURS.test(href);
        out.push(
          <a
            key={key}
            href={href}
            title={m[7] ? show(m[7]) : undefined}
            target={away ? "_blank" : undefined}
            rel={away ? "noopener noreferrer" : undefined}
          >
            {spans(m[5], key)}
          </a>,
        );
      }
    } else out.push(<em key={key}>{spans(m[8] ?? m[9], key)}</em>);
  }
  say(text.slice(last));
  return out;
}

const inline = (text, k) => spans(hide(text), k);

/* ── blocks ───────────────────────────────────────────────────────────── */
function Node({ n, k }) {
  switch (n.type) {
    case "p":
      return <p>{inline(n.text, k)}</p>;
    case "heading": {
      const H = `h${n.level}`;
      return <H id={n.id}>{inline(n.text, k)}</H>;
    }
    case "list": {
      const List = n.ordered ? "ol" : "ul";
      return (
        <List
          start={n.ordered && n.start > 1 ? n.start : undefined}
          style={
            n.ordered ? { counterReset: `step ${n.start - 1}` } : undefined
          }
        >
          {n.items.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list from the CMS
            <li key={i}>
              <span>{inline(item, `${k}-${i}`)}</span>
            </li>
          ))}
        </List>
      );
    }
    case "quote":
      return (
        <blockquote>
          {n.paragraphs.map((text, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list from the CMS
            <p key={i}>{inline(text, `${k}-${i}`)}</p>
          ))}
          {n.cite ? <cite>{n.cite}</cite> : null}
        </blockquote>
      );
    case "figure":
      return (
        <Figure
          className={p.figure}
          src={img(n.src, 1400, 82)}
          srcSet={imgSet(n.src, [700, 1000, 1400, 1600], 82)}
          sizes="(max-width: 1100px) 100vw, 900px"
          alt={n.alt}
          width={n.width}
          height={n.height}
          caption={n.caption}
        />
      );
    case "table":
      return (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scrolling region has to be reachable by keyboard
        <section className={p.table} aria-label="Tabela" tabIndex={0}>
          <table>
            <thead>
              <tr>
                {n.head.map((cell, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed table from the CMS
                  <th key={i} style={{ textAlign: n.align[i] ?? undefined }}>
                    {inline(cell, `${k}-h${i}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {n.rows.map((row, r) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed table from the CMS
                <tr key={r}>
                  {n.head.map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: a fixed table from the CMS
                    <td key={i} style={{ textAlign: n.align[i] ?? undefined }}>
                      {inline(row[i] ?? "", `${k}-${r}-${i}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "code":
      return (
        <pre>
          <code>{n.text}</code>
        </pre>
      );
    case "rule":
      return <hr />;
    case "legacy":
      return (
        <div className={p.legacy}>
          <BlocksRenderer blocks={[n.block]} />
        </div>
      );
    default:
      return null;
  }
}

/** The article body. `nodes` come from parseBlocks(); when the CMS sends a
    shape that parser does not read (HTML, Portable Text, Strapi block JSON),
    pass the raw `blocks` and the site's existing renderer draws them inside
    the same typography. */
export default function Prose({ nodes, blocks }) {
  if (!nodes)
    return (
      <div className={`${p.prose} ${p.legacy}`}>
        <BlocksRenderer blocks={blocks} />
      </div>
    );
  return (
    <div className={p.prose}>
      {nodes.map((n, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a fixed list from the CMS
        <Node key={i} n={n} k={`n${i}`} />
      ))}
    </div>
  );
}
