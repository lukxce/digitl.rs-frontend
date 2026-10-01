"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { ArrowLeft, ArrowRight, Check, Pause, Play, Sparkle } from "./icons";
import s from "./process.module.css";
import { SCENES } from "./scenes";
import { EASE, Honest, Kicker, useVisible } from "./ui";

const DWELL = 9000;

const STEPS = [
  {
    short: "Razumevanje",
    tab: "Upitnik",
    title: "Prvo slušamo, pa tek onda predlažemo",
    body: [
      "Analiziramo biznis, ciljeve i dosadašnje brojeve da vidimo šta radi, a šta ne.",
      "Kratak upitnik i razgovor od 30 minuta. Posao opišete svojim rečima, kao što biste ga opisali prijatelju.",
    ],
    examples: [
      "Prodajemo prirodnu kozmetiku online. Prodaja stoji već šest meseci.",
      "Imamo dobar proizvod, ali nas svaki novi kupac košta sve više.",
    ],
  },
  {
    short: "Plan",
    tab: "Plan pretrage",
    title: "Plan pre prvog dinara",
    body: [
      "Postavljamo prioritete, kanale i jasan plan rasta.",
      "Za svaku uslugu ili kategoriju tražimo kako je ljudi zaista pretražuju i dajemo joj svoju stranicu. Tek onda odlučujemo gde ide budžet za oglase.",
    ],
  },
  {
    short: "Lansiranje",
    tab: "Lansiranje",
    title: "Sajt, profil i oglasi kreću zajedno",
    body: [
      "Pokrećemo, testiramo i skaliramo ono što zarađuje.",
      "Pre nego što sajt ode uživo, merimo ga onako kako ga meri Google: na sporijem telefonu.",
    ],
    proof: "Moler Niš i Servis Klime Niš: PageSpeed 100 na telefonu.",
  },
  {
    short: "Merenje",
    tab: "Izveštaj",
    title: "Izveštaj koji se pročita za dva minuta",
    body: [
      "Jasni izveštaji i konkretne odluke o sledećem koraku.",
      "Jedna strana: koliko je ljudi pozvalo ili pisalo, odakle su došli i šta radimo sledeće.",
    ],
    proof: "ThermiQ: 3.157 indeksiranih stranica za tri meseca.",
  },
];

function AppWindow({ step, active }) {
  const Scene = SCENES[step];
  return (
    <div className={s.windowWrap}>
      <span className={s.ghostA} aria-hidden="true" />
      <span className={s.ghostB} aria-hidden="true" />
      <div className={s.window}>
        <div className={s.windowHead}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" className={s.windowLogo} />
          <div className={s.windowTabs}>
            {STEPS.map((x, i) => (
              <span
                key={x.tab}
                className={s.windowTab}
                data-state={i === step ? "now" : i < step ? "done" : "next"}
              >
                {i <= step
                  ? <i>
                      <Check size={9} strokeWidth={3.5} />
                    </i>
                  : null}
                {x.tab}
              </span>
            ))}
          </div>
          <span className={s.avatars} aria-hidden="true">
            <span className={s.avatarYou}>VI</span>
            <span className={s.avatarUs}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt="" />
            </span>
          </span>
        </div>
        <div className={s.windowBody}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              className={s.windowScene}
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Scene active={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [tick, setTick] = useState(0);
  const running = playing && visible;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((v) => (v + 1) % STEPS.length), DWELL);
    return () => clearTimeout(t);
  }, [running, step, tick]);

  const go = (i) => {
    setStep((i + STEPS.length) % STEPS.length);
    setTick((t) => t + 1);
  };
  const cur = STEPS[step];
  const next = STEPS[(step + 1) % STEPS.length];

  return (
    <section className={b.sectionTight} data-theme="light">
      <span id="proces" className={b.anchor} />
      <div className={b.container}>
        <div ref={ref} className={s.panel} data-theme="dark">
          <Sparkle
            size={260}
            className={`${b.sparkleMark} ${b.spinSlow} ${s.spark}`}
          />

          <div className={s.head}>
            <Kicker tone="dark">Proces</Kicker>
            <h2 className={`${b.h2} ${s.title}`}>
              Od prvog razgovora do prvih rezultata
            </h2>
          </div>

          <div className={s.stepBar} role="tablist" aria-label="Koraci">
            {STEPS.map((x, i) => (
              <button
                key={x.short}
                type="button"
                role="tab"
                aria-selected={i === step}
                className={s.stepBtn}
                data-state={i === step ? "now" : i < step ? "done" : "next"}
                onClick={() => go(i)}
              >
                <span className={s.stepLine}>
                  {i < step ? <i style={{ transform: "scaleX(1)" }} /> : null}
                  {i === step
                    ? <motion.i
                        key={`${step}-${tick}-${running}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: running ? 1 : 0.04 }}
                        transition={{
                          duration: running ? DWELL / 1000 : 0.3,
                          ease: "linear",
                        }}
                      />
                    : null}
                </span>
                <span className={s.stepName}>
                  <b>0{i + 1}</b> <span>{x.short}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={s.body}>
            <div className={s.copy}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={s.copyInner}
                >
                  <span className={s.outline} aria-hidden="true">
                    0{step + 1}
                  </span>
                  <h3 className={s.stepTitle}>{cur.title}</h3>
                  {cur.body.map((p) => (
                    <p key={p} className={s.stepBody}>
                      {p}
                    </p>
                  ))}
                  {cur.examples
                    ? <div className={s.examples}>
                        <span className={s.exLabel}>
                          Kako nam ljudi opisuju posao
                        </span>
                        {cur.examples.map((e, i) => (
                          <motion.p
                            key={e}
                            className={s.bubble}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                              delay: 0.3 + i * 0.25,
                              duration: 0.5,
                              ease: EASE,
                            }}
                          >
                            {e}
                          </motion.p>
                        ))}
                      </div>
                    : null}
                  {cur.proof
                    ? <p className={s.proof}>
                        <Check size={13} strokeWidth={3} /> {cur.proof}
                      </p>
                    : null}
                </motion.div>
              </AnimatePresence>

              <div className={s.controls}>
                <button
                  type="button"
                  className={s.ctrl}
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? "Pauziraj" : "Pusti"}
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  type="button"
                  className={s.ctrl}
                  onClick={() => go(step - 1)}
                  aria-label="Prethodni korak"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  className={s.nextBtn}
                  onClick={() => go(step + 1)}
                >
                  Sledeće: {next.short} <ArrowRight size={15} />
                </button>
              </div>
            </div>

            <div className={s.visual}>
              <AppWindow step={step} active={visible} />
              <div className={s.honestRow}>
                <Honest dark>
                  Primer projekta: online prodavnica. Brojevi u prozoru su
                  izmišljeni.
                </Honest>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
