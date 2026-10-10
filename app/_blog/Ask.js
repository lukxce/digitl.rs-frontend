"use client";

import { MotionConfig } from "motion/react";
import { Btn, Reveal, useApp } from "../_home/ui";
import s from "./article.module.css";

/** Motion on these pages follows the reader's reduced-motion setting. */
export function Calm({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Closes the article: who wrote it, and the way to ask them about it. */
export default function Ask({ author, avatar }) {
  const { book } = useApp();
  return (
    <Reveal className={s.ask}>
      <div className={s.askWho}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} alt="" width={54} height={54} loading="lazy" />
        <p>
          <span>Autor teksta</span>
          <b>{author}</b>
        </p>
      </div>
      <div className={s.askCopy}>
        <h2>Imate pitanje o ovoj temi?</h2>
        <p>Prvi razgovor je besplatan.</p>
      </div>
      <Btn variant="accent" onClick={() => book()}>
        Zakaži razgovor
      </Btn>
    </Reveal>
  );
}
