"use client";

import { useLenis } from "lenis/react";
import styles from "./OnThisPageNav.module.css";

/**
 * @param {{
 *   items: Array<{ id: string; label: string }>;
 *   className?: string;
 *   headingId?: string;
 * }} props
 */
export default function OnThisPageNav({
  items,
  className = "",
  headingId = "on-this-page-title",
}) {
  const lenis = useLenis();

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <nav
      className={`${styles.root} ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={styles.heading}>
        What&apos;s on this page
      </h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.link}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById(item.id);
                if (lenis && target) {
                  lenis.scrollTo(target, { offset: 0 });
                } else {
                  target?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
                window.history.replaceState(null, "", `#${item.id}`);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
