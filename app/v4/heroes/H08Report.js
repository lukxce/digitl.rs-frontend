"use client";

import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import logo from "../../assets/digitl-logo.png";
import HeroCopy from "../HeroCopy";
import s from "./h08.module.css";

/* 08 · Izveštaj. The monthly report a client gets, as the hero image: a
   calm analytics card with a period switch, channel tabs, four KPIs that
   double as chart metrics, an area chart that morphs between datasets, and
   a channel split. All numbers are generated example data ("Primer"),
   seeded so server and client agree; nothing here is a real client. */

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/* ── example data ───────────────────────────────────────────────────── */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAYS = 180;
const END = Date.UTC(2026, 8, 30); // the report closes on 30 Sep
const MON = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "avg",
  "sep",
  "okt",
  "nov",
  "dec",
];
const WD = ["ned", "pon", "uto", "sre", "čet", "pet", "sub"];
const DATES = Array.from({ length: DAYS }, (_, i) => {
  const d = new Date(END - (DAYS - 1 - i) * 864e5);
  return { d: d.getUTCDate(), m: d.getUTCMonth(), w: d.getUTCDay() };
});
const WEEK = [0.8, 1.07, 1.1, 1.06, 1.03, 0.96, 0.82]; // Sun..Sat

const CHANNELS = [
  // visits/day and conversion grow from the first to the last day
  { id: "google", name: "Google", v: [96, 152], c: [0.026, 0.034], cost: 33 },
  { id: "meta", name: "Meta", v: [82, 116], c: [0.017, 0.023], cost: 18 },
  { id: "seo", name: "SEO", v: [58, 150], c: [0.022, 0.029], cost: 20 },
];

const RAW = (() => {
  const out = {};
  CHANNELS.forEach((ch, ci) => {
    const r = rng(97 + ci * 131);
    const visits = [];
    const leads = [];
    const cost = [];
    for (let i = 0; i < DAYS; i++) {
      const p = i / (DAYS - 1);
      const ease = p * (0.75 + 0.25 * p);
      const wave = 1 + 0.05 * Math.sin(i / 9 + ci * 2);
      const v =
        (ch.v[0] + (ch.v[1] - ch.v[0]) * ease) *
        WEEK[DATES[i].w] *
        wave *
        (0.88 + r() * 0.24);
      const conv = ch.c[0] + (ch.c[1] - ch.c[0]) * p;
      visits.push(Math.round(v));
      leads.push(Math.max(0, Math.round(v * conv * (0.7 + r() * 0.6))));
      cost.push(ch.cost * (ch.id === "seo" ? 1 : 0.92 + r() * 0.16));
    }
    out[ch.id] = { visits, leads, cost };
  });
  const sum = (k) =>
    Array.from({ length: DAYS }, (_, i) =>
      CHANNELS.reduce((a, ch) => a + out[ch.id][k][i], 0),
    );
  out.all = { visits: sum("visits"), leads: sum("leads"), cost: sum("cost") };
  return out;
})();

const METRICS = [
  { id: "visits", label: "Posete", chart: "Posete po danu" },
  { id: "leads", label: "Upiti", chart: "Upiti po danu" },
  {
    id: "cpl",
    label: "Cena po upitu",
    chart: "Cena po upitu, 7-dnevni prosek",
  },
  { id: "cr", label: "Stopa konverzije", chart: "Konverzija, 7-dnevni prosek" },
];
const PERIODS = [7, 30, 90];
const TABS = [
  { id: "all", name: "Sve" },
  { id: "google", name: "Google" },
  { id: "meta", name: "Meta" },
  { id: "seo", name: "SEO" },
];

const sumRange = (arr, a, b) => {
  let t = 0;
  for (let i = Math.max(0, a); i < b; i++) t += arr[i];
  return t;
};

// a day's value; ratios (and the 90-day view) use a trailing 7-day window
// so the line stays readable
function dayValue(src, metric, i, smooth) {
  if (metric === "visits" || metric === "leads") {
    if (!smooth) return src[metric][i];
    return sumRange(src[metric], i - 6, i + 1) / Math.min(7, i + 1);
  }
  const l = sumRange(src.leads, i - 6, i + 1);
  if (metric === "cpl") return l ? sumRange(src.cost, i - 6, i + 1) / l : 0;
  const v = sumRange(src.visits, i - 6, i + 1);
  return v ? (l / v) * 100 : 0;
}

function totals(src, a, b) {
  const visits = sumRange(src.visits, a, b);
  const leads = sumRange(src.leads, a, b);
  const cost = sumRange(src.cost, a, b);
  return {
    visits,
    leads,
    cost,
    cpl: leads ? cost / leads : 0,
    cr: visits ? (leads / visits) * 100 : 0,
  };
}

const fmtInt = (v) =>
  Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtDec = (v, d) => {
  const [a, b] = v.toFixed(d).split(".");
  return `${fmtInt(Number(a))},${b}`;
};
const FMT = {
  visits: fmtInt,
  leads: fmtInt,
  cpl: (v) => `${fmtDec(v, 2)} €`,
  cr: (v) => `${fmtDec(v, 2)}%`,
};
const AXIS = {
  visits: fmtInt,
  leads: fmtInt,
  cpl: (v) => `${fmtInt(v)} €`,
  cr: (v) => `${fmtDec(v, 1)}%`,
};
const dateLabel = (i) => `${DATES[i].d}. ${MON[DATES[i].m]}`;

function niceMax(v) {
  const raw = Math.max(v, 1e-6) / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * p >= raw) * p;
  return step * 4;
}

const S = 160; // samples per curve, the same for every dataset so they morph

function resample(vals, max) {
  const n = vals.length;
  const out = new Array(S);
  for (let i = 0; i < S; i++) {
    const t = (i / (S - 1)) * (n - 1);
    const k = Math.min(n - 2, Math.floor(t));
    const u = t - k;
    const p0 = vals[Math.max(0, k - 1)];
    const p1 = vals[k];
    const p2 = vals[k + 1];
    const p3 = vals[Math.min(n - 1, k + 2)];
    const v =
      0.5 *
      (2 * p1 +
        (-p0 + p2) * u +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
        (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    out[i] = Math.max(0, v) / max;
  }
  return out;
}

const isSmooth = (period, metric) =>
  period === 90 && (metric === "visits" || metric === "leads");

function buildView(period, ch, metric) {
  const src = RAW[ch];
  const a = DAYS - period;
  const smooth = isSmooth(period, metric);
  const now = [];
  const prev = [];
  for (let i = a; i < DAYS; i++) {
    now.push(dayValue(src, metric, i, smooth));
    prev.push(dayValue(src, metric, i - period, smooth));
  }
  const max = niceMax(Math.max(...now, ...prev) * 1.08);
  const cur = totals(src, a, DAYS);
  const before = totals(src, a - period, a);
  const split = CHANNELS.map((c) => ({
    ...c,
    leads: sumRange(RAW[c.id].leads, a, DAYS),
  }));
  let best = a;
  for (let i = a; i < DAYS; i++) if (src.leads[i] > src.leads[best]) best = i;
  return {
    a,
    smooth,
    n: period,
    now,
    prev,
    max,
    lineNow: resample(now, max),
    linePrev: resample(prev, max),
    cur,
    before,
    split,
    best,
  };
}

/* ── animated number ────────────────────────────────────────────────── */
function Num({ value, fmt, go, reduce }) {
  const ref = useRef(null);
  const [first] = useState(() => fmt(value));
  const shown = useRef(value);
  const armed = useRef(false);
  useIso(() => {
    if (!go) return;
    const el = ref.current;
    let from = shown.current;
    if (!armed.current) {
      armed.current = true;
      from = 0;
    }
    const to = value;
    if (reduce || from === to) {
      shown.current = to;
      el.textContent = fmt(to);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      const e = 1 - (1 - t) ** 4;
      shown.current = from + (to - from) * e;
      el.textContent = fmt(shown.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    el.textContent = fmt(from);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, go]);
  return (
    <span ref={ref} suppressHydrationWarning>
      {first}
    </span>
  );
}

function Delta({ now, before, invert }) {
  const pct = before ? ((now - before) / before) * 100 : 0;
  const good = invert ? pct <= 0 : pct >= 0;
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  return (
    <span className={s.delta} data-good={good || undefined}>
      <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
        data-down={pct < 0 || undefined}
      >
        <path d="M5 2.2 8.4 7H1.6L5 2.2Z" fill="currentColor" />
      </svg>
      {sign}
      {Math.abs(pct).toFixed(0)}%
    </span>
  );
}

function Seg({ group, items, value, onPick, dots }) {
  return (
    <div className={s.seg} role="tablist" aria-label={group}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={on}
            className={s.segBtn}
            data-on={on || undefined}
            onClick={() => onPick(it.id)}
          >
            {on
              ? <motion.span
                  layoutId={`h08-${group}`}
                  className={s.segPill}
                  transition={{ type: "spring", stiffness: 520, damping: 40 }}
                />
              : null}
            {dots ? <i className={s.dot} data-ch={it.id} /> : null}
            <span>{it.name}</span>
          </button>
        );
      })}
    </div>
  );
}

const linePath = (arr, top = 0) => {
  let d = "";
  for (let i = 0; i < S; i++) {
    const x = (i / (S - 1)) * 1000;
    const y = top + (1 - arr[i]) * (100 - top);
    d += `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(2)}`;
  }
  return d;
};

export default function H08Report({ clients }) {
  const [period, setPeriod] = useState(30);
  const [ch, setCh] = useState("all");
  const [metric, setMetric] = useState("leads");
  const [hover, setHover] = useState(null);
  const [go, setGo] = useState(false);
  const [reduce, setReduce] = useState(false);

  const view = useMemo(
    () => buildView(period, ch, metric),
    [period, ch, metric],
  );

  const cardRef = useRef(null);
  const areaRef = useRef(null);
  const lineRef = useRef(null);
  const prevRef = useRef(null);
  const shown = useRef(null);
  const touched = useRef(false);
  const inside = useRef(false);
  const visible = useRef(false);
  const touchTimer = useRef(0);

  // first view: draw the chart in and count the numbers up
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting) setGo(true);
      },
      { threshold: 0.15 },
    );
    io.observe(cardRef.current);
    return () => io.disconnect();
  }, []);

  // morph the curves between datasets
  useIso(() => {
    const target = { now: view.lineNow, prev: view.linePrev };
    const paint = (now, prev) => {
      const line = linePath(now);
      lineRef.current.setAttribute("d", line);
      areaRef.current.setAttribute("d", `${line}L1000,100L0,100Z`);
      prevRef.current.setAttribute("d", linePath(prev));
    };
    const from = shown.current;
    if (!from || reduce) {
      shown.current = target;
      paint(target.now, target.prev);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / 780);
      const e = 1 - (1 - k) ** 4;
      const now = from.now.map((v, i) => v + (target.now[i] - v) * e);
      const prev = from.prev.map((v, i) => v + (target.prev[i] - v) * e);
      shown.current = { now, prev };
      paint(now, prev);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [view, reduce]);

  // left alone, the card walks through the channels so it reads as live
  useEffect(() => {
    if (!go || reduce) return;
    const order = TABS.map((t) => t.id);
    const id = setInterval(() => {
      if (touched.current || inside.current || !visible.current) return;
      setCh((c) => order[(order.indexOf(c) + 1) % order.length]);
    }, 3800);
    return () => clearInterval(id);
  }, [go, reduce]);

  const stopAuto = () => {
    touched.current = true;
  };

  const pick = (fn) => (v) => {
    stopAuto();
    fn(v);
  };

  const plotAt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setHover(Math.round(x * (view.n - 1)));
  };
  const onPlotDown = (e) => {
    if (e.pointerType === "mouse") return;
    stopAuto();
    clearTimeout(touchTimer.current);
    plotAt(e);
  };
  const onPlotMove = (e) => {
    if (e.pointerType !== "mouse" && e.buttons === 0 && e.pressure === 0)
      return;
    plotAt(e);
  };
  const onPlotEnd = (e) => {
    if (e.pointerType === "mouse") {
      setHover(null);
      return;
    }
    clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setHover(null), 1600);
  };

  const fmt = view.smooth ? (v) => fmtDec(v, 1) : FMT[metric];
  const chartTitle = view.smooth
    ? `${METRICS.find((x) => x.id === metric).label}, 7-dnevni prosek`
    : METRICS.find((x) => x.id === metric).chart;
  const ticks = [1, 0.75, 0.5, 0.25, 0];
  const xTicks =
    view.n === 7
      ? [0, 1, 2, 3, 4, 5, 6]
      : view.n === 30
        ? [0, 7, 14, 21, 29]
        : [0, 22, 45, 67, 89];
  const hi = hover == null ? null : Math.min(hover, view.n - 1);
  const hx = hi == null ? 0 : (hi / (view.n - 1)) * 100;
  const tab = TABS.find((t) => t.id === ch);
  const totalLeads = view.split.reduce((a, c) => a + c.leads, 0) || 1;
  const additive = metric === "visits" || metric === "leads";

  const kpis = [
    { id: "visits", value: view.cur.visits, before: view.before.visits },
    { id: "leads", value: view.cur.leads, before: view.before.leads },
    { id: "cpl", value: view.cur.cpl, before: view.before.cpl, invert: true },
    { id: "cr", value: view.cur.cr, before: view.before.cr },
  ];

  return (
    <div className={s.hero}>
      <HeroCopy align="center" />

      <div
        ref={cardRef}
        className={s.card}
        data-go={go || undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") inside.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") inside.current = false;
        }}
      >
        <header className={s.head}>
          <div className={s.brand}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="" className={s.mark} />
            <div className={s.brandText}>
              <b>Mesečni izveštaj</b>
              <span>
                vasafirma.rs · {dateLabel(view.a)} – {dateLabel(DAYS - 1)}
              </span>
            </div>
            <span className={s.badge}>Primer</span>
          </div>
          <div className={s.controls}>
            <Seg
              group="period"
              items={PERIODS.map((p) => ({ id: p, name: `${p} dana` }))}
              value={period}
              onPick={pick(setPeriod)}
            />
            <div className={s.tabsScroll}>
              <Seg
                group="kanal"
                items={TABS}
                value={ch}
                onPick={pick(setCh)}
                dots
              />
            </div>
          </div>
        </header>

        <div className={s.kpis}>
          {kpis.map((k) => {
            const m = METRICS.find((x) => x.id === k.id);
            const on = metric === k.id;
            return (
              <button
                key={k.id}
                type="button"
                data-kpi
                className={s.kpi}
                data-on={on || undefined}
                aria-pressed={on}
                onClick={() => {
                  stopAuto();
                  setMetric(k.id);
                }}
              >
                <span className={s.kpiTop}>
                  <span className={s.kpiLabel}>{m.label}</span>
                  <Delta now={k.value} before={k.before} invert={k.invert} />
                </span>
                <span className={s.kpiRow}>
                  <span className={s.kpiValue}>
                    <Num
                      value={k.value}
                      fmt={FMT[k.id]}
                      go={go}
                      reduce={reduce}
                    />
                  </span>
                  <span className={s.kpiPrev}>pre {FMT[k.id](k.before)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className={s.body}>
          <div className={s.chart} data-ch={ch}>
            <div className={s.chartHead}>
              <b>{chartTitle}</b>
              <span className={s.legend}>
                <span>
                  <i className={s.legNow} />{" "}
                  {tab.name === "Sve" ? "Svi kanali" : tab.name}
                </span>
                <span>
                  <i className={s.legPrev} /> prethodnih {period} dana
                </span>
              </span>
            </div>
            <div className={s.plotWrap}>
              <div className={s.yAxis} aria-hidden="true">
                {ticks.map((t) => (
                  <span key={t} style={{ top: `${(1 - t) * 100}%` }}>
                    {AXIS[metric](view.max * t)}
                  </span>
                ))}
              </div>
              <div
                className={s.plot}
                data-plot
                onPointerMove={onPlotMove}
                onPointerDown={onPlotDown}
                onPointerLeave={onPlotEnd}
                onPointerUp={onPlotEnd}
                onPointerCancel={onPlotEnd}
              >
                {ticks.map((t) => (
                  <span
                    key={t}
                    className={s.grid}
                    style={{ top: `${(1 - t) * 100}%` }}
                  />
                ))}
                <svg
                  className={s.svg}
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="h08-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" className={s.stopTop} />
                      <stop offset="1" className={s.stopBottom} />
                    </linearGradient>
                  </defs>
                  <path ref={prevRef} className={s.prev} />
                  <path
                    ref={areaRef}
                    className={s.area}
                    fill="url(#h08-fill)"
                  />
                  <path ref={lineRef} className={s.line} />
                </svg>

                {hi != null
                  ? <>
                      <span className={s.cross} style={{ left: `${hx}%` }} />
                      <span
                        className={s.pin}
                        style={{
                          left: `${hx}%`,
                          top: `${(1 - view.now[hi] / view.max) * 100}%`,
                        }}
                      />
                      <div
                        className={s.tip}
                        data-flip={hx > 58 || undefined}
                        style={{ left: `${hx}%` }}
                      >
                        <span className={s.tipDate}>
                          {WD[DATES[view.a + hi].w]}, {dateLabel(view.a + hi)}
                        </span>
                        <span className={s.tipMain}>
                          <i className={s.legNow} />
                          {METRICS.find((x) => x.id === metric).label}
                          <b>{fmt(view.now[hi])}</b>
                        </span>
                        {ch === "all" && additive
                          ? CHANNELS.map((c) => (
                              <span key={c.id} className={s.tipRow}>
                                <i className={s.dot} data-ch={c.id} />
                                {c.name}
                                <b>
                                  {fmt(
                                    dayValue(
                                      RAW[c.id],
                                      metric,
                                      view.a + hi,
                                      view.smooth,
                                    ),
                                  )}
                                </b>
                              </span>
                            ))
                          : null}
                        <span className={s.tipRow} data-muted>
                          <i className={s.legPrev} />
                          pre {period} dana
                          <b>{fmt(view.prev[hi])}</b>
                        </span>
                      </div>
                    </>
                  : null}
              </div>
              <div className={s.xAxis} aria-hidden="true">
                {xTicks.map((i, j) => (
                  <span
                    key={`${view.n}-${i}`}
                    data-edge={
                      j === 0
                        ? "start"
                        : j === xTicks.length - 1
                          ? "end"
                          : undefined
                    }
                    data-odd={view.n === 7 && j % 2 === 1 ? true : undefined}
                    style={{ left: `${(i / (view.n - 1)) * 100}%` }}
                  >
                    {dateLabel(view.a + i)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className={s.side}>
            <div className={s.sideBlock}>
              <span className={s.sideTitle}>Upiti po kanalu</span>
              <div className={s.stack}>
                {view.split.map((c) => (
                  <span
                    key={c.id}
                    className={s.seg2}
                    data-ch={c.id}
                    data-dim={(ch !== "all" && ch !== c.id) || undefined}
                    style={{ flexGrow: c.leads }}
                  />
                ))}
              </div>
              <ul className={s.split}>
                {view.split.map((c) => (
                  <li
                    key={c.id}
                    data-dim={(ch !== "all" && ch !== c.id) || undefined}
                  >
                    <i className={s.dot} data-ch={c.id} />
                    <span>{c.name}</span>
                    <b>
                      <Num
                        value={c.leads}
                        fmt={fmtInt}
                        go={go}
                        reduce={reduce}
                      />
                    </b>
                    <em>{Math.round((c.leads / totalLeads) * 100)}%</em>
                  </li>
                ))}
              </ul>
            </div>
            <div className={s.facts}>
              <div>
                <span>Uloženo</span>
                <b>
                  <Num
                    value={view.cur.cost}
                    fmt={(v) => `${fmtInt(v)} €`}
                    go={go}
                    reduce={reduce}
                  />
                </b>
              </div>
              <div>
                <span>Najbolji dan</span>
                <b>
                  {WD[DATES[view.best].w]}, {dateLabel(view.best)}
                </b>
                <em>
                  {RAW[ch].leads[view.best]}{" "}
                  {RAW[ch].leads[view.best] % 10 === 1 &&
                  RAW[ch].leads[view.best] % 100 !== 11
                    ? "upit"
                    : "upita"}
                </em>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
