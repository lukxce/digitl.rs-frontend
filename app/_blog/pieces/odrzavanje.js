"use client";

/* Bespoke pieces for "Koliko košta održavanje sajta" (digitl.rs journal).
   Every fact here is in the post: RNIDS rules on an expired .rs domain, the
   four checks when a site is down, and the public price ranges read on
   12.11.2026. Names like imefirme.rs are examples and marked "Primer". */

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, Rotate, X } from "../../_home/icons";
import s from "./odrzavanje.module.css";

const EASE = [0.16, 1, 0.3, 1];

const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/* ── 1. An expired .rs domain, along a line ─────────────────────────────
   0 to 20: active. 20 to 80: the 30 days in which the registrant can
   still renew. 80 to 100: free for anyone to register. */

const A_END = 20;
const B_END = 80;

function phaseOf(p) {
  if (p < A_END) return 0;
  if (p < B_END) return 1;
  return 2;
}

function Expiry() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const still = useReducedMotion();
  const [p, setP] = useState(0);
  const run = useRef(null);

  const play = () => {
    run.current?.stop();
    if (still) {
      setP(100);
      return;
    }
    setP(0);
    run.current = animate(0, 100, {
      duration: 6,
      ease: "linear",
      delay: 0.3,
      onUpdate: setP,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: play once in view
  useEffect(() => {
    if (seen) play();
    return () => run.current?.stop();
  }, [seen]);

  const phase = phaseOf(p);
  const day = Math.min(
    30,
    Math.max(0, Math.round(((p - A_END) / (B_END - A_END)) * 30)),
  );
  const left = 30 - day;

  const head = [
    { k: "Domen je aktivan", t: "Sajt i pošta na domenu rade." },
    {
      k: left === 1 ? "Još 1 dan za obnovu" : `Još ${left} dana za obnovu`,
      t: "Sajt je nestao sa interneta, a pošta na domenu ne radi. Firma još može da obnovi domen.",
    },
    {
      k: "Ime je slobodno",
      t: "Sada ga može registrovati bilo ko, i tada vam nijedan ugovor ne pomaže.",
    },
  ][phase];

  const lights = [
    { label: "Sajt", v: phase === 0 ? "radi" : "ne radi", ok: phase === 0 },
    {
      label: "Pošta na domenu",
      v: phase === 0 ? "radi" : "ne radi",
      ok: phase === 0,
    },
    {
      label: "Ime imefirme.rs",
      v: phase === 2 ? "bilo čije" : "vaše",
      ok: phase !== 2,
      warn: phase === 1,
    },
  ];

  return (
    <motion.figure
      ref={ref}
      className={s.exp}
      data-phase={phase}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={s.expTop}>
        <span className={s.cap}>Kad .rs domen istekne</span>
        <span className={s.tag}>Primer</span>
      </div>

      <div className={s.expHead} aria-live="polite">
        <b>{head.k}</b>
        <span>{head.t}</span>
      </div>

      <div className={s.line}>
        <div className={s.seg} data-seg="a" />
        <div className={s.seg} data-seg="b">
          {Array.from({ length: 30 }, (_, i) => (
            <i
              // biome-ignore lint/suspicious/noArrayIndexKey: day ticks
              key={i}
              className={s.tick}
              data-gone={phase > 0 && i < day ? "" : undefined}
            />
          ))}
        </div>
        <div className={s.seg} data-seg="c" />
        <span className={s.dot} style={{ left: `${p}%` }} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={p}
          className={s.scrub}
          aria-label="Pomerite vreme, dan po dan"
          aria-valuetext={head.k}
          onChange={(e) => {
            run.current?.stop();
            setP(Number(e.target.value));
          }}
        />
      </div>
      <div className={s.legend}>
        <span data-on={phase === 0 ? "" : undefined}>Aktivan</span>
        <span data-on={phase === 1 ? "" : undefined}>
          Dan isteka, pa <b>30 dana</b> za obnovu
        </span>
        <span data-on={phase === 2 ? "" : undefined}>
          Slobodna registracija
        </span>
      </div>

      <div className={s.lights}>
        {lights.map((l) => (
          <div
            key={l.label}
            className={s.light}
            data-state={l.ok ? (l.warn ? "warn" : "ok") : "bad"}
          >
            <i aria-hidden="true" />
            <span>{l.label}</span>
            <b>{l.v}</b>
          </div>
        ))}
      </div>

      <div className={s.expFoot}>
        <figcaption>
          Povucite tačku po liniji. Izvor: RNIDS, statusi domena
        </figcaption>
        <button type="button" className={s.ghost} onClick={play}>
          <Rotate size={14} /> Pusti ponovo
        </button>
      </div>
    </motion.figure>
  );
}

/* ── 2. "Sajt ne radi": the four checks, in order ───────────────────────
   Each run shows one example fault; the checks before it pass, the ones
   after it wait. */

const CHECKS = [
  {
    name: "Domen",
    where: "Datum isteka u RNIDS WHOIS pretrazi",
    ok: "Domen je aktivan.",
    bad: "Domen je istekao, pa je sajt nestao sa interneta. Obnova je moguća još 30 dana.",
  },
  {
    name: "Hosting nalog",
    where: "Da li je račun za hosting plaćen",
    ok: "Račun je plaćen.",
    bad: "Hosting nije plaćen. Opomena je možda otišla na adresu programera koji je pravio sajt.",
  },
  {
    name: "SSL sertifikat",
    where: "Da li pregledač javlja da veza nije bezbedna",
    ok: "Veza je bezbedna.",
    bad: "Sertifikat je verovatno istekao, što obično znači da je automatska obnova stala.",
  },
  {
    name: "Poslednje ažuriranje",
    where: "Šta je poslednje ažurirano na sajtu",
    ok: "Posle ažuriranja sajt radi.",
    bad: "Bela stranica posle ažuriranja dodatka. Vratite poslednju ispravnu kopiju.",
  },
];

/* the example fault for each run, so four runs show all four */
const ORDER = [2, 0, 3, 1];

function Diagnose() {
  const still = useReducedMotion();
  const [run, setRun] = useState(-1); // which example, -1 = not started
  const [at, setAt] = useState(-1); // the check in progress
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const fault = run >= 0 ? ORDER[run % ORDER.length] : -1;

  const start = () => {
    timers.current.forEach(clearTimeout);
    const next = run + 1;
    const f = ORDER[next % ORDER.length];
    setRun(next);
    if (still) {
      setAt(f + 1);
      setBusy(false);
      return;
    }
    setBusy(true);
    setAt(0);
    for (let i = 1; i <= f + 1; i++) {
      timers.current.push(
        setTimeout(() => {
          setAt(i);
          if (i === f + 1) setBusy(false);
        }, i * 850),
      );
    }
  };

  const stateOf = (i) => {
    if (run < 0 || i > at) return "wait";
    if (i === at && busy) return "run";
    if (i < fault) return "ok";
    if (i === fault) return "bad";
    return "skip";
  };

  return (
    <motion.div
      className={s.diag}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={s.bar}>
        <span className={s.lightsMini} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.url}>imefirme.rs</span>
        <span className={s.tag}>Primer</span>
      </div>

      <div className={s.diagHead}>
        <div>
          <b>Sajt ne radi.</b>
          <span>Četiri provere, ovim redom.</span>
        </div>
        <button
          type="button"
          className={s.go}
          onClick={start}
          disabled={busy}
          aria-busy={busy}
        >
          {run < 0
            ? "Pokreni proveru"
            : busy
              ? "Proveravam"
              : "Novi primer kvara"}
        </button>
      </div>

      <div className={s.checks}>
        {CHECKS.map((c, i) => {
          const st = stateOf(i);
          return (
            <div key={c.name} className={s.row} data-state={st}>
              <span className={s.lamp} aria-hidden="true">
                {st === "ok"
                  ? <Check size={13} strokeWidth={3.2} />
                  : st === "bad"
                    ? <X size={12} strokeWidth={3.2} />
                    : <b>{i + 1}</b>}
              </span>
              <span className={s.rowBody}>
                <b>{c.name}</b>
                <span>{c.where}</span>
                {st === "ok" || st === "bad"
                  ? <motion.em
                      key={`${run}-${st}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      {st === "ok" ? c.ok : c.bad}
                    </motion.em>
                  : null}
              </span>
              <span className={s.verdict}>
                {
                  {
                    wait: "",
                    run: "proverava",
                    ok: "u redu",
                    bad: "kvar",
                    skip: "",
                  }[st]
                }
              </span>
            </div>
          );
        })}
      </div>
      {fault >= 0 && !busy
        ? <motion.div
            key={run}
            className={s.diagFoot}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Primer kvara {(run % ORDER.length) + 1} od 4. Pokrenite ponovo za
            sledeći.
          </motion.div>
        : null}
    </motion.div>
  );
}

/* ── 3. What a year costs: switch items on and off ──────────────────────
   Ranges from the public price lists in the post (12.11.2026). Monthly
   maintenance is BeoHosting's 1.500 to 5.000 a month, times 12. */

const ITEMS = [
  {
    id: "host",
    name: "Hosting, osnovni deljeni",
    note: "2.400 do 5.990 din. godišnje",
    lo: 2400,
    hi: 5990,
  },
  {
    id: "dom",
    name: ".rs domen",
    note: "2.150 do 2.750 din. godišnje",
    lo: 2150,
    hi: 2750,
  },
  {
    id: "ssl",
    name: "SSL sertifikat, Let's Encrypt",
    note: "besplatan",
    lo: 0,
    hi: 0,
  },
];
const CARE = {
  id: "care",
  lo: 1500 * 12,
  hi: 5000 * 12,
};
const SCALE = ITEMS.reduce((a, x) => a + x.hi, 0) + CARE.hi;

function Year() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const still = useReducedMotion();
  const [on, setOn] = useState({ host: false, dom: false, ssl: false });
  const [care, setCare] = useState(false);

  // switch the fixed costs on one by one, the first time it is seen
  useEffect(() => {
    if (!seen) return;
    if (still) {
      setOn({ host: true, dom: true, ssl: true });
      return;
    }
    const ids = ["host", "dom", "ssl"];
    const t = ids.map((id, i) =>
      setTimeout(() => setOn((o) => ({ ...o, [id]: true })), 350 + i * 450),
    );
    return () => t.forEach(clearTimeout);
  }, [seen, still]);

  const parts = [...ITEMS.filter((x) => on[x.id]), ...(care ? [CARE] : [])];
  const lo = parts.reduce((a, x) => a + x.lo, 0);
  const hi = parts.reduce((a, x) => a + x.hi, 0);

  const bar = (key) => (
    <span className={s.stack}>
      {[...ITEMS, CARE].map((x) => {
        const live = x.id === "care" ? care : on[x.id];
        const v = live ? x[key] : 0;
        return (
          <motion.i
            key={x.id}
            data-id={x.id}
            initial={false}
            animate={{ width: `${(v / SCALE) * 100}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        );
      })}
    </span>
  );

  return (
    <motion.div
      ref={ref}
      className={s.year}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={s.yearTop}>
        <span className={s.cap}>Koliko sajt košta godišnje</span>
        <span className={s.tag}>Pojednostavljeno</span>
      </div>

      <div className={s.picks}>
        {ITEMS.map((x) => (
          <button
            key={x.id}
            type="button"
            className={s.pick}
            data-id={x.id}
            aria-pressed={on[x.id]}
            onClick={() => setOn((o) => ({ ...o, [x.id]: !o[x.id] }))}
          >
            <i className={s.sw} aria-hidden="true" />
            <span>
              <b>{x.name}</b>
              <small>{x.note}</small>
            </span>
          </button>
        ))}
      </div>

      <div className={s.care}>
        <span className={s.careLabel}>Održavanje</span>
        <div className={s.seg2} role="tablist" aria-label="Održavanje">
          <button
            type="button"
            role="tab"
            aria-selected={!care}
            onClick={() => setCare(false)}
          >
            Po izmeni
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={care}
            onClick={() => setCare(true)}
          >
            Mesečni paket
          </button>
          <motion.i
            className={s.knob}
            animate={{ x: care ? "100%" : "0%" }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          />
        </div>
        <motion.small
          key={care ? "m" : "p"}
          className={s.careNote}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {care
            ? "BeoHosting, WordPress paketi: 1.500 do 5.000 din. mesečno, puta 12."
            : "Nema fiksnog iznosa. Izvođača plaćate kad nešto zaista treba uraditi."}
        </motion.small>
      </div>

      <div className={s.total}>
        <span className={s.cap}>Ukupno godišnje</span>
        <b className={s.sum}>
          <motion.span
            key={`${lo}-${hi}`}
            initial={{ opacity: 0.3, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {lo === hi ? fmt(lo) : `${fmt(lo)} do ${fmt(hi)}`}
          </motion.span>{" "}
          <small>din.</small>
        </b>
        <div className={s.bars}>
          <span className={s.barRow}>
            <span>Najniže</span>
            {bar("lo")}
          </span>
          <span className={s.barRow}>
            <span>Najviše</span>
            {bar("hi")}
          </span>
        </div>
        <div className={s.key} aria-hidden="true">
          <span data-id="host">Hosting</span>
          <span data-id="dom">Domen</span>
          <span data-id="care">Održavanje</span>
        </div>
      </div>

      <div className={s.small}>
        Cene sa javnih cenovnika domaćih ponuđača, 12.11.2026. Jedni ih
        prikazuju sa PDV-om, drugi bez njega.
      </div>
    </motion.div>
  );
}

export const PIECES = {
  "odrzavanje-istek": Expiry,
  "odrzavanje-pad": Diagnose,
  "odrzavanje-godina": Year,
};
