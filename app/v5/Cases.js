"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import c from "./cases.module.css";
import { ArrowUpRight } from "./icons";
import { Chapter, Counter, EASE, useVisible } from "./ui";

/* ── one live readout per case ────────────────────────────────────────── */
const CURVE =
  "M0,96 C40,95 70,93 100,88 C140,80 160,64 200,50 C240,36 262,22 300,8";
function IndexCurve({ k, run }) {
  const end = k.metrics.find((m) => /indeks/i.test(m.label));
  return (
    <div className={c.inst}>
      <div className={c.instHead}>
        <span>Indeksirane stranice</span>
        <span>3 meseca</span>
      </div>
      <div className={c.curveBox}>
        <svg
          viewBox="0 0 300 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} className={c.grid} />
          ))}
          <motion.path
            d={CURVE}
            className={c.curve}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: run ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </svg>
        {end
          ? <b className={c.curveEnd}>
              <Counter metric={end} run={run} ms={1600} />
            </b>
          : null}
      </div>
      <p className={c.instNote}>
        Kraj iz studije slučaja, kriva između je ilustracija.
      </p>
    </div>
  );
}

const MONTHS = [
  { label: "Pre", site: 0 },
  { label: "1. mesec", site: 26 },
  { label: "2. mesec", site: 50 },
  { label: "3. mesec", site: 78 },
];
function Overtake({ run }) {
  const [m, setM] = useState(0);
  useEffect(() => {
    if (!run) return;
    const t = setTimeout(() => setM((v) => Math.min(3, v + 1)), 900);
    return () => clearTimeout(t);
  }, [run, m]);
  return (
    <div className={c.inst}>
      <div className={c.instHead}>
        <span>Izvori novih klijenata</span>
        <span>{MONTHS[m].label}</span>
      </div>
      <div className={c.lanes}>
        {[
          ["Preporuke", 60, false],
          ["Sajt i pretraga", MONTHS[m].site, true],
        ].map(([label, v, site]) => (
          <div key={label} className={c.lane}>
            <span>{label}</span>
            <span className={c.track}>
              <motion.i
                className={site ? c.fillSite : c.fillRef}
                initial={{ width: 0 }}
                animate={{ width: run ? `${v}%` : 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </span>
          </div>
        ))}
      </div>
      <p className={c.instNote}>
        Šematski prikaz toka iz studije, bez apsolutnih brojeva.
      </p>
    </div>
  );
}

function Gauge({ k, run }) {
  const m = k.metrics.find((x) => /pagespeed/i.test(x.label));
  const v = m?.num ?? 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  return (
    <div className={`${c.inst} ${c.instRow}`}>
      <div className={c.gauge}>
        <svg viewBox="0 0 96 96" aria-hidden="true">
          <circle cx="48" cy="48" r={r} className={c.gTrack} />
          <motion.circle
            cx="48"
            cy="48"
            r={r}
            className={c.gBar}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: run ? circ * (1 - v / 100) : circ }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </svg>
        <b>{m ? <Counter metric={m} run={run} /> : v}</b>
      </div>
      <div className={c.gText}>
        <span>PageSpeed na telefonu</span>
        <p>
          Isti test kojim Google meri sajtove. Izmerite svoj u 4. poglavlju.
        </p>
      </div>
    </div>
  );
}

const MOLER = [
  "Krečenje",
  "Gletovanje",
  "Fasada",
  "Dekorativni premazi",
  "Tapete",
  "Sanacija vlage",
];
function Pages({ run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    setN(0);
    const id = setInterval(
      () => setN((v) => (v >= MOLER.length ? v : v + 1)),
      320,
    );
    return () => clearInterval(id);
  }, [run]);
  return (
    <div className={c.inst}>
      <div className={c.instHead}>
        <span>Svaka usluga, svoja stranica</span>
        <span>
          {n}/{MOLER.length}
        </span>
      </div>
      <div className={c.pages}>
        {MOLER.map((p, i) => (
          <span key={p} data-on={i < n ? "true" : undefined}>
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── the stories ──────────────────────────────────────────────────────── */
const STORIES = [
  {
    re: /thermiq/i,
    where: "Grejanje i klimatizacija · Beograd",
    before:
      "Isti Bosch, Vaillant i MDV kao kod svakog distributera, i katalog od hiljade proizvoda koji gotovo niko nije mogao da pronađe u pretrazi.",
    did: "Novi identitet, sajt koji nosi ceo asortiman i SEO postavljen na nivou šablona, pa važi za svaki proizvod odjednom. Kalkulator toplotne pumpe hvata kupce mesecima pre kupovine.",
    Inst: IndexCurve,
  },
  {
    re: /elektro/i,
    where: "Električar · Niš",
    before:
      "Više od decenije posla izgrađenog samo na preporuci, bez ikakvog prisustva na internetu.",
    did: "Sajt i lokalni SEO od nule, građeni oko pretraga sa kupovnom namerom, kao što je „električar Niš“.",
    Inst: Overtake,
  },
  {
    re: /klim/i,
    where: "Servis klima uređaja · Niš",
    before:
      "Klima se prodaje dva meseca godišnje. Kod većine firmi sajt ostatak godine ćuti, a cena ostaje nepoznata do dolaska servisera.",
    did: "Posebna stranica za svaku uslugu, katalog uređaja sa realnim cenama i montažom u ceni, i cena vidljiva pre poziva.",
    Inst: Gauge,
  },
  {
    re: /moler/i,
    where: "Molerski radovi · Niš",
    before:
      "Jedanaest godina rada na terenu i nijedan red o poslu na internetu. Svaki klijent je stizao preko preporuke.",
    did: "Sajt i lokalna SEO osnova od nule: šest usluga, šest stranica, a fiksna cena i besplatan obilazak istaknuti na svakom koraku.",
    Inst: Pages,
  },
];

const BEAT_MS = 1700;
const STAY_MS = 5200;

export default function Cases({ clients }) {
  const items = STORIES.map((st) => ({
    ...st,
    k: clients.find((x) => st.re.test(x.name)),
  })).filter((x) => x.k);
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [i, setI] = useState(0);
  const [beat, setBeat] = useState(0);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (beat < 3) {
      const t = setTimeout(
        () => setBeat((v) => v + 1),
        beat === 0 ? 400 : BEAT_MS,
      );
      return () => clearTimeout(t);
    }
    if (touched || items.length < 2) return;
    const t = setTimeout(() => {
      setI((v) => (v + 1) % items.length);
      setBeat(0);
    }, STAY_MS);
    return () => clearTimeout(t);
  }, [visible, beat, touched, items.length]);

  const cur = items[i];
  if (!cur) return null;
  const { Inst } = cur;
  const autoplay = visible && !touched;

  return (
    <section className={c.section} data-theme="light">
      <div className={b.container}>
        <Chapter
          n="3"
          name="Dokazi"
          id="dokazi"
          title={
            <>
              Četiri firme, četiri početka. <em>Isti krug.</em>
            </>
          }
          sub="Svaki broj je iz objavljene studije slučaja. Sajtove možete da otvorite i izmerite sami."
        />

        <div ref={ref} className={c.player}>
          <div className={c.tabs} role="tablist" aria-label="Projekti">
            {items.map((x, k) => (
              <button
                key={x.k.slug}
                type="button"
                role="tab"
                aria-selected={k === i}
                className={c.tab}
                data-on={k === i ? "true" : undefined}
                onClick={() => {
                  setTouched(true);
                  setI(k);
                  setBeat(0);
                }}
              >
                {x.k.logo
                  ? <span className={c.tabLogo}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={x.k.logo} alt="" />
                    </span>
                  : null}
                <span className={c.tabText}>
                  <b>{x.k.name}</b>
                  <span>{x.where}</span>
                </span>
                {k === i && autoplay && beat >= 3
                  ? <motion.i
                      key={`bar-${i}`}
                      className={c.tabBar}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: STAY_MS / 1000, ease: "linear" }}
                    />
                  : null}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={cur.k.slug}
              className={c.body}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ol className={c.beats}>
                {[
                  { tag: "Pre", text: cur.before },
                  { tag: "Šta smo uradili", text: cur.did },
                ].map((bt, k) => (
                  <li key={bt.tag} data-on={beat > k ? "true" : undefined}>
                    <span className={c.beatTag}>{bt.tag}</span>
                    <p>{bt.text}</p>
                  </li>
                ))}
                <li
                  data-on={beat > 2 ? "true" : undefined}
                  className={c.result}
                >
                  <span className={c.beatTag}>Rezultat</span>
                  <div className={c.metrics}>
                    {cur.k.metrics.map((m) => (
                      <div key={m.label}>
                        <b>
                          <Counter metric={m} run={beat > 2} />
                        </b>
                        <span>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </li>
              </ol>

              <div className={c.visual}>
                <div className={c.cover}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cur.k.cover} alt={`Sajt za ${cur.k.name}`} />
                </div>
                <div className={c.instWrap}>
                  <Inst k={cur.k} run={visible && beat > 1} />
                </div>
                <a className={c.open} href={cur.k.href}>
                  Studija slučaja <ArrowUpRight size={15} />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
