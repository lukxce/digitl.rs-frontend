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

const ASK = [
  "Zašto Google Ads troši budžet na vaš brend",
  "Treba li vam SEO ili samo brži sajt",
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
    <article className={`${s.card} ${s.filler}`}>
      <span className={s.eyebrow}>Srbija · GMT+2</span>
      <p className={s.clockTime} suppressHydrationWarning>
        {now ? `${now.hh}:${now.mm}` : "--:--"}
      </p>
      <span className={s.muted}>{line}</span>
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
    <article className={`${s.card} ${s.filler}`}>
      <span className={s.eyebrow}>Nećete čuti od nas</span>
      <p className={s.buzzWord} key={NECE_SE_CUTI[i]}>
        {NECE_SE_CUTI[i]}
      </p>
    </article>
  );
}

function AskTile() {
  const [i, setI] = useState(0);
  return (
    <article className={`${s.card} ${s.filler}`}>
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
                  sizes="330px"
                  className={s.caseImg}
                />
              </span>
            : null}
          <div className={s.caseRow}>
            <span className={s.caseText}>
              <span className={s.strong}>{client.clientName}</span>
              <span className={s.muted}>{client.category}</span>
            </span>
            <button
              type="button"
              className={s.caseFlip}
              onClick={() => setFlipped(true)}
              aria-label="Rezultati"
            >
              <ArrowIcon size={13} />
            </button>
          </div>
        </article>

        <article className={`${s.card} ${s.face} ${s.caseBack}`}>
          <span className={s.faceTag}>Posle</span>
          <div className={s.metricRow}>
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
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sheet, setSheet] = useState(null);
  const [showAll, setShowAll] = useState(false);
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

      <div className={s.viewport}>
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
            <Chapter n="01" title="Digitl" width="392px">
              <article className={`${s.card} ${s.badge}`}>
                <span className={s.lanyard} aria-hidden>
                  <span className={s.lanyardStrap} />
                  <span className={s.lanyardClip} />
                </span>
                <span className={s.hole} aria-hidden />

                <div className={s.badgeTop}>
                  <span className={s.avatar} aria-hidden />
                  <span className={s.who}>
                    <span className={s.name}>digitl</span>
                    <span className={s.muted}>Marketing kao jedan sistem</span>
                  </span>
                  <span className={s.available}>
                    <span className={s.pulse} aria-hidden />
                    Srbija
                  </span>
                </div>

                <h1 className={s.headline}>
                  Marketing koji donosi prave rezultate.
                </h1>
                <p className={s.lede}>
                  Plaćeno oglašavanje, web, SEO i brend — povezani, i mereni na
                  istom mestu.
                </p>

                <div className={s.badgeBottom}>
                  <p className={s.location}>
                    Radimo sa firmama koje se mere <strong>rezultatom</strong>,
                    ne utiskom.
                  </p>
                </div>
              </article>
            </Chapter>

            {/* 02 ─ quiz, with the clock filling the slack */}
            <Chapter n="02" title="Tri pitanja" width="318px">
              <article className={`${s.card} ${s.quiz}`}>
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
                {done
                  ? <div className={s.quizDone}>
                      <p className={s.quizDoneTitle}>Gotovo.</p>
                      <span className={s.muted}>Preporuka je spremna.</span>
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
                    </>}
              </article>
              <ClockTile />
            </Chapter>

            {/* 03 ─ recommendation, flipping to all services */}
            <Chapter n="03" title="Ovo vam treba" width="336px">
              <div
                className={`${s.flip} ${s.flipTall} ${showAll ? s.flipped : ""}`}
                data-anchor="result"
              >
                <div className={s.flipInner}>
                  <div className={`${s.face} ${s.resultFace}`}>
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
                      : <article className={`${s.card} ${s.resultEmpty}`}>
                          <span className={s.eyebrow}>Čeka odgovore</span>
                          <p className={s.resultEmptyText}>
                            Odgovorite na tri pitanja i reći ćemo odakle da se
                            krene.
                          </p>
                        </article>}
                    <button
                      type="button"
                      className={s.allServices}
                      onClick={() => setShowAll(true)}
                    >
                      Sve usluge{" "}
                      <span className={s.iconCircleSm}>
                        <ArrowIcon size={11} />
                      </span>
                    </button>
                  </div>

                  <div className={`${s.face} ${s.allFace}`}>
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
                                <span className={s.strong}>{sv.name}</span>
                                <span className={s.muted}>{sv.role}</span>
                              </span>
                              <ArrowIcon size={11} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className={s.chip}
                        onClick={() => setShowAll(false)}
                      >
                        Nazad na preporuku
                      </button>
                    </article>
                  </div>
                </div>
              </div>
            </Chapter>

            {/* 04 ─ gap, small, with the buzz tile under it */}
            <Chapter n="04" title="Gde je rupa" width="266px">
              <article className={`${s.card} ${s.gap}`}>
                <span className={s.eyebrowLight}>
                  {first ? "Vaš slučaj" : "Čeka odgovor"}
                </span>
                <p className={s.gapTitle}>
                  {first ? first.gap : "Svaki izvor klijenata ima svoju rupu."}
                </p>
              </article>
              <BuzzTile />
            </Chapter>

            {/* 05 ─ two case studies, stacked */}
            <Chapter n="05" title="Projekti" width="330px">
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

            {/* 06 ─ testimonial (small) + ask tile */}
            <Chapter n="06" title="Šta kažu" width="296px">
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
              <AskTile />
            </Chapter>

            {/* 07 ─ process */}
            <Chapter n="07" title="Kako radimo" width="282px">
              <article className={`${s.card} ${s.process}`}>
                <ol className={s.stepList}>
                  {STEPS.map(([title, note], i) => (
                    <li key={title} className={s.stepItem}>
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
            </Chapter>

            {/* 08 ─ book small + independent social tiles */}
            <Chapter n="08" title="Zakažite" width="300px">
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

            {/* 09 ─ blog, three */}
            <Chapter n="09" title="Blog" width="276px">
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

            {/* 10 ─ contact */}
            <Chapter n="10" title="Kontakt" width="320px">
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
