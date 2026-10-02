"use client";

import { useEffect, useRef } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h10.module.css";

/* 10 · Velika slova. One giant word filled with moving light: a stack of
   radial gradients clipped to the glyphs, whose centres are custom
   properties written every frame. The brightest (lime) light follows the
   pointer or a finger; the others drift on slow Lissajous paths. A blurred
   copy of the same fill sits behind as the glow the letters give off. */

// centre, amplitude (in % of the word box), angular speed (rad/s), phase
const LIGHTS = [
  { cx: 30, cy: 58, ax: 30, ay: 30, fx: 0.37, fy: 0.53, px: 0.2, py: 1.1 },
  { cx: 72, cy: 42, ax: 28, ay: 34, fx: 0.29, fy: 0.41, px: 2.4, py: 0.3 },
  { cx: 50, cy: 28, ax: 40, ay: 22, fx: 0.23, fy: 0.33, px: 4.1, py: 2.2 },
  { cx: 58, cy: 82, ax: 38, ay: 18, fx: 0.31, fy: 0.25, px: 1.3, py: 3.6 },
];

const R_IDLE = 0.6;
const R_HOVER = 0.68;
const R_PRESS = 0.84;

function Cursor() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={s.hintIcon}>
      <path
        d="M5 3.5 15.5 9l-4.6 1.4-1.9 4.6z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function H10Type() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const wordRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const word = wordRef.current;
    if (!hero || !stage || !word) return undefined;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pos = LIGHTS.map((l) => [l.cx, l.cy]);
    const ptr = { on: false, down: false, x: 30, y: 58, until: 0 };
    let radius = R_IDLE;
    let t = 0;
    let last = 0;
    let raf = 0;
    let visible = false;
    let ls = Number.NaN;

    const write = () => {
      for (let i = 0; i < pos.length; i++) {
        stage.style.setProperty(`--x${i}`, `${pos[i][0].toFixed(2)}%`);
        stage.style.setProperty(`--y${i}`, `${pos[i][1].toFixed(2)}%`);
      }
      stage.style.setProperty("--r0", `${radius.toFixed(3)}em`);
      // the outline behind falls away from the brightest light, like a shadow
      const gx = 0.022 - ((pos[0][0] - 50) / 50) * 0.014;
      const gy = 0.026 - ((pos[0][1] - 50) / 50) * 0.014;
      stage.style.setProperty("--gx", `${gx.toFixed(4)}em`);
      stage.style.setProperty("--gy", `${gy.toFixed(4)}em`);
    };

    const spacing = () => {
      if (reduce) return;
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const next = -0.078 + p * 0.04;
      if (Number.isNaN(ls) || Math.abs(next - ls) > 0.0004) {
        ls = next;
        stage.style.setProperty("--ls", `${ls.toFixed(4)}em`);
      }
    };

    const idle = (i, time) => {
      const l = LIGHTS[i];
      return [
        l.cx + l.ax * Math.sin(time * l.fx + l.px),
        l.cy + l.ay * Math.sin(time * l.fy + l.py),
      ];
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      t += dt;
      const active = ptr.on || ptr.down || now < ptr.until;
      for (let i = 0; i < pos.length; i++) {
        let [tx, ty] = idle(i, t);
        let k = 1 - Math.exp(-dt * 2.2);
        if (i === 0 && active) {
          tx = ptr.x;
          ty = ptr.y;
          k = 1 - Math.exp(-dt * 6.5);
        } else if (i > 0 && active) {
          // the other lights give way a little around the pointer
          const dx = tx - ptr.x;
          const dy = (ty - ptr.y) * 0.45;
          const d = Math.hypot(dx, dy) || 1;
          const push = Math.max(0, 34 - d) * 0.7;
          tx += (dx / d) * push;
          ty += (dy / d) * push;
        }
        pos[i][0] += (tx - pos[i][0]) * k;
        pos[i][1] += (ty - pos[i][1]) * k;
      }
      const rt = ptr.down ? R_PRESS : active ? R_HOVER : R_IDLE;
      radius += (rt - radius) * (1 - Math.exp(-dt * 5));
      write();
      spacing();
      if (visible) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || reduce || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const toWord = (e) => {
      const r = word.getBoundingClientRect();
      ptr.x = Math.min(
        108,
        Math.max(-8, ((e.clientX - r.left) / r.width) * 100),
      );
      ptr.y = Math.min(
        118,
        Math.max(-14, ((e.clientY - r.top) / r.height) * 100),
      );
    };

    const staticMove = () => {
      // reduced motion: no drift, the light simply sits where the pointer is
      pos[0][0] = ptr.x;
      pos[0][1] = ptr.y;
      radius = ptr.down ? R_PRESS : R_HOVER;
      write();
    };

    const onMove = (e) => {
      if (e.pointerType !== "mouse" && !ptr.down) return;
      toWord(e);
      ptr.on = e.pointerType === "mouse";
      if (reduce) staticMove();
    };
    const onDown = (e) => {
      toWord(e);
      ptr.down = true;
      if (reduce) staticMove();
    };
    const onUp = (e) => {
      ptr.down = false;
      // after a touch the light stays a moment, then drifts on again
      if (e.pointerType !== "mouse") ptr.until = performance.now() + 1400;
      if (reduce) staticMove();
    };
    const onLeave = (e) => {
      if (e.pointerType === "mouse") ptr.on = false;
      ptr.down = false;
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    hero.addEventListener("pointercancel", onUp);
    hero.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) start();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(hero);

    write();
    if (!reduce) spacing();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      hero.removeEventListener("pointercancel", onUp);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={s.hero} ref={heroRef}>
      <span className={s.hint}>
        <Cursor />
        <span className={s.hintFine}>Pomerite kursor preko slova</span>
        <span className={s.hintTouch}>Prevucite prstom preko slova</span>
      </span>
      <div className={s.stage} ref={stageRef} aria-hidden="true">
        <span className={s.ghost}>rast.</span>
        {/* filter on a wrapper, never on the clipped element (Safari) */}
        <span className={s.glow}>
          <span className={s.glowFill}>rast.</span>
        </span>
        <span className={s.word} ref={wordRef}>
          rast.
        </span>
      </div>
      <HeroCopy align="center" />
    </div>
  );
}
