"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { Check, Sparkle, X } from "./icons";
import s from "./manifesto.module.css";
import { EASE, Reveal, useVisible } from "./ui";

const MEASURE = [
  "Prihod i porudžbine",
  "Upiti i pozivi",
  "Cena po kupcu",
  "Pozicije na Google-u",
];
const NOT = ["Lajkovi", "Pratioci", "Broj objava", "„Doseg“"];

export default function Manifesto({ clients }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);

  return (
    <section className={s.section} data-theme="dark">
      <span className={s.glow} aria-hidden="true" />
      <Sparkle
        size={340}
        className={`${b.sparkleMark} ${b.spinSlow} ${s.spark}`}
      />
      <div className={`${b.container} ${s.grid}`}>
        <div className={s.copy}>
          <Reveal>
            <span className={s.kicker}>Zašto ovako radimo</span>
          </Reveal>
          <Reveal as="p" i={1} className={s.statement}>
            „Ne merimo koliko smo{" "}
            <span className={s.strikeWrap}>
              radili
              <motion.span
                className={s.strike}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
              />
            </span>
            . Merimo koliko ste zaradili.“
          </Reveal>
          <Reveal as="p" i={2} className={s.body}>
            Objave svaki dan, izveštaj od 40 strana i grafikon koji raste lako
            se naprave, i lepo izgledaju na sastanku. Ali vlasnik firme na kraju
            meseca gleda jednu stvar: koliko je novih ljudi pozvalo, pisalo ili
            kupilo.
          </Reveal>
          <Reveal as="p" i={3} className={s.body}>
            Zato na početku dogovorimo broj koji je vama bitan, i sve ostalo
            radimo za njega. Marketing koji se meri profitom, ne aktivnošću.
          </Reveal>
          <Reveal i={4} className={s.sign}>
            <span className={s.signLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt="" />
            </span>
            <span>
              <b>Digitl tim</b>
              <span>Beograd / London</span>
            </span>
          </Reveal>
        </div>

        <div ref={ref} className={s.side}>
          <div className={s.list}>
            <p className={s.listHead}>
              <Sparkle size={12} /> Šta merimo
            </p>
            {MEASURE.map((m, i) => (
              <motion.div
                key={m}
                className={s.row}
                initial={{ opacity: 0, x: 12 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
              >
                {m}
                <span className={s.yes}>
                  <Check size={12} strokeWidth={3} />
                </span>
              </motion.div>
            ))}
          </div>
          <div className={`${s.list} ${s.listNot}`}>
            <p className={s.listHead}>Šta ne prodajemo kao rezultat</p>
            {NOT.map((m, i) => (
              <motion.div
                key={m}
                className={s.row}
                initial={{ opacity: 0, x: 12 }}
                animate={visible ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: EASE }}
              >
                <span className={s.notText}>
                  {m}
                  <motion.i
                    initial={{ scaleX: 0 }}
                    animate={visible ? { scaleX: 1 } : {}}
                    transition={{
                      delay: 1 + i * 0.12,
                      duration: 0.5,
                      ease: EASE,
                    }}
                  />
                </span>
                <span className={s.no}>
                  <X size={12} strokeWidth={3} />
                </span>
              </motion.div>
            ))}
          </div>
          {clients.length
            ? <div className={s.thumbs}>
                {clients.slice(0, 3).map((c) => (
                  <a
                    key={c.slug}
                    href={c.href}
                    className={s.thumb}
                    aria-label={c.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.cover} alt="" loading="lazy" />
                  </a>
                ))}
              </div>
            : null}
        </div>
      </div>
    </section>
  );
}
