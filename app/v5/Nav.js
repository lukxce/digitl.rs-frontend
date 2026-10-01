"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import logo from "../assets/digitl-logo.png";
import { Btn, EASE } from "./ui";
import s from "./v5.module.css";

export const SECTIONS = [
  { id: "usluge", chapter: "01", label: "Usluge" },
  { id: "zasto", chapter: "02", label: "Zašto mi" },
  { id: "projekti", chapter: "03", label: "Projekti" },
  { id: "proces", chapter: "04", label: "Kako radimo" },
  { id: "pitanja", chapter: "05", label: "Pitanja" },
  { id: "pregled", chapter: "06", label: "Pregled" },
];

function Logo({ dark }) {
  return (
    <a href="#top" className={s.navLogo} aria-label="Digitl, na vrh">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" style={dark ? { filter: "invert(1)" } : undefined} />
      <span>digitl</span>
    </a>
  );
}

export default function Nav() {
  const [floating, setFloating] = useState(false);
  const [current, setCurrent] = useState(null);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setFloating(window.scrollY > window.innerHeight * 0.55);
      // The section under the pill sets its theme and the chapter label.
      const probe = 44;
      let theme = "light";
      for (const el of document.querySelectorAll("[data-theme]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) theme = el.dataset.theme;
      }
      setDark(theme === "dark");
      let cur = null;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = sec.id;
      }
      setCurrent(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const cur = SECTIONS.find((x) => x.id === current);

  return (
    <>
      <header className={s.topbar}>
        <Logo />
        <nav className={s.topLinks} aria-label="Glavna">
          {SECTIONS.slice(0, 5).map((x) => (
            <a key={x.id} href={`#${x.id}`}>
              {x.label}
            </a>
          ))}
        </nav>
        <div className={s.topActions}>
          <Btn href="#pregled" variant="accent" size="sm">
            Zakažite razgovor
          </Btn>
          <button type="button" className={s.menuBtn} onClick={() => setOpen(true)}>
            Meni
          </button>
        </div>
      </header>

      <AnimatePresence>
        {floating ? (
          <motion.div
            className={`${s.pill} ${dark ? s.pillDark : ""}`}
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Logo dark={dark} />
            <div className={s.pillMid}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={cur?.id ?? "none"}
                  className={s.pillChapter}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  {cur ? (
                    <>
                      <b>{cur.chapter}</b> {cur.label}
                    </>
                  ) : (
                    "Digitl"
                  )}
                </motion.span>
              </AnimatePresence>
              <span className={s.dashes} aria-hidden="true">
                {SECTIONS.map((x) => (
                  <i
                    key={x.id}
                    className={
                      SECTIONS.findIndex((y) => y.id === x.id) <=
                      SECTIONS.findIndex((y) => y.id === current)
                        ? s.dashOn
                        : ""
                    }
                  />
                ))}
              </span>
            </div>
            <button type="button" className={s.pillMenu} onClick={() => setOpen(true)}>
              Meni
            </button>
            <Btn href="#pregled" variant={dark ? "white" : "accent"} size="sm">
              Zakažite
            </Btn>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            className={s.menu}
            role="dialog"
            aria-modal="true"
            aria-label="Meni"
            initial={{ clipPath: "circle(0% at 50% 0%)" }}
            animate={{ clipPath: "circle(150% at 50% 0%)" }}
            exit={{ clipPath: "circle(0% at 50% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className={s.menuTop}>
              <Logo dark />
              <button type="button" className={s.menuClose} onClick={() => setOpen(false)}>
                Zatvori
              </button>
            </div>
            <nav className={s.menuLinks}>
              {SECTIONS.map((x, i) => (
                <motion.a
                  key={x.id}
                  href={`#${x.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                >
                  <span>{x.chapter}</span>
                  {x.label}
                </motion.a>
              ))}
            </nav>
            <div className={s.menuFoot}>
              <Btn href="#pregled" variant="white" size="lg" onClick={() => setOpen(false)}>
                Zakažite razgovor
              </Btn>
              <a href="mailto:hello@digitl.rs">hello@digitl.rs</a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
