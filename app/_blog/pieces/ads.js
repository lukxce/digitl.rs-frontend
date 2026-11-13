"use client";

/* Bespoke pieces for "Google Ads cena po kliku" (13 Nov 2026).
   ads-auction   three ads for one search; the reader moves their own bid and
                 ad quality, the order re-sorts and the price per click follows
                 the rule the post explains (pay just enough to beat the ad
                 below you, or the rank threshold). Labelled "pojednostavljeno".
   ads-lokacija  who sees the ad: the default location setting vs Prisustvo.
   ads-upit      cost per enquiry for two example campaigns: a cheap click is
                 not a cheap enquiry. Pure arithmetic on the reader's numbers. */

import { MotionConfig, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check, Search, X } from "../../_home/icons";
import s from "./ads.module.css";

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 380, damping: 34 };

const fmt = (n) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: EASE },
};

/* ── 1. the auction ────────────────────────────────────────────────────── */

/* Simplified: rank = bid x quality. Real Ad Rank also weighs the search
   context, ad assets and thresholds; the piece says so under the list. */
const LEVELS = [
  {
    label: "Ispod proseka",
    q: 0.6,
    head: "Vodoinstalaterske usluge",
    land: "vodi na početnu stranicu",
  },
  {
    label: "Prosečno",
    q: 1,
    head: "Zamena bojlera",
    land: "vodi na početnu stranicu",
  },
  {
    label: "Iznad proseka",
    q: 1.5,
    head: "Zamena bojlera u Nišu",
    land: "vodi na stranicu o zameni bojlera",
  },
];
const THRESHOLD = 32; // the rank an ad needs to be shown at all
const RANK_MAX = 90 * 1.5;
const RIVALS = [
  {
    id: "a",
    who: "Konkurent A",
    head: "Vodoinstalater Niš",
    land: "vodi na početnu stranicu",
    bid: 60,
    level: 1,
  },
  {
    id: "b",
    who: "Konkurent B",
    head: "Zamena bojlera Niš",
    land: "vodi na stranicu o zameni bojlera",
    bid: 45,
    level: 2,
  },
];

function auction(bid, level) {
  const ads = [
    ...RIVALS,
    {
      id: "you",
      who: "Vaša firma",
      head: LEVELS[level].head,
      land: LEVELS[level].land,
      bid,
      level,
      you: true,
    },
  ].map((a) => ({ ...a, rank: a.bid * LEVELS[a.level].q }));
  ads.sort((x, y) => y.rank - x.rank || (x.you ? 1 : -1));
  const shown = ads.filter((a) => a.rank >= THRESHOLD);
  const hidden = ads.filter((a) => a.rank < THRESHOLD);
  shown.forEach((a, i) => {
    const below = shown[i + 1];
    const beat = Math.max(below ? below.rank : 0, THRESHOLD);
    a.pos = i + 1;
    a.beats = below ? "below" : "threshold";
    a.pay = Math.min(a.bid, Math.floor(beat / LEVELS[a.level].q) + 1);
  });
  return [...shown, ...hidden];
}

function Auction() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [bid, setBid] = useState(50);
  const [level, setLevel] = useState(1);
  const touched = useRef(false);

  /* once in view, the quality goes up by itself so the re-sort plays once */
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => {
      if (!touched.current) setLevel(2);
    }, 1300);
    return () => clearTimeout(t);
  }, [seen]);

  const ads = auction(bid, level);
  const me = ads.find((a) => a.you);
  const outbid = me.pos
    ? ads.filter((a) => !a.you && a.pos > me.pos && a.bid > me.bid)
    : [];

  let verdict;
  if (!me.pos)
    verdict = (
      <>
        Rang je <b>ispod praga</b>, pa se oglas ne prikazuje ni uz ponudu od{" "}
        {bid} din.
      </>
    );
  else
    verdict = (
      <>
        {me.pos}. mesto. Nudite najviše {bid} din, a plaćate <b>{me.pay} din</b>
        ,{" "}
        {me.beats === "below"
          ? "koliko treba da prestignete oglas ispod vas."
          : "koliko treba da pređete prag ranga."}
      </>
    );

  return (
    <MotionConfig reducedMotion="user">
      <motion.div ref={ref} className={s.auction} {...rise}>
        <div className={s.top}>
          <div className={s.query}>
            <Search size={16} />
            <span>zamena bojlera Niš</span>
          </div>
          <span className={s.tag}>Primer, pojednostavljeno</span>
        </div>

        <div className={s.ads}>
          {ads.map((a) => (
            <motion.div
              key={a.id}
              layout
              transition={SPRING}
              className={s.ad}
              data-you={a.you ? "" : undefined}
              data-off={a.pos ? undefined : ""}
            >
              <span className={s.pos}>
                {a.pos ? a.pos : <X size={14} strokeWidth={2.6} />}
              </span>
              <span className={s.adBody}>
                <span className={s.adMeta}>
                  <em>Sponzorisano</em>
                  <span>{a.who}</span>
                </span>
                <b className={s.adHead}>{a.head}</b>
                <span className={s.adLand}>
                  Kvalitet: {LEVELS[a.level].label.toLowerCase()}, {a.land}
                </span>
                <span className={s.rankTrack} aria-hidden="true">
                  <motion.i
                    initial={false}
                    animate={{ width: `${(a.rank / RANK_MAX) * 100}%` }}
                    transition={SPRING}
                  />
                  <span
                    className={s.tick}
                    style={{ left: `${(THRESHOLD / RANK_MAX) * 100}%` }}
                  />
                </span>
              </span>
              <span className={s.price}>
                {a.pos
                  ? <>
                      <motion.b
                        key={a.pay}
                        initial={{ y: 6, opacity: 0.3 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        {a.pay} <small>din</small>
                      </motion.b>
                      <small>ponuda {a.bid} din</small>
                    </>
                  : <small className={s.offNote}>ne prikazuje se</small>}
              </span>
            </motion.div>
          ))}
        </div>

        <div className={s.legend}>
          <span>
            <i className={s.legBar} /> rang = ponuda × kvalitet
          </span>
          <span>
            <i className={s.legTick} /> prag ranga
          </span>
          <span>desno: plaćeno po kliku</span>
        </div>

        <div className={s.controls}>
          <div className={s.control}>
            <div className={s.controlTop}>
              <span className={s.label}>Vaša najviša ponuda</span>
              <b className={s.controlValue}>
                {bid} <small>din</small>
              </b>
            </div>
            <input
              type="range"
              min={20}
              max={90}
              step={1}
              value={bid}
              onChange={(e) => {
                touched.current = true;
                setBid(Number(e.target.value));
              }}
              className={s.slider}
              style={{ "--p": `${((bid - 20) / 70) * 100}%` }}
              aria-label="Vaša najviša ponuda po kliku, u dinarima"
            />
          </div>
          <div className={s.control}>
            <span className={s.label}>Kvalitet oglasa i stranice</span>
            <div className={s.seg}>
              {LEVELS.map((l, i) => (
                <button
                  key={l.label}
                  type="button"
                  aria-pressed={level === i}
                  onClick={() => {
                    touched.current = true;
                    setLevel(i);
                  }}
                >
                  {level === i
                    ? <motion.i
                        layoutId="ads-seg"
                        className={s.segKnob}
                        transition={SPRING}
                      />
                    : null}
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.verdict} aria-live="polite">
          <span>{verdict}</span>
          {outbid.length
            ? <motion.em
                key={outbid.map((o) => o.id).join()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                Ispred ste oglasa koji nudi više
              </motion.em>
            : null}
        </div>

        <span className={s.note}>
          Pojednostavljeno: u pravi rang ulaze i kontekst pretrage, dodaci
          oglasu i pragovi koji su za vrh stranice viši. Iznosi su izmišljeni.
        </span>
      </motion.div>
    </MotionConfig>
  );
}

/* ── 2. who sees the ad: the location setting ──────────────────────────── */

/* x, y in % of the map box. "in": in Niš or regularly there; "far": outside
   and searched Niš (interest); "none": outside, nothing to do with Niš. */
const PEOPLE = [
  { x: 24, y: 40, k: "in" },
  { x: 33, y: 30, k: "in" },
  { x: 42, y: 38, k: "in" },
  { x: 20, y: 56, k: "in" },
  { x: 30, y: 50, k: "in" },
  { x: 40, y: 54, k: "in" },
  { x: 48, y: 48, k: "in" },
  { x: 26, y: 70, k: "in" },
  { x: 36, y: 66, k: "in" },
  { x: 45, y: 68, k: "in" },
  { x: 33, y: 80, k: "in" },
  { x: 17, y: 46, k: "in" },
  { x: 68, y: 22, k: "far" },
  { x: 80, y: 30, k: "far" },
  { x: 75, y: 34, k: "none" },
  { x: 84, y: 20, k: "none" },
  { x: 74, y: 76, k: "far" },
  { x: 86, y: 72, k: "none" },
  { x: 82, y: 84, k: "far" },
];
const NIS = { x: 33, y: 55 };
const MODES = [
  {
    name: "Podrazumevano",
    sub: "prisustvo ili interesovanje",
    text: "Oglas vide ljudi u Nišu i oni koji su samo pokazali interesovanje za Niš. Njihov klik plaćate kao i svaki drugi.",
  },
  {
    name: "Prisustvo",
    sub: "Presence",
    text: "Oglas vide ljudi koji su u Nišu ili tu redovno borave. Prava opcija za uslugu koju radite na adresi kupca.",
  },
];

function Location() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [mode, setMode] = useState(0);
  const touched = useRef(false);
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => {
      if (!touched.current) setMode(1);
    }, 1800);
    return () => clearTimeout(t);
  }, [seen]);

  const sees = (p) => p.k === "in" || (p.k === "far" && mode === 0);
  const total = PEOPLE.filter(sees).length;
  const away = PEOPLE.filter((p) => sees(p) && p.k !== "in").length;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div ref={ref} className={s.loc} {...rise}>
        <div className={s.switch} role="tablist" aria-label="Opcija lokacije">
          {MODES.map((m, i) => (
            <button
              key={m.name}
              type="button"
              role="tab"
              aria-selected={mode === i}
              onClick={() => {
                touched.current = true;
                setMode(i);
              }}
            >
              <b>{m.name}</b>
              <small>{m.sub}</small>
            </button>
          ))}
          <motion.i
            className={s.knob}
            animate={{ x: mode ? "100%" : "0%" }}
            transition={SPRING}
          />
        </div>

        <div className={s.map}>
          <span className={s.tagIn}>Primer</span>
          <motion.span
            className={s.city}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={seen ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <span className={s.cityName} style={{ left: "33%", top: "8%" }}>
            Niš, ciljana lokacija
          </span>
          <span className={s.zone} style={{ left: "76%", top: "6%" }}>
            Beograd
          </span>
          <span className={s.zone} style={{ left: "80%", top: "56%" }}>
            Inostranstvo
          </span>

          <svg
            className={s.lines}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {PEOPLE.filter((p) => p.k === "far").map((p) => (
              <motion.line
                key={`${p.x}-${p.y}`}
                x1={p.x}
                y1={p.y}
                x2={NIS.x + 12}
                y2={NIS.y}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  seen && mode === 0
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
              />
            ))}
          </svg>

          {PEOPLE.map((p, i) => (
            <motion.span
              key={`${p.x}-${p.y}`}
              className={s.dot}
              data-k={p.k}
              data-sees={sees(p) ? "" : undefined}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={seen ? { scale: 1, opacity: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 18,
                delay: 0.2 + i * 0.035,
              }}
            >
              {p.k === "far" ? <Search size={9} strokeWidth={3} /> : null}
            </motion.span>
          ))}
        </div>

        <div className={s.locStats}>
          <div>
            <b>
              <motion.span
                key={total}
                initial={{ y: 6, opacity: 0.3 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {total}
              </motion.span>
              <small> / {PEOPLE.length}</small>
            </b>
            <span>vide oglas</span>
          </div>
          <div data-warn={away ? "" : undefined}>
            <b>
              <motion.span
                key={away}
                initial={{ y: 6, opacity: 0.3 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {away}
              </motion.span>
            </b>
            <span>od njih nije u Nišu, a klik plaćate isto</span>
          </div>
        </div>

        <motion.p
          key={mode}
          className={s.locText}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {MODES[mode].text}
        </motion.p>

        <div className={s.keys}>
          <span>
            <i data-k="in" /> u Nišu ili tu redovno borave
          </span>
          <span>
            <i data-k="far" /> van Niša, pretraživali Niš
          </span>
          <span>
            <i data-k="none" /> van Niša, bez veze sa Nišom
          </span>
        </div>
        <span className={s.note}>
          Google navodi da ni uz Prisustvo tačnost lokacije nije zagarantovana u
          svakoj situaciji.
        </span>
      </motion.div>
    </MotionConfig>
  );
}

/* ── 3. cost per enquiry ───────────────────────────────────────────────── */

const NONE = 61; // last stop of the clicks slider: no enquiry at all

function Campaign({ name, cpc, setCpc, clicks, setClicks, perLead, best }) {
  return (
    <div className={s.camp} data-best={best ? "" : undefined}>
      <div className={s.campTop}>
        <b>{name}</b>
        {best
          ? <motion.em
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <Check size={11} strokeWidth={3.2} /> jeftiniji upit
            </motion.em>
          : null}
      </div>
      <label className={s.field}>
        <span className={s.fieldTop}>
          <span>Cena klika</span>
          <b>{cpc} din</b>
        </span>
        <input
          type="range"
          min={10}
          max={150}
          step={5}
          value={cpc}
          onChange={(e) => setCpc(Number(e.target.value))}
          className={s.slider}
          style={{ "--p": `${((cpc - 10) / 140) * 100}%` }}
        />
      </label>
      <label className={s.field}>
        <span className={s.fieldTop}>
          <span>Klikova do jednog upita</span>
          <b>{clicks >= NONE ? "nijedan upit" : clicks}</b>
        </span>
        <input
          type="range"
          min={2}
          max={NONE}
          step={1}
          value={clicks}
          onChange={(e) => setClicks(Number(e.target.value))}
          className={s.slider}
          style={{ "--p": `${((clicks - 2) / (NONE - 2)) * 100}%` }}
        />
      </label>
      <div className={s.lead} data-none={perLead == null ? "" : undefined}>
        <span>Cena po upitu</span>
        <motion.b
          key={perLead ?? "none"}
          initial={{ y: 8, opacity: 0.3 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          {perLead == null
            ? "nema upita"
            : <>
                {fmt(perLead)} <small>din</small>
              </>}
        </motion.b>
      </div>
    </div>
  );
}

function Pair({ title, a, b, aText, bText, warnA, warnB, seen }) {
  const max = Math.max(a, b) || 1;
  return (
    <div className={s.pair}>
      <span className={s.label}>{title}</span>
      {[
        ["A", a, aText, warnA],
        ["B", b, bText, warnB],
      ].map(([k, v, t, warn]) => (
        <div key={k} className={s.pairRow} data-warn={warn ? "" : undefined}>
          <span className={s.pairKey}>{k}</span>
          <span className={s.pairTrack}>
            <motion.i
              initial={{ width: 0 }}
              animate={{
                width: seen ? `${Math.max(3, (v / max) * 100)}%` : 0,
              }}
              transition={SPRING}
            />
          </span>
          <b>{t}</b>
        </div>
      ))}
    </div>
  );
}

function Enquiry() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const [a, setA] = useState({ cpc: 30, clicks: 40 });
  const [b, setB] = useState({ cpc: 60, clicks: 12 });
  const lead = (c) => (c.clicks >= NONE ? null : c.cpc * c.clicks);
  const la = lead(a);
  const lb = lead(b);

  let best = null;
  if (la != null && lb != null && la !== lb) best = la < lb ? "A" : "B";
  else if (la != null && lb == null) best = "A";
  else if (lb != null && la == null) best = "B";

  let verdict;
  if (la == null && lb == null)
    verdict =
      "Nijedna kampanja nije donela upit. Klikove ste platili, a posla nema.";
  else if (la == null || lb == null) {
    const dead = la == null ? "A" : "B";
    verdict = `Kampanja ${dead} nema nijedan upit, pa je najskuplja u nalogu, koliko god joj klik bio jeftin.`;
  } else if (la === lb) verdict = "Obe kampanje plaćaju upit isto.";
  else {
    const w = best === "A" ? a : b;
    const o = best === "A" ? b : a;
    verdict =
      w.cpc > o.cpc
        ? `Kampanja ${best} ima skuplji klik, a jeftiniji upit. Po ceni upita ona je bolja.`
        : `Kampanja ${best} je jeftinija i po kliku i po upitu.`;
  }

  // a campaign without enquiries is drawn as the full bar, in the warning colour
  const top = Math.max(la ?? 0, lb ?? 0) || 1;
  return (
    <MotionConfig reducedMotion="user">
      <motion.div ref={ref} className={s.enq} {...rise}>
        <div className={s.enqHead}>
          <span className={s.label}>Cena po upitu, dve kampanje</span>
          <span className={s.tag}>Primer, unesite svoje brojeve</span>
        </div>
        <div className={s.camps}>
          <Campaign
            name="Kampanja A"
            cpc={a.cpc}
            setCpc={(v) => setA((c) => ({ ...c, cpc: v }))}
            clicks={a.clicks}
            setClicks={(v) => setA((c) => ({ ...c, clicks: v }))}
            perLead={la}
            best={best === "A"}
          />
          <Campaign
            name="Kampanja B"
            cpc={b.cpc}
            setCpc={(v) => setB((c) => ({ ...c, cpc: v }))}
            clicks={b.clicks}
            setClicks={(v) => setB((c) => ({ ...c, clicks: v }))}
            perLead={lb}
            best={best === "B"}
          />
        </div>

        <div className={s.pairs}>
          <Pair
            title="Cena klika"
            a={a.cpc}
            b={b.cpc}
            aText={`${a.cpc} din`}
            bText={`${b.cpc} din`}
            seen={seen}
          />
          <Pair
            title="Cena po upitu"
            a={la ?? top * 1.15}
            b={lb ?? top * 1.15}
            aText={la == null ? "bez upita" : `${fmt(la)} din`}
            bText={lb == null ? "bez upita" : `${fmt(lb)} din`}
            warnA={la == null}
            warnB={lb == null}
            seen={seen}
          />
        </div>

        <div className={s.formula}>
          <span>cena klika</span>
          <i>×</i>
          <span>klikova do upita</span>
          <i>=</i>
          <b>cena po upitu</b>
        </div>
        <p className={s.enqVerdict} aria-live="polite">
          {verdict}
        </p>
      </motion.div>
    </MotionConfig>
  );
}

export const PIECES = {
  "ads-auction": Auction,
  "ads-lokacija": Location,
  "ads-upit": Enquiry,
};
