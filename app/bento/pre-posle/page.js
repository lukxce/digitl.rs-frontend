import { sanityClient } from "../../../lib/sanity/client.js";
import PrePosleGrid from "../../_bento/PrePosleGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — pre / posle",
  robots: { index: false, follow: false },
};

/**
 * "Pre" is the opening line of each case study's first takeaway, trimmed to
 * a sentence or two. "Posle" is that client's published metrics. Nothing is
 * written for the layout — if a client has neither, it is left out.
 */
function firstSentences(text, count = 2) {
  if (typeof text !== "string") return null;
  const parts = text.split(/(?<=\.)\s+/);
  return parts.slice(0, count).join(" ").trim() || null;
}

async function getPairs() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "clientShowcase"] | order(publishedAt desc){
        title, clientName, "slug": slug,
        "before": keyTakeaways[0].description,
        "metrics": successRate[]{title, subtitle}
      }`,
    );

    return rows
      .map((r) => {
        const slug = typeof r.slug === "string" ? r.slug : r.slug?.current;
        const before = firstSentences(r.before, 1);
        const after = (r.metrics ?? [])
          .filter((m) => m?.title && m?.subtitle)
          .slice(0, 2)
          .map((m) => ({ value: m.title, label: m.subtitle }));
        if (!before || after.length === 0) return null;
        return {
          slug,
          href: slug ? `/projects/${slug}` : "/projects",
          client: r.clientName ?? r.title,
          before,
          after,
        };
      })
      .filter(Boolean)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export default async function PrePoslePage() {
  const pairs = await getPairs();
  return <PrePosleGrid pairs={pairs} />;
}
