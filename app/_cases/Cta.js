"use client";

import { Btn, Reveal, useApp } from "../_home/ui";
import s from "./study.module.css";

/** The plain ask at the end of a study. */
export default function CaseCta() {
  const { book } = useApp();
  return (
    <Reveal className={s.cta}>
      <div>
        <h2>Imate sličan problem?</h2>
        <p>Prvi razgovor je besplatan i ne obavezuje ni na šta.</p>
      </div>
      <Btn variant="white" onClick={() => book()}>
        Zakaži razgovor
      </Btn>
    </Reveal>
  );
}
