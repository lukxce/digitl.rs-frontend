"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import logo from "../assets/digitl-logo.png";
import { IconInstagram, IconLinkedin, IconX } from "../components/socialIcons";
import { CONTACT } from "./content";
import { ArrowRight, ArrowUpRight, Lock, Mail, Phone } from "./icons";
import n from "./nav.module.css";
import { Btn, EASE, useApp } from "./ui";

export const LINKS = [
  { href: "#usluge", label: "Usluge" },
  { href: "#proces", label: "Kako radimo" },
  { href: "#rezultati", label: "Rezultati" },
  { href: "#blog", label: "Blog" },
  { href: "#kontakt", label: "Kontakt" },
];

export const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/digitl.rs",
    Icon: IconInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/digitl-rs",
    Icon: IconLinkedin,
  },
  { label: "X", href: "https://x.com/digitl_rs", Icon: IconX },
];

function Logo() {
  return (
    <a href="#top" className={n.logo} aria-label="Digitl, na vrh">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" />
      <span>digitl</span>
    </a>
  );
}

/** The menu panel: pages on the left, how to reach us on the right. */
function Menu({ onClose, onBook, onGo }) {
  return (
    <motion.div
      className={n.sheet}
      role="dialog"
      aria-label="Meni"
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className={n.sheetMain}>
        <nav className={n.sheetLinks} aria-label="Stranica">
          {LINKS.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                onClose();
                onGo(e, l.href);
              }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 + i * 0.04,
                duration: 0.35,
                ease: EASE,
              }}
            >
              {l.label}
              <ArrowRight size={15} />
            </motion.a>
          ))}
        </nav>
        <a className={n.login} href={CONTACT.hub}>
          <span className={n.loginIcon}>
            <Lock size={16} />
          </span>
          <span className={n.loginText}>
            <b>Prijava za klijente</b>
            <small>Izveštaji, odobrenja i zahtevi</small>
          </span>
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className={n.sheetSide}>
        <span className={n.status}>
          <i /> 2 slobodna mesta
        </span>
        <a className={n.contact} href={`mailto:${CONTACT.email}`}>
          <span>
            <Mail size={16} />
          </span>
          <b>{CONTACT.email}</b>
        </a>
        <a className={n.contact} href={`tel:${CONTACT.tel}`}>
          <span>
            <Phone size={16} />
          </span>
          <b>{CONTACT.phone}</b>
        </a>
        <div className={n.socials}>
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>
        <Btn
          variant="accent"
          size="sm"
          onClick={() => {
            onClose();
            onBook();
          }}
        >
          Zakažite razgovor
        </Btn>
        <span className={n.city}>Beograd / London</span>
      </div>
    </motion.div>
  );
}

/** A plain bar at the top that turns into a small pill and follows the page. */
export default function Nav() {
  const { book, scrollTo } = useApp();
  // in-page links glide instead of jumping (Lenis is off on phones)
  const go = (e, href) => {
    e.preventDefault();
    scrollTo(href);
  };
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setFloating(window.scrollY > window.innerHeight * 0.55);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const menuBtn = (cls) => (
    <button
      type="button"
      className={cls}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      <span className={n.burger} data-open={open ? "true" : undefined}>
        <i />
        <i />
      </span>
      Meni
    </button>
  );

  return (
    <>
      <header className={n.bar}>
        <Logo />
        <nav className={n.links} aria-label="Glavna">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className={n.actions}>
          <Btn
            variant="accent"
            size="sm"
            onClick={() => book()}
            className={n.cta}
          >
            Zakažite razgovor
          </Btn>
          {menuBtn(n.menuBtn)}
        </div>
        <AnimatePresence>
          {open && !floating
            ? <Menu onClose={() => setOpen(false)} onBook={book} onGo={go} />
            : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {floating
          ? <motion.div
              className={n.pill}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Logo />
              <nav className={n.pillLinks} aria-label="Brze veze">
                {LINKS.slice(0, 4).map((l) => (
                  <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
                    {l.label}
                  </a>
                ))}
              </nav>
              <span className={n.pillIcons}>
                <a href={`tel:${CONTACT.tel}`} aria-label="Pozovite">
                  <Phone size={15} />
                </a>
                <a href={`mailto:${CONTACT.email}`} aria-label="Pišite nam">
                  <Mail size={15} />
                </a>
              </span>
              {menuBtn(n.pillMenu)}
              <Btn
                variant="accent"
                size="sm"
                arrow={false}
                onClick={() => book()}
              >
                Zakažite
              </Btn>
              <AnimatePresence>
                {open
                  ? <Menu
                      onClose={() => setOpen(false)}
                      onBook={book}
                      onGo={go}
                    />
                  : null}
              </AnimatePresence>
            </motion.div>
          : null}
      </AnimatePresence>
    </>
  );
}
