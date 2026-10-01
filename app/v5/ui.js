"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { ArrowRight } from "./icons";

export const EASE = [0.16, 1, 0.3, 1];

/* ── page state shared between chapters ───────────────────────────────── */
// The site check travels: the contact form offers to attach it.
const App = createContext(null);

export function AppProvider({ children }) {
  const lenis = useLenis();
  const [audit, setAudit] = useState(null);
  const [focusAudit, setFocusAudit] = useState(0);
  const [topic, setTopic] = useState(null);

  const scrollTo = (selector, offset = -80) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.3 });
    else
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + offset,
        behavior: "smooth",
      });
  };

  const value = {
    audit,
    setAudit,
    scrollTo,
    focusAudit,
    openAudit: () => {
      scrollTo("#provera", -120);
      setFocusAudit((n) => n + 1);
    },
    topic,
    book: (t = null) => {
      if (t) setTopic(t);
      scrollTo("#pocetak");
    },
  };
  return <App.Provider value={value}>{children}</App.Provider>;
}

export const useApp = () => useContext(App);

/* ── hooks ────────────────────────────────────────────────────────────── */
export function useVisible(ref, amount = 0.35) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), {
      threshold: amount,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return v;
}

/** Rolls from the previous value to `target` instead of jumping. */
export function useTween(target, ms = 1100, run = true) {
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setV(target);
      return;
    }
    let raf = 0;
    const a = from.current;
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / ms);
      const x = a + (target - a) * (1 - (1 - p) ** 3);
      from.current = x;
      setV(x);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, run]);
  return v;
}

/* ── numbers ──────────────────────────────────────────────────────────── */
const sr = (n, d = 0) =>
  n.toLocaleString("sr-RS", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
export const fmt = sr;

/** A case-study metric ("3.157", "29.8K", "1. mesec"), rolled up on view. */
export function Counter({ metric, run = true, ms = 1300 }) {
  const v = useTween(metric.num ?? 0, ms, run);
  if (metric.num == null) return <span className={b.tnum}>{metric.text}</span>;
  const shown = metric.thousands
    ? sr(Math.round(v))
    : v.toFixed(metric.decimals);
  return (
    <span className={b.tnum}>
      {shown}
      {metric.suffix}
    </span>
  );
}

export function Roll({
  value,
  decimals = 0,
  run = true,
  ms = 1100,
  prefix = "",
  suffix = "",
}) {
  const v = useTween(value, ms, run);
  return (
    <span className={b.tnum}>
      {prefix}
      {sr(v, decimals)}
      {suffix}
    </span>
  );
}

/* ── primitives ───────────────────────────────────────────────────────── */
/** Pill button. variant: accent | ink | ghost | white | glass. size: sm | md | lg */
export function Btn({
  href,
  variant = "ink",
  size = "md",
  children,
  arrow = false,
  className = "",
  ...rest
}) {
  const cls = `${b.btn} ${b[`btn_${variant}`]} ${b[`btn_${size}`]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowRight size={size === "sm" ? 15 : 17} /> : null}
    </>
  );
  return href
    ? <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    : <button type="button" className={cls} {...rest}>
        {inner}
      </button>;
}

export function Reveal({
  i = 0,
  children,
  className = "",
  as = "div",
  y = 20,
  ...rest
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Centred chapter head: number + name, the line that carries the story, one sentence under it. */
export function Chapter({ n, name, title, sub, id }) {
  return (
    <div className={b.chapter}>
      {id ? <span id={id} className={b.anchor} /> : null}
      <Reveal className={b.chapterTag}>
        <i>{n}</i> {name}
      </Reveal>
      <Reveal as="h2" i={1} className={b.chapterTitle}>
        {title}
      </Reveal>
      {sub
        ? <Reveal as="p" i={2} className={b.chapterSub}>
            {sub}
          </Reveal>
        : null}
    </div>
  );
}
