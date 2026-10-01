import { sanityClient } from "../../lib/sanity/client.js";
import HomeV5 from "./HomeV5";

export const revalidate = 60;

export const metadata = {
  title: "Marketing koji donosi prave rezultate",
  // A design study next to the live homepage — keep it out of search.
  robots: { index: false, follow: false },
};

/** "3.157" / "29.8K" / "1. mesec" → parts a counter can roll. */
function parseMetric(value) {
  const m = String(value).match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return { text: String(value) };
  const raw = m[1];
  const rest = m[2];
  // Serbian thousands separator: a dot followed by exactly three digits.
  if (/^\d{1,3}(\.\d{3})+$/.test(raw)) {
    return { num: Number(raw.replaceAll(".", "")), decimals: 0, thousands: true, suffix: rest };
  }
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { num: Number(raw.replace(",", ".")), decimals, thousands: false, suffix: rest };
}

async function getClients() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "clientShowcase"] | order(publishedAt desc) {
        clientName, category, "slug": slug,
        "cover": coverPhoto.asset->url,
        "logo": clientLogo.asset->url,
        "metrics": successRate[]{title, subtitle},
        "takeaways": keyTakeaways[]{title, description}
      }`,
    );
    return rows
      .map((r) => {
        const slug = typeof r.slug === "string" ? r.slug : r.slug?.current;
        const metrics = (r.metrics ?? [])
          .filter((m) => m?.title && m?.subtitle)
          // The client's own years in business is their history, not our result.
          .filter((m) => !/godin\w*\s+iskustva/i.test(m.subtitle))
          .slice(0, 3)
          .map((m) => ({ value: m.title, label: m.subtitle, ...parseMetric(m.title) }));
        if (!slug || !r.cover || metrics.length === 0) return null;
        return {
          slug,
          href: `/projects/${slug}`,
          name: r.clientName,
          category: r.category ?? "",
          cover: `${r.cover}?w=1600&fm=webp&q=80`,
          logo: r.logo ?? null,
          metrics,
          takeaways: (r.takeaways ?? []).filter((t) => t?.title),
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function getArticles() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "article"] | order(publishedAt desc)[0...3]{ title, "slug": slug, publishedAt }`,
    );
    return rows
      .map((r) => ({
        title: r.title,
        slug: typeof r.slug === "string" ? r.slug : r.slug?.current,
        publishedAt: r.publishedAt,
      }))
      .filter((a) => a.slug);
  } catch {
    return [];
  }
}

export default async function Page() {
  const [clients, articles] = await Promise.all([getClients(), getArticles()]);
  return <HomeV5 clients={clients} articles={articles} />;
}
