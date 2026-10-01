"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { SERVICES } from "./content";
import { ArrowLeft, ArrowRight, Check } from "./icons";
import j from "./journey.module.css";
import { EASE, Roll, useApp, useVisible } from "./ui";

const DWELL = 7500;

/* ── the four deliverables, each a small working screen ────────────────── */
const AUDIT = [
  ["Brzina na telefonu", "Sporo", "bad"],
  ["Google profil", "Nepotpun", "ok"],
  ["Stranice usluga", "Sve na jednoj", "bad"],
  ["Praćenje upita", "Ne postoji", "bad"],
  ["Konkurencija", "Dva jaka sajta", "ok"],
];
function AuditScreen() {
  return (
    <div className={j.screen}>
      <div className={j.docHead}>
        <b>Audit · vasafirma.rs</b>
        <span>Korak 1</span>
      </div>
      <ul className={j.audit}>
        {AUDIT.map(([k, v, tone], i) => (
          <motion.li
            key={k}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.18, duration: 0.45, ease: EASE }}
          >
            <span>{k}</span>
            <em data-tone={tone}>{v}</em>
          </motion.li>
        ))}
      </ul>
      <div className={j.verdicts}>
        <motion.div
          className={j.vGood}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.45, ease: EASE }}
        >
          <b>Radi</b>
          <span>Preporuke i stari klijenti</span>
        </motion.div>
        <motion.div
          className={j.vBad}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.45, ease: EASE }}
        >
          <b>Ne radi</b>
          <span>Sajt ne vodi do upita</span>
        </motion.div>
      </div>
    </div>
  );
}

const CHANNELS = [
  ["Sajt i SEO", 40, "a"],
  ["Google oglasi", 35, "b"],
  ["Meta", 25, "c"],
];
function PlanScreen() {
  return (
    <div className={j.screen}>
      <div className={j.docHead}>
        <b>Plan rasta</b>
        <span>Korak 2</span>
      </div>
      <div className={j.priorities}>
        <span className={j.miniLabel}>Prioriteti, po redu</span>
        {[
          "Ubrzati sajt i dodati stranicu za svaku uslugu",
          "Uvesti praćenje poziva i formi",
          "Pokrenuti Google oglase za glavne usluge",
        ].map((t, i) => (
          <motion.span
            key={t}
            className={j.prio}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.25, duration: 0.45, ease: EASE }}
          >
            <b>{i + 1}</b>
            {t}
          </motion.span>
        ))}
      </div>
      <div className={j.split}>
        <span className={j.miniLabel}>Kanali i budžet</span>
        <span className={j.splitBar}>
          {CHANNELS.map(([k, v, c], i) => (
            <motion.i
              key={k}
              data-s={c}
              initial={{ width: 0 }}
              animate={{ width: `${v}%` }}
              transition={{ delay: 1 + i * 0.15, duration: 0.7, ease: EASE }}
            />
          ))}
        </span>
        <span className={j.legend}>
          {CHANNELS.map(([k, v, c]) => (
            <span key={k}>
              <i data-s={c} /> {k} {v}%
            </span>
          ))}
        </span>
      </div>
      <motion.div
        className={j.goal}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 0.45, ease: EASE }}
      >
        <span className={j.miniLabel}>Broj koji pratimo</span>
        <b>Upiti mesečno i cena po upitu</b>
      </motion.div>
    </div>
  );
}

const LEADS = [
  "Upit · forma na sajtu",
  "Poziv · Google oglas",
  "Poruka · Instagram",
  "Upit · Google pretraga",
];
function LaunchScreen() {
  const [on, setOn] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setOn(1), 500),
      setTimeout(() => setOn(2), 1000),
    ];
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <div className={`${j.screen} ${j.launchGrid}`}>
      <div className={j.campaigns}>
        <span className={j.miniLabel}>Kampanje</span>
        {[
          ["Google pretraga", "usluga + grad"],
          ["Meta", "kupci u blizini"],
        ].map(([n, d], i) => (
          <div key={n} className={j.camp}>
            <span>
              <b>{n}</b>
              <em>{d}</em>
            </span>
            <span className={j.toggle} data-on={on > i ? "true" : undefined}>
              <i />
            </span>
          </div>
        ))}
        <div className={j.track}>
          <span className={j.miniLabel}>Praćenje</span>
          <span className={j.trackRow}>
            <Check size={12} strokeWidth={3} /> Pozivi
          </span>
          <span className={j.trackRow}>
            <Check size={12} strokeWidth={3} /> Forme
          </span>
          <span className={j.trackRow}>
            <Check size={12} strokeWidth={3} /> Poruke
          </span>
        </div>
      </div>
      <div className={j.inbox}>
        <span className={j.inboxHead}>
          <b>Novi upiti</b>
          <i className={b.liveDot} />
        </span>
        {LEADS.map((l, i) => (
          <motion.span
            key={l}
            className={j.lead}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4 + i * 0.7, duration: 0.45, ease: EASE }}
          >
            <i />
            {l}
            <em>sada</em>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

const MONTHS = [
  { m: "Mesec 1", a: 22, b: 30, c: 10 },
  { m: "Mesec 2", a: 34, b: 32, c: 16 },
  { m: "Mesec 3", a: 50, b: 34, c: 22 },
];
function ReportScreen() {
  return (
    <div className={`${j.screen} ${j.reportGrid}`}>
      <div className={j.chart}>
        <span className={j.miniLabel}>Upiti po izvoru</span>
        <div className={j.cols}>
          {MONTHS.map((x, i) => (
            <div key={x.m} className={j.col}>
              <span className={j.stack}>
                {[
                  ["a", x.a],
                  ["b", x.b],
                  ["c", x.c],
                ].map(([k, v], n) => (
                  <motion.i
                    key={k}
                    data-s={k}
                    initial={{ height: 0 }}
                    animate={{ height: `${v}%` }}
                    transition={{
                      delay: 0.2 + i * 0.2 + n * 0.08,
                      duration: 0.7,
                      ease: EASE,
                    }}
                  />
                ))}
              </span>
              <em>{x.m}</em>
            </div>
          ))}
        </div>
        <span className={j.legend}>
          <span>
            <i data-s="a" /> Pretraga
          </span>
          <span>
            <i data-s="b" /> Preporuke
          </span>
          <span>
            <i data-s="c" /> Oglasi
          </span>
        </span>
      </div>
      <div className={j.decisions}>
        {[
          ["Radi", "Stranice usluga donose najviše upita.", "good"],
          ["Gasimo", "Kampanja na mrežama bez upita.", "bad"],
          ["Sledeće", "Nova stranica za uslugu sa najviše pretraga.", "next"],
        ].map(([k, t, tone], i) => (
          <motion.div
            key={k}
            className={j.decision}
            data-tone={tone}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.25, duration: 0.45, ease: EASE }}
          >
            <b>{k}</b>
            <span>{t}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const STEPS = [
  {
    name: "Razumevanje",
    tab: "audit",
    body: "Analiziramo biznis, ciljeve i dosadašnje brojeve da vidimo šta radi, a šta ne.",
    get: [
      "Audit sajta, oglasa i profila",
      "Pregled konkurencije",
      "Šta radi, a šta ne",
    ],
    Screen: AuditScreen,
  },
  {
    name: "Planiranje",
    tab: "plan",
    body: "Postavljamo prioritete, kanale i jasan plan rasta.",
    get: ["Prioriteti po redu", "Kanali i budžet", "Broj koji pratimo"],
    Screen: PlanScreen,
  },
  {
    name: "Lansiranje",
    tab: "kampanje",
    body: "Pokrećemo, testiramo i skaliramo ono što zarađuje.",
    get: ["Sajt i kampanje uživo", "Praćenje poziva i formi", "Prvi upiti"],
    Screen: LaunchScreen,
  },
  {
    name: "Optimizacija",
    tab: "izveštaj",
    body: "Jasni izveštaji i konkretne odluke o sledećem koraku.",
    get: ["Mesečni izveštaj", "Šta gasimo, a šta pojačavamo", "Sledeći korak"],
    Screen: ReportScreen,
  },
];

export default function Journey() {
  const { plan } = useApp();
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const running = visible && !held;

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setStep((v) => (v + 1) % STEPS.length), DWELL);
    return () => clearTimeout(t);
  }, [running, step]);

  const cur = STEPS[step];
  const { Screen } = cur;
  const planNames = plan
    ? plan.top.map((id) => SERVICES.find((x) => x.id === id).name)
    : null;

  return (
    <section className={`${b.section} ${j.section}`} data-section="Kako radimo">
      <div ref={ref} className={`${b.container} ${j.wrap}`}>
        <span id="proces" className={b.anchor} />
        <div className={j.left}>
          <div className={j.intro4}>
            <span className={j.four} aria-hidden="true">
              <Roll value={visible ? 4 : 0} ms={1400} />
            </span>
            <div className={j.introText}>
              <span className={b.label}>Kako radimo</span>
              <p>
                <b>Jedan povezan proces</b> koji drži strategiju, egzekuciju i
                rezultate u istom pravcu, <b>od početka do kraja.</b>
              </p>
            </div>
          </div>

          <ol className={j.steps} role="tablist" aria-label="Koraci">
            {STEPS.map((s, i) => {
              const on = i === step;
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    className={j.step}
                    data-on={on ? "true" : undefined}
                    onClick={() => {
                      setHeld(true);
                      setStep(i);
                    }}
                  >
                    <span className={j.stepNo}>{i + 1}</span>
                    <span className={j.stepMain}>
                      <b>{s.name}</b>
                      <AnimatePresence initial={false}>
                        {on
                          ? <motion.span
                              key="d"
                              className={j.stepMore}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.45, ease: EASE }}
                            >
                              <span className={j.stepBody}>{s.body}</span>
                              <span className={j.chips}>
                                {s.get.map((g) => (
                                  <i key={g}>
                                    <Check size={11} strokeWidth={3} /> {g}
                                  </i>
                                ))}
                              </span>
                            </motion.span>
                          : null}
                      </AnimatePresence>
                    </span>
                    {on
                      ? null
                      : <span className={j.stepGo} aria-hidden="true">
                          <ArrowRight size={15} />
                        </span>}
                    {on
                      ? <span className={j.progress}>
                          <motion.i
                            key={`${step}-${running}`}
                            initial={{ scaleX: running ? 0 : 1 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: running ? DWELL / 1000 : 0.3,
                              ease: running ? "linear" : EASE,
                            }}
                          />
                        </span>
                      : null}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className={j.controls}>
            <button
              type="button"
              className={j.ctrl}
              aria-label="Prethodni korak"
              onClick={() => {
                setHeld(true);
                setStep((v) => (v + STEPS.length - 1) % STEPS.length);
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              className={j.next}
              onClick={() => {
                setHeld(true);
                setStep((v) => (v + 1) % STEPS.length);
              }}
            >
              Sledeći korak: {STEPS[(step + 1) % STEPS.length].name}
              <span>
                <ArrowRight size={15} />
              </span>
            </button>
          </div>
        </div>

        <div className={j.window}>
          <div className={j.winHead}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="" />
            <span className={j.winTitle}>
              {planNames ? "Vaš projekat" : "Primer projekta"}
            </span>
            <span className={j.winPlan}>
              {(planNames ?? ["Web", "Plaćeno oglašavanje", "SEO"]).map((p) => (
                <i key={p}>{p}</i>
              ))}
            </span>
          </div>
          <div className={j.tabs}>
            {STEPS.map((s, i) => (
              <button
                key={s.tab}
                type="button"
                data-on={i === step ? "true" : undefined}
                onClick={() => {
                  setHeld(true);
                  setStep(i);
                }}
              >
                {s.tab}
              </button>
            ))}
          </div>
          <div className={j.stage}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className={j.stageInner}
                initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
