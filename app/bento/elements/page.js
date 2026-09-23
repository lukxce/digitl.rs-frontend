import { sanityClient } from "../../../lib/sanity/client.js";
import { tryGetArticlesForHome } from "../../../lib/cms.js";
import ElementsGrid from "../../_bento/ElementsGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — elementi",
  robots: { index: false, follow: false },
};

/** @param {string} text */
function firstSentence(text) {
  if (typeof text !== "string") return null;
  return text.split(/(?<=\.)\s+/)[0]?.trim() || null;
}

/** The same shape the homepage loader builds, so the cards get real data. */
async function getClients() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "clientShowcase"]{
        title, clientName, category, "slug": slug,
        "before": keyTakeaways[0].description,
        "takeaways": keyTakeaways[].title,
        "cover": coverPhoto.asset->url,
        "metrics": successRate[]{title, subtitle}
      }`,
    );

    return rows
      .map((r) => {
        const slug = typeof r.slug === "string" ? r.slug : r.slug?.current;
        const after = (r.metrics ?? [])
          .filter((m) => m?.title && m?.subtitle)
          .filter((m) => !/godin\w*\s+iskustva/i.test(m.subtitle))
          .slice(0, 3)
          .map((m) => ({ value: m.title, label: m.subtitle }));
        if (!slug || after.length === 0) return null;
        return {
          slug,
          href: `/projects/${slug}`,
          clientName: r.clientName ?? r.title,
          cover: r.cover ?? null,
          category: r.category ?? "",
          before: firstSentence(r.before) ?? "",
          takeaways: (r.takeaways ?? []).filter(Boolean),
          after,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function ElementsPage() {
  const [clients, articles] = await Promise.all([
    getClients(),
    tryGetArticlesForHome(3),
  ]);

  const lessons = [];
  const most = Math.max(0, ...clients.map((c) => c.takeaways.length));
  for (let i = 0; i < most; i++)
    for (const c of clients)
      if (c.takeaways[i])
        lessons.push({
          text: c.takeaways[i],
          client: c.clientName,
          href: c.href,
        });

  return (
    <ElementsGrid
      clients={clients}
      lessons={lessons}
      articles={articles.map(({ slug, title, publishedAt }) => ({
        slug,
        title,
        publishedAt,
      }))}
    />
  );
}
