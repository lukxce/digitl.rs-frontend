"use client";

import { motion } from "motion/react";
import elektromil from "../assets/clients/elektromil.webp";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import thermiq from "../assets/clients/thermiq.webp";
import b from "./base.module.css";
import SearchClimb from "./SearchClimb";
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
  // Phones get the row twice so it can loop without a seam; the copy is
  // hidden from screen readers and from wide screens.
  const row = (copy) =>
    items.map((l) => (
      <li
        key={`${copy ? "b" : "a"}-${l.name}`}
        aria-hidden={copy || undefined}
        data-copy={copy ? "true" : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.src} alt={copy ? "" : l.name} />
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
      <span className={h.logosLabel}>50+ saradnji, među njima</span>
      <div className={h.rail}>
        <ul className={h.track}>
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Hero({ clients }) {
  const { scrollTo, book } = useApp();

  return (
    <section id="top" className={h.hero} data-section="Početak">
      <div className={`${b.container} ${h.top}`}>
        <div className={h.copy}>
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
            <Line delay={100}>Marketing koji se</Line>
            <Line delay={170}>
              meri <span className={h.accent}>profitom,</span>
            </Line>
            <Line delay={240}>ne aktivnošću.</Line>
          </h1>
          <div className={b.fadeUp} style={{ animationDelay: "520ms" }}>
            <p className={h.lead}>
              Oglasi, SEO, sajt, mreže i brend, vođeni kao jedan sistem i mereni
              jednim brojem: koliko su vam doneli.
            </p>
            <div className={h.ctas}>
              <Btn variant="accent" onClick={() => book()}>
                Zakažite razgovor
              </Btn>
              <Btn
                variant="ghost"
                arrow={false}
                onClick={() => scrollTo("#vas-plan")}
              >
                Tri pitanja za vaš plan
              </Btn>
            </div>
          </div>
        </div>

        {/* your site climbing a search to #1; type your own business and city */}
        <div className={h.search}>
          <SearchClimb />
        </div>
      </div>

      <div className={b.container}>
        <Logos clients={clients} />
      </div>
    </section>
  );
}
