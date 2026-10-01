"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Audit from "./Audit";
import b from "./base.module.css";
import { FAQ } from "./content";
import { Plus } from "./icons";
import x from "./sections.module.css";
import { Bridge, EASE, Head } from "./ui";

/* ── Provera sajta: the live PageSpeed check ──────────────────────────── */
export function Check() {
  return (
    <section className={`${b.section} ${x.check}`} data-section="Provera sajta">
      <div className={b.container}>
        <Head
          center
          id="provera-naslov"
          label="Vaš red"
          title="Krenite od svog sajta."
          intro="Isti test kojim Google ocenjuje sajtove na telefonu. Za dvadesetak sekundi vidite ocenu, šta kasni i šta bismo prvo popravili."
        />
        <div className={x.console}>
          <Audit />
        </div>
        <Bridge
          text="Rezultat provere ide uz vašu poruku. Ostalo je samo da se upoznamo."
          to="#kontakt"
          label="Razgovarajmo"
        />
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
