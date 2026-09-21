import { sanityClient } from "../../../lib/sanity/client.js";
import {
  tryGetArticlesForHome,
  tryGetClientShowcases,
} from "../../../lib/cms.js";
import SistemGrid from "../../_bento/SistemGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — jedan sistem",
  robots: { index: false, follow: false },
};

/**
 * Real metrics off the case studies, so the proof tiles state numbers the
 * site already stands behind rather than invented ones.
 */
async function getProof() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "clientShowcase" && defined(successRate)]{
        clientName, "metrics": successRate[]{title, subtitle}
      }`,
    );
    const wanted = [
      ["ThermiQ", "impresija"],
      ["ThermiQ", "indeksiranih"],
      ["Servis Klime Niš", "PageSpeed"],
    ];
    const out = [];
    for (const [client, needle] of wanted) {
      const doc = rows.find((r) => r.clientName === client);
      const m = doc?.metrics?.find((x) => x?.subtitle?.includes(needle));
      if (m?.title) out.push({ value: m.title, label: m.subtitle, client });
    }
    return out;
  } catch {
    return [];
  }
}

export default async function SistemPage() {
  const [articles, showcases, proof] = await Promise.all([
    tryGetArticlesForHome(4),
    tryGetClientShowcases(6),
    getProof(),
  ]);

  return (
    <SistemGrid
      proof={proof}
      articles={articles.map(({ slug, title, publishedAt }) => ({
        slug,
        title,
        publishedAt,
      }))}
      showcases={showcases.map((c) => ({
        slug: c.slug,
        href: c.href,
        title: c.title,
        clientName: c.clientName,
        category: c.category,
        backgroundSrc: c.backgroundSrc,
      }))}
    />
  );
}
