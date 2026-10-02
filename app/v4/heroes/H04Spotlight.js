"use client";

import { useEffect, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h04.module.css";

/* 04 · Reflektor. Behind the headline lies everything we do for a client,
   as a collage of marketing artefacts: ads, results, posts, calls, reviews.
   It sits there grey and quiet; a soft circle of light follows the cursor
   (or wanders on its own, or follows a finger) and shows it in colour. What
   the light touches wakes up and names its service. All artefacts are
   generic examples (vasafirma.rs), never a client's numbers. */

const I = {
  heart: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.4-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.7-7.5 10.1-7.5 10.1Z" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.6Z" />
    </svg>
  ),
  send: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 3-9.6 9.6M21 3l-6.2 18-3.4-8.4L3 9.2 21 3Z" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3.5h12v17l-6-4.2-6 4.2v-17Z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 3.5h2.6l1.4 4.3-2 1.5a12 12 0 0 0 6.1 6.1l1.5-2 4.3 1.4v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8L12 2.8Z" />
    </svg>
  ),
  up: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 15.5 10 10.5l3.5 3.5L20 7.5M14.5 7.5H20V13" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
  ig: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  mouse: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 7v3" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 11.5V5.2a1.6 1.6 0 0 1 3.2 0v5.3m0-1.2a1.6 1.6 0 0 1 3.2 0v1.4m0-.4a1.6 1.6 0 0 1 3.2 0v4.2a6 6 0 0 1-6 6h-.8a6 6 0 0 1-4.7-2.3L4 14.4a1.6 1.6 0 0 1 2.5-2L9 14.8" />
    </svg>
  ),
};

/* `h` is a rough height at a 240px column, used only to spread the pieces
   over the columns evenly; `tag` is what the light calls it. */
const ITEMS = [
  {
    k: "ad",
    h: 147,
    tag: "Google oglasi",
    t: "Montaža klima uređaja za 24h",
    d: "Besplatan izlazak na teren i garancija na radove.",
  },
  { k: "post", h: 347, tag: "Društvene mreže" },
  { k: "ring", h: 98, tag: "Brzina sajta" },
  {
    k: "review",
    h: 128,
    tag: "Recenzije",
    t: "Odlična usluga, brzo i uredno.",
  },
  { k: "call", h: 155, tag: "Pozivi iz oglasa" },
  { k: "browser", h: 226, tag: "Izrada sajta" },
  { k: "kw", h: 121, tag: "SEO" },
  { k: "mail", h: 96, tag: "Online prodaja" },
  { k: "story", h: 393, tag: "Društvene mreže" },
  { k: "brand", h: 182, tag: "Brend" },
  { k: "spark", h: 148, tag: "Analitika" },
  {
    k: "inbox",
    h: 56,
    tag: "Upiti",
    t: "Novi upit sa sajta",
    d: "Kontakt forma",
  },
  { k: "rank", h: 149, tag: "SEO" },
  { k: "cal", h: 163, tag: "Plan objava" },
  { k: "metaAd", h: 281, tag: "Meta oglasi" },
  { k: "budget", h: 100, tag: "Oglašavanje" },
  { k: "chat", h: 135, tag: "Poruke" },
  { k: "logo", h: 150, tag: "Brend" },
  { k: "map", h: 194, tag: "Lokalni SEO" },
  { k: "donut", h: 138, tag: "Analitika" },
  {
    k: "inbox",
    h: 56,
    tag: "Upiti",
    t: "Poziv iz oglasa",
    d: "Google oglasi",
  },
  { k: "ab", h: 116, tag: "Testiranje" },
  { k: "notif", h: 58, tag: "Društvene mreže" },
  { k: "form", h: 182, tag: "Sajt koji prodaje" },
  {
    k: "review",
    h: 128,
    tag: "Recenzije",
    t: "Konačno sajt koji radi i na telefonu.",
  },
  { k: "news", h: 102, tag: "Email marketing" },
  {
    k: "ad",
    h: 150,
    tag: "Google oglasi",
    t: "Stomatolog Beograd, termin već sutra",
    d: "Pregled i plan lečenja na jednom mestu.",
  },
  {
    k: "inbox",
    h: 56,
    tag: "Upiti",
    t: "Poruka sa Instagrama",
    d: "Direktna poruka",
  },
];

const ROT = [
  -2.2, 1.6, -0.9, 2.4, -1.6, 0.8, -2.7, 1.3, -0.5, 2, -1.3, 2.6, -2, 0.6,
];
const DX = [-8, 10, 0, -12, 6, -4, 12, -10, 4, 8, -6, 0, 10, -8];
const GAP = 20;

const LAYOUTS = {
  6: {
    widths: [232, 256, 240, 262, 236, 250],
    offsets: [-36, -132, -8, -156, -60, -108],
  },
  4: { widths: [236, 254, 242, 250], offsets: [-30, -116, -8, -84] },
  3: { widths: [240, 254, 238], offsets: [-12, -96, -44] },
};

/* Shortest column first, so the collage ends up even, then topped up with
   repeats until every column runs past the bottom edge. Deterministic, so
   the server and the browser draw the same thing. */
function arrange(n, target) {
  const { widths, offsets } = LAYOUTS[n];
  const cols = widths.map((w, c) => ({
    w,
    top: offsets[c],
    h: offsets[c],
    items: [],
  }));
  const shortest = () =>
    cols.reduce((b, c, ci) => (c.h < cols[b].h - 1 ? ci : b), 0);
  let slot = 0;
  ITEMS.forEach((it, i) => {
    const c = cols[shortest()];
    c.items.push({ i, slot: slot++ });
    c.h += it.h + GAP;
  });
  let j = 0;
  for (let c = cols[shortest()]; c.h < target; c = cols[shortest()]) {
    let i = 0;
    for (let tries = 0; tries < ITEMS.length; tries++) {
      i = (j++ * 11 + 5) % ITEMS.length;
      if (!c.items.some((x) => x.i === i)) break;
    }
    c.items.push({ i, slot: slot++ });
    c.h += ITEMS[i].h + GAP;
  }
  return cols;
}
const ARRANGED = {
  6: arrange(6, 1010),
  4: arrange(4, 1250),
  3: arrange(3, 1300),
};

function Art({ it }) {
  switch (it.k) {
    case "ad":
      return (
        <>
          <p className={s.adTop}>
            <b>Sponzorisano</b>
            <span>vasafirma.rs</span>
          </p>
          <p className={s.adTitle}>{it.t}</p>
          <p className={s.adText}>{it.d}</p>
          <p className={s.adLinks}>
            <span>Cene</span>
            <span>Radovi</span>
            <span>Kontakt</span>
          </p>
        </>
      );
    case "rank":
      return (
        <>
          <span className={s.badge}>#1</span>
          <p className={s.site}>
            <i className={s.fav}>v</i>
            <span>
              vasafirma.rs
              <small>› usluge › servis</small>
            </span>
          </p>
          <p className={s.resTitle}>Servis klima Niš, dolazak isti dan</p>
          <p className={s.resText}>
            Čišćenje i servis svih brendova. Zakažite online.
          </p>
        </>
      );
    case "post":
      return (
        <>
          <p className={s.postHead}>
            <i className={s.avatar} />
            <b>vasafirma</b>
            <span>Beograd</span>
          </p>
          <div className={s.postImg}>
            <span className={s.postSun} />
            <span className={s.postWord}>
              Novo
              <br />u ponudi
            </span>
            <i className={s.postPop}>{I.heart}</i>
          </div>
          <p className={s.postActs}>
            <i className={s.postLike}>{I.heart}</i>
            {I.comment}
            {I.send}
            <span />
            {I.save}
          </p>
          <p className={s.postLikes}>
            Sviđa se: <b>marija.p</b> i drugima
          </p>
        </>
      );
    case "ring":
      return (
        <>
          <span className={s.ringWrap}>
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle className={s.ringBg} cx="32" cy="32" r="27" />
              <circle
                className={s.ringFg}
                cx="32"
                cy="32"
                r="27"
                pathLength="100"
              />
            </svg>
            <b>100</b>
          </span>
          <p className={s.ringText}>
            <b>Performanse</b>
            <span>Brzina sajta na telefonu</span>
          </p>
        </>
      );
    case "review":
      return (
        <>
          <p className={s.stars}>
            {I.star}
            {I.star}
            {I.star}
            {I.star}
            {I.star}
          </p>
          <p className={s.quote}>„{it.t}“</p>
          <p className={s.who}>
            <i>G</i>
            <span>Google recenzija</span>
          </p>
        </>
      );
    case "call":
      return (
        <>
          <p className={s.callTop}>
            <i className={s.callLive} />
            Dolazni poziv
          </p>
          <p className={s.callName}>Novi klijent</p>
          <p className={s.callFrom}>Iz Google oglasa</p>
          <p className={s.callBtns}>
            <i className={s.callNo}>{I.phone}</i>
            <i className={s.callYes}>{I.phone}</i>
          </p>
        </>
      );
    case "browser":
      return (
        <>
          <p className={s.brBar}>
            <i />
            <i />
            <i />
            <span>vasafirma.rs</span>
          </p>
          <div className={s.brHero}>
            <b />
            <b />
            <em>Zakažite</em>
          </div>
          <p className={s.brRow}>
            <i />
            <i />
            <i />
          </p>
        </>
      );
    case "kw":
      return (
        <>
          <p className={s.kwHead}>Ključne reči</p>
          <p className={s.kwList}>
            <span>
              klima Niš <i>{I.up}</i>
            </span>
            <span>servis klima</span>
            <span>
              montaža klime <i>{I.up}</i>
            </span>
            <span>klima cena</span>
          </p>
        </>
      );
    case "mail":
      return (
        <>
          <p className={s.mailRow}>
            <i className={s.mailIcon}>{I.mail}</i>
            <span>
              <b>Nova porudžbina #1042</b>
              <small>prodavnica@vasafirma.rs</small>
            </span>
          </p>
          <p className={s.mailFoot}>
            <span className={s.newPill}>Novo</span>
            upravo
          </p>
        </>
      );
    case "story":
      return (
        <>
          <p className={s.storyBars}>
            <i />
            <i />
            <i />
          </p>
          <p className={s.storyHead}>
            <i className={s.avatar} />
            vasafirma
            <span>2 h</span>
          </p>
          <div className={s.storySplit}>
            <span className={s.storyPre}>
              <i />
              <b>Pre</b>
            </span>
            <span className={s.storyPosle}>
              <i />
              <b>Posle</b>
            </span>
            <em />
          </div>
          <p className={s.storyCta}>Pošaljite poruku</p>
        </>
      );
    case "brand":
      return (
        <>
          <p className={s.brandTop}>
            <span>Brend knjiga</span>
            <span>02</span>
          </p>
          <p className={s.brandAa}>Aa</p>
          <p className={s.sw}>
            <i />
            <i />
            <i />
            <i />
          </p>
          <p className={s.brandName}>Manrope · Ekstra bold</p>
        </>
      );
    case "spark":
      return (
        <>
          <p className={s.sparkHead}>
            <b>Upiti sa sajta</b>
            <span className={s.upPill}>{I.up} raste</span>
          </p>
          <svg className={s.sparkSvg} viewBox="0 0 200 64" aria-hidden="true">
            <path
              className={s.sparkArea}
              d="M0 56 L22 52 L44 54 L66 44 L88 46 L110 34 L132 36 L154 22 L176 18 L200 6 L200 64 L0 64 Z"
            />
            <path
              className={s.sparkLine}
              pathLength="100"
              d="M0 56 L22 52 L44 54 L66 44 L88 46 L110 34 L132 36 L154 22 L176 18 L200 6"
            />
            <circle className={s.sparkEnd} cx="198" cy="7" r="4" />
          </svg>
          <p className={s.sparkAxis}>
            <span>jun</span>
            <span>jul</span>
            <span>avg</span>
            <span>sep</span>
          </p>
        </>
      );
    case "inbox":
      return (
        <p className={s.inRow}>
          <i className={s.inDot} />
          <span>
            <b>{it.t}</b>
            <small>{it.d}</small>
          </span>
          <em>sada</em>
        </p>
      );
    case "cal":
      return (
        <>
          <p className={s.calHead}>
            <b>Oktobar</b>
            <span>Plan objava</span>
          </p>
          <p className={s.calGrid}>
            {[
              ["pon", "P"],
              ["uto", "U"],
              ["sre", "S"],
              ["cet", "Č"],
              ["pet", "P"],
              ["sub", "S"],
              ["ned", "N"],
            ].map(([id, d]) => (
              <span key={id} className={s.calDay}>
                {d}
              </span>
            ))}
            {[5, 6, 7, 8, 9, 10, 11].map((d) => (
              <span
                key={d}
                className={d === 6 ? s.calOn : d === 9 ? s.calDot : undefined}
              >
                {d}
              </span>
            ))}
          </p>
          <p className={s.calEvent}>
            <i>{I.ig}</i>
            <span>
              <b>Objava: utorak 10:00</b>
              <small>Instagram · Reels</small>
            </span>
          </p>
        </>
      );
    case "metaAd":
      return (
        <>
          <p className={s.metaHead}>
            <i className={s.avatar} />
            <span>
              <b>vasafirma</b>
              <small>Sponzorisano</small>
            </span>
          </p>
          <p className={s.metaText}>
            Jesenja ponuda je počela. Rezervišite termin.
          </p>
          <div className={s.metaImg}>
            <span />
            <span />
          </div>
          <p className={s.metaCta}>
            <span>
              vasafirma.rs
              <b>Rezervišite termin</b>
            </span>
            <em>Saznajte više</em>
          </p>
        </>
      );
    case "budget":
      return (
        <>
          <p className={s.budHead}>
            <b>Dnevni budžet</b>
            <span>raspodela</span>
          </p>
          <p className={s.budBar}>
            <i />
            <i />
            <i />
          </p>
          <p className={s.budLegend}>
            <span>
              <i />
              Google
            </span>
            <span>
              <i />
              Meta
            </span>
            <span>
              <i />
              Ponovo
            </span>
          </p>
        </>
      );
    case "chat":
      return (
        <>
          <p className={s.bubIn}>Da li radite subotom?</p>
          <p className={s.bubOut}>Radimo, od 9 do 15h.</p>
          <p className={s.typing}>
            <i />
            <i />
            <i />
          </p>
        </>
      );
    case "logo":
      return (
        <>
          <span className={s.logoMark}>
            <i />
            <i />
          </span>
          <p className={s.logoWord}>
            vasa<b>firma</b>
          </p>
        </>
      );
    case "map":
      return (
        <>
          <div className={s.mapArea}>
            <i className={s.road1} />
            <i className={s.road2} />
            <i className={s.road3} />
            <span className={s.mapPin}>{I.pin}</span>
          </div>
          <p className={s.mapCard}>
            <b>vasafirma</b>
            <span>
              <i />
              Otvoreno do 20h
            </span>
          </p>
        </>
      );
    case "donut":
      return (
        <>
          <p className={s.dHead}>Izvori posete</p>
          <div className={s.dWrap}>
            <svg viewBox="0 0 42 42" aria-hidden="true">
              <circle className={s.dBg} cx="21" cy="21" r="15.9" />
              <circle
                className={s.d1}
                cx="21"
                cy="21"
                r="15.9"
                pathLength="100"
              />
              <circle
                className={s.d2}
                cx="21"
                cy="21"
                r="15.9"
                pathLength="100"
              />
              <circle
                className={s.d3}
                cx="21"
                cy="21"
                r="15.9"
                pathLength="100"
              />
            </svg>
            <ul>
              <li>
                <i />
                Google
              </li>
              <li>
                <i />
                Meta
              </li>
              <li>
                <i />
                Direktno
              </li>
            </ul>
          </div>
        </>
      );
    case "ab":
      return (
        <>
          <p className={s.abHead}>A/B test naslova</p>
          <p className={s.abRow}>
            <b>A</b>
            <i />
          </p>
          <p className={`${s.abRow} ${s.abWin}`}>
            <b>B</b>
            <i />
            <em>{I.check} bolji</em>
          </p>
        </>
      );
    case "notif":
      return (
        <p className={s.notifRow}>
          <i>{I.ig}</i>
          <span>
            <b>Instagram</b>
            Nova poruka: zanima me cena
          </span>
        </p>
      );
    case "form":
      return (
        <>
          <p className={s.formHead}>Pošaljite upit</p>
          <span className={s.field}>Ime i prezime</span>
          <span className={s.field}>Telefon</span>
          <p className={s.formBtn}>
            <span>Pošalji upit</span>
            <i>{I.check}</i>
          </p>
        </>
      );
    case "news":
      return (
        <>
          <p className={s.newsTop}>
            <span className={s.newsPill}>Poslato</span>
            <small>utorak 09:00</small>
          </p>
          <p className={s.newsSub}>Jesenja ponuda počinje sutra</p>
          <p className={s.newsMeta}>
            {I.check} Otvoreno <span>·</span> Kliknuto
          </p>
        </>
      );
    default:
      return null;
  }
}

function Collage({ n, k, register }) {
  return (
    <div className={s.collage} style={{ "--k": k }}>
      {ARRANGED[n].map((col) => (
        <div
          key={`${n}-${col.w}`}
          className={s.col}
          style={{ width: col.w, marginTop: col.top }}
        >
          {col.items.map(({ i, slot }) => (
            <div
              key={slot}
              ref={register ? (el) => register(slot, i, el) : undefined}
              data-i={i}
              className={`${s.a} ${s[ITEMS[i].k]}`}
              style={{
                "--rot": `${ROT[i % ROT.length]}deg`,
                "--dx": `${DX[i % DX.length]}px`,
              }}
            >
              <Art it={ITEMS[i]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function H04Spotlight() {
  const hero = useRef(null);
  const reveal = useRef(null);
  const chip = useRef(null);
  const chipText = useRef(null);
  const els = useRef([]);
  const kinds = useRef([]);
  const measureRef = useRef(() => {});
  const [view, setView] = useState({ n: 6, k: 1, ready: false });

  // Columns and scale follow the frame width; the collage fades in once it
  // has its real layout, so a phone never sees the six-column version.
  useEffect(() => {
    const el = hero.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const n = w < 640 ? 3 : w < 1060 ? 4 : 6;
      const k =
        n === 3
          ? Math.min(0.68, Math.max(0.56, w / 560))
          : n === 4
            ? Math.min(1, Math.max(0.62, w / 1000))
            : Math.min(1, Math.max(0.8, w / 1392));
      setView((v) =>
        v.n === n && Math.abs(v.k - k) < 0.005 && v.ready
          ? v
          : { n, k: Math.round(k * 1000) / 1000, ready: true },
      );
      measureRef.current();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-measure after a re-layout
  useEffect(() => {
    measureRef.current();
    const t = setTimeout(() => measureRef.current(), 700);
    document.fonts?.ready.then(() => measureRef.current());
    return () => clearTimeout(t);
  }, [view]);

  useEffect(() => {
    const h = hero.current;
    const rv = reveal.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const S = {
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      w: 1,
      h: 1,
      r: 170,
      theta: 3.75,
      mode: "wander",
      idleAt: 0,
      down: false,
      init: false,
      rects: [],
      lit: [],
      label: -1,
    };
    let raf = 0;
    let last = 0;
    let visible = false;
    let running = false;

    const orbit = () => {
      const { w, theta: t } = S;
      const H = S.h;
      const narrow = w < 640;
      const rx = w * (narrow ? 0.34 : 0.41);
      const ry = H * (narrow ? 0.43 : 0.37);
      S.tx = w / 2 + rx * Math.cos(t) * (0.84 + 0.16 * Math.sin(t * 2.1));
      // on a phone the headline fills the middle, so the light lingers in
      // the bands above and below it
      const sn = Math.sin(t);
      const sy = narrow ? Math.sign(sn) * Math.abs(sn) ** 0.45 : sn;
      S.ty = H / 2 + ry * sy * (0.88 + 0.12 * Math.cos(t * 1.7));
    };

    const measure = () => {
      if (!h) return;
      const hr = h.getBoundingClientRect();
      S.w = hr.width;
      S.h = hr.height;
      S.r = hr.width < 640 ? 124 : 200;
      rv.style.setProperty("--sr", `${S.r}px`);
      const cr = h.querySelector(`.${s.copy}`)?.getBoundingClientRect();
      S.copy = cr
        ? [
            cr.left - hr.left,
            cr.top - hr.top,
            cr.right - hr.left,
            cr.bottom - hr.top,
          ]
        : null;
      S.lit = els.current.map((el) => !!el?.hasAttribute("data-lit"));
      S.rects = els.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return [
          r.left - hr.left,
          r.top - hr.top,
          r.right - hr.left,
          r.bottom - hr.top,
        ];
      });
      if (!S.init) {
        S.init = true;
        orbit();
        S.x = S.tx;
        S.y = S.ty;
        paint();
      }
    };
    measureRef.current = measure;

    const paint = () => {
      rv.style.setProperty("--sx", `${S.x.toFixed(1)}px`);
      rv.style.setProperty("--sy", `${S.y.toFixed(1)}px`);
      // what the light touches wakes up; the closest piece names its service
      const R = S.r;
      let best = -1;
      let bestD = Number.POSITIVE_INFINITY;
      S.rects.forEach((rc, i) => {
        if (!rc) return;
        const dx = Math.max(rc[0] - S.x, 0, S.x - rc[2]);
        const dy = Math.max(rc[1] - S.y, 0, S.y - rc[3]);
        const on = Math.hypot(dx, dy) < R * 0.6;
        if (on !== !!S.lit[i]) {
          S.lit[i] = on;
          els.current[i]?.toggleAttribute("data-lit", on);
        }
        if (on) {
          const cd = Math.hypot(
            (rc[0] + rc[2]) / 2 - S.x,
            (rc[1] + rc[3]) / 2 - S.y,
          );
          if (cd < bestD) {
            bestD = cd;
            best = i;
          }
        }
      });
      // the label sits under the light (or over it), never on the headline
      const ax = Math.min(S.w - 90, Math.max(90, S.x));
      const c = S.copy;
      const clear = (y) =>
        y > 12 &&
        y < S.h - 44 &&
        !(
          c &&
          ax > c[0] - 80 &&
          ax < c[2] + 80 &&
          y > c[1] - 36 &&
          y < c[3] + 12
        );
      let ay = S.y + R * 0.62;
      if (!clear(ay)) ay = S.y - R * 0.62 - 32;
      if (!clear(ay)) best = -1;
      if (best !== S.label) {
        S.label = best;
        if (best >= 0)
          chipText.current.textContent = ITEMS[kinds.current[best]].tag;
        chip.current.toggleAttribute("data-on", best >= 0);
      }
      chip.current.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
    };

    const frame = (now) => {
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (S.mode === "idle" && now > S.idleAt) {
        // pick up the orbit from where the light is now
        const cx = (S.x - S.w / 2) / (S.w * 0.4);
        const cy = (S.y - S.h / 2) / (S.h * 0.38);
        S.theta = Math.atan2(cy, cx);
        S.mode = "wander";
      }
      if (S.mode === "wander") {
        if (!reduce) S.theta += dt * 0.00034;
        orbit();
      }
      const rate = S.mode === "wander" ? 0.0026 : 0.013;
      const a = reduce ? 1 : 1 - Math.exp(-dt * rate);
      S.x += (S.tx - S.x) * a;
      S.y += (S.ty - S.y) * a;
      paint();
      const settled = Math.abs(S.tx - S.x) < 0.3 && Math.abs(S.ty - S.y) < 0.3;
      if (
        !visible ||
        (settled && S.mode !== "idle" && (S.mode !== "wander" || reduce))
      ) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (running || !visible) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const local = (e) => {
      const r = h.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const touched = () => h.setAttribute("data-touched", "");
    const onMove = (e) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        S.mode = "pointer";
      } else if (!S.down) return;
      else S.mode = "touch";
      [S.tx, S.ty] = local(e);
      touched();
      kick();
    };
    const onDown = (e) => {
      if (e.pointerType === "mouse") return;
      S.down = true;
      S.mode = "touch";
      [S.tx, S.ty] = local(e);
      touched();
      kick();
    };
    const release = (e) => {
      if (e.pointerType === "mouse") return;
      S.down = false;
      S.mode = "idle";
      S.idleAt = performance.now() + 2600;
      kick();
    };
    const onLeave = (e) => {
      if (e.pointerType !== "mouse") return;
      S.mode = "idle";
      S.idleAt = performance.now() + 700;
      kick();
    };
    h.addEventListener("pointermove", onMove, { passive: true });
    h.addEventListener("pointerdown", onDown, { passive: true });
    h.addEventListener("pointerup", release, { passive: true });
    h.addEventListener("pointercancel", release, { passive: true });
    h.addEventListener("pointerleave", onLeave, { passive: true });

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        h.toggleAttribute("data-paused", !visible);
        if (visible) {
          measure();
          kick();
        } else {
          cancelAnimationFrame(raf);
          running = false;
        }
      },
      { threshold: 0.02 },
    );
    io.observe(h);
    measure();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      h.removeEventListener("pointermove", onMove);
      h.removeEventListener("pointerdown", onDown);
      h.removeEventListener("pointerup", release);
      h.removeEventListener("pointercancel", release);
      h.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const register = (slot, i, el) => {
    els.current[slot] = el;
    kinds.current[slot] = i;
  };

  return (
    <div ref={hero} className={s.hero} data-ready={view.ready || undefined}>
      <div className={`${s.layer} ${s.base}`} aria-hidden="true">
        <Collage n={view.n} k={view.k} />
      </div>
      <div ref={reveal} className={`${s.layer} ${s.reveal}`} aria-hidden="true">
        <Collage n={view.n} k={view.k} register={register} />
      </div>
      <p ref={chip} className={s.chip} aria-hidden="true">
        <span className={s.chipIn}>
          <i />
          <b ref={chipText} />
        </span>
      </p>
      <HeroCopy align="center" className={s.copy} />
      <p className={s.hint}>
        <span className={s.hintMouse}>
          {I.mouse}
          Pomerite miš da vidite šta radimo
        </span>
        <span className={s.hintTouch}>
          {I.hand}
          Prevucite prstom
        </span>
      </p>
    </div>
  );
}
