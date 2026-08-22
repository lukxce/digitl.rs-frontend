"use client";

import ClientsLogosCarousel from "./components/ClientsLogosCarousel";
import ContactForm from "./components/ContactForm";
import CtaWithImageBackground from "./components/CtaWithImageBackground";
import DesignJourneyTable from "./components/DesignJourneyTable";
import Faq from "./components/Faq";
import JournalList from "./components/JournalList";
import LinkCard from "./components/LinkCard";
import MotionTitleBlock from "./components/MotionTitleBlock";
import PhoneInHand from "./components/PhoneInHand";
import PricingPlans from "./components/PricingPlans";
import ScrollReveal from "./components/ScrollReveal";
import ServiceItem from "./components/ServiceItem";
import StepProcess from "./components/StepProcess";
import Subscribe from "./components/Subscribe";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "./components/serviceIcons";
import ToolsList from "./components/ToolsList";
import Years from "./components/Years";
import styles from "./page.module.css";
import HeroCard from "./components/HeroCard";
import AvatarInfo from "./components/AvatarInfo";

const services = [
  {
    key: "ads",
    title: "Plaćeno oglašavanje (Search & Social)",
    description:
      "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    Icon: IconProduct,
  },
  {
    key: "web",
    title: "Web dizajn & razvoj",
    description:
      "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    Icon: IconWeb,
  },
  {
    key: "seo",
    title: "Search Engine Optimization (SEO)",
    description:
      "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    Icon: IconStrategy,
  },
  {
    key: "social",
    title: "Upravljanje društvenim mrežama",
    description:
      "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    Icon: IconMotion,
  },
  {
    key: "brand",
    title: "Branding & identitet",
    description:
      "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    Icon: IconBrand,
  },
];

/** Local mockup overrides for showcase background images. */
const SHOWCASE_MOCKUPS = [
  { match: /klima/i, src: "/showcases/klima-servis-nis.png" },
  { match: /moler/i, src: "/showcases/moler-nis.png" },
];
function getShowcaseMockup(card) {
  const hay = `${card.slug ?? ""} ${card.title ?? ""} ${card.href ?? ""}`;
  return SHOWCASE_MOCKUPS.find((m) => m.match.test(hay))?.src ?? null;
}

export default function HomePage({ articles = [], showcases = [] }) {
  return (
    <div className={styles.page}>
      <main className={styles.main} data-article-count={articles.length}>
        <HeroCard
          primaryCtaHref="/contact"
          headlineLines={["Marketing koji", "donosi prave", "rezultate."]}
        />
        <ScrollReveal>
          <ClientsLogosCarousel title="Izabrali su Digitl" />
        </ScrollReveal>

        <MotionTitleBlock
          title="Odabrani projekti"
          subtitle="Primeri saradnji i rezultata koje smo ostvarili sa klijentima."
          subtitleWidthMobile={200}
          className={styles.titleContainer}
          marginTop={10}
        />

        <div className={styles.cardColumn}>
          {showcases.slice(0, 2).map((card) => {
            const mockup = getShowcaseMockup(card);
            return (
              <LinkCard
                key={card.id ?? card.title}
                href={card.href}
                backgroundSrc={mockup ?? card.backgroundSrc}
                backgroundAlt={card.backgroundAlt}
                thumbSrc={card.thumbSrc}
                thumbAlt={card.thumbAlt}
                title={card.title}
                subtitle={card.subtitle}
              />
            );
          })}
          {showcases.length > 2 && (
            <a href="/projects" className={styles.viewAllLink}>
              <span>Pogledajte sve projekte</span>
              <svg
                className={styles.viewAllArrow}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M7 17L17 7M17 7H9M17 7V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </div>

        <MotionTitleBlock
          title="Naše usluge"
          subtitle="Kompletan marketing kao jedan sistem, ne meni nepovezanih usluga."
          className={styles.titleContainer}
          widthMobile={200}
        />

        <div className={styles.servicesList}>
          {services.map(({ key, title, description, Icon }, index) => (
            <ScrollReveal key={key} delay={index * 0.08}>
              <ServiceItem
                icon={<Icon />}
                title={title}
                description={description}
                initialOpen={index === 0}
              />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <StepProcess />
        </ScrollReveal>

        {/* <MotionTitleBlock
          title="Naši alati, vaša prednost"
          subtitle="Pogledajte kako naša ekspertiza sa ovim alatima donosi bolje rezultate."
          className={styles.titleContainer}
        />

        <ScrollReveal>
          <ToolsList />
        </ScrollReveal>

        <ScrollReveal>
          <Years />
          <div className={styles.journeyContainer}>
            <h2 className={styles.journeyTitleTitle}>Naš put kroz dizajn</h2>
            <p className={styles.journeyTitleSubtitle}>
              Pogledajte ključne prekretnice i iskustva koja su oblikovala našu karijeru,
              godinu po godinu.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <DesignJourneyTable />
        </ScrollReveal> */}

        <MotionTitleBlock
          title="Kako izgleda raditi sa nama"
          subtitle="Preporuke klijenata koji marketing shvataju ozbiljno."
          hasImage={true}
          className={styles.titleContainer}
        />

        <PhoneInHand />

        {/* <MotionTitleBlock
          title="Fleksibilni planovi za svaku potrebu"
          subtitle="Bilo da krećete ispočetka ili vam treba kompletna promena, izaberite plan koji odgovara vašem projektu."
          width={425}
          subtitleWidth={350}
          widthMobile={300}
          subtitleWidthMobile={350}
          className={styles.titleContainer}
        />

        <ScrollReveal>
          <PricingPlans />
        </ScrollReveal> */}

        <div id="faq">
          <ScrollReveal>
            <Faq />
          </ScrollReveal>
        </div>

        {/* <CtaWithImageBackground /> */}

        <MotionTitleBlock
          width={500}
          title="Blog"
          subtitle="Praktični uvidi o marketingu, rastu i izgradnji brendova koji se izdvajaju."
          subtitleWidth={310}
          subtitleWidthMobile={300}
          marginTop={80}
          className={styles.titleContainer}
        />

        <JournalList
          items={articles.map((a) => ({
            slug: a.slug,
            title: a.title,
            publishedAt: a.publishedAt,
            imageUrl: a.coverUrl,
          }))}
        />

        <MotionTitleBlock
          title="Budite u toku"
          subtitle="Trendovi, taktike i uvidi iz sveta marketinga koji vam pomažu da rastete brže — jednom do dva puta mesečno, direktno u inbox."
          width={600}
          subtitleWidth={425}
          subtitleWidthMobile={350}
          className={styles.titleContainer}
        />

        {/* <ScrollReveal>
          <ClientsLogosCarousel marginTop={60} marginBottom={60} />
        </ScrollReveal> */}

        <ScrollReveal style={{ marginTop: "30px" }}>
          <Subscribe />
        </ScrollReveal>

        <ScrollReveal>
          <AvatarInfo />
        </ScrollReveal>

        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>
      </main>
    </div>
  );
}
