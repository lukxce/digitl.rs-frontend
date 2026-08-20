import { tryGetClientShowcases } from "../../lib/cms.js";
import AvatarInfo from "../components/AvatarInfo";
import ClientsLogosCarousel from "../components/ClientsLogosCarousel";
import ContactForm from "../components/ContactForm";
import LinkCard from "../components/LinkCard";
import MotionTitleBlock from "../components/MotionTitleBlock";
import ScrollReveal from "../components/ScrollReveal";
import styles from "../innerPage.module.css";

export const metadata = {
  title: "Projekti",
  description:
    "Izbor projekata koje smo realizovali za klijente iz različitih industrija.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const workCards = await tryGetClientShowcases();

  return (
    <main className={styles.page}>
      <MotionTitleBlock
        title="Naš rad"
        subtitle="Izbor projekata koje smo realizovali za klijente iz različitih industrija."
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
        title="Klijenti sa kojima gradimo rezultate"
        subtitle="Pridružite se brendovima koji su marketing prepustili timu koji ga shvata ozbiljno."
        className={styles.titleContainer}
        width={440}
        subtitleWidth={380}
        subtitleWidthMobile={320}
      />
      <ScrollReveal>
        <ClientsLogosCarousel />
      </ScrollReveal>
      {/* <ScrollReveal delay={0.08}>
        <Subscribe />
      </ScrollReveal> */}
      <ScrollReveal delay={0.16}>
        <AvatarInfo />
      </ScrollReveal>
      <ScrollReveal delay={0.24}>
        <ContactForm />
      </ScrollReveal>
    </main>
  );
}
