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
import s from "./elements.module.css";

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

/* Two sites, one studio: .rs is the Serbian market, .me is everywhere else. */
const SITES = [
  { market: "Srbija", host: "digitl.rs", href: "https://digitl.rs" },
  { market: "Svet", host: "digitl.me", href: "https://digitl.me" },
];

const SERVICE_TAGS = ["Plaćeno", "Web", "SEO", "Social", "Brend"];

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

function StudioCard() {
  return (
    <article className={`${s.card} ${s.digitlCard}`}>
      <span className={s.digitlGlyph} aria-hidden />
      <span className={s.eyebrowOnDark}>Marketing studio</span>
      <span className={s.digitlMark}>
        digitl<span className={s.digitlDot}>.</span>
      </span>
      <span className={s.digitlFoot}>Full-Service marketing agencija</span>
      <div className={s.digitlTags}>
        {SERVICE_TAGS.map((tag) => (
          <span key={tag} className={s.digitlTag}>
            {tag}
          </span>
        ))}
      </div>
      <div className={s.digitlSites}>
        {SITES.map((site) => (
          <a
            key={site.host}
            className={s.digitlSite}
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={s.digitlSiteText}>
              <span className={s.digitlSiteMarket}>{site.market}</span>
              <span className={s.digitlSiteHost}>{site.host}</span>
            </span>
            <ArrowIcon size={14} />
          </a>
        ))}
      </div>
    </article>
  );
}

/* Measures this very page. A slow tile bragging about speed would be worse
   than no tile, so it shows nothing until the number is real. */
function LoadTile() {
  const [secs, setSecs] = useState(null);
  useEffect(() => {
    const read = () => {
      const nav = performance.getEntriesByType("navigation")[0];
      const ms = nav?.domContentLoadedEventEnd || nav?.domInteractive;
      if (ms) setSecs(ms / 1000);
    };
    if (document.readyState === "complete") read();
    else window.addEventListener("load", read, { once: true });
  }, []);
  return (
    <article className={`${s.card} ${s.loadTile}`}>
      <span className={s.eyebrow}>Ova stranica</span>
      <span className={s.loadValue} suppressHydrationWarning>
        {secs == null ? "—" : `${secs.toFixed(1).replace(".", ",")} s`}
      </span>
      <span className={s.muted}>
        do učitavanja. Tako pravimo i sajtove naših klijenata.
      </span>
    </article>
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

/* ── the library ─────────────────────────────────────────── */

/**
 * Every card built for the homepage, including the ones cut from it.
 * Nothing here is live on digitl.rs — this is the parts bin, so a card can
 * be lifted into a page later without rebuilding it from a commit.
 */
export default function ElementsGrid({
  clients = [],
  articles = [],
  lessons = [],
}) {
  const [sheet, setSheet] = useState(null);
  const [theme, setTheme] = useStored("elements-theme", "auto");

  const guessable = clients
    .flatMap((c) =>
      (c.after ?? []).map((m) => ({ ...m, client: c.clientName })),
    )
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

  const ITEMS = [
    {
      id: "studio",
      name: "Studio kartica",
      note: "Crna kartica sa wordmarkom i dva tržišta. Skinuta sa digitl.rs — „marketing studio“ je lukxce-ov jezik.",
      w: 400,
      h: 420,
      el: <StudioCard />,
    },
    {
      id: "speed",
      name: "Provera brzine sajta",
      note: "Ukuca se domen, Google PageSpeed vrati pravi rezultat uživo. Najjača kartica koju smo napravili.",
      w: 380,
      h: 420,
      el: <SpeedCard />,
    },
    {
      id: "buzz",
      name: "Nećete čuti od nas",
      note: "Šest fraza precrtanih, jedna osvetljena. Ovo je pobedilo prevodilac jer ne traži klik.",
      w: 360,
      h: 260,
      el: <BuzzCard />,
    },
    {
      id: "cost",
      name: "Trošak po upitu",
      note: "Njihov budžet i njihov broj upita — čista matematika, bez ijedne tvrdnje o nama.",
      w: 360,
      h: 360,
      el: <CostCard />,
    },
    {
      id: "bingo",
      name: "Bingo obećanja",
      note: "Tabla 3×3 fraza koje su čuli od prethodne agencije. Skupi red i dobiješ poentu.",
      w: 360,
      h: 400,
      el: <BingoCard />,
    },
    {
      id: "clock",
      name: "Globus sa dva grada",
      note: "Beograd i London na dotiranom globusu koji se vrti, sa pravom temperaturom.",
      w: 360,
      h: 300,
      el: <ClockTile />,
    },
    {
      id: "person",
      name: "Ko vodi razgovor",
      note: "Memoji plus rečenica iz pravog FAQ-a o tome sa kim se priča na prvom pozivu.",
      w: 340,
      h: 380,
      el: <PersonCard />,
    },
    {
      id: "guess",
      name: "Pogodite rezultat",
      note: "Klizačem se pogađa pravi broj iz case studyja. Nudi samo metrike koje su ocena 0-100.",
      w: 360,
      h: 260,
      el: guessable
        ? <GuessCard
            client={guessable.client}
            value={guessable.value}
            label={guessable.label}
          />
        : null,
    },
    {
      id: "scenario",
      name: "Šta biste uradili",
      note: "Pravo polazno stanje klijenta, pa otkrivanje šta smo uradili.",
      w: 360,
      h: 260,
      el: <ScenarioCard items={scenarios} />,
    },
    {
      id: "lessons",
      name: "Naučeno na projektima",
      note: "Rotira prave zaključke iz case studyja. Na sajtu je ostao, ali kao filler.",
      w: 340,
      h: 180,
      el: <LessonsTile lessons={lessons} />,
    },
    {
      id: "proof",
      name: "Zvezdice i 50+",
      note: "Tvrdnja sa postojećeg sajta, u malom formatu.",
      w: 220,
      h: 180,
      el: <ProofTile />,
    },
    {
      id: "load",
      name: "Ova stranica",
      note: "Meri sopstveno učitavanje. Ne prikazuje ništa dok broj nije stvaran.",
      w: 340,
      h: 180,
      el: <LoadTile />,
    },
    {
      id: "clients",
      name: "Radili smo sa",
      note: "Logotipi izjednačeni po površini, ne po visini — inače širok wordmark deluje tri puta veći.",
      w: 360,
      h: 190,
      el: <ClientsTile />,
    },
    {
      id: "news",
      name: "Newsletter",
      note: "Prijava koja gađa /api/subscribers.",
      w: 340,
      h: 220,
      el: <NewsletterCard />,
    },
  ].filter((x) => x.el);

  return (
    <div
      className={s.stage}
      data-bento
      data-device="desktop"
      data-theme={theme}
    >
      <div className={s.chromeBar}>
        <button
          type="button"
          className={s.chrome}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "Svetlo" : "Tamno"}
        </button>
      </div>

      <div className={s.viewport} data-lenis-prevent>
        <header className={s.libHead}>
          <h1 className={s.libTitle}>Elementi</h1>
          <p className={s.libLede}>
            Svaka kartica koju smo napravili za digitl.rs, uključujući one koje
            smo skinuli sa sajta. Ništa odavde nije uživo — ovo je kutija sa
            delovima, da se kartica može uzeti kad zatreba.
          </p>
        </header>

        <div className={s.libGrid}>
          {ITEMS.map((item) => (
            <section key={item.id} className={s.libItem} id={item.id}>
              <div
                className={s.libStage}
                style={{ "--lw": `${item.w}px`, "--lh": `${item.h}px` }}
              >
                {item.el}
              </div>
              <h2 className={s.libName}>{item.name}</h2>
              <p className={s.libNote}>{item.note}</p>
            </section>
          ))}
        </div>
      </div>

      <ServiceSheet
        id={sheet}
        recommended={false}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
