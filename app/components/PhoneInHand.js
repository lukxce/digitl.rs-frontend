"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  scrollRevealBaseDelay,
  scrollRevealEase,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import storyBackground from "../assets/girl-laptop.png";
import handPhone from "../assets/hand-phone.png";
import phoneFrame from "../assets/phone.png";
import starsSvg from "../assets/stars.svg";
import styles from "./PhoneInHand.module.css";

const STORY_DURATION_MS = 5_000;

const phoneVariants = {
  hidden: { y: 120, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: scrollRevealEase,
      delay: scrollRevealBaseDelay,
    },
  },
};

const sidePanelLeftVariants = {
  hidden: { x: -200, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: scrollRevealEase,
      delay: scrollRevealBaseDelay,
    },
  },
};

const sidePanelRightVariants = {
  hidden: { x: 200, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: scrollRevealEase,
      delay: scrollRevealBaseDelay,
    },
  },
};

const STORIES = [
  {
    id: "1",
    body: "They delivered exceptional work, creative and detailed, perfectly aligned with our vision. Highly recommend!",
    reviewer: "Jessica Stone",
    reviewerRole: "Creative Director at Lumina",
  },
  {
    id: "2",
    body: "Working with the guys from digitl was a game-changer for our company. The website design they created not only looks stunning but also improved our user engagement significantly.",
    reviewer: "John Carter",
    reviewerRole: "Creative Lead at Garnish",
  },
  {
    id: "3",
    body: "We transformed our outdated website into a sleek, modern portfolio that stands out. A fantastic team to collaborate with!",
    reviewer: "Rachel Simmons",
    reviewerRole: "Product Manager at Brightline Solutions",
  },
];

export default function PhoneInHand() {
  const reduceMotion = useReducedMotion() === true;
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressEpoch, setProgressEpoch] = useState(0);
  const [intervalKey, setIntervalKey] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setProgressEpoch((e) => e + 1);
      setActiveIndex((i) => (i + 1) % STORIES.length);
    }, STORY_DURATION_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, intervalKey]);

  const story = STORIES[reduceMotion ? 0 : activeIndex];

  function handleLeft() {
    setActiveIndex((i) => (i - 1 + STORIES.length) % STORIES.length);
    setProgressEpoch((e) => e + 1);
    setIntervalKey((k) => k + 1);
  }

  function handleRight() {
    setActiveIndex((i) => (i + 1) % STORIES.length);
    setProgressEpoch((e) => e + 1);
    setIntervalKey((k) => k + 1);
  }

  return (
    <div className={styles.root}>
      <div className={styles.phoneWrap}>
        <motion.div
          className={styles.sidePanelLeft}
          aria-hidden
          variants={sidePanelLeftVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={scrollRevealViewport}
        />
        <motion.div
          className={styles.phoneGroup}
          variants={phoneVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={scrollRevealViewport}
        >
          <Image
            src={handPhone}
            alt=""
            width={420}
            height={560}
            className={styles.handImage}
            priority={false}
          />
          <Image
            src={phoneFrame}
            alt=""
            width={1032}
            height={2108}
            className={styles.phoneImage}
            priority={false}
          />
          <div className={styles.screen}>
            <button
              type="button"
              className={styles.tapLeft}
              onClick={handleLeft}
              aria-label="Previous"
            />
            <button
              type="button"
              className={styles.tapRight}
              onClick={handleRight}
              aria-label="Next"
            />
            <div className={styles.storyLayer}>
              <Image
                src={storyBackground}
                alt=""
                fill
                sizes="339px"
                className={styles.storyBackground}
                priority={false}
              />
              <div className={styles.storyOverlay} aria-hidden />
              <div className={styles.islandBar} aria-hidden />
              <div className={styles.storyInner}>
                <div
                  className={styles.progressRow}
                  data-reduced={reduceMotion || undefined}
                  aria-hidden
                >
                  {STORIES.map((s, i) => (
                    <div key={s.id} className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        data-state={
                          i < activeIndex
                            ? "done"
                            : i === activeIndex
                              ? "active"
                              : "idle"
                        }
                        key={
                          i === activeIndex ? `a-${progressEpoch}` : `s-${i}`
                        }
                      />
                    </div>
                  ))}
                </div>

                <header className={styles.storyHeader}>
                  <div className={styles.brandMeta}>
                    <Image
                      src="https://api.digitl.me/uploads/icon_1ea74e1afa.png"
                      alt="Digitl"
                      width={32}
                      height={32}
                      className={styles.brandLogo}
                      unoptimized
                    />
                    <div>
                      <p className={styles.posterName}>Digitl</p>
                      <p className={styles.posterRole}>Marketing Agency</p>
                    </div>
                  </div>
                </header>

                <div className={styles.storyBody} aria-live="polite">
                  <Image
                    src={starsSvg}
                    alt=""
                    width={69}
                    height={13}
                    className={styles.stars}
                    unoptimized
                  />
                  <p className={styles.storyBodyText}>{story.body}</p>
                  <p className={styles.storyBodyReviewer}>{story.reviewer}</p>
                  <p className={styles.storyBodyReviewerRole}>
                    {story.reviewerRole}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          className={styles.sidePanelRight}
          aria-hidden
          variants={sidePanelRightVariants}
          initial={reduceMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={scrollRevealViewport}
        />
      </div>
    </div>
  );
}
