"use client";

/* Bespoke pieces for "Recenzije na Google-u za firme i šta da radite sa
   lažnim" (13 Nov 2026). Three ideas only this post has:
   - recenzije-faktori: the three local ranking factors, tap one to see it;
     popularnost is where reviews count, shown as a small results list
     where "Vaša firma" climbs once its reviews add up (example);
   - recenzije-odgovor: pick the kind of review, see what to write and what
     to leave out (the post's reply table, as a picker);
   - recenzije-prijava: a report followed like a parcel: prijava, provera,
     odluka, one appeal of up to 10 reviews. Every fact is in the post. */

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, Clock, Pin, Rotate, Search, X } from "../../_home/icons";
import s from "./recenzije.module.css";

const EASE = [0.16, 1, 0.3, 1];

/* ── 1. Tri faktora na mapi ───────────────────────────────────────────── */

const FACTORS = [
  {
    k: "rel",
    name: "Relevantnost",
    def: "Koliko profil firme odgovara onome što neko traži.",
    tag: "Profil firme",
  },
  {
    k: "dist",
    name: "Udaljenost",
    def: "Koliko je firma daleko od kupca koji pretražuje.",
    tag: "Na ovo ne utičete",
  },
  {
    k: "pop",
    name: "Popularnost",
    def: "Koliko je firma poznata. Ovde ulaze recenzije i njihove ocene.",
    tag: "Ovde ulaze recenzije",
    note: "Više recenzija i dobre ocene mogu da podignu firmu u lokalnim rezultatima.",
  },
];

function Count({ from, to, run }) {
  const [v, setV] = useState(from);
  useEffect(() => {
    if (!run) {
      setV(from);
      return;
    }
    const c = animate(from, to, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (x) => setV(Math.round(x)),
    });
    return () => c.stop();
  }, [run, from, to]);
  return <>{v}</>;
}

function RelScene({ calm }) {
  const word = "vodoinstalater";
  const [typed, setTyped] = useState(calm ? word : "");
  useEffect(() => {
    if (calm) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(word.slice(0, i));
      if (i >= word.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [calm]);
  const done = typed.length === word.length;
  return (
    <div className={s.scene}>
      <div className={s.search}>
        <Search size={15} />
        <span>
          {typed}
          {done ? null : <i className={s.caret} />}
        </span>
      </div>
      <div className={s.results}>
        {[
          { n: "Vaša firma", c: "Vodoinstalater", hit: true },
          { n: "Druga firma", c: "Frizerski salon", hit: false },
        ].map((r, i) => (
          <motion.div
            key={r.n}
            className={s.row}
            data-on={done && r.hit ? "" : undefined}
            initial={calm ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: done && !r.hit ? 0.45 : 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.1 }}
          >
            <span className={s.rowName}>
              <b>{r.n}</b>
              <small>{r.c}</small>
            </span>
            <i className={s.rowMark} aria-hidden="true">
              {done && r.hit ? <Check size={12} strokeWidth={3} /> : null}
            </i>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DistScene({ calm }) {
  return (
    <div className={s.scene}>
      <div className={s.radar} aria-hidden="true">
        {[1, 2, 3].map((r) => (
          <motion.i
            key={r}
            className={s.ring}
            style={{ "--r": r }}
            initial={calm ? false : { scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: r * 0.12 }}
          />
        ))}
        <span className={s.me}>Kupac</span>
        {[
          { x: 62, y: 38, near: true },
          { x: 22, y: 74, near: false },
          { x: 86, y: 84, near: false },
        ].map((p, i) => (
          <motion.span
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed pins
            key={i}
            className={s.pin}
            data-on={p.near ? "" : undefined}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={calm ? false : { y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 18,
              delay: 0.5 + i * 0.12,
            }}
          >
            <Pin size={22} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function PopScene({ calm }) {
  const [up, setUp] = useState(calm);
  useEffect(() => {
    if (calm) return;
    const t = setTimeout(() => setUp(true), 700);
    return () => clearTimeout(t);
  }, [calm]);
  const rows = [
    { id: "a", n: "Firma A", r: "4,6", from: 31, to: 31 },
    { id: "me", n: "Vaša firma", r: "4,8", from: 12, to: 46, me: true },
    { id: "b", n: "Firma B", r: "4,2", from: 8, to: 8 },
  ];
  const order = up ? ["me", "a", "b"] : ["a", "me", "b"];
  return (
    <div className={s.scene}>
      <div className={s.results}>
        {order.map((id, i) => {
          const r = rows.find((x) => x.id === id);
          return (
            <motion.div
              key={id}
              layout={!calm}
              className={s.row}
              data-on={r.me ? "" : undefined}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <span className={s.rank}>{i + 1}</span>
              <span className={s.rowName}>
                <b>{r.n}</b>
                <small>
                  <span className={s.star}>★</span> {r.r} ·{" "}
                  {r.me
                    ? <Count from={r.from} to={r.to} run={up && !calm} />
                    : r.to}{" "}
                  recenzija
                </small>
              </span>
              {r.me && up
                ? <motion.em
                    className={s.climb}
                    initial={calm ? false : { opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
                  >
                    gore
                  </motion.em>
                : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Factors() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const [on, setOn] = useState("pop");
  const f = FACTORS.find((x) => x.k === on);
  const Scene = { rel: RelScene, dist: DistScene, pop: PopScene }[on];
  return (
    <div ref={ref} className={s.factors}>
      <div className={s.top}>
        <span className={s.cap}>Tri faktora na mapi</span>
        <span className={s.hint}>Dodirnite faktor</span>
      </div>
      <div className={s.fGrid} role="tablist" aria-label="Faktori">
        {FACTORS.map((x, i) => (
          <motion.button
            key={x.k}
            type="button"
            role="tab"
            aria-selected={on === x.k}
            className={s.fCard}
            data-pop={x.k === "pop" ? "" : undefined}
            onClick={() => setOn(x.k)}
            initial={calm ? false : { opacity: 0, y: 14 }}
            animate={seen || calm ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.09 }}
          >
            <span className={s.fNo}>{String(i + 1).padStart(2, "0")}</span>
            <b>{x.name}</b>
            <span className={s.fTag}>{x.tag}</span>
          </motion.button>
        ))}
      </div>
      <motion.div
        className={s.stage}
        initial={calm ? false : { opacity: 0, y: 14 }}
        animate={seen || calm ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
      >
        <div className={s.stageArt}>
          <span className={s.example}>
            {on === "pop" ? "Primer, pojednostavljeno" : "Primer"}
          </span>
          {seen || calm ? <Scene key={on} calm={!!calm} /> : null}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={on}
            className={s.stageText}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <b className={s.stageName}>{f.name}</b>
            <span>{f.def}</span>
            {f.note ? <span className={s.stageNote}>{f.note}</span> : null}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className={s.foot}>
        Viši položaj na mapi ne možete da platite Google-u.
      </div>
    </div>
  );
}

/* ── 2. Kako da odgovorite, po vrsti recenzije ───────────────────────── */

const KINDS = [
  {
    k: "pohvala",
    name: "Pohvala",
    stars: 5,
    write: "Zahvalite i pomenite posao koji je kupac opisao.",
    avoid: "Popust za sledeću kupovinu.",
  },
  {
    k: "kritika",
    name: "Opravdana kritika",
    stars: 2,
    write: "Priznajte propust i napišite šta ste posle promenili.",
    avoid: "Izgovore i krivicu prebačenu na radnika.",
  },
  {
    k: "netacna",
    name: "Netačna ili nepravedna",
    stars: 1,
    write: "Mirno navedite činjenice i ponudite razgovor telefonom.",
    avoid: "Svađu i detalje o kupcu ili poslu.",
  },
  {
    k: "lazna",
    name: "Sumnja na lažnu",
    stars: 1,
    flag: "Sumnja",
    write: "Napišite da kupca nemate u evidenciji, pa prijavite recenziju.",
    avoid: "Optužbe protiv konkurencije po imenu.",
  },
];

function Reply() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const calm = useReducedMotion();
  const [on, setOn] = useState("kritika");
  const k = KINDS.find((x) => x.k === on);
  const go = seen || calm;
  return (
    <motion.div
      ref={ref}
      className={s.reply}
      initial={calm ? false : { opacity: 0, y: 18 }}
      animate={go ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className={s.cap}>Na kakvu recenziju odgovarate?</span>
      <div className={s.chips} role="tablist" aria-label="Vrsta recenzije">
        {KINDS.map((x) => (
          <button
            key={x.k}
            type="button"
            role="tab"
            aria-selected={on === x.k}
            className={s.chip}
            onClick={() => setOn(x.k)}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div className={s.threadWrap}>
        <span className={s.example}>Primer</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={on}
            className={s.thread}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className={s.rv} data-flag={k.flag ? "" : undefined}>
              <div className={s.rvTop}>
                <i className={s.avatar} aria-hidden="true" />
                <span
                  className={s.stars}
                  role="img"
                  aria-label={`${k.stars} od 5 zvezdica`}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <motion.span
                      // biome-ignore lint/suspicious/noArrayIndexKey: stars
                      key={i}
                      data-on={i < k.stars ? "" : undefined}
                      initial={calm || !go ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.07,
                        type: "spring",
                        stiffness: 420,
                        damping: 15,
                      }}
                    >
                      ★
                    </motion.span>
                  ))}
                </span>
                {k.flag ? <em className={s.flag}>{k.flag}</em> : null}
              </div>
              <i className={s.line} style={{ width: "88%" }} />
              <i className={s.line} style={{ width: "62%" }} />
            </div>

            <div className={s.write}>
              <span className={s.label}>Vaš odgovor</span>
              <span className={s.writeText}>{k.write}</span>
            </div>
            <div className={s.avoid}>
              <i aria-hidden="true">
                <X size={11} strokeWidth={3} />
              </i>
              <span>
                <b>Izbegnite:</b> {k.avoid}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={s.rules}>
        {[
          "Kratko i iskreno",
          "Bez ponuda i popusta",
          "Podaci kupca nikad javno",
        ].map((t) => (
          <span key={t} className={s.rule}>
            <Check size={12} strokeWidth={3} />
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ── 3. Prijava recenzije, praćena kao pošiljka ───────────────────────── */

function Tracker() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const calm = useReducedMotion();
  /* phase: 0 sent, 1 in review, 2 decision open, 3 decided */
  const [phase, setPhase] = useState(-1);
  const [out, setOut] = useState(null);
  const [run, setRun] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: run is the replay key
  useEffect(() => {
    if (!seen && !calm) return;
    if (calm) {
      setPhase(2);
      return;
    }
    setPhase(0);
    const a = setTimeout(() => setPhase(1), 1000);
    const b = setTimeout(() => setPhase(2), 2400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [seen, calm, run]);

  const pick = (o) => {
    setOut(o);
    setPhase(3);
  };
  const replay = () => {
    setOut(null);
    setRun((r) => r + 1);
  };

  const status =
    phase < 1
      ? "Prijava poslata"
      : phase === 1
        ? "Na proveri"
        : phase === 2
          ? "Odluka je stigla"
          : out === "gone"
            ? "Recenzija uklonjena"
            : "Ostala, žalba je moguća";

  const reached = (i) => phase >= i;
  const current = (i) => phase === i;

  const stages = [
    {
      t: "Prijava",
      when: "Danas",
      body: (
        <>
          <span className={s.path}>
            <b>Read reviews</b>
            <i aria-hidden="true">›</i>
            <b>Report</b>
            <i aria-hidden="true">›</i>
            <b>Razlog</b>
          </span>
          <span>
            Na profilu firme otvorite pregled recenzija, pored sporne izaberite
            Report i navedite razlog koji odgovara kršenju pravila.
          </span>
        </>
      ),
    },
    {
      t: "Provera",
      when: "Obično nekoliko dana",
      body: (
        <span>
          Status pratite u Google-ovom alatu za upravljanje recenzijama (Reviews
          Management Tool).
        </span>
      ),
    },
    {
      t: "Odluka",
      when: "Google odlučuje po pravilima",
      body: (
        <>
          <span>Šta je Google odlučio? Izaberite ishod.</span>
          <span className={s.pick}>
            <button
              type="button"
              aria-pressed={out === "gone"}
              disabled={phase < 2}
              onClick={() => pick("gone")}
            >
              Recenzija uklonjena
            </button>
            <button
              type="button"
              aria-pressed={out === "stays"}
              disabled={phase < 2}
              onClick={() => pick("stays")}
            >
              Recenzija ostala
            </button>
          </span>
        </>
      ),
    },
    {
      t: out === "gone" ? "Gotovo" : "Žalba",
      when: out === "gone" ? "Žalba nije potrebna" : "U istom alatu",
      body:
        out === "gone"
          ? <span>Google uklanja recenziju kad krši njegova pravila.</span>
          : <>
              <span className={s.nums}>
                <span className={s.num}>
                  <b>1</b>
                  <small>žalba na odluku</small>
                </span>
                <span className={s.num}>
                  <b>10</b>
                  <small>recenzija najviše u jednoj žalbi</small>
                </span>
              </span>
              <span>
                Status <b className={s.code}>Escalated</b> posle žalbe znači da
                je Google recenziju ponovo pregledao i ostavio je na profilu.
              </span>
            </>,
    },
  ];

  return (
    <motion.div
      ref={ref}
      className={s.track}
      initial={calm ? false : { opacity: 0, y: 18 }}
      animate={seen || calm ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className={s.trackHead}>
        <div className={s.trackTitle}>
          <span className={s.cap}>Praćenje prijave</span>
          <span className={s.example} data-inline="">
            Pojednostavljeno
          </span>
        </div>
        <div className={s.status} aria-live="polite">
          <i
            className={s.pulse}
            data-done={phase === 3 ? "" : undefined}
            aria-hidden="true"
          />
          <b>{phase < 0 ? "Prijava poslata" : status}</b>
        </div>
        <div className={s.bar} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i}>
              <motion.i
                initial={false}
                animate={{ scaleX: reached(i) ? 1 : 0 }}
                transition={{ duration: calm ? 0 : 0.7, ease: EASE }}
              />
            </span>
          ))}
        </div>
      </div>

      <div className={s.stops}>
        {stages.map((st, i) => (
          <div
            key={st.t}
            className={s.stop}
            data-on={reached(i) || (i === 2 && phase >= 2) ? "" : undefined}
            data-now={current(i) ? "" : undefined}
          >
            <span className={s.rail} aria-hidden="true">
              <i className={s.dot}>
                {reached(i) && !current(i)
                  ? <Check size={11} strokeWidth={3.4} />
                  : null}
                {i === 1 && current(i) ? <Clock size={12} /> : null}
              </i>
            </span>
            <div className={s.stopBody}>
              <div className={s.stopHead}>
                <b>{st.t}</b>
                <small>{st.when}</small>
              </div>
              <div className={s.stopText}>{st.body}</div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className={s.replay} onClick={replay}>
        <Rotate size={14} />
        Ponovo
      </button>
    </motion.div>
  );
}

export const PIECES = {
  "recenzije-faktori": Factors,
  "recenzije-odgovor": Reply,
  "recenzije-prijava": Tracker,
};
