"use client";

import { motion } from "motion/react";
import elektromil from "../assets/clients/elektromil.webp";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import thermiq from "../assets/clients/thermiq.webp";
import b from "./base.module.css";
import HeroShowcase from "./HeroShowcase";
import h from "./hero.module.css";
import { Btn, EASE, useApp } from "./ui";

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
  const items = [...local, ...cms];
  // The strip runs on a loop: four identical copies, moved left by one copy
  // per cycle, so there is never a gap even on wide screens. Only the first
  // copy is read by screen readers.
  const row = (copy) =>
    items.map((l) => (
      <li key={`${copy}-${l.name}`} aria-hidden={copy > 0 || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.src} alt={copy > 0 ? "" : l.name} />
        {l.label ? <span>{l.name}</span> : null}
      </li>
    ));
  return (
    <motion.div
      className={h.logos}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className={h.logosLabel}>Izabrali su Digitl</span>
      <div className={h.rail}>
        <ul className={h.track}>{[0, 1, 2, 3].map((copy) => row(copy))}</ul>
      </div>
    </motion.div>
  );
}

export default function Hero({ clients, visual = null }) {
  const { scrollTo, book } = useApp();

  return (
    <section id="top" className={h.hero} data-section="Početak">
      <div className={`${b.container} ${h.top}`}>
        <div className={h.copy}>
          <p
            className={`${h.status} ${b.fadeUp}`}
            style={{ animationDelay: "40ms" }}
          >
            <span className={h.kind}>Full-Service marketing agencija</span>
            <span className={h.slots}>
              <span className={b.liveDot} />2 slobodna mesta
            </span>
          </p>
          <h1 className={`${b.display} ${h.title}`}>
            <Line delay={100}>Marketing koji</Line>
            <Line delay={170}>
              donosi <span className={h.accent}>prave</span>
            </Line>
            <Line delay={240}>
              <span className={h.accent}>rezultate.</span>
            </Line>
          </h1>
          <div className={b.fadeUp} style={{ animationDelay: "520ms" }}>
            <p className={h.lead}>
              Gradimo brendove koji se izdvajaju, konvertuju bolje i rastu brže.
              Sve što vaš biznis traži, na jednom mestu.
            </p>
            <div className={h.ctas}>
              <Btn variant="accent" onClick={() => book()}>
                Zakaži razgovor
              </Btn>
              <Btn
                variant="ghost"
                arrow={false}
                onClick={() => scrollTo("#rezultati")}
              >
                Naši projekti
              </Btn>
            </div>
          </div>
        </div>

        {/* one of our services, shown working: a different one on each visit */}
        <div className={h.search}>{visual ?? <HeroShowcase />}</div>
      </div>

      <div className={b.container}>
        <Logos clients={clients} />
      </div>
    </section>
  );
}
