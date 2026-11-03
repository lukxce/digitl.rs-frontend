"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import Booking from "../_home/Booking";
import b from "../_home/base.module.css";
import { CONTACT } from "../_home/content";
import { ArrowRight, ArrowUpRight, Mail, Phone, Plus } from "../_home/icons";
import { AppProvider, Btn, EASE, useApp } from "../_home/ui";
import s from "./novi.module.css";

/* ── the frame both test pages share ─────────────────────────────────────
   The site's own tokens (base.module.css), a light page, the booking dialog,
   and a switch for the headline face: Manrope (the brand) or a serif. */

export function Shell({ fonts, children }) {
  const [face, setFace] = useState("sans");
  useEffect(() => {
    try {
      const v = localStorage.getItem("novi-face");
      if (v === "serif" || v === "sans") setFace(v);
    } catch {}
  }, []);
  const pick = (v) => {
    setFace(v);
    try {
      localStorage.setItem("novi-face", v);
    } catch {}
  };
  return (
    <div
      className={`${b.root} ${s.root} ${fonts}`}
      data-face={face}
      data-own-chrome
    >
      <AppProvider home={false}>
        <Nav />
        <main>{children}</main>
        <FooterCta />
        <Booking />
        <div className={s.faceSwitch} role="group" aria-label="Font naslova">
          <span>Naslovi</span>
          {[
            ["sans", "Manrope"],
            ["serif", "Serif"],
          ].map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={face === v}
              onClick={() => pick(v)}
            >
              {label}
            </button>
          ))}
        </div>
      </AppProvider>
    </div>
  );
}

const LINKS = [
  { href: "/novi#usluge", label: "Usluge" },
  { href: "/novi#projekti", label: "Projekti" },
  { href: "/novi#saradnja", label: "Saradnja" },
  { href: "/journal", label: "Blog" },
];

function Mark({ size = 26 }) {
  return (
    <span
      className={s.mark}
      style={{ width: size * 0.72, height: size }}
      aria-hidden="true"
    />
  );
}

function Nav() {
  const { openBooking } = useApp();
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={s.nav} data-solid={solid ? "true" : undefined}>
      <nav className={s.navLinks} aria-label="Glavni meni">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href="/novi" className={s.logo} aria-label="digitl, početna">
        <Mark />
        <span>digitl</span>
      </a>
      <div className={s.navRight}>
        <a href={CONTACT.en} className={s.navEn} hrefLang="en" lang="en">
          EN
        </a>
        <button
          type="button"
          className={s.navCta}
          onClick={() => openBooking()}
        >
          Zakažite razgovor
          <i className={s.liveDot} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}

/* ── motion helpers ───────────────────────────────────────────────────── */

/** Rises into place once, when it comes into view. */
export function Rise({
  as = "div",
  i = 0,
  className,
  children,
  y = 28,
  ...rest
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** A headline whose lines slide up out of a mask, one after another. The
    heading itself is watched, not the lines: a line waiting below its mask
    is clipped, so it would never count as being in view. */
export function Lines({
  lines,
  className,
  as = "h2",
  delay = 0,
  inView = true,
}) {
  const H = as;
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const show = inView ? seen : true;
  return (
    <H ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={s.lineMask}>
          <motion.span
            className={s.lineIn}
            initial={{ y: "105%" }}
            animate={{ y: show ? "0%" : "105%" }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.09 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </H>
  );
}

function Word({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={s.word}>
      {children}
    </motion.span>
  );
}

/** A statement that fills in word by word as the page scrolls past it. */
export function Statement({ text, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word
          key={`${w}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
        >
          {w}{" "}
        </Word>
      ))}
    </p>
  );
}

/* ── client quotes, stacked as the page scrolls ─────────────────────────
   No real quotes yet: every card says plainly that it is a slot. */

const QUOTES = [
  {
    text: "Ovde ide najjači citat klijenta: šta se promenilo u poslu posle saradnje, u dve ili tri rečenice, njegovim rečima.",
    name: "Ime i prezime",
    role: "Vlasnik, naziv firme",
  },
  {
    text: "Kraći citat: šta im je bilo najvažnije u saradnji.",
    name: "Ime i prezime",
    role: "Pozicija, naziv firme",
  },
  {
    text: "Kraći citat: jedan konkretan rezultat koji su primetili.",
    name: "Ime i prezime",
    role: "Pozicija, naziv firme",
  },
];
const TILT = [-2.2, 1.6, -1];

export function Reviews() {
  return (
    <section className={s.reviews} aria-labelledby="utisci">
      <div className={s.reviewsHead}>
        <Lines as="h2" lines={["Utisci"]} className={s.display2} />
      </div>
      <div className={s.reviewsStack}>
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.text}
            className={s.quote}
            style={{ top: `calc(30vh + ${i * 22}px)`, rotate: TILT[i] }}
            initial={{ opacity: 0, y: 80, rotate: TILT[i] * 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: TILT[i] }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <span className={s.slot}>Mesto za utisak klijenta</span>
            <blockquote>„{q.text}“</blockquote>
            <figcaption>
              <i aria-hidden="true" />
              <span>
                <b>{q.name}</b>
                <em>{q.role}</em>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/* ── questions ────────────────────────────────────────────────────────── */

export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  const { openBooking } = useApp();
  return (
    <section className={s.faq} aria-labelledby="pitanja">
      <div className={s.faqSide}>
        <Lines as="h2" lines={["Česta", "pitanja"]} className={s.display2} />
        <div className={s.faqCard}>
          <Mark size={30} />
          <p>Još neko pitanje?</p>
          <Btn variant="accent" size="sm" onClick={() => openBooking()}>
            Zakažite besplatan razgovor
          </Btn>
        </div>
      </div>
      <ul className={s.faqList}>
        {items.map((f, i) => {
          const on = open === i;
          return (
            <li key={f.q}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`novi-faq-${i}`}
                onClick={() => setOpen(on ? -1 : i)}
              >
                <span>{f.q}</span>
                <i data-on={on ? "true" : undefined}>
                  <Plus size={18} strokeWidth={2.2} />
                </i>
              </button>
              <AnimatePresence initial={false}>
                {on
                  ? <motion.div
                      id={`novi-faq-${i}`}
                      className={s.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── the closing card and the footer ──────────────────────────────────── */

const FOOT_SERVICES = [
  ["Plaćeno oglašavanje", "/novi/usluge/placeno-oglasavanje"],
  ["SEO", "/#usluge"],
  ["Web dizajn i razvoj", "/#usluge"],
  ["Društvene mreže", "/#usluge"],
  ["Brend i identitet", "/#usluge"],
];

function FooterCta() {
  const { openBooking } = useApp();
  return (
    <footer className={s.footer}>
      <div className={s.footCard}>
        <span className={s.footLabel}>Imate projekat na umu?</span>
        <div className={s.footTop}>
          <Lines as="p" lines={["Hajde da krenemo."]} className={s.footBig} />
          <button
            type="button"
            className={s.footBook}
            onClick={() => openBooking()}
          >
            <span className={s.footBookMark}>
              <Mark size={22} />
            </span>
            <span>
              <b>Zakažite besplatan razgovor od 30 minuta</b>
              <em>Razgovarate direktno sa ljudima koji rade posao</em>
            </span>
            <i>
              <ArrowUpRight size={18} />
            </i>
          </button>
        </div>
        <div className={s.footCols}>
          <div>
            <span>Usluge</span>
            {FOOT_SERVICES.map(([l, h]) => (
              <a key={l} href={h}>
                {l}
              </a>
            ))}
          </div>
          <div>
            <span>Digitl</span>
            <a href="/projects">Projekti</a>
            <a href="/journal">Blog</a>
            <a href="/#kontakt">Kontakt</a>
            <a href={CONTACT.en} hrefLang="en" lang="en">
              English
            </a>
          </div>
          <div>
            <span>Pratite nas</span>
            <a
              href="https://www.instagram.com/digitl.rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/digitl-rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/digitl_rs"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
          </div>
          <div>
            <span>Pišite ili pozovite</span>
            <a href={`mailto:${CONTACT.email}`} className={s.footMail}>
              <Mail size={16} /> {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.tel}`}>
              <Phone size={15} /> {CONTACT.phone}
            </a>
          </div>
        </div>
        <div className={s.footBase}>
          <span>© 2026 Digitl</span>
          <a href="/novi#">
            Na vrh <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
