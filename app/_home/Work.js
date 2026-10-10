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
      <span className={w.didLight}>
        {["Sajt od nule", "Lokalni SEO", "Pretrage sa kupovnom namerom"].map(
          (d) => (
            <i key={d}>{d}</i>
          ),
        )}
      </span>
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

/* ThermiQ: from invisible in search to a steady stream of visits.
   Numbers from Search Console, 5 Jul to 3 Oct 2026 (the same window as the
   case study at /projects/thermiq): 2.836 clicks, 51.773 impressions, average
   position 7,1 in the last 28 days, 3.157 indexed pages. The little chart is
   the real series: clicks per full week, 6 Jul to 21 Sep (80 → 341). */
const VISITS_PATH =
  "M0.0,76.4 L23.6,77.9 L47.3,63.5 L70.9,61.0 L94.5,45.4 L118.2,40.0 L141.8,35.9 L165.5,25.1 L189.1,37.3 L212.7,33.2 L236.4,12.2 L260.0,12.6";
const VISITS_AREA = `${VISITS_PATH} L260,100 L0,100 Z`;
const DID = [
  "Novi identitet",
  "Sajt za hiljade proizvoda",
  "SEO na nivou šablona",
  "Kalkulator toplotne pumpe",
];

function Thermiq({ c, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.3);
  const visits = { num: 2836, decimals: 0, thousands: true, suffix: "" };
  const small = [
    ["51.773", "prikaza u pretrazi"],
    ["3.157", "stranica u Google-u"],
    ["7,1", "prosečna pozicija"],
  ];
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.dark} ${closest ? w.isClosest : ""}`}
    >
      <CardTop c={c} dark closest={closest} />
      <Shot c={c} />
      <span className={w.nameBig}>{c.name}</span>
      <span className={w.subDark}>
        Od praktično nevidljivog u pretrazi do stalnog toka poseta, za tri
        meseca.
      </span>

      <span className={w.hero}>
        <span className={w.heroNum}>
          <b>
            <Counter metric={visits} run={run} ms={1800} />
          </b>
          <em>poseta iz Google pretrage za tri meseca</em>
        </span>
        <svg
          className={w.spark}
          viewBox="0 0 260 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <motion.path
            d={VISITS_AREA}
            className={w.sparkArea}
            initial={{ opacity: 0 }}
            animate={{ opacity: run ? 1 : 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
          />
          <motion.path
            d={VISITS_PATH}
            className={w.sparkVisits}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: run ? 1 : 0 }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
          />
        </svg>
      </span>
      <span className={w.sparkLegend}>
        <span>
          <i data-k="visits" /> posete iz pretrage po nedeljama, jul do
          septembar
        </span>
      </span>

      <span className={w.smallStats}>
        {small.map(([v, k]) => (
          <span key={k}>
            <b>{v}</b>
            <em>{k}</em>
          </span>
        ))}
      </span>

      <span className={w.did}>
        {DID.map((d) => (
          <i key={d}>{d}</i>
        ))}
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
        Pogledajte sve projekte <ArrowUpRight size={16} />
      </span>
    </a>
  );
}

// Two cases on the page. The plan's closest match takes the first slot.
const CARDS = [
  { re: /elektro/i, C: Elektro },
  { re: /thermiq/i, C: Thermiq },
  { re: /moler/i, C: Moler },
  { re: /klim/i, C: Klima },
];

export default function Work({ clients }) {
  const { plan } = useApp();
  const available = CARDS.map((x) => ({ ...x, c: find(clients, x.re) })).filter(
    (x) => x.c,
  );
  const match = available.find((x) => x.c.slug === plan?.match);
  const picks = match
    ? [match, ...available.filter((x) => x !== match)].slice(0, 2)
    : available.slice(0, 2);

  return (
    <section className={`${b.section} ${w.section}`} data-section="Rezultati">
      <div className={b.container}>
        <Head
          id="rezultati"
          label="Projekti"
          title="Odabrani projekti."
          intro={
            match
              ? "Primeri saradnji i rezultata koje smo ostvarili sa klijentima. Prvi je projekat najsličniji vašem."
              : "Primeri saradnji i rezultata koje smo ostvarili sa klijentima."
          }
        />
        <div className={w.grid}>
          {picks.map(({ C, c }) => (
            <C key={c.slug} c={c} closest={plan?.match === c.slug} />
          ))}
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
