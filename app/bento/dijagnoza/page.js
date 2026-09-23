import { sanityClient } from "../../../lib/sanity/client.js";
import { tryGetArticlesForHome } from "../../../lib/cms.js";
import DijagnozaGrid from "../../_bento/DijagnozaGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — odakle vam stižu klijenti?",
  robots: { index: false, follow: false },
};

/** @param {string} text */
function firstSentence(text) {
  if (typeof text !== "string") return null;
  return text.split(/(?<=\.)\s+/)[0]?.trim() || null;
}

/** Clients keyed by slug so an answer can select the closest story. */
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
          /* "11+ godina iskustva" is the client's history, not a result we
             produced — it tells a visitor nothing about working with us. */
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

export default async function DijagnozaPage() {
  const [clients, articles] = await Promise.all([
    getClients(),
    tryGetArticlesForHome(3),
  ]);

  /* One line per case-study takeaway, interleaved so two lessons from the
     same client never follow each other. */
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
    <DijagnozaGrid
      clients={clients}
      lessons={lessons}
      testimonials={[]}
      articles={articles.map(({ slug, title, publishedAt }) => ({
        slug,
        title,
        publishedAt,
      }))}
    />
  );
}
