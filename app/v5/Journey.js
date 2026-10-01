"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { Check } from "./icons";
import j from "./journey.module.css";
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

export default function Journey() {
  const ref = useRef(null);
  const listRef = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [step, setStep] = useState(0);
  const [hover, setHover] = useState(false);
  const [wide, setWide] = useState(true);

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
    const i = Math.round(el.scrollLeft / pitch);
    setStep(Math.max(0, Math.min(N - 1, i)));
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
            <Roll value={visible ? 4 : 0} ms={1400} />
          </span>
          <div className={j.headText}>
            <span className={b.label}>Kako radimo</span>
            <p>
              <b>Jedan povezan proces</b> koji drži strategiju, egzekuciju i
              rezultate u istom pravcu, <b>od početka do kraja.</b>
            </p>
          </div>
        </div>

        {/* phones: the stepper that drives the swipe */}
        <div className={j.stepper} role="tablist" aria-label="Koraci">
          <span className={j.stepperRail} aria-hidden="true">
            <motion.i
              initial={false}
              animate={{ scaleX: step / (N - 1) }}
              transition={{ duration: 0.6, ease: EASE }}
            />
          </span>
          {STEPS.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={i === step}
              className={j.stepperItem}
              data-on={i === step ? "true" : undefined}
              data-done={i < step ? "true" : undefined}
              onClick={() => slide(i)}
            >
              <span className={j.dot}>{i + 1}</span>
              <span className={j.stepperName}>{s.name}</span>
            </button>
          ))}
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
