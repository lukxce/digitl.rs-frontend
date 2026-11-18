"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import p from "./pieces.module.css";
import { useEnter } from "./Viz";

/* Interactive pieces a case study can carry, next to the charts in Viz.js:
   a search you can switch between queries, the printer finder, the quick
   order and the price tool. Every one of them works on the story's own data
   and says under it where that data comes from. */

const EASE = [0.16, 1, 0.3, 1];
const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Card({ title, sub, note, children, kind }) {
  return (
    <figure className={p.card} data-kind={kind}>
      {title || sub
        ? <header className={p.head}>
            {title ? <b>{title}</b> : null}
            {sub ? <span>{sub}</span> : null}
          </header>
        : null}
      {children}
      {note
        ? <figcaption className={p.note}>
            <i aria-hidden="true" />
            {note}
          </figcaption>
        : null}
    </figure>
  );
}

/* ── serp: pick a search, see where the client stands ─────────────────── */
/* data: { title, note, site, queries: [{ q, pos }] }. The other results are
   drawn as plain bars on purpose: only the client's place is the claim. */
function Serp({ data }) {
  const [at, setAt] = useState(0);
  const q = data.queries[at];
  const place = Math.max(
    1,
    Math.round(Number(String(q.pos).replace(",", "."))),
  );
  const rows = Array.from(
    { length: Math.max(6, Math.min(10, place + 2)) },
    (_, i) => i + 1,
  );
  return (
    <Card title={data.title} note={data.note} kind="serp">
      <div className={p.chips} role="tablist" aria-label="Pretrage">
        {data.queries.map((x, i) => (
          <button
            key={x.q}
            type="button"
            role="tab"
            aria-selected={i === at}
            onClick={() => setAt(i)}
          >
            {x.q}
          </button>
        ))}
      </div>
      <div className={p.serp}>
        <div className={p.bar}>
          <span className={p.g} aria-hidden="true">
            G
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={q.q}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {q.q}
            </motion.span>
          </AnimatePresence>
        </div>
        <ol className={p.results}>
          {rows.map((n) => {
            const me = n === place;
            return (
              <motion.li
                key={`${q.q}-${n}`}
                layout
                data-me={me ? "" : undefined}
                initial={{ opacity: 0, x: me ? 24 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  ease: EASE,
                  delay: me ? 0.15 : n * 0.02,
                }}
              >
                <i>{n}</i>
                {me
                  ? <span className={p.mine}>
                      <b>{data.site}</b>
                      <em>Prosečna pozicija {q.pos}</em>
                    </span>
                  : <span className={p.other} aria-hidden="true">
                      <s style={{ width: `${46 + ((n * 37) % 40)}%` }} />
                      <s style={{ width: `${30 + ((n * 23) % 45)}%` }} />
                    </span>}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

/* ── finder: type the printer, get the toner ─────────────────────────── */
/* data: { title, note, examples: [model], printers: { model: [{ code, pages, price }] } } */
function Finder({ data }) {
  const [q, setQ] = useState(data.examples[0]);
  const norm = (s) => s.toLowerCase().replace(/[\s-]+/g, "");
  const hit = useMemo(() => {
    const n = norm(q);
    if (n.length < 3) return null;
    return Object.keys(data.printers).find((m) => norm(m).includes(n)) ?? null;
  }, [q, data.printers]);
  const list = hit ? data.printers[hit] : [];
  return (
    <Card title={data.title} note={data.note} kind="finder">
      <label className={p.search}>
        <input
          aria-label="Model štampača"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Upišite model štampača"
          spellCheck="false"
        />
      </label>
      <div className={p.chips}>
        {data.examples.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={q === m}
            onClick={() => setQ(m)}
          >
            {m}
          </button>
        ))}
      </div>
      <div className={p.found} aria-live="polite">
        {hit
          ? <>
              <p className={p.fit}>
                <i aria-hidden="true" />
                {hit}: {list.length}{" "}
                {list.length === 1 ? "toner odgovara" : "tonera odgovara"}
              </p>
              <ul>
                <AnimatePresence initial={false}>
                  {list.map((t, i) => (
                    <motion.li
                      key={`${hit}-${t.code}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        ease: EASE,
                        delay: i * 0.06,
                      }}
                    >
                      <span className={p.box}>{t.code}</span>
                      <span>
                        <b>Zamenski toner {t.code}</b>
                        <em>{fmt(t.pages)} strana</em>
                      </span>
                      <strong>{fmt(t.price)} RSD</strong>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </>
          : <p className={p.empty}>
              {norm(q).length < 3
                ? "Upišite bar tri znaka modela."
                : "Ovaj model nije u primeru. Probajte jedan od ponuđenih."}
            </p>}
      </div>
    </Card>
  );
}

/* ── quickorder: paste a list of codes, get a priced cart ────────────── */
/* data: { title, note, start: "85A 5\n…", items: { CODE: { name, price } } } */
function QuickOrder({ data }) {
  const [text, setText] = useState(data.start);
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(
        /^(?:(\d+)\s*x\s*)?([A-Za-z0-9-]+?)(?:\s*(?:x\s*)?(\d+))?$/i,
      );
      const code = (m?.[2] ?? l).toUpperCase();
      const qty = Number(m?.[1] ?? m?.[3] ?? 1) || 1;
      return { raw: l, code, qty, item: data.items[code] ?? null };
    });
  const found = lines.filter((l) => l.item);
  const total = found.reduce((s, l) => s + l.qty * l.item.price, 0);
  return (
    <Card title={data.title} note={data.note} kind="quick">
      <div className={p.quick}>
        <label className={p.paste}>
          <span>Šifre i količine, jedna po redu</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            spellCheck="false"
          />
        </label>
        <div className={p.order}>
          <ul>
            {lines.map((l) => (
              <li key={l.raw} data-miss={l.item ? undefined : ""}>
                <i aria-hidden="true">{l.item ? "✓" : "?"}</i>
                <span>
                  <b>{l.item ? l.item.name : l.raw}</b>
                  <em>
                    {l.item
                      ? `${l.qty} × ${fmt(l.item.price)} RSD`
                      : "Nije pronađeno"}
                  </em>
                </span>
                <strong>{l.item ? `${fmt(l.qty * l.item.price)}` : ""}</strong>
              </li>
            ))}
          </ul>
          <p className={p.total}>
            <span>
              Pronađeno {found.length} od {lines.length}
            </span>
            <b>{fmt(total)} RSD sa PDV-om</b>
          </p>
          <span className={p.cta}>Dodaj sve u korpu</span>
        </div>
      </div>
    </Card>
  );
}

/* ── pricetool: the Monday report, one row at a time ─────────────────── */
/* data: { title, sub, note, rows: [{ code, name, now, proposal }] } */
function PriceTool({ data }) {
  const [rows, setRows] = useState(() =>
    data.rows.map((r) => ({ ...r, value: r.proposal, sent: false })),
  );
  const sent = rows.filter((r) => r.sent).length;
  return (
    <Card title={data.title} sub={data.sub} note={data.note} kind="price">
      <div className={p.ptable}>
        <div className={p.prow} data-head="">
          <span>Artikal</span>
          <span>Cena sada</span>
          <span>Predlog</span>
          <span>Promena</span>
          <span />
        </div>
        {rows.map((r, i) => {
          const v = Number(String(r.value).replace(/\./g, "")) || 0;
          const ch = Math.round(((v - r.now) / r.now) * 100);
          return (
            <div
              key={r.code}
              className={p.prow}
              data-sent={r.sent ? "" : undefined}
            >
              <span>
                <b>{r.name}</b>
                <em>{r.code}</em>
              </span>
              <span>{fmt(r.now)}</span>
              <span>
                <input
                  value={r.value}
                  inputMode="numeric"
                  disabled={r.sent}
                  aria-label={`Predlog cene za ${r.name}`}
                  onChange={(e) =>
                    setRows((all) =>
                      all.map((x, j) =>
                        j === i ? { ...x, value: e.target.value } : x,
                      ),
                    )
                  }
                />
              </span>
              <span data-up={ch > 0 ? "" : undefined}>
                {ch > 0 ? "+" : ""}
                {ch}%
              </span>
              <span>
                <button
                  type="button"
                  onClick={() =>
                    setRows((all) =>
                      all.map((x, j) =>
                        j === i ? { ...x, sent: !x.sent } : x,
                      ),
                    )
                  }
                >
                  {r.sent ? "Poslato" : "Pošalji"}
                </button>
              </span>
            </div>
          );
        })}
      </div>
      <p className={p.ptotal}>
        {sent
          ? `${sent} od ${rows.length} cena poslato na sajt.`
          : "Ispravite predlog ako treba, pa pošaljite cenu na sajt."}
      </p>
    </Card>
  );
}

/* ── feed: a profile grid that fills in when it comes on screen ───────── */
/* data: { title, note, cols, ratio, items: [src] } */
function Feed({ data }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.25);
  return (
    <Card title={data.title} note={data.note} kind="feed">
      <div
        ref={ref}
        className={p.feed}
        data-stage={stage}
        style={{ "--c": data.cols ?? 3, "--r": data.ratio ?? "4 / 5" }}
      >
        {data.items.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={`${src}?w=640&fm=webp&q=80`}
            alt=""
            loading="lazy"
            style={{ "--i": i }}
          />
        ))}
      </div>
    </Card>
  );
}

const PIECES = {
  serp: Serp,
  finder: Finder,
  quickorder: QuickOrder,
  pricetool: PriceTool,
  feed: Feed,
};

export default function Piece({ piece }) {
  const C = PIECES[piece?.kind];
  return C ? <C data={piece} /> : null;
}
