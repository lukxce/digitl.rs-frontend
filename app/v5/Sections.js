"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Audit from "./Audit";
import b from "./base.module.css";
import { FAQ, NEVER, STEPS } from "./content";
import { Plus } from "./icons";
import x from "./sections.module.css";
import { EASE, Head, useVisible } from "./ui";

/* ── Provera sajta: the live PageSpeed check ──────────────────────────── */
export function Check() {
  return (
    <section className={`${b.section} ${x.check}`} data-section="Provera sajta">
      <div className={b.container}>
        <Head
          center
          id="provera-naslov"
          label="Besplatna provera"
          title="Koliko je brz vaš sajt?"
          intro="Isti test kojim Google ocenjuje sajtove na telefonu. Za dvadesetak sekundi vidite ocenu, šta kasni i šta bismo prvo popravili."
        />
        <div className={x.console}>
          <Audit />
        </div>
      </div>
    </section>
  );
}

/* ── Kako radimo: four steps, each with its own small scene ─────────────── */
const STEP_MS = 3600;

function SceneTalk() {
  return (
    <span className={x.sTalk}>
      <span className={x.bubbleQ}>Kako vas ljudi nađu?</span>
      <span className={x.bubbleA}>Preko preporuke, uglavnom.</span>
      <span className={x.typing}>
        <i />
        <i />
        <i />
      </span>
    </span>
  );
}
function ScenePlan() {
  return (
    <span className={x.sPlan}>
      {["Sajt koji prodaje", "SEO za glavne usluge", "Google oglasi"].map(
        (t) => (
          <span key={t} className={x.task}>
            <i />
            {t}
          </span>
        ),
      )}
    </span>
  );
}
function SceneLaunch() {
  return (
    <span className={x.sLaunch}>
      <span className={x.launchBar}>
        <i />
      </span>
      <span className={x.launchLive}>
        <span className={b.liveDot} /> Uživo
      </span>
    </span>
  );
}
function SceneOpt() {
  return (
    <span className={x.sOpt}>
      {[40, 64, 30, 88].map((h, k) => (
        <i
          key={k}
          style={{ height: `${h}%` }}
          data-best={k === 3 ? "true" : undefined}
        />
      ))}
      <em>Budžet ide ovde</em>
    </span>
  );
}
const SCENES = [SceneTalk, ScenePlan, SceneLaunch, SceneOpt];

export function Steps() {
  const ref = useRef(null);
  const run = useVisible(ref, 0.35);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (!run || held) return;
    const t = setTimeout(
      () => setActive((v) => (v + 1) % STEPS.length),
      STEP_MS,
    );
    return () => clearTimeout(t);
  }, [run, held, active]);

  return (
    <section className={b.section} data-section="Kako radimo">
      <div className={b.container}>
        <Head
          id="proces"
          label="Kako radimo"
          title="Četiri koraka, bez iznenađenja."
          intro="Jedan povezan proces, od prvog razgovora do izveštaja. Znate šta radimo i zašto, u svakom koraku."
        />
        <ol ref={ref} className={x.steps} onPointerLeave={() => setHeld(false)}>
          {STEPS.map(([t, d], i) => {
            const Scene = SCENES[i];
            const on = i === active;
            return (
              <motion.li
                key={t}
                data-on={on ? "true" : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={run ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse") return;
                  setHeld(true);
                  setActive(i);
                }}
                onClick={() => {
                  setHeld(true);
                  setActive(i);
                }}
              >
                <span className={x.stepTop}>
                  <span className={x.stepNo}>{i + 1}</span>
                  <span className={x.stepTrack}>
                    {on && run && !held
                      ? <motion.i
                          key={`p-${active}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: STEP_MS / 1000,
                            ease: "linear",
                          }}
                        />
                      : <i
                          style={{
                            transform: `scaleX(${i < active || (on && held) ? 1 : 0})`,
                          }}
                        />}
                  </span>
                </span>
                <span className={x.scene} key={on ? `on-${active}` : "off"}>
                  <Scene />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ── Nećete čuti od nas: the bento card, as a band ─────────────────────── */
export function Never() {
  const ref = useRef(null);
  const run = useVisible(ref, 0.5);
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const id = setInterval(() => setLit((v) => (v + 1) % NEVER.length), 1600);
    return () => clearInterval(id);
  }, [run]);
  return (
    <section
      ref={ref}
      className={x.never}
      aria-label="Reči koje nećete čuti od nas"
    >
      <div className={`${b.container} ${x.neverInner}`}>
        <span className={x.neverLabel}>Nećete čuti od nas</span>
        <ul className={x.words}>
          {NEVER.map((w, i) => (
            <li key={w} data-lit={i === lit ? "true" : undefined}>
              <span>{w}</span>
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: run ? 1 : 0 }}
                transition={{
                  delay: 0.2 + i * 0.12,
                  duration: 0.5,
                  ease: EASE,
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Pitanja ──────────────────────────────────────────────────────────── */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={b.section} data-section="Pitanja">
      <div className={`${b.container} ${x.faq}`}>
        <Head
          id="pitanja"
          label="Pitanja"
          title="Pre prvog razgovora."
          intro="Kratki, iskreni odgovori. Za sve ostalo: hello@digitl.rs"
        />
        <ul className={x.faqList}>
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <i className={on ? x.plusOn : ""}>
                    <Plus size={16} strokeWidth={2.4} />
                  </i>
                </button>
                <AnimatePresence initial={false}>
                  {on
                    ? <motion.div
                        id={`faq-${i}`}
                        className={x.answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <p>{f.a}</p>
                      </motion.div>
                    : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
