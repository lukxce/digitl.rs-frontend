import { notFound } from "next/navigation";
import { tryFindArticle, tryGetArticlesForHome } from "../../../lib/cms.js";
import AvatarInfo from "../../components/AvatarInfo";
import ClientsLogosCarousel from "../../components/ClientsLogosCarousel";
import ContactForm from "../../components/ContactForm";
import JournalArticleContent from "../../components/JournalArticleContent";
import JournalList from "../../components/JournalList";
import MotionTitleBlock from "../../components/MotionTitleBlock";
import ShowcaseKeyTakeaways from "../../components/ShowcaseKeyTakeaways";
import BlocksRenderer from "../../components/BlocksRenderer";
import innerStyles from "../../innerPage.module.css";
import styles from "./article.module.css";

function extractFirstParagraph(blocks) {
  if (typeof blocks === "string") {
    const s = blocks.trim();
    if (s.startsWith("<")) {
      const m = s.match(/^<p[^>]*>([\s\S]*?)<\/p>/i);
      if (m) {
        const text = m[1].replace(/<[^>]*>/g, "").trim();
        if (text) return [text, s.slice(m[0].length).trim()];
      }
    } else {
      const parts = s.split(/\n\s*\n/);
      if (parts.length > 1) {
        const first = parts[0].replace(/^#+\s+/gm, "").trim();
        if (first && !first.startsWith("!["))
          return [first, parts.slice(1).join("\n\n")];
      }
    }
    return [null, blocks];
  }
  if (!Array.isArray(blocks)) return [null, blocks];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!block || typeof block !== "object") continue;
    if (
      block.type === "paragraph" &&
      !block.__component &&
      Array.isArray(block.children)
    ) {
      const text = block.children.map((c) => c.text ?? "").join("");
      if (text.trim())
        return [text.trim(), [...blocks.slice(0, i), ...blocks.slice(i + 1)]];
    }
    if (block.__component) {
      const comp = block.__component;
      if (
        comp.includes("rich-text") ||
        comp.includes("richtext") ||
        comp.includes("paragraph")
      ) {
        const bodyKey = ["body", "content", "text", "richText", "copy"].find(
          (k) => Array.isArray(block[k]),
        );
        if (bodyKey) {
          const inner = block[bodyKey];
          const pIdx = inner.findIndex(
            (b) => b?.type === "paragraph" && Array.isArray(b?.children),
          );
          if (pIdx !== -1) {
            const text = inner[pIdx].children.map((c) => c.text ?? "").join("");
            if (text.trim()) {
              const newInner = [
                ...inner.slice(0, pIdx),
                ...inner.slice(pIdx + 1),
              ];
              const remaining = [
                ...blocks.slice(0, i),
                ...(newInner.length > 0
                  ? [{ ...block, [bodyKey]: newInner }]
                  : []),
                ...blocks.slice(i + 1),
              ];
              return [text.trim(), remaining];
            }
          }
        }
        const strKey = ["body", "content", "text", "richText", "copy"].find(
          (k) => typeof block[k] === "string",
        );
        if (strKey) {
          const [intro, rest] = extractFirstParagraph(block[strKey]);
          if (intro)
            return [
              intro,
              [
                ...blocks.slice(0, i),
                ...(rest ? [{ ...block, [strKey]: rest }] : []),
                ...blocks.slice(i + 1),
              ],
            ];
        }
      }
      continue;
    }
    if (block.type === "heading" || block.type === "image") continue;
    break;
  }
  return [null, blocks];
}

export async function generateStaticParams() {
  const articles = await tryGetArticlesForHome(200);
  return articles.map((a) => ({ slug: a.slug }));
}

export const revalidate = 60;

/* The previous blog post design, kept in case the new one at
   /journal/[slug] is not liked. Out of the index. */
export async function generateMetadata(props) {
  const params = await props.params;
  const article = await tryFindArticle(params.slug);
  return {
    title: article ? `${article.title} (prethodni dizajn)` : "Article",
    robots: { index: false, follow: false },
  };
}

export default async function JournalArticlePage(props) {
  const params = await props.params;
  const slug = params.slug;
  const article = await tryFindArticle(slug);
  if (!article) notFound();

  const [introText, remainingBlocks] = extractFirstParagraph(article.blocks);

  const hasBlocks =
    remainingBlocks != null &&
    (typeof remainingBlocks === "string" ||
      (Array.isArray(remainingBlocks) && remainingBlocks.length > 0));

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
        backHref="/v2-journal"
        title={article.title}
        description={article.description}
        intro={introText}
        author={article.author}
        publishedAt={article.publishedAt}
        coverUrl={article.coverUrl}
        afterCover={
          (article.keyTakeaways?.length ?? 0) > 0
            ? <ShowcaseKeyTakeaways items={article.keyTakeaways} />
            : null
        }
      >
        {hasBlocks
          ? <BlocksRenderer blocks={remainingBlocks} />
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
        ? <JournalList
            limit={3}
            items={moreArticles}
            marginTop={40}
            basePath="/v2-journal"
          />
        : null}

      <MotionTitleBlock
        title="Klijenti sa kojima gradimo rezultate"
        subtitle="Pridružite se brendovima koji su marketing prepustili timu koji ga shvata ozbiljno."
        className={innerStyles.titleContainer}
        width={440}
        subtitleWidth={380}
        subtitleWidthMobile={320}
      />
      <ClientsLogosCarousel />
      {/* <Subscribe /> */}
      <AvatarInfo />
      <ContactForm />
    </main>
  );
}
