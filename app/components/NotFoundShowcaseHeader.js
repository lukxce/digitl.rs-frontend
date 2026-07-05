"use client";

import { motion } from "motion/react";
import Image from "next/image";
import digitlLogo from "../assets/digitl-logo.png";
import stripeSvg from "../assets/stripe.svg";
import styles from "./ClientShowcaseHeader.module.css";
import CtaButton from "./CtaButton";
import heroStyles from "./HeroCard/HeroCard.module.css";
import stylesNotFound from "./NotFoundShowcaseHeader.module.css";

const NAME = "Digitl";
const ROLE = "Full-service marketing for businesses";

function IconDribbble() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M6.5 19.5c2.5-4 6.5-7 11-8M5 9c3 1.5 6.5 2 10 1M8.5 4c1.5 4 4 7.5 7.5 10"
      />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "#", label: "Dribbble", Icon: IconDribbble },
  { href: "#", label: "GitHub", Icon: IconGithub },
  { href: "#", label: "LinkedIn", Icon: IconLinkedin },
];

export default function NotFoundShowcaseHeader() {
  return (
    <section className={styles.root} aria-label="Page not found overview">
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
        style={{
          transformOrigin: "top center",
          margin: "auto",
        }}
      >
        <section className={`${heroStyles.outer} ${styles.outer}`.trim()}>
          <div className={heroStyles.floatingTab} aria-hidden>
            <Image
              src={stripeSvg}
              alt=""
              width={63}
              height={164}
              className={heroStyles.stripeImg}
              priority
              fetchPriority="high"
              unoptimized
            />
          </div>

          <div
            className={`${heroStyles.inner} ${styles.inner} ${stylesNotFound.inner}`.trim()}
          >
            <div className={stylesNotFound.hole}></div>
            <div className={`${heroStyles.card} ${styles.card}`.trim()}>
              <div className={stylesNotFound.root}>
                <div className={stylesNotFound.profile}>
                  <div className={stylesNotFound.avatarWrap}>
                    <Image
                      src={digitlLogo}
                      alt=""
                      width={60}
                      height={60}
                      className={stylesNotFound.avatar}
                      sizes="60px"
                    />
                  </div>
                  <div className={stylesNotFound.meta}>
                    <p className={stylesNotFound.name}>{NAME}</p>
                    <p className={stylesNotFound.role}>{ROLE}</p>
                    <div className={stylesNotFound.socialRow}>
                      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                        <a
                          key={label}
                          href={href}
                          className={stylesNotFound.socialLink}
                          aria-label={label}
                        >
                          <Icon />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={stylesNotFound.content}>
                  <h1 className={stylesNotFound.title}>404</h1>
                  <p className={stylesNotFound.description}>Page not found</p>
                  <p className={stylesNotFound.subDescription}>
                    The page you are looking for could not be found
                  </p>
                  <CtaButton action="/" title="Go home" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </section>
  );
}
