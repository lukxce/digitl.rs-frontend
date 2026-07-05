"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import styles from "./ServiceItem.module.css";

const easeOut = [0.22, 1, 0.36, 1];
const spinRotations = 1;
const iconSpinDeg = 360 * spinRotations;

function ToggleIcon({ open, reduceMotion }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Toggle</title>
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <motion.path
        d="M12 5v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          opacity: open ? 0 : 1,
          scaleY: open ? 0 : 1,
        }}
        style={{ transformOrigin: "center" }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.9, ease: easeOut }
        }
      />
    </svg>
  );
}

export default function ServiceItem({ icon, title, description, initialOpen }) {
  const [open, setOpen] = useState(initialOpen ?? false);
  const panelId = useId();
  const titleId = useId();
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = prefersReducedMotion === true;

  return (
    <div className={styles.root}>
      <div className={styles.row} onClick={() => setOpen((v) => !v)}>
        <div className={styles.iconContainer}>
          <span className={styles.iconSlot}>{icon}</span>
          <span className={styles.title} id={titleId}>
            {title}
          </span>
        </div>
        <button
          type="button"
          className={styles.toggleBtn}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Hide" : "Show"} details: ${title}`}
        >
          <motion.span
            className={styles.toggle}
            initial={false}
            animate={{
              rotate: reduceMotion ? 0 : open ? iconSpinDeg : 0,
            }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.9, ease: easeOut }
            }
          >
            <ToggleIcon open={open} reduceMotion={reduceMotion} />
          </motion.span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.section
            key="panel"
            id={panelId}
            className={styles.panel}
            aria-labelledby={titleId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.2, ease: easeOut }
                : {
                    height: { duration: 0.35, ease: easeOut },
                    opacity: { duration: 0.25, ease: easeOut },
                  }
            }
            style={{ overflow: "hidden" }}
          >
            <div className={styles.panelInner}>
              <p className={styles.description}>{description}</p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
