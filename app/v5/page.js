import { Manrope } from "next/font/google";
import { sanityClient } from "../../lib/sanity/client.js";
import { getClients } from "./data";
import HomeV5 from "./HomeV5";

// Serbian needs latin-ext (č, ć, đ, š, ž).
const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-v5-sans",
  display: "swap",
});

export const revalidate = 60;

export const metadata = {
  title: "Marketing koji se meri profitom",
  // A design study next to the live homepage — keep it out of search.
  robots: { index: false, follow: false },
};

async function getArticles() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "article"] | order(publishedAt desc)[0...4]{
        title, "slug": slug, publishedAt, description,
        "cover": cover.asset->url,
        "author": author.name, "avatar": author.avatar.asset->url,
        "body": blocks[].body
      }`,
    );
    return rows
      .map((r) => {
        const words = (r.body ?? [])
          .filter((x) => typeof x === "string")
          .join(" ")
          .split(/\s+/)
          .filter(Boolean).length;
        return {
          title: r.title,
          slug: typeof r.slug === "string" ? r.slug : r.slug?.current,
          publishedAt: r.publishedAt,
          description: r.description ?? "",
          cover: r.cover ? `${r.cover}?w=1200&fm=webp&q=78` : null,
          author: r.author ?? null,
          avatar: r.avatar ? `${r.avatar}?w=96&fm=webp` : null,
          minutes: words ? Math.max(1, Math.round(words / 200)) : null,
        };
      })
      .filter((a) => a.slug);
  } catch {
    return [];
  }
}

export default async function Page() {
  const [clients, articles] = await Promise.all([getClients(), getArticles()]);
  return <HomeV5 clients={clients} articles={articles} fonts={sans.variable} />;
}
