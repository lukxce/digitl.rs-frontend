import { notFound } from "next/navigation";
import {
  tryFindClientShowcase,
  tryGetClientShowcases,
} from "../../../lib/cms.js";
import AvatarInfo from "../../components/AvatarInfo";
import ClientShowcaseHeader from "../../components/ClientShowcaseHeader";
import ClientsLogosCarousel from "../../components/ClientsLogosCarousel";
import ContactForm from "../../components/ContactForm";
import { DetailPageOutlineMobileNav } from "../../components/DetailPageOutline";
import LinkCard from "../../components/LinkCard";
import MotionTitleBlock from "../../components/MotionTitleBlock";
import ProjectArticleContent from "../../components/ProjectArticleContent";
import ProjectBlocksRendererAuto from "../../components/ProjectBlocksRendererAuto";
import ShowcaseKeyTakeaways from "../../components/ShowcaseKeyTakeaways";
import ShowcaseSuccessRate from "../../components/ShowcaseSuccessRate";
import Title from "../../components/Title";
import innerStyles from "../../innerPage.module.css";
import articleStyles from "../../v2-journal/[slug]/article.module.css";

export async function generateStaticParams() {
  const showcases = await tryGetClientShowcases(200);
  return showcases.map((s) => ({ slug: s.slug }));
}

export const revalidate = 60;

/* The previous case study design, kept in case the new one at
   /projects/[slug] is not liked. Out of the index. */
export async function generateMetadata(props) {
  const params = await props.params;
  const showcase = await tryFindClientShowcase(params.slug);
  return {
    title: showcase ? `${showcase.title} (prethodni dizajn)` : "Project",
    robots: { index: false, follow: false },
  };
}

const archived = (href) =>
  typeof href === "string" ? href.replace(/^\/projects/, "/v2-projects") : href;

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
        backHref="/v2-projects"
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
          ? <ProjectBlocksRendererAuto blocks={showcase.content} />
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
                href={archived(card.href)}
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
