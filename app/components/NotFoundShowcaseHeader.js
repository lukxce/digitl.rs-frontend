"use client";

import { motion } from "motion/react";
import Image from "next/image";
import digitlLogo from "../assets/digitl-logo.png";
import stripeSvg from "../assets/stripe.svg";
import styles from "./ClientShowcaseHeader.module.css";
import CtaButton from "./CtaButton";
import heroStyles from "./HeroCard/HeroCard.module.css";
import stylesNotFound from "./NotFoundShowcaseHeader.module.css";
import { defaultSocialLinks } from "./socialIcons";

const NAME = "Digitl";
const ROLE = "Full-Service marketing agencija";

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
                      width={44}
                      height={44}
                      className={stylesNotFound.avatar}
                      sizes="44px"
                    />
                  </div>
                  <div className={stylesNotFound.meta}>
                    <p className={stylesNotFound.name}>{NAME}</p>
                    <p className={stylesNotFound.role}>{ROLE}</p>
                    <div className={stylesNotFound.socialRow}>
                      {defaultSocialLinks.map(({ href, label, Icon }) => (
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
