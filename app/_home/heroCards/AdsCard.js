"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import s from "./adsCard.module.css";

/* The hero's ads card: a small campaign that learns. Four ad variants
   (search and social) share a daily budget; days tick by, clicks and
   enquiries come in, the costliest ad is paused, its budget moves to the
   best one and the cost per enquiry falls. Then the next example business.
   The reader can move the daily budget, pick a business, or press
   "Optimizuj" themselves. All names, ads and numbers are illustrative:
   one simple, deterministic model, no real campaign behind it. */

const DAYS = 14;
const OPT_AT = [5, 9];
const OPT_GAP = 3;
const DAY_MS = 640;
const MIN = 10;
const MAX = 50;

/* budget share per ad role, after 0, 1 and 2 optimizations */
const SHARES = [
  { best: 0.25, second: 0.25, third: 0.25, weak: 0.25 },
  { best: 0.5, second: 0.25, third: 0.25, weak: 0 },
  { best: 0.65, second: 0.25, third: 0.1, weak: 0 },
];
const CPA = { best: 6.3, second: 8.5, third: 11.6, weak: 16.2 };
const CPC = { search: 0.64, social: 0.31 };

const BIZ = [
  {
    name: "Klima servis Beograd",
    budget: 25,
    cost: 1,
    order: ["c", "d", "a", "b"],
    ads: {
      a: {
        ch: "search",
        role: "best",
        head: "Klima servis isti dan",
        text: "Servis i čišćenje u celom gradu, sa cenom unapred.",
      },
      b: {
        ch: "social",
        role: "second",
        head: "Očistite klimu pre leta",
        text: "Kratak video: ceo servis za 40 minuta, bez nereda.",
      },
      c: {
        ch: "search",
        role: "third",
        head: "Servis klima, sve marke",
        text: "Montaža, servis i punjenje. Pozovite za termin.",
      },
      d: {
        ch: "social",
        role: "weak",
        head: "Sve za vašu klimu",
        text: "Pogledajte ponudu i radove iz našeg kraja.",
      },
    },
  },
  {
    name: "Stomatolog Niš",
    budget: 30,
    cost: 1.1,
    order: ["a", "d", "c", "b"],
    ads: {
      a: {
        ch: "search",
        role: "second",
        head: "Pregled zuba ove nedelje",
        text: "Pregled i plan lečenja, sa cenom unapred.",
      },
      b: {
        ch: "social",
        role: "best",
        head: "Beli zubi u jednoj poseti",
        text: "Kratak video iz ordinacije, bez filtera.",
      },
      c: {
        ch: "search",
        role: "third",
        head: "Ordinacija u centru Niša",
        text: "Radimo i subotom. Zakažite telefonom.",
      },
      d: {
        ch: "social",
        role: "weak",
        head: "Lep osmeh za svakoga",
        text: "Pratite nas za savete o nezi zuba.",
      },
    },
  },
  {
    name: "Advokat Novi Sad",
    budget: 35,
    cost: 1.2,
    order: ["d", "c", "a", "b"],
    ads: {
      a: {
        ch: "search",
        role: "best",
        head: "Advokat za radne sporove",
        text: "Jasna cena prvog razgovora. Zakažite online.",
      },
      b: {
        ch: "social",
        role: "second",
        head: "Otkaz? Prvi koraci",
        text: "Kratak vodič iz prakse, pa razgovor sa advokatom.",
      },
      c: {
        ch: "search",
        role: "third",
        head: "Kancelarija u centru grada",
        text: "Porodično, radno i privredno pravo.",
      },
      d: {
        ch: "social",
        role: "weak",
        head: "Pravni saveti za svakoga",
        text: "Pratite nas za savete iz prakse.",
      },
    },
  },
  {
    name: "Električar Niš",
    budget: 20,
    cost: 0.9,
    order: ["a", "b", "c", "d"],
    ads: {
      a: {
        ch: "search",
        role: "second",
        head: "Električar Niš, isti dan",
        text: "Utičnice, rasveta i instalacije u stanovima.",
      },
      b: {
        ch: "social",
        role: "weak",
        head: "Sve za vašu struju",
        text: "Pogledajte ponudu i naše radove.",
      },
      c: {
        ch: "search",
        role: "best",
        head: "Hitan dolazak, cena unapred",
        text: "Dolazak u toku dana. Pozovite ili zakažite online.",
      },
      d: {
        ch: "social",
        role: "third",
        head: "Nova tabla za jedan dan",
        text: "Pre i posle: stara instalacija, nova tabla.",
      },
    },
  },
];

const IDS = ["a", "b", "c", "d"];
const SKEL = [1, 2, 3, 4];
const STOP = Symbol("stop");
const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 };
const EASE = [0.16, 1, 0.3, 1];

const learn = (d) => 1 - 0.18 * Math.min(1, Math.max(0, d - 1) / (DAYS - 1));
const roleOf = (biz, role) => IDS.find((id) => biz.ads[id].role === role);

/* Clicks and enquiries per ad up to `day`, as if the budget had always been
   `budget` (so moving the slider rescales everything at once). An
   optimization in `opts` counts from the day it lists. */
function model(biz, day, opts, budget) {
  const f = 1 + 0.006 * (budget - 25);
  const acc = {};
  for (const id of IDS) acc[id] = { clicks: 0, enq: 0 };
  for (let d = 1; d <= day; d += 1) {
    let k = 0;
    for (const o of opts) if (o <= d) k += 1;
    const l = learn(d);
    for (const id of IDS) {
      const ad = biz.ads[id];
      const spend = budget * SHARES[k][ad.role];
      acc[id].clicks += spend / (CPC[ad.ch] * biz.cost * f);
      acc[id].enq += spend / (CPA[ad.role] * biz.cost * l * f);
    }
  }
  const k = Math.min(opts.length, SHARES.length - 1);
  let rate = 0;
  const rows = {};
  let total = 0;
  for (const id of IDS) {
    const role = biz.ads[id].role;
    rate += SHARES[k][role] / CPA[role];
    const enq = Math.floor(acc[id].enq + 1e-9);
    total += enq;
    rows[id] = {
      clicks: Math.floor(acc[id].clicks + 1e-9),
      enq,
      share: SHARES[k][role],
    };
  }
  const cpa = day > 0 ? (biz.cost * f * learn(day)) / rate : null;
  return { rows, cpa, total };
}

function orderOf(biz, k) {
  if (k === 0) return biz.order;
  const best = roleOf(biz, "best");
  const weak = roleOf(biz, "weak");
  return [best, ...biz.order.filter((id) => id !== best && id !== weak), weak];
}

const money = (v) => `${v.toFixed(2).replace(".", ",")} €`;
const one = (n) => n % 10 === 1 && n % 100 !== 11;
const upit = (n) => (one(n) ? "upit" : "upita");
const dan = (n) => (one(n) ? "dan" : "dana");
function klik(n) {
  if (one(n)) return "klik";
  const t = n % 10;
  const h = n % 100;
  if (t >= 2 && t <= 4 && (h < 12 || h > 14)) return "klika";
  return "klikova";
}

function Megaphone() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 10.2v3.6c0 .7.6 1.2 1.2 1.2H7l9.5 4.6c.6.3 1.3-.1 1.3-.8V5.2c0-.7-.7-1.1-1.3-.8L7 9H5.2C4.6 9 4 9.5 4 10.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="m7.6 15.4 1.3 4.1c.2.5.6.8 1.1.8h.9c.7 0 1.2-.7 1-1.4l-.9-2.6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.6 10a3 3 0 0 1 0 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m6.5 9.5 5.5 5.5 5.5-5.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pointer() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 4.5v9.2l-1.6-1.5a1.8 1.8 0 0 0-2.6 2.5l4.6 5a4 4 0 0 0 3 1.3h2.8a4.3 4.3 0 0 0 4.3-4.3v-4.4a1.6 1.6 0 0 0-3.2 0V11a1.6 1.6 0 0 0-3.2-.6V10a1.6 1.6 0 0 0-3.2 0V4.5a1.5 1.5 0 0 0-3 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* neutral channel marks: a search lens, and a post with a heart */
function SearchMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="m15 15 4.5 4.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SocialMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 19.5s-7.5-4.4-7.5-9.6A4.1 4.1 0 0 1 12 7.6a4.1 4.1 0 0 1 7.5 2.3c0 5.2-7.5 9.6-7.5 9.6Z"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const INIT = { bi: 0, day: 0, opts: [], run: 0 };

export default function AdsCard({ footer = null }) {
  const reduce = useReducedMotion();
  // The server can't know the reader's motion setting, so the first render
  // always assumes motion; markup that depends on it switches after mount.
  const [still, setStill] = useState(false);
  useEffect(() => setStill(Boolean(reduce)), [reduce]);
  const uid = useId();
  const [sim, setSim] = useState(INIT);
  const [budget, setBudget] = useState(BIZ[0].budget);
  const [phase, setPhase] = useState("ready");
  const [sorted, setSorted] = useState(0);
  const [pressed, setPressed] = useState(false);
  const [user, setUser] = useState(false);
  const [note, setNote] = useState(null);
  const [dragging, setDragging] = useState(false);

  const root = useRef(null);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const simRef = useRef(INIT);
  const budgetRef = useRef(BIZ[0].budget);
  const userRef = useRef(false);
  const phaseRef = useRef("ready");
  const nextBi = useRef(1);
  const toastId = useRef(0);
  const drag = useRef(null);
  const timers = useRef(new Set());

  const commit = (next) => {
    simRef.current = next;
    setSim(next);
  };
  const go = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };
  const setMoney = (v) => {
    budgetRef.current = v;
    setBudget(v);
  };
  const press = () => {
    setPressed(true);
    later(() => setPressed(false), 240);
  };
  const toast = (ad, gain) => {
    toastId.current += 1;
    const id = toastId.current;
    setNote({ id, ad, gain });
    later(() => setNote((cur) => (cur && cur.id === id ? null : cur)), 1150);
  };

  /* A pause that also holds while the card is off screen, and gives up as
     soon as a newer run has started. */
  const napper = (t) => (ms) =>
    new Promise((resolve, reject) => {
      const check = () => {
        if (t !== token.current) return reject(STOP);
        if (!visible.current) {
          wakers.current.push(check);
          return;
        }
        resolve();
      };
      setTimeout(check, ms);
    });

  // one day passes: maybe the next optimization, maybe a "Novi upit"
  const tick = (d) => {
    const cur = simRef.current;
    const biz = BIZ[cur.bi];
    const opts = cur.opts.slice();
    const j = opts.length;
    let opted = false;
    if (
      j < OPT_AT.length &&
      d >= OPT_AT[j] &&
      (j === 0 || d >= opts[j - 1] + OPT_GAP)
    ) {
      opts.push(d);
      opted = true;
    }
    const was = model(biz, cur.day, cur.opts, budgetRef.current);
    const now = model(biz, d, opts, budgetRef.current);
    commit({ ...cur, day: d, opts });
    if (opted) press();
    let target = null;
    let most = 0;
    for (const id of IDS) {
      if (opts.length > 0 && biz.ads[id].role !== "best") continue;
      const gain = now.rows[id].enq - was.rows[id].enq;
      if (gain > most) {
        most = gain;
        target = id;
      }
    }
    if (target) toast(target, most);
  };

  /* mode: "warm" (first view), "load" (a new business), "again" (same
     business from day one), "now" (the reader pressed Pokreni) */
  const play = async (t, bi, mode) => {
    const sleep = napper(t);
    if (mode === "load") {
      go("loading");
      await sleep(620);
    }
    if (mode !== "now") {
      const run = simRef.current.run + (mode === "warm" ? 0 : 1);
      commit({ bi, day: 0, opts: [], run });
      if (!userRef.current) setMoney(BIZ[bi].budget);
      go("ready");
    }
    if (mode === "warm") await sleep(1100);
    if (mode === "load") await sleep(900);
    if (mode === "again") await sleep(420);
    press();
    go("run");
    for (let d = 1; d <= DAYS; d += 1) {
      await sleep(d === 1 ? 300 : DAY_MS);
      tick(d);
    }
    await sleep(420);
    go("end");
  };

  const finish = (bi) => {
    commit({
      bi,
      day: DAYS,
      opts: OPT_AT.slice(),
      run: simRef.current.run + 1,
    });
    setSorted(OPT_AT.length);
    go("end");
  };

  // on screen or not: the story holds while hidden
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (!e.isIntersecting) return;
        const queued = wakers.current;
        wakers.current = [];
        for (const f of queued) f();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the example loop, until the reader takes over
  // biome-ignore lint/correctness/useExhaustiveDependencies: helpers only touch refs and setters
  useEffect(() => {
    if (reduce) {
      token.current += 1;
      finish(simRef.current.bi);
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      if (!userRef.current) await play(t, simRef.current.bi, "warm");
      for (;;) {
        await sleep(2600);
        if (userRef.current) return;
        const bi = nextBi.current % BIZ.length;
        nextBi.current += 1;
        await play(t, bi, "load");
      }
    })().catch(() => {});
    return () => {
      if (token.current === t) token.current += 1;
    };
  }, [reduce]);

  // the reorder follows a pause a beat later, so the eye sees both
  useEffect(() => {
    const k = sim.opts.length;
    if (k === sorted) return;
    if (reduce || k < sorted) {
      setSorted(k);
      return;
    }
    const id = setTimeout(() => setSorted(k), 520);
    return () => clearTimeout(id);
  }, [sim.opts.length, sorted, reduce]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      token.current += 1;
      for (const id of pending) clearTimeout(id);
    };
  }, []);

  const takeOver = () => {
    if (userRef.current) return;
    userRef.current = true;
    setUser(true);
  };

  /* The budget slider. A horizontal drag (or a tap) sets it; a vertical
     swipe that starts on it is left to the page, so it still scrolls and
     the budget stays put. */
  const pickMoney = (v) => {
    const next = Math.min(MAX, Math.max(MIN, v));
    takeOver();
    if (next !== budgetRef.current) setMoney(next);
  };
  const moneyAt = (el, x) => {
    const r = el.getBoundingClientRect();
    const f = (x - r.left - 11) / Math.max(1, r.width - 22);
    return (
      MIN + Math.round((Math.min(1, Math.max(0, f)) * (MAX - MIN)) / 5) * 5
    );
  };
  const onDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, on: false };
    if (e.pointerType === "mouse") {
      drag.current.on = true;
      el.setPointerCapture(e.pointerId);
      setDragging(true);
      pickMoney(moneyAt(el, e.clientX));
    }
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const el = e.currentTarget;
    if (!d.on) {
      const dx = Math.abs(e.clientX - d.x);
      const dy = Math.abs(e.clientY - d.y);
      if (dx < 6 && dy < 6) return;
      if (dy > dx) {
        drag.current = null;
        return;
      }
      d.on = true;
      el.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    pickMoney(moneyAt(el, e.clientX));
  };
  const onUp = (e) => {
    const d = drag.current;
    if (d && d.id === e.pointerId && !d.on)
      pickMoney(moneyAt(e.currentTarget, e.clientX));
    drag.current = null;
    setDragging(false);
  };
  const onCancel = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKey = (e) => {
    const steps = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -10,
      PageUp: 10,
      Home: -100,
      End: 100,
    };
    if (!(e.key in steps)) return;
    e.preventDefault();
    pickMoney(budgetRef.current + steps[e.key]);
  };

  const onPick = (e) => {
    takeOver();
    const bi = Number(e.target.value);
    nextBi.current = bi + 1;
    if (reduce) {
      finish(bi);
      return;
    }
    const t = ++token.current;
    play(t, bi, "load").catch(() => {});
  };

  const act = () => {
    takeOver();
    if (reduce) return;
    const p = phaseRef.current;
    const cur = simRef.current;
    if (p === "loading") return;
    if (p === "ready" || p === "end") {
      const t = ++token.current;
      play(t, cur.bi, p === "end" ? "again" : "now").catch(() => {});
      return;
    }
    if (cur.opts.length < OPT_AT.length) {
      commit({ ...cur, opts: [...cur.opts, cur.day + 1] });
      press();
    }
  };

  const biz = BIZ[sim.bi];
  const m = useMemo(
    () => model(BIZ[sim.bi], sim.day, sim.opts, budget),
    [sim, budget],
  );
  const first = useMemo(
    () => model(BIZ[sim.bi], 1, [], budget).cpa,
    [sim.bi, budget],
  );
  const k = sim.opts.length;
  const order = orderOf(biz, Math.min(sorted, k));
  const live = phase !== "loading";
  const end = phase === "end";
  const best = roleOf(biz, "best");
  const weak = roleOf(biz, "weak");
  const p = (budget - MIN) / (MAX - MIN);

  let label = "Pokreni";
  let done = false;
  if (still || (phase === "run" && k >= OPT_AT.length)) {
    label = "Optimizovano";
    done = true;
  } else if (phase === "run") label = "Optimizuj";
  else if (end) label = "Ponovo";

  let status = "Kampanja spremna";
  if (phase === "loading") status = "Nova kampanja";
  else if (phase === "run" || end)
    status = `Aktivna · dan ${Math.max(1, sim.day)} od ${DAYS}`;

  let hint = (
    <>
      <Pointer />
      <span className={s.long}>Pomerite budžet ili izaberite delatnost</span>
      <span className={s.short}>Pomerite budžet</span>
    </>
  );
  if (user && sim.day > 0)
    hint = (
      <>
        <span className={s.long}>Ukupno</span>
        <b>
          {m.total} {upit(m.total)}
        </b>
        za {sim.day} {dan(sim.day)}
      </>
    );
  else if (user) hint = "Pritisnite Pokreni";

  return (
    <div className={s.stage} ref={root}>
      <div className={s.deck}>
        <div className={s.card}>
          <div className={s.bar}>
            <span className={s.icon}>
              <Megaphone />
            </span>
            <label className={s.field}>
              <span className={s.sub}>
                <i className={s.dot} data-state={live ? phase : "loading"} />
                <span className={s.subText}>{status}</span>
              </span>
              <span className={s.name}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={sim.bi}
                    className={s.nameText}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {biz.name}
                  </motion.span>
                </AnimatePresence>
                <Chevron />
              </span>
              <select
                className={s.pick}
                value={sim.bi}
                onChange={onPick}
                aria-label="Delatnost"
              >
                {BIZ.map((b, i) => (
                  <option key={b.name} value={i}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={s.go}
              onClick={act}
              disabled={done || phase === "loading"}
              data-press={pressed || undefined}
              data-done={done || undefined}
              aria-label={label}
            >
              {done ? <Check /> : null}
              <span className={done ? s.long : undefined}>{label}</span>
            </button>
            <span className={s.load} data-on={phase === "loading"} />
          </div>

          <div className={s.meta}>
            <span className={s.hint} data-user={user}>
              {hint}
            </span>
            <span className={s.rank} data-top={end && live}>
              <span className={s.long}>Cena po upitu</span>
              <span className={s.short}>Po upitu</span>
              <AnimatePresence initial={false}>
                {live && sim.day > 1
                  ? <motion.s
                      key="was"
                      className={s.was}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      aria-label={`bilo ${money(first)}`}
                    >
                      {first.toFixed(2).replace(".", ",")}
                    </motion.s>
                  : null}
              </AnimatePresence>
              <span className={s.rankNo}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b
                    key={live && m.cpa ? m.cpa.toFixed(2) : "x"}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {live && m.cpa ? money(m.cpa) : "…"}
                  </motion.b>
                </AnimatePresence>
              </span>
            </span>
          </div>

          <div className={s.list}>
            <ul className={s.skel} data-on={!live} aria-hidden>
              {SKEL.map((n) => (
                <li key={n} className={s.skelRow}>
                  <span className={s.skelFav} />
                  <span className={s.skelLines}>
                    <i style={{ width: `${30 + ((n * 17) % 20)}%` }} />
                    <i style={{ width: `${56 + ((n * 23) % 26)}%` }} />
                    <i style={{ width: `${68 + ((n * 13) % 22)}%` }} />
                  </span>
                  <span className={s.skelStat}>
                    <i />
                    <i />
                  </span>
                </li>
              ))}
            </ul>

            <ul className={s.rows} data-on={live}>
              {order.map((id) => {
                const ad = biz.ads[id];
                const row = m.rows[id];
                const top = id === best && sorted > 0 && k > 0;
                const off = id === weak && k > 0;
                return (
                  <motion.li
                    key={`${sim.run}-${id}`}
                    layout="position"
                    className={s.row}
                    data-best={top || undefined}
                    data-off={off || undefined}
                    initial={sim.run === 0 ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      layout: reduce ? { duration: 0 } : SPRING,
                      default: {
                        duration: 0.5,
                        ease: EASE,
                        delay: biz.order.indexOf(id) * 0.06,
                      },
                    }}
                  >
                    <span className={s.mark} data-ch={ad.ch}>
                      {ad.ch === "search" ? <SearchMark /> : <SocialMark />}
                    </span>
                    <span className={s.body}>
                      <span className={s.url}>
                        <b>{ad.ch === "search" ? "Pretraga" : "Mreže"}</b>
                        <span className={s.path}>
                          › {ad.ch === "search" ? "vasafirma.rs" : "Vaša firma"}
                        </span>
                        <AnimatePresence initial={false}>
                          {top
                            ? <motion.em
                                key="best"
                                className={s.best}
                                initial={{ scale: 0.4, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 420,
                                  damping: 18,
                                }}
                              >
                                Najbolji
                              </motion.em>
                            : null}
                          {off
                            ? <motion.em
                                key="off"
                                className={s.off}
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{ duration: 0.3, ease: EASE }}
                              >
                                <span className={s.long}>Pauzirano: skupo</span>
                                <span className={s.short}>Pauzirano</span>
                              </motion.em>
                            : null}
                        </AnimatePresence>
                      </span>
                      <span className={s.title}>{ad.head}</span>
                      <span className={s.text}>{ad.text}</span>
                    </span>
                    <span className={s.stats}>
                      <span className={s.enq}>
                        <motion.b
                          key={row.enq}
                          initial={
                            row.enq === 0 || still
                              ? false
                              : { y: 7, opacity: 0.2 }
                          }
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          {row.enq}
                        </motion.b>{" "}
                        {upit(row.enq)}
                        <AnimatePresence>
                          {note && note.ad === id
                            ? <motion.span
                                key="note"
                                className={s.toast}
                                initial={{ opacity: 0, x: 10, scale: 0.85 }}
                                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.4, ease: EASE }}
                              >
                                <i />
                                <motion.span
                                  key={note.id}
                                  className={s.toastText}
                                  initial={{ scale: 1.3 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20,
                                  }}
                                >
                                  <span className={s.long}>
                                    {note.gain > 1
                                      ? `+${note.gain} upita`
                                      : "Novi upit"}
                                  </span>
                                  <span className={s.short}>+{note.gain}</span>
                                </motion.span>
                              </motion.span>
                            : null}
                        </AnimatePresence>
                      </span>
                      <span className={s.clicks}>
                        {row.clicks} {klik(row.clicks)}
                      </span>
                      <span className={s.share}>
                        <span className={s.track}>
                          <i style={{ transform: `scaleX(${row.share})` }} />
                        </span>
                        <span className={s.pct}>
                          {Math.round(row.share * 100)}%
                        </span>
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className={s.ctrl}>
            <span className={s.ctrlLabel} id={`${uid}-budget`}>
              <span className={s.long}>Dnevni budžet</span>
              <span className={s.short}>Budžet</span>
            </span>
            <div
              className={s.range}
              role="slider"
              tabIndex={0}
              aria-labelledby={`${uid}-budget`}
              aria-valuemin={MIN}
              aria-valuemax={MAX}
              aria-valuenow={budget}
              aria-valuetext={`${budget} evra dnevno`}
              data-drag={dragging || undefined}
              style={{ "--p": p }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onCancel}
              onKeyDown={onKey}
            >
              <span className={s.rail}>
                <i />
              </span>
              <span className={s.knob} />
            </div>
            <span className={s.val}>
              <b>{budget} €</b>
              <span className={s.long}>/dan</span>
            </span>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
