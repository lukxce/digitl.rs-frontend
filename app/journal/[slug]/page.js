import { notFound } from "next/navigation";
import { tryFindArticle, tryGetArticlesForHome } from "../../../lib/cms.js";
import Article from "../../_blog/Article";
import { categoryOf } from "../../_blog/categories";
import { SITE_URL, toCard } from "../../_blog/util";
import { sans } from "../../_home/font";
import Shell from "../../_home/Shell";

function blocksToPlainText(blocks) {
  if (blocks == null) return "";
  if (typeof blocks === "string") {
    return blocks
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (!Array.isArray(blocks)) return "";
  const lines = [];
  for (const block of blocks) {
    if (block?.__component) continue;
    if (
      (block.type === "paragraph" || block.type === "heading") &&
      Array.isArray(block.children)
    ) {
      lines.push(block.children.map((c) => c.text ?? "").join(""));
    }
  }
  return lines.filter(Boolean).join("\n\n");
}

/** Description, then excerpt, then subtitle, then the start of the text. */
function describe(article) {
  return typeof article.description === "string"
    ? article.description
    : typeof article.excerpt === "string"
      ? article.excerpt
      : typeof article.subtitle === "string"
        ? article.subtitle
        : blocksToPlainText(article.blocks).slice(0, 160);
}

export async function generateStaticParams() {
  const articles = await tryGetArticlesForHome(200);
  return articles.map((a) => ({ slug: a.slug }));
}

export const revalidate = 60;

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;
  const article = await tryFindArticle(slug);
  if (!article) {
    return { title: "Tekst nije pronađen" };
  }
  const desc = describe(article);
  const canonicalPath = `/journal/${encodeURIComponent(article.slug)}`;
  return {
    title: article.title,
    description: desc,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: article.title,
      description: desc,
      publishedTime: article.publishedAt ?? undefined,
      images: article.coverUrl ? [{ url: article.coverUrl }] : undefined,
    },
    twitter: {
      card: article.coverUrl ? "summary_large_image" : "summary",
      title: article.title,
      description: desc,
    },
  };
}

/** Article and breadcrumb trail for search engines. */
function jsonLd(article) {
  const url = `${SITE_URL}/journal/${encodeURIComponent(article.slug)}`;
  const publisher = {
    "@type": "Organization",
    name: "Digitl",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/digitl-logo.png` },
  };
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        headline: article.title,
        description: describe(article) || undefined,
        image: article.coverUrl ? [article.coverUrl] : undefined,
        datePublished: article.publishedAt ?? undefined,
        articleSection: categoryOf(article),
        inLanguage: "sr-Latn-RS",
        author: article.author?.name
          ? { "@type": "Person", name: article.author.name }
          : { "@type": "Organization", name: "Digitl", url: SITE_URL },
        publisher,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: "Početna", item: `${SITE_URL}/` },
          { name: "Blog", item: `${SITE_URL}/journal` },
          { name: article.title, item: url },
        ].map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...crumb,
        })),
      },
    ],
  };
  // "<" is escaped so nothing in a title can close the script element
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

export default async function JournalArticlePage(props) {
  const params = await props.params;
  const slug = params.slug;
  const article = await tryFindArticle(slug);
  if (!article) notFound();

  const articles = await tryGetArticlesForHome(10);
  const more = articles
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3)
    .map(toCard);

  return (
    <Shell fonts={sans.variable}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD built from CMS fields, serialised and escaped above
        dangerouslySetInnerHTML={{ __html: jsonLd(article) }}
      />
      <Article key={article.slug} article={article} more={more} />
    </Shell>
  );
}
