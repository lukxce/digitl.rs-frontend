"use client";

import { useEffect, useRef } from "react";

/* The hero's growth line with traffic on it. Hundreds of small particles,
   visitors, stream from low on the left to high on the right along a rising
   line, fanning out as they climb. On the way up some of them turn lime and
   become customers; the rest drift off and fade. It is always moving, and
   it answers the reader: the stream flows around the pointer like water
   round a stone (a finger drawn sideways does the same), a click or tap
   throws a burst of lime sparks, and each answer in the three questions
   (the "v5:grow" event) makes the stream faster and wider, with more of it
   turning lime. Pauses off screen; one still frame for reduced motion. */

const BLUE = [42, 41, 255];
const SOFT = [150, 150, 255];
const LIME = [110, 205, 40];
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;

export default function GrowthFlow({ className }) {
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
    let last = 0;
    const pointer = { x: -9999, y: -9999, k: 0, until: 0 };
    const sparks = []; // { x, y, vx, vy, t }
    let level = 0;
    let levelTo = 0;
    let surge = 0;
    let parts = [];
    const now = () => (performance.now() - t0) / 1000;

    const spawn = (anywhere) => ({
      s: anywhere ? Math.random() : -Math.random() * 0.05,
      o: (Math.random() * 2 - 1) * Math.random() ** 0.6, // denser at the middle
      v: 0.07 + Math.random() * 0.08,
      ph: Math.random() * Math.PI * 2,
      r: Math.random(), // decides who becomes a customer
      size: 0.9 + Math.random() * 1.2,
      px: null,
      py: null,
    });

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const want = Math.round(Math.min(1100, Math.max(300, w * 0.76)));
      while (parts.length < want) parts.push(spawn(true));
      parts.length = want;
    };

    // the line everything flows along, and how wide the stream is there
    const centre = (s) => {
      const climb = 0.8 / (1 + Math.exp(-7 * (s - 0.48))) + 0.2 * s;
      return h * (0.86 - 0.68 * climb * (1 + level * 0.22 * s ** 1.3));
    };
    const spread = (s) => h * (0.045 + 0.44 * s ** 1.2) * (1 + level * 0.2);

    const draw = (tNow, still = false) => {
      const t = still ? 30 : tNow;
      const dt = still ? 0 : Math.min(0.05, Math.max(0, t - last));
      last = t;
      ctx.clearRect(0, 0, w, h);
      level += (levelTo - level) * 0.04;
      surge *= 0.96;
      const hand = t < pointer.until;
      pointer.k += ((hand ? 1 : 0) - pointer.k) * 0.1;
      const reach = w < 640 ? 54 : 78;
      const appear = still ? 1 : Math.min(1, t / 1.2);
      const convert = 0.32 + level * 0.33; // share that turns into customers

      // the growth line itself
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(42,41,255,0)");
      g.addColorStop(0.2, "rgba(42,41,255,0.55)");
      g.addColorStop(0.7, "rgba(42,41,255,0.75)");
      g.addColorStop(1, "rgba(110,205,40,0.9)");
      ctx.save();
      ctx.strokeStyle = g;
      ctx.lineWidth = 2 + level * 0.6;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(42,41,255,0.25)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let x = 0; x <= w * appear; x += 6) {
        const y = centre(x / w);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.lineCap = "round";
      for (const p of parts) {
        p.s += p.v * dt * (1 + level * 0.6 + surge);
        p.o += Math.sin(t * 0.8 + p.ph) * dt * 0.08;
        if (p.s > 1.04) {
          Object.assign(p, spawn(false));
          continue;
        }
        if (p.s < 0) continue;
        const s = p.s;
        let x = s * w;
        let y =
          centre(s) +
          p.o * spread(s) +
          h * 0.012 * Math.sin(s * 11 + t * 1.2 + p.ph);
        // flow around the pointer like water round a stone
        if (pointer.k > 0.01) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < reach) {
            const push = (1 - d / reach) ** 2 * reach * 0.9 * pointer.k;
            x += (dx / d) * push * 0.6;
            y += (dy / d) * push;
          }
        }
        // past the middle, customers turn lime; the others drift off
        const customer = p.r < convert;
        const late = Math.max(0, (s - 0.5) / 0.5);
        const col = customer
          ? mix(BLUE, LIME, Math.min(1, late * 1.6))
          : mix(BLUE, SOFT, late);
        let a = Math.min(1, s / 0.12) * (1 - Math.max(0, (s - 0.94) / 0.1));
        if (!customer) a *= 1 - late * 0.75;
        a *= 0.35 + 0.5 * (1 - Math.abs(p.o) * 0.6) + surge * 0.3;
        if (p.px === null || still) {
          p.px = x - 6;
          p.py = y + 2;
        }
        ctx.strokeStyle = rgba(col, Math.max(0, a));
        ctx.lineWidth = p.size * (customer && late > 0.4 ? 1.35 : 1);
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(x, y);
        ctx.stroke();
        // keep a short tail, not the whole path
        p.px = x - (x - p.px) * 0.62 - 2;
        p.py = y - (y - p.py) * 0.62;
      }

      // sparks from a click or tap
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        const age = t - sp.t;
        if (age > 1.1) {
          sparks.splice(i, 1);
          continue;
        }
        const k = 1 - age / 1.1;
        const x = sp.x + sp.vx * age;
        const y = sp.y + sp.vy * age + 30 * age * age;
        ctx.fillStyle = rgba(LIME, k);
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + 1.6 * k, 0, Math.PI * 2);
        ctx.fill();
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

    // The mouse works anywhere in the hero; a finger only on the stream, and
    // only sideways, so the page still scrolls everywhere else.
    const host = canvas.closest("section") ?? canvas.parentElement;
    const field = canvas.parentElement;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const point = ([x, y], hold) => {
      pointer.x = x;
      pointer.y = y;
      pointer.until = now() + hold;
      start();
    };
    const onMove = (e) => {
      if (e.pointerType !== "touch") point(local(e), 30);
    };
    const onLeave = () => {
      pointer.until = 0;
    };
    const onFieldMove = (e) => {
      if (e.pointerType === "touch") point(local(e), 1.2);
    };
    const burst = ([x, y]) => {
      const t = now();
      for (let i = 0; i < 26; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 40 + Math.random() * 120;
        sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, t });
      }
      if (sparks.length > 140) sparks.splice(0, sparks.length - 140);
      surge = Math.min(1.2, surge + 0.5);
      start();
    };
    let touch = null;
    const onDown = (e) => {
      if (e.pointerType === "touch") touch = local(e);
      else burst(local(e));
    };
    const onUp = (e) => {
      if (e.pointerType !== "touch" || !touch) return;
      const p = local(e);
      if (Math.hypot(p[0] - touch[0], p[1] - touch[1]) < 12) burst(p);
      touch = null;
    };
    const onGrow = (e) => {
      levelTo = Math.max(0, Math.min(1, e.detail?.level ?? 0));
      surge = Math.min(1.6, surge + (e.detail?.done ? 1.4 : 0.9));
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
