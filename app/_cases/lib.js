/* Helpers shared by the projects listing and the case study page. */

export const SITE_URL = "https://www.digitl.rs";

/* ── images ───────────────────────────────────────────────────────────── */
// Covers and screenshots are 3200x1800 PNGs on the Sanity CDN; nothing on
// these pages asks for the original.
const SANITY_IMAGE = /^https:\/\/cdn\.sanity\.io\/images\//;

function canResize(url) {
  return (
    typeof url === "string" &&
    SANITY_IMAGE.test(url) &&
    !/\.svg(\?|$)/i.test(url)
  );
}

/** Sanity file names carry the pixel size: "…-3200x1800.png". */
export function imageSize(url) {
  const m =
    typeof url === "string"
      ? url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i)
      : null;
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

export function sized(url, w, q = 80, fm = "webp") {
  if (!canResize(url)) return url ?? null;
  const natural = imageSize(url)?.width;
  const width = natural ? Math.min(w, natural) : w;
  return `${url}${url.includes("?") ? "&" : "?"}w=${width}&fm=${fm}&q=${q}`;
}

export function srcSet(url, widths, q = 80) {
  if (!canResize(url)) return undefined;
  const natural = imageSize(url)?.width ?? Number.POSITIVE_INFINITY;
  const list = [...new Set(widths.map((w) => Math.min(w, natural)))];
  return list.map((w) => `${sized(url, w, q)} ${w}w`).join(", ");
}

/* ── text ─────────────────────────────────────────────────────────────── */
/** Cuts at a word boundary, for meta descriptions. */
export function trimText(text, max = 160) {
  const s = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > 60 ? cut.slice(0, at) : cut).replace(/[\s,;:.]+$/, "")}…`;
}

export function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Fixed locale and time zone, so server and browser print the same date. */
export function monthYear(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("sr-Latn-RS", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/* ── numbers ──────────────────────────────────────────────────────────── */
// Story numbers arrive as finished Serbian strings ("2.836", "7,1", "12+",
// "1. mesec"). They are shown as given. A count-up runs only for the ones
// that parse back to exactly the same string.

/** 2836.4 → "2.836,4": dot for thousands, comma for decimals. */
export function formatSr(n, decimals = 0, grouped = true) {
  const [int, dec] = Math.abs(n).toFixed(decimals).split(".");
  const head = grouped ? int.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : int;
  return `${n < 0 ? "-" : ""}${head}${dec ? `,${dec}` : ""}`;
}

export function parseSr(value) {
  const s = String(value ?? "").trim();
  const m = s.match(/^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?([+%]?)$/);
  if (!m) return null;
  const grouped = m[1].includes(".");
  const decimals = m[2]?.length ?? 0;
  const num = Number(`${m[1].replaceAll(".", "")}${m[2] ? `.${m[2]}` : ""}`);
  const suffix = m[3] ?? "";
  if (!Number.isFinite(num)) return null;
  // "0123" or "12345" without separators would not come back the same
  if (`${formatSr(num, decimals, grouped)}${suffix}` !== s) return null;
  return { num, decimals, grouped, suffix };
}

/* How wide a display value sets, in em (Manrope 800, measured per glyph and
   rounded up), so a row of big values can be sized to fit its narrowest
   cell: "7" and "3. mesec" then share one size and neither overflows. */
const NARROW = "ijlI.,:;!|'’/- ";
const SLIM = 'frt1()„“"';
const WIDE = "mMW%";
export function emWidth(value, tracking = -0.06) {
  let w = 0;
  let n = 0;
  for (const ch of String(value ?? "")) {
    n++;
    if (NARROW.includes(ch)) w += 0.33;
    else if (SLIM.includes(ch)) w += 0.47;
    else if (WIDE.includes(ch)) w += 0.94;
    else if (ch === "w") w += 0.82;
    else if (ch === "0") w += 0.68;
    else if (/[A-ZČĆŠŽĐ]/.test(ch)) w += 0.75;
    else w += 0.63;
  }
  return Math.max(1, (w + n * tracking) * 1.03);
}

/** The em width a row of values has to make room for. */
export function widestEm(values, tracking) {
  const em = Math.max(1, ...values.map((v) => emWidth(v, tracking)));
  return Math.round(em * 100) / 100;
}

/** 82.7 → "82,7%", 64 → "64%". */
export function percentSr(value) {
  const v = Math.round(Number(value) * 10) / 10;
  return `${formatSr(v, Number.isInteger(v) ? 0 : 1, false)}%`;
}

/* ── the card a project shows on the listing ──────────────────────────── */
// The client's own years in business is their history, not our result.
const YEARS = /godin\w*\s+iskustva/i;

export function cardOf(showcase, story) {
  const name = showcase.clientName || showcase.title;
  const numbers = story?.numbers?.length
    ? story.numbers.map((n) => ({ value: n.value, label: n.label }))
    : (showcase.successRate ?? [])
        .filter((m) => m.title && m.subtitle && !YEARS.test(m.subtitle))
        .map((m) => ({ value: m.title, label: m.subtitle }));
  return {
    slug: showcase.slug,
    href: showcase.href,
    name,
    category: showcase.category ?? "",
    // without a logo the CMS hands back the cover again
    logo:
      showcase.thumbSrc && showcase.thumbSrc !== showcase.coverUrl
        ? showcase.thumbSrc
        : null,
    cover: showcase.coverUrl ?? null,
    headline:
      story?.headline ??
      (showcase.title && showcase.title !== name ? showcase.title : null),
    blurb: story?.standfirst ?? showcase.description ?? null,
    numbers: numbers.filter((n) => n.value).slice(0, 3),
    services: story?.services ?? [],
  };
}
