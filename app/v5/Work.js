"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import b from "./base.module.css";
import { ArrowUpRight, Check, X } from "./icons";
import { Bridge, Counter, EASE, Head, Roll, useApp, useVisible } from "./ui";
import w from "./work.module.css";

const find = (clients, re) => clients.find((c) => re.test(c.name));

function CardTop({ c, dark = false, closest = false }) {
  return (
    <span className={`${w.cardTop} ${dark ? w.cardTopDark : ""}`}>
      {c.logo
        ? <span className={w.logo}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt="" />
          </span>
        : null}
      <span className={w.cat}>{c.category}</span>
      {closest ? <span className={w.closest}>Najsličnije vama</span> : null}
      <span className={w.go}>
        <ArrowUpRight size={17} />
      </span>
    </span>
  );
}

/** The client's real site, shown as it is. */
function Shot({ c }) {
  return (
    <span className={w.shot}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.cover} alt={`Sajt za ${c.name}`} loading="lazy" />
    </span>
  );
}

function Stats({ metrics, run, dark = false }) {
  return (
    <span className={`${w.stats} ${dark ? w.statsDark : ""}`}>
      {metrics.map((m) => (
        <span key={m.label}>
          <b>
            <Counter metric={m} run={run} ms={1600} />
          </b>
          <em>{m.label}</em>
        </span>
      ))}
    </span>
  );
}

/* ElektroMil: from referrals only to the site as the top source */
function Elektro({ c, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.35);
  const lesson = c.takeaways?.[0]?.title;
  const steps = [
    ["Pre", "Samo preporuke"],
    ["1. mesec", "Prvi upiti sa pretrage"],
    ["3. mesec", "Najveći izvor upita"],
  ];
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.tBlue} ${closest ? w.isClosest : ""}`}
    >
      <CardTop c={c} closest={closest} />
      <Shot c={c} />
      <span className={w.name}>{c.name}</span>
      <span className={w.sub}>
        Električar iz Niša. Deset godina posla samo na preporuci, nula prisustva
        na internetu.
      </span>
      <span className={w.timeline}>
        <motion.i
          className={w.tlLine}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: run ? 1 : 0 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        />
        {steps.map(([k, v], i) => (
          <motion.span
            key={k}
            className={w.tlStep}
            data-last={i === steps.length - 1 ? "true" : undefined}
            initial={{ opacity: 0, y: 14 }}
            animate={run ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 + i * 0.45, duration: 0.55, ease: EASE }}
          >
            <i />
            <b>{k}</b>
            <em>{v}</em>
          </motion.span>
        ))}
      </span>
      {lesson ? <span className={w.lesson}>„{lesson}“</span> : null}
    </a>
  );
}

/* Moler Niš: six services, six pages */
const MOLER = [
  "Krečenje",
  "Gletovanje",
  "Fasada",
  "Dekorativni premazi",
  "Tapete",
  "Sanacija vlage",
];
function Moler({ c, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.35);
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.tMist} ${closest ? w.isClosest : ""}`}
    >
      <CardTop c={c} closest={closest} />
      <Shot c={c} />
      <span className={w.name}>{c.name}</span>
      <span className={w.sub}>
        Jedanaest godina rada i nijedan red na internetu. Šest usluga su šest
        pretraga, pa je svaka dobila svoju stranicu.
      </span>
      <span className={w.pages}>
        {MOLER.map((p, i) => (
          <motion.span
            key={p}
            className={w.page}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={run ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: EASE }}
          >
            <i />
            <s />
            <s />
            <b>{p}</b>
          </motion.span>
        ))}
      </span>
      <Stats metrics={c.metrics} run={run} />
    </a>
  );
}

/* ThermiQ: every dot is ten indexed pages */
function Thermiq({ c, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.3);
  const indexed = c.metrics.find((m) => /indeks/i.test(m.label));
  const total = indexed?.num ? Math.round(indexed.num / 10) : 316;
  const cols = 32;
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.dark} ${closest ? w.isClosest : ""}`}
    >
      <span className={w.darkCopy}>
        <CardTop c={c} dark closest={closest} />
        <span className={w.nameBig}>{c.name}</span>
        <span className={w.subDark}>
          Distributer grejanja i klimatizacije iz Beograda. Isti Bosch, Vaillant
          i MDV kao kod svih, drugačija odluka.
        </span>
        <Stats metrics={c.metrics} run={run} dark />
        <span className={w.field}>
          <span
            className={w.dots}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: total }, (_, i) => (
              <i
                key={i}
                data-on={run ? "true" : undefined}
                style={{
                  transitionDelay: `${(Math.floor(i / cols) + (i % cols)) * 22}ms`,
                }}
              />
            ))}
          </span>
          <span className={w.fieldNote}>
            Svaka tačka je deset stranica u Google-u.
          </span>
        </span>
      </span>
      <span className={w.thermiqShot}>
        <Shot c={c} />
      </span>
    </a>
  );
}

/* Servis Klime Niš: the price is on the page, not "na upit" */
function Klima({ c, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.35);
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.tLime} ${closest ? w.isClosest : ""}`}
    >
      <CardTop c={c} closest={closest} />
      <Shot c={c} />
      <span className={w.name}>{c.name}</span>
      <span className={w.sub}>
        Kod konkurencije cena ostaje tajna dok serviser ne dođe. Ovde stoji na
        svakoj stranici usluge.
      </span>
      <span className={w.prices}>
        {["Servis klime", "Montaža", "Popravka", "Dijagnostika"].map((s, i) => (
          <span key={s} className={w.priceRow}>
            <span>{s}</span>
            <span className={w.swap}>
              <motion.em
                initial={{ opacity: 1 }}
                animate={{ opacity: run ? 0 : 1 }}
                transition={{ delay: 0.4 + i * 0.25, duration: 0.3 }}
              >
                <X size={11} strokeWidth={3} /> cena na upit
              </motion.em>
              <motion.b
                initial={{ opacity: 0, y: 6 }}
                animate={run ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.55 + i * 0.25,
                  duration: 0.4,
                  ease: EASE,
                }}
              >
                <Check size={11} strokeWidth={3} /> cena na sajtu
              </motion.b>
            </span>
          </span>
        ))}
      </span>
      <Stats metrics={c.metrics} run={run} />
    </a>
  );
}

function AllCases({ clients }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.4);
  return (
    <a ref={ref} href="/projects" className={`${w.card} ${w.ink}`}>
      <span className={w.allNum}>
        <Roll value={run ? 50 : 0} ms={1600} suffix="+" />
      </span>
      <span className={w.allText}>
        uspešnih saradnji, od majstora iz Niša do distributera sa hiljadama
        proizvoda.
      </span>
      <span className={w.allSites}>
        {clients.slice(0, 4).map((c) => (
          <span key={c.slug} className={w.allSite}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.cover} alt="" loading="lazy" />
            <b>{c.name}</b>
          </span>
        ))}
      </span>
      <span className={w.allBtn}>
        Sve studije slučaja <ArrowUpRight size={16} />
      </span>
    </a>
  );
}

export default function Work({ clients }) {
  const { plan } = useApp();
  const elektro = find(clients, /elektro/i);
  const moler = find(clients, /moler/i);
  const thermiq = find(clients, /thermiq/i);
  const klima = find(clients, /klim/i);
  const is = (c) => Boolean(c && plan?.match === c.slug);

  return (
    <section className={`${b.section} ${w.section}`} data-section="Rezultati">
      <div className={b.container}>
        <Head
          id="rezultati"
          label="Da li radi?"
          title="Firme koje već rastu sa nama."
          intro={
            plan?.match
              ? "Svaki broj je iz objavljene studije slučaja. Projekat najsličniji vašem je označen."
              : "Svaki broj je iz objavljene studije slučaja. Sajtove možete da otvorite i izmerite sami."
          }
        />
        <div className={w.grid}>
          {elektro ? <Elektro c={elektro} closest={is(elektro)} /> : null}
          {moler ? <Moler c={moler} closest={is(moler)} /> : null}
          {thermiq ? <Thermiq c={thermiq} closest={is(thermiq)} /> : null}
          {klima ? <Klima c={klima} closest={is(klima)} /> : null}
          <AllCases clients={clients} />
        </div>
      </div>
      <div className={b.container}>
        <Bridge
          text="Brojevi su jedno. Evo šta kažu ljudi sa kojima radimo."
          to="#utisci"
          label="Utisci klijenata"
        />
      </div>
    </section>
  );
}
