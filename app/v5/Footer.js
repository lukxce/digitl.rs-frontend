"use client";

import { motion } from "motion/react";
import logo from "../assets/digitl-logo.png";
import { Btn, EASE, Kicker } from "./ui";
import s from "./v5.module.css";

export default function Footer() {
  return (
    <footer className={s.footer} data-theme="dark">
      <div className={s.container}>
        <div className={s.ctaBand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" className={s.panelWatermark} aria-hidden="true" />
          <div>
            <Kicker dark dot>
              2 slobodna mesta
            </Kicker>
            <motion.h2
              className={s.h2}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              Prvi korak traje 30 minuta.
            </motion.h2>
            <p className={s.paleBody}>Pogledamo brojeve, kažemo šta je prioritet, a šta može da čeka.</p>
          </div>
          <div className={s.ctaBandActions}>
            <Btn href="#pregled" variant="white" size="lg" arrow>
              Zakažite razgovor
            </Btn>
            <Btn href="mailto:hello@digitl.rs" variant="glass" size="lg">
              hello@digitl.rs
            </Btn>
          </div>
        </div>

        <div className={s.footRow}>
          <nav className={s.footLinks} aria-label="Podnožje">
            <a href="#usluge">Usluge</a>
            <a href="/projects">Projekti</a>
            <a href="/journal">Blog</a>
            <a href="#pregled">Kontakt</a>
          </nav>
          <span className={s.footMeta}>Beograd / London</span>
        </div>

        <motion.div
          className={s.wordmark}
          aria-hidden="true"
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          digitl
        </motion.div>
        <div className={s.copyright}>© 2026 Digitl. Full-Service marketing agencija.</div>
      </div>
    </footer>
  );
}
