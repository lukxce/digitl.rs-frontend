"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  scrollRevealBaseDelay,
  scrollRevealDistance,
  scrollRevealDuration,
  scrollRevealEase,
  scrollRevealStagger,
} from "../../lib/scrollReveal";
import styles from "../journal/[slug]/article.module.css";
import DetailPageOutlineMobileNav from "./DetailPageOutlineMobileNav";

const sectionVariants = {
  hidden: { opacity: 0, y: scrollRevealDistance },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: scrollRevealDuration,
      ease: scrollRevealEase,
      delay: scrollRevealBaseDelay + index * scrollRevealStagger,
    },
  }),
};

function formatPublishedDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * @param {{
 *   title: string;
 *   description?: string | null;
 *   author?: { name?: string | null; imageUrl?: string | null; imageAlt?: string | null } | null;
 *   publishedAt?: string | null;
 *   coverUrl?: string | null;
 *   backHref?: string;
 *   backLabel?: string;
 *   lead?: import("react").ReactNode;
 *   beforeCover?: import("react").ReactNode;
 *   showTitle?: boolean;
 *   showMobileOutline?: boolean;
 *   children: import("react").ReactNode;
 * }} props
 */
export default function JournalArticleContent({
  title,
  description,
  author,
  publishedAt,
  coverUrl,
  backHref = "/journal",
  backLabel = "Go back",
  lead = null,
  beforeCover = null,
  showTitle = true,
  showMobileOutline = true,
  children,
}) {
  const reduceMotion = useReducedMotion() === true;
  let sectionIndex = 0;

  const nextIndex = () => {
    const index = sectionIndex;
    sectionIndex += 1;
    return index;
  };

  const backLink = backLabel
    ? <Link href={backHref} className={styles.back}>
        <span className={styles.backIcon} aria-hidden>
          <svg
            className={styles.backArrow}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Back</title>
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {backLabel}
      </Link>
    : null;

  const authorName = author?.name ?? null;
  const authorImageUrl = author?.imageUrl ?? null;
  const authorImageAlt = author?.imageAlt ?? authorName ?? "";
  const publishedLabel = formatPublishedDate(publishedAt);
  const showMeta = authorName || authorImageUrl || publishedLabel;
  const showHeader = showTitle || showMeta || Boolean(description);

  const articleHeader = (
    <>
      {showTitle ? <h1 className={styles.h1}>{title}</h1> : null}
      {showMeta
        ? <div className={styles.meta}>
            {authorName || authorImageUrl
              ? <div className={styles.author}>
                  {authorImageUrl
                    ? <Image
                        src={authorImageUrl}
                        alt={authorImageAlt}
                        width={32}
                        height={32}
                        className={styles.authorAvatar}
                        unoptimized
                      />
                    : null}
                  {authorName
                    ? <span className={styles.authorName}>{authorName}</span>
                    : null}
                </div>
              : null}
            {publishedLabel
              ? <time
                  className={styles.date}
                  dateTime={publishedAt ?? undefined}
                >
                  {publishedLabel}
                </time>
              : null}
          </div>
        : null}
      {description
        ? <>
            <hr className={styles.separator} />
            <p className={styles.description}>{description}</p>
          </>
        : null}
    </>
  );

  const header = <header className={styles.header}>{articleHeader}</header>;

  const cover = coverUrl
    ? <figure className={styles.cover}>
        <Image
          src={coverUrl}
          alt=""
          width={1200}
          height={675}
          className={styles.coverImage}
          sizes="(max-width: 1010px) 100vw, 1010px"
          priority
          unoptimized
        />
      </figure>
    : null;

  if (reduceMotion) {
    return (
      <div className={styles.articleLayout}>
        {lead}

        <div className={styles.articleMain}>
          {backLink}
          {showHeader ? header : null}
        </div>

        {showMobileOutline ? <DetailPageOutlineMobileNav /> : null}

        {beforeCover}

        {cover}

        <div className={`${styles.articleMain} ${styles.bodyWrap}`}>
          {children}
        </div>
      </div>
    );
  }

  const backIndex = nextIndex();
  const leadIndex = lead ? nextIndex() : null;
  const headerIndex = showHeader ? nextIndex() : null;
  const mobileOutlineIndex = showMobileOutline ? nextIndex() : null;
  const beforeCoverIndex = beforeCover ? nextIndex() : null;
  const coverIndex = cover ? nextIndex() : null;
  const bodyIndex = nextIndex();

  return (
    <div className={styles.articleLayout}>
      {lead && leadIndex != null
        ? <motion.div
            initial="hidden"
            animate="visible"
            custom={leadIndex}
            variants={sectionVariants}
            style={{ width: "100%" }}
          >
            {lead}
          </motion.div>
        : null}

      <div className={styles.articleMain}>
        <motion.div
          initial="hidden"
          animate="visible"
          custom={backIndex}
          variants={sectionVariants}
        >
          {backLink}
        </motion.div>

        {showHeader && headerIndex != null
          ? <motion.header
              className={styles.header}
              initial="hidden"
              animate="visible"
              custom={headerIndex}
              variants={sectionVariants}
            >
              {articleHeader}
            </motion.header>
          : null}
      </div>

      {showMobileOutline && mobileOutlineIndex != null
        ? <motion.div
            initial="hidden"
            animate="visible"
            custom={mobileOutlineIndex}
            variants={sectionVariants}
          >
            <DetailPageOutlineMobileNav />
          </motion.div>
        : null}

      {beforeCover && beforeCoverIndex != null
        ? <motion.div
            initial="hidden"
            animate="visible"
            custom={beforeCoverIndex}
            variants={sectionVariants}
          >
            {beforeCover}
          </motion.div>
        : null}

      {cover && coverIndex != null
        ? <motion.figure
            className={styles.cover}
            initial="hidden"
            animate="visible"
            custom={coverIndex}
            variants={sectionVariants}
          >
            <Image
              src={coverUrl}
              alt=""
              width={1200}
              height={675}
              className={styles.coverImage}
              sizes="(max-width: 1010px) 100vw, 1010px"
              priority
              unoptimized
            />
          </motion.figure>
        : null}

      <motion.div
        className={`${styles.articleMain} ${styles.bodyWrap}`}
        initial="hidden"
        animate="visible"
        custom={bodyIndex}
        variants={sectionVariants}
      >
        {children}
      </motion.div>
    </div>
  );
}
