"use client";

import {
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "../_home/icons";
import { EASE } from "../_home/ui";
import s from "./novi.module.css";
import { Faq, Lines, Reviews, Rise, Shell } from "./Parts";
import { TargetSticker } from "./Stickers";

/* ── the dashboard under the title ───────────────────────────────────────
   A sample report, labelled as one: what a client sees each month. It tilts
   back while it is low on the screen and lies flat as it comes up. */

function Roll({ to, decimals = 0, prefix = "", suffix = "", run }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!run || !ref.current) return;
    const fmt = (v) =>
      prefix +
      v.toLocaleString("sr-Latn-RS", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;
    const c = animate(0, to, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = fmt(v);
      },
    });
    return () => c.stop();
  }, [run, to, decimals, prefix, suffix]);
  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
}

const KPI = [
  { label: "Klikovi", to: 8940, delta: "+24%" },
  { label: "Upiti", to: 386, delta: "+41%" },
  {
    label: "Stopa konverzije",
    to: 4.3,
    decimals: 1,
    suffix: "%",
    delta: "+0,9 p.p.",
  },
  {
    label: "Cena po upitu",
    to: 31,
    prefix: "-",
    suffix: "%",
    delta: "u odnosu na prošli kvartal",
    good: true,
  },
];
const BARS = [
  [34, 14],
  [40, 17],
  [37, 15],
  [48, 21],
  [45, 20],
  [56, 26],
  [52, 24],
  [63, 30],
  [60, 29],
  [72, 36],
  [78, 40],
  [86, 45],
];

function Dashboard() {
  const wrap = useRef(null);
  const inView = useInView(wrap, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start end", "start 0.25"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  return (
    <div className={s.dashPersp}>
      <motion.div
        ref={wrap}
        className={s.dash}
        style={{ rotateX, scale }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.35 }}
        aria-label="Primer mesečnog izveštaja za Google Ads i Meta kampanje"
        role="img"
      >
        <div className={s.dashMain}>
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span>
                <em>Primer izveštaja</em>
                <b>Google Ads · Meta</b>
              </span>
              <span className={s.chip}>Poslednjih 90 dana</span>
            </div>
            <div className={s.kpis}>
              {KPI.map((k) => (
                <div key={k.label} className={s.kpi}>
                  <em>{k.label}</em>
                  <b>
                    <Roll
                      to={k.to}
                      decimals={k.decimals}
                      prefix={k.prefix}
                      suffix={k.suffix}
                      run={inView}
                    />
                  </b>
                  <small data-good={k.good ? "true" : undefined}>
                    {k.delta}
                  </small>
                </div>
              ))}
            </div>
            <div className={s.chartLegend}>
              <span>
                <i data-k="a" /> Klikovi
              </span>
              <span>
                <i data-k="b" /> Upiti
              </span>
            </div>
            <div className={s.bars}>
              {BARS.map(([a, c], i) => (
                <span key={i} className={s.barPair}>
                  <motion.i
                    data-k="a"
                    initial={{ height: 0 }}
                    animate={{ height: inView ? `${a}%` : 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.3 + i * 0.05,
                    }}
                  />
                  <motion.i
                    data-k="b"
                    initial={{ height: 0 }}
                    animate={{ height: inView ? `${c}%` : 0 }}
                    transition={{
                      duration: 0.9,
                      ease: EASE,
                      delay: 0.38 + i * 0.05,
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className={s.panelRow}>
            <div className={s.panel}>
              <b className={s.panelTitle}>Raspodela kanala</b>
              <div className={s.donutRow}>
                <svg
                  viewBox="0 0 120 120"
                  className={s.donut}
                  aria-hidden="true"
                >
                  <circle cx="60" cy="60" r="44" className={s.donutBase} />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="44"
                    className={s.donutA}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: inView ? 0.62 : 0 }}
                    transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
                  />
                </svg>
                <ul className={s.donutKey}>
                  <li>
                    <i data-k="a" /> Google pretraga <b>62%</b>
                  </li>
                  <li>
                    <i data-k="b" /> Meta <b>38%</b>
                  </li>
                </ul>
              </div>
            </div>
            <div className={s.panel}>
              <b className={s.panelTitle}>Cena po upitu</b>
              <span className={s.chipGood}>-31% od optimizacije</span>
              <svg viewBox="0 0 220 70" className={s.cpl} aria-hidden="true">
                <motion.path
                  d="M4 14 C40 16 56 22 80 30 C104 38 120 36 144 46 C168 56 188 56 216 60"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: inView ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.6 }}
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={s.dashSide}>
          <div className={s.panel}>
            <b className={s.panelTitle}>Primeri oglasa</b>
            <div className={s.searchAd}>
              <span className={s.sponsored}>
                <i>Sponzorisano</i> digitl.rs/usluge
              </span>
              <b>Digitl | Marketing koji donosi prave rezultate</b>
              <p>
                Oglasi, SEO, sajt i brend na jednom mestu. Zakažite besplatan
                razgovor.
              </p>
              <span className={s.sitelinks}>
                <i>Plaćeno oglašavanje</i>
                <i>SEO</i>
                <i>Web dizajn</i>
              </span>
            </div>
            <div className={s.metaAd}>
              <span className={s.metaHead}>
                <i className={s.metaAvatar} />
                <span>
                  <b>digitl</b>
                  <em>Sponzorisano</em>
                </span>
              </span>
              <div className={s.metaCreative}>
                <b>Kampanje koje dovode kupce, ne samo klikove.</b>
                <span className={s.metaBtn}>Saznajte više</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className={s.heroService}>
      <h1 className={s.serviceTitle}>
        <span className={s.lineMask}>
          <motion.span
            className={s.lineIn}
            initial={{ y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          >
            Plaćeno oglašavanje{" "}
          </motion.span>
        </span>
        <motion.span
          className={s.titleSticker}
          initial={{ scale: 0, rotate: -50 }}
          animate={{ scale: 1, rotate: 8 }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 13,
            delay: 0.6,
          }}
          whileHover={{ rotate: -6, scale: 1.08 }}
        >
          <TargetSticker size="100%" />
        </motion.span>
      </h1>
      <Dashboard />
      <div className={s.serviceIntro}>
        <Lines
          as="p"
          className={s.serviceLead}
          lines={[
            "Planiramo, pokrećemo i optimizujemo kampanje na Google-u i Meta mrežama koje budžet za oglase pretvaraju u upite i prodaju.",
          ]}
        />
        <Rise as="p" className={s.serviceText}>
          Digitl vodi plaćeno oglašavanje za firme koje od budžeta za oglase
          žele upite i prodaju, ne samo klikove. Svaki nalog počinje
          strategijom: pregledamo ciljeve, dosadašnje kampanje i konkurenciju,
          biramo kanale i delimo budžet. Vodimo Google Ads kampanje u pretrazi i
          Meta oglase na Facebook-u i Instagram-u, a vizuale oglasa i landing
          stranice dizajniraju isti ljudi koji rade vaš brend i sajt. Praćenje
          konverzija postavljamo pre pokretanja, kampanje optimizujemo svake
          nedelje, a svakog meseca dobijate jasan izveštaj o potrošnji, upitima
          i ceni po upitu.
        </Rise>
      </div>
    </section>
  );
}

/* ── what's included: five circles, the one you point at fills in ─────── */

const INCLUDED = [
  {
    title: "Strategija oglašavanja",
    sub: "Ciljevi, publika, budžet",
    text: "Strategija postavljena na vaše ciljeve: publika, pravi kanali, raspodela budžeta i broj koji pratimo, na primer cena po upitu.",
  },
  {
    title: "Google Ads kampanje",
    sub: "Pretraga, ključne reči, tekstovi",
    text: "Kampanje u Google pretrazi sa istraživanjem ključnih reči, tekstovima oglasa, ekstenzijama i licitiranjem koje dovodi ljude spremne da kupe.",
  },
  {
    title: "Meta oglasi",
    sub: "Facebook i Instagram",
    text: "Oglasi na Facebook-u i Instagram-u sa ciljanjem publike, retargetingom i formama za upite koje pune vaš kalendar.",
  },
  {
    title: "Vizuali i landing stranice",
    sub: "Dizajnirani da prodaju",
    text: "Vizuale oglasa i landing stranice dizajniraju isti ljudi koji rade vaš brend, a testiramo ih da rastu klikovi i konverzije.",
  },
  {
    title: "Praćenje i izveštaji",
    sub: "GA4, konverzije, mesečni izveštaj",
    text: "Praćenje konverzija kroz GA4, Google Tag Manager i piksele, i mesečni izveštaj o potrošnji, upitima, ceni po upitu i sledećim koracima.",
  },
];

function Included() {
  const [on, setOn] = useState(1);
  return (
    <section className={s.included} aria-labelledby="ukljuceno">
      <Lines
        as="h2"
        lines={["Šta je uključeno"]}
        className={`${s.display2} ${s.center}`}
      />
      <div className={s.bubbles} onMouseLeave={() => setOn(-1)}>
        {INCLUDED.map((x, i) => (
          <motion.button
            key={x.title}
            type="button"
            className={s.bubble}
            data-pos={i}
            data-on={on === i ? "true" : undefined}
            onMouseEnter={() => setOn(i)}
            onFocus={() => setOn(i)}
            onClick={() => setOn(i)}
            aria-expanded={on === i}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 18,
              delay: i * 0.08,
            }}
          >
            <span className={s.bubbleIn}>
              <b>{x.title}</b>
              <em>({x.sub})</em>
              <span className={s.bubbleText}>{x.text}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ── the process: the page pins and the steps pass sideways ────────────── */

const STEPS = [
  [
    "Pregled i strategija",
    "Dosadašnje kampanje, konkurencija i ciljevi. Dobijate plan kanala i raspodelu budžeta.",
  ],
  [
    "Podešavanje praćenja",
    "GA4, praćenje konverzija i pikseli. Svaki upit i svaka prodaja se mere od prvog dana.",
  ],
  [
    "Izrada kampanja",
    "Ključne reči, publike, tekstovi i vizuali. Pre pokretanja vi odobravate sve.",
  ],
  [
    "Pokretanje i optimizacija",
    "Ponude, ključne reči i vizuali se testiraju svake nedelje. Budžet ide na ono što radi.",
  ],
  [
    "Mesečni izveštaj",
    "Potrošnja, upiti, cena po upitu i sledeći koraci. Tačno vidite šta vaš budžet radi.",
  ],
];
const STEP_TILT = [-3, 2, -1.5, 2.5, -2];

function Process() {
  const ref = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [pin, setPin] = useState(true);
  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const measure = () => {
      setPin(mq.matches);
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist]);
  return (
    <section
      ref={ref}
      className={s.process}
      style={pin ? { height: `calc(100vh + ${dist}px)` } : undefined}
      aria-labelledby="proces"
    >
      <div className={s.processSticky} data-pin={pin ? "true" : undefined}>
        <Lines as="h2" lines={["Kako radimo"]} className={s.display2} />
        <motion.ol
          ref={track}
          className={s.processTrack}
          style={pin ? { x } : undefined}
        >
          {STEPS.map(([t, d], i) => (
            <li
              key={t}
              className={s.stepCard}
              style={{ rotate: `${STEP_TILT[i]}deg` }}
            >
              <span className={s.stepNum}>
                {String(i + 1).padStart(2, "0")}/
              </span>
              <h3 className={s.display4}>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ── projects ─────────────────────────────────────────────────────────── */

const PICKS = [
  {
    slug: "thermiq",
    name: "ThermiQ",
    text: "Brend, sajt za hiljade proizvoda i SEO",
    img: "/novi/thermiq-1.webp",
  },
  {
    slug: "servis-klime-nis",
    name: "Servis Klime Niš",
    text: "Sajt sa cenama na stranicama usluga i lokalni SEO",
    img: "/novi/servis-klime-nis-1.webp",
  },
];

function Picks() {
  return (
    <section className={s.picks} aria-labelledby="projekti">
      <Lines as="h2" lines={["Odabrani projekti"]} className={s.display2} />
      <div className={s.picksGrid}>
        {PICKS.map((p, i) => (
          <Rise key={p.slug} i={i}>
            <a href={`/projects/${p.slug}`} className={s.pick}>
              <span className={s.pickImg}>
                <img src={p.img} alt={`Sajt ${p.name}`} />
              </span>
              <span className={s.pickText}>
                <b className={s.display4}>{p.name}</b>
                <em>{p.text}</em>
              </span>
              <i className={s.pickGo}>
                <ArrowUpRight size={18} />
              </i>
            </a>
          </Rise>
        ))}
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "Na kojim platformama vodite oglase?",
    a: "Na Google Ads-u i na Meta mrežama, odnosno na Facebook-u i Instagram-u. Kanale biramo prema tome gde vaši kupci traže i gde provode vreme.",
  },
  {
    q: "Koliko treba da trošimo na oglase?",
    a: "Zavisi od tržišta, cilja i cene klika u vašoj delatnosti. Početni budžet predlažemo posle pregleda naloga i menjamo ga prema rezultatima.",
  },
  {
    q: "Da li vi pravite vizuale i landing stranice?",
    a: "Da. Vizuale oglasa, kratke video snimke i landing stranice radimo mi, pa se oglas i stranica na koju vodi slažu sa vašim brendom.",
  },
  {
    q: "Kada se vide rezultati?",
    a: "Oglasi daju podatke za dve nedelje, a kampanje u pretrazi dovode posete već u prvim nedeljama. Do stabilne cene po upitu obično treba nekoliko meseci testiranja.",
  },
  {
    q: "Čiji su nalozi za oglase?",
    a: "Vaši. Radimo u vašim nalozima sa pristupom koji nam date, pa svi podaci i istorija kampanja ostaju vašoj firmi.",
  },
];

export default function NoviAds({ fonts }) {
  return (
    <Shell fonts={fonts}>
      <Hero />
      <Included />
      <Process />
      <Picks />
      <Reviews />
      <Faq items={FAQ} />
    </Shell>
  );
}
