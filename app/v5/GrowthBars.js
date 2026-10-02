"use client";

import { useEffect, useRef } from "react";

/* The hero's growth chart, drawn in the same small dots the rest of the page
   uses, like an LED display. Columns of lit dots rise from left to right and
   each one is capped with a lime dot; the bars fade toward their base, so the
   whole thing stays light. It answers the reader: the columns under the
   pointer (or a finger dragged sideways) rise and brighten, a click or tap
   sends a ring of lit dots out, and each answer in the three questions (the
   "v5:grow" event) grows every bar with a bright pass running left to right.
   Left alone, a soft pass runs across it now and then. Pauses off screen;
   one still frame for reduced motion. */

const ACCENT = [42, 41, 255];
const LIME = [126, 214, 52];

// the shape of the chart, 0…1 for u = 0…1 left to right
function shape(u, c) {
  const s = 0.07 + 0.6 / (1 + Math.exp(-7 * (u - 0.52))) + 0.24 * u;
  const grain = 0.035 * Math.sin(c * 1.7) + 0.03 * Math.sin(c * 0.53 + 1);
  return s + grain;
}

export default function GrowthBars({ className }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let pitch = 12;
    let cols = 0;
    let rows = 0;
    let left = 0;
    let heights = [];
    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const pointer = { x: -9999, k: 0, until: 0 };
    const ripples = []; // { x, y, t }
    const sweeps = []; // { t, a }
    let level = 0;
    let levelTo = 0;
    let lastPoke = 0;
    const now = () => (performance.now() - t0) / 1000;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pitch = w < 640 ? 10 : 12;
      cols = Math.floor(w / pitch);
      rows = Math.floor(h / pitch);
      left = (w - (cols - 1) * pitch) / 2;
      if (heights.length !== cols) heights = new Array(cols).fill(0);
    };

    const dot = (x, y, r, rgb, a) => {
      if (a < 0.01) return;
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${Math.min(1, a).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (tNow, still = false) => {
      const t = still ? 99 : tNow;
      ctx.clearRect(0, 0, w, h);
      level += (levelTo - level) * 0.05;
      const hand = t < pointer.until;
      pointer.k += ((hand ? 1 : 0) - pointer.k) * 0.08;
      if (!reduce && !still && t - lastPoke > 8 && t > 3) {
        sweeps.push({ t, a: 0.6 });
        lastPoke = t;
      }
      while (ripples.length && t - ripples[0].t > 1.8) ripples.shift();
      while (sweeps.length && t - sweeps[0].t > 1.6) sweeps.shift();
      const spread = pitch * (w < 640 ? 3 : 4.5);
      const top = rows - 1;
      const capR = pitch > 10 ? 2.9 : 2.5;

      for (let c = 0; c < cols; c++) {
        const u = c / Math.max(1, cols - 1);
        const x = left + c * pitch;
        // columns boot up left to right on load
        const boot = still
          ? 1
          : Math.min(1, Math.max(0, (t * 1.5 - u * 0.9) / 0.5));
        const eased = 1 - (1 - boot) ** 3;
        const lift =
          pointer.k *
          3.2 *
          Math.exp(-((x - pointer.x) ** 2) / (2 * spread ** 2));
        const breathe = still ? 0 : 0.3 * Math.sin(t * 1.4 + c * 0.37);
        const goal =
          Math.min(1, Math.max(0.03, shape(u, c) * (0.62 + 0.38 * level))) *
            top *
            eased +
          lift +
          breathe;
        heights[c] += (goal - heights[c]) * (still ? 1 : 0.14);
        const hc = Math.max(0, Math.min(top, heights[c]));
        const cap = Math.floor(hc);
        let glow = lift / 3.2;
        for (const sw of sweeps) {
          const at = -0.15 + (t - sw.t) * 0.9;
          glow += sw.a * Math.exp(-((u - at) ** 2) / 0.004);
        }
        const edge = Math.min(1, x / (w * 0.06), (w - x) / (w * 0.06));

        for (let r = 0; r <= top; r++) {
          const y = h - pitch / 2 - r * pitch;
          let ring = 0;
          for (const rp of ripples) {
            const age = t - rp.t;
            const d = Math.hypot(x - rp.x, y - rp.y) - age * 360;
            ring += Math.exp(-(d * d) / 220) * Math.exp(-age * 2.2);
          }
          if (r < cap || (r === cap && hc > 0.2)) {
            if (r === cap) {
              dot(x, y, capR + glow * 0.6, LIME, (0.95 + ring) * edge);
            } else {
              // bars fade toward their base so the chart stays light
              const k = (r + 1) / (cap + 1);
              const a =
                (0.14 + 0.62 * k ** 1.3 + glow * 0.3 + ring * 0.5) * edge;
              dot(x, y, 1.7 + glow * 0.4, ACCENT, a);
            }
          } else {
            // the empty grid fades out toward the top of the band
            const fade = Math.min(1, ((top - r) / top) * 2.2);
            const a = (0.075 * fade + ring * 0.6 + glow * 0.04) * edge;
            dot(x, y, 1.25 + ring * 0.8, ACCENT, a);
          }
        }
      }
    };

    const loop = () => {
      draw(now());
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    size();
    draw(0, reduce);
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      size();
      if (!running) draw(now(), reduce);
    });
    ro.observe(canvas);

    // The mouse works anywhere in the hero; a finger only on the chart, and
    // only sideways, so the page still scrolls everywhere else.
    const host = canvas.closest("section") ?? canvas.parentElement;
    const field = canvas.parentElement;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const point = (x, hold) => {
      pointer.x = x;
      pointer.until = now() + hold;
      lastPoke = now();
      start();
    };
    const onMove = (e) => {
      if (e.pointerType !== "touch") point(local(e)[0], 30);
    };
    const onLeave = () => {
      pointer.until = 0;
    };
    const onFieldMove = (e) => {
      if (e.pointerType === "touch") point(local(e)[0], 2.5);
    };
    const ripple = (x, y) => {
      ripples.push({ x, y, t: now() });
      if (ripples.length > 4) ripples.shift();
      lastPoke = now();
      start();
    };
    let touch = null;
    const onDown = (e) => {
      if (e.pointerType === "touch") touch = local(e);
      else ripple(...local(e));
    };
    const onUp = (e) => {
      if (e.pointerType !== "touch" || !touch) return;
      const [x, y] = local(e);
      if (Math.hypot(x - touch[0], y - touch[1]) < 12) {
        ripple(x, y);
        point(x, 2.5);
      }
      touch = null;
    };
    const onGrow = (e) => {
      levelTo = Math.max(0, Math.min(1, e.detail?.level ?? 0));
      sweeps.push({ t: now(), a: e.detail?.done ? 1.4 : 1 });
      lastPoke = now();
      if (reduce) {
        level = levelTo;
        draw(now(), true);
      }
    };
    host?.addEventListener("pointermove", onMove);
    host?.addEventListener("pointerleave", onLeave);
    host?.addEventListener("pointerdown", onDown);
    host?.addEventListener("pointerup", onUp);
    field?.addEventListener("pointermove", onFieldMove);
    window.addEventListener("v5:grow", onGrow);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      host?.removeEventListener("pointerdown", onDown);
      host?.removeEventListener("pointerup", onUp);
      field?.removeEventListener("pointermove", onFieldMove);
      window.removeEventListener("v5:grow", onGrow);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
