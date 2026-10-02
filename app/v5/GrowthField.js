"use client";

import { useEffect, useRef } from "react";

/* A terrain of points seen in perspective. Its height is a rising revenue
   curve (low on the left, high on the right) with slow waves through it. It
   answers the reader: it swells and gathers under the cursor anywhere in the
   hero, a click or tap sends a ripple through it, and every answer in the
   three questions (a "v5:grow" event) sends a wave up the curve and lifts the
   right side, so the plan visibly grows the line. One ridge row is traced as
   the trend line, and any [data-at] element inside `anchorRoot` is pinned to
   it (at = 0…1 from left to right). Pauses off screen; a still frame for
   reduced motion. */

const COLS = 112;
const ROWS = 40;
const RIDGE = Math.round(0.5 * (ROWS - 1));

const THEMES = {
  light: {
    stops: [
      [0, [176, 175, 255]],
      [0.55, [42, 41, 255]],
      [1, [88, 196, 26]],
    ],
    alpha: (near, tone) => (0.22 + 0.78 * near) * (0.45 + 0.55 * tone),
    line: ["rgba(42,41,255,0)", "rgba(42,41,255,0.85)", "rgba(88,196,26,1)"],
    glow: "rgba(42,41,255,0.35)",
  },
  blue: {
    stops: [
      [0, [150, 150, 255]],
      [0.6, [255, 255, 255]],
      [1, [158, 243, 74]],
    ],
    alpha: (near, tone) => (0.2 + 0.7 * near) * (0.4 + 0.6 * tone),
    line: [
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0.8)",
      "rgba(158,243,74,1)",
    ],
    glow: "rgba(158,243,74,0.5)",
  },
};

function heightAt(x, z, t) {
  // An S-curve plus a steady climb, so the line never flattens at the end.
  const growth =
    0.05 + 0.72 / (1 + Math.exp(-4.6 * (x - 0.05))) + 0.16 * (x + 1);
  const ridge = 0.32 + 0.68 * Math.exp(-((z - 0.5) ** 2) / 0.07);
  const waves =
    0.032 * Math.sin(5.5 * x + t * 0.7 + z * 4) +
    0.03 * Math.sin(8 * z - t * 0.5 + x * 2);
  return growth * ridge + waves * (0.4 + growth);
}

function colourAt(stops, v) {
  for (let i = 1; i < stops.length; i++) {
    const [p1, c1] = stops[i];
    const [p0, c0] = stops[i - 1];
    if (v <= p1) {
      const k = (v - p0) / (p1 - p0);
      return c0.map((c, j) => Math.round(c + (c1[j] - c) * k));
    }
  }
  return stops[stops.length - 1][1];
}

export default function GrowthField({
  className,
  theme = "light",
  horizon = 0.56,
  anchorRoot,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const th = THEMES[theme];
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999, sx: 0, sy: 0, k: 0 };
    const ripples = []; // { x, y, t } in canvas pixels / seconds
    const surges = []; // { t, a } waves that run up the curve
    let boost = 0;
    let boostTo = 0;
    let lastPoke = 0;
    const t0 = performance.now();
    const anchors = () =>
      anchorRoot?.current
        ? [...anchorRoot.current.querySelectorAll("[data-at]")]
        : [];

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const rise = reduce ? 1 : 1 - (1 - Math.min(1, t / 2.4)) ** 3;
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 700;
      const f = narrow ? w * 1.3 : Math.min(w * 0.9, h * 2.6);
      const hz = h * horizon;
      const camY = 1.15;
      const spanX = narrow ? 0.95 : 1.45;
      const cx = w * 0.5;
      const inside = mouse.x > -999;
      mouse.k += ((inside ? 1 : 0) - mouse.k) * 0.06;
      if (inside) {
        // a soft trail behind the real pointer
        mouse.sx += (mouse.x - mouse.sx) * 0.14;
        mouse.sy += (mouse.y - mouse.sy) * 0.14;
      }
      boost += (boostTo - boost) * 0.04;
      // when nobody has touched it for a while, a quiet wave shows it is alive
      if (!reduce && t - lastPoke > 9 && rise > 0.99) {
        surges.push({ t, a: 0.55 });
        lastPoke = t;
      }
      while (ripples.length && t - ripples[0].t > 2.2) ripples.shift();
      while (surges.length && t - surges[0].t > 1.6) surges.shift();
      const crest = new Array(COLS).fill(null);

      for (let r = ROWS - 1; r >= 0; r--) {
        const z = r / (ROWS - 1);
        const depth = 1.1 + z * 3.4;
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1)) * 2 - 1;
          // answers lift the right-hand side: the plan grows the curve
          const y =
            heightAt(x, z, t) *
            rise *
            (1 + boost * 0.32 * ((x + 1) / 2) ** 1.5);
          let sx = cx + ((x * spanX) / depth) * f;
          let sy = hz + ((camY - y * 1.75) / depth) * f * 0.42;
          const dx = sx - mouse.sx;
          const dy = sy - mouse.sy;
          const pull = mouse.k * Math.exp(-(dx * dx + dy * dy) / 26000);
          let lift = 54 * pull;
          sx -= dx * 0.12 * pull; // points gather toward the cursor
          for (const rp of ripples) {
            const age = t - rp.t;
            const ring = Math.hypot(sx - rp.x, sy - rp.y) - age * 520;
            lift += 30 * Math.exp(-(ring * ring) / 1100) * Math.exp(-age * 1.5);
          }
          for (const sg of surges) {
            const at = -1.35 + (t - sg.t) * 2.1;
            lift +=
              sg.a * 46 * Math.exp(-((x - at) ** 2) / 0.025) * (1 - z * 0.5);
          }
          sy -= lift;
          if (r === RIDGE) crest[c] = [sx, sy];
          if (sx < -10 || sx > w + 10 || sy > h + 10 || sy < -10) continue;
          const tone = Math.min(1, Math.max(0, y / 1.05 + lift / 80));
          const near = 1 - z;
          const edge = Math.min(1, (sx / w) * 7, ((w - sx) / w) * 7);
          const a = th.alpha(near, tone) * edge;
          const col = colourAt(th.stops, tone);
          const s = (1 + near * 2.2) * (1 + tone * 0.5);
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        }
      }

      const pts = crest.filter((p) => p && p[0] > -20 && p[0] < w + 20);
      if (pts.length > 2) {
        const g = ctx.createLinearGradient(
          pts[0][0],
          0,
          pts[pts.length - 1][0],
          0,
        );
        g.addColorStop(0, th.line[0]);
        g.addColorStop(0.5, th.line[1]);
        g.addColorStop(1, th.line[2]);
        ctx.save();
        ctx.strokeStyle = g;
        ctx.lineWidth = 2.2 + boost * 0.8;
        ctx.lineJoin = "round";
        ctx.shadowColor = th.glow;
        ctx.shadowBlur = 12 + boost * 10;
        ctx.beginPath();
        pts.forEach(([x, y], i) =>
          i ? ctx.lineTo(x, y - 6) : ctx.moveTo(x, y - 6),
        );
        ctx.stroke();
        ctx.restore();
      }

      // Pin the milestone chips to the line.
      for (const el of anchors()) {
        const p = crest[Math.round(Number(el.dataset.at) * (COLS - 1))];
        if (!p) continue;
        el.style.transform = `translate(${p[0].toFixed(1)}px, ${(p[1] - 6).toFixed(1)}px)`;
        el.dataset.ready = rise > 0.98 ? "true" : "false";
      }
    };

    const loop = (now) => {
      draw(now);
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
    draw(performance.now() + (reduce ? 5000 : 0));
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      size();
      if (!running) draw(performance.now() + 5000);
    });
    ro.observe(canvas);
    // The whole section listens, so the field answers the cursor even over
    // the headline or the questions that sit on top of it.
    const host = canvas.closest("section") ?? canvas.parentElement;
    const now = () => (performance.now() - t0) / 1000;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const [x, y] = local(e);
      if (mouse.x < -999) {
        mouse.sx = x;
        mouse.sy = y;
      }
      mouse.x = x;
      mouse.y = y;
      lastPoke = now();
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const ripple = (x, y) => {
      ripples.push({ x, y, t: now() });
      if (ripples.length > 5) ripples.shift();
      lastPoke = now();
      start();
    };
    // A mouse click ripples at once; a finger only on a tap, not when it
    // starts a scroll.
    let touch = null;
    const onDown = (e) => {
      if (e.pointerType === "touch") touch = local(e);
      else ripple(...local(e));
    };
    const onUp = (e) => {
      if (e.pointerType !== "touch" || !touch) return;
      const [x, y] = local(e);
      if (Math.hypot(x - touch[0], y - touch[1]) < 12) ripple(x, y);
      touch = null;
    };
    const onGrow = (e) => {
      boostTo = Math.max(0, Math.min(1, e.detail?.level ?? 0));
      surges.push({ t: now(), a: e.detail?.done ? 1.5 : 1 });
      lastPoke = now();
    };
    host?.addEventListener("pointermove", onMove);
    host?.addEventListener("pointerleave", onLeave);
    host?.addEventListener("pointerdown", onDown);
    host?.addEventListener("pointerup", onUp);
    window.addEventListener("v5:grow", onGrow);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
      host?.removeEventListener("pointerdown", onDown);
      host?.removeEventListener("pointerup", onUp);
      window.removeEventListener("v5:grow", onGrow);
    };
  }, [theme, horizon, anchorRoot]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
