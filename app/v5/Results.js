"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { ArrowUpRight, Check, Sparkle } from "./icons";
import r from "./results.module.css";
import {
  Counter,
  EASE,
  Honest,
  Reveal,
  SectionHead,
  Segmented,
  useVisible,
} from "./ui";

const pick = (clients, re) => clients.find((c) => re.test(c.name));

function ClientHead({ c, sub, dark = false }) {
  return (
    <div className={`${r.clientHead} ${dark ? r.clientHeadDark : ""}`}>
      {c.logo
        ? <span className={r.clientLogo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt="" />
          </span>
        : null}
      <span>
        <b>{c.name}</b>
        <span>{sub ?? c.category}</span>
      </span>
      <a
        className={r.open}
        href={c.href}
        aria-label={`Studija slučaja: ${c.name}`}
      >
        <ArrowUpRight size={15} />
      </a>
    </div>
  );
}

/* ── ElektroMil: the site overtakes referrals ─────────────────────────── */
const MONTHS = [
  { key: "0", label: "Pre", site: 0, note: null },
  { key: "1", label: "1. mesec", site: 24, note: "Prvi pozivi sa pretrage" },
  { key: "2", label: "2. mesec", site: 47, note: null },
  { key: "3", label: "3. mesec", site: 76, note: "Najveći izvor upita" },
];

function Overtake({ c }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.4);
  const [m, setM] = useState("0");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!visible || touched) return;
    const t = setTimeout(
      () => setM((v) => String((Number(v) + 1) % MONTHS.length)),
      m === "3" ? 4200 : 1700,
    );
    return () => clearTimeout(t);
  }, [visible, touched, m]);

  const cur = MONTHS[Number(m)];
  const ref0 = 58;
  const lead = cur.site > ref0;

  return (
    <article ref={ref} className={`${r.card} ${r.cardBlue}`}>
      <ClientHead c={c} sub="Električar · Niš" />
      <h3 className={r.cardTitle}>Sajt je prestigao preporuke</h3>
      <p className={r.cardBody}>
        Više od deset godina posla samo od usta do usta, i nula prisustva na
        internetu. Sajt i lokalni SEO smo postavili od nule.
      </p>

      <div className={r.chart}>
        <div className={r.chartTop}>
          <span className={r.chartLabel}>Odakle dolaze novi klijenti</span>
          <Segmented
            id="overtake"
            label="Mesec"
            options={MONTHS.map((x) => ({ key: x.key, label: x.label }))}
            value={m}
            onChange={(k) => {
              setTouched(true);
              setM(k);
            }}
          />
        </div>
        <div className={r.lanes}>
          <div className={r.lane}>
            <span>Preporuke</span>
            <span className={r.track}>
              <motion.i
                className={r.fillRef}
                initial={{ width: 0 }}
                animate={{ width: visible ? `${ref0}%` : 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </span>
          </div>
          <div className={r.lane}>
            <span>Sajt i pretraga</span>
            <span className={r.track}>
              <motion.i
                className={r.fillSite}
                initial={{ width: 0 }}
                animate={{ width: visible ? `${cur.site}%` : 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              />
              <AnimatePresence>
                {cur.note
                  ? <motion.em
                      key={cur.key}
                      className={`${r.pin} ${lead ? r.pinLead : ""}`}
                      style={{ left: `min(${cur.site}%, calc(100% - 150px))` }}
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.5 }}
                    >
                      {lead ? <Check size={11} strokeWidth={3} /> : null}{" "}
                      {cur.note}
                    </motion.em>
                  : null}
              </AnimatePresence>
            </span>
          </div>
        </div>
        <p className={b.source}>
          Šematski prikaz. Studija beleži prve pozive u 1. i prvo mesto među
          izvorima u 3. mesecu, ne apsolutne brojeve.
        </p>
      </div>

      <div className={r.tiles}>
        {c.metrics.slice(0, 2).map((x) => (
          <div key={x.label} className={r.tileWhite}>
            <b>
              <Counter metric={x} run={visible} />
            </b>
            <span>{x.label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

/* ── Moler Niš / Servis Klime Niš: two local sites, PageSpeed 100 ──────── */
const LOCAL = {
  moler: {
    re: /moler/i,
    title: "Jedanaest godina rada, nula redova na internetu",
    body: "Svaki klijent je stizao preko preporuke. Šest usluga su šest različitih pretraga, pa je svaka dobila svoju stranicu.",
    chips: [
      "Krečenje",
      "Gletovanje",
      "Fasada",
      "Dekorativni premazi",
      "Tapete",
      "Sanacija vlage",
    ],
    insight:
      "Fiksna cena i besplatan obilazak istaknuti su na svakom koraku, jer je najveći strah neizvesnost oko cene.",
  },
  klima: {
    re: /klim/i,
    title: "Sajt koji ne ćuti van sezone",
    body: "Klima se prodaje dva meseca godišnje. Sadržaj i usluge su postavljeni da rade cele godine, i kad konkurencija ugasi marketing.",
    chips: ["Dijagnostika", "Montaža", "Popravka", "Servis", "Katalog uređaja"],
    insight:
      "Cena je vidljiva pre poziva, na svakoj stranici usluge i u celom katalogu, sa montažom uračunatom u cenu.",
  },
};

function SpeedRing({ value, run }) {
  const rad = 44;
  const circ = 2 * Math.PI * rad;
  return (
    <div className={r.speed}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={rad} className={r.speedTrack} />
        <motion.circle
          cx="50"
          cy="50"
          r={rad}
          className={r.speedBar}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: run ? circ * (1 - value / 100) : circ }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </svg>
      <span>
        <b>
          <Counter metric={{ num: value, decimals: 0, suffix: "" }} run={run} />
        </b>
        <em>
          PageSpeed
          <br />
          na telefonu
        </em>
      </span>
    </div>
  );
}

function LocalSites({ clients }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.4);
  const tabs = Object.entries(LOCAL)
    .map(([key, v]) => ({ key, ...v, c: pick(clients, v.re) }))
    .filter((t) => t.c);
  const [tab, setTab] = useState(tabs[0]?.key);
  const [touched, setTouched] = useState(false);

  const keys = tabs.map((t) => t.key).join("|");
  useEffect(() => {
    const list = keys.split("|");
    if (!visible || touched || list.length < 2) return;
    const t = setTimeout(
      () => setTab((v) => list[(list.indexOf(v) + 1) % list.length]),
      6000,
    );
    return () => clearTimeout(t);
  }, [visible, touched, tab, keys]);

  const cur = tabs.find((t) => t.key === tab);
  if (!cur) return null;
  const speed = cur.c.metrics.find((m) => /pagespeed/i.test(m.label));
  const others = cur.c.metrics.filter((m) => m !== speed);

  return (
    <article ref={ref} className={`${r.card} ${r.cardLime}`}>
      <div className={r.limeTop}>
        <Segmented
          id="local"
          tone="lime"
          label="Projekat"
          options={tabs.map((t) => ({ key: t.key, label: t.c.name }))}
          value={tab}
          onChange={(k) => {
            setTouched(true);
            setTab(k);
          }}
        />
        <a
          className={r.open}
          href={cur.c.href}
          aria-label={`Studija slučaja: ${cur.c.name}`}
        >
          <ArrowUpRight size={15} />
        </a>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur.key}
          className={r.localBody}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className={r.localRow}>
            <div>
              <h3 className={r.cardTitle}>{cur.title}</h3>
              <p className={r.cardBody}>{cur.body}</p>
            </div>
            {speed?.num ? <SpeedRing value={speed.num} run={visible} /> : null}
          </div>
          <div className={r.chips}>
            {cur.chips.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.15 + i * 0.05,
                  duration: 0.4,
                  ease: EASE,
                }}
              >
                {t}
              </motion.span>
            ))}
          </div>
          <p className={r.insight}>
            <Sparkle size={12} /> {cur.insight}
          </p>
          {others.length
            ? <div className={r.tiles}>
                {others.map((x) => (
                  <div
                    key={x.label}
                    className={r.tileWhite}
                    style={
                      others.length === 1 ? { gridColumn: "1 / -1" } : undefined
                    }
                  >
                    <b>
                      <Counter metric={x} run={visible} />
                    </b>
                    <span>{x.label}</span>
                  </div>
                ))}
              </div>
            : null}
        </motion.div>
      </AnimatePresence>
    </article>
  );
}

/* ── ThermiQ: the big dark panel ──────────────────────────────────────── */
// Only the end value is from the case study; the path between is drawn smooth.
const CURVE =
  "M0,150 C40,149 70,146 100,138 C140,126 160,104 200,84 C240,62 262,38 300,16";

function Indexed({ c, run }) {
  const end = c.metrics.find((m) => /indeks/i.test(m.label));
  return (
    <div className={r.indexCard}>
      <div className={r.indexHead}>
        <span>Indeksirane stranice u Google-u</span>
        <Honest dark>Kriva je ilustracija</Honest>
      </div>
      <div className={r.indexChart}>
        <svg
          viewBox="0 0 300 160"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="v5-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.45" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 80, 120].map((y) => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} className={r.grid} />
          ))}
          <motion.path
            d={`${CURVE} L300,160 L0,160 Z`}
            fill="url(#v5-area)"
            initial={{ opacity: 0 }}
            animate={{ opacity: run ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          />
          <motion.path
            d={CURVE}
            className={r.curve}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: run ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </svg>
        <motion.span
          className={r.endPin}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: run ? 1 : 0, scale: run ? 1 : 0.6 }}
          transition={{ delay: 1.3, duration: 0.5, ease: EASE }}
        >
          {end ? <Counter metric={end} run={run} /> : "3.157"}
        </motion.span>
      </div>
      <div className={r.axis}>
        <span>Pre</span>
        <span>1. mesec</span>
        <span>2. mesec</span>
        <span>3. mesec</span>
      </div>
      <div className={r.colorRule}>
        <span>
          <i data-c="red" /> Crvena prati grejanje
        </span>
        <span>
          <i data-c="blue" /> Plava prati hlađenje
        </span>
      </div>
    </div>
  );
}

function Thermiq({ c }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  return (
    <article ref={ref} className={r.dark} data-theme="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" className={r.watermark} aria-hidden="true" />
      <Sparkle
        size={220}
        className={`${b.sparkleMark} ${b.spinSlow} ${r.darkSpark}`}
      />
      <div className={r.darkCopy}>
        <ClientHead c={c} sub="Grejanje i klimatizacija · Beograd" dark />
        <h3 className={r.darkTitle}>
          Roba je ista.
          <br />
          <span>Odluka nije.</span>
        </h3>
        <p className={r.darkBody}>
          ThermiQ prodaje isti Bosch, isti Vaillant i istu MDV jedinicu kao
          svaki drugi distributer. Novi identitet, sajt koji nosi hiljade
          proizvoda i SEO postavljen na nivou šablona, pa se primenjuje na ceo
          asortiman odjednom.
        </p>
        <div className={r.darkTiles}>
          {c.metrics.map((x) => (
            <div key={x.label} className={b.tileDark}>
              <b>
                <Counter metric={x} run={visible} />
              </b>
              <span>{x.label}</span>
            </div>
          ))}
        </div>
      </div>
      <Indexed c={c} run={visible} />
    </article>
  );
}

/* ── the real sites, as a row ─────────────────────────────────────────── */
function SitesRow({ clients }) {
  return (
    <div className={r.row}>
      <div className={r.rowHead}>
        <p>Kako to izgleda uživo</p>
        <span className={b.source}>Pravi sajtovi naših klijenata</span>
      </div>
      <div className={r.rowTrack}>
        {clients.map((c, i) => (
          <Reveal key={c.slug} i={i} className={r.site}>
            <a href={c.href}>
              <span className={r.siteImg}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cover} alt={`Sajt za ${c.name}`} loading="lazy" />
              </span>
              <span className={r.siteMeta}>
                <b>{c.name}</b>
                <span>{c.category}</span>
                <ArrowUpRight size={15} />
              </span>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Results({ clients }) {
  const elektro = pick(clients, /elektro/i);
  const thermiq = pick(clients, /thermiq/i);

  return (
    <section className={b.section} data-theme="light">
      <div className={b.container}>
        <SectionHead
          id="rezultati"
          kicker="Rezultati"
          title="Rezultati koje možete sami da proverite"
          intro="Svaki broj ispod je iz naših studija slučaja. Sajtove možete da otvorite, a brzinu svakog da izmerite u alatu na vrhu stranice."
        />
        <div className={r.pair}>
          {elektro ? <Overtake c={elektro} /> : null}
          <LocalSites clients={clients} />
        </div>
        {thermiq ? <Thermiq c={thermiq} /> : null}
        <SitesRow clients={clients} />
      </div>
    </section>
  );
}
