import { sanityClient } from "../../../lib/sanity/client.js";
import { tryGetArticlesForHome } from "../../../lib/cms.js";
import FinalGrid from "../../_bento/FinalGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — jedan sistem",
  robots: { index: false, follow: false },
};

/** @param {string} text */
function firstSentence(text) {
  if (typeof text !== "string") return null;
  return text.split(/(?<=\.)\s+/)[0]?.trim() || null;
}

/**
 * One entry per client: the opening line of its case study as the "pre",
 * its published metrics as the "posle". A client missing either is left
 * out rather than padded.
 */
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
        const before = firstSentence(r.before);
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

export default async function FinalPage() {
  const [pairs, articles] = await Promise.all([
    getPairs(),
    tryGetArticlesForHome(3),
  ]);

  return (
    <FinalGrid
      pairs={pairs}
      articles={articles.map(({ slug, title, publishedAt }) => ({
        slug,
        title,
        publishedAt,
      }))}
    />
  );
}
