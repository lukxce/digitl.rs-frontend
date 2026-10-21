"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import b from "./base.module.css";
import { Check } from "./icons";
import { Btn, EASE, Head, useApp, useVisible } from "./ui";
import v from "./value.module.css";

/* What a client gets: four promises, each with a small working interface
   instead of a picture. The words come from the brand's own lines (the
   Instagram set and the brand book), not new claims. */

const T = {
  label: "Šta dobijate",
  title: "Marketing koji može da se proveri.",
  intro: "Na ovo možete da računate kad radimo zajedno.",
  cta: "Zakažite razgovor",
  ctaNote: "Prvi razgovor je besplatan i ne obavezuje ni na šta.",
  cards: [
    {
      pill: "Jedan sistem",
      title: "Ceo marketing na jednom mestu.",
      text: "Oglasi, sajt, SEO, mreže i brend hrane jedni druge. Nema prebacivanja odgovornosti na drugu agenciju.",
    },
    {
      pill: "Proverljivo",
      title: "Broj dogovorimo pre početka.",
      text: "Upiti, prodaja ili cena po upitu. Svakog meseca dobijate izveštaj: gde je taj broj, šta ga je pomerilo i šta menjamo.",
    },
    {
      pill: "Iskreni rokovi",
      title: "Kažemo koliko se čeka.",
      text: "Oglasi daju podatke za dve nedelje. SEO traži dva kvartala. Krećemo od onoga što vam je hitnije.",
    },
    {
      pill: "Direktno",
      title: "Pričate sa ljudima koji rade posao.",
      text: "Bez posrednika koji prenosi poruke. Pitanje stiže pravo do onih koji vode vaše kampanje i sajt.",
    },
  ],
  hub: ["Oglasi", "SEO", "Sajt", "Mreže", "Brend"],
  report: {
    head: "Mesečni izveštaj",
    metric: "Upiti sa sajta",
    source: "Izvor: Google Analytics",
    months: ["jul", "avg", "sep", "okt"],
  },
  wait: [
    ["Oglasi", "2 nedelje"],
    ["SEO", "2 kvartala"],
  ],
  waitScale: ["danas", "1. kvartal", "2. kvartal"],
  chat: {
    them: "Možemo li da pojačamo oglase pred sezonu?",
    us: "Može. Šaljem vam predlog budžeta.",
    who: "Vaša firma",
  },
};

/* 1 · one system: the five services feed the middle */
const HUB = [
  [50, 14],
  [88, 40],
  [76, 86],
  [24, 86],
  [12, 40],
];
function Hub({ run }) {
  return (
    <div className={v.hub}>
      <svg
        className={v.hubLines}
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
              className={v.pulse}
              initial={{ left: `${x}%`, top: `${y}%`, opacity: 0 }}
              animate={{
                left: [`${x}%`, "50%"],
                top: [`${y}%`, "52%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.2,
                delay: 0.6 + i * 0.42,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 0.4,
                ease: "easeInOut",
                opacity: { times: [0, 0.15, 0.8, 1], duration: 2.2 },
              }}
            />
          ))
        : null}
      <motion.span
        className={v.core}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={run ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <i />
      </motion.span>
      {HUB.map(([x, y], i) => (
        <motion.span
          key={T.hub[i]}
          className={v.node}
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0, y: 8 }}
          animate={run ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: EASE }}
        >
          {T.hub[i]}
        </motion.span>
      ))}
    </div>
  );
}

/* 2 · checkable: the agreed number, month by month, with its source */
// drawn in the chart's own proportions, so the line keeps an even stroke
const LINE =
  "M8 56 C60 53 90 47 128 44 C170 40 186 30 222 25 C252 21 272 15 292 8";
function Report({ run }) {
  return (
    <div className={v.report}>
      <div className={v.reportHead}>
        <span>
          <b>{T.report.head}</b>
          <em>{T.report.metric}</em>
        </span>
        <span className={v.up}>
          <Check size={12} strokeWidth={3} />
        </span>
      </div>
      <svg
        className={v.chart}
        viewBox="0 0 300 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {[16, 32, 48].map((y) => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} className={v.grid} />
        ))}
        <motion.path
          d={`${LINE} L292 64 L8 64 Z`}
          className={v.area}
          initial={{ opacity: 0 }}
          animate={{ opacity: run ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.path
          d={LINE}
          className={v.line}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: run ? 1 : 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className={v.months}>
        {T.report.months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
      <span className={v.source}>{T.report.source}</span>
    </div>
  );
}

/* 3 · honest timelines: ads answer fast, SEO takes its time */
function Wait({ run }) {
  return (
    <div className={v.wait}>
      {T.wait.map(([name, time], i) => (
        <div key={name} className={v.waitRow}>
          <span className={v.waitName}>{name}</span>
          <span className={v.track}>
            <motion.i
              data-k={i}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: run ? 1 : 0 }}
              transition={{
                duration: i === 0 ? 0.9 : 2.6,
                ease: i === 0 ? EASE : "linear",
                delay: 0.3,
              }}
            />
            <motion.span
              className={v.waitTime}
              data-k={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: run ? 1 : 0 }}
              transition={{ delay: i === 0 ? 1.1 : 2.9, duration: 0.4 }}
            >
              {time}
            </motion.span>
          </span>
        </div>
      ))}
      <div className={v.scale}>
        {T.waitScale.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
    </div>
  );
}

/* 4 · direct: a question, and the answer from the people doing the work */
function Chat({ run }) {
  return (
    <div className={v.chat}>
      <motion.div
        className={v.them}
        initial={{ opacity: 0, y: 10 }}
        animate={run ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
      >
        <span className={v.who}>{T.chat.who}</span>
        <p>{T.chat.them}</p>
      </motion.div>
      <div className={v.reply}>
        <motion.div
          className={v.typing}
          initial={{ opacity: 0 }}
          animate={run ? { opacity: [0, 1, 1, 0] } : {}}
          transition={{ delay: 0.8, duration: 1.4, times: [0, 0.15, 0.85, 1] }}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
        </motion.div>
        <motion.div
          className={v.us}
          initial={{ opacity: 0, y: 10 }}
          animate={run ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2.1, duration: 0.5, ease: EASE }}
        >
          <span className={v.who}>
            <i className={v.mark} /> digitl
          </span>
          <p>{T.chat.us}</p>
        </motion.div>
      </div>
    </div>
  );
}

const ART = [Hub, Report, Wait, Chat];

function Card({ c, i }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.45);
  const Art = ART[i];
  return (
    <motion.article
      ref={ref}
      className={v.card}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay: (i % 2) * 0.08 }}
    >
      <div className={v.stage}>
        <span className={v.pill}>{c.pill}</span>
        <Art run={run} />
      </div>
      <div className={v.copy}>
        <h3>{c.title}</h3>
        <p>{c.text}</p>
      </div>
    </motion.article>
  );
}

export default function Value() {
  const { openBooking } = useApp();
  return (
    <section
      className={`${b.section} ${v.section}`}
      data-section="Šta dobijate"
    >
      <div className={b.container}>
        <Head
          id="sta-dobijate"
          label={T.label}
          title={T.title}
          intro={T.intro}
          center
        />
        <div className={v.grid}>
          {T.cards.map((c, i) => (
            <Card key={c.pill} c={c} i={i} />
          ))}
        </div>
        <div className={v.cta}>
          <Btn variant="accent" onClick={() => openBooking()}>
            {T.cta}
          </Btn>
          <span>{T.ctaNote}</span>
        </div>
      </div>
    </section>
  );
}
