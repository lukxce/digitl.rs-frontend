"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import stripeSvg from "../assets/stripe.svg";
import styles from "./ClientShowcaseHeader.module.css";
import heroStyles from "./HeroCard/HeroCard.module.css";
import journalStyles from "./JournalList.module.css";

function formatPublishedDate(iso) {
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

function IconCategory() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDate() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 3v4M16 3v4M4 10h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VisitWebsiteArrow({ className }) {
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

/**
 * @param {{
 *   title?: string | null;
 *   coverUrl?: string | null;
 *   coverAlt?: string;
 *   clientName?: string | null;
 *   clientImageUrl?: string | null;
 *   clientImageAlt?: string;
 *   category?: string | null;
 *   publishedAt?: string | null;
 *   websiteUrl?: string | null;
 * }} props
 */
export default function ClientShowcaseHeader({
  coverUrl,
  coverAlt = "",
  clientName,
  clientImageUrl,
  clientImageAlt = "",
  category,
  publishedAt,
  websiteUrl,
}) {
  const publishedLabel = formatPublishedDate(publishedAt);
  const hasClientLogo =
    typeof clientImageUrl === "string" && clientImageUrl.length > 0;
  const visitWebsiteUrl =
    typeof websiteUrl === "string" && websiteUrl.trim().length > 0
      ? websiteUrl.trim()
      : null;

  return (
    <section className={styles.root} aria-label="Project overview">
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
              unoptimized
            />
          </div>

          <div className={`${heroStyles.inner} ${styles.inner}`.trim()}>
            <div className={`${heroStyles.hole} ${styles.hole}`.trim()}></div>
            <div className={`${heroStyles.card} ${styles.card}`.trim()}>
              {coverUrl
                ? <figure className={styles.cover}>
                    <Image
                      src={coverUrl}
                      alt={coverAlt}
                      width={1200}
                      height={675}
                      className={styles.coverImage}
                      sizes="(max-width: 640px) 100vw, 532px"
                      priority
                      unoptimized={!canOptimizeImage(coverUrl)}
                    />
                  </figure>
                : null}

              <div className={styles.cardBody}>
                <ul
                  className={`${journalStyles.list} ${styles.metaList}`.trim()}
                >
                  <li
                    className={`${journalStyles.item} ${styles.metaItem}`.trim()}
                  >
                    <div className={journalStyles.rowLink}>
                      <span className={journalStyles.thumb}>
                        <span className={journalStyles.thumbInner}>
                          {hasClientLogo
                            ? <Image
                                src={clientImageUrl}
                                alt={clientImageAlt || clientName || ""}
                                width={56}
                                height={56}
                                className={journalStyles.thumbImg}
                                unoptimized={!canOptimizeImage(clientImageUrl)}
                              />
                            : null}
                        </span>
                      </span>
                      <span
                        className={`${journalStyles.title} ${styles.metaLabel}`.trim()}
                      >
                        <span className={journalStyles.titleText}>Client</span>
                      </span>
                      <span
                        className={`${journalStyles.date} ${styles.metaValue}`.trim()}
                      >
                        {clientName?.trim() || "—"}
                      </span>
                    </div>
                  </li>

                  <li
                    className={`${journalStyles.item} ${styles.metaItem}`.trim()}
                  >
                    <div className={journalStyles.rowLink}>
                      <span className={journalStyles.thumb}>
                        <span
                          className={`${journalStyles.thumbInner} ${styles.iconThumb}`.trim()}
                        >
                          <IconCategory />
                        </span>
                      </span>
                      <span
                        className={`${journalStyles.title} ${styles.metaLabel}`.trim()}
                      >
                        <span className={journalStyles.titleText}>
                          Category
                        </span>
                      </span>
                      <span
                        className={`${journalStyles.date} ${styles.metaValue}`.trim()}
                      >
                        {category?.trim() || "—"}
                      </span>
                    </div>
                  </li>

                  <li
                    className={`${journalStyles.item} ${styles.metaItem}`.trim()}
                  >
                    <div className={journalStyles.rowLink}>
                      <span className={journalStyles.thumb}>
                        <span
                          className={`${journalStyles.thumbInner} ${styles.iconThumb}`.trim()}
                        >
                          <IconDate />
                        </span>
                      </span>
                      <span
                        className={`${journalStyles.title} ${styles.metaLabel}`.trim()}
                      >
                        <span className={journalStyles.titleText}>Date</span>
                      </span>
                      <time
                        className={`${journalStyles.date} ${styles.metaValue}`.trim()}
                        dateTime={publishedAt ?? undefined}
                      >
                        {publishedLabel}
                      </time>
                    </div>
                  </li>
                </ul>

                {visitWebsiteUrl
                  ? <div className={styles.visitWebsiteWrap}>
                      <a
                        href={visitWebsiteUrl}
                        className={styles.visitWebsiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Visit website</span>
                        <VisitWebsiteArrow
                          className={styles.visitWebsiteArrow}
                        />
                      </a>
                    </div>
                  : null}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </section>
  );
}
