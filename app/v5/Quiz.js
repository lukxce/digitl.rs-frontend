"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { QUIZ, SERVICES, makePlan } from "./content";
import { ArrowLeft, ArrowRight, Rotate } from "./icons";
import q from "./quiz.module.css";
import { Btn, Counter, EASE, useApp } from "./ui";

/* Three taps, one plan. Left: the question. Right: the plan assembling live,
   five services whose bars grow with every answer, then the closest case. */

const LETTERS = ["A", "B", "C", "D", "E"];

function scoresFor(answers) {
  const score = Object.fromEntries(SERVICES.map((s) => [s.id, 0]));
  answers.forEach((id, i) => {
    const o = QUIZ[i].options.find((x) => x.id === id);
    for (const [k, v] of Object.entries(o?.w ?? {})) score[k] += v;
  });
  return score;
}

export default function Quiz({ clients }) {
  const { plan, setPlan, book, scrollTo } = useApp();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const done = Boolean(plan);

  // The field in the hero grows with every answer (see GrowthRibbon).
  const grow = (level, done = false) =>
    window.dispatchEvent(
      new CustomEvent("v5:grow", { detail: { level, done } }),
    );
  const choose = (id) => {
    const next = [...answers.slice(0, step), id];
    setAnswers(next);
    grow(next.length / QUIZ.length, step === QUIZ.length - 1);
    if (step < QUIZ.length - 1) setStep(step + 1);
    else setPlan(makePlan(next));
  };
  const restart = () => {
    setPlan(null);
    setAnswers([]);
    setStep(0);
    grow(0);
  };

  const score = scoresFor(done ? answers : answers.slice(0, step));
  const max = Math.max(8, ...Object.values(score));
  const order = [...SERVICES].sort((a, b) => score[b.id] - score[a.id]);
  const started = Object.values(score).some((v) => v > 0);
  const first = QUIZ[0].options.find((o) => o.id === answers[0]);
  const match = first ? clients.find((c) => c.slug === first.match) : null;
  const metric = match?.metrics?.[0];
  const cur = QUIZ[step];

  return (
    <div id="plan" className={q.card} data-flipped={done ? "true" : undefined}>
      {/* left: the question, or the verdict */}
      <div className={q.ask}>
        <div className={q.top}>
          <span className={q.label}>
            {done
              ? "Vaš plan je spreman"
              : `Pitanje ${step + 1} od ${QUIZ.length}`}
          </span>
          <span className={q.progress} aria-hidden="true">
            {QUIZ.map((x, i) => (
              <i key={x.id}>
                <motion.b
                  initial={false}
                  animate={{
                    scaleX: done || i < step ? 1 : i === step ? 0.35 : 0,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </i>
            ))}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {!done
            ? <motion.div
                key={cur.id}
                className={q.question}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h3>{cur.q}</h3>
                <div className={q.options} role="group" aria-label={cur.q}>
                  {cur.options.map((o, i) => (
                    <motion.button
                      key={o.id}
                      type="button"
                      className={q.option}
                      data-on={answers[step] === o.id ? "true" : undefined}
                      onClick={() => choose(o.id)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.05,
                        duration: 0.4,
                        ease: EASE,
                      }}
                    >
                      <span className={q.letter}>{LETTERS[i]}</span>
                      <span className={q.optText}>{o.label}</span>
                      <ArrowRight size={15} />
                    </motion.button>
                  ))}
                </div>
                <div className={q.foot}>
                  {step > 0
                    ? <button
                        type="button"
                        className={q.back}
                        onClick={() => setStep(step - 1)}
                      >
                        <ArrowLeft size={14} /> Nazad
                      </button>
                    : <span className={q.hint}>Bez mejla i bez prijave.</span>}
                </div>
              </motion.div>
            : <motion.div
                key="done"
                className={q.verdict}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <p className={q.gap}>{plan.gap}</p>
                <p className={q.gapSub}>
                  Krenuli bismo od{" "}
                  <b>
                    {SERVICES.find(
                      (s) => s.id === plan.top[0],
                    ).name.toLowerCase()}
                  </b>
                  , a usluge ispod su poređane po vašim odgovorima.
                </p>
                <div className={q.actions}>
                  <Btn variant="accent" size="sm" onClick={() => book()}>
                    Pošaljite nam ovaj plan
                  </Btn>
                  <button
                    type="button"
                    className={q.again}
                    onClick={() => scrollTo("#usluge")}
                  >
                    Pogledajte usluge
                  </button>
                  <button type="button" className={q.again} onClick={restart}>
                    <Rotate size={13} /> Ispočetka
                  </button>
                </div>
              </motion.div>}
        </AnimatePresence>
      </div>

      {/* right: the plan assembling live */}
      <div className={q.live} aria-live="polite">
        {done
          ? <div className={q.mVerdict}>
              <p>{plan.gap}</p>
              <div className={q.mActions}>
                <Btn variant="accent" size="sm" onClick={() => book()}>
                  Pošaljite nam plan
                </Btn>
                <button type="button" className={q.again} onClick={restart}>
                  <Rotate size={13} /> Ispočetka
                </button>
              </div>
            </div>
          : null}
        <div className={q.liveHead}>
          <span>Vaš plan</span>
          <em>
            {done
              ? "Gotov"
              : started
                ? "Slaže se dok odgovarate"
                : "Odgovorite i gledajte"}
          </em>
        </div>
        <ul className={q.bars}>
          {order.map((s) => {
            const rank = done ? plan.top.indexOf(s.id) : -1;
            const w = started ? Math.max(4, (score[s.id] / max) * 100) : 0;
            return (
              <motion.li
                key={s.id}
                layout
                transition={{ layout: { duration: 0.6, ease: EASE } }}
                data-top={rank >= 0 ? "true" : undefined}
              >
                <span className={q.barName}>
                  {rank >= 0 ? <b className={q.rank}>{rank + 1}</b> : null}
                  {s.name}
                </span>
                <span className={q.track}>
                  <motion.i
                    className={started ? "" : q.idle}
                    initial={false}
                    animate={{ width: `${w}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </span>
              </motion.li>
            );
          })}
        </ul>

        <AnimatePresence>
          {match
            ? <motion.a
                key={match.slug}
                href={match.href}
                className={q.match}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className={q.matchImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={match.cover} alt="" />
                </span>
                <span className={q.matchText}>
                  <em>Najsličniji projekat</em>
                  <b>{match.name}</b>
                  {metric
                    ? <span>
                        <strong>
                          <Counter metric={metric} />
                        </strong>{" "}
                        {metric.label}
                      </span>
                    : null}
                </span>
                <ArrowRight size={15} />
              </motion.a>
            : <motion.p
                key="wait"
                className={q.matchWait}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Posle prvog odgovora ovde se pojavi projekat najsličniji vašem.
              </motion.p>}
        </AnimatePresence>
      </div>
    </div>
  );
}
