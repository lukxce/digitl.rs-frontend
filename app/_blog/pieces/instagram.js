"use client";

/* Bespoke pieces for "Kako reklamirati Instagram profil, Boost ili Ads
   Manager". Every fact here is in the post; example names and amounts are
   marked "Primer".

   instagram-reach        who sees a story you don't pay for (followers) and
                          who sees an ad (the people you choose)
   instagram-boost-ads    one phone, two screens: the Boost screen bundles and
                          locks settings, Ads Manager opens them one by one
   instagram-budget-week  a week on a daily budget: a day may go to 175%,
                          the week never past seven daily budgets             */

import {
  AnimatePresence,
  animate,
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Lock,
  Rotate,
  Users,
} from "../../_home/icons";
import s from "./instagram.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* a two-way switch with a sliding knob; flips once by itself when the piece
   comes into view, unless the reader already touched it */
function useAutoFlip(ref, delay = 1600) {
  const seen = useInView(ref, { once: true, amount: 0.55 });
  const [on, setOn] = useState(0);
  const touched = useRef(false);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => {
      if (!touched.current) setOn(1);
    }, delay);
    return () => clearTimeout(t);
  }, [seen, delay]);
  const pick = (i) => {
    touched.current = true;
    setOn(i);
  };
  return { seen, on, pick };
}

function Switch({ names, on, pick, label }) {
  return (
    <div className={s.switch} role="tablist" aria-label={label}>
      {names.map((n, i) => (
        <button
          key={n}
          type="button"
          role="tab"
          aria-selected={on === i}
          onClick={() => pick(i)}
        >
          {n}
        </button>
      ))}
      <motion.i
        className={s.knob}
        aria-hidden="true"
        animate={{ x: on ? "100%" : "0%" }}
        transition={{ type: "spring", stiffness: 420, damping: 34 }}
      />
    </div>
  );
}

/* ── 1. who sees it ────────────────────────────────────────────────────── */

const FOLLOWERS = 15;
const OTHERS = 30;
/* which dots light up: a story reaches only (some of) the followers, an ad
   reaches the people chosen for it, followers or not */
const STORY_F = new Set([0, 1, 2, 4, 5, 6, 8, 9, 11, 12, 13]);
const AD_F = new Set([2, 5, 9, 13]);
const AD_O = new Set([
  1, 2, 4, 7, 8, 10, 13, 14, 16, 19, 20, 22, 25, 26, 28, 29,
]);

const REACH = [
  {
    tab: "Priča bez plaćanja",
    text: "Stories prikazuju samo naloge koje ljudi prate i oglase, pa vašu priču bez plaćanja vide uglavnom pratioci.",
  },
  {
    tab: "Plaćeni oglas",
    text: "Plaćeni oglas Meta prikazuje ljudima koje izaberete, i kad vas ne prate.",
    chip: "Publika, primer: Niš, 25 do 45 godina",
  },
];

function Dots({ n, lit, offset }) {
  return (
    <div className={s.dots}>
      {Array.from({ length: n }, (_, i) => (
        <i
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed dots
          key={i}
          data-lit={lit.has(i) ? "" : undefined}
          style={{ transitionDelay: `${(offset + i) * 14}ms` }}
        />
      ))}
    </div>
  );
}

function Reach() {
  const ref = useRef(null);
  const { seen, on, pick } = useAutoFlip(ref, 1800);
  const none = new Set();
  const litF = !seen ? none : on ? AD_F : STORY_F;
  const litO = !seen || !on ? none : AD_O;
  const m = REACH[on];
  return (
    <figure ref={ref} className={s.reach}>
      <div className={s.top}>
        <span className={s.cap}>Ko vidi šta</span>
        <span className={s.tag}>Pojednostavljeno</span>
      </div>
      <Switch
        names={REACH.map((r) => r.tab)}
        on={on}
        pick={pick}
        label="Priča ili oglas"
      />
      <div className={s.zones}>
        <div className={s.zone} data-own="">
          <span className={s.zoneName}>
            <Users size={14} /> Vaši pratioci
          </span>
          <Dots n={FOLLOWERS} lit={litF} offset={0} />
        </div>
        <div className={s.zone}>
          <span className={s.zoneName}>Ljudi koji vas ne prate</span>
          <Dots n={OTHERS} lit={litO} offset={FOLLOWERS} />
        </div>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.figcaption
          key={on}
          className={s.reachCap}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <span>{m.text}</span>
          {m.chip ? <em className={s.chip}>{m.chip}</em> : null}
        </motion.figcaption>
      </AnimatePresence>
    </figure>
  );
}

/* ── 2. Boost vs Ads Manager, on one phone ─────────────────────────────── */

const ROWS = [
  {
    label: "Cilj",
    b: {
      v: "Jedan izbor, paket podešavanja",
      note: "Jedan izbor cilja postavlja više podešavanja kampanje odjednom. Cilj može da bude i Automatski, pa ga Meta bira umesto vas.",
      chips: ["Automatski", "Poruke", "Poseta profilu", "Kupovina na sajtu"],
      foot: "Prijave preko obrasca i poziva među Boost ciljevima nema.",
    },
    a: {
      v: "Cilj kampanje i cilj učinka",
      note: "Cilj kampanje i cilj učinka, ono za šta Meta optimizuje isporuku, birate odvojeno. Opcije Automatski nema.",
      six: true,
    },
  },
  {
    label: "Publika",
    b: {
      v: "Automatski",
      lock: true,
      note: "Kad promovišete iz aplikacije, publiku Meta postavlja automatski.",
    },
    a: {
      v: "Lokacija i uzrast kao granice",
      note: "Lokaciju i uzrast zadajete kao čvrste granice, a granica može da bude i jezik, recimo srpski. Automatska publika te granice ne prelazi.",
      foot: "Publiku možete da napravite i od ljudi koji su reagovali na vaš Instagram nalog, do 365 dana unazad.",
    },
  },
  {
    label: "Plasmani",
    b: {
      v: "Automatski",
      lock: true,
      note: "Plasmane, mesta gde se oglas prikazuje, Meta u aplikaciji postavlja automatski.",
    },
    a: {
      v: "Ručno, kod nekih ciljeva",
      note: "Ručni izbor plasmana imate kod ciljeva Prepoznatljivost, Saobraćaj i Interakcija. Dodavanje plasmana ne poskupljuje oglas.",
      foot: "Kod ciljeva Potencijalni klijenti i Prodaja Meta postepeno uvodi Advantage+ plasmane bez ručnog izbora.",
    },
  },
  {
    label: "Oglasi",
    b: {
      v: "Jedna postojeća objava",
      note: "Boost jednu postojeću objavu pretvara u oglas.",
    },
    a: {
      v: "Više oglasa, A/B test",
      note: "U skupu oglasa može da bude više oglasa, a jedan od njih može biti već objavljena objava, Reels ili priča.",
      foot: "A/B test dve verzije prikazuje različitim delovima publike, pa niko ne vidi obe.",
    },
  },
  {
    label: "Praćenje",
    b: {
      v: "Cilj kupovine",
      note: "U Boost ekranu konverzije na sajtu koristi cilj kupovine.",
      foot: "Upit sa sajta Meta u izveštaju broji tek kad postavite Meta Pixel ili Conversions API.",
    },
    a: {
      v: "Meta Pixel i Conversions API",
      note: "Meta Pixel beleži akcije na sajtu, kao što su kupovina ili poslat obrazac. Conversions API šalje iste podatke sa servera ili iz CRM-a.",
      foot: "Izveštaj Ads Manager raščlanjuje po uzrastu i plasmanu.",
    },
  },
  {
    label: "Budžet",
    b: {
      v: "Dnevni budžet i trajanje",
      note: "U aplikaciji birate dnevni budžet i trajanje.",
      foot: "Boost plaćen kroz aplikaciju na iPhoneu nosi Apple naknadu od 30%. Preko instagram.com te naknade nema.",
    },
    a: {
      v: "Dnevni ili ukupni",
      note: "Za kampanju birate dnevni ili ukupni budžet, a limit potrošnje naloga je gornja granica za sve kampanje zajedno.",
    },
  },
];

const SCREENS = [
  {
    tab: "Boost u aplikaciji",
    title: "Promocija objave",
    sub: "Jedna objava",
    cta: "Povećaj vidljivost",
  },
  {
    tab: "Ads Manager",
    title: "Nova kampanja",
    sub: "Kampanja, skup oglasa, oglasi",
    cta: "Objavi",
  },
];

function Six() {
  return (
    <div className={s.six}>
      <div className={s.sixDots} aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.i
            key={i}
            data-lit={i >= 4 ? "" : undefined}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE }}
          />
        ))}
      </div>
      <span>
        <b>2 od 6</b> ciljeva kampanje služe upitima i prodaji: Potencijalni
        klijenti i Prodaja.
      </span>
    </div>
  );
}

function BoostAds() {
  const ref = useRef(null);
  const { on, pick } = useAutoFlip(ref, 1800);
  const [sel, setSel] = useState(0);
  const sc = SCREENS[on];
  const row = ROWS[sel];
  const d = on ? row.a : row.b;
  return (
    <figure ref={ref} className={s.boost}>
      <div className={s.top}>
        <span className={s.cap}>Isto podešavanje, dva ekrana</span>
        <span className={s.tag}>Pojednostavljeno</span>
      </div>
      <Switch
        names={SCREENS.map((x) => x.tab)}
        on={on}
        pick={pick}
        label="Boost ili Ads Manager"
      />
      <div className={s.stage}>
        <div className={s.phone}>
          <div className={s.screen}>
            <i className={s.notch} aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={on}
                className={s.screenHead}
                initial={{ opacity: 0, x: on ? 14 : -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: on ? -14 : 14 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <b>{sc.title}</b>
                <span>{sc.sub}</span>
              </motion.div>
            </AnimatePresence>
            <div className={s.rows}>
              {ROWS.map((r, i) => {
                const x = on ? r.a : r.b;
                return (
                  <button
                    key={r.label}
                    type="button"
                    className={s.row}
                    aria-pressed={sel === i}
                    data-lock={x.lock ? "" : undefined}
                    onClick={() => setSel(i)}
                  >
                    <span className={s.rowText}>
                      <small>{r.label}</small>
                      <motion.b
                        key={`${on}-${r.label}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: EASE,
                          delay: i * 0.05,
                        }}
                      >
                        {x.v}
                      </motion.b>
                    </span>
                    <span className={s.rowEnd} aria-hidden="true">
                      {x.lock
                        ? <>
                            <Lock size={13} /> Meta
                          </>
                        : <ChevronDown size={14} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className={s.cta} aria-hidden="true">
              {sc.cta}
            </span>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${on}-${row.label}`}
            className={s.note}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: EASE }}
            aria-live="polite"
          >
            <span className={s.noteHead}>
              {row.label} <em>{on ? "Ads Manager" : "Boost"}</em>
            </span>
            <b className={s.noteValue} data-lock={d.lock ? "" : undefined}>
              {d.lock ? <Lock size={16} /> : null}
              {d.v}
            </b>
            <span className={s.noteText}>{d.note}</span>
            {d.chips
              ? <span className={s.chips}>
                  {d.chips.map((c) => (
                    <em key={c}>{c}</em>
                  ))}
                </span>
              : null}
            {d.six ? <Six /> : null}
            {d.foot ? <span className={s.noteFoot}>{d.foot}</span> : null}
            <span className={s.hint}>
              Dodirnite red na ekranu <ArrowRight size={13} />
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}

/* ── 3. a week on a daily budget ───────────────────────────────────────── */

const DAYS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
/* percent of the daily budget spent each day; every day ≤ 175, every week
   ≤ 700 (seven daily budgets) */
const WEEKS = [
  [100, 175, 60, 90, 120, 80, 75],
  [80, 120, 175, 50, 100, 95, 80],
  [90, 100, 175, 40, 110, 95, 60],
  [140, 60, 100, 175, 70, 85, 70],
];
const BUDGETS = [500, 1000, 2000];
const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Num({ value, still }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (still) {
      setShown(value);
      from.current = value;
      return;
    }
    const c = animate(from.current, value, {
      duration: 0.7,
      ease: EASE,
      onUpdate: (v) => setShown(v),
    });
    from.current = value;
    return () => c.stop();
  }, [value, still]);
  return <>{fmt(shown)}</>;
}

function BudgetWeek() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.45 });
  const still = useReducedMotion();
  const [w, setW] = useState(0);
  const [bi, setBi] = useState(1);
  const budget = BUDGETS[bi];
  const week = WEEKS[w];
  const sum = week.reduce((a, b) => a + b, 0);
  const on = seen || still;
  const t = (i) =>
    still
      ? { duration: 0 }
      : { duration: 0.8, ease: EASE, delay: 0.1 + i * 0.09 };
  return (
    <figure ref={ref} className={s.week}>
      <div className={s.top}>
        <span className={s.cap}>Nedelja sa dnevnim budžetom</span>
        <span className={s.tag}>Primer</span>
      </div>

      <div className={s.weekBar}>
        <fieldset className={s.budgets} aria-label="Dnevni budžet, primer">
          {BUDGETS.map((b, i) => (
            <button
              key={b}
              type="button"
              aria-pressed={bi === i}
              onClick={() => setBi(i)}
            >
              {fmt(b)} din
            </button>
          ))}
        </fieldset>
        <button
          type="button"
          className={s.again}
          onClick={() => setW((x) => (x + 1) % WEEKS.length)}
        >
          <Rotate size={14} /> Druga nedelja
        </button>
      </div>

      <div className={s.nums}>
        <div>
          <b>
            <Num value={budget} still={still} />
          </b>
          <span>din dnevni budžet</span>
        </div>
        <div data-on="">
          <b>
            <Num value={budget * 1.75} still={still} />
          </b>
          <span>din najviše u jednom danu, 75% više</span>
        </div>
        <div>
          <b>
            <Num value={budget * 7} still={still} />
          </b>
          <span>din najviše za celu nedelju</span>
        </div>
      </div>

      <div className={s.chart}>
        <span className={s.lineMax} aria-hidden="true">
          <em>175%</em>
        </span>
        <span className={s.lineDay} aria-hidden="true">
          <em>100%</em>
        </span>
        {week.map((p, i) => (
          <div key={DAYS[i]} className={s.col}>
            <div className={s.colTrack}>
              <motion.i
                data-max={p === 175 ? "" : undefined}
                initial={{ height: "0%" }}
                animate={{ height: on ? `${(p / 175) * 100}%` : "0%" }}
                transition={t(i)}
              >
                <motion.small
                  initial={{ opacity: 0 }}
                  animate={{ opacity: on ? 1 : 0 }}
                  transition={{ ...t(i), duration: still ? 0 : 0.4 }}
                >
                  {fmt((budget * p) / 100)}
                </motion.small>
              </motion.i>
            </div>
            <span className={s.day}>{DAYS[i]}</span>
          </div>
        ))}
      </div>

      <div className={s.meter}>
        <div className={s.meterTop}>
          <span>Potrošeno u nedelji</span>
          <b>
            {fmt((budget * sum) / 100)} od {fmt(budget * 7)} din
          </b>
        </div>
        <div className={s.meterTrack} aria-hidden="true">
          <motion.span
            initial={{ width: "0%" }}
            animate={{ width: on ? `${(sum / 700) * 100}%` : "0%" }}
            transition={
              still
                ? { duration: 0 }
                : { duration: 1.1, ease: EASE, delay: 0.3 }
            }
          />
        </div>
        <span className={s.meterNote}>
          Pojednostavljeno: dan sme do 175% dnevnog budžeta, a nedelja nikad
          preko sedam dnevnih budžeta.
        </span>
      </div>
    </figure>
  );
}

/* reduced motion: transforms switch off, the end state shows */
const calm = (C) =>
  function Calm(props) {
    return (
      <MotionConfig reducedMotion="user">
        <C {...props} />
      </MotionConfig>
    );
  };

export const PIECES = {
  "instagram-reach": calm(Reach),
  "instagram-boost-ads": calm(BoostAds),
  "instagram-budget-week": calm(BudgetWeek),
};
