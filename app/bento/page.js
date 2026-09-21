import { tryGetArticlesForHome, tryGetClientShowcases } from "../../lib/cms.js";
import BentoGrid from "../_bento/BentoGrid";

export const revalidate = 60;

// A layout test, not the live homepage — keep it out of search results.
export const metadata = {
  title: "digitl — bento",
  robots: { index: false, follow: false },
};

export default async function BentoPage() {
  const [articles, showcases] = await Promise.all([
    tryGetArticlesForHome(6),
    tryGetClientShowcases(6),
  ]);

  return (
    <BentoGrid
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
        subtitle: c.subtitle,
        backgroundSrc: c.backgroundSrc,
        thumbSrc: c.thumbSrc,
      }))}
    />
  );
}
