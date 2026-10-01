"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import b from "./base.module.css";
import s from "./data.module.css";
import { Bolt, Pin } from "./icons";
import { EASE, Kicker, Reveal, Roll, useApp, useVisible } from "./ui";

// Google / SOASTA (2017), mobile: probability of bounce vs. a 1 s page.
const STOPS = [
  { s: 1, up: 0 },
  { s: 3, up: 32 },
  { s: 5, up: 90 },
  { s: 6, up: 106 },
  { s: 10, up: 123 },
];

function Speed() {
  const { audit } = useApp();
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [i, setI] = useState(1);
  const cur = STOPS[i];

  const lcp = audit?.metrics?.lcp?.value
    ? audit.metrics.lcp.value / 1000
    : null;
  const yourPos = lcp
    ? Math.min(100, Math.max(0, ((lcp - 1) / 9) * 100))
    : null;
  const pct = (i / (STOPS.length - 1)) * 100;

  return (
    <div ref={ref} className={s.speed} data-theme="dark">
      <div className={s.cardTop}>
        <span className={s.eyebrow}>
          <Bolt size={13} /> Brzina na telefonu
        </span>
        <h3 className={s.cardTitle}>Svaka sekunda košta posetilaca</h3>
      </div>

      <div className={s.speedMain}>
        <div className={s.phone} aria-hidden="true">
          <span className={s.phoneBar}>
            <motion.i
              key={cur.s}
              initial={{ width: "0%" }}
              animate={{ width: visible ? "100%" : "0%" }}
              transition={{
                duration: cur.s * 0.45,
                ease: "linear",
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.8,
              }}
            />
          </span>
          <span className={s.phoneSkel} />
          <span className={s.phoneSkel} style={{ width: "70%" }} />
          <span className={s.phoneBlock} />
          <span className={s.phoneTime}>{cur.s} s</span>
        </div>
        <div className={s.readout}>
          <span className={s.big}>
            {cur.up ? "+" : ""}
            <Roll value={visible ? cur.up : 0} run ms={700} />
            <small>%</small>
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={cur.s}
              className={s.bigLabel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {cur.up
                ? `veća verovatnoća da posetilac ode kad se stranica učitava ${cur.s} s umesto 1 s`
                : "Polazna tačka: stranica koja se učita za jednu sekundu"}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className={s.slider}>
        <label htmlFor="v5-speed" className={b.srOnly}>
          Vreme učitavanja
        </label>
        <input
          id="v5-speed"
          type="range"
          min={0}
          max={STOPS.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className={s.range}
          style={{ "--p": `${pct}%` }}
          aria-valuetext={`${cur.s} sekundi`}
        />
        <div className={s.ticks}>
          {STOPS.map((x, k) => (
            <button
              key={x.s}
              type="button"
              onClick={() => setI(k)}
              data-on={k === i ? "true" : undefined}
            >
              {x.s} s
            </button>
          ))}
        </div>
        {yourPos != null
          ? <motion.span
              className={s.you}
              style={{ left: `${yourPos}%` }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {audit.host}: {audit.metrics.lcp.display}
            </motion.span>
          : null}
      </div>
      <p className={b.sourceDark}>
        Google / SOASTA Research, 2017: verovatnoća napuštanja mobilne stranice
        u odnosu na učitavanje za 1 sekundu.
        {yourPos == null
          ? " Proverite svoj sajt na vrhu stranice i ovde se pojavi vaše vreme."
          : ""}
      </p>
    </div>
  );
}

const FUNNEL = [
  { label: "Traže nešto u blizini, na telefonu", value: 100 },
  { label: "Posete firmu u roku od jednog dana", value: 76 },
  { label: "Pretraga se završi kupovinom", value: 28 },
];

function Local() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.4);
  return (
    <div ref={ref} className={s.local}>
      <div className={s.cardTop}>
        <span className={`${s.eyebrow} ${s.eyebrowLight}`}>
          <Pin size={13} /> Lokalna pretraga
        </span>
        <h3 className={s.cardTitle}>
          Tri od četiri dođu u roku od jednog dana
        </h3>
        <p className={s.cardBody}>
          Ljudi koji na telefonu traže uslugu u blizini ne istražuju nedeljama.
          Ko je tada na vrhu, dobija posao.
        </p>
      </div>
      <div className={s.funnel}>
        {FUNNEL.map((f, k) => (
          <div key={f.label} className={s.fRow}>
            <span className={s.fLabel}>{f.label}</span>
            <span className={s.fTrack}>
              <motion.i
                data-k={k}
                initial={{ width: 0 }}
                animate={{ width: visible ? `${f.value}%` : 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: k * 0.12 }}
              />
            </span>
            <b className={s.fValue}>
              <Roll value={visible ? f.value : 0} run ms={1000} suffix="%" />
            </b>
          </div>
        ))}
      </div>
      <p className={b.source}>
        Think with Google, istraživanje lokalne pretrage na telefonu, 2016.
      </p>
    </div>
  );
}

export default function Data() {
  return (
    <section className={b.sectionTight} data-theme="light">
      <span id="brojke" className={b.anchor} />
      <div className={b.container}>
        <div className={s.wrap}>
          <div className={s.head}>
            <Reveal>
              <Kicker tone="lime">Brojke</Kicker>
            </Reveal>
            <Reveal i={1} as="h2" className={b.h2}>
              Šta Google zna o vašim kupcima
            </Reveal>
            <Reveal i={2} as="p" className={s.intro}>
              Nismo ih mi izmislili. Ovo su podaci koje Google i nezavisne
              studije objavljuju o tome kako ljudi traže, čekaju i biraju.
            </Reveal>
          </div>
          <div className={s.grid}>
            <Speed />
            <Local />
          </div>
        </div>
      </div>
    </section>
  );
}
