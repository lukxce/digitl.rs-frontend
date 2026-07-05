import { tryGetArticlesForHome } from "../lib/articles.js";
import { tryGetClientShowcases } from "../lib/clientShowcases.js";

const SITE_URL = "https://www.digitl.me";

export const revalidate = 3600; // refresh the sitemap every hour

export default async function sitemap() {
  const [articles, showcases] = await Promise.all([
    tryGetArticlesForHome(200),
    tryGetClientShowcases(200),
  ]);

  const staticEntries = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/journal/${encodeURIComponent(article.slug)}`,
    lastModified: article.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const showcaseEntries = showcases.map((showcase) => ({
    url: `${SITE_URL}/projects/${encodeURIComponent(showcase.slug)}`,
    lastModified: showcase.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...showcaseEntries, ...articleEntries];
}
