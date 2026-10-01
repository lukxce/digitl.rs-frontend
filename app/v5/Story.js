"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { Check, X } from "./icons";
import s from "./story.module.css";
import { Btn, EASE, SectionHead, useApp, useVisible } from "./ui";

/* Five people each run a piece of the marketing and each report looks good;
   nobody owns revenue. Flip the switch and the same five pieces become one
   loop, run by one team and measured by one number. */

const NODES = [
  {
    vendor: "Dizajner za brend",
    claim: "Novi logo je gotov",
    stage: "Strategija",
    body: "Gde je novac: koji proizvodi, koji kupci i koji kanali vrede ulaganja. Brend i poruka slede iz toga.",
    uses: ["Pozicioniranje", "Brend"],
    metric: "Marža po kanalu",
  },
  {
    vendor: "Agencija za oglase",
    claim: "CTR 3,4%",
    stage: "Akvizicija",
    body: "Google, Meta i SEO dovode prave ljude, ne samo mnogo ljudi.",
    uses: ["Google oglasi", "Meta", "SEO"],
    metric: "Cena po upitu",
  },
  {
    vendor: "Studio za sajt",
    claim: "Sajt je lansiran",
    stage: "Konverzija",
    body: "Sajt koji posetu pretvara u upit ili porudžbinu: brz, jasan, sa cenom pre poziva.",
    uses: ["Sajt", "E-commerce"],
    metric: "Stopa konverzije",
  },
  {
    vendor: "Neko za mreže",
    claim: "+1.200 pratilaca",
    stage: "Skaliranje",
    body: "Ono što donosi novac dobija veći budžet i novu kreativu. Ono što ne donosi, gasi se.",
    uses: ["Kreativa", "Budžet"],
    metric: "Povrat na ulaganje",
  },
  {
    vendor: "SEO frilenser",
    claim: "+40 ključnih reči",
    stage: "Merenje",
    body: "Jedan izveštaj, jedan broj i jasna odluka o sledećem krugu.",
    uses: ["Analitika", "Izveštaj"],
    metric: "Prihod po kanalu",
  },
];
const N = NODES.length;

// Scattered positions (percent of the stage) for the "before" picture.
const SCATTER = {
  wide: [
    [15, 24],
    [82, 20],
    [86, 74],
    [17, 80],
    [50, 89],
  ],
  tall: [
    [30, 7],
    [70, 18],
    [72, 82],
    [30, 93],
    [32, 29],
  ],
};

function useLayout() {
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setTall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return tall
    ? { key: "tall", W: 1000, H: 1500, R: 330 }
    : { key: "wide", W: 1000, H: 560, R: 226 };
}

const round = (v) => Math.round(v * 100) / 100;

export default function Story() {
  const { book } = useApp();
  const L = useLayout();
  const ref = useRef(null);
  const visible = useVisible(ref, 0.45);
  const [joined, setJoined] = useState(false);
  const [touched, setTouched] = useState(false);
  const [step, setStep] = useState(0);
  const active = step % N;
  const [picked, setPicked] = useState(false);

  // The story turns by itself the first time the stage is on screen.
  useEffect(() => {
    if (!visible || touched || joined) return;
    const t = setTimeout(() => setJoined(true), 3200);
    return () => clearTimeout(t);
  }, [visible, touched, joined]);

  useEffect(() => {
    if (!joined || !visible || picked) return;
    const t = setTimeout(() => setStep((v) => v + 1), 3000);
    return () => clearTimeout(t);
  }, [joined, visible, picked, step]);

  const cx = L.W / 2;
  const cy = L.H / 2;
  const ringPos = (i) => {
    const a = ((-90 + (360 / N) * i) * Math.PI) / 180;
    return [round(cx + L.R * Math.cos(a)), round(cy + L.R * Math.sin(a))];
  };
  const toPct = ([x, y]) => [(x / L.W) * 100, (y / L.H) * 100];
  const cur = NODES[active];

  return (
    <section className={s.section} data-theme="light">
      <div className={b.container}>
        <SectionHead
          id="sistem"
          kicker="Sistem"
          title="Pet problema obično znači pet dobavljača."
          intro="Svako šalje svoj izveštaj i svaki izgleda dobro, ali niko ne odgovara za prihod. Mi istih pet stvari vodimo kao jedan krug."
        />

        <div className={s.switchRow}>
          <button
            type="button"
            className={s.switch}
            aria-pressed={joined}
            onClick={() => {
              setTouched(true);
              setJoined((v) => !v);
            }}
          >
            <span data-on={!joined ? "true" : undefined}>Rascepkano</span>
            <span className={s.knob} aria-hidden="true">
              <motion.i
                layout
                transition={{ duration: 0.45, ease: EASE }}
                style={{ marginLeft: joined ? "auto" : 0 }}
              />
            </span>
            <span data-on={joined ? "true" : undefined}>Jedan sistem</span>
          </button>
        </div>

        <div
          ref={ref}
          className={`${s.stage} ${joined ? s.joined : ""}`}
          style={{ aspectRatio: `${L.W} / ${L.H}` }}
        >
          <svg
            className={s.svg}
            viewBox={`0 0 ${L.W} ${L.H}`}
            aria-hidden="true"
          >
            {/* before: every line to revenue is broken */}
            {NODES.map((_, i) => {
              const [px, py] = SCATTER[L.key][i];
              const x = (px / 100) * L.W;
              const y = (py / 100) * L.H;
              return (
                <motion.line
                  key={`l${i}`}
                  x1={x}
                  y1={y}
                  x2={cx}
                  y2={cy}
                  className={s.broken}
                  initial={false}
                  animate={{ opacity: joined ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              );
            })}
            {/* after: one ring with a runner going round */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={L.R}
              className={s.ring}
              initial={false}
              animate={{ pathLength: joined ? 1 : 0, opacity: joined ? 1 : 0 }}
              transition={{
                duration: 1.2,
                ease: EASE,
                delay: joined ? 0.35 : 0,
              }}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
            {joined
              ? <motion.g
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: step * (360 / N), opacity: 1 }}
                  transition={{ duration: 1, ease: EASE }}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={L.R + 16}
                    fill="none"
                    stroke="none"
                  />
                  <circle
                    cx={cx}
                    cy={cy - L.R}
                    r="16"
                    className={s.runnerGlow}
                  />
                  <circle cx={cx} cy={cy - L.R} r="7" className={s.runner} />
                </motion.g>
              : null}
          </svg>

          {NODES.map((nd, i) => {
            const [left, top] = joined ? toPct(ringPos(i)) : SCATTER[L.key][i];
            const on = joined && i === active;
            return (
              <motion.button
                key={nd.vendor}
                type="button"
                className={`${s.node} ${on ? s.nodeOn : ""}`}
                initial={false}
                animate={{
                  left: `${left}%`,
                  top: `${top}%`,
                  rotate: joined ? 0 : [-4, 3, -2, 4, -3][i],
                }}
                transition={{
                  duration: 0.9,
                  ease: EASE,
                  delay: joined ? i * 0.06 : 0,
                }}
                onClick={() => {
                  if (!joined) {
                    setTouched(true);
                    setJoined(true);
                  }
                  setPicked(true);
                  // Always travel forward round the ring.
                  setStep((v) => v - (v % N) + i + (i < v % N ? N : 0));
                }}
                aria-pressed={on}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {joined
                    ? <motion.span
                        key="stage"
                        className={s.nodeIn}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <i>0{i + 1}</i>
                        <b>{nd.stage}</b>
                      </motion.span>
                    : <motion.span
                        key="vendor"
                        className={s.nodeIn}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      >
                        <b>{nd.vendor}</b>
                        <em>
                          <Check size={11} strokeWidth={3} /> {nd.claim}
                        </em>
                      </motion.span>}
                </AnimatePresence>
              </motion.button>
            );
          })}

          <div className={s.center}>
            <AnimatePresence mode="wait" initial={false}>
              {joined
                ? <motion.div
                    key={`stage-${active}`}
                    className={s.detail}
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className={s.detailTag}>
                      Korak {active + 1} od {N}
                    </span>
                    <b>{cur.stage}</b>
                    <p>{cur.body}</p>
                    <span className={s.uses}>
                      {cur.uses.map((u) => (
                        <i key={u}>{u}</i>
                      ))}
                    </span>
                    <em>
                      Merimo: <strong>{cur.metric}</strong>
                    </em>
                  </motion.div>
                : <motion.div
                    key="revenue"
                    className={s.revenue}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <span className={s.revIcon}>
                      <X size={18} strokeWidth={3} />
                    </span>
                    <b>Prihod</b>
                    <p>Ko je odgovoran?</p>
                  </motion.div>}
            </AnimatePresence>
          </div>

          <span className={s.note}>
            {joined
              ? "Isti posao, jedan tim, jedan broj"
              : "Ilustracija: tipični izveštaji dobavljača"}
          </span>
        </div>

        <div className={s.after}>
          <p>
            <b>Kad jedan tim vodi ceo krug,</b> svaki kanal se meri istim
            brojem, i novac ide tamo gde donosi najviše.
          </p>
          <Btn
            variant="ink"
            size="md"
            arrow
            onClick={() => book("Ceo marketing")}
          >
            Razgovarajmo o vašem krugu
          </Btn>
        </div>
      </div>
    </section>
  );
}
