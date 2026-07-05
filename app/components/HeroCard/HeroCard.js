import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import locationIcon from "../../assets/location.svg";
import stripeSvg from "../../assets/stripe.svg";
import CTAButtons from "./CTAButtons";
import styles from "./HeroCard.module.css";
import HeroCardHeader from "./HeroCardHeader";
import ProgressBar from "./ProgressBar";

function ViewAllArrowIcon({ className }) {
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
      <title>Arrow</title>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import digitlLogo from "../../assets/digitl-logo.png";

/** Full-viewport portfolio hero with floating `stripe.svg` tab and soft card. */
export default function HeroCard({
  name = "Digitl",
  subtitle = "Full-service marketing for businesses",
  headlineLines = ["Design that moves", "products forward"],
  description = "We build brands that stand out, convert harder, and scale faster.",
  socialProofLabel = "Helping 50+ companies grow",
  progressActiveCount = 2,
  avatarSrc = digitlLogo,
  avatarAlt = "Digitl logo",
  availabilitySlotsLabel = "2 open slots",
  availabilityPeriodLabel = "for June",
  location = "London",
  primaryCtaHref = "/contact",
  primaryCtaLabel = "Get started",
  secondaryCtaHref = "/projects",
  secondaryCtaLabel = "What we do",
  socialLinks,
  className = "",
}) {
  return (
    <motion.div
      className={styles.shell}
      initial={{
        y: "0vh",
        rotate: 90,
        scale: 0,
        opacity: 0,
        filter: "blur(10px)",
      }}
      animate={{
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <section className={`${styles.outer} ${className}`.trim()}>
        <div className={styles.floatingTab} aria-hidden>
          <Image
            src={stripeSvg}
            alt=""
            width={63}
            height={164}
            className={styles.stripeImg}
            priority
            fetchPriority="high"
            unoptimized
          />
        </div>
        <div className={styles.inner}>
          <div className={styles.hole}></div>

          <div className={styles.card}>
            <ProgressBar activeCount={progressActiveCount} />
            <HeroCardHeader
              name={name}
              subtitle={subtitle}
              avatarSrc={avatarSrc}
              avatarAlt={avatarAlt}
              availabilitySlotsLabel={availabilitySlotsLabel}
              availabilityPeriodLabel={availabilityPeriodLabel}
              socialLinks={socialLinks}
            />

            <h1 className={styles.headline}>
              {headlineLines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </h1>

            <div className={styles.socialProof}>
              <span className={styles.stars} aria-hidden>
                ★★★★★
              </span>
              <span className={styles.socialProofText}>{socialProofLabel}</span>
            </div>

            <p className={styles.description}>{description}</p>

            <CTAButtons
              primaryHref={primaryCtaHref}
              primaryLabel={primaryCtaLabel}
              secondaryHref={secondaryCtaHref}
              secondaryLabel={secondaryCtaLabel}
            />
          </div>
          <div className={styles.metaRow}>
            <div className={styles.metaRowLocation}>
              <Image
                src={locationIcon}
                alt="Location"
                width={11}
                height={11}
                className={styles.metaRowLocationIcon}
              />
              <p className={styles.metaText}>
                Based in {location}, working with businesses worldwide.
              </p>
            </div>
            <Link href="/#faq" className={styles.metaLink}>
              <span>FAQ</span>
              <ViewAllArrowIcon className={styles.metaArrow} />
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
