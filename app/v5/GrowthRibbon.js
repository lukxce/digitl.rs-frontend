"use client";

import { useEffect, useRef } from "react";

/* The hero's growth line as a ribbon: fine dotted strands that run from low
   on the left to high on the right, fanning out as they climb, with one
   solid line through the middle. It flows gently on its own and answers the
   reader: the strands part around the pointer (or a finger drawn sideways
   across it), a click or tap sends a wave along them both ways, and each
   answer in the three questions (the "v5:grow" event) lifts and widens the
   ribbon with a pulse running up it. Pauses off screen; one still frame for
   reduced motion. */

const BLUE = [42, 41, 255];
const LIME = [110, 200, 40];
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

export default function GrowthRibbon({ className }) {
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
    let raf = 0;
    let running = false;
    const t0 = performance.now();
    const pointer = {
      x: -9999,
      y: -9999,
      sx: -9999,
      sy: -9999,
      k: 0,
      until: 0,
    };
    const waves = []; // { x, t } taps: a wave both ways along the ribbon
    const pulses = []; // { t, a } answers: a pulse running up the ribbon
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
    };

    // y of strand i (−k…k) at u (0…1), before the pointer has its say
    const strandY = (u, i, k, t, narrow) => {
      const steep = narrow ? 6.2 : 7.6;
      const climb = 0.82 / (1 + Math.exp(-steep * (u - 0.5))) + 0.18 * u;
      const lift = 1 + level * 0.28 * u ** 1.4;
      const base = h * (0.9 - 0.66 * climb * lift);
      const fan = h * (0.03 + (narrow ? 0.11 : 0.17) * u) * (1 + level * 0.35);
      const flow =
        h * 0.022 * Math.sin(u * 8.5 - t * 0.9 + i * 0.55) * (0.35 + u) +
        h * 0.012 * Math.sin(u * 3 + t * 0.6 - i * 0.3);
      return (
        base + (i / k) * fan * (1 + 0.18 * Math.sin(t * 0.7 + u * 4 + i)) + flow
      );
    };

    const draw = (tNow, still = false) => {
      const t = still ? 40 : tNow;
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 640;
      const k = narrow ? 4 : 7; // strands each side of the middle
      const step = narrow ? 7 : 8;
      level += (levelTo - level) * 0.05;
      const hand = t < pointer.until;
      pointer.k += ((hand ? 1 : 0) - pointer.k) * 0.08;
      if (hand) {
        pointer.sx += (pointer.x - pointer.sx) * 0.16;
        pointer.sy += (pointer.y - pointer.sy) * 0.16;
      }
      if (!reduce && !still && t - lastPoke > 8 && t > 3) {
        pulses.push({ t, a: 0.6 });
        lastPoke = t;
      }
      while (waves.length && t - waves[0].t > 2) waves.shift();
      while (pulses.length && t - pulses[0].t > 1.8) pulses.shift();
      const draw01 = still ? 1 : Math.min(1, t / 1.6); // drawn in on load
      const reach = narrow ? 46 : 64;

      const yAt = (x, i) => {
        const u = x / w;
        let y = strandY(u, i, k, t, narrow);
        // taps: a wave running both ways from where the finger landed
        for (const wv of waves) {
          const age = t - wv.t;
          const d1 = x - (wv.x + age * 420);
          const d2 = x - (wv.x - age * 420);
          y -=
            h *
            0.09 *
            (Math.exp(-(d1 * d1) / 2600) + Math.exp(-(d2 * d2) / 2600)) *
            Math.exp(-age * 1.6);
        }
        // answers: a pulse running up the ribbon
        for (const p of pulses) {
          const at = -0.15 + (t - p.t) * 0.8;
          y -= h * 0.1 * p.a * Math.exp(-((u - at) ** 2) / 0.006);
        }
        // the pointer parts the strands around itself
        if (pointer.k > 0.01) {
          const dx = x - pointer.sx;
          const dy = y - pointer.sy;
          const near = Math.exp(-(dx * dx + dy * dy) / (2 * reach * reach));
          y += Math.sign(dy || i || 1) * reach * 0.55 * near * pointer.k;
        }
        return y;
      };

      // the strands, outer ones first so the middle sits on top
      const order = [];
      for (let a = k; a >= 1; a--) order.push(-a, a);
      for (const i of order) {
        const strength = 1 - Math.abs(i) / (k + 1);
        for (let x = 0; x <= w * draw01; x += step) {
          const u = x / w;
          // the left end, where the strands bunch up, fades out softly
          const edge = Math.min(1, (u / 0.22) ** 1.5, (1 - u) / 0.07);
          if (edge <= 0) continue;
          const y = yAt(x, i);
          if (y < -4 || y > h + 4) continue;
          const c = mix(BLUE, LIME, Math.max(0, (u - 0.35) / 0.65) ** 1.3);
          const a = (0.12 + 0.5 * strength ** 1.6) * edge;
          ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, 0.9 + 1.1 * strength, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // the middle: one solid line
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(42,41,255,0)");
      g.addColorStop(0.2, "rgba(42,41,255,0.75)");
      g.addColorStop(0.6, "rgba(42,41,255,0.95)");
      g.addColorStop(0.97, "rgba(110,200,40,1)");
      g.addColorStop(1, "rgba(110,200,40,0)");
      ctx.save();
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.4 + level * 0.8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(42,41,255,0.3)";
      ctx.shadowBlur = 10 + level * 8;
      ctx.beginPath();
      for (let x = 0; x <= w * draw01; x += 4) {
        const y = yAt(x, 0);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
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

    // The mouse works anywhere in the hero; a finger only on the ribbon, and
    // only sideways, so the page still scrolls everywhere else.
    const host = canvas.closest("section") ?? canvas.parentElement;
    const field = canvas.parentElement;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const point = ([x, y], hold) => {
      if (pointer.k < 0.05) {
        pointer.sx = x;
        pointer.sy = y;
      }
      pointer.x = x;
      pointer.y = y;
      pointer.until = now() + hold;
      lastPoke = now();
      start();
    };
    const onMove = (e) => {
      if (e.pointerType !== "touch") point(local(e), 30);
    };
    const onLeave = () => {
      pointer.until = 0;
    };
    const onFieldMove = (e) => {
      if (e.pointerType === "touch") point(local(e), 1.5);
    };
    const wave = (x) => {
      waves.push({ x, t: now() });
      if (waves.length > 4) waves.shift();
      lastPoke = now();
      start();
    };
    let touch = null;
    const onDown = (e) => {
      if (e.pointerType === "touch") touch = local(e);
      else wave(local(e)[0]);
    };
    const onUp = (e) => {
      if (e.pointerType !== "touch" || !touch) return;
      const [x, y] = local(e);
      if (Math.hypot(x - touch[0], y - touch[1]) < 12) wave(x);
      touch = null;
    };
    const onGrow = (e) => {
      levelTo = Math.max(0, Math.min(1, e.detail?.level ?? 0));
      pulses.push({ t: now(), a: e.detail?.done ? 1.4 : 1 });
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
