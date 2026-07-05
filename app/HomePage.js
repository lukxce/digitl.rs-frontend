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
import Subscribe from "./components/Subscribe";
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
    title: "Paid Advertising (Search & Social)",
    description:
      "We plan, run, and manage paid campaigns across search and social platforms, focusing on efficient spend, clear messaging, and consistent lead or sales generation.",
    Icon: IconProduct,
  },
  {
    key: "web-design",
    title: "Website Design & Development",
    description:
      "We design and build clear, professional websites that explain what you do, build trust, and make it easy for visitors to take the next step.",
    Icon: IconWeb,
  },
  {
    key: "seo",
    title: "Search Engine Optimization (SEO)",
    description:
      "We improve your search presence by fixing technical issues, improving site structure, and optimizing content so your business appears more often in relevant searches.",
    Icon: IconStrategy,
  },
  {
    key: "social",
    title: "Social Content & Presence",
    description:
      "We help shape your social presence with clear messaging and consistent visuals, ensuring your brand looks professional and aligned across platforms.",
    Icon: IconMotion,
  },
  {
    key: "branding",
    title: "Branding & Visual Identity",
    description:
      "We design brand identities, including logos and brand guidelines, that establish consistency, clarity, and credibility across digital platforms, advertising, and marketing assets.",
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
          headlineLines={["Where marketing meets real business results."]}
        />
        <ScrollReveal>
          <ClientsLogosCarousel title="Trusted by:" />
        </ScrollReveal>

        <MotionTitleBlock
          title="Work that speaks for itself"
          subtitle="From strategy to execution, <br> here's what that looks like in practice."
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
            title="What we do"
            subtitle="The core marketing services we handle for our clients."
            className={styles.titleContainer}
            subtitleWidth={220}
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
          title="Trusted by our clients"
          subtitle="<b>What clients say</b> <br> about working with us."
          hasImage={true}
          width={520}
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
          title="The Digitl Journal"
          subtitle="Practical thoughts on marketing, growth, and building brands that stand out."
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
          title="Join 150+ professionals elevating their brand"
          subtitle="Discover design insights, project updates, and tips to elevate your work straight to your inbox."
          width={600}
          subtitleWidth={425}
          subtitleWidthMobile={350}
          className={styles.titleContainer}
        />

        <ScrollReveal>
          <ClientsLogosCarousel />
        </ScrollReveal>

        <ScrollReveal>
          <Subscribe />
        </ScrollReveal>

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
