"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  getScrollRevealTransition,
  scrollRevealDistance,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import bgImage from "../assets/girl-laptop.png";
import CtaButton from "./CtaButton";
import styles from "./CtaWithImageBackground.module.css";

export default function CtaWithImageBackground() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.section
      className={styles.root}
      aria-labelledby="cta-with-bg-title"
      initial={
        reduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: scrollRevealDistance }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={scrollRevealViewport}
      transition={getScrollRevealTransition(0, reduceMotion)}
    >
      <Image src={bgImage} alt="" fill className={styles.bg} sizes="550px" />
      <div className={styles.overlay} aria-hidden />
      <div className={styles.content}>
        <h2 id="cta-with-bg-title" className={styles.title}>
          Your success is my goal
        </h2>
        <p className={styles.description}>
          {
            "I've worked with 55 clients to build impactful websites that drive results."
          }
        </p>
        <div className={styles.ctaWrap}>
          <CtaButton title="Get started" action="/contact" />
        </div>
      </div>
    </motion.section>
  );
}
