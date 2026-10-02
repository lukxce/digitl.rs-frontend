"use client";

import { useEffect, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h02.module.css";

/* 02 · Usluge u ruci. The services fall into a tray as pills and settle in a
   pile, driven by a small rigid-body engine written for this hero: capsules
   with rotation, sequential impulses with warm starting, friction,
   restitution and whole-world sleeping, so the pile rests without jitter.
   Drag throws a pill; a tap opens a one-line description. */

const PILLS = [
  {
    label: "Plaćeno oglašavanje",
    fs: 27,
    tone: "blue",
    info: "Kampanje na Google-u i mrežama koje donose prodaju, ne samo klikove.",
  },
  {
    label: "Web",
    fs: 32,
    tone: "ink",
    info: "Brzi sajtovi napravljeni da pretvore posetu u upit.",
  },
  {
    label: "Društvene mreže",
    fs: 25,
    tone: "coral",
    info: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
  },
  {
    label: "Strategija",
    fs: 21,
    tone: "white",
    info: "Plan sa jasnim ciljem i budžetom, pre nego što krene prvi oglas.",
  },
  {
    label: "SEO",
    fs: 34,
    tone: "lime",
    info: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
  },
  {
    label: "Analitika",
    fs: 22,
    tone: "soft",
    info: "Merenje koje pokazuje šta donosi novac, a šta samo troši budžet.",
  },
  {
    label: "Sadržaj",
    fs: 20,
    tone: "white",
    info: "Tekstovi, fotografije i video koji odgovaraju na prava pitanja kupaca.",
  },
  {
    label: "Google oglasi",
    fs: 23,
    tone: "white",
    info: "Pretraga, Shopping i YouTube, vođeni prema ceni upita, ne ceni klika.",
  },
  {
    label: "Brend",
    fs: 29,
    tone: "white",
    info: "Pozicioniranje i vizuelni sistem ispod svega.",
  },
  {
    label: "Meta oglasi",
    fs: 21,
    tone: "coralSoft",
    info: "Facebook i Instagram kampanje koje ciljaju kupce, ne samo pratioce.",
  },
  {
    label: "AI pretraga",
    fs: 19,
    tone: "lav",
    info: "Sajt i sadržaj uređeni tako da vas AI asistenti navode kao izvor.",
  },
  {
    label: "Rast",
    fs: 44,
    tone: "lime",
    arrow: true,
    info: "Jedini broj koji na kraju meseca gledamo: koliko vam je marketing doneo.",
  },
];

/* ---------- physics ---------- */

const DT = 1 / 180;
const ITER = 14;
const GRAVITY = 2600;
const SLOP = 0.6;
const BAUMGARTE = 0.3;
const MAX_BIAS = 520;
const RESTITUTION = 0.25;
const REST_MIN = 200;
const MU_PAIR = 0.65;
const MU_WALL = 0.7;
const MAX_V = 2800;
const MAX_W = 22;
const SLEEP_V = 12;
const SLEEP_T = 0.55;
const FLIP = Math.PI / 2 + 0.16;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

function setShape(b, w, h) {
  b.wPx = w;
  b.hPx = h;
  b.r = h / 2;
  b.hl = Math.max(0.5, (w - h) / 2);
  // mass grows with the square root of the area: big pills still feel
  // heavier, but the mass ratios stay small enough for a firm stack
  b.m = Math.sqrt(4 * b.hl * b.r + Math.PI * b.r * b.r) * 0.05;
  b.invM = 1 / b.m;
  b.invI = 12 / (b.m * (w * w + h * h));
}

function closestOnSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  let t = len > 0 ? ((px - ax) * dx + (py - ay) * dy) / len : 0;
  t = clamp(t, 0, 1);
  return [ax + dx * t, ay + dy * t];
}

function segIntersect(a, b) {
  const rx = a.x1 - a.x0;
  const ry = a.y1 - a.y0;
  const sx = b.x1 - b.x0;
  const sy = b.y1 - b.y0;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const qx = b.x0 - a.x0;
  const qy = b.y0 - a.y0;
  const t = (qx * sy - qy * sx) / den;
  const u = (qx * ry - qy * rx) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return [a.x0 + rx * t, a.y0 + ry * t];
}

function updateEnds(b) {
  const c = Math.cos(b.a);
  const sn = Math.sin(b.a);
  b.ux = c;
  b.uy = sn;
  b.x0 = b.x - c * b.hl;
  b.y0 = b.y - sn * b.hl;
  b.x1 = b.x + c * b.hl;
  b.y1 = b.y + sn * b.hl;
  b.ex = Math.abs(c) * b.hl + b.r;
  b.ey = Math.abs(sn) * b.hl + b.r;
}

function contact(i, j, nx, ny, px, py, pen, mu, key) {
  return { i, j, nx, ny, px, py, pen, mu, key, pn: 0, pt: 0 };
}

function collide(world) {
  const { bodies, W, H } = world;
  const out = [];
  const n = bodies.length;
  for (let i = 0; i < n; i++) {
    const b = bodies[i];
    if (!b.live) continue;
    updateEnds(b);
  }
  for (let i = 0; i < n; i++) {
    const b = bodies[i];
    if (!b.live) continue;
    for (let k = 0; k < 2; k++) {
      const ex = k ? b.x1 : b.x0;
      const ey = k ? b.y1 : b.y0;
      const base = (i * 16 + 15) * 16 + k * 4;
      let pen = ey + b.r - H;
      if (pen > 0)
        out.push(contact(i, -1, 0, 1, ex, H + pen / 2, pen, MU_WALL, base));
      pen = b.r - ex;
      if (pen > 0)
        out.push(contact(i, -1, -1, 0, -pen / 2, ey, pen, MU_WALL, base + 1));
      pen = ex + b.r - W;
      if (pen > 0)
        out.push(contact(i, -1, 1, 0, W + pen / 2, ey, pen, MU_WALL, base + 2));
      if (b.inside) {
        pen = b.r - ey;
        if (pen > 0)
          out.push(contact(i, -1, 0, -1, ex, -pen / 2, pen, MU_WALL, base + 3));
      }
    }
  }
  const cands = [];
  for (let i = 0; i < n; i++) {
    const A = bodies[i];
    if (!A.live) continue;
    for (let j = i + 1; j < n; j++) {
      const B = bodies[j];
      if (!B.live) continue;
      if (Math.abs(A.x - B.x) > A.ex + B.ex) continue;
      if (Math.abs(A.y - B.y) > A.ey + B.ey) continue;
      const R = A.r + B.r;
      const R2 = R * R;
      cands.length = 0;
      for (let k = 0; k < 2; k++) {
        const px = k ? A.x1 : A.x0;
        const py = k ? A.y1 : A.y0;
        const [qx, qy] = closestOnSeg(px, py, B.x0, B.y0, B.x1, B.y1);
        const d2 = (qx - px) ** 2 + (qy - py) ** 2;
        if (d2 < R2) cands.push([px, py, qx, qy, d2, k]);
      }
      for (let k = 0; k < 2; k++) {
        const px = k ? B.x1 : B.x0;
        const py = k ? B.y1 : B.y0;
        const [qx, qy] = closestOnSeg(px, py, A.x0, A.y0, A.x1, A.y1);
        const d2 = (qx - px) ** 2 + (qy - py) ** 2;
        if (d2 < R2) cands.push([qx, qy, px, py, d2, 2 + k]);
      }
      if (!cands.length) {
        const hit = segIntersect(A, B);
        if (hit) cands.push([hit[0], hit[1], hit[0], hit[1], 0, 4]);
      }
      if (!cands.length) continue;
      cands.sort((p, q) => p[4] - q[4]);
      const minR = Math.min(A.r, B.r) * 0.6;
      const kept = [];
      for (const c of cands) {
        if (kept.length === 2) break;
        const d = Math.sqrt(c[4]);
        let nx;
        let ny;
        if (d > 1e-4) {
          nx = (c[2] - c[0]) / d;
          ny = (c[3] - c[1]) / d;
        } else {
          nx = -A.uy;
          ny = A.ux;
          if (nx * (B.x - A.x) + ny * (B.y - A.y) < 0) {
            nx = -nx;
            ny = -ny;
          }
        }
        const pen = R - d;
        const px = (c[0] + nx * A.r + c[2] - nx * B.r) / 2;
        const py = (c[1] + ny * A.r + c[3] - ny * B.r) / 2;
        let near = false;
        for (const k of kept)
          if ((k.px - px) ** 2 + (k.py - py) ** 2 < minR * minR) near = true;
        if (near) continue;
        kept.push(
          contact(
            i,
            j,
            nx,
            ny,
            px,
            py,
            pen,
            MU_PAIR,
            (i * 16 + j) * 16 + 8 + c[5],
          ),
        );
      }
      for (const k of kept) out.push(k);
    }
  }
  return out;
}

function step(world, dt) {
  const { bodies } = world;
  const g = world.g;
  const angDamp = 1 / (1 + dt * 2);
  const linDamp = 1 / (1 + dt * 0.06);
  for (const b of bodies) {
    if (!b.live) continue;
    b.vy += g * dt;
    b.vx *= linDamp;
    b.vy *= linDamp;
    b.w *= angDamp;
  }

  const cs = collide(world);
  const prev = world.cache;
  const next = new Map();
  for (const c of cs) {
    const A = bodies[c.i];
    const B = c.j >= 0 ? bodies[c.j] : null;
    c.rax = c.px - A.x;
    c.ray = c.py - A.y;
    c.rbx = B ? c.px - B.x : 0;
    c.rby = B ? c.py - B.y : 0;
    const tx = -c.ny;
    const ty = c.nx;
    const rnA = c.rax * c.ny - c.ray * c.nx;
    const rtA = c.rax * ty - c.ray * tx;
    let kN = A.invM + A.invI * rnA * rnA;
    let kT = A.invM + A.invI * rtA * rtA;
    if (B) {
      const rnB = c.rbx * c.ny - c.rby * c.nx;
      const rtB = c.rbx * ty - c.rby * tx;
      kN += B.invM + B.invI * rnB * rnB;
      kT += B.invM + B.invI * rtB * rtB;
    }
    c.mn = 1 / kN;
    c.mt = 1 / kT;
    let dvx = -A.vx + A.w * c.ray;
    let dvy = -A.vy - A.w * c.rax;
    if (B) {
      dvx += B.vx - B.w * c.rby;
      dvy += B.vy + B.w * c.rbx;
    }
    const vn = dvx * c.nx + dvy * c.ny;
    const restBias = vn < -REST_MIN ? -RESTITUTION * vn : 0;
    // overlap is pushed out with a separate pseudo velocity (split
    // impulse), so correcting it never adds energy or makes pills creep
    c.pbias = Math.min(MAX_BIAS, (BAUMGARTE / dt) * Math.max(0, c.pen - SLOP));
    c.pp = 0;
    c.bias = restBias;
  }
  // warm start from last step, after every bounce target was measured
  for (const c of cs) {
    const old = prev.get(c.key);
    if (!old) continue;
    c.pn = old[0];
    c.pt = old[1];
    const Px = c.nx * c.pn - c.ny * c.pt;
    const Py = c.ny * c.pn + c.nx * c.pt;
    applyImpulse(bodies[c.i], c.j >= 0 ? bodies[c.j] : null, c, Px, Py);
  }

  const drag = world.drag;
  let dj = null;
  if (drag) {
    const b = bodies[drag.i];
    const co = Math.cos(b.a);
    const sn = Math.sin(b.a);
    const rx = co * drag.lx - sn * drag.ly;
    const ry = sn * drag.lx + co * drag.ly;
    const omega = 2 * Math.PI * 5.5;
    const d = 2 * b.m * 0.8 * omega;
    const k = b.m * omega * omega;
    let gamma = dt * (d + dt * k);
    gamma = gamma > 0 ? 1 / gamma : 0;
    const beta = dt * k * gamma;
    const k11 = b.invM + b.invI * ry * ry + gamma;
    const k12 = -b.invI * rx * ry;
    const k22 = b.invM + b.invI * rx * rx + gamma;
    const det = k11 * k22 - k12 * k12 || 1;
    b.w *= 1 / (1 + dt * 5);
    dj = {
      b,
      rx,
      ry,
      gamma,
      m11: k22 / det,
      m12: -k12 / det,
      m22: k11 / det,
      bx: beta * (b.x + rx - drag.tx),
      by: beta * (b.y + ry - drag.ty),
      ax: 0,
      ay: 0,
      max: b.m * g * 18 * dt,
    };
  }

  for (let it = 0; it < ITER; it++) {
    if (dj) {
      const { b } = dj;
      const cx = b.vx - b.w * dj.ry + dj.bx + dj.gamma * dj.ax;
      const cy = b.vy + b.w * dj.rx + dj.by + dj.gamma * dj.ay;
      let ix = -(dj.m11 * cx + dj.m12 * cy);
      let iy = -(dj.m12 * cx + dj.m22 * cy);
      const ox = dj.ax;
      const oy = dj.ay;
      dj.ax += ix;
      dj.ay += iy;
      const mag = Math.hypot(dj.ax, dj.ay);
      if (mag > dj.max) {
        dj.ax *= dj.max / mag;
        dj.ay *= dj.max / mag;
      }
      ix = dj.ax - ox;
      iy = dj.ay - oy;
      b.vx += b.invM * ix;
      b.vy += b.invM * iy;
      b.w += b.invI * (dj.rx * iy - dj.ry * ix);
    }
    for (const c of cs) {
      const A = bodies[c.i];
      const B = c.j >= 0 ? bodies[c.j] : null;
      const tx = -c.ny;
      const ty = c.nx;
      // friction
      let dvx = -A.vx + A.w * c.ray;
      let dvy = -A.vy - A.w * c.rax;
      if (B) {
        dvx += B.vx - B.w * c.rby;
        dvy += B.vy + B.w * c.rbx;
      }
      const vt = dvx * tx + dvy * ty;
      const maxF = c.mu * c.pn;
      const oldT = c.pt;
      c.pt = clamp(oldT - c.mt * vt, -maxF, maxF);
      const dPt = c.pt - oldT;
      applyImpulse(A, B, c, tx * dPt, ty * dPt);
      // normal
      dvx = -A.vx + A.w * c.ray;
      dvy = -A.vy - A.w * c.rax;
      if (B) {
        dvx += B.vx - B.w * c.rby;
        dvy += B.vy + B.w * c.rbx;
      }
      const vn = dvx * c.nx + dvy * c.ny;
      const oldN = c.pn;
      c.pn = Math.max(0, oldN + c.mn * (-vn + c.bias));
      const dPn = c.pn - oldN;
      applyImpulse(A, B, c, c.nx * dPn, c.ny * dPn);
    }
  }

  for (const c of cs) next.set(c.key, [c.pn, c.pt]);
  world.cache = next;

  for (const b of bodies) b.px = b.py = b.pw = 0;
  for (let it = 0; it < 4; it++) {
    for (const c of cs) {
      if (c.pbias <= 0 && c.pp <= 0) continue;
      const A = bodies[c.i];
      const B = c.j >= 0 ? bodies[c.j] : null;
      let dvx = -A.px + A.pw * c.ray;
      let dvy = -A.py - A.pw * c.rax;
      if (B) {
        dvx += B.px - B.pw * c.rby;
        dvy += B.py + B.pw * c.rbx;
      }
      const vn = dvx * c.nx + dvy * c.ny;
      const old = c.pp;
      c.pp = Math.max(0, old + c.mn * (c.pbias - vn));
      const d = c.pp - old;
      const Px = c.nx * d;
      const Py = c.ny * d;
      A.px -= Px * A.invM;
      A.py -= Py * A.invM;
      A.pw -= A.invI * (c.rax * Py - c.ray * Px);
      if (B) {
        B.px += Px * B.invM;
        B.py += Py * B.invM;
        B.pw += B.invI * (c.rbx * Py - c.rby * Px);
      }
    }
  }

  let calm = true;
  for (const b of bodies) {
    if (!b.live) continue;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > MAX_V) {
      b.vx *= MAX_V / sp;
      b.vy *= MAX_V / sp;
    }
    b.w = clamp(b.w, -MAX_W, MAX_W);
    b.x += (b.vx + (b.px || 0)) * dt;
    b.y += (b.vy + (b.py || 0)) * dt;
    b.a += (b.w + (b.pw || 0)) * dt;
    // a capsule looks the same turned half way round, so keep its label
    // upright (with a little hysteresis around vertical)
    if (b.a > FLIP || b.a < -FLIP) {
      b.a += b.a > 0 ? -Math.PI : Math.PI;
      if (world.drag && bodies[world.drag.i] === b) {
        world.drag.lx = -world.drag.lx;
        world.drag.ly = -world.drag.ly;
      }
    }
    if (!Number.isFinite(b.x + b.y + b.a)) {
      b.x = world.W / 2;
      b.y = b.r + 4;
      b.a = 0;
      b.vx = b.vy = b.w = 0;
    }
    if (!b.inside && b.y - (Math.abs(Math.sin(b.a)) * b.hl + b.r) > 1)
      b.inside = true;
    // a pill left resting above the rim hops off the top of the pile
    if (!b.inside && sp < 40 && world.queue.length === 0) {
      b.outT = (b.outT || 0) + dt;
      if (b.outT > 0.3) {
        b.outT = 0;
        b.vx += b.x < world.W / 2 ? -260 : 260;
        b.vy -= 140;
      }
    }
    if (sp > SLEEP_V || Math.abs(b.w) * (b.hl + b.r) > SLEEP_V) calm = false;
  }
  if (calm && !world.drag && world.queue.length === 0) {
    world.calm += dt;
    if (world.calm > SLEEP_T) {
      world.awake = false;
      for (const b of bodies) b.vx = b.vy = b.w = 0;
    }
  } else world.calm = 0;
}

function applyImpulse(A, B, c, Px, Py) {
  A.vx -= Px * A.invM;
  A.vy -= Py * A.invM;
  A.w -= A.invI * (c.rax * Py - c.ray * Px);
  if (B) {
    B.vx += Px * B.invM;
    B.vy += Py * B.invM;
    B.w += B.invI * (c.rbx * Py - c.rby * Px);
  }
}

/* ---------- component ---------- */

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={s.arrow}>
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={s.hintIcon}>
      <path
        d="M3.5 15.5c2.6-6.4 7-9.6 12.4-9.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12.6 3.4 16 6.1l-2.7 3.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function H02Pills() {
  const trayRef = useRef(null);
  const pillRefs = useRef([]);
  const popRef = useRef(null);
  const popIdx = useRef(-1);
  const kick = useRef(() => {});
  const [pop, setPop] = useState(-1);
  const [used, setUsed] = useState(false);

  popIdx.current = pop;

  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return undefined;
    const els = [...pillRefs.current];
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const rand = mulberry32(20261003);

    const world = {
      W: tray.clientWidth,
      H: tray.clientHeight,
      g: GRAVITY,
      bodies: PILLS.map((_, i) => ({
        el: els[i],
        x: 0,
        y: -500,
        a: 0,
        vx: 0,
        vy: 0,
        w: 0,
        live: false,
        inside: false,
      })),
      cache: new Map(),
      drag: null,
      awake: false,
      calm: 0,
      queue: [],
      clock: 0,
      started: false,
    };

    let scale = 1;
    let visible = false;
    let raf = 0;
    let last = 0;
    let acc = 0;
    let ptr = null;
    let alive = true;

    const measure = () => {
      scale = clamp(world.W / 1180, world.W < 520 ? 0.66 : 0.7, 1);
      tray.style.setProperty("--s", scale.toFixed(3));
      world.g = GRAVITY * Math.max(0.8, scale);
      for (const b of world.bodies)
        setShape(b, b.el.offsetWidth, b.el.offsetHeight);
    };

    const render = () => {
      for (const b of world.bodies) {
        if (!b.live) continue;
        let { x, y, a } = b;
        if (!world.awake) {
          // at rest: snap near-level pills so their text is pixel crisp
          if (Math.abs(a) < 0.012) {
            a = 0;
            x = Math.round(x - b.wPx / 2) + b.wPx / 2;
            y = Math.round(y - b.hPx / 2) + b.hPx / 2;
          }
        }
        b.el.style.transform = `translate3d(${(x - b.wPx / 2).toFixed(2)}px,${(y - b.hPx / 2).toFixed(2)}px,0) rotate(${a.toFixed(4)}rad)`;
        const sd = 7 * Math.max(0.7, scale);
        b.el.style.setProperty("--sx", `${(sd * Math.sin(a)).toFixed(2)}px`);
        b.el.style.setProperty("--sy", `${(sd * Math.cos(a)).toFixed(2)}px`);
      }
      placePop();
    };

    const placePop = () => {
      const el = popRef.current;
      const i = popIdx.current;
      if (!el || i < 0) return;
      const b = world.bodies[i];
      if (!b.live) return;
      const ext = Math.abs(Math.sin(b.a)) * b.hl + b.r;
      const pw = el.offsetWidth;
      const ph = el.offsetHeight;
      let top = b.y - ext - 12 - ph;
      let below = false;
      if (top < 10) {
        top = b.y + ext + 12;
        below = true;
      }
      const left = clamp(b.x - pw / 2, 10, Math.max(10, world.W - pw - 10));
      el.style.transform = `translate3d(${Math.round(left)}px,${Math.round(top)}px,0)`;
      el.style.setProperty(
        "--ax",
        `${clamp(b.x - left, 18, pw - 18).toFixed(1)}px`,
      );
      el.dataset.below = below ? "1" : "0";
    };

    const spawn = (i) => {
      const b = world.bodies[i];
      const W = world.W;
      const wide = W > 700;
      b.a = (rand() - 0.5) * 1.1;
      updateEnds(b);
      // centre-weighted drop line, so the pile builds into a mound; the
      // last pill (Rast) lands on top of it
      const spread = i === PILLS.length - 1 ? 0.24 : wide ? 0.7 : 0.9;
      const u = (rand() + rand()) / 2 - 0.5;
      b.x = clamp(W / 2 + u * W * spread, b.ex + 4, W - b.ex - 4);
      b.y = -b.ey - 6 - rand() * 30;
      b.vx = (rand() - 0.5) * 120;
      b.vy = 260 + rand() * 180;
      b.w = (rand() - 0.5) * 4;
      b.live = true;
      b.inside = false;
      b.el.dataset.live = "1";
    };

    const start = () => {
      if (world.started) return;
      world.started = true;
      measure();
      world.queue = PILLS.map((_, i) => i);
      world.clock = 0;
      if (reduce) {
        // no fall: place the pills and settle them off screen, show the pile
        world.queue.forEach((i, n) => {
          spawn(i);
          const b = world.bodies[i];
          b.y = -b.ey - 20 - n * 70;
          b.vy = 0;
        });
        world.queue = [];
        world.awake = true;
        for (let k = 0; k < 1400 && world.awake; k++) step(world, DT);
        world.awake = false;
        render();
        return;
      }
      world.awake = true;
      loop();
    };

    const frame = (now) => {
      raf = 0;
      const dtF = Math.min(1 / 30, (now - last) / 1000 || 0);
      last = now;
      if (world.queue.length) {
        world.clock += dtF;
        while (
          world.queue.length &&
          world.clock >= 0.11 * (PILLS.length - world.queue.length)
        )
          spawn(world.queue.shift());
      }
      acc += dtF;
      let n = 0;
      while (acc >= DT && n < 8) {
        step(world, DT);
        acc -= DT;
        n++;
        if (!world.awake) {
          acc = 0;
          break;
        }
      }
      render();
      if (visible && world.awake) raf = requestAnimationFrame(frame);
    };

    const loop = () => {
      if (raf || !alive || !visible || !world.awake) return;
      last = performance.now();
      acc = 0;
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!world.started) return;
      world.awake = true;
      world.calm = 0;
      loop();
    };
    kick.current = () => {
      render();
    };

    const local = (e) => {
      const r = tray.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    const onDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const i = Number(e.currentTarget.dataset.i);
      const b = world.bodies[i];
      if (!b.live || ptr) return;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      const [x, y] = local(e);
      ptr = {
        id: e.pointerId,
        i,
        el: e.currentTarget,
        sx: x,
        sy: y,
        moved: false,
        samples: [[performance.now(), x, y]],
      };
    };

    const onMove = (e) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      const [x, y] = local(e);
      const now = performance.now();
      ptr.samples.push([now, x, y]);
      while (ptr.samples.length > 2 && now - ptr.samples[0][0] > 90)
        ptr.samples.shift();
      if (!ptr.moved && Math.hypot(x - ptr.sx, y - ptr.sy) > 6) {
        ptr.moved = true;
        const b = world.bodies[ptr.i];
        const dx = ptr.sx - b.x;
        const dy = ptr.sy - b.y;
        const co = Math.cos(b.a);
        const sn = Math.sin(b.a);
        world.drag = {
          i: ptr.i,
          lx: clamp(co * dx + sn * dy, -b.hl - b.r * 0.6, b.hl + b.r * 0.6),
          ly: clamp(-sn * dx + co * dy, -b.r * 0.6, b.r * 0.6),
          tx: x,
          ty: y,
        };
        ptr.el.dataset.drag = "1";
        setPop(-1);
        setUsed(true);
      }
      if (ptr.moved && world.drag) {
        world.drag.tx = clamp(x, 6, world.W - 6);
        world.drag.ty = clamp(y, 6, world.H - 6);
        wake();
      }
    };

    const release = (e, cancelled) => {
      if (!ptr || e.pointerId !== ptr.id) return;
      const p = ptr;
      ptr = null;
      delete p.el.dataset.drag;
      if (!p.moved) {
        if (!cancelled) setPop((cur) => (cur === p.i ? -1 : p.i));
        return;
      }
      world.drag = null;
      const b = world.bodies[p.i];
      const s0 = p.samples[0];
      const s1 = p.samples[p.samples.length - 1];
      const dtS = (s1[0] - s0[0]) / 1000;
      if (!cancelled && dtS > 0.012) {
        const vx = (s1[1] - s0[1]) / dtS;
        const vy = (s1[2] - s0[2]) / dtS;
        b.vx = b.vx * 0.3 + vx * 0.7;
        b.vy = b.vy * 0.3 + vy * 0.7;
        const sp = Math.hypot(b.vx, b.vy);
        const cap = 2400 * Math.max(0.75, scale);
        if (sp > cap) {
          b.vx *= cap / sp;
          b.vy *= cap / sp;
        }
      }
      wake();
    };
    const onUp = (e) => release(e, false);
    const onCancel = (e) => release(e, true);

    for (const el of els) {
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onCancel);
      el.addEventListener("lostpointercapture", onCancel);
    }

    const onDocDown = (e) => {
      if (popIdx.current < 0) return;
      if (e.target instanceof Element && e.target.closest("[data-pill02]"))
        return;
      setPop(-1);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setPop(-1);
    };
    document.addEventListener("pointerdown", onDocDown);
    document.addEventListener("keydown", onKey);

    const io = new IntersectionObserver(
      (entries) => {
        const en = entries[0];
        visible = en.isIntersecting;
        if (visible && en.intersectionRatio > 0.3) start();
        if (visible) loop();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(tray);

    const ro = new ResizeObserver(() => {
      const W = tray.clientWidth;
      const H = tray.clientHeight;
      if (W === world.W && H === world.H) return;
      const fx = W / (world.W || W);
      const oldH = world.H;
      world.W = W;
      world.H = H;
      if (!world.started) return;
      measure();
      for (const b of world.bodies) {
        if (!b.live) continue;
        updateEnds(b);
        b.x = clamp(b.x * fx, b.ex, W - b.ex);
        b.y = Math.min(H - b.ey, H - (oldH - b.y));
      }
      world.cache.clear();
      if (reduce) {
        world.awake = true;
        for (let k = 0; k < 900 && world.awake; k++) step(world, DT);
        world.awake = false;
        render();
      } else wake();
    });
    ro.observe(tray);

    document.fonts?.ready.then(() => {
      if (world.started) {
        measure();
        wake();
      }
    });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("pointerdown", onDocDown);
      document.removeEventListener("keydown", onKey);
      for (const el of els) {
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onCancel);
        el.removeEventListener("lostpointercapture", onCancel);
      }
    };
  }, []);

  // place the popover as soon as it opens, even when the pile is asleep
  useEffect(() => {
    if (pop >= 0) kick.current();
  }, [pop]);

  const cur = pop >= 0 ? PILLS[pop] : null;

  return (
    <div className={s.hero}>
      <HeroCopy align="center" />
      <div className={s.tray} ref={trayRef}>
        <span className={s.hint} data-used={used ? "1" : undefined}>
          <ThrowIcon />
          <span className={s.hintFine}>Uhvatite i bacite</span>
          <span className={s.hintTouch}>Povucite pilulu</span>
        </span>
        <span className={s.caption}>Sve usluge, jedan sistem</span>
        {PILLS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            data-i={i}
            data-pill02=""
            data-tone={p.tone}
            className={s.pill}
            style={{ "--fs": p.fs }}
            aria-expanded={pop === i}
            onClick={(e) => {
              // keyboard only; pointer taps are handled in the engine
              if (e.detail === 0) setPop((c) => (c === i ? -1 : i));
            }}
          >
            {p.label}
            {p.arrow ? <Arrow /> : null}
          </button>
        ))}
        <output
          ref={popRef}
          className={s.pop}
          data-open={cur ? "1" : undefined}
          aria-live="polite"
        >
          {cur
            ? <>
                <b>{cur.label}</b>
                <span>{cur.info}</span>
              </>
            : null}
        </output>
      </div>
    </div>
  );
}
