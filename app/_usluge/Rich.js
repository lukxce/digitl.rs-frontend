import Link from "next/link";

/** A line of copy with [inline links](/path). Internal paths go through
    next/link; anything else opens in a new tab. */
export default function Rich({ text }) {
  const s = String(text ?? "");
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const out = [];
  let last = 0;
  let m = re.exec(s);
  while (m) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const [, label, href] = m;
    out.push(
      href.startsWith("/")
        ? <Link key={m.index} href={href}>
            {label}
          </Link>
        : <a key={m.index} href={href} target="_blank" rel="noopener">
            {label}
          </a>,
    );
    last = m.index + m[0].length;
    m = re.exec(s);
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** The same text with the link syntax taken out (for meta and JSON-LD). */
export const plain = (text) =>
  String(text ?? "").replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
