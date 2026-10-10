"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { Rotate } from "./icons";
import l from "./loop.module.css";
import { Bridge, EASE, Head, useVisible } from "./ui";

/* The customer's path drawn as a loop rather than a funnel: someone notices
   you, searches, decides on the site, gets in touch, and comes back or sends
   someone else, which starts the loop again. Each stop names the services
   that work there and what we measure.

   The ring is a wheel. The stop at the top is the current one; the wheel
   turns a stop at a time on its own until a hand takes it. It can be spun
   by the ring or by a number (drag round, let go, and it coasts to the
   nearest stop), and on a phone also by swiping sideways across the middle.
   Only the ring itself takes the finger from the page: the middle and
   everything around it still scroll up and down as usual. The blue arc is
   the way travelled so far, in either direction, and stays closed once the
   wheel has gone all the way round. */

const STAGES = [
  {
    name: "Primeti vas",
    body: "Prvi put čuje za vas: na mrežama, u oglasu ili od nekog ko vas preporuči.",
    who: ["Brend", "Društvene mreže"],
    metric: "Doseg u pravoj publici",
  },
  {
    name: "Traži",
    body: "Kad mu zatreba, ukuca uslugu i grad. Tu morate biti među prvima, jer na drugu stranu skoro niko ne ide.",
    who: ["SEO", "Plaćeno oglašavanje"],
    metric: "Pozicija i cena po kliku",
  },
  {
    name: "Odlučuje",
    body: "Dolazi na sajt. Brz sajt sa cenom i jasnim sledećim korakom pretvara posetu u upit.",
    who: ["Web"],
    metric: "Stopa konverzije",
  },
  {
    name: "Javlja se",
    body: "Poziv, poruka ili porudžbina. Svaki upit se beleži, pa znamo tačno odakle je došao.",
    who: ["Web", "Plaćeno oglašavanje"],
    metric: "Cena po upitu",
  },
  {
    name: "Vraća se",
    body: "Zadovoljan kupac se vraća i preporučuje vas dalje. Tako krug kreće ponovo, i svaki sledeći kupac košta manje.",
    who: ["Društvene mreže", "Brend"],
    metric: "Povratni kupci i preporuke",
  },
];
const N = STAGES.length;
const STEP = 360 / N;
const C = 300;
const R = 210;
const CIRC = 2 * Math.PI * R;
// The band that takes the hand, as radii in the 600 box. They match .grab
// and .hole in the stylesheet (insets of 9% and 21%).
const BAND_OUT = 246;
const BAND_IN = 174;
const ALL = (1 << N) - 1;
const rad = (deg) => (deg * Math.PI) / 180;
const mod = (v) => ((v % N) + N) % N;
// two decimals, so the server and the browser print the same string
const r2 = (v) => Math.round(v * 100) / 100;
const pct = (v) => `${r2((v / 600) * 100)}%`;
const clamp = (v, a, z) => Math.max(a, Math.min(z, v));
const SETTLE = { type: "spring", stiffness: 90, damping: 17 };

/** A numbered stop. Its place follows the wheel; the number stays upright. */
function Stop({ i, rot, on, done, name, onPick }) {
  const left = useTransform(rot, (r) =>
    pct(C + R * Math.sin(rad(i * STEP + r))),
  );
  const top = useTransform(rot, (r) =>
    pct(C - R * Math.cos(rad(i * STEP + r))),
  );
  return (
    <motion.button
      type="button"
      className={l.stop}
      data-stop={i}
      data-on={on ? "true" : undefined}
      data-done={done ? "true" : undefined}
      style={{ left, top }}
      onClick={() => onPick(i)}
      aria-label={`${i + 1}. ${name}`}
      aria-pressed={on}
    >
      {i + 1}
    </motion.button>
  );
}

/** A stop's name, kept outside the ring wherever the wheel has turned it. */
function Name({ i, rot, on, children }) {
  const a = (r) => rad(i * STEP + r);
  const left = useTransform(rot, (r) => pct(C + (R + 50) * Math.sin(a(r))));
  const top = useTransform(rot, (r) => pct(C - (R + 50) * Math.cos(a(r))));
  // lean the label away from the centre: above at the top, beside at the sides
  const x = useTransform(rot, (r) => `${r2(-50 + 50 * Math.sin(a(r)))}%`);
  const y = useTransform(rot, (r) => `${r2(-50 - 50 * Math.cos(a(r)))}%`);
  return (
    <motion.span
      className={l.name}
      data-on={on ? "true" : undefined}
      style={{ left, top, x, y }}
      aria-hidden="true"
    >
      {children}
    </motion.span>
  );
}

export default function Loop() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [seen, setSeen] = useState(1);
  const [held, setHeld] = useState(false);
  const [grabbing, setGrabbing] = useState(false);
  const active = mod(step);

  // The wheel's turn in degrees; the stop at the top is step = -rot / STEP.
  // lo and hi are the furthest it has been turned each way, in laps.
  const rot = useMotionValue(0);
  const lo = useMotionValue(0);
  const hi = useMotionValue(0);
  const stepRef = useRef(0);
  const seenRef = useRef(1);
  const spin = useRef(null);
  const drag = useRef(null);
  const handled = useRef(0);

  useMotionValueEvent(rot, "change", (v) => {
    const laps = -v / 360;
    if (laps > hi.get()) hi.set(laps);
    if (laps < lo.get()) lo.set(laps);
    const s = Math.round(-v / STEP);
    if (s !== stepRef.current) {
      stepRef.current = s;
      setStep(s);
    }
    // a stop is behind us once it has been at the top
    let got = seenRef.current;
    if (got === ALL) return;
    for (let i = 0; i < N; i++) {
      const at = i / N;
      const lap = Math.ceil(lo.get() - at - 1e-3);
      if (at + lap <= hi.get() + 1e-3) got |= 1 << i;
    }
    if (got !== seenRef.current) {
      seenRef.current = got;
      setSeen(got);
    }
  });

  const turnTo = (target, transition) => {
    spin.current?.stop();
    if (reduce) rot.set(-target * STEP);
    else spin.current = animate(rot, -target * STEP, transition);
  };

  // on its own, a stop at a time, until a hand takes over
  // biome-ignore lint/correctness/useExhaustiveDependencies: step re-arms the timer after every turn
  useEffect(() => {
    if (!visible || held) return;
    const t = setTimeout(
      () => turnTo(stepRef.current + 1, { duration: 1.1, ease: EASE }),
      3400,
    );
    return () => clearTimeout(t);
  }, [visible, held, step]);
  useEffect(() => () => spin.current?.stop(), []);

  // bring a stop to the top by the shorter way round
  const pick = (i) => {
    setHeld(true);
    const cur = stepRef.current;
    let d = mod(i - cur);
    if (d > N / 2) d -= N;
    turnTo(cur + d, SETTLE);
  };
  // The wheel reads taps itself (below); a click that follows one is the
  // same tap. What is left is the keyboard and assistive technology.
  const onPick = (i) => {
    if (performance.now() - handled.current > 500) pick(i);
  };

  const angleAt = (e, box) =>
    (Math.atan2(
      e.clientY - (box.top + box.height / 2),
      e.clientX - (box.left + box.width / 2),
    ) *
      180) /
    Math.PI;

  const take = () => {
    spin.current?.stop();
    setHeld(true);
    setGrabbing(true);
  };

  const onDown = (e) => {
    if (drag.current || (e.button != null && e.button > 0)) return;
    const box = e.currentTarget.getBoundingClientRect();
    const out =
      (Math.hypot(
        e.clientX - (box.left + box.width / 2),
        e.clientY - (box.top + box.height / 2),
      ) *
        600) /
      box.width;
    if (out > BAND_OUT) return;
    // on the ring the wheel follows the hand round; in the middle only a
    // finger swiping sideways turns it, so the page can still be scrolled
    const ring = out >= BAND_IN;
    if (!ring && e.pointerType !== "touch") return;
    const hit = e.target.closest?.("[data-stop]");
    drag.current = {
      id: e.pointerId,
      box,
      ring,
      live: ring,
      last: angleAt(e, box),
      x: e.clientX,
      x0: e.clientX,
      y0: e.clientY,
      far: 0,
      v: 0,
      t: performance.now(),
      stop: hit ? Number(hit.dataset.stop) : null,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (ring) take();
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    d.far = Math.max(d.far, Math.hypot(dx, dy));
    const now = performance.now();
    let da = 0;
    if (d.ring) {
      const a = angleAt(e, d.box);
      da = a - d.last;
      if (da > 180) da -= 360;
      if (da < -180) da += 360;
      d.last = a;
    } else if (!d.live) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return;
      d.live = true;
      d.x = e.clientX;
      d.t = now;
      take();
      return;
    } else {
      // as if the finger rolled the top of the wheel along
      da = ((e.clientX - d.x) / ((d.box.width * R) / 600)) * (180 / Math.PI);
      d.x = e.clientX;
    }
    d.v = d.v * 0.6 + (da / Math.max(1, now - d.t)) * 0.4;
    d.t = now;
    rot.set(rot.get() + da);
  };
  const onUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    handled.current = performance.now();
    setGrabbing(false);
    if (!d.live) return;
    // a tap: on a number it brings that stop to the top
    if (d.far < 6 && e.type !== "pointercancel") {
      if (d.stop != null) pick(d.stop);
      else turnTo(stepRef.current, { duration: 0.3, ease: EASE });
      return;
    }
    // let go: coast a little, then settle on the nearest stop
    const v = performance.now() - d.t > 120 ? 0 : clamp(d.v, -0.9, 0.9);
    const target = Math.round(-(rot.get() + v * 260) / STEP);
    turnTo(target, { ...SETTLE, velocity: v * 1000 });
  };

  const cur = STAGES[active];
  // The arc is the way travelled so far: from the furthest turn one way to
  // the furthest the other, a whole ring once that is a full lap.
  const dashArray = useTransform([lo, hi], ([a, z]) => {
    const len = Math.min(1, z - a) * CIRC;
    return `${r2(len)}px ${r2(CIRC - len)}px`;
  });
  const dashOffset = useTransform(lo, (a) => `${r2(-a * CIRC)}px`);

  return (
    <section
      className={`${b.section} ${b.glow} ${l.section}`}
      data-section="Put kupca"
    >
      <div className={b.container}>
        <div ref={ref} className={l.grid}>
          <div className={l.head}>
            <Head
              id="put-kupca"
              label="Put kupca"
              title="Kupac ne ide kroz levak. Ide u krug."
              intro="Svaka usluga ima svoje mesto na tom putu. Mi vodimo ceo krug, pa svaki kupac dovodi sledećeg."
            />
          </div>
          {/* the wheel is dragged here; the numbers on it are the buttons */}
          <div
            className={l.diagram}
            data-grabbing={grabbing ? "true" : undefined}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <motion.svg
              viewBox="0 0 600 600"
              aria-hidden="true"
              style={{ rotate: rot }}
            >
              <circle cx={C} cy={C} r={R} className={l.ring} />
              <motion.circle
                cx={C}
                cy={C}
                r={R}
                className={l.ringOn}
                style={{
                  strokeDasharray: dashArray,
                  strokeDashoffset: dashOffset,
                }}
                transform={`rotate(-90 ${C} ${C})`}
              />
            </motion.svg>

            {STAGES.map((st, i) => (
              <Name key={st.name} i={i} rot={rot} on={i === active}>
                {st.name}
              </Name>
            ))}

            {/* the ring takes the hand; the middle stays the page's */}
            <div className={l.grab} />
            <div className={l.hole} />
            {STAGES.map((st, i) => (
              <Stop
                key={st.name}
                i={i}
                rot={rot}
                on={i === active}
                done={(seen & (1 << i)) !== 0}
                name={st.name}
                onPick={onPick}
              />
            ))}

            {/* A spin runs through several stops in a moment, so the text
                swaps by remounting (a CSS rise), with no exit to wait for. */}
            <div className={l.center}>
              <div key={active} className={l.centerIn}>
                <span className={l.of}>
                  Korak {active + 1} od {N}
                </span>
                <b>{cur.name}</b>
              </div>
            </div>

            <AnimatePresence>
              {held
                ? null
                : <motion.span
                    className={l.hint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    aria-hidden="true"
                  >
                    <Rotate size={13} /> Zavrtite krug
                  </motion.span>}
            </AnimatePresence>
          </div>

          <div className={l.card}>
            <div key={active} className={l.cardIn}>
              <p>{cur.body}</p>
              <div className={l.facts}>
                <span className={l.fact}>
                  <span className={l.mini}>Ovde radi</span>
                  <span className={l.who}>
                    {cur.who.map((w) => (
                      <i key={w}>{w}</i>
                    ))}
                  </span>
                </span>
                <span className={l.fact}>
                  <span className={l.mini}>Merimo</span>
                  <b>{cur.metric}</b>
                </span>
              </div>
            </div>
          </div>
        </div>

        <Bridge
          text="Vodimo ceo krug, od prvog pogleda do kupca koji se vraća. Razgovarajmo o vašem."
          to="#kontakt"
          label="Razgovarajmo"
        />
      </div>
    </section>
  );
}
