"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/digitl-logo.png";
import { Btn, Counter, EASE, Kicker, useVisible } from "./ui";
import s from "./v5.module.css";

const DWELL = 4800;

/** Real case studies cycling in a product window — the hero's proof. */
function CaseWindow({ clients }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [i, setI] = useState(0);
  const [touched, setTouched] = useState(false);
  const c = clients[i];

  useEffect(() => {
    if (!visible || touched || clients.length < 2) return;
    const id = setTimeout(() => setI((v) => (v + 1) % clients.length), DWELL);
    return () => clearTimeout(id);
  }, [visible, touched, i, clients.length]);

  if (!c) return null;

  return (
    <div ref={ref} className={s.heroStage}>
      <div className={s.heroPanel}>
        <span className={s.ghostCard1} aria-hidden="true" />
        <span className={s.ghostCard2} aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt="" className={s.panelMark} aria-hidden="true" />

        <div className={s.window}>
          <div className={s.windowHead}>
            <span className={s.windowDots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <div className={s.windowTabs} role="tablist" aria-label="Projekti">
              {clients.map((x, k) => (
                <button
                  key={x.slug}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  className={`${s.windowTab} ${k === i ? s.windowTabOn : ""}`}
                  onClick={() => {
                    setTouched(true);
                    setI(k);
                  }}
                >
                  {x.name}
                  {k === i && visible && !touched ? (
                    <motion.span
                      key={`p-${i}`}
                      className={s.windowTabBar}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: DWELL / 1000, ease: "linear" }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className={s.windowBody}>
            <AnimatePresence mode="wait">
              <motion.div
                key={c.slug}
                className={s.windowCase}
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className={s.windowCover}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.cover} alt={`Sajt za ${c.name}`} />
                </div>
                <div className={s.windowMeta}>
                  <span className={s.windowClient}>
                    {c.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.logo} alt="" />
                    ) : null}
                    <b>{c.name}</b>
                  </span>
                  <span className={s.windowCat}>{c.category}</span>
                </div>
                <div className={s.windowStats}>
                  {c.metrics.map((m) => (
                    <div key={m.label} className={s.tile}>
                      <b>
                        <Counter metric={m} run={visible} />
                      </b>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p className={s.source}>Brojevi iz studija slučaja na digitl.rs.</p>
    </div>
  );
}

function LogoChip({ clients }) {
  const logos = clients.filter((c) => c.logo).slice(0, 3);
  return (
    <span className={s.capChip} aria-hidden="true">
      {logos.map((c) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={c.slug} src={c.logo} alt="" />
      ))}
    </span>
  );
}

export default function Hero({ clients }) {
  const lines = [
    <>Marketing koji</>,
    <>
      donosi <LogoChip clients={clients} />
    </>,
    <span className={s.accentText}>prave rezultate.</span>,
  ];

  return (
    <section id="top" className={s.hero} data-theme="light">
      <span className={s.blobA} aria-hidden="true" />
      <span className={s.blobB} aria-hidden="true" />
      <div className={`${s.container} ${s.heroGrid}`}>
        <div className={s.heroCopy}>
          <span className={`${s.fadeUp}`} style={{ animationDelay: "40ms" }}>
            <Kicker dot>2 slobodna mesta</Kicker>
          </span>
          <h1 className={s.display}>
            {lines.map((line, i) => (
              <span key={i} className={s.lineMask}>
                <span className={s.lineUp} style={{ animationDelay: `${120 + i * 90}ms` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className={`${s.lead} ${s.fadeUp}`} style={{ animationDelay: "550ms" }}>
            Gradimo brendove koji se izdvajaju, konvertuju bolje i rastu brže. Oglasi, SEO,
            web, mreže i brend, kao jedan sistem.
          </p>
          <div className={`${s.heroCtas} ${s.fadeUp}`} style={{ animationDelay: "680ms" }}>
            <Btn href="#pregled" variant="accent" size="lg" arrow>
              Zakažite razgovor
            </Btn>
            <Btn href="#projekti" variant="ghost" size="lg">
              Naši projekti
            </Btn>
          </div>
          <a href="#pregled" className={`${s.tertiary} ${s.fadeUp}`} style={{ animationDelay: "780ms" }}>
            Ili besplatan pregled od 30 minuta, bez obaveze
          </a>
          <div className={`${s.heroMeta} ${s.fadeUp}`} style={{ animationDelay: "880ms" }}>
            <span>Beograd / London</span>
            <span className={s.metaDot} />
            <span>50+ uspešnih saradnji</span>
          </div>
        </div>

        <motion.div
          className={s.heroVisual}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
        >
          <CaseWindow clients={clients} />
        </motion.div>
      </div>
    </section>
  );
}
