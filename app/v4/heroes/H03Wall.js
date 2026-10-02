"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h03.module.css";

/* 03 · Zid radova: the headline on clean white ground on the left; on the
   right a tilted wall of real client sites, three columns drifting at their
   own speed in alternating directions. The pointer tilts the wall, a tile
   lifts on hover (tap on touch), holds its column and shows the client with
   one real result; a click (second tap) opens the case study. */

/* Seconds a column needs to drift by one tile: different per column so the
   wall never moves in lockstep. Each column also gets its own order of
   clients (a seeded shuffle), so neighbours rarely show the same site. */
const COLUMNS = [
  { pace: 6.4, reverse: false, seed: 11, phase: 0.1 },
  { pace: 8.2, reverse: true, seed: 29, phase: 0.55 },
  { pace: 5.6, reverse: false, seed: 47, phase: 0.3 },
];
const MIN_PER_SET = 6;
const PLACEHOLDERS = ["a", "b", "c", "d"];

/** The tiles are ~340px wide, so ask Sanity for a lighter rendition. */
function sized(url, w) {
  if (!url) return url;
  if (/[?&]w=\d+/.test(url)) return url.replace(/([?&])w=\d+/, `$1w=${w}`);
  return `${url}${url.includes("?") ? "&" : "?"}w=${w}`;
}

/** Small deterministic PRNG (mulberry32): same order on server and client. */
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** One loop of a column: whole shuffled passes over the list until it is long
    enough to cover the wall, never the same site twice in a row (also across
    the loop seam). */
function columnSet(list, seed) {
  const n = list.length;
  const rand = rng(seed);
  const out = [];
  for (let b = 0; b < Math.ceil(MIN_PER_SET / n); b++) {
    const pass = [...list];
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [pass[i], pass[j]] = [pass[j], pass[i]];
    }
    if (n > 1 && out.length && pass[0] === out[out.length - 1]) {
      [pass[0], pass[n - 1]] = [pass[n - 1], pass[0]];
    }
    out.push(...pass);
  }
  const last = out.length - 1;
  if (n > 2 && out[last] === out[0]) {
    [out[last], out[last - 1]] = [out[last - 1], out[last]];
  }
  return out;
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M4.5 11.5l7-7M5.5 4.5h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function H03Wall({ clients }) {
  const heroRef = useRef(null);
  const planeRef = useRef(null);
  const lastPointer = useRef("mouse");
  const [active, setActive] = useState(null);

  const list = useMemo(
    () => (clients ?? []).filter((c) => c?.cover && c?.href),
    [clients],
  );
  const empty = list.length === 0;
  const source = empty ? PLACEHOLDERS : list;

  /* Pointer parallax (mouse only) and pausing everything off screen. */
  useEffect(() => {
    const hero = heroRef.current;
    const plane = planeRef.current;
    if (!hero || !plane) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let inView = false;
    let raf = 0;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const tick = () => {
      cur.x += (tgt.x - cur.x) * 0.07;
      cur.y += (tgt.y - cur.y) * 0.07;
      plane.style.setProperty("--px", cur.x.toFixed(4));
      plane.style.setProperty("--py", cur.y.toFixed(4));
      const settled =
        Math.abs(tgt.x - cur.x) < 0.0008 && Math.abs(tgt.y - cur.y) < 0.0008;
      raf = settled || !inView ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && inView) raf = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      if (reduce || e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      tgt.x = (e.clientX - r.left) / r.width - 0.5;
      tgt.y = (e.clientY - r.top) / r.height - 0.5;
      kick();
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      hero.dataset.run = inView ? "1" : "0";
      if (!inView) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(hero);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* A tap outside the tiles closes the open tile on touch screens. */
  useEffect(() => {
    if (active === null) return;
    const close = (e) => {
      if (!e.target.closest?.(`.${s.tile}`)) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [active]);

  const onTileClick = (e, key) => {
    // Touch: the first tap opens the overlay, the second follows the link.
    if (lastPointer.current === "mouse") return;
    if (active !== key) {
      e.preventDefault();
      setActive(key);
    }
  };

  const seen = new Set();

  return (
    <div
      ref={heroRef}
      className={s.hero}
      onPointerDownCapture={(e) => {
        lastPointer.current = e.pointerType;
      }}
    >
      <div className={s.copy}>
        <HeroCopy align="left" />
      </div>

      <div className={s.wall} data-empty={empty || undefined}>
        <div ref={planeRef} className={s.plane}>
          {COLUMNS.map((col, ci) => {
            const set = columnSet(source, col.seed);
            const dur = set.length * col.pace;
            const hold =
              typeof active === "string" && active.startsWith(`${ci}:`);
            return (
              <div
                key={col.seed}
                className={s.col}
                data-dir={col.reverse ? "down" : "up"}
                data-hold={hold || undefined}
              >
                <div
                  className={s.track}
                  style={{
                    "--dur": `${dur}s`,
                    "--delay": `${(-dur * col.phase).toFixed(2)}s`,
                  }}
                >
                  {[0, 1].map((copy) =>
                    set.map((c, i) => {
                      const key = `${ci}:${copy}:${i}`;
                      if (empty) {
                        return (
                          <div
                            key={key}
                            className={`${s.tile} ${s.ph}`}
                            data-v={c}
                            aria-hidden="true"
                          >
                            <i className={s.phBar} />
                            <i className={s.phHead} />
                            <i className={s.phLine} />
                            <i className={s.phBtn} />
                            <i className={s.phArt} />
                          </div>
                        );
                      }
                      // Each client is reachable once by keyboard and screen
                      // reader; the repeats that fill the wall are decorative.
                      const first = !seen.has(c.slug);
                      if (first) seen.add(c.slug);
                      const m = c.metrics?.[0];
                      const tile = (
                        <a
                          key={key}
                          href={c.href}
                          className={s.tile}
                          data-active={active === key || undefined}
                          tabIndex={first ? undefined : -1}
                          aria-label={
                            first
                              ? `${c.name}${m ? `: ${m.value} ${m.label}` : ""}`
                              : undefined
                          }
                          onClick={(e) => onTileClick(e, key)}
                          draggable={false}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sized(c.cover, 720)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                          <span className={s.chip}>
                            <span className={s.chipText}>
                              <b className={s.chipName}>{c.name}</b>
                              {m
                                ? <span className={s.chipMetric}>
                                    <strong>{m.value}</strong> {m.label}
                                  </span>
                                : null}
                            </span>
                            <span className={s.chipGo}>
                              <Arrow />
                            </span>
                          </span>
                        </a>
                      );
                      // The repeats are hidden from assistive tech; the
                      // wrapper has no box, so the 3D layout is untouched.
                      return first
                        ? tile
                        : <div
                            key={key}
                            className={s.repeat}
                            aria-hidden="true"
                          >
                            {tile}
                          </div>;
                    }),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!empty
        ? <p className={s.legend}>
            <span className={s.legendDot} />
            Pravi sajtovi naših klijenata
          </p>
        : null}
    </div>
  );
}
