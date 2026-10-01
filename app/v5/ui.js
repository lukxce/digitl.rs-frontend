"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { ArrowRight, Sparkle } from "./icons";

export const EASE = [0.16, 1, 0.3, 1];

/* ── page state shared between sections ───────────────────────────────── */
// The audit result travels: the speed chart marks the visitor's own load time
// and the booking form offers to attach the report.
const App = createContext(null);

export function AppProvider({ children }) {
  const lenis = useLenis();
  const [audit, setAudit] = useState(null);
  const [focusAudit, setFocusAudit] = useState(0);
  const [topic, setTopic] = useState(null);

  const scrollTo = (selector, offset = -20) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
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
    // Scroll to the diagnosis console and put the cursor in the domain field.
    openAudit: () => {
      scrollTo("#dijagnoza", -90);
      setFocusAudit((n) => n + 1);
    },
    topic,
    // Jump to the booking form with a topic chip already picked.
    book: (t = null) => {
      if (t) setTopic(t);
      scrollTo("#razgovor", -20);
    },
  };
  return <App.Provider value={value}>{children}</App.Provider>;
}

export const useApp = () => useContext(App);

/* ── hooks ────────────────────────────────────────────────────────────── */

/** True while the element is at least `amount` on screen — drives autoplay. */
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

/** Steps 0…n on a timer while `active`, restarting from 0 each time it turns on. */
export function useSteps(active, n, ms, start = 250) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ts = [setTimeout(() => setK(0), 0)];
    for (let s = 1; s <= n; s++)
      ts.push(setTimeout(() => setK(s), reduce ? 0 : start + ms * (s - 1)));
    return () => ts.forEach(clearTimeout);
  }, [active, n, ms, start]);
  return k;
}

/* ── number formatting ────────────────────────────────────────────────── */
const sr = (n, d = 0) =>
  n.toLocaleString("sr-RS", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
export const fmt = sr;

/** A metric from a case study, rolled up when it comes on screen. */
export function Counter({ metric, run = true, ms = 1300 }) {
  const v = useTween(metric.num ?? 0, ms, run);
  if (metric.num == null) return <span className={b.tnum}>{metric.text}</span>;
  // Keep the case study's own notation ("3.157", "29.8K", "9.6").
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

/** A plain number that rolls, Serbian notation. */
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
export function Kicker({ children, tone = "light", dot = false }) {
  const cls = {
    light: "",
    dark: b.kickerDark,
    lime: b.kickerLime,
    white: b.kickerWhite,
  }[tone];
  return (
    <span className={`${b.kicker} ${cls}`}>
      {dot ? <span className={b.liveDot} /> : <Sparkle size={12} />}
      {children}
    </span>
  );
}

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
  y = 18,
  ...rest
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.07, duration: 0.7, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Kicker + big H2 on the left, intro paragraph bottom-right. */
export function SectionHead({ kicker, title, intro, dark = false, tone, id }) {
  return (
    <div className={b.head}>
      {id ? <span id={id} className={b.anchor} /> : null}
      <div className={b.headLeft}>
        <Reveal>
          <Kicker tone={tone ?? (dark ? "dark" : "light")}>{kicker}</Kicker>
        </Reveal>
        <Reveal
          i={1}
          as="h2"
          className={b.h2}
          style={dark ? { color: "#fff" } : undefined}
        >
          {title}
        </Reveal>
      </div>
      {intro
        ? <Reveal i={2} as="p" className={dark ? b.headIntroDark : b.headIntro}>
            {intro}
          </Reveal>
        : null}
    </div>
  );
}

/** Segmented control with a pill that slides to the active option. */
export function Segmented({
  id,
  options,
  value,
  onChange,
  tone = "light",
  label,
}) {
  const cls = { light: "", dark: b.segDark, lime: b.segLime }[tone];
  return (
    <div className={`${b.seg} ${cls}`} role="tablist" aria-label={label}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${b.segBtn} ${active ? b.segBtnOn : ""}`}
            onClick={() => onChange(o.key)}
          >
            {active
              ? <motion.span
                  layoutId={`seg-${id}`}
                  className={b.segPill}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              : null}
            <span className={b.segLabel}>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Honest({ children, dark = false }) {
  return <span className={dark ? b.honestDark : b.honest}>{children}</span>;
}
