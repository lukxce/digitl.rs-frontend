import { notFound } from "next/navigation";
import {
  tryFindArticle,
  tryGetArticlesForHome,
} from "../../../lib/articles.js";
import AvatarInfo from "../../components/AvatarInfo";
import ClientsLogosCarousel from "../../components/ClientsLogosCarousel";
import ContactForm from "../../components/ContactForm";
import JournalArticleContent from "../../components/JournalArticleContent";
import JournalList from "../../components/JournalList";
import MotionTitleBlock from "../../components/MotionTitleBlock";
import ShowcaseKeyTakeaways from "../../components/ShowcaseKeyTakeaways";
import StrapiBlocksRenderer from "../../components/StrapiBlocksRenderer";
import Subscribe from "../../components/Subscribe";
import innerStyles from "../../innerPage.module.css";
import styles from "./article.module.css";

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

export async function generateStaticParams() {
  const articles = await tryGetArticlesForHome(200);
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const slug = params.slug;
  const article = await tryFindArticle(slug);
  if (!article) {
    return { title: "Article" };
  }
  const desc =
    typeof article.description === "string"
      ? article.description
      : typeof article.excerpt === "string"
        ? article.excerpt
        : typeof article.subtitle === "string"
          ? article.subtitle
          : blocksToPlainText(article.blocks).slice(0, 160);
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

export default async function JournalArticlePage(props) {
  const params = await props.params;
  const slug = params.slug;
  const article = await tryFindArticle(slug);
  if (!article) notFound();

  const hasBlocks =
    article.blocks != null &&
    (typeof article.blocks === "string" ||
      (Array.isArray(article.blocks) && article.blocks.length > 0));

  const articles = await tryGetArticlesForHome(10);
  const moreArticles = articles
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3)
    .map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      publishedAt: entry.publishedAt,
      imageUrl: entry.coverUrl,
    }));

  return (
    <main
      className={`${innerStyles.pageDetail} ${innerStyles.pageDetailTop} ${innerStyles.pageJournal}`.trim()}
    >
      {/* <DetailPageOutline items={outline}> */}
      <JournalArticleContent
        title={article.title}
        description={article.description}
        author={article.author}
        publishedAt={article.publishedAt}
        coverUrl={article.coverUrl}
        beforeCover={
          (article.keyTakeaways?.length ?? 0) > 0
            ? <ShowcaseKeyTakeaways items={article.keyTakeaways} />
            : null
        }
      >
        {hasBlocks
          ? <StrapiBlocksRenderer blocks={article.blocks} />
          : <p className={styles.empty}>No body content for this entry.</p>}
      </JournalArticleContent>
      {/* </DetailPageOutline> */}

      <MotionTitleBlock
        title="More articles"
        subtitle="Check out some of my favorite & most recent articles."
        className={`${innerStyles.titleContainer} ${innerStyles.moreArticlesTitle}`}
        width={500}
        subtitleWidth={300}
        subtitleWidthMobile={200}
      />
      {moreArticles.length > 0
        ? <JournalList limit={3} items={moreArticles} marginTop={40} />
        : null}

      <MotionTitleBlock
        title="Join 150+ professionals elevating their brand"
        subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
        className={innerStyles.titleContainer}
        width={600}
        subtitleWidth={425}
      />
      <ClientsLogosCarousel />
      <Subscribe />
      <AvatarInfo />
      <ContactForm />
    </main>
  );
}
