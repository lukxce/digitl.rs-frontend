"use client";

import { useEffect, useId, useRef, useState } from "react";
import b from "../_home/base.module.css";
import { ArrowRight } from "../_home/icons";
import { formatSr, parseSr, percentSr, widestEm } from "./lib";
import v from "./viz.module.css";

/* Charts and figures for a case study, drawn by hand. Each one shows the
   story's numbers as they are: scales start at zero, bars are a true share
   of 100, and the source line under the card is always there. */

/* ── arriving on screen ───────────────────────────────────────────────── */
/* The server renders every figure finished, so it reads without scripts.
   On the client, one that is still below the fold is rewound ("armed") and
   plays when it scrolls in ("run"). On screen at load, or with reduced
   motion, it simply stays as it is ("static"). */
export function useEnter(ref, amount = 0.3) {
  const [stage, setStage] = useState("static");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setStage("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStage("run");
        io.disconnect();
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return stage;
}

/** A story number, rolled up on first view. The last frame is the string
    exactly as it was written; anything that does not parse is left alone. */
export function CountUp({ value, ms = 1500 }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.6);
  const [t, setT] = useState(0);
  const parsed = parseSr(value);
  const rolls = parsed != null && parsed.num > 0;

  useEffect(() => {
    if (stage !== "run" || !rolls) return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / ms);
      setT(k);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [stage, rolls, ms]);

  const rolling = rolls && (stage === "armed" || (stage === "run" && t < 1));
  const at = stage === "armed" ? 0 : 1 - (1 - t) ** 3;
  return (
    <span ref={ref} className={rolling ? b.tnum : undefined}>
      {rolling
        ? `${formatSr(parsed.num * at, parsed.decimals, parsed.grouped)}${parsed.suffix}`
        : value}
    </span>
  );
}

/* ── the card every figure sits in ────────────────────────────────────── */
function Frame({ viz, kind, unit, children }) {
  return (
    <figure className={v.card} data-kind={kind}>
      {viz.title
        ? <figcaption className={v.head}>
            <b>{viz.title}</b>
            {unit ? <span>{unit}</span> : null}
          </figcaption>
        : null}
      {children}
      {viz.note
        ? <p className={v.note}>
            <i aria-hidden="true" />
            {viz.note}
          </p>
        : null}
    </figure>
  );
}

/* ── stat: a row of plain figures ─────────────────────────────────────── */
function Stat({ viz }) {
  const items = (viz.items ?? []).filter((it) => it?.value != null);
  if (!items.length) return null;
  // one size for the row, set by its widest value (a figure or a short word)
  const em = widestEm(
    items.map((it) => it.value),
    -0.055,
  );
  return (
    <Frame viz={viz} kind="stat">
      <ul
        className={v.stat}
        data-n={Math.min(items.length, 4)}
        data-long={em > 3 ? "" : undefined}
        style={{ "--em": em }}
      >
        {items.map((it) => (
          <li key={`${it.value}-${it.label}`}>
            <b>
              <CountUp value={it.value} ms={1200} />
            </b>
            <span>{it.label}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* ── compare: before → after ──────────────────────────────────────────── */
function Compare({ viz, board }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.25);
  const rows = (viz.rows ?? []).filter(
    (r) => r && (r.from != null || r.to != null),
  );
  if (!rows.length) return null;
  // figures get big type; phrases ("Nije u rezultatima") get reading type
  const words = rows.some(
    (r) => String(r.from ?? "").length > 7 || String(r.to ?? "").length > 7,
  );
  return (
    <Frame viz={viz} kind="compare">
      <ul
        ref={ref}
        className={`${v.compare} ${board ? v.board : v.rows}`}
        data-words={words ? "" : undefined}
        data-stage={stage}
        // three across; four make two rows of two
        style={{ "--cols": rows.length === 4 ? 2 : Math.min(rows.length, 3) }}
      >
        {rows.map((r, i) => (
          <li key={r.label} style={{ "--i": i }}>
            <span className={v.cLabel}>{r.label}</span>
            <span className={v.cVals}>
              <span className={v.from}>
                <span className={b.srOnly}>pre: </span>
                {r.from}
              </span>
              <span className={v.arrow} aria-hidden="true">
                <ArrowRight size={15} />
              </span>
              <b className={v.to}>
                <span className={b.srOnly}>posle: </span>
                {r.to}
              </b>
            </span>
            {r.change ? <span className={v.change}>{r.change}</span> : null}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/* ── table ────────────────────────────────────────────────────────────── */
function DataTable({ viz }) {
  const columns = Array.isArray(viz.columns) ? viz.columns : [];
  const rows = (viz.rows ?? []).filter(Array.isArray);
  if (!rows.length) return null;
  return (
    <Frame viz={viz} kind="table">
      <div className={v.tableWrap}>
        <table className={v.table}>
          {columns.length
            ? <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
            : null}
          <tbody>
            {rows.map((r) => (
              <tr key={r.join("|")}>
                {r.map((cell, ci) =>
                  ci === 0
                    ? <th key={`${columns[ci] ?? ci}`} scope="row">
                        {cell}
                      </th>
                    : <td key={`${columns[ci] ?? ci}`}>{cell}</td>,
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/* ── share: horizontal bars out of 100 ────────────────────────────────── */
function Share({ viz }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.25);
  const items = (viz.items ?? []).filter((it) =>
    Number.isFinite(Number(it?.value)),
  );
  if (!items.length) return null;
  // a share is a part of 100; only data that overshoots it stretches the scale
  const full = Math.max(100, ...items.map((it) => Number(it.value)));
  return (
    <Frame viz={viz} kind="share">
      <ul ref={ref} className={v.share} data-stage={stage}>
        {items.map((it, i) => {
          const value = Math.max(0, Number(it.value));
          return (
            <li key={it.label}>
              <span className={v.sLabel}>{it.label}</span>
              <span className={v.sValue}>
                {it.detail ? <em>{it.detail}</em> : null}
                <b>{percentSr(value)}</b>
              </span>
              <span className={v.track} aria-hidden="true">
                <i
                  style={{
                    width: `${(value / full) * 100}%`,
                    transitionDelay: `${i * 90}ms`,
                  }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

/* ── trend: a time series as an area chart ────────────────────────────── */
/** Round steps (1, 2, 2.5, 5 × 10ⁿ) from zero to just above the data. */
function scale(min, max) {
  const span = Math.max(max, 0) - Math.min(min, 0) || 1;
  const rough = span / 4;
  const pow = 10 ** Math.floor(Math.log10(rough));
  const f = rough / pow;
  const step =
    (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
  const lo = Math.min(0, Math.floor(min / step + 1e-9) * step);
  const hi = Math.max(step, Math.ceil(max / step - 1e-9) * step);
  const decimals = Number.isInteger(step)
    ? 0
    : Math.min(
        4,
        (step.toFixed(6).replace(/0+$/, "").split(".")[1] ?? "").length,
      );
  const ticks = [];
  for (let k = 0; lo + k * step <= hi + step / 2; k++)
    ticks.push(Number((lo + k * step).toFixed(6)));
  return { lo, hi, ticks, decimals };
}

const r1 = (n) => Math.round(n * 10) / 10;

function Trend({ viz }) {
  const box = useRef(null);
  const wash = `wash${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const stage = useEnter(box, 0.35);
  // Drawn at the real pixel width, so type and strokes never scale. Until
  // the box is measured it is laid out for 720px and fitted by the viewBox.
  const [w, setW] = useState(720);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const read = () => {
      const next = Math.round(el.clientWidth);
      if (next > 0) setW(next);
    };
    read();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // a tap keeps its tooltip until the next tap lands somewhere else
  useEffect(() => {
    if (active == null) return;
    const away = (e) => {
      if (!box.current?.contains(e.target)) setActive(null);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [active]);

  const pts = (viz.points ?? [])
    .map((p) => ({ label: String(p?.label ?? ""), value: Number(p?.value) }))
    .filter((p) => Number.isFinite(p.value));
  if (pts.length < 2) return null;

  const n = pts.length;
  const values = pts.map((p) => p.value);
  const s = scale(Math.min(...values), Math.max(...values));
  const fmt = (x) => formatSr(x, Number.isInteger(x) ? 0 : 1);
  const tick = (x) => formatSr(x, s.decimals);

  const h = Math.round(Math.max(236, Math.min(400, w * 0.44)));
  const padL = Math.max(...s.ticks.map((t) => tick(t).length)) * 7.4 + 14;
  const padR = 22;
  const padT = 34;
  const padB = 34;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const gap = plotW / (n - 1);
  const x = (i) => padL + i * gap;
  const y = (val) => padT + plotH * (1 - (val - s.lo) / (s.hi - s.lo));

  const line = pts
    .map((p, i) => `${i ? "L" : "M"}${r1(x(i))} ${r1(y(p.value))}`)
    .join(" ");
  const area = `${line} L${r1(x(n - 1))} ${r1(y(0))} L${r1(x(0))} ${r1(y(0))} Z`;

  // x labels thin out when they would touch; the last one always stays
  const widest = Math.max(...pts.map((p) => p.label.length)) * 6.6 + 16;
  const every = Math.max(1, Math.ceil(widest / gap));
  const last = n - 1;

  const pick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    setActive(Math.max(0, Math.min(last, Math.round((px - padL) / gap))));
  };
  const onKey = (e) => {
    const from = active ?? last;
    const to =
      e.key === "ArrowLeft"
        ? from - 1
        : e.key === "ArrowRight"
          ? from + 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (to == null) return;
    e.preventDefault();
    setActive(Math.max(0, Math.min(last, to)));
  };

  const a = active == null ? null : pts[active];
  const ax = a ? x(active) : 0;
  const ay = a ? y(a.value) : 0;

  return (
    <Frame viz={viz} kind="trend" unit={viz.unit}>
      {/* biome-ignore lint/a11y/useSemanticElements: a labelled group around a chart, not a form fieldset */}
      <div
        ref={box}
        className={v.trend}
        data-stage={stage}
        role="group"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so the arrow keys can walk the points
        tabIndex={0}
        aria-label={`Grafikon: ${viz.title ?? viz.unit ?? "kretanje po periodima"}. Strelice levo i desno biraju tačku, sve vrednosti su u tabeli ispod.`}
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setActive(null);
        }}
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) setActive((i) => i ?? last);
        }}
        onBlur={() => setActive(null)}
        onKeyDown={onKey}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          width={w}
          height={h}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={wash} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className={v.washTop} />
              <stop offset="1" className={v.washEnd} />
            </linearGradient>
          </defs>

          {s.ticks.map((t) => (
            <g key={t}>
              <line
                className={t === 0 ? v.base : v.grid}
                x1={padL}
                x2={w - padR + 8}
                y1={r1(y(t))}
                y2={r1(y(t))}
              />
              <text className={v.tick} x={padL - 10} y={r1(y(t)) + 4}>
                {tick(t)}
              </text>
            </g>
          ))}
          {pts.map((p, i) =>
            (last - i) % every === 0
              ? <text
                  key={`${p.label}-${i}`}
                  className={v.xTick}
                  x={r1(x(i))}
                  y={h - 10}
                >
                  {p.label}
                </text>
              : null,
          )}

          <path className={v.area} d={area} fill={`url(#${wash})`} />
          <path className={v.line} d={line} pathLength="1" />
          {gap >= 26
            ? <g className={v.dots}>
                {pts.slice(0, -1).map((p, i) => (
                  <circle
                    key={`${p.label}-${i}`}
                    cx={r1(x(i))}
                    cy={r1(y(p.value))}
                    r="3"
                  />
                ))}
              </g>
            : null}

          {/* the end point carries the one direct label */}
          <g className={v.end}>
            <circle
              className={v.halo}
              cx={r1(x(last))}
              cy={r1(y(pts[last].value))}
              r="12"
            />
            <circle
              className={v.endDot}
              cx={r1(x(last))}
              cy={r1(y(pts[last].value))}
              r="5.5"
            />
            {active === last
              ? null
              : <text
                  className={v.endLabel}
                  x={Math.min(w - 2, r1(x(last)) + 12)}
                  y={r1(y(pts[last].value)) - 16}
                >
                  {fmt(pts[last].value)}
                </text>}
          </g>

          {a
            ? <g>
                <line
                  className={v.cross}
                  x1={r1(ax)}
                  x2={r1(ax)}
                  y1={padT - 6}
                  y2={padT + plotH}
                />
                <circle className={v.pick} cx={r1(ax)} cy={r1(ay)} r="6" />
              </g>
            : null}
        </svg>

        {a
          ? <div
              className={v.tip}
              data-side={
                ax / w < 0.22 ? "start" : ax / w > 0.78 ? "end" : "mid"
              }
              data-below={ay < 84 ? "" : undefined}
              style={{ left: `${(ax / w) * 100}%`, top: `${(ay / h) * 100}%` }}
              aria-hidden="true"
            >
              <b>{fmt(a.value)}</b>
              {viz.unit ? <span>{viz.unit}</span> : null}
              <em>{a.label}</em>
            </div>
          : null}
      </div>

      {/* a table ignores a 1px width, so the hidden wrapper is a div */}
      <div className={b.srOnly}>
        <table>
          <caption>
            {viz.title ?? "Kretanje po periodima"}
            {viz.unit ? `, ${viz.unit}` : ""}
          </caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">{viz.unit ?? "Vrednost"}</th>
            </tr>
          </thead>
          <tbody>
            {pts.map((p, i) => (
              <tr key={`${p.label}-${i}`}>
                <th scope="row">{p.label}</th>
                <td>{fmt(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

/** One figure of a chapter. A kind this page does not know draws nothing. */
export default function Viz({ viz, board = false }) {
  if (!viz || typeof viz !== "object") return null;
  switch (viz.kind) {
    case "stat":
      return <Stat viz={viz} />;
    case "compare":
      return <Compare viz={viz} board={board} />;
    case "table":
      return <DataTable viz={viz} />;
    case "share":
      return <Share viz={viz} />;
    case "trend":
      return <Trend viz={viz} />;
    default:
      return null;
  }
}
