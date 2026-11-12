"use client";

/* One chapter of a post: from one H2 to the next. It brings its own colour
   (the blog plays with a wider palette than the site: Luka, 13 Nov 2026),
   a big outline number, and it marks itself "in" once it scrolls into view,
   so the number draws, the rule grows and the highlighted phrases sweep in. */

import { useInView } from "motion/react";
import { useRef } from "react";
import p from "./prose.module.css";

export const TONES = [
  { c: "#2A29FF", soft: "#EEF0FF" }, // blue
  { c: "#7B5CFF", soft: "#F3F0FF" }, // violet
  { c: "#0FA97A", soft: "#E8F8F1" }, // green
  { c: "#E88A00", soft: "#FFF5E3" }, // amber
  { c: "#D63384", soft: "#FDEEF6" }, // pink
  { c: "#0B8FD6", soft: "#E8F5FD" }, // sky
];

export default function Chapter({ n, tone, band, plain, children, head }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const t = TONES[tone % TONES.length];
  return (
    <section
      ref={ref}
      className={p.chapter}
      data-in={seen ? "" : undefined}
      data-band={band ? "" : undefined}
      data-plain={plain ? "" : undefined}
      style={{ "--c": t.c, "--soft": t.soft }}
    >
      {head
        ? <header className={p.chapterHead}>
            {n
              ? <span className={p.chapterNo} aria-hidden="true">
                  {String(n).padStart(2, "0")}
                </span>
              : null}
            {head}
          </header>
        : null}
      {children}
    </section>
  );
}
