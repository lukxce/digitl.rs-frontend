"use client";

import AvatarInfo from "./components/AvatarInfo";
import ClientsLogosCarousel from "./components/ClientsLogosCarousel";
import ContactForm from "./components/ContactForm";
import Faq from "./components/Faq";
import HeroCard from "./components/HeroCard";
import JournalList from "./components/JournalList";
import LinkCard from "./components/LinkCard";
import MotionTitleBlock from "./components/MotionTitleBlock";
import PhoneInHand from "./components/PhoneInHand";
import ScrollReveal from "./components/ScrollReveal";
import ServiceItem from "./components/ServiceItem";
import StepProcess from "./components/StepProcess";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "./components/serviceIcons";
import styles from "./page.module.css";

const services = [
  {
    key: "paid-advertising",
    title: "Plaćeno oglašavanje (Search & Social)",
    description:
      "Upravljamo kampanjama na Google-u i društvenim mrežama, od inicijalne postavke do svakodnevne optimizacije i kontrole rezultata.",
    Icon: IconProduct,
  },
  {
    key: "web-design",
    title: "Web dizajn & razvoj",
    description:
      "Dizajniramo i razvijamo web sajtove koji su jasni, brzi i funkcionalni, sa fokusom na korisničko iskustvo, strukturu i lako održavanje.",
    Icon: IconWeb,
  },
  {
    key: "seo",
    title: "Search Engine Optimization (SEO)",
    description:
      "Radimo tehnički SEO, strukturu sajta i sadržaj, sa fokusom na indeksaciju, performanse i vidljivost na pretrazi kroz dugoročno održiva rešenja.",
    Icon: IconStrategy,
  },
  {
    key: "social",
    title: "Upravljanje društvenim mrežama",
    description:
      "Vodimo prisustvo na društvenim mrežama kroz planiranje sadržaja, objave i osnovnu analitiku, sa ciljem jasne komunikacije i doslednog nastupa.",
    Icon: IconMotion,
  },
  {
    key: "branding",
    title: "Branding & identitet",
    description:
      "Gradimo vizuelne identitete, brand book-ove i smernice koje omogućavaju doslednu primenu brenda kroz sve kanale komunikacije.",
    Icon: IconBrand,
  },
];

export default function HomePage({ articles = [], showcases = [] }) {
  return (
    <div className={styles.page}>
      <main className={styles.main} data-article-count={articles.length}>
        <HeroCard
          primaryCtaHref="/contact"
          secondaryCtaHref="/#what-we-do"
          headlineLines={["Marketing koji daje rezultate"]}
        />
        <ScrollReveal>
          <ClientsLogosCarousel title="Izabrali su Digitl" />
        </ScrollReveal>

        <MotionTitleBlock
          title="Odabrani projekti"
          subtitle="Primeri saradnji i rezultata koje smo ostvarili sa klijentima."
          subtitleWidth={260}
          subtitleWidthMobile={200}
          className={styles.titleContainer}
          marginTop={10}
        />

        <div className={styles.cardColumn}>
          {showcases.map((card) => (
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

        <div id="what-we-do" style={{ scrollMarginTop: "20px" }}>
          <MotionTitleBlock
            title="Naše usluge"
            subtitle="Kompletan set usluga za moderan marketing."
            className={styles.titleContainer}
            subtitleWidth={180}
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
        </div>

        <ScrollReveal>
          <StepProcess />
        </ScrollReveal>

        {/* <MotionTitleBlock
          title="My toolkit, your advantage"
          subtitle="See how my expertise with these tools drives better results."
          className={styles.titleContainer}
        />

        <ScrollReveal>
          <ToolsList />
        </ScrollReveal>

        <ScrollReveal>
          <Years />
          <div className={styles.journeyContainer}>
            <h2 className={styles.journeyTitleTitle}>My journey through design</h2>
            <p className={styles.journeyTitleSubtitle}>
              Explore the milestones and experiences that have shaped my career,
              year by year.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <DesignJourneyTable />
        </ScrollReveal> */}

        <MotionTitleBlock
          title="Kako izgleda raditi sa nama"
          subtitle="<b>Preporuke klijenata</b><br />koji marketing shvataju ozbiljno."
          hasImage={true}
          width={520}
          widthMobile={270}
          className={styles.titleContainer}
        />

        <PhoneInHand />

        {/* <MotionTitleBlock
          title="Flexible plans for every need"
          subtitle="Whether you’re starting fresh or need a complete overhaul, choose the plan that fits your project."
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
          title="Digitl Blog"
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
          title="Klijenti sa kojima gradimo rezultate"
          subtitle="Pridružite se brendovima koji su marketing prepustili timu koji ga shvata ozbiljno."
          width={440}
          subtitleWidth={380}
          subtitleWidthMobile={320}
          className={styles.titleContainer}
        />

        <ScrollReveal>
          <ClientsLogosCarousel />
        </ScrollReveal>

        {/* <ScrollReveal>
          <Subscribe />
        </ScrollReveal> */}

        <ScrollReveal style={{ scrollMarginTop: "0px" }}>
          <AvatarInfo />
        </ScrollReveal>

        <ScrollReveal>
          <ContactForm />
        </ScrollReveal>
      </main>
    </div>
  );
}
