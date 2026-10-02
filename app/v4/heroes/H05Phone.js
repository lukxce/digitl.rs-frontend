"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useReducer, useRef } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h05.module.css";

/* 05 · Telefon zvoni. A light, realistic phone on the right that keeps
   receiving inquiries, the way a phone looks when marketing works. It turns
   toward the cursor (drag on touch), and a tap makes it buzz and pulls in the
   next message at once. Everything on the screen is an illustration. */

/* ── glyphs ─────────────────────────────────────────────────────────── */
const G = {
  web: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="6.6" cy="7.25" r="0.9" fill="currentColor" />
      <circle cx="9.2" cy="7.25" r="0.9" fill="currentColor" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.3 3.8 9.6 4.4l1.1 3.7-1.9 1.6a11 11 0 0 0 5.5 5.5l1.6-1.9 3.7 1.1.6 2.3c.2.9-.4 1.8-1.3 2-7.4 1.3-14.1-5.4-12.8-12.8.2-.9 1.1-1.5 2-1.3Z"
        fill="currentColor"
      />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.9"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="16.6" cy="7.4" r="1.1" fill="currentColor" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8L8 13.6l-4.3-4 5.8-.7L12 3.6Z"
        fill="currentColor"
      />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M9 12.5h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  ),
  ad: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10.2v3.6c0 .7.5 1.2 1.2 1.2H7l5.6 3.6c.6.4 1.4 0 1.4-.8V6.2c0-.8-.8-1.2-1.4-.8L7 9H5.2C4.5 9 4 9.5 4 10.2Z"
        fill="currentColor"
      />
      <path
        d="M17 9.2c.9.7 1.4 1.7 1.4 2.8s-.5 2.1-1.4 2.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="10.5"
        width="14"
        height="10"
        rx="2.6"
        fill="currentColor"
      />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  ),
  torch: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3.5h8v3l-2 3.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-1A1.5 1.5 0 0 1 10 19.5V10L8 6.5v-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    </svg>
  ),
  shutter: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9a2 2 0 0 1 2-2h2l1.4-2h5.2L16 7h2a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
};

/* ── what arrives ───────────────────────────────────────────────────── */
// `h` is the card height in em (the phone is sized in em), so the stack can
// be laid out without measuring.
const KINDS = [
  {
    title: "Novi upit sa sajta",
    body: "Zanima me cena montaže za stan od 60 m²",
    icon: "web",
    tone: "blue",
    src: "site",
    h: 7.1,
  },
  {
    title: "Propušten poziv",
    body: "Iz Google oglasa",
    icon: "phone",
    tone: "green",
    src: "ads",
    h: 5.5,
  },
  {
    title: "Instagram",
    body: "Da li radite i subotom?",
    icon: "camera",
    tone: "insta",
    src: "ig",
    h: 5.5,
  },
  {
    title: "Google",
    body: "Nova recenzija",
    stars: true,
    icon: "star",
    tone: "lime",
    src: null,
    h: 5.5,
  },
  {
    title: "Forma",
    body: "Zahtev za ponudu",
    icon: "doc",
    tone: "coral",
    src: "site",
    h: 5.5,
  },
];

const SOURCES = [
  {
    id: "ads",
    label: "Google oglasi",
    sub: "pozivi",
    icon: "ad",
    tone: "blue",
  },
  {
    id: "site",
    label: "Sajt",
    sub: "upiti i forme",
    icon: "web",
    tone: "lime",
  },
  {
    id: "ig",
    label: "Instagram",
    sub: "poruke",
    icon: "camera",
    tone: "insta",
  },
];

const GAP = 0.8; // em between cards
const FULL = 3; // cards shown in full; the rest compress into a stack
const KEEP = 6; // cards kept on screen (front of the stack + two behind)

function layout(items) {
  let y = 0;
  let frontH = 0;
  return items.map((it, i) => {
    const h = KINDS[it.k].h;
    if (i < FULL) {
      const pos = { y, scale: 1, opacity: 1, h, z: 20 - i, ghost: false };
      y += h + GAP;
      return pos;
    }
    if (i === FULL) frontH = h;
    const depth = i - FULL;
    return {
      y: y + depth * 1.3,
      scale: 1 - depth * 0.06,
      opacity: depth === 0 ? 1 : 1 - depth * 0.22,
      h: frontH,
      z: 10 - depth,
      ghost: depth > 0,
    };
  });
}

const SEED = [
  { id: 2, k: 2 },
  { id: 1, k: 1 },
  { id: 0, k: 0 },
];

function reducer(st) {
  const k = st.seq % KINDS.length;
  return {
    items: [{ id: st.seq, k }, ...st.items].slice(0, KEEP),
    seq: st.seq + 1,
    count: st.count + 1,
  };
}

const plural = (n) => (n % 10 === 1 && n % 100 !== 11 ? "upit" : "upita");
const ago = (i) => (i === 0 ? "sada" : `pre ${i * 4} min`);

const SPRING = { type: "spring", stiffness: 420, damping: 32, mass: 0.9 };

function Note({ it, pos, index }) {
  const kind = KINDS[it.k];
  return (
    <motion.div
      className={s.note}
      data-ghost={pos.ghost || undefined}
      style={{ zIndex: pos.z, height: `${pos.h}em` }}
      initial={{ y: "-4em", scale: 0.9, opacity: 0 }}
      animate={{ y: `${pos.y}em`, scale: pos.scale, opacity: pos.opacity }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
      transition={SPRING}
    >
      <span className={s.app} data-tone={kind.tone}>
        {G[kind.icon]}
      </span>
      <span className={s.noteText}>
        <span className={s.noteTop}>
          <b>{kind.title}</b>
          <i>{ago(index)}</i>
        </span>
        <span className={s.noteBody}>
          {kind.body}
          {kind.stars ? <span className={s.stars}> ★★★★★</span> : null}
        </span>
      </span>
    </motion.div>
  );
}

export default function H05Phone({ clients }) {
  const [st, push] = useReducer(reducer, {
    items: SEED,
    seq: 3,
    count: 3,
  });
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const shakeRef = useRef(null);
  const timer = useRef(0);
  const live = useRef(false);
  const reduce = useRef(false);

  const buzz = useCallback((strong) => {
    const el = shakeRef.current;
    if (!el || reduce.current || !el.animate) return;
    const a = strong ? 7 : 2.2;
    const r = strong ? 1.6 : 0.4;
    el.animate(
      [
        { transform: "translate3d(0,0,0) rotate(0)" },
        { transform: `translate3d(${-a}px,0,0) rotate(${-r}deg)` },
        { transform: `translate3d(${a}px,0,0) rotate(${r}deg)` },
        { transform: `translate3d(${-a * 0.8}px,0,0) rotate(${-r * 0.8}deg)` },
        { transform: `translate3d(${a * 0.6}px,0,0) rotate(${r * 0.6}deg)` },
        { transform: `translate3d(${-a * 0.3}px,0,0) rotate(0)` },
        { transform: "translate3d(0,0,0) rotate(0)" },
      ],
      { duration: strong ? 460 : 300, easing: "ease-out" },
    );
  }, []);

  // The next message on a loop while the hero is on screen.
  const schedule = useCallback(
    (ms) => {
      clearTimeout(timer.current);
      if (!live.current || reduce.current) return;
      timer.current = setTimeout(() => {
        push();
        buzz(false);
        schedule(1800);
      }, ms);
    },
    [buzz],
  );

  const ring = () => {
    push();
    buzz(true);
    if (navigator.vibrate) navigator.vibrate(40);
    schedule(2400);
  };

  useEffect(() => {
    reduce.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const io = new IntersectionObserver(
      ([e]) => {
        live.current = e.isIntersecting;
        if (live.current) schedule(900);
        else clearTimeout(timer.current);
      },
      { threshold: 0.2 },
    );
    io.observe(heroRef.current);
    return () => {
      io.disconnect();
      clearTimeout(timer.current);
    };
  }, [schedule]);

  // Tilt toward the cursor (drag on touch); a slow sway when left alone.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = heroRef.current;
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const cur = { x: 2, y: -5 };
    let aim = null;
    let drag = null;
    let visible = false;
    let raf = 0;
    let last = 0;
    const clamp = (v) => Math.max(-1, Math.min(1, v));

    const tick = (now) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(64, now - (last || now));
      last = now;
      const t = now / 1000;
      let tx;
      let ty;
      if (aim) {
        tx = -aim.y * 10;
        ty = aim.x * 13;
      } else {
        tx = 2 + Math.sin(t * 0.47 + 1) * 3;
        ty = -6 + Math.sin(t * 0.61) * 7;
      }
      const k = 1 - (1 - 0.07) ** (dt / 16.67);
      cur.x += (tx - cur.x) * k;
      cur.y += (ty - cur.y) * k;
      tilt.style.transform = `rotateX(${cur.x.toFixed(3)}deg) rotateY(${cur.y.toFixed(3)}deg)`;
      stage.style.setProperty("--tx", (cur.y / 12).toFixed(4));
      stage.style.setProperty("--ty", (cur.x / 9).toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf && visible) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      const r = tilt.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      aim = {
        x: clamp((e.clientX - (r.left + r.width / 2)) / (h.width * 0.32)),
        y: clamp((e.clientY - (r.top + r.height / 2)) / (h.height * 0.45)),
      };
    };
    const onLeave = (e) => {
      if (e.pointerType === "mouse") aim = null;
    };
    const onDown = (e) => {
      if (e.pointerType === "mouse") return;
      drag = { x: e.clientX, y: e.clientY, ax: cur.y / 12, ay: -cur.x / 9 };
    };
    const onDrag = (e) => {
      if (!drag || e.pointerType === "mouse") return;
      aim = {
        x: clamp(drag.ax + (e.clientX - drag.x) / 140),
        y: clamp(drag.ay + (e.clientY - drag.y) / 220),
      };
    };
    const onUp = () => {
      drag = null;
      aim = null;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(hero);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onDrag);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onDrag);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const pos = layout(st.items);
  const newest = st.items[0];
  const firedSrc = KINDS[newest.k].src;

  return (
    <MotionConfig reducedMotion="user">
      <div className={s.hero} ref={heroRef}>
        <div className={s.grid}>
          <HeroCopy align="left" className={s.copy} />

          <div className={s.stage} ref={stageRef}>
            <div className={s.glow} aria-hidden="true" />
            <div className={s.floor} aria-hidden="true" />

            {SOURCES.map((src, i) => (
              <div
                key={src.id}
                className={s.src}
                data-at={src.id}
                aria-hidden="true"
              >
                <div className={s.srcFloat} style={{ "--i": i }}>
                  <span className={s.srcIcon} data-tone={src.tone}>
                    {G[src.icon]}
                  </span>
                  <span className={s.srcText}>
                    <b>{src.label}</b>
                    <i>{src.sub}</i>
                  </span>
                  {firedSrc === src.id && st.seq > 3
                    ? <span key={newest.id} className={s.plus}>
                        +1
                      </span>
                    : null}
                </div>
              </div>
            ))}

            <div className={s.persp}>
              <div className={s.tilt} ref={tiltRef}>
                <div className={s.shaker} ref={shakeRef}>
                  <div
                    className={s.phone}
                    role="button"
                    tabIndex={0}
                    aria-label="Telefon, dodirnite za novi upit"
                    onClick={ring}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        ring();
                      }
                    }}
                  >
                    <span className={s.edge} aria-hidden="true" />
                    <span className={`${s.key} ${s.keyAction}`} />
                    <span className={`${s.key} ${s.keyUp}`} />
                    <span className={`${s.key} ${s.keyDown}`} />
                    <span className={`${s.key} ${s.keyPower}`} />
                    <div className={s.bezel}>
                      <div className={s.screen}>
                        <span className={s.wall} aria-hidden="true" />
                        <span className={s.island} aria-hidden="true" />
                        <span className={s.bar} aria-hidden="true">
                          <svg viewBox="0 0 18 12" aria-hidden="true">
                            <rect x="0" y="8" width="3" height="4" rx="1" />
                            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
                            <rect x="10" y="3" width="3" height="9" rx="1" />
                            <rect x="15" y="0" width="3" height="12" rx="1" />
                          </svg>
                          <svg viewBox="0 0 16 12" aria-hidden="true">
                            <path d="M8 11.5 5.6 8.9a3.4 3.4 0 0 1 4.8 0L8 11.5Z" />
                            <path d="M3.4 6.6a6.6 6.6 0 0 1 9.2 0l-1.4 1.5a4.6 4.6 0 0 0-6.4 0L3.4 6.6Z" />
                            <path d="M1.2 4.3a9.8 9.8 0 0 1 13.6 0l-1.4 1.4a7.8 7.8 0 0 0-10.8 0L1.2 4.3Z" />
                          </svg>
                          <span className={s.battery}>
                            <span />
                          </span>
                        </span>
                        <span className={s.lock}>{G.lock}</span>
                        <span className={s.date}>utorak, 14. oktobar</span>
                        <span className={s.time}>09:41</span>

                        <div className={s.list}>
                          <AnimatePresence initial={false}>
                            {st.items.map((it, i) => (
                              <Note
                                key={it.id}
                                it={it}
                                pos={pos[i]}
                                index={i}
                              />
                            ))}
                          </AnimatePresence>
                        </div>

                        <div className={s.bottom}>
                          <span className={s.round}>{G.torch}</span>
                          <span className={s.chip}>
                            <span className={s.chipDot} />
                            Danas:{" "}
                            <span className={s.count}>
                              <AnimatePresence initial={false} mode="popLayout">
                                <motion.b
                                  key={st.count}
                                  initial={{ y: "100%", opacity: 0 }}
                                  animate={{ y: "0%", opacity: 1 }}
                                  exit={{ y: "-100%", opacity: 0 }}
                                  transition={SPRING}
                                >
                                  {st.count}
                                </motion.b>
                              </AnimatePresence>
                            </span>{" "}
                            {plural(st.count)}
                          </span>
                          <span className={s.round}>{G.shutter}</span>
                        </div>
                        <span className={s.home} aria-hidden="true" />
                      </div>
                    </div>
                    <span className={s.glare} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
            <p className={s.caption}>Ilustracija</p>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
