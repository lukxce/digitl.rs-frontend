"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import elektromil from "../assets/clients/elektromil.webp";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import thermiq from "../assets/clients/thermiq.webp";
import b from "./base.module.css";
import GrowthField from "./GrowthField";
import h from "./hero.module.css";
import { Btn, EASE, useApp } from "./ui";

// Milestones from published case studies, pinned along the growth line.
const MILESTONES = [
  {
    at: 0.12,
    t: "Start: nevidljiv u pretrazi",
    s: "ThermiQ, pre",
    hideSm: true,
  },
  { at: 0.45, t: "1. mesec: prvi upiti sa pretrage", s: "ElektroMil" },
  {
    at: 0.72,
    t: "3. mesec: najveći izvor upita",
    s: "ElektroMil",
    hideSm: true,
  },
  {
    at: 0.95,
    t: "3.157 stranica u Google-u",
    s: "ThermiQ, za tri meseca",
    end: true,
  },
];

function Line({ delay, children }) {
  return (
    <span className={b.lineMask}>
      <span className={b.lineUp} style={{ animationDelay: `${delay}ms` }}>
        {children}
      </span>
    </span>
  );
}

function Logos({ clients }) {
  const local = [
    { src: thermiq.src, name: "ThermiQ" },
    { src: elektromil.src, name: "ElektroMil" },
    { src: primaDental.src, name: "Prima Dental" },
    { src: startupsRs.src, name: "Startups.rs" },
  ];
  const cms = clients
    .filter(
      (c) =>
        c.logo &&
        !local.some((l) => l.name.toLowerCase() === c.name.toLowerCase()),
    )
    .map((c) => ({ src: c.logo, name: c.name, label: true }));
  return (
    <div className={h.logos}>
      <span className={h.logosLabel}>50+ saradnji, među njima</span>
      <ul>
        {[...local, ...cms].map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.07, duration: 0.6, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.name} />
            {l.label ? <span>{l.name}</span> : null}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function Hero({ clients }) {
  const { openAudit, book } = useApp();
  const pins = useRef(null);

  return (
    <section id="top" className={h.hero} data-theme="light">
      <div className={`${b.container} ${h.copy}`}>
        <p
          className={`${h.status} ${b.fadeUp}`}
          style={{ animationDelay: "40ms" }}
        >
          <span className={b.liveDot} />
          <span className={h.statusLong}>
            Agencija za rast · Beograd / London ·
          </span>{" "}
          <b>2 slobodna mesta</b>
        </p>
        <h1 className={`${b.display} ${h.title}`}>
          <Line delay={100}>Marketing koji se meri</Line>
          <Line delay={190}>
            <span className={h.accent}>profitom,</span> ne aktivnošću.
          </Line>
        </h1>
        <div className={b.fadeUp} style={{ animationDelay: "520ms" }}>
          <p className={h.lead}>
            Strategija, oglasi, SEO, sajt i brend, vođeni kao jedan sistem za
            rast i mereni jednim brojem: koliko su vam doneli.
          </p>
          <div className={h.ctas}>
            <Btn variant="accent" size="lg" arrow onClick={() => book()}>
              Zakažite strateški razgovor
            </Btn>
            <Btn variant="ghost" size="lg" onClick={openAudit}>
              Proverite svoj sajt
            </Btn>
          </div>
        </div>
      </div>

      <div className={h.land}>
        <GrowthField
          className={h.field}
          theme="light"
          horizon={0.6}
          anchorRoot={pins}
        />
        <div ref={pins} className={h.pins} aria-hidden="true">
          {MILESTONES.map((m, i) => (
            <div
              key={m.t}
              data-at={m.at}
              className={`${h.pin} ${m.hideSm ? h.pinSm : ""} ${m.end ? h.pinEnd : ""}`}
              style={{ "--d": `${i * 160}ms` }}
            >
              <span className={h.chip}>
                <b>{m.t}</b>
                <span>{m.s}</span>
              </span>
              <i className={h.stem} />
              <i className={h.dot} />
            </div>
          ))}
        </div>
        <p className={h.landNote}>Prekretnice iz naših studija slučaja</p>
      </div>

      <div className={b.container}>
        <Logos clients={clients} />
      </div>
    </section>
  );
}
