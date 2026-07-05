import { notFound } from "next/navigation";
import {
  tryFindClientShowcase,
  tryGetClientShowcases,
} from "../../../lib/clientShowcases.js";
import AvatarInfo from "../../components/AvatarInfo";
import ClientShowcaseHeader from "../../components/ClientShowcaseHeader";
import ClientsLogosCarousel from "../../components/ClientsLogosCarousel";
import ContactForm from "../../components/ContactForm";
import { DetailPageOutlineMobileNav } from "../../components/DetailPageOutline";
import LinkCard from "../../components/LinkCard";
import MotionTitleBlock from "../../components/MotionTitleBlock";
import ProjectArticleContent from "../../components/ProjectArticleContent";
import ProjectBlocksRenderer from "../../components/ProjectBlocksRenderer";
import ShowcaseKeyTakeaways from "../../components/ShowcaseKeyTakeaways";
import ShowcaseSuccessRate from "../../components/ShowcaseSuccessRate";
import Subscribe from "../../components/Subscribe";
import Title from "../../components/Title";
import innerStyles from "../../innerPage.module.css";
import articleStyles from "../../journal/[slug]/article.module.css";

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
      lines.push(block.children.map((child) => child.text ?? "").join(""));
    }
  }
  return lines.filter(Boolean).join("\n\n");
}

export async function generateStaticParams() {
  const showcases = await tryGetClientShowcases(200);
  return showcases.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const showcase = await tryFindClientShowcase(params.slug);
  if (!showcase) {
    return { title: "Project" };
  }

  const description =
    showcase.description ??
    showcase.category ??
    showcase.subtitle ??
    blocksToPlainText(showcase.content).slice(0, 160);
  const canonicalPath = `/projects/${encodeURIComponent(showcase.slug)}`;

  return {
    title: showcase.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      title: showcase.title,
      description,
      images: showcase.coverUrl ? [{ url: showcase.coverUrl }] : undefined,
    },
    twitter: {
      card: showcase.coverUrl ? "summary_large_image" : "summary",
      title: showcase.title,
      description,
    },
  };
}

export default async function ClientShowcasePage(props) {
  const params = await props.params;
  const showcase = await tryFindClientShowcase(params.slug);
  if (!showcase) notFound();

  const hasContent =
    showcase.content != null &&
    (typeof showcase.content === "string" ||
      (Array.isArray(showcase.content) && showcase.content.length > 0));

  const showcases = await tryGetClientShowcases(10);
  const moreProjects = showcases
    .filter(
      (entry) =>
        entry.slug !== showcase.slug &&
        entry.id !== showcase.id &&
        entry.documentId !== showcase.documentId,
    )
    .slice(0, 3);

  return (
    <main className={innerStyles.pageDetail}>
      {/* <DetailPageOutline items={outline}> */}
      <ProjectArticleContent
        title={showcase.title}
        showTitle={false}
        showMobileOutline={false}
        backHref="/projects"
        backLabel="Back to projects"
        lead={
          <ClientShowcaseHeader
            title={showcase.title}
            coverUrl={showcase.coverUrl}
            coverAlt={showcase.backgroundAlt}
            clientName={showcase.clientName}
            clientImageUrl={showcase.thumbSrc}
            clientImageAlt={showcase.thumbAlt}
            category={showcase.category}
            publishedAt={showcase.publishedAt}
            websiteUrl={showcase.websiteUrl}
          />
        }
      >
        <Title
          title={showcase.title}
          sectionId="project-overview"
          align="left"
          as="h1"
        />
        {showcase.description
          ? <p className={innerStyles.showcaseDescription}>
              {showcase.description}
            </p>
          : null}
        <div className={innerStyles.showcaseInsights}>
          {showcase.successRate.length > 0
            ? <ShowcaseSuccessRate items={showcase.successRate} />
            : null}
          {(showcase.keyTakeaways?.length ?? 0) > 0
            ? <>
                <DetailPageOutlineMobileNav />
                <ShowcaseKeyTakeaways items={showcase.keyTakeaways} />
              </>
            : <DetailPageOutlineMobileNav />}
        </div>
        {hasContent
          ? <ProjectBlocksRenderer blocks={showcase.content} />
          : <p className={articleStyles.empty}>
              No project details for this entry.
            </p>}
      </ProjectArticleContent>
      {/* </DetailPageOutline> */}

      <MotionTitleBlock
        title="More projects"
        subtitle="Check out some of my favorite & most recent projects."
        className={`${innerStyles.titleContainer} ${innerStyles.moreProjectsTitle}`}
        width={500}
        subtitleWidth={300}
        subtitleWidthMobile={200}
      />
      {moreProjects.length > 0
        ? <div className={innerStyles.cardColumn}>
            {moreProjects.map((card) => (
              <LinkCard
                key={card.id ?? card.title}
                href={card.href}
                backgroundSrc={card.backgroundSrc}
                backgroundAlt={card.backgroundAlt}
                thumbSrc={card.thumbSrc}
                thumbAlt={card.thumbAlt}
                title={card.title}
                subtitle={card.subtitle}
              />
            ))}
          </div>
        : null}

      <MotionTitleBlock
        title="Join 150+ professionals elevating their brand"
        subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
        className={innerStyles.titleContainer}
        width={600}
        subtitleWidth={425}
        subtitleWidthMobile={350}
      />
      <ClientsLogosCarousel />
      <Subscribe />
      <AvatarInfo />
      <ContactForm />
    </main>
  );
}
