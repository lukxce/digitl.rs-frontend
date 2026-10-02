"use client";

import { useEffect, useRef } from "react";

/* A terrain of points seen in perspective whose ridge is a rising growth
   line: low on the left, high on the right, slow waves through it.

   It reads like a chart you can touch. A marker rides the line and names the
   stretch it is on — our four steps, then growth — and the points around it
   light up. The marker follows the mouse anywhere in the hero, a finger
   dragged across the field, or, left alone, walks the line by itself. A
   click or tap sends a ripple through the points, and every answer in the
   three questions (the "v5:grow" event) sends a wave up the line and lifts
   its right side, so the plan visibly grows the curve. Pauses off screen;
   one still frame for reduced motion. */

const COLS = 112;
const ROWS = 40;
const RIDGE = Math.round(0.5 * (ROWS - 1));

const STOPS = [
  [0, [176, 175, 255]],
  [0.55, [42, 41, 255]],
  [1, [88, 196, 26]],
];
const alphaOf = (near, tone) => (0.22 + 0.78 * near) * (0.45 + 0.55 * tone);

// Where along the line each step sits (0…1, left to right).
export const STRETCHES = [
  { to: 0.2, no: "1", name: "Razumevanje" },
  { to: 0.4, no: "2", name: "Planiranje" },
  { to: 0.6, no: "3", name: "Lansiranje" },
  { to: 0.84, no: "4", name: "Optimizacija" },
  { to: 1.01, no: "↗", name: "Rast" },
];
const stretchAt = (u) => STRETCHES.find((s) => u < s.to) ?? STRETCHES[4];

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

function colourAt(v) {
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (v <= p1) {
      const k = (v - p0) / (p1 - p0);
      return c0.map((c, j) => Math.round(c + (c1[j] - c) * k));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export default function GrowthField({ className, markerRef, horizon = 0.45 }) {
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

    // the marker: where it is (u, 0…1 along the line) and who drives it
    const mark = { u: 0.08, auto: 0.08, manual: -1, until: 0, label: "" };
    const ripples = []; // { x, y, t }
    const surges = []; // { t, a }
    let boost = 0;
    let boostTo = 0;
    let lastPoke = 0;
    let crestX = []; // screen x of each ridge column, from the last frame

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // u of the ridge column nearest a screen x
    const uAtX = (x) => {
      if (!crestX.length) return -1;
      let best = 0;
      for (let c = 1; c < crestX.length; c++)
        if (Math.abs(crestX[c] - x) < Math.abs(crestX[best] - x)) best = c;
      return best / (COLS - 1);
    };

    const draw = (now) => {
      const t = (now - t0) / 1000;
      const dt = Math.min(0.05, Math.max(0, t - last));
      last = t;
      const rise = reduce ? 1 : 1 - (1 - Math.min(1, t / 2.4)) ** 3;
      ctx.clearRect(0, 0, w, h);
      const narrow = w < 700;
      const f = narrow ? w * 1.3 : Math.min(w * 0.9, h * 2.6);
      const hz = h * horizon;
      const camY = 1.15;
      const spanX = narrow ? 0.95 : 1.45;
      const cx = w * 0.5;

      // marker: a hand drives it while present, otherwise it walks the line
      const handed = mark.manual >= 0 && t < mark.until;
      if (handed) mark.auto = mark.u;
      else if (!reduce && rise > 0.9) {
        mark.auto += dt * 0.055;
        if (mark.auto > 1.06) mark.auto = -0.04;
      }
      const target = handed ? mark.manual : mark.auto;
      // jump instead of sweeping back across the whole line on a loop
      if (Math.abs(target - mark.u) > 0.5) mark.u = target;
      else mark.u += (target - mark.u) * (handed ? 0.2 : 0.1);
      const mu = Math.round(Math.max(0, Math.min(1, mark.u)) * (COLS - 1));

      boost += (boostTo - boost) * 0.04;
      if (!reduce && t - lastPoke > 9 && rise > 0.99) {
        surges.push({ t, a: 0.55 });
        lastPoke = t;
      }
      while (ripples.length && t - ripples[0].t > 2.2) ripples.shift();
      while (surges.length && t - surges[0].t > 1.6) surges.shift();

      const crest = new Array(COLS).fill(null);
      const markX = crestX[mu] ?? -9999;

      for (let r = ROWS - 1; r >= 0; r--) {
        const z = r / (ROWS - 1);
        const depth = 1.1 + z * 3.4;
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1)) * 2 - 1;
          const y =
            heightAt(x, z, t) *
            rise *
            (1 + boost * 0.32 * ((x + 1) / 2) ** 1.5);
          const sx = cx + ((x * spanX) / depth) * f;
          let sy = hz + ((camY - y * 1.75) / depth) * f * 0.42;
          // the stretch under the marker lights up, nearest rows most
          const lit =
            Math.exp(-((sx - markX) ** 2) / (narrow ? 900 : 2200)) *
            (1 - z * 0.55);
          let lift = 10 * lit;
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
          const tone = Math.min(
            1,
            Math.max(0, y / 1.05 + lift / 80 + lit * 0.35),
          );
          const near = 1 - z;
          const edge = Math.min(1, (sx / w) * 7, ((w - sx) / w) * 7);
          const a = Math.min(1, alphaOf(near, tone) * edge * (1 + lit * 0.8));
          const col = colourAt(tone);
          const s = (1 + near * 2.2) * (1 + tone * 0.5) * (1 + lit * 0.5);
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a.toFixed(3)})`;
          ctx.fillRect(sx - s / 2, sy - s / 2, s, s);
        }
      }
      crestX = crest.map((p) => p[0]);

      // the growth line
      const pts = crest.filter((p) => p[0] > -20 && p[0] < w + 20);
      if (pts.length > 2) {
        const g = ctx.createLinearGradient(
          pts[0][0],
          0,
          pts[pts.length - 1][0],
          0,
        );
        g.addColorStop(0, "rgba(42,41,255,0)");
        g.addColorStop(0.5, "rgba(42,41,255,0.85)");
        g.addColorStop(1, "rgba(88,196,26,1)");
        ctx.save();
        ctx.strokeStyle = g;
        ctx.lineWidth = 2.2 + boost * 0.8;
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(42,41,255,0.35)";
        ctx.shadowBlur = 12 + boost * 10;
        ctx.beginPath();
        pts.forEach(([x, y], i) =>
          i ? ctx.lineTo(x, y - 6) : ctx.moveTo(x, y - 6),
        );
        ctx.stroke();
        ctx.restore();
      }

      // the marker: a hairline down, a dot on the line, a label above
      const p = crest[mu];
      const show = p && mark.u >= 0 && mark.u <= 1 && rise > 0.9;
      const el = markerRef?.current;
      if (show) {
        const [px, py0] = p;
        const py = py0 - 6;
        const hair = ctx.createLinearGradient(0, py, 0, h);
        hair.addColorStop(0, "rgba(42,41,255,0.45)");
        hair.addColorStop(1, "rgba(42,41,255,0)");
        ctx.save();
        ctx.strokeStyle = hair;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(px, py + 8);
        ctx.lineTo(px, h);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(42,41,255,0.14)";
        ctx.beginPath();
        ctx.arc(px, py, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = mark.u > 0.84 ? "rgb(88,196,26)" : "rgb(42,41,255)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        if (el) {
          const half = narrow ? 62 : 80;
          const lx = Math.max(half, Math.min(w - half, px));
          el.style.transform = `translate(${lx.toFixed(1)}px, ${(py - 16).toFixed(1)}px)`;
          const s = stretchAt(mark.u);
          if (mark.label !== s.name) {
            mark.label = s.name;
            el.firstChild.textContent = s.no;
            el.lastChild.textContent = s.name;
            el.dataset.end = s.no === "↗" ? "true" : "false";
          }
          el.dataset.on = "true";
        }
      } else if (el) el.dataset.on = "false";
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
    if (reduce) draw(performance.now() + 5000); // crest known: place marker
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

    // The mouse drives the marker anywhere in the hero (over the headline or
    // the questions too); a finger drives it only on the field itself, so
    // scrolling the page still works everywhere else.
    const host = canvas.closest("section") ?? canvas.parentElement;
    const field = canvas.parentElement;
    const now = () => (performance.now() - t0) / 1000;
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const steer = (x, hold) => {
      const u = uAtX(x);
      if (u < 0) return;
      mark.manual = u;
      mark.until = now() + hold;
      lastPoke = now();
      start();
    };
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      steer(local(e)[0], 30);
    };
    // the mouse left the hero: let the marker walk on from where it is
    const onLeave = () => {
      mark.until = 0;
    };
    const onFieldMove = (e) => {
      if (e.pointerType === "touch") steer(local(e)[0], 3);
    };
    const ripple = (x, y) => {
      ripples.push({ x, y, t: now() });
      if (ripples.length > 5) ripples.shift();
      lastPoke = now();
      start();
    };
    // a mouse click ripples at once; a finger only on a tap, not a scroll
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
        steer(x, 3);
      }
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
  }, [horizon, markerRef]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
