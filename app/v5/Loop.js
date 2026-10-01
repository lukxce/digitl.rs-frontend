"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import l from "./loop.module.css";
import { Bridge, EASE, Head, useVisible } from "./ui";

/* The customer's path drawn as a loop rather than a funnel: someone notices
   you, searches, decides on the site, gets in touch, and comes back or sends
   someone else, which starts the loop again. Each stage names the services
   that do the work there and the number we watch. */

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
const round = (v) => Math.round(v * 100) / 100;
const pos = (i, r = R) => {
  const a = ((-90 + (360 / N) * i) * Math.PI) / 180;
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))];
};

export default function Loop() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const active = step % N;

  useEffect(() => {
    if (!visible || held) return;
    const t = setTimeout(() => setStep((v) => v + 1), 3200);
    return () => clearTimeout(t);
  }, [visible, held, step]);

  const pick = (i) => {
    setHeld(true);
    // always travel forward round the loop
    setStep((v) => v - (v % N) + i + (i < v % N ? N : 0));
  };
  const cur = STAGES[active];
  const circ = 2 * Math.PI * R;
  const lap = Math.floor(step / N) + 1;

  return (
    <section className={`${b.section} ${l.section}`} data-section="Put kupca">
      <div className={b.container}>
        <Head
          id="put-kupca"
          label="Put kupca"
          title="Kupac ne ide kroz levak. Ide u krug."
          intro="Svaka usluga ima svoje mesto na tom putu. Mi vodimo ceo krug, pa svaki kupac dovodi sledećeg."
        />

        <div ref={ref} className={l.grid}>
          <div className={l.diagram}>
            <svg viewBox="0 0 600 600" aria-hidden="true">
              <circle cx={C} cy={C} r={R} className={l.ring} />
              <motion.circle
                cx={C}
                cy={C}
                r={R}
                className={l.ringOn}
                strokeDasharray={circ}
                initial={false}
                animate={{ strokeDashoffset: circ * (1 - (active + 1) / N) }}
                transition={{ duration: 1.1, ease: EASE }}
                transform={`rotate(-90 ${C} ${C})`}
              />
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i * 6 * Math.PI) / 180;
                const r1 = R + 24;
                const r2 = R + (i % 5 === 0 ? 36 : 30);
                return (
                  <line
                    key={i}
                    x1={round(C + r1 * Math.cos(a))}
                    y1={round(C + r1 * Math.sin(a))}
                    x2={round(C + r2 * Math.cos(a))}
                    y2={round(C + r2 * Math.sin(a))}
                    className={l.tick}
                  />
                );
              })}
              <motion.g
                initial={false}
                animate={{ rotate: step * (360 / N) }}
                transition={{ duration: 1.1, ease: EASE }}
              >
                <circle cx={C} cy={C} r={R + 16} fill="none" stroke="none" />
                <circle cx={C} cy={C - R} r="18" className={l.runnerGlow} />
                <circle cx={C} cy={C - R} r="8" className={l.runner} />
              </motion.g>
              {STAGES.map((st, i) => {
                const [x, y] = pos(i);
                return (
                  <circle
                    key={st.name}
                    cx={x}
                    cy={y}
                    r={i === active ? 12 : 7}
                    className={l.node}
                    data-on={i === active ? "true" : undefined}
                  />
                );
              })}
            </svg>

            {STAGES.map((st, i) => {
              const [x, y] = pos(i, R + 78);
              return (
                <button
                  key={st.name}
                  type="button"
                  className={l.label}
                  data-on={i === active ? "true" : undefined}
                  style={{
                    left: `${(x / 600) * 100}%`,
                    top: `${(y / 600) * 100}%`,
                  }}
                  onClick={() => pick(i)}
                >
                  <i>{i + 1}</i>
                  {st.name}
                </button>
              );
            })}

            <div className={l.center}>
              <span className={l.lap}>Krug {lap}</span>
              <AnimatePresence mode="wait">
                <motion.b
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {cur.name}
                </motion.b>
              </AnimatePresence>
            </div>
          </div>

          <div className={l.side}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={l.card}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className={l.cardNo}>
                  Korak {active + 1} od {N}
                </span>
                <h3>{cur.name}</h3>
                <p>{cur.body}</p>
                <span className={l.mini}>Ovde radi</span>
                <span className={l.who}>
                  {cur.who.map((w) => (
                    <i key={w}>{w}</i>
                  ))}
                </span>
                <span className={l.metric}>
                  <span className={l.mini}>Merimo</span>
                  <b>{cur.metric}</b>
                </span>
              </motion.div>
            </AnimatePresence>
            <ol className={l.list}>
              {STAGES.map((st, i) => (
                <li key={st.name}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    data-on={i === active ? "true" : undefined}
                  >
                    <i>{i + 1}</i>
                    {st.name}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Bridge
          text="Gde je vaš sajt u ovom krugu? Proverite za dvadeset sekundi."
          to="#provera"
          label="Proverite svoj sajt"
        />
      </div>
    </section>
  );
}
