"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { Check } from "./icons";
import j from "./journey.module.css";
import { Chat, Hub, Report, Wait } from "./Minis";
import { EASE, Roll, useVisible } from "./ui";

/* The old homepage's "4 · Kako radimo", kept small. On wide screens all four
   cards sit on one rail and the light moves step to step (hover takes over).
   On phones the same cards swipe sideways, the next one peeking in, with a
   numbered stepper above that follows the swipe and can be tapped. */

const DWELL = 3800;

const STEPS = [
  {
    name: "Razumevanje",
    body: "Analiziramo biznis, ciljeve i dosadašnje brojeve da vidimo šta radi, a šta ne.",
    get: [
      "Audit sajta, oglasa i profila",
      "Pregled konkurencije",
      "Šta radi, a šta ne",
    ],
  },
  {
    name: "Planiranje",
    body: "Postavljamo prioritete, kanale i jasan plan rasta.",
    get: ["Prioriteti po redu", "Kanali i budžet", "Broj koji pratimo"],
  },
  {
    name: "Lansiranje",
    body: "Pokrećemo, testiramo i skaliramo ono što zarađuje.",
    get: ["Sajt i kampanje uživo", "Praćenje poziva i formi", "Prvi upiti"],
  },
  {
    name: "Optimizacija",
    body: "Jasni izveštaji i konkretne odluke o sledećem koraku.",
    get: ["Mesečni izveštaj", "Šta gasimo, a šta pojačavamo", "Sledeći korak"],
  },
];
const N = STEPS.length;
// each step shows itself working: the first talk, the plan in time, every
// channel live, the monthly report
const ART = [Chat, Wait, Hub, Report];

export default function Journey() {
  const ref = useRef(null);
  const listRef = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);
  // a step's little interface plays again each time the step comes on
  const [plays, setPlays] = useState(() => STEPS.map(() => 0));
  useEffect(() => {
    setPlays((p) => p.map((v, k) => (k === step ? v + 1 : v)));
  }, [step]);
  const [wide, setWide] = useState(true);
  // phones: how far the swipe is between this card and the next (0 to 1)
  const [frac, setFrac] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // wide screens: the light walks the steps on its own until you hover
  const running = wide && visible && !hover;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((v) => (v + 1) % N), DWELL);
    return () => clearTimeout(t);
  }, [running, step]);

  // phones: the card snapped to the left edge is the current one
  const onSwipe = () => {
    if (wide) return;
    const el = listRef.current;
    const first = el.children[0];
    const pitch = el.children[1].offsetLeft - first.offsetLeft;
    const p = Math.max(0, Math.min(N - 1, el.scrollLeft / pitch));
    // the number changes only once the next card has (almost) arrived
    const i = Math.min(N - 1, Math.floor(p + 0.06));
    setStep(i);
    setFrac(Math.max(0, Math.min(1, p - i)));
  };
  const slide = (i) => {
    const el = listRef.current;
    el.scrollTo({
      left: el.children[i].offsetLeft - el.children[0].offsetLeft,
      behavior: "smooth",
    });
  };

  return (
    <section className={`${b.section} ${j.section}`} data-section="Kako radimo">
      <div ref={ref} className={b.container}>
        <span id="proces" className={b.anchor} />
        <div className={j.head}>
          <span className={j.four} aria-hidden="true">
            <Roll value={4} run={visible} ms={1400} />
          </span>
          <div className={j.headText}>
            <span className={b.label}>Kako radimo</span>
            <p>
              <b>Jedan proces</b>
              {/* a string, not JSX text: with an entity in it the server and
                  the browser trimmed the leading space differently */}
              {
                " od prvog razgovora do mesečnog izveštaja. U\u00a0svakom koraku "
              }
              <b>znate šta radimo i šta je sledeće.</b>
            </p>
          </div>
        </div>

        {/* phones: one number in the middle, the line to the right fills as
            the next card comes in, then the next number takes its place */}
        <div className={j.stepper}>
          <button
            type="button"
            className={j.stepNow}
            onClick={() => slide((step + 1) % N)}
            aria-label={`Korak ${step + 1} od ${N}: ${STEPS[step].name}. Sledeći korak`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={step}
                className={j.stepNowIn}
                initial={{ opacity: 0, y: -14, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className={j.dot}>{step + 1}</span>
                <span className={j.stepperName}>{STEPS[step].name}</span>
              </motion.span>
            </AnimatePresence>
          </button>
          <span className={j.stepLine} aria-hidden="true">
            <i style={{ transform: `scaleX(${step === N - 1 ? 1 : frac})` }} />
          </span>
          <span className={j.stepCount} aria-hidden="true">
            {step + 1} / {N}
          </span>
        </div>

        <div className={j.track}>
          {/* wide screens: the rail through the four dots */}
          <span className={j.rail} aria-hidden="true">
            <motion.i
              className={j.railFill}
              initial={false}
              animate={{ scaleX: visible ? step / (N - 1) : 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </span>

          <ol
            ref={listRef}
            className={j.steps}
            onMouseLeave={() => setHover(false)}
            onScroll={onSwipe}
          >
            {STEPS.map((s, i) => {
              const on = i === step;
              return (
                <li
                  key={s.name}
                  className={j.step}
                  data-on={on ? "true" : undefined}
                  data-done={i < step ? "true" : undefined}
                  onMouseEnter={() => {
                    if (!wide) return;
                    setHover(true);
                    setStep(i);
                  }}
                >
                  <span className={j.dot}>{i + 1}</span>
                  <div className={j.card}>
                    <h3>{s.name}</h3>
                    <p>{s.body}</p>
                    <div className={j.art} aria-hidden="true">
                      {(() => {
                        const Art = ART[i];
                        return <Art key={plays[i]} run={visible} dark={on} />;
                      })()}
                    </div>
                    <ul className={j.get} aria-label="Šta dobijate">
                      {s.get.map((g, k) => (
                        <motion.li
                          key={g}
                          initial={false}
                          animate={
                            on
                              ? { opacity: [0.3, 1], x: [-6, 0] }
                              : { opacity: 1, x: 0 }
                          }
                          transition={{
                            delay: on ? 0.15 + k * 0.12 : 0,
                            duration: 0.45,
                            ease: EASE,
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                          {g}
                        </motion.li>
                      ))}
                    </ul>
                    {on && running
                      ? <span className={j.timer} aria-hidden="true">
                          <motion.i
                            key={`t-${step}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: DWELL / 1000,
                              ease: "linear",
                            }}
                          />
                        </span>
                      : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
