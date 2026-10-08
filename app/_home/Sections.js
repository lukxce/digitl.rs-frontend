"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import { FAQ } from "./content";
import { Check, Plus } from "./icons";
import Quiz from "./Quiz";
import x from "./sections.module.css";
import { EASE, Head } from "./ui";

/* ── Vaš plan: the three questions, right under the four steps ──────── */
export function PlanSection({ clients }) {
  return (
    <section className={`${b.glow} ${x.plan}`} data-section="Vaš plan">
      <div className={b.container}>
        <span id="vas-plan" className={b.anchor} />
        <div className={x.planGrid}>
          <div className={x.planHead}>
            <span className={b.label}>Tri pitanja</span>
            <h2>Odakle da krenete?</h2>
            <p>
              Odgovorite na tri kratka pitanja i dobićete preporuku: šta vam je
              od marketinga sada najpotrebnije i od čega je najpametnije da
              krenete.
            </p>
            <ul className={x.planGet}>
              {[
                "Usluge poređane po tome koliko vam trebaju",
                "Naš projekat koji je najsličniji vašem",
                "Plan koji jednim klikom šaljete nama",
              ].map((t) => (
                <li key={t}>
                  <span>
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <small>Traje oko pola minuta.</small>
          </div>
          <Quiz clients={clients} />
        </div>
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
