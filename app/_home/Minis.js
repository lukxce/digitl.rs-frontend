"use client";

import { motion } from "motion/react";
import { Check } from "./icons";
import m from "./minis.module.css";
import { EASE } from "./ui";

/* Four small working interfaces, one per step of "Kako radimo": the first
   conversation, the plan in time, every channel live at once, the monthly
   report. Each fills the box it is put in; `run` plays it, `dark` is for
   the dark card of the current step. */

const T = {
  chat: {
    who: "Vaša firma",
    them: "Imamo sajt, ali upita je malo.",
    us: "Pogledaćemo brojeve i reći vam šta radi, a šta ne.",
  },
  wait: [
    ["Oglasi", "2 nedelje"],
    ["SEO", "2 kvartala"],
  ],
  waitScale: ["danas", "1. kvartal", "2. kvartal"],
  hub: ["Oglasi", "SEO", "Sajt", "Mreže", "Brend"],
  report: {
    head: "Mesečni izveštaj",
    metric: "Upiti sa sajta",
    source: "Izvor: Google Analytics",
  },
};

const dk = (dark) => (dark ? "" : undefined);

/* 1 · the first conversation */
export function Chat({ run, dark }) {
  return (
    <div className={m.chat} data-dark={dk(dark)}>
      <motion.div
        className={m.them}
        initial={{ opacity: 0, y: 8 }}
        animate={run ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15, duration: 0.45, ease: EASE }}
      >
        <span className={m.who}>{T.chat.who}</span>
        <p>{T.chat.them}</p>
      </motion.div>
      <div className={m.reply}>
        <motion.div
          className={m.typing}
          initial={{ opacity: 0 }}
          animate={run ? { opacity: [0, 1, 1, 0] } : {}}
          transition={{ delay: 0.6, duration: 1.2, times: [0, 0.15, 0.85, 1] }}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
        </motion.div>
        <motion.div
          className={m.us}
          initial={{ opacity: 0, y: 8 }}
          animate={run ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.7, duration: 0.45, ease: EASE }}
        >
          <span className={m.who}>
            <i className={m.mark} /> digitl
          </span>
          <p>{T.chat.us}</p>
        </motion.div>
      </div>
    </div>
  );
}

/* 2 · the plan in time: ads answer fast, SEO takes its time */
export function Wait({ run, dark }) {
  return (
    <div className={m.wait} data-dark={dk(dark)}>
      {T.wait.map(([name, time], i) => (
        <div key={name} className={m.waitRow}>
          <span className={m.waitName}>{name}</span>
          <span className={m.track}>
            <motion.i
              data-k={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: run ? 1 : 0 }}
              transition={{
                duration: i === 0 ? 0.8 : 2.2,
                ease: i === 0 ? EASE : "linear",
                delay: 0.25,
              }}
            />
            <motion.span
              className={m.waitTime}
              data-k={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: run ? 1 : 0 }}
              transition={{ delay: i === 0 ? 0.9 : 2.4, duration: 0.35 }}
            >
              {time}
            </motion.span>
          </span>
        </div>
      ))}
      <div className={m.scale}>
        {T.waitScale.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* 3 · every channel live, all feeding the same place */
const HUB = [
  [50, 17],
  [85, 42],
  [74, 82],
  [26, 82],
  [15, 42],
];
export function Hub({ run, dark }) {
  return (
    <div className={m.hub} data-dark={dk(dark)}>
      <svg
        className={m.hubLines}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {HUB.map(([x, y], i) => (
          <line key={T.hub[i]} x1={x} y1={y} x2="50" y2="52" />
        ))}
      </svg>
      {run
        ? HUB.map(([x, y], i) => (
            <motion.i
              key={T.hub[i]}
              className={m.pulse}
              initial={{ left: `${x}%`, top: `${y}%`, opacity: 0 }}
              animate={{
                left: [`${x}%`, "50%"],
                top: [`${y}%`, "52%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 0.5 + i * 0.38,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.4,
                ease: "easeInOut",
              }}
            />
          ))
        : null}
      <motion.span
        className={m.core}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={run ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <i />
      </motion.span>
      {HUB.map(([x, y], i) => (
        <motion.span
          key={T.hub[i]}
          className={m.node}
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, y: 6 }}
          animate={run ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
        >
          {T.hub[i]}
        </motion.span>
      ))}
    </div>
  );
}

/* 4 · the monthly report: the agreed number, with its source */
// drawn in the chart's own proportions, so the line keeps an even stroke
const LINE =
  "M6 40 C40 38 64 33 90 31 C120 28 132 21 158 17 C180 14 196 10 214 5";
export function Report({ run, dark }) {
  return (
    <div className={m.report} data-dark={dk(dark)}>
      <div className={m.reportHead}>
        <span>
          <b>{T.report.head}</b>
          <em>{T.report.metric}</em>
        </span>
        <span className={m.up}>
          <Check size={11} strokeWidth={3} />
        </span>
      </div>
      <svg
        className={m.chart}
        viewBox="0 0 220 46"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[12, 24, 36].map((y) => (
          <line key={y} x1="0" x2="220" y1={y} y2={y} className={m.grid} />
        ))}
        <motion.path
          d={`${LINE} L214 46 L6 46 Z`}
          className={m.area}
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
        />
        <motion.path
          d={LINE}
          className={m.line}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
        />
      </svg>
      <span className={m.source}>{T.report.source}</span>
    </div>
  );
}
