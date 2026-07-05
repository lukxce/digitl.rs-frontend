"use client";

import CtaButton from "./CtaButton";
import styles from "./PricingPlanCard.module.css";

function ClockIcon({ className }) {
  return (
    <svg
      className={className}
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Time estimate</title>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Included</title>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Content keyed by tab id; swap copy later without changing layout */
const PLAN_DETAILS = {
  standard: {
    step: "01",
    activeDotIndex: 0,
    doneInLabel: "Done in",
    doneInValue: "2 weeks",
    name: "Standard",
    price: "$1,999",
    priceUnit: "/project",
    subtitle: "Small projects or personal portfolios",
    featuresLead: "Everything in the Standard Plan, plus:",
    features: [
      "Advanced animations",
      "CMS integration for blogs, portfolios, or dynamic content",
      "Up to 10 pages",
      "SEO-friendly structure",
      "Priority email support for faster communication",
      "Typography guidelines",
    ],
    ctaTitle: "Get started",
    ctaAction: "/contact",
  },
  pro: {
    step: "02",
    activeDotIndex: 1,
    doneInLabel: "Done in",
    doneInValue: "4 weeks",
    name: "Pro",
    price: "$4,499",
    priceUnit: "/project",
    subtitle: "Growing brands that need depth and polish across channels.",
    featuresLead: "Everything in the Standard Plan, plus:",
    features: [
      "Extended CMS modeling & reusable sections",
      "Up to 24 pages with guided IA workshops",
      "Performance budgets & analytics hooks",
      "Motion specs for hero & primary flows",
      "Quarterly content iteration sync",
    ],
    ctaTitle: "Get started",
    ctaAction: "/contact",
  },
  premium: {
    step: "03",
    activeDotIndex: 2,
    doneInLabel: "Done in",
    doneInValue: "6 weeks",
    name: "Premium",
    price: "$8,999",
    priceUnit: "/project",
    subtitle: "Full product surfaces, complex journeys, and scaling teams.",
    featuresLead: "Everything in earlier plans, plus:",
    features: [
      "Dedicated lead designer across milestones",
      "Design system build-out & governance docs",
      "Embedded QA rounds with your engineers",
      "Accessibility audits & remediation backlog",
      "Executive-ready roadmap & stakeholder decks",
    ],
    ctaTitle: "Get started",
    ctaAction: "/contact",
  },
};

export default function PricingPlanCard({ planId }) {
  const detail = PLAN_DETAILS[planId] ?? PLAN_DETAILS.standard;

  return (
    <article className={styles.card} aria-live="polite">
      <div className={styles.cardContent}>
        <header className={styles.top}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.step}>{detail.step}</span>
              <span className={styles.dots} aria-hidden>
                <span
                  className={`${styles.dot} ${
                    detail.activeDotIndex === 0 ? styles.dotActive : ""
                  }`}
                />
                <span
                  className={`${styles.dot} ${
                    detail.activeDotIndex === 1 ? styles.dotActive : ""
                  }`}
                />
                <span
                  className={`${styles.dot} ${
                    detail.activeDotIndex === 2 ? styles.dotActive : ""
                  }`}
                />
              </span>
            </div>
            <div className={styles.headerRight}>
              <span className={styles.doneLabel}>{detail.doneInLabel}</span>
              <span className={styles.doneValue}>
                {detail.doneInValue}
                <ClockIcon className={styles.clock} />
              </span>
            </div>
          </div>
        </header>

        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h2 className={styles.planName}>{detail.name}</h2>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{detail.price}</span>
              <span className={styles.priceSuffix}>{detail.priceUnit}</span>
            </div>
          </div>
          <p className={`${styles.subtitleText} ${styles.subtitle}`}>
            {detail.subtitle}
          </p>
        </div>

        <div className={styles.ctaRow}>
          <CtaButton title={detail.ctaTitle} action={detail.ctaAction} />
        </div>
      </div>

      <div className={styles.features}>
        <p className={styles.featuresLead}>{detail.featuresLead}</p>
        <ul className={styles.featuresList}>
          {detail.features.map((text) => (
            <li key={`${planId}-${text}`} className={styles.featureRow}>
              <CheckIcon className={styles.check} />
              <p className={styles.featureText}>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
