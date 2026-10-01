"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import logo from "../assets/digitl-logo.png";
import n from "./nav.module.css";
import { SERVICES } from "./content";
import { Btn, EASE, useApp } from "./ui";

export const LINKS = [
  { href: "#usluge", label: "Usluge" },
  { href: "#proces", label: "Kako radimo" },
  { href: "#rezultati", label: "Rezultati" },
  { href: "#blog", label: "Blog" },
  { href: "#kontakt", label: "Kontakt" },
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

function Menu({ onClose }) {
  return (
    <motion.nav
      className={n.sheet}
      aria-label="Meni"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {LINKS.map((l) => (
        <a key={l.href} href={l.href} onClick={onClose}>
          {l.label}
        </a>
      ))}
    </motion.nav>
  );
}

/** A plain bar at the top that turns into a small pill and follows the page. */
export default function Nav() {
  const { book, plan } = useApp();
  const planLine = plan
    ? plan.top.map((id) => SERVICES.find((x) => x.id === id).name).join(" · ")
    : null;
  const [floating, setFloating] = useState(false);
  const [section, setSection] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setFloating(window.scrollY > window.innerHeight * 0.55);
      let cur = "";
      for (const el of document.querySelectorAll("[data-section]")) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.4)
          cur = el.dataset.section;
      }
      setSection(cur);
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

  return (
    <>
      <header className={n.bar}>
        <Logo />
        <nav className={n.links} aria-label="Glavna">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
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
          <button
            type="button"
            className={n.menuBtn}
            aria-expanded={open && !floating}
            onClick={() => setOpen((v) => !v)}
          >
            Meni
          </button>
        </div>
        <AnimatePresence>
          {open && !floating ? <Menu onClose={() => setOpen(false)} /> : null}
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
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${section}-${planLine ?? ""}`}
                  className={n.section}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                >
                  {planLine
                    ? <>
                        <b className={n.planChip}>Vaš plan</b> {planLine}
                      </>
                    : section}
                </motion.span>
              </AnimatePresence>
              <button
                type="button"
                className={n.pillMenu}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                Meni
              </button>
              <Btn
                variant="accent"
                size="sm"
                arrow={false}
                onClick={() => book()}
              >
                Zakažite
              </Btn>
              <AnimatePresence>
                {open ? <Menu onClose={() => setOpen(false)} /> : null}
              </AnimatePresence>
            </motion.div>
          : null}
      </AnimatePresence>
    </>
  );
}
