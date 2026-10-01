"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./v5.module.css";

export const EASE = [0.16, 1, 0.3, 1];

export function Sparkle({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C12 6.4 17.6 12 24 12C17.6 12 12 17.6 12 24C12 17.6 6.4 12 0 12C6.4 12 12 6.4 12 0Z" />
    </svg>
  );
}

export function Arrow({ size = 16 }) {
  return (
    <svg className={s.btnArrow} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Kicker({ children, dark = false, dot = false }) {
  return (
    <span className={`${s.kicker} ${dark ? s.kickerDark : ""}`}>
      {dot ? <span className={s.liveDot} /> : <Sparkle />}
      {children}
    </span>
  );
}

/** Pill button. variant: accent | ink | ghost | white | glass. size: sm | md | lg */
export function Btn({ href, variant = "ink", size = "md", children, arrow = false, ...rest }) {
  const cls = `${s.btn} ${s[`btn_${variant}`]} ${s[`btn_${size}`]}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow ? <Arrow /> : null}
    </>
  );
  return href ? (
    <a href={href} className={cls} {...rest}>
      {inner}
    </a>
  ) : (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}

/** True while the element is at least `amount` on screen — drives autoplay. */
export function useVisible(ref, amount = 0.35) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: amount });
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

/** A metric from a case study, rolled up when it comes on screen. */
export function Counter({ metric, run = true }) {
  const v = useTween(metric.num ?? 0, 1300, run);
  if (metric.num == null) return <span className={s.tnum}>{metric.text}</span>;
  const shown = metric.thousands
    ? Math.round(v).toLocaleString("sr-RS")
    : v.toFixed(metric.decimals);
  return (
    <span className={s.tnum}>
      {shown}
      {metric.suffix}
    </span>
  );
}

export function Reveal({ i = 0, children, className = "", as = "div" }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.07, duration: 0.7, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Section header: kicker + big H2 left, intro paragraph bottom-right. */
export function SectionHead({ kicker, title, intro, dark = false, id }) {
  return (
    <div className={s.sectionHead}>
      <div className={s.sectionHeadLeft}>
        <Reveal>
          <Kicker dark={dark}>{kicker}</Kicker>
        </Reveal>
        <Reveal i={1} as="h2" className={s.h2}>
          {title}
        </Reveal>
      </div>
      {intro ? (
        <Reveal i={2} as="p" className={s.sectionIntro}>
          {intro}
        </Reveal>
      ) : null}
      {id ? <span id={id} className={s.anchor} /> : null}
    </div>
  );
}

/** Segmented control with a pill that slides to the active option. */
export function Segmented({ id, options, value, onChange, dark = false, renderLabel }) {
  return (
    <div className={`${s.seg} ${dark ? s.segDark : ""}`} role="tablist">
      {options.map((o) => {
        const active = o === value || o?.key === value;
        const key = o?.key ?? o;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${s.segBtn} ${active ? s.segBtnOn : ""}`}
            onClick={() => onChange(key)}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${id}`}
                className={s.segPill}
                transition={{ duration: 0.4, ease: EASE }}
              />
            ) : null}
            <span className={s.segLabel}>{renderLabel ? renderLabel(o) : (o?.label ?? o)}</span>
          </button>
        );
      })}
    </div>
  );
}
