"use client";

/* The designed pieces a post can carry between its paragraphs, written in
   the post's Markdown as fenced blocks:

   ```stat            big: 292 mil. / label: … / source: …
   ```stats           value | label        (2 to 4 tiles, the first is blue)
   ```bars            # title, then  label | number | shown   (* = ours)
   ```compare         A: title / - item … / B: title / - item …  (B wins)
   ```todo            # title, then  - item …   (the "what to do" box)
   ```steps           title | text      (numbered cards)
   ```check           # title, then  - item …   (a checklist you can tick)

   Same language as the site: white cards, the blue card for what matters,
   lime for the number, everything comes in once when it scrolls into view. */

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, X } from "../_home/icons";
import { BESPOKE } from "./pieces";
import w from "./widgets.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* **bold** only; the pieces are short */
function Rich({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? // biome-ignore lint/suspicious/noArrayIndexKey: fixed text
        <strong key={i}>{p.slice(2, -2)}</strong>
      : p,
  );
}

const field = (lines, key) =>
  lines
    .find((l) => l.toLowerCase().startsWith(`${key}:`))
    ?.slice(key.length + 1)
    .trim() ?? "";

const title = (lines) =>
  lines.find((l) => l.startsWith("# "))?.slice(2).trim() ?? "";

const items = (lines) =>
  lines.filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());

/* A number that rolls up when it comes into view, keeping its own format
   ("292 mil.", "30,4", "2x", "1.500"). */
function Roll({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const m = String(value).match(/^(\D*)([\d.,]+)(.*)$/);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!m || !seen) return;
    const raw = m[2];
    const comma = raw.includes(",");
    const n = Number(raw.replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(n)) return;
    const dec = comma ? raw.split(",")[1].length : 0;
    const fmt = (v) => {
      const s = v.toFixed(dec).replace(".", ",");
      const [i, d] = s.split(",");
      const grouped = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return m[1] + (d ? `${grouped},${d}` : grouped) + m[3];
    };
    setShown(fmt(0));
    const c = animate(0, n, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => setShown(fmt(v)),
    });
    return () => c.stop();
    // biome-ignore lint/correctness/useExhaustiveDependencies: run once in view
  }, [seen]);
  return <span ref={ref}>{shown}</span>;
}

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: EASE },
};

function Stat({ lines }) {
  return (
    <motion.figure className={w.stat} {...rise}>
      <div className={w.statNum}>
        <Roll value={field(lines, "big")} />
      </div>
      <div className={w.statSide}>
        <p>
          <Rich text={field(lines, "label")} />
        </p>
        {field(lines, "source")
          ? <figcaption>{field(lines, "source")}</figcaption>
          : null}
      </div>
    </motion.figure>
  );
}

function Stats({ lines }) {
  const rows = lines.map((l) => l.split("|").map((x) => x.trim()));
  return (
    <div className={w.stats} data-n={rows.length}>
      {rows.map(([v, label], i) => (
        <motion.div
          key={label}
          className={w.tile}
          data-on={i === 0 ? "" : undefined}
          {...rise}
          transition={{ ...rise.transition, delay: i * 0.08 }}
        >
          <b>
            <Roll value={v} />
          </b>
          <span>
            <Rich text={label} />
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function Bars({ lines }) {
  const rows = lines
    .filter((l) => !l.startsWith("#"))
    .map((l) => {
      const [label, num, shown] = l.split("|").map((x) => x.trim());
      const ours = label.startsWith("*");
      return {
        label: ours ? label.slice(1).trim() : label,
        n: Number(String(num).replace(/\./g, "").replace(",", ".")),
        shown: shown || num,
        ours,
      };
    });
  const max = Math.max(...rows.map((r) => r.n));
  return (
    <motion.figure className={w.bars} {...rise}>
      {title(lines)
        ? <figcaption className={w.cap}>{title(lines)}</figcaption>
        : null}
      {rows.map((r, i) => (
        <div key={r.label} className={w.bar} data-on={r.ours ? "" : undefined}>
          <span className={w.barLabel}>{r.label}</span>
          <span className={w.track}>
            <motion.i
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max(4, (r.n / max) * 100)}%` }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.1 + i * 0.1 }}
            />
          </span>
          <b className={w.barNum}>{r.shown}</b>
        </div>
      ))}
    </motion.figure>
  );
}

function Compare({ lines }) {
  const cols = [];
  for (const l of lines) {
    const head = l.match(/^([AB]):\s*(.+)$/);
    if (head) cols.push({ name: head[2], items: [] });
    else if (l.startsWith("- ") && cols.length)
      cols[cols.length - 1].items.push(l.slice(2));
  }
  return (
    <div className={w.compare}>
      {cols.map((c, i) => (
        <motion.div
          key={c.name}
          className={w.side}
          data-on={i === cols.length - 1 ? "" : undefined}
          {...rise}
          transition={{ ...rise.transition, delay: i * 0.12 }}
        >
          <span className={w.sideName}>{c.name}</span>
          <div className={w.list} role="list">
            {c.items.map((t) => (
              <div key={t} className={w.item} role="listitem">
                <i aria-hidden="true">
                  {i === cols.length - 1
                    ? <Check size={12} strokeWidth={3} />
                    : <X size={11} strokeWidth={3} />}
                </i>
                <span>
                  <Rich text={t} />
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function Todo({ lines }) {
  return (
    <motion.aside className={w.todo} {...rise}>
      <span className={w.todoLabel}>{title(lines) || "Šta da uradite"}</span>
      <div className={w.list} role="list">
        {items(lines).map((t, i) => (
          <motion.div
            key={t}
            role="listitem"
            className={w.item}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.08 }}
          >
            <ArrowRight size={16} />
            <span>
              <Rich text={t} />
            </span>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}

function Steps({ lines }) {
  const rows = lines.map((l) => l.split("|").map((x) => x.trim()));
  return (
    <div className={w.steps} role="list">
      {rows.map(([t, text], i) => (
        <motion.div
          key={t}
          role="listitem"
          className={w.step}
          {...rise}
          transition={{ ...rise.transition, delay: i * 0.08 }}
        >
          <span className={w.stepNo}>{i + 1}</span>
          <span className={w.stepBody}>
            <b>{t}</b>
            {text
              ? <span>
                  <Rich text={text} />
                </span>
              : null}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function Checklist({ lines }) {
  const list = items(lines);
  const [done, setDone] = useState(() => list.map(() => false));
  const count = done.filter(Boolean).length;
  return (
    <motion.div className={w.check} {...rise}>
      <div className={w.checkTop}>
        <span>{title(lines) || "Proverite"}</span>
        <em>
          {count} / {list.length}
        </em>
      </div>
      <div className={w.list} role="list">
        {list.map((t, i) => (
          <div key={t} role="listitem">
            <button
              type="button"
              aria-pressed={done[i]}
              onClick={() =>
                setDone((d) => d.map((v, j) => (j === i ? !v : v)))
              }
            >
              <i aria-hidden="true">
                {done[i] ? <Check size={13} strokeWidth={3.2} /> : null}
              </i>
              <span>
                <Rich text={t} />
              </span>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}


/* ```waffle  total: 9 / lit: 6 / label: …  — dots fill one by one */
function Waffle({ lines }) {
  const total = Math.min(120, Number(field(lines, "total")) || 0);
  const lit = Math.min(total, Number(field(lines, "lit")) || 0);
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  return (
    <motion.figure ref={ref} className={w.waffle} {...rise}>
      <div className={w.waffleNum}>
        <b className={w.waffleBig}>
          <Roll value={String(lit)} />
        </b>
        <span>/ {total}</span>
      </div>
      <div className={w.dots} data-many={total > 30 ? "" : undefined}>
        {Array.from({ length: total }, (_, i) => (
          <motion.i
            // biome-ignore lint/suspicious/noArrayIndexKey: dots
            key={i}
            data-lit={i < lit ? "" : undefined}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={seen ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.15 + i * (0.9 / total), duration: 0.4, ease: EASE }}
          />
        ))}
      </div>
      <figcaption className={w.waffleCap}>
        <Rich text={field(lines, "label")} />
      </figcaption>
    </motion.figure>
  );
}

/* ```range  # title / min | max | label   — a span on a scale, per row */
function Range({ lines }) {
  const rows = lines
    .filter((l) => !l.startsWith("#"))
    .map((l) => l.split("|").map((x) => x.trim()));
  const num = (v) => Number(String(v).replace(/\./g, "").replace(",", "."));
  const lo = Math.min(...rows.map((r) => num(r[0])));
  const hi = Math.max(...rows.map((r) => num(r[1])));
  const pos = (v) => ((num(v) - lo) / (hi - lo || 1)) * 100;
  return (
    <motion.figure className={w.range} {...rise}>
      {title(lines) ? <figcaption className={w.cap}>{title(lines)}</figcaption> : null}
      {rows.map(([a, b, label], i) => (
        <div key={label} className={w.rangeRow}>
          <span className={w.rangeLabel}>{label}</span>
          <span className={w.rangeTrack}>
            <motion.i
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.12 }}
              style={{ left: `${pos(a)}%`, width: `${Math.max(2, pos(b) - pos(a))}%` }}
            />
          </span>
          <span className={w.rangeNums}>
            {a} do {b}
          </span>
        </div>
      ))}
    </motion.figure>
  );
}

/* ```review  who / stars / text / reply   — an example review arrives, its
   stars fill, then the owner's reply types itself in */
function Review({ lines }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const stars = Number(field(lines, "stars")) || 5;
  const reply = field(lines, "reply");
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!seen || !reply) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(reply.slice(0, i));
      if (i >= reply.length) clearInterval(id);
    }, 28);
    const start = setTimeout(() => {}, 0);
    return () => {
      clearInterval(id);
      clearTimeout(start);
    };
  }, [seen, reply]);
  const flag = field(lines, "flag");
  return (
    <div ref={ref} className={w.review}>
      <span className={w.example}>Primer</span>
      <motion.div
        className={w.rCard}
        data-flag={flag ? "" : undefined}
        initial={{ opacity: 0, y: 16 }}
        animate={seen ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className={w.rTop}>
          <i className={w.rAvatar}>{field(lines, "who").slice(0, 1)}</i>
          <b>{field(lines, "who")}</b>
          <span className={w.rStars}>
            {Array.from({ length: 5 }, (_, i) => (
              <motion.span
                // biome-ignore lint/suspicious/noArrayIndexKey: stars
                key={i}
                data-on={i < stars ? "" : undefined}
                initial={{ scale: 0 }}
                animate={seen ? { scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 400, damping: 14 }}
              >
                ★
              </motion.span>
            ))}
          </span>
          {flag
            ? <motion.em
                className={w.rFlag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={seen ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                {flag}
              </motion.em>
            : null}
        </div>
        <p>{field(lines, "text")}</p>
      </motion.div>
      {reply
        ? <motion.div
            className={w.rReply}
            initial={{ opacity: 0, x: 12 }}
            animate={seen ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.5, ease: EASE }}
          >
            <b>Odgovor vlasnika</b>
            <span>
              {typed}
              {typed.length < reply.length ? <i className={w.caret} /> : null}
            </span>
          </motion.div>
        : null}
    </div>
  );
}

/* ```toggle  A: … / - item / B: … / - item   — a switch between two ways;
   it flips by itself once, then the reader can flip it */
function Toggle({ lines }) {
  const cols = [];
  for (const l of lines) {
    const head = l.match(/^([AB]):\s*(.+)$/);
    if (head) cols.push({ name: head[2], items: [] });
    else if (l.startsWith("- ") && cols.length)
      cols[cols.length - 1].items.push(l.slice(2));
  }
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [on, setOn] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setOn(1), 900);
    return () => clearTimeout(t);
  }, [seen]);
  if (cols.length < 2) return null;
  const c = cols[on];
  return (
    <div ref={ref} className={w.toggle} data-on={on ? "" : undefined}>
      <div className={w.switch} role="tablist">
        {cols.map((x, i) => (
          <button
            key={x.name}
            type="button"
            role="tab"
            aria-selected={on === i}
            onClick={() => setOn(i)}
          >
            {x.name}
          </button>
        ))}
        <motion.i
          className={w.knob}
          animate={{ x: on ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      </div>
      <motion.div
        key={on}
        className={w.toggleBody}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {c.items.map((t) => (
          <div key={t} className={w.toggleItem}>
            <i aria-hidden="true">
              {on ? <Check size={12} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
            </i>
            <span>
              <Rich text={t} />
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}


/* ```calc  — the Google Ads budget rules as a slider: a daily budget, what
   Google may spend in one day (2x) and the monthly cap (30,4x). Lines:
   label / unit / min / max / step / start, then  out: factor | text */
function Calc({ lines }) {
  const min = Number(field(lines, "min")) || 0;
  const max = Number(field(lines, "max")) || 100;
  const step = Number(field(lines, "step")) || 1;
  const unit = field(lines, "unit");
  const [v, setV] = useState(Number(field(lines, "start")) || min);
  const outs = lines
    .filter((l) => l.startsWith("out:"))
    .map((l) => l.slice(4).split("|").map((x) => x.trim()));
  const fmt = (n) =>
    Math.round(n)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (
    <motion.div className={w.calc} {...rise}>
      <div className={w.calcTop}>
        <span className={w.cap}>{field(lines, "label")}</span>
        <b className={w.calcValue}>
          {fmt(v)} <small>{unit}</small>
        </b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        className={w.slider}
        style={{ "--p": `${((v - min) / (max - min)) * 100}%` }}
        aria-label={field(lines, "label")}
      />
      <div className={w.calcOuts}>
        {outs.map(([f, text]) => (
          <div key={text} className={w.calcOut}>
            <motion.b key={v} initial={{ y: 6, opacity: 0.4 }} animate={{ y: 0, opacity: 1 }}>
              {fmt(v * Number(String(f).replace(",", ".")))} <small>{unit}</small>
            </motion.b>
            <span>
              <Rich text={text} />
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ```quiz  — "mit ili istina": each line  claim | answer | true/false ;
   the card flips when tapped */
function Quiz({ lines }) {
  const rows = lines
    .filter((l) => !l.startsWith("#"))
    .map((l) => l.split("|").map((x) => x.trim()));
  const [open, setOpen] = useState(() => rows.map(() => false));
  return (
    <div className={w.quiz}>
      {title(lines) ? <span className={w.cap}>{title(lines)}</span> : null}
      <div className={w.quizGrid}>
        {rows.map(([q, a, verdict], i) => {
          const yes = /^(da|tačno|true|istina)/i.test(verdict ?? "");
          return (
            <button
              key={q}
              type="button"
              className={w.qCard}
              data-open={open[i] ? "" : undefined}
              onClick={() => setOpen((o) => o.map((x, j) => (j === i ? !x : x)))}
              aria-pressed={open[i]}
            >
              <span className={w.qFront}>
                <em>Mit ili istina?</em>
                <b>{q}</b>
                <small>Dodirnite za odgovor</small>
              </span>
              <span className={w.qBack} data-yes={yes ? "" : undefined}>
                <em>{yes ? "Istina" : "Mit"}</em>
                <span>
                  <Rich text={a} />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const KINDS = {
  stat: Stat,
  stats: Stats,
  bars: Bars,
  compare: Compare,
  todo: Todo,
  steps: Steps,
  check: Checklist,
  waffle: Waffle,
  range: Range,
  review: Review,
  toggle: Toggle,
  calc: Calc,
  quiz: Quiz,
};

export default function Widget({ kind, lines }) {
  if (kind === "piece") {
    const P = BESPOKE[field(lines, "name")];
    return P ? <P lines={lines.filter((l) => !l.startsWith("name:"))} /> : null;
  }
  const C = KINDS[kind];
  return C ? <C lines={lines} /> : null;
}
