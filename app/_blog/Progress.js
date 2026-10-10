"use client";

import { useEffect, useRef } from "react";
import s from "./article.module.css";

/** A thin line across the top that fills as the article is read: empty at
    the top of the page, full when the last line of the text is on screen. */
export default function Progress({ target }) {
  const bar = useRef(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      const el = document.getElementById(target);
      if (!el || !bar.current) return;
      const end =
        el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight;
      const p = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 1;
      bar.current.style.transform = `scaleX(${p.toFixed(4)})`;
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
  }, [target]);

  return (
    <div className={s.progress} aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
