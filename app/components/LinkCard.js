"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import {
  getScrollRevealTransition,
  scrollRevealDistance,
  scrollRevealEase,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import styles from "./LinkCard.module.css";

const viewport = scrollRevealViewport;

function ArrowIcon() {
  return (
    <svg
      className={styles.arrowIcon}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Link</title>
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

export default function LinkCard({
  href,
  backgroundSrc,
  backgroundAlt = "",
  thumbSrc,
  thumbAlt = "",
  title,
  subtitle,
}) {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;
  const backgroundUnoptimized = !canOptimizeImage(backgroundSrc);
  const thumbUnoptimized = !canOptimizeImage(thumbSrc);

  return (
    <motion.div
      className={styles.reveal}
      initial={
        reduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: scrollRevealDistance }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reduceMotion ? undefined : viewport}
      transition={getScrollRevealTransition(0, reduceMotion)}
    >
      <Link href={href} className={styles.card}>
        <div className={styles.media}>
          <motion.div
            className={styles.imageScale}
            initial={reduceMotion ? { scale: 1 } : { scale: 1.08 }}
            whileInView={reduceMotion ? undefined : { scale: 1 }}
            viewport={reduceMotion ? undefined : viewport}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 1.4, ease: scrollRevealEase }
            }
          >
            <div className={styles.imageHoverZoom}>
              <Image
                src={backgroundSrc}
                alt={backgroundAlt}
                fill
                className={styles.bgImage}
                sizes="550px"
                unoptimized={backgroundUnoptimized}
              />
            </div>
          </motion.div>
        </div>
        <div className={styles.footer}>
          <div className={styles.thumb}>
            <Image
              src={thumbSrc}
              alt={thumbAlt}
              width={48}
              height={48}
              className={styles.thumbImage}
              unoptimized={thumbUnoptimized}
            />
          </div>
          <div className={styles.text}>
            <span className={styles.title}>{title}</span>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
          <div className={styles.arrowWrap}>
            <ArrowIcon />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
