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
 * digitl.rs homepage concept: a short diagnostic instead of a brochure.
 *
 * Three questions decide which services are recommended; everything after
 * reacts to the answers. Card sizes are driven by content rather than by
 * the column, and the whole thing previews at phone width via the toggle.
 */

const SERVICES = {
  ads: {
    Icon: IconProduct,
    name: "Plaćeno oglašavanje",
    role: "Saobraćaj danas.",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    feeds: "Hrani web upitima, a SEO podacima o tome šta ljudi stvarno traže.",
  },
  seo: {
    Icon: IconStrategy,
    name: "SEO",
    role: "Saobraćaj koji ne plaćate.",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    feeds: "Snižava cenu plaćenog klika i drži upite kad se kampanja ugasi.",
  },
  web: {
    Icon: IconWeb,
    name: "Web",
    role: "Poseta postaje upit.",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    feeds: "Bez njega svaki drugi kanal plaća za posetu koja ne postane poziv.",
  },
  social: {
    Icon: IconMotion,
    name: "Društvene mreže",
    role: "Prisutnost između kupovina.",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    feeds: "Čini da vas kupac prepozna kad vas nađe u pretrazi ili oglasu.",
  },
  brand: {
    Icon: IconBrand,
    name: "Brend",
    role: "Sve ostalo košta manje.",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    feeds: "Isti oglas, ista pozicija, veći procenat klikova. To je brend.",
  },
};

/**
 * Three questions. Each option adds weight to services and can carry a
 * diagnosis line; the highest-weighted three become the recommendation.
 */
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
        gap: "Preporuka ima plafon. Radi dok se krug poznanstava ne iscrpi, a onda novih poziva nema odakle.",
      },
      {
        id: "placeno",
        label: "Plaćeni oglasi",
        w: { seo: 3, brand: 2 },
        match: "thermiq",
        gap: "Plaćeno radi dok plaćate. Bez organskog dela cena upita raste svake godine.",
      },
      {
        id: "organski",
        label: "Google, organski",
        w: { ads: 3, social: 2 },
        match: "servis-klime-nis",
        gap: "Organski donosi, ali nema ručicu za tempo kad vam treba više upita ovog meseca.",
      },
      {
        id: "mreze",
        label: "Društvene mreže",
        w: { seo: 3, web: 2 },
        match: "thermiq",
        gap: "Mreže grade poznatost, ne nameru. Kupac spreman da kupi pretražuje, ne skroluje.",
      },
      {
        id: "nista",
        label: "Ne merimo",
        w: { web: 3, seo: 2, ads: 2 },
        match: "elektromil",
        gap: "Bez merenja je svaka odluka o budžetu nagađanje. To je prvi problem i najjeftiniji.",
      },
    ],
  },
  {
    id: "sajt",
    q: "Kakav vam je sajt?",
    options: [
      { id: "nemamo", label: "Nemamo ga", w: { web: 4, brand: 2 } },
      { id: "star", label: "Star je i spor", w: { web: 3, seo: 1 } },
      {
        id: "ok",
        label: "Solidan, ali ne donosi upite",
        w: { web: 2, ads: 1 },
      },
      { id: "dobar", label: "Zadovoljni smo njime", w: { ads: 1, seo: 1 } },
    ],
  },
  {
    id: "cilj",
    q: "Šta vam treba u sledećih šest meseci?",
    options: [
      { id: "brzo", label: "Upiti što pre", w: { ads: 4, web: 2 } },
      {
        id: "stabilno",
        label: "Stabilan priliv bez plaćanja klikova",
        w: { seo: 4, web: 1 },
      },
      {
        id: "poznatost",
        label: "Da nas ljudi prepoznaju",
        w: { brand: 4, social: 3 },
      },
      {
        id: "sve",
        label: "Sve odjednom, ne znam odakle",
        w: { web: 2, seo: 2, ads: 2, brand: 1 },
      },
    ],
  },
];

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Prioriteti, kanali i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i odluke o sledećem koraku."],
];

const ASK = [
  "Zašto vam Google Ads troši budžet na sopstveni brend",
  "Da li vam treba SEO ili samo brži sajt",
  "Koliko vas stvarno košta jedan upit",
  "Zašto konkurent sa gorim sajtom rangira bolje",
  "Zašto saobraćaj raste, a prodaja ne",
];

const NECE_SE_CUTI = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
];

/* ── primitives ──────────────────────────────────────────── */

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
      const p = Math.min(1, (t - t0) / 900);
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

/* ── chrome ──────────────────────────────────────────────── */

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

function DeviceToggle({ device, onToggle }) {
  const phone = device === "phone";
  return (
    <button
      type="button"
      className={s.chrome}
      onClick={onToggle}
      aria-pressed={phone}
      title="Pregled na telefonu"
    >
      {phone
        ? <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <rect
              x="2"
              y="4"
              width="20"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.9"
            />
            <path
              d="M8 21h8"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
        : <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <rect
              x="6"
              y="2"
              width="12"
              height="20"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.9"
            />
            <path
              d="M11 18.5h2"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>}
      {phone ? "Desktop" : "Telefon"}
    </button>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const [sysDark, setSysDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setSysDark(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  const dark = theme === "dark" || (theme === "auto" && sysDark);
  return (
    <button
      type="button"
      className={s.chromeIcon}
      onClick={onToggle}
      aria-label={dark ? "Svetla tema" : "Tamna tema"}
    >
      {dark
        ? <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        : <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="4.4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>}
    </button>
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
          Pitajte nas o ovome
          <span className={s.iconCircle}>
            <ArrowIcon size={13} />
          </span>
        </a>
      </div>
    </div>
  );
}

/* ── case study, flipping ────────────────────────────────── */

function CaseCard({ client }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`${s.flip} ${flipped ? s.flipped : ""}`}>
      <div className={s.flipInner}>
        <article className={`${s.card} ${s.face} ${s.caseFront}`}>
          {client.cover
            ? <span className={s.caseShot}>
                <Image
                  src={client.cover}
                  alt={client.clientName}
                  fill
                  sizes="340px"
                  className={s.caseImg}
                />
              </span>
            : null}
          <div className={s.caseText}>
            <span className={s.caseClient}>{client.clientName}</span>
            <span className={s.caseCat}>{client.category}</span>
            <p className={s.caseBefore}>{client.before}</p>
          </div>
          <button
            type="button"
            className={s.caseFlip}
            onClick={() => setFlipped(true)}
          >
            Šta je bilo posle
            <span className={s.iconCircleSm}>
              <ArrowIcon size={11} />
            </span>
          </button>
        </article>

        <article className={`${s.card} ${s.face} ${s.caseBack}`}>
          <span className={s.faceTag}>Posle</span>
          <span className={s.caseClientLight}>{client.clientName}</span>
          <div className={s.metricStack}>
            {client.after.map((m) => (
              <span key={m.label} className={s.metric}>
                <span className={s.metricValue}>
                  <CountUp value={m.value} run={flipped} />
                </span>
                <span className={s.metricLabel}>{m.label}</span>
              </span>
            ))}
          </div>
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

/* ── scattered small tiles ───────────────────────────────── */

function AskTile() {
  const [i, setI] = useState(0);
  return (
    <article className={`${s.card} ${s.tile} ${s.tileAsk}`}>
      <span className={s.eyebrow}>Pitajte nas o</span>
      <p className={s.askText}>{ASK[i]}</p>
      <button
        type="button"
        className={s.chip}
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
        ? "Prerano. Kampanje rade."
        : now.h < 17
          ? "Radimo. Javite se."
          : now.h < 22
            ? "Još gledamo izveštaje."
            : "Spavamo. Google Ads ne.";
  return (
    <article className={`${s.card} ${s.tile} ${s.tileClock}`}>
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
    <article className={`${s.card} ${s.tile} ${s.tileBuzz}`}>
      <span className={s.eyebrow}>Nećete čuti od nas</span>
      <p className={s.buzzWord} key={NECE_SE_CUTI[i]}>
        {NECE_SE_CUTI[i]}
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
          Pošaljite{" "}
          <span className={s.iconCircleBlue}>
            <ArrowIcon />
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

  // Weighted tally across every answer; top three become the recommendation.
  const scores = {};
  for (const o of picked) {
    for (const [k, v] of Object.entries(o.w)) scores[k] = (scores[k] ?? 0) + v;
  }
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

  function answer(qid, oid) {
    setAnswers((a) => ({ ...a, [qid]: oid }));
    if (step < QUIZ.length - 1) setStep(step + 1);
    else
      requestAnimationFrame(() => {
        const el = trackRef.current;
        const t = el?.querySelector("[data-anchor=result]");
        if (el && t)
          el.scrollTo({ left: t.offsetLeft - 30, behavior: "smooth" });
      });
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  const q = QUIZ[step];

  return (
    <div
      className={s.stage}
      ref={stageRef}
      data-bento
      data-device={device}
      data-theme={theme}
    >
      <div className={s.chromeBar}>
        <DeviceToggle
          device={device}
          onToggle={() => setDevice(device === "phone" ? "desktop" : "phone")}
        />
        <ThemeToggle
          theme={theme}
          onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>

      <div className={s.viewport}>
        <div className={s.inner}>
          <div className={s.wash} aria-hidden />

          <header className={s.bar}>
            <Image
              src="/digitl-logo.png"
              alt="digitl"
              width={80}
              height={22}
              className={s.logo}
              priority
            />
            {done
              ? <button type="button" className={s.reset} onClick={reset}>
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
            {/* 01 ─ hero, with the lanyard badge */}
            <Chapter n="01" title="Digitl" width="390px">
              <article className={`${s.card} ${s.hero}`}>
                <span className={s.lanyard} aria-hidden>
                  <span className={s.lanyardStrap} />
                  <span className={s.lanyardClip} />
                </span>
                <span className={s.hole} aria-hidden />
                <span className={s.heroGlow} aria-hidden />
                <h1 className={s.heroTitle}>
                  Marketing koji donosi <em>prave</em> rezultate.
                </h1>
                <p className={s.heroBody}>
                  Kompletan marketing kao jedan sistem, ne meni nepovezanih
                  usluga.
                </p>
                <div className={s.heroRow}>
                  <a className={s.btnPrimary} href="#kontakt">
                    Zakažite razgovor{" "}
                    <span className={s.iconCircle}>
                      <ArrowIcon size={12} />
                    </span>
                  </a>
                  <a className={s.btnGhost} href="/#usluge">
                    Sve usluge
                  </a>
                </div>
              </article>
            </Chapter>

            {/* 02 ─ the quiz */}
            <Chapter n="02" title="Tri pitanja" width="340px">
              <article className={`${s.card} ${s.quiz}`}>
                <div className={s.quizTop}>
                  <span className={s.eyebrow}>
                    Pitanje {Math.min(step + 1, QUIZ.length)} / {QUIZ.length}
                  </span>
                  <div className={s.pips} aria-hidden>
                    {QUIZ.map((qq, i) => (
                      <span
                        key={qq.id}
                        className={`${s.pip} ${answers[qq.id] ? s.pipDone : ""} ${i === step && !done ? s.pipNow : ""}`}
                      />
                    ))}
                  </div>
                </div>

                {done
                  ? <div className={s.quizDone}>
                      <p className={s.quizDoneTitle}>Gotovo.</p>
                      <p className={s.smallNote}>Preporuka je desno.</p>
                      <button type="button" className={s.chip} onClick={reset}>
                        Ispočetka
                      </button>
                    </div>
                  : <>
                      <h2 className={s.quizQ} key={q.id}>
                        {q.q}
                      </h2>
                      <div className={s.options}>
                        {q.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            className={`${s.option} ${answers[q.id] === o.id ? s.optionOn : ""}`}
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
                    </>}
              </article>
            </Chapter>

            {/* 03 ─ the recommendation */}
            <Chapter n="03" title="Ovo vam treba" width="360px">
              <div className={s.resultCol} data-anchor="result">
                {done
                  ? <>
                      <div className={s.recGrid}>
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
                              <span className={s.recName}>{sv.name}</span>
                              <span className={s.recRole}>{sv.role}</span>
                              {i === 0
                                ? <span className={s.recBadge}>prvo ovo</span>
                                : null}
                              <span className={s.recArrow} aria-hidden>
                                <ArrowIcon size={11} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <a className={s.allServices} href="/#usluge">
                        Pogledajte sve usluge{" "}
                        <span className={s.iconCircleSm}>
                          <ArrowIcon size={11} />
                        </span>
                      </a>
                    </>
                  : <article className={`${s.card} ${s.resultEmpty}`}>
                      <span className={s.eyebrow}>Čeka odgovore</span>
                      <p className={s.resultEmptyText}>
                        Odgovorite na tri pitanja i reći ćemo odakle da se
                        krene.
                      </p>
                      <div className={s.ghostGrid} aria-hidden>
                        {[0, 1, 2].map((i) => (
                          <span key={i} className={s.ghostCard} />
                        ))}
                      </div>
                    </article>}
              </div>
            </Chapter>

            {/* 04 ─ the gap */}
            <Chapter n="04" title="Gde je rupa" width="280px">
              <article className={`${s.card} ${s.gap}`}>
                <span className={s.eyebrowLight}>
                  {first ? "Vaš slučaj" : "Čeka odgovor"}
                </span>
                <p className={s.gapTitle}>
                  {first ? first.gap : "Svaki izvor klijenata ima svoju rupu."}
                </p>
              </article>
            </Chapter>

            {/* 05 ─ two case studies with images */}
            <Chapter n="05" title="Neko je već bio tu" width="700px">
              <div className={s.caseRow}>
                {cases.map((c) => (
                  <CaseCard key={c.slug} client={c} />
                ))}
              </div>
            </Chapter>

            {/* 06 ─ testimonials */}
            <Chapter n="06" title="Šta kažu" width="330px">
              {testimonials.length > 0
                ? <div className={s.quoteCol}>
                    {testimonials.slice(0, 2).map((t) => (
                      <article key={t.name} className={`${s.card} ${s.quote}`}>
                        <span className={s.quoteMark} aria-hidden>
                          ”
                        </span>
                        <p className={s.quoteBody}>{t.body}</p>
                        <span className={s.quoteWho}>
                          <span className={s.quoteAvatar} aria-hidden>
                            {t.name.slice(0, 1)}
                          </span>
                          <span>
                            <span className={s.quoteName}>{t.name}</span>
                            <span className={s.quoteRole}>{t.role}</span>
                          </span>
                        </span>
                      </article>
                    ))}
                  </div>
                : <article className={`${s.card} ${s.quoteEmpty}`}>
                    <span className={s.quoteMark} aria-hidden>
                      ”
                    </span>
                    <p className={s.quoteBody}>
                      Ovde idu prave preporuke klijenata.
                    </p>
                    <span className={s.smallNote}>
                      Postojeće na sajtu su šablonske (Jessica Stone, John
                      Carter…) i nisu vaši klijenti, pa nisu prenete. Pošaljite
                      dve rečenice od ThermiQ-a ili Moler Niša i staju ovde.
                    </span>
                  </article>}
            </Chapter>

            {/* 07 ─ process */}
            <Chapter n="07" title="Kako radimo" width="290px">
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
                          {i === 0 && first
                            ? `Počinjemo od toga zašto ${first.label.toLowerCase()} više ne nosi sama.`
                            : note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            </Chapter>

            {/* 08 ─ scattered small tiles */}
            <Chapter n="08" title="Sitnice" width="420px">
              <div className={s.scatter}>
                <AskTile />
                <ClockTile />
                <BuzzTile />
              </div>
            </Chapter>

            {/* 09 ─ book + follow */}
            <Chapter n="09" title="Zakažite" width="320px">
              <div className={s.bookCol}>
                <article className={`${s.card} ${s.book}`}>
                  <span className={s.eyebrowLight}>30 minuta</span>
                  <p className={s.bookTitle}>Besplatan prvi razgovor.</p>
                  <p className={s.bookNote}>
                    Pogledamo brojeve i kažemo šta je prioritet. Bez obaveze.
                  </p>
                  <div className={s.bookRow}>
                    <a
                      className={s.btnLight}
                      href={`mailto:${CONTACT.email}?subject=Zakazivanje razgovora`}
                    >
                      <MailIcon /> Zakažite
                    </a>
                    <a className={s.btnLightGhost} href={`tel:${CONTACT.tel}`}>
                      <PhoneIcon /> Pozovite
                    </a>
                  </div>
                </article>
                <article className={`${s.card} ${s.follow}`}>
                  <span className={s.eyebrow}>Pratite nas</span>
                  <div className={s.followRow}>
                    <a
                      className={s.followLink}
                      href="https://www.instagram.com/digitl.rs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                    <a
                      className={s.followLink}
                      href="https://www.linkedin.com/company/digitl-rs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                    <a
                      className={s.followLink}
                      href="https://digitl.me"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      digitl.me
                    </a>
                  </div>
                </article>
              </div>
            </Chapter>

            {/* 10 ─ blog */}
            <Chapter n="10" title="Blog" width="270px">
              <div className={s.postCol}>
                {articles.slice(0, 2).map((a) => (
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
              </div>
            </Chapter>

            {/* 11 ─ contact */}
            <Chapter n="11" title="Kontakt" width="330px">
              <ContactCard
                prefill={
                  first
                    ? `Klijenti nam stižu preko: ${first.label.toLowerCase()}.`
                    : ""
                }
              />
            </Chapter>
          </div>
        </div>
      </div>

      <ServiceSheet
        id={sheet}
        recommended={sheet ? recommended.includes(sheet) : false}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
