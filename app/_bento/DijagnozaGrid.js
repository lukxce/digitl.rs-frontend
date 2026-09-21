"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "../components/serviceIcons";
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
 * The homepage as a diagnostic rather than a brochure.
 *
 * Hero first, then one question. That answer drives everything after it:
 * which channels light up in the system, which gap is named, which case
 * study is shown, which objection is answered, and what the contact form
 * arrives pre-filled with.
 */

const SERVICES = [
  {
    id: "ads",
    Icon: IconProduct,
    name: "Plaćeno oglašavanje",
    role: "Donosi saobraćaj danas.",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    feeds: "Hrani web upitima, a SEO podacima o tome šta ljudi stvarno traže.",
  },
  {
    id: "seo",
    Icon: IconStrategy,
    name: "SEO",
    role: "Gradi saobraćaj koji ne plaćate.",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    feeds: "Snižava cenu plaćenog klika i drži upite kad se kampanja ugasi.",
  },
  {
    id: "web",
    Icon: IconWeb,
    name: "Web",
    role: "Pretvara saobraćaj u upite.",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    feeds: "Bez njega svaki drugi kanal plaća za posetu koja ne postane poziv.",
  },
  {
    id: "social",
    Icon: IconMotion,
    name: "Društvene mreže",
    role: "Drži brend prisutnim između kupovina.",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    feeds: "Čini da vas kupac prepozna kad vas nađe u pretrazi ili oglasu.",
  },
  {
    id: "brand",
    Icon: IconBrand,
    name: "Brend",
    role: "Čini da sve ostalo košta manje.",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    feeds: "Isti oglas, ista pozicija, veći procenat klikova. To je brend.",
  },
];

const SOURCES = [
  {
    id: "preporuka",
    label: "Preporuka",
    have: ["brand"],
    gapTitle: "Preporuka ima plafon.",
    gap: "Radi dok se krug poznanstava ne iscrpi. Tada novih poziva nema odakle da stignu, jer vas niko ko vas već ne zna ne može naći.",
    match: "moler-nis",
    objection: [
      "Radi nam i ovako, zašto bih menjao?",
      "I dalje će raditi. Razlika je što prestajete da zavisite isključivo od toga ko vas već zna.",
    ],
    prefill: "Klijenti nam trenutno stižu uglavnom preko preporuke.",
  },
  {
    id: "placeno",
    label: "Plaćeni oglasi",
    have: ["ads", "web"],
    gapTitle: "Plaćeno radi dok plaćate.",
    gap: "Onog dana kad ugasite kampanju, saobraćaj staje. Bez organskog dela, cena upita raste svake godine jer je svaki klik iznajmljen.",
    match: "thermiq",
    objection: [
      "Zar SEO nije spor?",
      "Jeste. Zato se pokreće dok plaćeno još uvek nosi, a ne umesto njega.",
    ],
    prefill: "Trenutno se oslanjamo na plaćene oglase.",
  },
  {
    id: "organski",
    label: "Google, organski",
    have: ["seo", "web"],
    gapTitle: "Organski donosi, ali nema ručicu za tempo.",
    gap: "Kad vam treba više upita ovog meseca, nemate čime da pojačate. Plaćeni deo je ta ručica, a mreže i brend čine da klik bude jeftiniji.",
    match: "servis-klime-nis",
    objection: [
      "Ako sam već prvi, šta će mi oglasi?",
      "Za trenutke kad tražnja skoči, a vi hoćete više od onoga što pozicija sama donosi.",
    ],
    prefill: "Klijenti nas nalaze organski preko Google-a.",
  },
  {
    id: "mreze",
    label: "Društvene mreže",
    have: ["social", "brand"],
    gapTitle: "Mreže grade poznatost, ne nameru.",
    gap: "Kupac koji je spreman da kupi ne skroluje, nego pretražuje. Ako vas tada nema u pretrazi, poznatost koju ste izgradili pokupi neko drugi.",
    match: "thermiq",
    objection: [
      "Imamo dosta pratilaca, zar to nije dovoljno?",
      "Pratioci su publika. Upiti su prihod. Nije isto i ne prelazi samo od sebe.",
    ],
    prefill: "Najviše ulažemo u društvene mreže.",
  },
  {
    id: "neznam",
    label: "Ne merimo",
    have: [],
    gapTitle: "To je prvi problem, i najjeftiniji.",
    gap: "Bez merenja je svaka odluka o budžetu nagađanje. Merenje se postavlja za nekoliko dana i odmah pokazuje šta radi, a šta samo troši.",
    match: "elektromil",
    objection: [
      "Koliko to košta da se postavi?",
      "Manje nego jedan mesec budžeta koji trenutno ne umete da pripišete nijednom kanalu.",
    ],
    prefill: "Iskreno, ne merimo odakle nam stižu klijenti.",
  },
];

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i odluke o sledećem koraku."],
];

const ASK = [
  "Zašto vam Google Ads troši budžet na sopstveni brend",
  "Da li vam treba SEO ili samo brži sajt",
  "Koliko vas stvarno košta jedan upit",
  "Zašto konkurent sa gorim sajtom rangira bolje",
  "Zašto saobraćaj raste, a prodaja ne",
  "Kada ugasiti kampanju, a kada je pustiti",
];

const NECE_SE_CUTI = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
  "digitalna transformacija",
];

/* ── diagram (compact) ───────────────────────────────────── */

const NODE_W = 196;
const NODE_H = 42;
const GAP = 11;
const HUB_X = 500;
const HUB_R = 42;
const VB_W = 920;

function SystemDiagram({ have, answered }) {
  const total = SERVICES.length * NODE_H + (SERVICES.length - 1) * GAP;
  const top = 18;
  const vbH = total + top * 2;
  const hubY = top + total / 2;

  return (
    <svg
      className={s.diagram}
      viewBox={`0 0 ${VB_W} ${vbH}`}
      role="img"
      aria-label="Pet kanala povezanih u jedan sistem"
    >
      <title>Pet kanala povezanih u jedan sistem</title>
      <g className={s.wires}>
        {SERVICES.map(({ id }, i) => {
          const y = top + i * (NODE_H + GAP) + NODE_H / 2;
          const x1 = HUB_X - HUB_R;
          const mid = (NODE_W + x1) / 2;
          const on = have.includes(id);
          return (
            <path
              key={id}
              className={`${s.wire} ${answered && on ? s.wireOn : ""} ${answered && !on ? s.wireOff : ""}`}
              style={{ "--d": `${i * 0.24}s` }}
              d={`M ${NODE_W} ${y} C ${mid} ${y}, ${mid} ${hubY}, ${x1} ${hubY}`}
            />
          );
        })}
        <path
          className={s.wireOut}
          d={`M ${HUB_X + HUB_R} ${hubY} L ${VB_W - 250} ${hubY}`}
        />
      </g>

      {SERVICES.map(({ id, name }, i) => {
        const y = top + i * (NODE_H + GAP);
        const on = have.includes(id);
        const cls = !answered
          ? s.node
          : on
            ? `${s.node} ${s.nodeOn}`
            : `${s.node} ${s.nodeOff}`;
        return (
          <g key={id}>
            <rect
              className={cls}
              x="0"
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx="13"
            />
            <circle
              className={`${s.nodeDot} ${answered && on ? s.dotOn : ""}`}
              cx="20"
              cy={y + NODE_H / 2}
              r="3.6"
            />
            <text
              className={`${s.nodeText} ${answered && !on ? s.nodeTextOff : ""}`}
              x="36"
              y={y + NODE_H / 2 + 4.5}
            >
              {name}
            </text>
            {answered && !on
              ? <text
                  className={s.nodeAdd}
                  x={NODE_W - 18}
                  y={y + NODE_H / 2 + 5}
                >
                  +
                </text>
              : null}
          </g>
        );
      })}

      <circle className={s.hubHalo} cx={HUB_X} cy={hubY} r={HUB_R + 11} />
      <circle className={s.hub} cx={HUB_X} cy={hubY} r={HUB_R} />
      <text className={s.hubText} x={HUB_X} y={hubY - 2} textAnchor="middle">
        jedan
      </text>
      <text className={s.hubText} x={HUB_X} y={hubY + 14} textAnchor="middle">
        sistem
      </text>

      <rect
        className={s.outNode}
        x={VB_W - 250}
        y={hubY - 34}
        width="250"
        height="68"
        rx="15"
      />
      <text className={s.outLabel} x={VB_W - 228} y={hubY - 9}>
        REZULTAT
      </text>
      <text className={s.outText} x={VB_W - 228} y={hubY + 13}>
        Upiti koji postaju posao
      </text>
    </svg>
  );
}

/* ── shared bits ─────────────────────────────────────────── */

function Chapter({ n, title, width, children }) {
  return (
    <section className={s.chapter} style={width ? { "--w": width } : undefined}>
      <header className={s.chapterHead}>
        <span className={s.chapterNum}>{n}</span>
        <span className={s.chapterTitle}>{title}</span>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

/** Counts a metric up from zero when it first appears. Non-numeric values just render. */
function CountUp({ value }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const m = String(value).match(/^([\d.,]+)(.*)$/);
    if (!m || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const target = Number.parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (Number.isNaN(target)) {
      setShown(value);
      return;
    }
    const isInt = !m[1].includes(",");
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 900);
      const e = 1 - (1 - p) ** 3;
      const n = target * e;
      const text = isInt
        ? Math.round(n).toLocaleString("sr-RS")
        : n.toFixed(1).replace(".", ",");
      setShown(`${text}${m[2]}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

/* ── service sheet ───────────────────────────────────────── */

function ServiceSheet({ service, gap, onClose }) {
  useEffect(() => {
    if (!service) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  if (!service) return null;
  const { Icon } = service;

  return (
    <div
      className={s.sheetWrap}
      role="dialog"
      aria-modal="true"
      aria-label={service.name}
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
        <span className={s.eyebrow}>
          {gap ? "Nedostaje u vašem sistemu" : "Deo sistema"}
        </span>
        <h2 className={s.sheetTitle}>{service.name}</h2>
        <p className={s.sheetRole}>{service.role}</p>
        <p className={s.sheetBody}>{service.body}</p>
        <div className={s.sheetFeeds}>
          <span className={s.eyebrow}>Kako se vezuje za ostalo</span>
          <p>{service.feeds}</p>
        </div>
        <a className={s.sheetCta} href="#kontakt" onClick={onClose}>
          Pitajte nas o ovome
          <span className={s.sheetCtaIcon}>
            <ArrowIcon size={13} />
          </span>
        </a>
      </div>
    </div>
  );
}

/* ── the flip card ───────────────────────────────────────── */

function FlipCard({ client, flipped, onFlip }) {
  return (
    <div className={`${s.flip} ${flipped ? s.flipped : ""}`}>
      <div className={s.flipInner}>
        <article className={`${s.card} ${s.face} ${s.faceFront}`}>
          <span className={s.faceTag}>Pre</span>
          <span className={s.proofClient}>{client.clientName}</span>
          <span className={s.proofCat}>{client.category}</span>
          <p className={s.proofBefore}>{client.before}</p>
          <button type="button" className={s.flipBtn} onClick={onFlip}>
            Šta je bilo posle
            <span className={s.flipBtnIcon} aria-hidden>
              <ArrowIcon size={12} />
            </span>
          </button>
        </article>

        <article className={`${s.card} ${s.face} ${s.faceBack}`}>
          <span className={s.faceTagLight}>Posle</span>
          <span className={s.proofClientLight}>{client.clientName}</span>
          <div className={s.metricStack}>
            {client.after.map((m) => (
              <span key={m.label} className={s.metric}>
                <span className={s.metricValue}>
                  {flipped ? <CountUp value={m.value} /> : m.value}
                </span>
                <span className={s.metricLabel}>{m.label}</span>
              </span>
            ))}
          </div>
          <div className={s.faceBackFoot}>
            <button type="button" className={s.flipBtnLight} onClick={onFlip}>
              Nazad
            </button>
            <a className={s.faceLink} href={client.href}>
              Cela priča
              <ArrowIcon size={12} />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ── small tiles ─────────────────────────────────────────── */

function AskTile() {
  const [i, setI] = useState(0);
  return (
    <article className={`${s.card} ${s.tile}`}>
      <span className={s.eyebrow}>Pitajte nas o</span>
      <p className={s.askText}>{ASK[i]}</p>
      <button
        type="button"
        className={s.chipBtn}
        onClick={() => setI((v) => (v + 1) % ASK.length)}
      >
        Još jedno
      </button>
    </article>
  );
}

function ClockTile() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const read = () => {
      const p = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Belgrade",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const g = (t) => p.find((x) => x.type === t)?.value ?? "";
      setNow({ hh: g("hour"), mm: g("minute"), h: Number(g("hour")) });
    };
    read();
    const id = setInterval(read, 15_000);
    return () => clearInterval(id);
  }, []);
  const line =
    now == null
      ? ""
      : now.h < 8
        ? "Prerano. Kampanje ipak rade."
        : now.h < 17
          ? "Radimo. Javite se."
          : now.h < 22
            ? "Još gledamo izveštaje."
            : "Spavamo. Google Ads ne.";
  return (
    <article className={`${s.card} ${s.tile}`}>
      <span className={s.eyebrow}>Srbija · GMT+2</span>
      <p className={s.clockTime} suppressHydrationWarning>
        {now ? `${now.hh}:${now.mm}` : "--:--"}
      </p>
      <span className={s.smallNote}>{line}</span>
    </article>
  );
}

function BuzzTile() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % NECE_SE_CUTI.length),
      2400,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <article className={`${s.card} ${s.tile}`}>
      <span className={s.eyebrow}>Nećete čuti od nas</span>
      <p className={s.buzzWord} key={NECE_SE_CUTI[i]}>
        {NECE_SE_CUTI[i]}
      </p>
      <span className={s.smallNote}>Ni na jednom sastanku.</span>
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
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <article className={`${s.card} ${s.contact}`} id="kontakt">
      <span className={s.eyebrowLight}>Vaš red</span>
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
          rows={3}
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
          Pošaljite
          <span className={s.sendIcon}>
            <ArrowIcon />
          </span>
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
      <div className={s.direct}>
        <a href={`mailto:${CONTACT.email}`}>
          <MailIcon />
          {CONTACT.email}
        </a>
        <a href={`tel:${CONTACT.tel}`}>
          <PhoneIcon />
          {CONTACT.phone}
        </a>
      </div>
    </article>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function DijagnozaGrid({ clients = [], articles = [] }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [pick, setPick] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [flipped, setFlipped] = useState(false);
  useHorizontalScroll(trackRef, stageRef);

  const source = SOURCES.find((x) => x.id === pick) ?? null;
  const have = source?.have ?? [];
  const matched =
    (source && clients.find((c) => c.slug === source.match)) ??
    clients[0] ??
    null;
  const posts = articles.slice(0, 2);
  const openSheet = SERVICES.find((x) => x.id === sheet) ?? null;

  function scrollToAnchor(name) {
    const el = trackRef.current;
    const target = el?.querySelector(`[data-anchor="${name}"]`);
    if (!el || !target) return;
    el.scrollTo({
      left: target.offsetLeft - 34,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  function choose(id) {
    setPick(id);
    setFlipped(false);
    requestAnimationFrame(() => scrollToAnchor("system"));
  }

  return (
    <div className={s.stage} ref={stageRef} data-bento>
      <div className={s.wash} aria-hidden />

      <header className={s.bar}>
        <Image
          src="/digitl-logo.png"
          alt="digitl"
          width={82}
          height={22}
          className={s.logo}
          priority
        />
        {source
          ? <button
              type="button"
              className={s.reset}
              onClick={() => {
                setPick(null);
                setFlipped(false);
              }}
            >
              Počnite ispočetka
            </button>
          : <span className={s.hint}>
              Prevucite udesno
              <span className={s.hintArrow} aria-hidden>
                <ArrowIcon size={13} />
              </span>
            </span>}
      </header>

      <div className={s.track} ref={trackRef}>
        {/* 01 hero */}
        <Chapter n="01" title="Digitl" width="440px">
          <article className={`${s.card} ${s.hero}`}>
            <span className={s.heroBlobA} aria-hidden />
            <span className={s.heroBlobB} aria-hidden />
            <h1 className={s.heroTitle}>
              Marketing koji donosi <em>prave</em> rezultate.
            </h1>
            <p className={s.heroBody}>
              Kompletan marketing kao jedan sistem, ne meni nepovezanih usluga.
            </p>
            <div className={s.heroRow}>
              <button
                type="button"
                className={s.heroCta}
                onClick={() => scrollToAnchor("question")}
              >
                Proverite svoj sistem
                <span className={s.heroCtaIcon}>
                  <ArrowIcon size={13} />
                </span>
              </button>
              <a className={s.heroGhost} href="#kontakt">
                Zakažite razgovor
              </a>
            </div>
            <ul className={s.heroStrip}>
              <li>
                <strong>5</strong> kanala
              </li>
              <li>
                <strong>{clients.length || 4}</strong> studije slučaja
              </li>
              <li>
                <strong>1</strong> sistem
              </li>
            </ul>
          </article>
        </Chapter>

        {/* 02 question */}
        <Chapter n="02" title="Pitanje" width="360px">
          <article className={`${s.card} ${s.question}`} data-anchor="question">
            <span className={s.eyebrow}>Jedno pitanje</span>
            <h2 className={s.questionTitle}>
              Odakle vam danas stižu klijenti?
            </h2>
            <div className={s.options}>
              {SOURCES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={pick === o.id}
                  className={`${s.option} ${pick === o.id ? s.optionOn : ""}`}
                  onClick={() => choose(o.id)}
                >
                  <span className={s.optionCheck} aria-hidden>
                    {pick === o.id
                      ? <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12l5 5 9-10"
                            stroke="currentColor"
                            strokeWidth="3.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      : null}
                  </span>
                  {o.label}
                </button>
              ))}
            </div>
            <p className={s.questionNote}>
              {source
                ? "Sve desno se prilagodilo vašem odgovoru."
                : "Odgovor menja sve što sledi."}
            </p>
          </article>
        </Chapter>

        {/* 03 system */}
        <Chapter n="03" title="Vaš sistem" width="640px">
          <article className={`${s.card} ${s.systemCard}`} data-anchor="system">
            <SystemDiagram have={have} answered={Boolean(source)} />
            <p className={s.diagramNote}>
              {source
                ? "Puna linija već radi kod vas. Isprekidana je ono što nedostaje."
                : "Pet kanala, jedan sistem. Odgovorite levo i popuniće se prema vama."}
            </p>
          </article>
          <div className={s.serviceRow}>
            {SERVICES.map((sv) => {
              const gap = source ? !have.includes(sv.id) : false;
              return (
                <button
                  key={sv.id}
                  type="button"
                  className={`${s.service} ${gap ? s.serviceGap : ""}`}
                  onClick={() => setSheet(sv.id)}
                >
                  <span className={s.serviceIcon} aria-hidden>
                    <sv.Icon />
                  </span>
                  <span className={s.serviceName}>{sv.name}</span>
                  <span className={s.serviceRole}>{sv.role}</span>
                  <span className={s.serviceArrow} aria-hidden>
                    <ArrowIcon size={12} />
                  </span>
                  {gap
                    ? <span className={s.serviceBadge}>nedostaje</span>
                    : null}
                </button>
              );
            })}
          </div>
        </Chapter>

        {/* 04 gap */}
        <Chapter n="04" title="Gde je rupa" width="320px">
          <article className={`${s.card} ${s.gap}`}>
            <span className={s.eyebrowLight}>
              {source ? "Vaš slučaj" : "Čeka odgovor"}
            </span>
            <p className={s.gapTitle}>
              {source ? source.gapTitle : "Svaki izvor ima svoju rupu."}
            </p>
            <p className={s.gapBody}>
              {source
                ? source.gap
                : "Recite nam odakle vam stižu i reći ćemo koja je vaša."}
            </p>
          </article>
        </Chapter>

        {/* 05 proof — flip */}
        <Chapter n="05" title="Neko je već bio tu" width="360px">
          {matched
            ? <FlipCard
                client={matched}
                flipped={flipped}
                onFlip={() => setFlipped((v) => !v)}
              />
            : null}
          <a href="/projects" className={`${s.card} ${s.allLink}`}>
            Svi projekti
            <span className={s.round}>
              <ArrowIcon />
            </span>
          </a>
        </Chapter>

        {/* 06 objection */}
        <Chapter n="06" title="Pomislićete" width="300px">
          <article className={`${s.card} ${s.objection}`}>
            <span className={s.quoteMark} aria-hidden>
              „
            </span>
            <p className={s.objQ}>
              {source
                ? source.objection[0]
                : "Radi nam i ovako, zašto bih menjao?"}
            </p>
            <p className={s.objA}>
              {source
                ? source.objection[1]
                : "Zavisi odakle vam klijenti stižu. Odgovorite na pitanje."}
            </p>
          </article>
        </Chapter>

        {/* 07 process */}
        <Chapter n="07" title="Kako radimo" width="320px">
          <article className={`${s.card} ${s.process}`}>
            <ol className={s.stepList}>
              {STEPS.map(([title, note], i) => (
                <li key={title} className={s.stepItem}>
                  <span className={s.stepNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={s.stepTitle}>{title}</span>
                    <span className={s.stepNote}>
                      {i === 0 && source
                        ? `Počinjemo od toga zašto ${source.label.toLowerCase()} više ne nosi sama.`
                        : note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </Chapter>

        {/* 08 sitnice */}
        <Chapter n="08" title="Sitnice" width="560px">
          <div className={s.tileRow}>
            <AskTile />
            <ClockTile />
            <BuzzTile />
          </div>
        </Chapter>

        {/* 09 blog */}
        <Chapter n="09" title="Blog" width="290px">
          <div className={s.postCol}>
            {posts.map((a) => (
              <a
                key={a.slug}
                href={`/journal/${a.slug}`}
                className={`${s.card} ${s.post}`}
              >
                <span className={s.postTitle}>{a.title}</span>
                <span className={s.postFoot}>
                  <span className={s.smallNote}>
                    {formatDate(a.publishedAt)}
                  </span>
                  <span className={s.round}>
                    <ArrowIcon />
                  </span>
                </span>
              </a>
            ))}
            <a href="/journal" className={`${s.card} ${s.allLink}`}>
              Svi tekstovi
              <span className={s.round}>
                <ArrowIcon />
              </span>
            </a>
          </div>
        </Chapter>

        {/* 10 contact */}
        <Chapter n="10" title="Kontakt" width="360px">
          <ContactCard prefill={source?.prefill ?? ""} />
        </Chapter>
      </div>

      <ServiceSheet
        service={openSheet}
        gap={openSheet && source ? !have.includes(openSheet.id) : false}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
