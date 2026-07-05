"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import {
  getScrollRevealTransition,
  scrollRevealDistance,
  scrollRevealEase,
  scrollRevealStagger,
  scrollRevealStaggerDelay,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import fallbackThumb from "../assets/clients.png";
import styles from "./JournalList.module.css";

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: scrollRevealStagger,
      delayChildren: scrollRevealStaggerDelay,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: scrollRevealDistance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: scrollRevealEase },
  },
};

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

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

function JournalRow({ item }) {
  const hasRemoteImage =
    typeof item.imageUrl === "string" && item.imageUrl.length > 0;

  return (
    <Link
      href={`/journal/${encodeURIComponent(item.slug)}`}
      className={styles.rowLink}
    >
      <span className={styles.thumb}>
        <span className={styles.thumbInner}>
          <Image
            src={hasRemoteImage ? item.imageUrl : fallbackThumb}
            alt=""
            width={56}
            height={56}
            className={styles.thumbImg}
            sizes="56px"
            unoptimized={hasRemoteImage && !canOptimizeImage(item.imageUrl)}
          />
        </span>
      </span>
      <span className={styles.title}>
        <span className={styles.titleText}>{item.title}</span>
      </span>
      <time className={styles.date} dateTime={item.publishedAt ?? undefined}>
        {formatDate(item.publishedAt)}
      </time>
    </Link>
  );
}

/**
 * @param {{
 *   items: Array<{
 *     slug: string;
 *     title: string;
 *     publishedAt?: string | null;
 *     imageUrl?: string | null;
 *     marginTop?: number;
 *   }>;
 * }} props
 */
export default function JournalList({
  items = [],
  limit = 3,
  hasLink = true,
  marginTop = 40,
}) {
  const reduceMotion = useReducedMotion() === true;

  if (!items.length) {
    return null;
  }

  const listContent = items.slice(0, limit).map((item) =>
    reduceMotion
      ? <li key={item.slug} className={styles.item}>
          <JournalRow item={item} />
        </li>
      : <motion.li
          key={item.slug}
          className={styles.item}
          variants={itemVariants}
        >
          <JournalRow item={item} />
        </motion.li>,
  );

  return (
    <motion.section
      className={styles.container}
      style={{ marginTop: marginTop }}
      aria-label="Journal entries"
      initial={
        reduceMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: scrollRevealDistance }
      }
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={scrollRevealViewport}
      transition={getScrollRevealTransition(0, reduceMotion)}
    >
      {reduceMotion
        ? <ul className={styles.list}>{listContent}</ul>
        : <motion.ul
            className={styles.list}
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={scrollRevealViewport}
          >
            {listContent}
          </motion.ul>}
      {hasLink && (
        <div className={styles.viewAllFooter}>
          <Link href="/journal" className={styles.viewAllLink}>
            <span className={styles.viewAllLabel}>View all</span>
            <ViewAllArrowIcon className={styles.viewAllArrow} />
          </Link>
        </div>
      )}
    </motion.section>
  );
}
