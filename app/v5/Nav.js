"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import logo from "../assets/digitl-logo.png";
import n from "./nav.module.css";
import { Btn, EASE, useApp } from "./ui";

// The page is one story; the bar shows where in it you are.
export const CHAPTERS = [
  { id: "usluge", n: "1", label: "Usluge" },
  { id: "sistem", n: "2", label: "Sistem" },
  { id: "rezultati", n: "3", label: "Rezultati" },
  { id: "pozicija", n: "4", label: "Zašto" },
  { id: "proces", n: "5", label: "Proces" },
  { id: "razgovor", n: "6", label: "Razgovor" },
];

export default function Nav() {
  const { book } = useApp();
  const [solid, setSolid] = useState(false);
  const [fill, setFill] = useState(() => CHAPTERS.map(() => 0));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setSolid(window.scrollY > 24);
      // Each chapter fills from its own top to the next chapter's top.
      const line = window.innerHeight * 0.45;
      const tops = CHAPTERS.map((c) => {
        const el = document.getElementById(c.id);
        return el
          ? el.getBoundingClientRect().top + window.scrollY
          : Number.POSITIVE_INFINITY;
      });
      const end =
        document.documentElement.scrollHeight - window.innerHeight * 0.6;
      const y = window.scrollY + line;
      setFill(
        tops.map((top, i) => {
          const next = tops[i + 1] ?? end;
          return Math.min(1, Math.max(0, (y - top) / Math.max(1, next - top)));
        }),
      );
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

  let current = -1;
  fill.forEach((v, i) => {
    if (v > 0) current = i;
  });

  return (
    <header className={`${n.bar} ${solid ? n.solid : ""}`}>
      <div className={n.inner}>
        <a href="#top" className={n.logo} aria-label="Digitl, na vrh">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" />
          <span>digitl</span>
        </a>

        <nav className={n.story} aria-label="Poglavlja">
          {CHAPTERS.map((c, i) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              data-on={i === current ? "true" : undefined}
              data-done={fill[i] >= 1 ? "true" : undefined}
            >
              <span className={n.label}>
                <i>{c.n}</i> {c.label}
              </span>
              <span className={n.track}>
                <span style={{ transform: `scaleX(${fill[i]})` }} />
              </span>
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
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {current >= 0
              ? `${CHAPTERS[current].n}/${CHAPTERS.length}`
              : "Meni"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open
          ? <motion.nav
              className={n.sheet}
              aria-label="Poglavlja"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {CHAPTERS.map((c, i) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  onClick={() => setOpen(false)}
                  data-on={i === current ? "true" : undefined}
                >
                  <i>{c.n}</i>
                  {c.label}
                </a>
              ))}
              <Btn
                variant="accent"
                size="md"
                arrow
                onClick={() => {
                  setOpen(false);
                  book();
                }}
              >
                Zakažite razgovor
              </Btn>
            </motion.nav>
          : null}
      </AnimatePresence>
    </header>
  );
}
