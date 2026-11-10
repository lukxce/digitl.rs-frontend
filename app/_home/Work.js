"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { ArrowUpRight, Check, ChevronDown, ChevronUp, X } from "./icons";
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

/** The client's real site, shown whole. */
function Shot({ c }) {
  return (
    <span className={w.shot}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={w.shotImg} src={c.cover} alt={`Sajt za ${c.name}`} />
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

/** A card runs its little animation when it is on screen and in front. */
function useRun(ref, front, amount = 0.3) {
  return useVisible(ref, amount) && front;
}

/* ElektroMil: from referrals only to the site as the top source */
function Elektro({ c, closest, front }) {
  const ref = useRef(null);
  const run = useRun(ref, front);
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
      <Shot c={c} />
      <span className={w.body}>
        <CardTop c={c} closest={closest} />
        <span className={w.name}>{c.name}</span>
        <span className={w.sub}>
          Električar iz Niša. Deset godina posla samo na preporuci, nula
          prisustva na internetu.
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
              transition={{
                delay: 0.3 + i * 0.45,
                duration: 0.55,
                ease: EASE,
              }}
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
function Moler({ c, closest, front }) {
  const ref = useRef(null);
  const run = useRun(ref, front);
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.tMist} ${closest ? w.isClosest : ""}`}
    >
      <Shot c={c} />
      <span className={w.body}>
        <CardTop c={c} closest={closest} />
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
      </span>
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

function Thermiq({ c, closest, front }) {
  const ref = useRef(null);
  const run = useRun(ref, front);
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
      <Shot c={c} />
      <span className={w.body}>
        <CardTop c={c} dark closest={closest} />
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
      </span>
    </a>
  );
}

/* Servis Klime Niš: the price is on the page, not "na upit" */
function Klima({ c, closest, front }) {
  const ref = useRef(null);
  const run = useRun(ref, front);
  return (
    <a
      ref={ref}
      href={c.href}
      className={`${w.card} ${w.tLime} ${closest ? w.isClosest : ""}`}
    >
      <Shot c={c} />
      <span className={w.body}>
        <CardTop c={c} closest={closest} />
        <span className={w.name}>{c.name}</span>
        <span className={w.sub}>
          Kod konkurencije cena ostaje tajna dok serviser ne dođe. Ovde stoji na
          svakoj stranici usluge.
        </span>
        <span className={w.prices}>
          {["Servis klime", "Montaža", "Popravka", "Dijagnostika"].map(
            (s, i) => (
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
            ),
          )}
        </span>
        <Stats metrics={c.metrics} run={run} />
      </span>
    </a>
  );
}

/** Beside the deck: how many there are in all, and the way to them. */
function AllCases({ clients }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.4);
  return (
    <a ref={ref} href="/projects" className={`${w.card} ${w.ink}`}>
      <span className={w.allNum}>
        <Roll value={50} run={run} ms={1600} suffix="+" />
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

const CARDS = [
  { re: /elektro/i, C: Elektro },
  { re: /thermiq/i, C: Thermiq },
  { re: /moler/i, C: Moler },
  { re: /klim/i, C: Klima },
];

// How many cards show behind the front one, and how far each peeks out.
const BEHIND = 2;
const pad = (n) => String(n).padStart(2, "0");

function usePeek() {
  const [peek, setPeek] = useState(22);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 760px)");
    const set = () => setPeek(mq.matches ? 22 : 14);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return peek;
}

/** One card of the deck. `k` is its place: 0 in front, 1 and 2 peeking out
    behind it, the rest waiting at the back; `was` is its place before the
    last move. The card that leaves the front drops away below; one that
    comes back to the front rises from there. */
function Slot({ k, was, n, peek, name, onShow, children }) {
  const shown = k <= BEHIND;
  const y = -k * peek;
  const scale = 1 - k * 0.045;
  const opacity = k === 0 ? 1 : shown ? 1 - k * 0.32 : 0;
  const blur = k === 0 ? 0 : Math.min(k, BEHIND + 1) * 1.6;

  let animate = { y, scale, opacity, filter: `blur(${blur}px)` };
  let times;
  if (was === 0 && k === n - 1 && n > 1) {
    // sent to the back: falls away first, then waits behind the others
    animate = {
      y: [0, 70, y],
      scale: [1, 0.97, scale],
      opacity: [1, 0, 0],
      filter: ["blur(0px)", "blur(0px)", `blur(${blur}px)`],
    };
    times = [0, 0.5, 1];
  } else if (was === n - 1 && k === 0 && n > 1) {
    // called back to the front: comes up from below
    animate = {
      y: [70, 70, 0],
      scale: [0.97, 0.97, 1],
      opacity: [0, 0, 1],
      filter: ["blur(0px)", "blur(0px)", "blur(0px)"],
    };
    times = [0, 0.15, 1];
  }

  return (
    <motion.div
      className={w.slot}
      style={{ zIndex: n - k, transformOrigin: "50% 0%" }}
      initial={false}
      animate={animate}
      transition={{ duration: 0.7, ease: EASE, times }}
      aria-hidden={k !== 0}
      data-front={k === 0 ? "true" : undefined}
    >
      <div className={w.slotInner} inert={k !== 0}>
        {children}
      </div>
      {k !== 0 && shown
        ? <button
            type="button"
            tabIndex={-1}
            className={w.peekBtn}
            onClick={onShow}
            aria-label={`Prikaži: ${name}`}
          />
        : null}
    </motion.div>
  );
}

export default function Work({ clients }) {
  const { plan } = useApp();
  const peek = usePeek();
  const available = CARDS.map((x) => ({ ...x, c: find(clients, x.re) })).filter(
    (x) => x.c,
  );
  // The plan's closest match goes to the front of the deck.
  const match = available.find((x) => x.c.slug === plan?.match);
  const ordered = match
    ? [match, ...available.filter((x) => x !== match)]
    : available;
  const slides = ordered.map(({ C, c }) => ({
    key: c.slug,
    name: c.name,
    render: (front) => (
      <C c={c} closest={plan?.match === c.slug} front={front} />
    ),
  }));
  const n = slides.length;
  // where the deck is, and where it was before the last move
  const [pos, setPos] = useState({ active: 0, prev: 0 });
  const { active, prev } = pos;
  const order = slides.map((s) => s.key).join();
  // a new plan reorders the deck: start again from its front
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on reorder
  useEffect(() => setPos({ active: 0, prev: 0 }), [order]);
  const show = (i) => setPos((p) => ({ active: i, prev: p.active }));
  const go = (d) =>
    setPos((p) => ({ active: (p.active + d + n) % n, prev: p.active }));

  // a sideways swipe on a phone moves the deck; scrolling stays vertical
  const touch = useRef(null);
  const down = (e) => {
    if (e.pointerType !== "mouse") touch.current = [e.clientX, e.clientY];
  };
  const up = (e) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    const dx = e.clientX - t[0];
    const dy = e.clientY - t[1];
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3)
      go(dx < 0 ? 1 : -1);
  };

  return (
    <section className={`${b.section} ${w.section}`} data-section="Rezultati">
      <div className={b.container}>
        <div className={w.top}>
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
          {n > 1
            ? <div className={w.controls}>
                <span className={w.count} aria-live="polite">
                  {pad(active + 1)} <i>/ {pad(n)}</i>
                </span>
                <button
                  type="button"
                  className={w.arrow}
                  onClick={() => go(-1)}
                  aria-label="Prethodni projekat"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  className={w.arrow}
                  onClick={() => go(1)}
                  aria-label="Sledeći projekat"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            : null}
        </div>

        {/* the cases change on the left; all of them are a click away on
            the right */}
        <div className={w.stage}>
          <div
            className={w.deck}
            onPointerDown={down}
            onPointerUp={up}
            onPointerCancel={() => {
              touch.current = null;
            }}
          >
            {slides.map((s, i) => (
              <Slot
                key={s.key}
                k={(i - active + n) % n}
                was={(i - prev + n) % n}
                n={n}
                peek={peek}
                name={s.name}
                onShow={() => show(i)}
              >
                {s.render(i === active)}
              </Slot>
            ))}
          </div>
          <div className={w.side}>
            <AllCases clients={clients} />
          </div>
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
