"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Plus } from "../_home/icons";
import { EASE, useApp } from "../_home/ui";
import s from "./article.module.css";

/** The section being read: the last heading that has passed the top third. */
function useCurrent(items) {
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const line = Math.min(220, window.innerHeight * 0.3);
      let id = null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el || el.getBoundingClientRect().top > line) break;
        id = it.id;
      }
      setCurrent(id);
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
  }, [items]);
  return current;
}

/** Glide to a heading, and leave its address in the bar for sharing. */
function useJump() {
  const { scrollTo } = useApp();
  return (e, id) => {
    e.preventDefault();
    // ours to handle: Lenis would start a second scroll of its own
    e.stopPropagation();
    scrollTo(`[id="${id}"]`, -100);
    window.history.replaceState(null, "", `#${id}`);
  };
}

/** "U ovom tekstu" beside the article: follows the reader down the page. */
export default function Toc({ items }) {
  const current = useCurrent(items);
  const jump = useJump();
  return (
    <nav className={s.toc} aria-label="U ovom tekstu">
      <p className={s.sideLabel}>U ovom tekstu</p>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={current === it.id ? "location" : undefined}
              onClick={(e) => jump(e, it.id)}
            >
              {current === it.id
                ? <motion.span
                    layoutId="toc-current"
                    className={s.tocMark}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                : null}
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** The same list on a phone: closed until asked for, above the text. It
    stays open after a tap, so the text below does not shift mid-scroll. */
export function TocFold({ items }) {
  const [open, setOpen] = useState(false);
  const jump = useJump();
  return (
    <nav className={s.fold} aria-label="U ovom tekstu">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>U ovom tekstu</span>
        <i>{items.length}</i>
        <span className={s.foldIcon} data-open={open ? "true" : undefined}>
          <Plus size={16} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open
          ? <motion.div
              className={s.foldBody}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ol>
                {items.map((it) => (
                  <li key={it.id}>
                    <a href={`#${it.id}`} onClick={(e) => jump(e, it.id)}>
                      {it.label}
                    </a>
                  </li>
                ))}
              </ol>
            </motion.div>
          : null}
      </AnimatePresence>
    </nav>
  );
}
