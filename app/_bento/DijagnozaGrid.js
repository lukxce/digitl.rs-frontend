"use client";

import Image from "next/image";
import locationIcon from "../assets/location.svg";
import memojiPng from "../assets/memoji.png";
import World, { CITIES } from "./World";
import stripeSvg from "../assets/stripe.svg";
import elektromilLogo from "../assets/elektromil-logo.webp";
import primaDentalLogo from "../assets/primadental logo.webp";
import startupsLogo from "../assets/startups.rs logo.webp";
import thermiqLogo from "../assets/thermiq logo.webp";
import { useEffect, useRef, useState } from "react";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "../components/serviceIcons";
import { IconInstagram, IconLinkedin, IconX } from "../components/socialIcons";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  formatDate,
  useHorizontalScroll,
} from "./kit";
import s from "./dijagnoza.module.css";

/**
 * digitl.rs homepage concept: a short diagnostic instead of a brochure.
 *
 * Three questions decide which services are recommended; everything after
 * reacts. Type scale and card radii follow the lukxce badge grid, and the
 * small tiles are scattered into whatever vertical slack a column leaves
 * rather than clustered in one chapter.
 */

const SERVICE_LIST = [
  {
    id: "ads",
    Icon: IconProduct,
    name: "Plaćeno oglašavanje",
    role: "Saobraćaj danas.",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    feeds: "Hrani web upitima, a SEO podacima o tome šta ljudi stvarno traže.",
  },
  {
    id: "seo",
    Icon: IconStrategy,
    name: "SEO",
    role: "Saobraćaj koji ne plaćate.",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    feeds: "Snižava cenu plaćenog klika i drži upite kad se kampanja ugasi.",
  },
  {
    id: "web",
    Icon: IconWeb,
    name: "Web",
    role: "Poseta postaje upit.",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    feeds: "Bez njega svaki drugi kanal plaća za posetu koja ne postane poziv.",
  },
  {
    id: "social",
    Icon: IconMotion,
    name: "Društvene mreže",
    role: "Prisutnost između kupovina.",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    feeds: "Čini da vas kupac prepozna kad vas nađe u pretrazi ili oglasu.",
  },
  {
    id: "brand",
    Icon: IconBrand,
    name: "Brend",
    role: "Sve ostalo košta manje.",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    feeds: "Isti oglas, ista pozicija, veći procenat klikova. To je brend.",
  },
];

const SERVICES = Object.fromEntries(SERVICE_LIST.map((x) => [x.id, x]));

const QUIZ = [
  {
    id: "izvor",
    q: "Odakle vam danas stižu klijenti?",
    options: [
      {
        id: "preporuka",
        label: "Preporuka",
        w: { seo: 3, ads: 2, web: 2 },
        match: "moler-nis",
        gap: "Preporuka ima plafon. Radi dok se krug poznanstava ne iscrpi.",
      },
      {
        id: "placeno",
        label: "Plaćeni oglasi",
        w: { seo: 3, brand: 2 },
        match: "thermiq",
        gap: "Plaćeno radi dok plaćate. Bez organskog, cena upita raste svake godine.",
      },
      {
        id: "organski",
        label: "Google, organski",
        w: { ads: 3, social: 2 },
        match: "servis-klime-nis",
        gap: "Organski donosi, ali nema ručicu kad vam treba više upita ovog meseca.",
      },
      {
        id: "mreze",
        label: "Društvene mreže",
        w: { seo: 3, web: 2 },
        match: "thermiq",
        gap: "Mreže grade poznatost, ne nameru. Kupac spreman da kupi pretražuje.",
      },
      {
        id: "nista",
        label: "Ne merimo",
        w: { web: 3, seo: 2, ads: 2 },
        match: "elektromil",
        gap: "Bez merenja je svaka odluka o budžetu nagađanje. To je prvi problem.",
      },
    ],
  },
  {
    id: "sajt",
    q: "Kakav vam je sajt?",
    options: [
      { id: "nemamo", label: "Nemamo ga", w: { web: 4, brand: 2 } },
      { id: "star", label: "Star je i spor", w: { web: 3, seo: 1 } },
      { id: "ok", label: "Solidan, ali bez upita", w: { web: 2, ads: 1 } },
      { id: "dobar", label: "Zadovoljni smo", w: { ads: 1, seo: 1 } },
    ],
  },
  {
    id: "cilj",
    q: "Šta vam treba za šest meseci?",
    options: [
      { id: "brzo", label: "Upiti što pre", w: { ads: 4, web: 2 } },
      {
        id: "stabilno",
        label: "Priliv bez plaćanja klikova",
        w: { seo: 4, web: 1 },
      },
      {
        id: "poznatost",
        label: "Da nas prepoznaju",
        w: { brand: 4, social: 3 },
      },
      {
        id: "sve",
        label: "Sve, ne znam odakle",
        w: { web: 2, seo: 2, ads: 2, brand: 1 },
      },
    ],
  },
];

const STEPS = [
  ["Razumevanje", "Biznis, ciljevi i dosadašnji brojevi."],
  ["Planiranje", "Prioriteti, kanali i plan rasta."],
  ["Lansiranje", "Pokrećemo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Izveštaji i odluke o sledećem koraku."],
];

/* The hero on the live site carries this claim; here it gets its own tile. */
const PROOF = { count: "50+", label: "uspešnih saradnji" };
const OPEN_SLOTS = 2;

/* Heights are the ones the site's own carousel uses, so each mark keeps
   its intended size instead of being squashed to a common box. */
const CLIENT_LOGOS = [
  { src: primaDentalLogo, alt: "Prima Dental", height: 72 },
  { src: thermiqLogo, alt: "ThermiQ", height: 58 },
  { src: elektromilLogo, alt: "ElektroMil", height: 30 },
  { src: startupsLogo, alt: "startups.rs", height: 44 },
];

const SOCIALS = [
  {
    id: "ig",
    Icon: IconInstagram,
    handle: "@digitl.rs",
    href: "https://www.instagram.com/digitl.rs",
  },
  {
    id: "li",
    Icon: IconLinkedin,
    handle: "digitl",
    href: "https://www.linkedin.com/company/digitl-rs",
  },
  {
    id: "x",
    Icon: IconX,
    handle: "@digitl_rs",
    href: "https://x.com/digitl_rs",
  },
];

/* ── primitives ──────────────────────────────────────────── */

function Chapter({ n, title, width, children }) {
  return (
    <section className={s.chapter} style={width ? { "--w": width } : undefined}>
      <header className={s.chapterHead}>
        <span className={s.chapterNum} data-n>
          {n}
        </span>
        <span className={s.chapterTitle} data-title>
          {title}
        </span>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

function CountUp({ value, run }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const m = String(value).match(/^([\d.,]+)(.*)$/);
    if (
      !run ||
      !m ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(value);
      return;
    }
    const target = Number.parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (Number.isNaN(target)) return setShown(value);
    const isInt = !m[1].includes(",");
    const t0 = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 800);
      const n = target * (1 - (1 - p) ** 3);
      setShown(
        `${isInt ? Math.round(n).toLocaleString("sr-RS") : n.toFixed(1).replace(".", ",")}${m[2]}`,
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run]);
  return <>{shown}</>;
}

function useStored(key, initial) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setV(saved);
    } catch {
      // Blocked storage just means the default sticks for this visit.
    }
  }, [key]);
  const set = (next) => {
    setV(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      // Not persisting is fine.
    }
  };
  return [v, set];
}

/* ── scattered filler tiles ──────────────────────────────── */

const CITIES_LIST = [
  ["Beograd", "Europe/Belgrade"],
  ["London", "Europe/London"],
];

function readClock(zone) {
  const p = new Intl.DateTimeFormat("en-GB", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t) => p.find((x) => x.type === t)?.value ?? "";
  return { hh: g("hour"), mm: g("minute"), h: Number(g("hour")) };
}

const PINS = [CITIES.belgrade, CITIES.london];

function useWeather() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const abort = new AbortController();
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=44.7866&longitude=20.4489&current=temperature_2m&timezone=Europe%2FBelgrade",
      { signal: abort.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("weather"))))
      .then((d) => {
        const temp = d?.current?.temperature_2m;
        if (typeof temp === "number") setWeather(Math.round(temp));
      })
      .catch(() => {
        // No weather line is better than a wrong one.
      });
    return () => abort.abort();
  }, []);
  return weather;
}

function ClockTile() {
  const [now, setNow] = useState(null);
  const temp = useWeather();
  useEffect(() => {
    const read = () => setNow(CITIES_LIST.map(([, zone]) => readClock(zone)));
    read();
    const id = setInterval(read, 15_000);
    return () => clearInterval(id);
  }, []);
  const h = now?.[0].h;
  const line =
    h == null
      ? ""
      : h < 8
        ? "Prerano. Kampanje rade."
        : h < 17
          ? "Radimo. Javite se."
          : h < 22
            ? "Još gledamo izveštaje."
            : "Spavamo. Google Ads ne.";
  return (
    <article className={`${s.card} ${s.clockCard}`}>
      <span className={s.eyebrow}>Beograd · London</span>
      <span className={s.weather}>
        {temp == null ? line : `${temp}° u Beogradu · ${line}`}
      </span>
      <span className={s.globe} aria-hidden>
        <World mode="globe" pins={PINS} className={s.globeCanvas} />
      </span>
      <span className={s.cityRow}>
        {CITIES_LIST.map(([city], i) => (
          <span key={city} className={s.city}>
            <span className={s.cityTime} suppressHydrationWarning>
              {now ? now[i].hh : "--"}
              <span className={s.colon}>:</span>
              {now ? now[i].mm : "--"}
            </span>
            <span className={s.cityName}>{city}</span>
          </span>
        ))}
      </span>
    </article>
  );
}

function ClientsTile() {
  // Two identical runs, translated -50%, so the loop has no seam.
  const run = (key) =>
    CLIENT_LOGOS.map((l) => (
      <span key={`${key}-${l.alt}`} className={s.logoItem}>
        <Image
          src={l.src}
          alt={l.alt}
          height={l.height}
          width={200}
          style={{ height: `${l.height}px`, width: "auto" }}
          unoptimized
        />
      </span>
    ));

  return (
    <article className={`${s.card} ${s.clientsCard}`}>
      <span className={s.eyebrow}>Radili smo sa</span>
      <div className={s.marquee}>
        <div className={s.marqueeTrack}>
          {run("a")}
          {run("b")}
        </div>
      </div>
    </article>
  );
}

/* Rotates through the case studies' own takeaways. Real lessons, not a
   manifesto. */
function LessonsTile({ lessons }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (lessons.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % lessons.length), 6000);
    return () => clearInterval(id);
  }, [lessons.length]);
  if (lessons.length === 0) return null;
  const l = lessons[i];
  return (
    <article className={`${s.card} ${s.lessons}`}>
      <span className={s.faqTop}>
        <span className={s.eyebrow}>Naučeno na projektima</span>
        <span className={s.eyebrow}>
          {i + 1} / {lessons.length}
        </span>
      </span>
      <p className={s.lessonText} key={l.text}>
        {l.text}
      </p>
      <a className={s.lessonClient} href={l.href}>
        {l.client} <ArrowIcon size={11} />
      </a>
    </article>
  );
}

function Stars() {
  return (
    <span className={s.stars} aria-hidden>
      {[0, 1, 2, 3, 4].map((k) => (
        <svg
          key={k}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z"
          />
        </svg>
      ))}
    </span>
  );
}

function ProofTile() {
  return (
    <article className={`${s.card} ${s.mini}`}>
      <Stars />
      <span className={s.miniValue}>{PROOF.count}</span>
      <span className={s.muted}>{PROOF.label}</span>
    </article>
  );
}

/* ── extras: interactive cards, parked at the end of the track ── */

const NECE_SE_CUTI = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
  "omnichannel",
];

const BINGO = [
  "Bićete prvi na Google-u",
  "Ovo će biti viralno",
  "Treba nam veći budžet",
  "Algoritam se promenio",
  "Radimo 360°",
  "Gradimo awareness",
  "Rezultati za 6 meseci",
  "Konkurencija ulaže više",
  "Treba vam rebrand",
];

/** Live PageSpeed score for whatever domain the visitor types. */
function SpeedCard() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState("idle");
  const [result, setResult] = useState(null);

  async function run(e) {
    e.preventDefault();
    const clean = url.trim().replace(/^https?:\/\//, "");
    if (!/^[^\s.]+\.[^\s.]{2,}/.test(clean)) return setState("invalid");
    setState("running");
    setResult(null);
    try {
      const res = await fetch(
        "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" +
          encodeURIComponent(`https://${clean}`) +
          "&strategy=mobile&category=performance",
      );
      const data = await res.json();
      const score = data?.lighthouseResult?.categories?.performance?.score;
      if (typeof score !== "number") throw new Error("no score");
      setResult({
        score: Math.round(score * 100),
        shot: data?.lighthouseResult?.audits?.["final-screenshot"]?.details
          ?.data,
        host: clean,
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Isti test koji Google koristi za rangiranje na mobilnom.",
    invalid: "Upišite domen, npr. vasafirma.rs",
    running: "Google meri… zna da potraje 20-ak sekundi.",
    done: null,
    error: "Nije prošlo. Google ponekad odbije test, probajte ponovo.",
  }[state];

  const band =
    result == null
      ? ""
      : result.score >= 90
        ? "Odlično."
        : result.score >= 50
          ? "Ima šta da se popravi."
          : "Ovo vas košta kupaca.";

  return (
    <article className={`${s.card} ${s.speedCard}`}>
      <span className={s.eyebrow}>Koliko je brz vaš sajt</span>
      <form className={s.speedForm} onSubmit={run}>
        <input
          className={s.subInput}
          placeholder="vasafirma.rs"
          aria-label="Vaš domen"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setState("idle");
          }}
        />
        <button
          className={s.subSend}
          type="submit"
          disabled={state === "running"}
          aria-label="Izmeri"
        >
          <ArrowIcon size={14} />
        </button>
      </form>

      <div className={s.speedBody}>
        {state === "running"
          ? <span className={s.speedSpinner} aria-hidden />
          : null}
        {result
          ? <>
              <span
                className={s.speedScore}
                data-band={
                  result.score >= 90
                    ? "good"
                    : result.score >= 50
                      ? "ok"
                      : "bad"
                }
              >
                <CountUp value={String(result.score)} run />
              </span>
              <span className={s.muted}>
                {result.host} · {band}
              </span>
              {result.shot
                ? <img className={s.speedShot} src={result.shot} alt="" />
                : null}
            </>
          : null}
      </div>

      <span className={s.speedFoot}>
        <span className={s.muted}>Sajtovi koje pravimo: 100 / 100</span>
        <a className={s.lessonClient} href="#kontakt">
          Popravite ovo <ArrowIcon size={11} />
        </a>
      </span>
      {note ? <p className={s.note}>{note}</p> : null}
    </article>
  );
}

/* All six struck through, one lit at a time. Beat the translator because
   the joke lands without the visitor having to click anything. */
function BuzzCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % NECE_SE_CUTI.length),
      2000,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <article className={`${s.card} ${s.jargonCard}`}>
      <span className={s.eyebrowOnDark}>Nećete čuti od nas</span>
      <ul className={s.buzzList}>
        {NECE_SE_CUTI.map((word, k) => (
          <li
            key={word}
            className={`${s.buzzItem} ${k === i ? s.buzzItemOn : ""}`}
          >
            {word}
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Their numbers, their arithmetic. We claim nothing about ourselves. */
function CostCard() {
  const [budget, setBudget] = useState("80000");
  const [leads, setLeads] = useState("12");
  const b = Number(budget.replace(/\D/g, "")) || 0;
  const l = Number(leads.replace(/\D/g, "")) || 0;
  const per = l > 0 ? Math.round(b / l) : null;
  const saved = per != null ? Math.round(b * 12 * 0.2) : null;
  const fmt = (n) => n.toLocaleString("sr-RS");

  return (
    <article className={`${s.card} ${s.costCard}`}>
      <span className={s.eyebrow}>Vaš trošak po upitu</span>
      <div className={s.costFields}>
        <label className={s.costField}>
          <span className={s.muted}>Budžet / mesec</span>
          <input
            className={s.field}
            inputMode="numeric"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </label>
        <label className={s.costField}>
          <span className={s.muted}>Upita / mesec</span>
          <input
            className={s.field}
            inputMode="numeric"
            value={leads}
            onChange={(e) => setLeads(e.target.value)}
          />
        </label>
      </div>
      <span className={s.costOut}>
        {per == null ? "—" : `${fmt(per)} din`}
        <span className={s.muted}>po jednom upitu</span>
      </span>
      {saved != null && saved > 0
        ? <span className={s.costNote}>
            20% bolje = <strong>{fmt(saved)} din</strong> godišnje
          </span>
        : null}
    </article>
  );
}

function BingoCard() {
  const [hit, setHit] = useState([]);
  const toggle = (i) =>
    setHit((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]));
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const bingo = lines.some((line) => line.every((i) => hit.includes(i)));
  return (
    <article className={`${s.card} ${s.bingoCard}`}>
      <span className={s.eyebrow}>Jeste li ovo čuli?</span>
      <div className={s.bingoGrid}>
        {BINGO.map((phrase, i) => (
          <button
            key={phrase}
            type="button"
            className={`${s.bingoCell} ${hit.includes(i) ? s.bingoOn : ""}`}
            onClick={() => toggle(i)}
          >
            {phrase}
          </button>
        ))}
      </div>
      <span className={s.bingoFoot}>
        {bingo
          ? <strong>Bingo. Znamo — zato ste ovde.</strong>
          : "Kliknite ono što vam je neko već obećao."}
      </span>
    </article>
  );
}

/** Guess the score of a site we built, then see the real one. */
function GuessCard({ client, value, label }) {
  const [guess, setGuess] = useState(50);
  const [shown, setShown] = useState(false);
  const real = Number(value);
  const off = Math.abs(real - guess);
  return (
    <article className={`${s.card} ${s.guessCard}`}>
      <span className={s.eyebrow}>Pogodite rezultat</span>
      <p className={s.guessQ}>
        <strong>{client}</strong> — koliko mislite da ima?
        <span className={s.muted}>{label}</span>
      </p>
      <input
        className={s.guessRange}
        type="range"
        min="0"
        max="100"
        value={shown ? real : guess}
        disabled={shown}
        onChange={(e) => setGuess(Number(e.target.value))}
        aria-label="Vaša procena"
      />
      <span className={s.guessRow}>
        <span className={s.guessValue}>{shown ? real : guess}</span>
        {shown
          ? <span className={s.muted}>
              {off === 0 ? "Tačno u centar." : `Promašili ste za ${off}.`}
            </span>
          : <button
              type="button"
              className={s.chip}
              onClick={() => setShown(true)}
            >
              Otkrijte
            </button>}
      </span>
    </article>
  );
}

/** A real starting point, and what we actually did about it. */
function ScenarioCard({ items }) {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  const it = items[i];
  const next = () => {
    setOpen(false);
    setI((v) => (v + 1) % items.length);
  };
  return (
    <article className={`${s.card} ${s.scenarioCard}`}>
      <span className={s.faqTop}>
        <span className={s.eyebrow}>Šta biste uradili</span>
        <span className={s.eyebrow}>
          {i + 1} / {items.length}
        </span>
      </span>
      <p className={s.scenarioText} key={it.before}>
        {open ? it.lesson : it.before}
      </p>
      <span className={s.lessonFootRow}>
        <button
          type="button"
          className={s.chip}
          onClick={() => (open ? next() : setOpen(true))}
        >
          {open ? "Sledeći" : "Šta smo uradili"}
        </button>
        <a className={s.lessonClient} href={it.href}>
          {it.client} <ArrowIcon size={11} />
        </a>
      </span>
    </article>
  );
}

function PersonCard() {
  return (
    <article className={`${s.card} ${s.personCard}`}>
      <span className={s.eyebrow}>Na prvom razgovoru</span>
      <Image
        src={memojiPng}
        alt=""
        width={200}
        height={200}
        className={s.personFace}
      />
      <p className={s.personLine}>
        Pričate sa čovekom koji donosi odluke, ne sa account menadžerom.
      </p>
      <a className={s.btnPrimary} href="#kontakt">
        Zakažite
        <span className={s.iconCircle}>
          <ArrowIcon size={12} />
        </span>
      </a>
    </article>
  );
}

/* Desktop only: a pill of chapter numbers that follows the track. */
function ChapterNav({ trackRef }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const secs = [...track.querySelectorAll("section")];
    setItems(
      secs.map((el, i) => ({
        i,
        n: el.querySelector("[data-n]")?.textContent ?? "",
        title: el.querySelector("[data-title]")?.textContent ?? "",
      })),
    );
    // The chapter whose left edge is nearest the track's left edge is the
    // one being read. Cheaper and steadier than an observer.
    const onScroll = () => {
      const x = track.scrollLeft + 40;
      let best = 0;
      let dist = Number.POSITIVE_INFINITY;
      secs.forEach((el, k) => {
        const d = Math.abs(el.offsetLeft - x);
        if (d < dist) {
          dist = d;
          best = k;
        }
      });
      setActive(best);
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [trackRef]);
  if (items.length === 0) return null;
  const go = (i) => {
    const track = trackRef.current;
    const el = track?.querySelectorAll("section")[i];
    if (track && el)
      track.dispatchEvent(
        new CustomEvent("dg:scrollto", { detail: el.offsetLeft - 40 }),
      );
  };
  return (
    <nav className={s.chapterNav} aria-label="Poglavlja">
      {items.map((it) => (
        <button
          key={it.i}
          type="button"
          className={`${s.navDot} ${it.i === active ? s.navDotOn : ""}`}
          onClick={() => go(it.i)}
          aria-label={`${it.n} ${it.title}`}
          aria-current={it.i === active ? "true" : undefined}
        >
          <span className={s.navNum}>{it.n}</span>
          <span className={s.navTitle}>{it.title}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── service sheet ───────────────────────────────────────── */

function ServiceSheet({ id, recommended, onClose }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, onClose]);
  if (!id) return null;
  const sv = SERVICES[id];
  const { Icon } = sv;
  return (
    <div
      className={s.sheetWrap}
      role="dialog"
      aria-modal="true"
      aria-label={sv.name}
    >
      <button
        type="button"
        className={s.sheetBackdrop}
        onClick={onClose}
        aria-label="Zatvori"
      />
      <div className={s.sheet}>
        <div className={s.sheetHead}>
          <span className={s.sheetIcon} aria-hidden>
            <Icon />
          </span>
          <button
            type="button"
            className={s.sheetClose}
            onClick={onClose}
            aria-label="Zatvori"
          >
            ×
          </button>
        </div>
        {recommended
          ? <span className={s.sheetFlag}>Preporučeno za vas</span>
          : null}
        <h2 className={s.sheetTitle}>{sv.name}</h2>
        <p className={s.sheetRole}>{sv.role}</p>
        <p className={s.sheetBody}>{sv.body}</p>
        <div className={s.sheetFeeds}>
          <span className={s.eyebrow}>Kako se vezuje za ostalo</span>
          <p>{sv.feeds}</p>
        </div>
        <a className={s.sheetCta} href="#kontakt" onClick={onClose}>
          Pitajte nas o ovome{" "}
          <span className={s.iconCircle}>
            <ArrowIcon size={12} />
          </span>
        </a>
      </div>
    </div>
  );
}

/* ── case study ──────────────────────────────────────────── */

function CaseCard({ client }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const swipe = useRef(null);
  const slides = [
    { kind: "cover" },
    ...client.after.map((m) => ({ kind: "stat", ...m })),
  ];

  useEffect(() => {
    if (paused || flipped || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4200,
    );
    return () => clearInterval(id);
  }, [paused, flipped, slides.length]);

  const go = (step) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <div className={`${s.flip} ${s.caseFlip} ${flipped ? s.flipped : ""}`}>
      <div className={s.flipInner}>
        <article
          className={`${s.card} ${s.face} ${s.caseCard}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={() => setFlipped(true)}
        >
          <div
            className={s.slidesViewport}
            data-no-drag
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              swipe.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipe.current == null) return;
              const dx = e.clientX - swipe.current;
              swipe.current = null;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
          >
            <div
              className={s.slides}
              style={{ transform: `translateX(${-index * 100}%)` }}
              aria-live="polite"
            >
              {slides.map((sl, i) => (
                <div
                  key={sl.kind + i}
                  className={`${s.slide} ${sl.kind === "stat" ? s.slideStat : ""}`}
                  aria-hidden={i !== index}
                >
                  {sl.kind === "cover"
                    ? client.cover
                      ? <Image
                          src={client.cover}
                          alt={client.clientName}
                          fill
                          sizes="340px"
                          className={s.caseImg}
                        />
                      : null
                    : <>
                        <span className={s.statValue}>
                          <CountUp value={sl.value} run={i === index} />
                        </span>
                        <span className={s.statLabel}>{sl.label}</span>
                      </>}
                </div>
              ))}
            </div>

            {slides.length > 1
              ? <div className={s.slideControls}>
                  <button
                    type="button"
                    className={s.slideBtn}
                    onClick={() => go(-1)}
                    aria-label="Prethodno"
                  >
                    <ArrowIcon size={12} />
                  </button>
                  <div className={s.dotsRow}>
                    {slides.map((sl, i) => (
                      <button
                        key={sl.kind + i}
                        type="button"
                        aria-current={i === index}
                        className={`${s.dot} ${i === index ? s.dotActive : ""}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Slajd ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={s.slideBtn}
                    onClick={() => go(1)}
                    aria-label="Sledeće"
                  >
                    <ArrowIcon size={12} />
                  </button>
                </div>
              : null}
          </div>

          <div className={s.caseFoot}>
            <span className={s.caseText}>
              <span className={s.strong}>{client.clientName}</span>
              <span className={s.muted}>{client.category}</span>
            </span>
            <span className={s.caseHint}>
              Odakle su krenuli <ArrowIcon size={11} />
            </span>
          </div>
        </article>

        <article
          className={`${s.card} ${s.face} ${s.caseBack}`}
          onClick={() => setFlipped(false)}
        >
          <span className={s.faceTag}>Pre</span>
          <p className={s.caseBefore}>{client.before}</p>
          <div className={s.caseBackFoot}>
            <button
              type="button"
              className={s.chipLight}
              onClick={() => setFlipped(false)}
            >
              Nazad
            </button>
            <a className={s.faceLink} href={client.href}>
              Cela priča <ArrowIcon size={11} />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    setState("sending");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Jednom do dva puta mesečno. Bez spama.",
    invalid: "Ta adresa ne izgleda ispravno.",
    sending: "Šaljemo…",
    done: "Prijavljeni ste.",
    error: "Nije uspelo. Pokušajte ponovo.",
  }[state];

  return (
    <article className={`${s.card} ${s.newsletter}`}>
      <span className={s.eyebrow}>Budite u toku</span>
      <p className={s.newsTitle}>Trendovi i taktike, bez buke.</p>
      <form className={s.subForm} onSubmit={submit}>
        <input
          className={s.subInput}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
        <button
          className={s.subSend}
          type="submit"
          disabled={state === "sending"}
          aria-label="Prijavite se"
        >
          <ArrowIcon size={14} />
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
    </article>
  );
}

/* ── contact ─────────────────────────────────────────────── */

function ContactCard({ prefill }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState("idle");

  useEffect(() => {
    if (!touched) setMessage(prefill ? `${prefill} ` : "");
  }, [prefill, touched]);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    if (!message.trim()) return setState("empty");
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email, message }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) {
        setEmail("");
        setMessage("");
        setTouched(false);
      }
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Odgovaramo u roku od jednog radnog dana.",
    invalid: "Ta adresa ne izgleda ispravno.",
    empty: "Napišite nešto. Bilo šta.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo.",
  }[state];

  return (
    <article className={`${s.card} ${s.contact}`} id="kontakt">
      <span className={s.dots} aria-hidden />
      <span className={s.eyebrow}>Vaš red</span>
      <p className={s.contactTitle}>
        {prefill ? "Nastavite rečenicu." : "Gde ste vi sada?"}
      </p>
      <form className={s.contactForm} onSubmit={submit}>
        <input
          className={s.field}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
        <textarea
          className={s.field}
          rows={2}
          placeholder="Na čemu radite?"
          aria-label="Poruka"
          value={message}
          onChange={(e) => {
            setTouched(true);
            setMessage(e.target.value);
            setState("idle");
          }}
        />
        <button className={s.send} type="submit" disabled={state === "sending"}>
          Pošaljite{" "}
          <span className={s.iconCircleBlue}>
            <ArrowIcon size={13} />
          </span>
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
    </article>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function DijagnozaGrid({
  clients = [],
  articles = [],
  testimonials = [],
  lessons = [],
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sheet, setSheet] = useState(null);
  const [device, setDevice] = useStored("dijagnoza-device", "desktop");
  const [theme, setTheme] = useStored("dijagnoza-theme", "auto");
  useHorizontalScroll(trackRef, stageRef);

  const picked = QUIZ.map((q) =>
    q.options.find((o) => o.id === answers[q.id]),
  ).filter(Boolean);
  const done = picked.length === QUIZ.length;
  const scores = {};
  for (const o of picked)
    for (const [k, v] of Object.entries(o.w)) scores[k] = (scores[k] ?? 0) + v;
  const recommended = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
  const first = picked[0] ?? null;
  const matched =
    (first && clients.find((c) => c.slug === first.match)) ??
    clients[0] ??
    null;
  const cases = matched
    ? [matched, ...clients.filter((c) => c.slug !== matched.slug)].slice(0, 2)
    : clients.slice(0, 2);
  const q = QUIZ[step];

  /* A metric of ours that is a bare number is the only kind worth guessing. */
  const guessable = clients
    .flatMap((c) =>
      (c.after ?? []).map((m) => ({ ...m, client: c.clientName })),
    )
    /* Only a 0-100 score is guessable. "6 usluga" is a count, and asking
       someone to guess a count makes the card read like nonsense. */
    .find(
      (m) =>
        /^\d{1,3}$/.test(m.value) &&
        Number(m.value) <= 100 &&
        /pagespeed|ocena|score/i.test(m.label),
    );

  const scenarios = clients
    .filter((c) => c.before && c.takeaways?.length)
    .map((c) => ({
      before: c.before,
      lesson: c.takeaways[0],
      client: c.clientName,
      href: c.href,
    }));

  function answer(qid, oid) {
    setAnswers((a) => ({ ...a, [qid]: oid }));
    // No scroll: the recommendation replaces the quiz inside this same card.
    if (step < QUIZ.length - 1) setStep(step + 1);
  }

  return (
    <div
      className={s.stage}
      ref={stageRef}
      data-bento
      data-device={device}
      data-theme={theme}
    >
      <div className={s.chromeBar}>
        <button
          type="button"
          className={s.chrome}
          onClick={() => setDevice(device === "phone" ? "desktop" : "phone")}
        >
          {device === "phone" ? "Desktop" : "Telefon"}
        </button>
        <button
          type="button"
          className={s.chrome}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Svetlo" : "Tamno"}
        </button>
      </div>

      {/* data-lenis-prevent: the site's smooth scroll otherwise swallows the
          wheel here and the phone frame never scrolls. */}
      <div className={s.viewport} data-lenis-prevent>
        <div className={s.inner}>
          <header className={s.bar}>
            <Image
              src="/digitl-logo.png"
              alt="digitl"
              width={76}
              height={20}
              className={s.logo}
              priority
            />
            {done
              ? <button
                  type="button"
                  className={s.reset}
                  onClick={() => {
                    setAnswers({});
                    setStep(0);
                  }}
                >
                  Ispočetka
                </button>
              : <span className={s.hint}>
                  Prevucite{" "}
                  <span className={s.hintArrow} aria-hidden>
                    <ArrowIcon size={12} />
                  </span>
                </span>}
          </header>

          <div className={s.track} ref={trackRef}>
            {/* 01 ─ badge, in the lukxce shape */}
            <Chapter n="01" title="Digitl" width="398px">
              <article className={`${s.card} ${s.badge}`}>
                <span className={s.lanyard} aria-hidden>
                  <Image
                    src={stripeSvg}
                    alt=""
                    width={63}
                    height={164}
                    className={s.lanyardImg}
                    priority
                    unoptimized
                  />
                </span>
                <span className={s.hole} aria-hidden />

                <div className={s.badgeTop}>
                  <span className={s.avatar} aria-hidden />
                  <span className={s.who}>
                    <span className={s.name}>Digitl</span>
                    <span className={s.muted}>
                      Full-Service marketing agencija
                    </span>
                  </span>
                  <span className={s.available}>
                    <span className={s.pulse} aria-hidden />
                    {OPEN_SLOTS} slobodna mesta
                  </span>
                </div>

                <h1 className={s.headline}>
                  Marketing koji donosi prave rezultate.
                </h1>
                <p className={s.lede}>
                  Gradimo brendove koji se izdvajaju, konvertuju bolje i rastu
                  brže. Sve što vaš biznis traži, na jednom mestu.
                </p>

                <div className={s.heroRow}>
                  <a className={s.btnPrimary} href="#kontakt">
                    Zakaži razgovor
                    <span className={s.iconCircle}>
                      <ArrowIcon size={12} />
                    </span>
                  </a>
                  <a className={s.btnGhost} href="/projects">
                    Naši projekti
                  </a>
                </div>

                <div className={s.badgeBottom}>
                  <p className={s.location}>
                    <Image src={locationIcon} alt="" width={11} height={11} />
                    <span>
                      <strong className={s.locationCity}>
                        Beograd / London
                      </strong>{" "}
                      · Projekti širom sveta
                    </span>
                  </p>
                  <a
                    className={s.enLink}
                    href="https://digitl.me"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    English Website <ArrowIcon size={11} />
                  </a>
                </div>
              </article>
            </Chapter>

            {/* 02 ─ what we do, at a size the card can carry */}
            <Chapter n="02" title="Usluge" width="420px">
              <article className={`${s.card} ${s.allCard}`}>
                <span className={s.eyebrow}>Sve što radimo</span>
                <ul className={s.allList}>
                  {SERVICE_LIST.map((sv) => (
                    <li key={sv.id}>
                      <button
                        type="button"
                        className={s.allRow}
                        onClick={() => setSheet(sv.id)}
                      >
                        <span className={s.allIcon} aria-hidden>
                          <sv.Icon />
                        </span>
                        <span className={s.allText}>
                          <span className={s.allName}>{sv.name}</span>
                          <span className={s.allDesc}>{sv.body}</span>
                        </span>
                        <span className={s.allArrow} aria-hidden>
                          <ArrowIcon size={12} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </Chapter>

            {/* 03 ─ the three questions, and the call that follows them */}
            <Chapter n="03" title="Preporuka" width="360px">
              <div className={s.resultFace} data-anchor="result">
                {done
                  ? <>
                      {recommended.map((id, i) => {
                        const sv = SERVICES[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`${s.rec} ${i === 0 ? s.recTop : ""}`}
                            onClick={() => setSheet(id)}
                          >
                            <span className={s.recIcon} aria-hidden>
                              <sv.Icon />
                            </span>
                            <span className={s.recText}>
                              <span className={s.strong}>{sv.name}</span>
                              <span className={s.muted}>{sv.role}</span>
                            </span>
                            {i === 0
                              ? <span className={s.recBadge}>prvo</span>
                              : null}
                            <span className={s.recArrow} aria-hidden>
                              <ArrowIcon size={11} />
                            </span>
                          </button>
                        );
                      })}
                    </>
                  : <article className={`${s.card} ${s.quiz}`}>
                      <div className={s.quizTop}>
                        <span className={s.eyebrow}>
                          {Math.min(step + 1, QUIZ.length)} / {QUIZ.length}
                        </span>
                        <span className={s.pips} aria-hidden>
                          {QUIZ.map((qq, i) => (
                            <span
                              key={qq.id}
                              className={`${s.pip} ${answers[qq.id] ? s.pipDone : ""} ${i === step && !done ? s.pipNow : ""}`}
                            />
                          ))}
                        </span>
                      </div>
                      <h2 className={s.quizQ} key={q.id}>
                        {q.q}
                      </h2>
                      <div className={s.options}>
                        {q.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            className={s.option}
                            onClick={() => answer(q.id, o.id)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      {step > 0
                        ? <button
                            type="button"
                            className={s.back}
                            onClick={() => setStep(step - 1)}
                          >
                            ← Nazad
                          </button>
                        : null}
                    </article>}
              </div>
              <article className={`${s.card} ${s.book}`}>
                <span className={s.eyebrowLight}>30 minuta, bez obaveze</span>
                <p className={s.bookTitle}>Besplatan prvi razgovor.</p>
                <div className={s.bookRow}>
                  <a
                    className={s.btnLight}
                    href={`mailto:${CONTACT.email}?subject=Zakazivanje razgovora`}
                  >
                    <MailIcon /> Zakažite
                  </a>
                  <a className={s.btnLightGhost} href={`tel:${CONTACT.tel}`}>
                    <PhoneIcon />
                  </a>
                </div>
              </article>
            </Chapter>

            {/* 04 ─ two case studies, stacked */}
            <Chapter n="04" title="Projekti" width="400px">
              {cases.map((c) => (
                <CaseCard key={c.slug} client={c} />
              ))}
              <a href="/projects" className={`${s.card} ${s.allLink}`}>
                Svi projekti{" "}
                <span className={s.iconCircleSm}>
                  <ArrowIcon size={11} />
                </span>
              </a>
            </Chapter>

            {/* 05 ─ who they were, what they said, what it taught us */}
            <Chapter n="05" title="Šta kažu" width="360px">
              {testimonials.length > 0
                ? <article className={`${s.card} ${s.quote}`}>
                    <p className={s.quoteBody}>{testimonials[0].body}</p>
                    <span className={s.quoteWho}>
                      <span className={s.quoteAvatar} aria-hidden>
                        {testimonials[0].name.slice(0, 1)}
                      </span>
                      <span>
                        <span className={s.strong}>{testimonials[0].name}</span>
                        <span className={s.muted}>{testimonials[0].role}</span>
                      </span>
                    </span>
                  </article>
                : <article className={`${s.card} ${s.quoteEmpty}`}>
                    <span className={s.eyebrow}>Prazno namerno</span>
                    <p className={s.quoteBody}>
                      Ovde idu prave preporuke klijenata.
                    </p>
                    <span className={s.muted}>
                      Na sajtu su trenutno šablonske, od ljudi koji nisu vaši
                      klijenti.
                    </span>
                  </article>}
              <ClientsTile />
              <LessonsTile lessons={lessons} />
            </Chapter>

            {/* 06 ─ process */}
            <Chapter n="06" title="Kako radimo" width="400px">
              <article className={`${s.card} ${s.processCard}`}>
                <div className={s.processTop}>
                  <span className={s.processNum} aria-hidden>
                    {STEPS.length}
                  </span>
                  <span className={s.processText}>
                    <span className={s.processTitle}>Kako radimo</span>
                    <span className={s.processNote}>
                      Jedan povezan proces koji drži strategiju, egzekuciju i
                      rezultate u istom pravcu.
                    </span>
                  </span>
                </div>
                <ol className={s.stepList}>
                  {STEPS.map(([title, note], i) => (
                    <li key={title} className={s.stepItem} style={{ "--i": i }}>
                      <span className={s.stepNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={s.stepText}>
                        <span className={s.strong}>{title}</span>
                        <span className={s.muted}>
                          {i === 0 && first
                            ? `Zašto ${first.label.toLowerCase()} više ne nosi sama.`
                            : note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
              <NewsletterCard />
            </Chapter>

            <Chapter n="07" title="Blog" width="310px">
              {articles.slice(0, 3).map((a) => (
                <a
                  key={a.slug}
                  href={`/journal/${a.slug}`}
                  className={`${s.card} ${s.post}`}
                >
                  <span className={s.postTitle}>{a.title}</span>
                  <span className={s.postFoot}>
                    <span className={s.muted}>{formatDate(a.publishedAt)}</span>
                    <span className={s.iconCircleSm}>
                      <ArrowIcon size={11} />
                    </span>
                  </span>
                </a>
              ))}
              <a href="/journal" className={`${s.card} ${s.allLink}`}>
                Svi tekstovi{" "}
                <span className={s.iconCircleSm}>
                  <ArrowIcon size={11} />
                </span>
              </a>
            </Chapter>

            {/* 08 ─ the two bases, and the count that goes with them */}
            <Chapter n="08" title="Gde smo" width="340px">
              <ClockTile />
              <ProofTile />
            </Chapter>

            <Chapter n="09" title="Kontakt" width="360px">
              <ContactCard
                prefill={
                  first
                    ? `Klijenti nam stižu preko: ${first.label.toLowerCase()}.`
                    : ""
                }
              />
              <div className={s.directRow}>
                <a className={s.directLink} href={`mailto:${CONTACT.email}`}>
                  <MailIcon /> {CONTACT.email}
                </a>
                <a className={s.directLink} href={`tel:${CONTACT.tel}`}>
                  <PhoneIcon /> {CONTACT.phone}
                </a>
              </div>

              <div className={s.socialRow}>
                {SOCIALS.map((so) => (
                  <a
                    key={so.id}
                    className={s.social}
                    href={so.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={s.socialIcon} aria-hidden>
                      <so.Icon />
                    </span>
                    <span className={s.socialHandle}>{so.handle}</span>
                  </a>
                ))}
              </div>
            </Chapter>

            {/* ── extras, parked at the end ── */}
            <Chapter n="10" title="Provera" width="400px">
              <SpeedCard />
            </Chapter>

            <Chapter n="11" title="Računica" width="360px">
              <CostCard />
              <BuzzCard />
            </Chapter>

            <Chapter n="12" title="Igra" width="360px">
              <BingoCard />
              {guessable
                ? <GuessCard
                    client={guessable.client}
                    value={guessable.value}
                    label={guessable.label}
                  />
                : null}
            </Chapter>

            <Chapter n="13" title="Ko vodi" width="360px">
              <PersonCard />
              <ScenarioCard items={scenarios} />
            </Chapter>
          </div>
        </div>
      </div>

      <ChapterNav trackRef={trackRef} />

      <ServiceSheet
        id={sheet}
        recommended={sheet ? recommended.includes(sheet) : false}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
