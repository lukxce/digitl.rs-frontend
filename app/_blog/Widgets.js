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
import { ArrowRight, Check } from "../_home/icons";
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
                  {i === cols.length - 1 ? <Check size={12} strokeWidth={3} /> : "·"}
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
          <b>{t}</b>
          {text
            ? <span>
                <Rich text={text} />
              </span>
            : null}
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

const KINDS = {
  stat: Stat,
  stats: Stats,
  bars: Bars,
  compare: Compare,
  todo: Todo,
  steps: Steps,
  check: Checklist,
};

export default function Widget({ kind, lines }) {
  const C = KINDS[kind];
  return C ? <C lines={lines} /> : null;
}
