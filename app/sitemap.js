import { tryGetArticlesForHome, tryGetClientShowcases } from "../lib/cms.js";
import { SERVICE_SLUGS, SERVICES_UPDATED } from "./_usluge/slugs.js";

const SITE_URL = "https://www.digitl.rs";

export const revalidate = 3600; // refresh the sitemap every hour

/* The service pages are static, so they are listed by hand; projects and
   blog posts come from Sanity. */
export default async function sitemap() {
  const [showcases, articles] = await Promise.all([
    tryGetClientShowcases(200),
    tryGetArticlesForHome(200),
  ]);

  const staticEntries = [
    {
      url: SITE_URL,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/usluge`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${SITE_URL}/usluge/${slug}`,
      lastModified: SERVICES_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    })),
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/journal`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const showcaseEntries = showcases.map((showcase) => ({
    url: `${SITE_URL}/projects/${encodeURIComponent(showcase.slug)}`,
    lastModified: showcase.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articleEntries = articles.map((article) => ({
    url: `${SITE_URL}/journal/${encodeURIComponent(article.slug)}`,
    lastModified: article.publishedAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...showcaseEntries, ...articleEntries];
}
