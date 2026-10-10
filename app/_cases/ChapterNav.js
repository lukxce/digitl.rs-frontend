"use client";

import { useEffect, useRef, useState } from "react";
import b from "../_home/base.module.css";
import { useApp } from "../_home/ui";
import s from "./study.module.css";

/** "U ovoj studiji": a list that stays beside the chapters on a wide
    screen, a strip of chips under the menu on a narrow one. Both mark the
    chapter being read and scroll to the one that is picked. */
export default function ChapterNav({ items }) {
  const { scrollTo } = useApp();
  const [active, setActive] = useState(items[0]?.id ?? null);
  const strip = useRef(null);
  const list = useRef(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      // the chapter whose top has passed a third of the way down the screen
      const mark = window.innerHeight * 0.34;
      let current = items[0]?.id ?? null;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= mark) current = it.id;
      }
      setActive(current);
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

  // keep the current entry in view: move the strip or the list, never the page
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = calm ? "auto" : "smooth";
    const row = strip.current;
    const chip = row?.clientWidth
      ? [...row.children].find((c) => c.dataset.id === active)
      : null;
    if (chip)
      row.scrollTo({
        left: chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2,
        behavior,
      });
    // on a short screen the list scrolls inside itself
    const col = list.current;
    const link = col?.querySelector('[aria-current="true"]');
    if (link && col.scrollHeight > col.clientHeight + 1) {
      const top =
        link.getBoundingClientRect().top -
        col.getBoundingClientRect().top +
        col.scrollTop;
      col.scrollTo({
        top: top - (col.clientHeight - link.offsetHeight) / 2,
        behavior,
      });
    }
  }, [active]);

  const go = (e, id) => {
    e.preventDefault();
    // Each chapter's scroll-margin says how much room the menu (and, on a
    // narrow screen, the strip of chips) needs above it.
    const el = document.getElementById(id);
    const room = el
      ? Number.parseFloat(getComputedStyle(el).scrollMarginTop)
      : 0;
    scrollTo(`#${CSS.escape(id)}`, -(room || 92));
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <nav ref={list} className={s.toc} aria-label="U ovoj studiji">
        <span className={b.label}>U ovoj studiji</span>
        <ol>
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={active === it.id ? "true" : undefined}
                onClick={(e) => go(e, it.id)}
              >
                {it.first ? <em>{it.kicker}</em> : null}
                <b>{it.title}</b>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav className={s.strip} aria-label="Poglavlja">
        <div ref={strip} className={s.stripRail}>
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              data-id={it.id}
              aria-current={active === it.id ? "true" : undefined}
              onClick={(e) => go(e, it.id)}
            >
              <i>{it.n}</i>
              {it.kicker}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
