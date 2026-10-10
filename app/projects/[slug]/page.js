import { notFound } from "next/navigation";
import {
  tryFindClientShowcase,
  tryGetClientShowcases,
} from "../../../lib/cms.js";
import { cardOf, SITE_URL, sized, trimText } from "../../_cases/lib";
import { getStory } from "../../_cases/stories";
import Study from "../../_cases/Study";
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
      (block.type === "paragraph" ||
        block.type === "heading" ||
        block._type === "block") &&
      Array.isArray(block.children)
    ) {
      lines.push(block.children.map((child) => child.text ?? "").join(""));
    }
  }
  return lines.filter(Boolean).join("\n\n");
}

/** The story's standfirst when there is one, else what the CMS holds. */
function describe(showcase, story) {
  const text =
    story?.standfirst ??
    showcase.description ??
    showcase.category ??
    showcase.subtitle ??
    blocksToPlainText(showcase.content);
  return trimText(text, 160);
}

export async function generateStaticParams() {
  const showcases = await tryGetClientShowcases(200);
  return showcases.map((s) => ({ slug: s.slug }));
}

export const revalidate = 60;

export async function generateMetadata(props) {
  const params = await props.params;
  const showcase = await tryFindClientShowcase(params.slug);
  if (!showcase) {
    return { title: "Projekat" };
  }

  const description = describe(showcase, getStory(showcase.slug));
  const canonicalPath = `/projects/${encodeURIComponent(showcase.slug)}`;
  // the cover is a 3200px PNG; previews get a 1200px JPEG
  const image = showcase.coverUrl
    ? sized(showcase.coverUrl, 1200, 82, "jpg")
    : null;

  return {
    title: showcase.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: showcase.title,
      description,
      publishedTime: showcase.publishedAt ?? undefined,
      images: image ? [{ url: image, alt: showcase.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: showcase.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function structuredData(showcase, story) {
  const name = showcase.clientName || showcase.title;
  const url = `${SITE_URL}/projects/${encodeURIComponent(showcase.slug)}`;
  const publisher = {
    "@type": "Organization",
    name: "Digitl",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/digitl-logo.png` },
  };
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: story?.headline ?? showcase.title,
      description: describe(showcase, story),
      image: showcase.coverUrl
        ? [sized(showcase.coverUrl, 1600, 82, "jpg")]
        : undefined,
      datePublished: showcase.publishedAt ?? undefined,
      inLanguage: "sr-Latn",
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      author: publisher,
      publisher,
      about: {
        "@type": "Organization",
        name,
        url: showcase.websiteUrl ?? undefined,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projekti",
          item: `${SITE_URL}/projects`,
        },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];
}

export default async function ClientShowcasePage(props) {
  const params = await props.params;
  const showcase = await tryFindClientShowcase(params.slug);
  if (!showcase) notFound();

  const story = getStory(showcase.slug);
  const showcases = await tryGetClientShowcases(10);
  const more = showcases
    .filter(
      (entry) =>
        entry.slug !== showcase.slug &&
        entry.id !== showcase.id &&
        entry.documentId !== showcase.documentId,
    )
    .slice(0, 3)
    .map((entry) => cardOf(entry, getStory(entry.slug)));

  return (
    <Shell fonts={sans.variable}>
      {structuredData(showcase, story).map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: our own JSON-LD, with "<" escaped
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <Study showcase={showcase} story={story} more={more} />
    </Shell>
  );
}
