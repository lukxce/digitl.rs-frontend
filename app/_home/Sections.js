"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Audit from "./Audit";
import b from "./base.module.css";
import { FAQ } from "./content";
import { Plus } from "./icons";
import Quiz from "./Quiz";
import x from "./sections.module.css";
import { Btn, EASE, Head, useApp } from "./ui";

/* ── Vaš plan: the three questions, right under the four steps ──────── */
/* ── Provera sajta: Google's own phone test, live, right before the form;
   the address and the scores travel into the form below ──────────────── */
export function Check() {
  return (
    <section className={`${b.glow} ${x.check}`} data-section="Provera sajta">
      <div className={b.container}>
        <span id="provera-sajta" className={b.anchor} />
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
  const { openBooking } = useApp();
  return (
    <section className={b.section} data-section="Pitanja">
      <div className={`${b.container} ${x.faq}`}>
        <div className={x.faqSide}>
          <Head
            id="pitanja"
            label="Pitanja"
            title="Imate još pitanja pre nego što krenemo?"
            intro="Ako vašeg pitanja nema ovde, pišite na hello@digitl.rs."
          />
          <Btn variant="accent" size="sm" onClick={() => openBooking()}>
            Zakažite razgovor
          </Btn>
        </div>
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
                {/* Every answer is in the page (search engines and AI
                    answers read them); a closed one is only folded. */}
                <motion.div
                  id={`faq-${i}`}
                  className={x.answer}
                  initial={false}
                  animate={
                    on
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                  aria-hidden={!on}
                >
                  <p>{f.a}</p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
