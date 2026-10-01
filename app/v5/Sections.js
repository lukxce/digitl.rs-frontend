"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Audit from "./Audit";
import b from "./base.module.css";
import { FAQ } from "./content";
import { Plus } from "./icons";
import x from "./sections.module.css";
import { EASE, Head } from "./ui";

/* ── Provera sajta: the full console, right under the four steps ──────── */
export function Check() {
  return (
    <section className={`${b.glow} ${x.check}`} data-section="Provera sajta">
      <div className={b.container}>
        <div className={x.checkHead}>
          <span className={b.label}>Besplatna provera</span>
          <h2>Krenite od svog sajta.</h2>
          <p>
            Isti test kojim Google ocenjuje sajtove na telefonu. Ocena i prve
            popravke za dvadesetak sekundi, bez prijave.
          </p>
        </div>
        <Audit />
      </div>
    </section>
  );
}

/* ── Pitanja ──────────────────────────────────────────────────────────── */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={b.section} data-section="Pitanja">
      <div className={`${b.container} ${x.faq}`}>
        <Head
          id="pitanja"
          label="Pitanja"
          title="Pre prvog razgovora."
          intro="Kratki, iskreni odgovori. Za sve ostalo: hello@digitl.rs"
        />
        <ul className={x.faqList}>
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <i className={on ? x.plusOn : ""}>
                    <Plus size={16} strokeWidth={2.4} />
                  </i>
                </button>
                <AnimatePresence initial={false}>
                  {on
                    ? <motion.div
                        id={`faq-${i}`}
                        className={x.answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
