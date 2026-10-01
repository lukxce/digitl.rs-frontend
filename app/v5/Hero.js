"use client";

import { motion } from "motion/react";
import elektromil from "../assets/clients/elektromil.webp";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import thermiq from "../assets/clients/thermiq.webp";
import b from "./base.module.css";
import GrowthField from "./GrowthField";
import h from "./hero.module.css";
import Quiz from "./Quiz";
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
  return (
    <div className={h.logos}>
      <span className={h.logosLabel}>50+ saradnji, među njima</span>
      <ul>
        {[...local, ...cms].map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
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
  const { scrollTo, book } = useApp();

  return (
    <section id="top" className={h.hero} data-section="Početak">
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
              onClick={() => scrollTo("#plan", -100)}
            >
              Tri pitanja za vaš plan
            </Btn>
          </div>
        </div>
      </div>

      <div className={h.land}>
        <GrowthField className={h.field} theme="light" horizon={0.6} />
      </div>

      <div className={`${b.container} ${h.quizWrap}`}>
        <Quiz clients={clients} />
      </div>

      <div className={b.container}>
        <Logos clients={clients} />
      </div>
    </section>
  );
}
