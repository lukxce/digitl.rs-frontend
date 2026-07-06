import AvatarInfo from "./components/AvatarInfo";
import ClientsLogosCarousel from "./components/ClientsLogosCarousel";
import ContactForm from "./components/ContactForm";
import JournalArticleContent from "./components/JournalArticleContent";
import MotionTitleBlock from "./components/MotionTitleBlock";
import NotFoundShowcaseHeader from "./components/NotFoundShowcaseHeader";
import innerStyles from "./innerPage.module.css";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className={innerStyles.pageProject}>
      <JournalArticleContent
        title="Page not found"
        showTitle={false}
        backHref="/"
        lead={<NotFoundShowcaseHeader />}
        backLabel={false}
      ></JournalArticleContent>

      <MotionTitleBlock
        title="Klijenti sa kojima gradimo rezultate"
        subtitle="Pridružite se brendovima koji su marketing prepustili timu koji ga shvata ozbiljno."
        className={`${innerStyles.titleContainer} ${innerStyles.joinTitle}`}
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
