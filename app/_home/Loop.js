"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import l from "./loop.module.css";
import { Bridge, EASE, Head, useVisible } from "./ui";

/* The customer's path drawn as a loop rather than a funnel: someone notices
   you, searches, decides on the site, gets in touch, and comes back or sends
   someone else, which starts the loop again. The five stops sit on the ring
   itself (tap one to hold it); the arc closes when the loop comes back to
   the start. Each stop names the services that work there and what we
   measure. */

const STAGES = [
  {
    name: "Primeti vas",
    body: "Prvi put čuje za vas: na mrežama, u oglasu ili od nekog ko vas preporuči.",
    who: ["Brend", "Društvene mreže"],
    metric: "Doseg u pravoj publici",
  },
  {
    name: "Traži",
    body: "Kad mu zatreba, ukuca uslugu i grad. Tu morate biti među prvima, jer na drugu stranu skoro niko ne ide.",
    who: ["SEO", "Plaćeno oglašavanje"],
    metric: "Pozicija i cena po kliku",
  },
  {
    name: "Odlučuje",
    body: "Dolazi na sajt. Brz sajt sa cenom i jasnim sledećim korakom pretvara posetu u upit.",
    who: ["Web"],
    metric: "Stopa konverzije",
  },
  {
    name: "Javlja se",
    body: "Poziv, poruka ili porudžbina. Svaki upit se beleži, pa znamo tačno odakle je došao.",
    who: ["Web", "Plaćeno oglašavanje"],
    metric: "Cena po upitu",
  },
  {
    name: "Vraća se",
    body: "Zadovoljan kupac se vraća i preporučuje vas dalje. Tako krug kreće ponovo, i svaki sledeći kupac košta manje.",
    who: ["Društvene mreže", "Brend"],
    metric: "Povratni kupci i preporuke",
  },
];
const N = STAGES.length;
const C = 300;
const R = 210;
const CIRC = 2 * Math.PI * R;
const round = (v) => Math.round(v * 100) / 100;
const pos = (i, r = R) => {
  const a = ((-90 + (360 / N) * i) * Math.PI) / 180;
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))];
};
const pct = (v) => `${(v / 600) * 100}%`;

export default function Loop() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const active = step % N;

  useEffect(() => {
    if (!visible || held) return;
    const t = setTimeout(() => setStep((v) => v + 1), 3400);
    return () => clearTimeout(t);
  }, [visible, held, step]);

  const pick = (i) => {
    setHeld(true);
    // always travel forward round the loop
    setStep((v) => v - (v % N) + i + (i < v % N ? N : 0));
  };
  const cur = STAGES[active];
  // The arc grows stop by stop and closes into a full ring when the loop is
  // back at the start; the next lap starts a fresh arc (new key).
  const lap = Math.floor((step - 1) / N);
  const arc = active === 0 && step > 0 ? 1 : active / N;

  return (
    <section
      className={`${b.section} ${b.glow} ${l.section}`}
      data-section="Put kupca"
    >
      <div className={b.container}>
        <div ref={ref} className={l.grid}>
          <div className={l.head}>
            <Head
              id="put-kupca"
              label="Put kupca"
              title="Kupac ne ide kroz levak. Ide u krug."
              intro="Svaka usluga ima svoje mesto na tom putu. Mi vodimo ceo krug, pa svaki kupac dovodi sledećeg."
            />
          </div>
          <div className={l.diagram}>
            <svg viewBox="0 0 600 600" aria-hidden="true">
              <circle cx={C} cy={C} r={R} className={l.ring} />
              <motion.circle
                key={lap}
                cx={C}
                cy={C}
                r={R}
                className={l.ringOn}
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: CIRC * (1 - arc) }}
                transition={{ duration: 1, ease: EASE }}
                transform={`rotate(-90 ${C} ${C})`}
              />
            </svg>

            {STAGES.map((st, i) => {
              const [x, y] = pos(i);
              const [lx, ly] = pos(i, R + 46);
              const side = lx > C + 10 ? "r" : lx < C - 10 ? "l" : "t";
              const on = i === active;
              return (
                <div key={st.name}>
                  <button
                    type="button"
                    className={l.stop}
                    data-on={on ? "true" : undefined}
                    data-done={
                      i < active || (active === 0 && step > 0)
                        ? "true"
                        : undefined
                    }
                    style={{ left: pct(x), top: pct(y) }}
                    onClick={() => pick(i)}
                    aria-label={`${i + 1}. ${st.name}`}
                    aria-pressed={on}
                  >
                    {i + 1}
                  </button>
                  <span
                    className={l.name}
                    data-side={side}
                    data-on={on ? "true" : undefined}
                    style={{ left: pct(lx), top: pct(ly) }}
                    aria-hidden="true"
                  >
                    {st.name}
                  </span>
                </div>
              );
            })}

            <div className={l.center}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className={l.centerIn}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <span className={l.of}>
                    Korak {active + 1} od {N}
                  </span>
                  <b>{cur.name}</b>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              className={l.card}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p>{cur.body}</p>
              <div className={l.facts}>
                <span className={l.fact}>
                  <span className={l.mini}>Ovde radi</span>
                  <span className={l.who}>
                    {cur.who.map((w) => (
                      <i key={w}>{w}</i>
                    ))}
                  </span>
                </span>
                <span className={l.fact}>
                  <span className={l.mini}>Merimo</span>
                  <b>{cur.metric}</b>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Bridge
          text="Vodimo ceo krug, od prvog pogleda do kupca koji se vraća. Razgovarajmo o vašem."
          to="#kontakt"
          label="Razgovarajmo"
        />
      </div>
    </section>
  );
}
