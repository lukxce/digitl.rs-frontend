import AvatarInfo from "./components/AvatarInfo";
import ClientsLogosCarousel from "./components/ClientsLogosCarousel";
import ContactForm from "./components/ContactForm";
import JournalArticleContent from "./components/JournalArticleContent";
import MotionTitleBlock from "./components/MotionTitleBlock";
import NotFoundShowcaseHeader from "./components/NotFoundShowcaseHeader";
import Subscribe from "./components/Subscribe";
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
        title="Join 150+ professionals elevating their brand"
        subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
        className={`${innerStyles.titleContainer} ${innerStyles.joinTitle}`}
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
