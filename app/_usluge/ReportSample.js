"use client";

import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { EASE } from "../_home/ui";
import s from "./report.module.css";

/* A sample monthly report for Google Ads and Meta, labelled as a sample
   (first built for the /novi paid-ads test). Its numbers are an
   illustration, not a client's results. It tilts back while low on the
   screen and lies flat as it comes up; counters roll from 0 on view. */

function Roll({ to, decimals = 0, prefix = "", suffix = "", run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run || !ref.current) return;
    const fmt = (v) =>
      prefix +
      v.toLocaleString("sr-Latn-RS", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;
    const c = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt(v);
      },
    });
    return () => c.stop();
  }, [run, to, decimals, prefix, suffix]);
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

const KPI = [
  { label: "Klikovi", to: 8940, delta: "+24%" },
  { label: "Upiti", to: 386, delta: "+41%" },
  {
    label: "Stopa konverzije",
    to: 4.3,
    decimals: 1,
    suffix: "%",
    delta: "+0,9 p.p.",
  },
  {
    label: "Cena po upitu",
    to: 31,
    prefix: "-",
    suffix: "%",
    delta: "u odnosu na prošli kvartal",
    good: true,
  },
];
const BARS = [
  [34, 14],
  [40, 17],
  [37, 15],
  [48, 21],
  [45, 20],
  [56, 26],
  [52, 24],
  [63, 30],
  [60, 29],
  [72, 36],
  [78, 40],
  [86, 45],
];

export default function ReportSample() {
  const wrap = useRef(null);
  const inView = useInView(wrap, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start end", "start 0.25"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  return (
    <div className={s.dashPersp}>
      <motion.div
        ref={wrap}
        className={s.dash}
        style={{ rotateX, scale }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE }}
        aria-label="Primer mesečnog izveštaja za Google Ads i Meta kampanje"
        role="img"
      >
        <div className={s.dashMain}>
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span>
                <em>Primer izveštaja</em>
                <b>Google Ads · Meta</b>
              </span>
              <span className={s.chip}>Poslednjih 90 dana</span>
            </div>
            <div className={s.kpis}>
              {KPI.map((k) => (
                <div key={k.label} className={s.kpi}>
                  <em>{k.label}</em>
                  <b>
                    <Roll
                      to={k.to}
                      decimals={k.decimals}
                      prefix={k.prefix}
                      suffix={k.suffix}
                      run={inView}
                    />
                  </b>
                  <small data-good={k.good ? "true" : undefined}>
                    {k.delta}
                  </small>
                </div>
              ))}
            </div>
            <div className={s.chartLegend}>
              <span>
                <i data-k="a" /> Klikovi
              </span>
              <span>
                <i data-k="b" /> Upiti
              </span>
            </div>
            <div className={s.bars}>
              {BARS.map(([a, c], i) => (
                <span key={i} className={s.barPair}>
                  <motion.i
                    data-k="a"
                    initial={{ height: 0 }}
                    animate={{ height: inView ? `${a}%` : 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.3 + i * 0.05,
                    }}
                  />
                  <motion.i
                    data-k="b"
                    initial={{ height: 0 }}
                    animate={{ height: inView ? `${c}%` : 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.38 + i * 0.05,
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className={s.panelRow}>
            <div className={s.panel}>
              <b className={s.panelTitle}>Raspodela kanala</b>
              <div className={s.donutRow}>
                <svg
                  viewBox="0 0 120 120"
                  className={s.donut}
                  aria-hidden="true"
                >
                  <circle cx="60" cy="60" r="44" className={s.donutBase} />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="44"
                    className={s.donutA}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 0.62 : 0 }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
                  />
                </svg>
                <ul className={s.donutKey}>
                  <li>
                    <i data-k="a" /> Google pretraga <b>62%</b>
                  </li>
                  <li>
                    <i data-k="b" /> Meta <b>38%</b>
                  </li>
                </ul>
              </div>
            </div>
            <div className={s.panel}>
              <b className={s.panelTitle}>Cena po upitu</b>
              <span className={s.chipGood}>-31% od optimizacije</span>
              <svg viewBox="0 0 220 70" className={s.cpl} aria-hidden="true">
                <motion.path
                  d="M4 14 C40 16 56 22 80 30 C104 38 120 36 144 46 C168 56 188 56 216 60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: inView ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={s.dashSide}>
          <div className={s.panel}>
            <b className={s.panelTitle}>Primeri oglasa</b>
            <div className={s.searchAd}>
              <span className={s.sponsored}>
                <i>Sponzorisano</i> digitl.rs/usluge
              </span>
              <b>Digitl | Marketing koji donosi prave rezultate</b>
              <p>
                Oglasi, SEO, sajt i brend na jednom mestu. Zakažite besplatan
                razgovor.
              </p>
              <span className={s.sitelinks}>
                <i>Plaćeno oglašavanje</i>
                <i>SEO</i>
                <i>Web dizajn</i>
              </span>
            </div>
            <div className={s.metaAd}>
              <span className={s.metaHead}>
                <i className={s.metaAvatar} />
                <span>
                  <b>digitl</b>
                  <em>Sponzorisano</em>
                </span>
              </span>
              <div className={s.metaCreative}>
                <b>Kampanje koje dovode kupce, ne samo klikove.</b>
                <span className={s.metaBtn}>Saznajte više</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <p className={s.caption}>
        Primer izveštaja. Brojevi su ilustracija, ne rezultat klijenta.
      </p>
    </div>
  );
}
