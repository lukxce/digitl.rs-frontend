import { tryGetClientShowcases } from "../../lib/clientShowcases.js";
import AvatarInfo from "../components/AvatarInfo";
import ClientsLogosCarousel from "../components/ClientsLogosCarousel";
import ContactForm from "../components/ContactForm";
import LinkCard from "../components/LinkCard";
import MotionTitleBlock from "../components/MotionTitleBlock";
import ScrollReveal from "../components/ScrollReveal";
import Subscribe from "../components/Subscribe";
import styles from "../innerPage.module.css";

export const metadata = {
  title: "Projects",
  description:
    "A selection of projects we've built for clients across different industries.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const workCards = await tryGetClientShowcases();

  return (
    <main className={styles.page}>
      <MotionTitleBlock
        title="Our work"
        subtitle="A selection of projects we've built for clients across different industries."
        className={styles.titleContainer}
        width={300}
        subtitleWidthMobile={200}
        as="h1"
      />
      <div className={styles.cardColumn}>
        {workCards.map((card) => (
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
      <MotionTitleBlock
        title="Join 150+ professionals elevating their brand"
        subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
        className={styles.titleContainer}
        width={600}
        subtitleWidth={425}
        subtitleWidthMobile={350}
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
