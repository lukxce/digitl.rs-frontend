"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  getScrollRevealTransition,
  scrollRevealHidden,
  scrollRevealViewport,
  scrollRevealVisible,
} from "../../lib/scrollReveal";
import styles from "./ScrollReveal.module.css";

const motionComponents = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  li: motion.li,
};

/**
 * @param {{
 *   as?: keyof typeof motionComponents;
 *   children: import("react").ReactNode;
 *   className?: string;
 *   delay?: number;
 *   style?: import("react").CSSProperties;
 *   id?: string;
 * }} props
 */
export default function ScrollReveal({
  as = "div",
  children,
  className,
  delay = 0,
  style,
  id,
}) {
  const reduceMotion = useReducedMotion() === true;
  const Component = motionComponents[as] ?? motion.div;
  const mergedClassName = className
    ? `${styles.root} ${className}`.trim()
    : styles.root;

  return (
    <Component
      id={id}
      className={mergedClassName}
      style={style}
      initial={reduceMotion ? scrollRevealVisible : scrollRevealHidden}
      whileInView={reduceMotion ? undefined : scrollRevealVisible}
      viewport={scrollRevealViewport}
      transition={getScrollRevealTransition(delay, reduceMotion)}
    >
      {children}
    </Component>
  );
}
