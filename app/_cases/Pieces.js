"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
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

/* Plays on its own while on screen, like the blog's figures: steps through
   n states every ms until the reader picks one, then stays where they put it. */
function useAuto(n, ms, start = 0) {
  const ref = useRef(null);
  const [at, setAt] = useState(start);
  const [held, setHeld] = useState(false);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!seen || held || n < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAt((v) => (v + 1) % n), ms);
    return () => clearTimeout(t);
  }, [seen, held, at, n, ms]);
  const pick = (i) => {
    setHeld(true);
    setAt(i);
  };
  return { ref, at, pick };
}

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
  const { ref, at, pick: setAt } = useAuto(data.queries.length, 2600);
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
      <div ref={ref} className={p.chips} role="tablist" aria-label="Pretrage">
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
  // cycles through the example printers until the reader types or picks one
  const { ref, at } = useAuto(data.examples.length, 2600);
  const [typed, setQ] = useState(null);
  const q = typed ?? data.examples[at];
  const norm = (s) => s.toLowerCase().replace(/[\s-]+/g, "");
  const hit = useMemo(() => {
    const n = norm(q);
    if (n.length < 3) return null;
    return Object.keys(data.printers).find((m) => norm(m).includes(n)) ?? null;
  }, [q, data.printers]);
  const list = hit ? data.printers[hit] : [];
  return (
    <Card title={data.title} note={data.note} kind="finder">
      <label ref={ref} className={p.search}>
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
  // on screen, the rows are approved one by one, as the seller would do it
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timers = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        timers = data.rows.map((_, k) =>
          setTimeout(
            () =>
              setRows((all) =>
                all.map((x, n) => (n === k ? { ...x, sent: true } : x)),
              ),
            900 + k * 900,
          ),
        );
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [data.rows]);
  const sent = rows.filter((r) => r.sent).length;
  return (
    <Card title={data.title} sub={data.sub} note={data.note} kind="price">
      <div ref={box} className={p.ptable}>
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

/* ── beforeafter: the old site and the new one, a handle in between ──── */
/* data: { title, note, before, after, beforeLabel, afterLabel } */
function BeforeAfter({ data }) {
  const box = useRef(null);
  const [at, setAt] = useState(50);
  const move = (x) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setAt(Math.max(4, Math.min(96, ((x - r.left) / r.width) * 100)));
  };
  return (
    <Card title={data.title} note={data.note} kind="ba">
      <div
        ref={box}
        className={p.ba}
        style={{ "--at": `${at}%` }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons) move(e.clientX);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${data.after}?w=1600&fm=webp&q=82`}
          alt={data.afterLabel}
          draggable="false"
        />
        <div className={p.baBefore}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${data.before}?w=1600&fm=webp&q=82`}
            alt={data.beforeLabel}
            draggable="false"
          />
        </div>
        <span className={p.baTag} data-side="l">
          {data.beforeLabel}
        </span>
        <span className={p.baTag} data-side="r">
          {data.afterLabel}
        </span>
        <input
          type="range"
          min="4"
          max="96"
          value={Math.round(at)}
          onChange={(e) => setAt(Number(e.target.value))}
          className={p.baRange}
          aria-label="Pomerite granicu između starog i novog sajta"
        />
        <span className={p.baHandle} aria-hidden="true">
          <i />
        </span>
      </div>
    </Card>
  );
}

/* ── reels: short videos in phone frames, playing while on screen ────── */
/* data: { title, note, items: [{ src, poster }] } */
function Reels({ data }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.2);
  return (
    <Card title={data.title} note={data.note} kind="reels">
      <div
        ref={ref}
        className={p.reels}
        data-stage={stage}
        style={{ "--n": data.items.length }}
      >
        {data.items.map((v, i) => (
          <span key={v.src} className={p.reel} style={{ "--i": i }}>
            <video
              src={v.src}
              poster={v.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
          </span>
        ))}
      </div>
    </Card>
  );
}

/* ── climb: one search over time, the client's place in it ────────────── */
/* data: { title, note, query, site, points: [{ when, pos, text }] } (pos null = not on page 1) */
function Climb({ data }) {
  const { ref, at, pick: setAt } = useAuto(data.points.length, 1800);
  const pt = data.points[at];
  const rows = 8;
  return (
    <Card title={data.title} note={data.note} kind="climb">
      <div ref={ref} className={p.climb}>
        <div className={p.when} role="tablist" aria-label="Vreme">
          {data.points.map((x, i) => (
            <button
              key={x.when}
              type="button"
              role="tab"
              aria-selected={i === at}
              onClick={() => setAt(i)}
            >
              <i />
              <b>{x.when}</b>
            </button>
          ))}
          <span
            className={p.whenLine}
            style={{ "--k": at / (data.points.length - 1) }}
            aria-hidden="true"
          />
        </div>
        <div className={p.serp}>
          <div className={p.bar}>
            <span className={p.g} aria-hidden="true">
              G
            </span>
            <span>{data.query}</span>
          </div>
          <ol className={p.results}>
            {Array.from({ length: rows }, (_, k) => k + 1).map((n) => (
              <motion.li
                key={n}
                layout
                data-me={pt.pos === n ? "" : undefined}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <i>{n}</i>
                {pt.pos === n
                  ? <span className={p.mine}>
                      <b>{data.site}</b>
                      <em>{pt.text}</em>
                    </span>
                  : <span className={p.other} aria-hidden="true">
                      <s style={{ width: `${46 + ((n * 37) % 40)}%` }} />
                      <s style={{ width: `${30 + ((n * 23) % 45)}%` }} />
                    </span>}
              </motion.li>
            ))}
          </ol>
          {pt.pos == null
            ? <p className={p.missing}>
                {data.site}: {pt.text}
              </p>
            : null}
        </div>
      </div>
    </Card>
  );
}

/* ── templates: the post types of a feed, one at a time ───────────────── */
/* data: { title, note, items: [{ name, text, src }] } */
function Templates({ data }) {
  const { ref, at, pick: setAt } = useAuto(data.items.length, 2800);
  const it = data.items[at];
  return (
    <Card title={data.title} note={data.note} kind="templates">
      <div ref={ref} className={p.tpl}>
        <div className={p.tplList} role="tablist">
          {data.items.map((x, i) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={i === at}
              onClick={() => setAt(i)}
            >
              <b>{x.name}</b>
              <span>{x.text}</span>
            </button>
          ))}
        </div>
        <div className={p.tplShow}>
          <AnimatePresence mode="wait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              key={it.src}
              src={`${it.src}?w=800&fm=webp&q=82`}
              alt={it.name}
              initial={{ opacity: 0, y: 12, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

/* ── rewrite: a stock sentence crossed out and written again, plainly ─── */
/* data: { title, note, pairs: [[from, to]] } */
function Rewrite({ data }) {
  const { ref, at, pick } = useAuto(data.pairs.length, 4200);
  const setAt = pick;
  const [from, to] = data.pairs[at];
  return (
    <Card title={data.title} note={data.note} kind="rewrite">
      <div ref={ref} className={p.rw}>
        <AnimatePresence mode="wait">
          <motion.div
            key={at}
            className={p.rwPair}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className={p.rwFrom}>
              <span>{from}</span>
              <motion.i
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
              />
            </p>
            <motion.p
              className={p.rwTo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5, ease: EASE }}
            >
              {to}
            </motion.p>
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          className={p.rwNext}
          onClick={() => setAt((at + 1) % data.pairs.length)}
        >
          Sledeća rečenica{" "}
          <span>
            {at + 1} / {data.pairs.length}
          </span>
        </button>
      </div>
    </Card>
  );
}

/* ── redirects: old addresses and where they go now ───────────────────── */
/* data: { title, note, rows: [{ from, to, kind }] } kind: "isto" | "301" */
function Redirects({ data }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.3);
  return (
    <Card title={data.title} note={data.note} kind="redirects">
      <ul ref={ref} className={p.rd} data-stage={stage}>
        {data.rows.map((r, i) => (
          <li key={r.from} style={{ "--i": i }}>
            <code>{r.from}</code>
            <span className={p.rdArrow} aria-hidden="true" />
            <code data-new="">{r.to}</code>
            <em data-kind={r.kind}>
              {r.kind === "isto" ? "ista adresa" : "preusmereno"}
            </em>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── roles: the same patient card as reception and as the doctor see it ─ */
/* data: { title, note, roles: [name], fields: [{ k, v, hide: [role] }] } */
function Roles({ data }) {
  const [role, setRole] = useState(data.roles[0]);
  return (
    <Card title={data.title} note={data.note} kind="roles">
      <div className={p.chips} role="tablist">
        {data.roles.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={r === role}
            onClick={() => setRole(r)}
          >
            {r}
          </button>
        ))}
      </div>
      <dl className={p.roleCard}>
        {data.fields.map((f) => {
          const hidden = f.hide?.includes(role);
          return (
            <div key={f.k} data-hidden={hidden ? "" : undefined}>
              <dt>{f.k}</dt>
              <dd>
                <motion.span
                  key={`${role}-${f.k}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {hidden ? "Nije dostupno za ovu ulogu" : f.v}
                </motion.span>
              </dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}

/* ── inbox: everything that came in, filtered by where the buyer came from */
/* data: { title, note, rows: [{ what, kind, source, place }] } */
function Inbox({ data }) {
  const sources = ["Sve", ...new Set(data.rows.map((r) => r.source))];
  const [f, setF] = useState("Sve");
  const rows = data.rows.filter((r) => f === "Sve" || r.source === f);
  return (
    <Card title={data.title} note={data.note} kind="inbox">
      <div className={p.chips}>
        {sources.map((x) => (
          <button
            key={x}
            type="button"
            aria-pressed={x === f}
            onClick={() => setF(x)}
          >
            {x}
          </button>
        ))}
      </div>
      <ul className={p.inbox}>
        <AnimatePresence initial={false}>
          {rows.map((r) => (
            <motion.li
              key={r.what}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <b>{r.what}</b>
              <em data-kind={r.kind}>{r.kind}</em>
              <span>{r.source}</span>
              <span>{r.place}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  );
}

/* ── checkout: who buys and how it reaches them ───────────────────────── */
/* data: { title, note, buyers: { name: [field] }, ways: [{ name, text }] } */
function Checkout({ data }) {
  const names = Object.keys(data.buyers);
  const [buyer, setBuyer] = useState(names[0]);
  const [way, setWay] = useState(0);
  return (
    <Card title={data.title} note={data.note} kind="checkout">
      <div className={p.co}>
        <div>
          <span className={p.coLabel}>Kupuje</span>
          <div className={p.chips}>
            {names.map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={n === buyer}
                onClick={() => setBuyer(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className={p.coFields}>
            <AnimatePresence initial={false}>
              {data.buyers[buyer].map((fl) => (
                <motion.span
                  key={`${buyer}-${fl}`}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {fl}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div>
          <span className={p.coLabel}>Preuzimanje</span>
          <div className={p.coWays}>
            {data.ways.map((w, i) => (
              <button
                key={w.name}
                type="button"
                aria-pressed={i === way}
                onClick={() => setWay(i)}
              >
                <b>{w.name}</b>
                <span>{w.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ── funnel: the measured steps from looking to buying ────────────────── */
/* data: { title, note, steps: [{ name, value }] } */
function Funnel({ data }) {
  const ref = useRef(null);
  const stage = useEnter(ref, 0.3);
  const max = Math.max(...data.steps.map((x) => x.value));
  return (
    <Card title={data.title} note={data.note} kind="funnel">
      <div ref={ref} className={p.funnel} data-stage={stage}>
        {data.steps.map((x, i) => (
          <div
            key={x.name}
            style={{
              "--w": `${Math.max(6, Math.sqrt(x.value / max) * 100)}%`,
              "--i": i,
            }}
          >
            <span className={p.fBar}>
              <b>{fmt(x.value)}</b>
            </span>
            <span className={p.fName}>{x.name}</span>
          </div>
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
  beforeafter: BeforeAfter,
  reels: Reels,
  climb: Climb,
  templates: Templates,
  rewrite: Rewrite,
  redirects: Redirects,
  roles: Roles,
  inbox: Inbox,
  checkout: Checkout,
  funnel: Funnel,
};

export default function Piece({ piece }) {
  const C = PIECES[piece?.kind];
  return C ? <C data={piece} /> : null;
}
