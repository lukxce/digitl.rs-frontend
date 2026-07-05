import { tryGetArticlesForHome } from "../../lib/articles";
import AvatarInfo from "../components/AvatarInfo";
import ClientsLogosCarousel from "../components/ClientsLogosCarousel";
import ContactForm from "../components/ContactForm";
import JournalList from "../components/JournalList";
import MotionTitleBlock from "../components/MotionTitleBlock";
import ScrollReveal from "../components/ScrollReveal";
import Subscribe from "../components/Subscribe";
import styles from "../innerPage.module.css";

export const metadata = {
  title: "Journal",
  description:
    "The Digitl Journal: articles on marketing, growth, and building brands that stand out.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const articles = await tryGetArticlesForHome(100);
  return (
    <main className={`${styles.page}`.trim()}>
      <MotionTitleBlock
        title="The Digitl Journal"
        subtitle="Articles on marketing, growth, and building brands that stand out."
        className={styles.titleContainer}
        width={500}
        subtitleWidth={300}
        subtitleWidthMobile={280}
        as="h1"
      />
      {articles.length > 0 && (
        <JournalList
          limit={700}
          hasLink={false}
          items={articles.map((a) => ({
            slug: a.slug,
            title: a.title,
            publishedAt: a.publishedAt,
            imageUrl: a.coverUrl,
          }))}
        />
      )}

      <MotionTitleBlock
        title="Join 150+ professionals elevating their brand"
        subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
        className={styles.titleContainer}
        width={600}
        subtitleWidth={425}
      />
      <ScrollReveal>
        <ClientsLogosCarousel />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <Subscribe />
      </ScrollReveal>
      <ScrollReveal delay={0.16}>
        <AvatarInfo />
      </ScrollReveal>
      <ScrollReveal delay={0.24}>
        <ContactForm />
      </ScrollReveal>
    </main>
  );
}
