"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./webCard.module.css";

/* The hero's web card. A slow old site (a spinner, a page that jumps as it
   loads, 4,8 s) is rebuilt block by block into a fast one: structure, copy,
   a contact form, then the speed score climbs to 100 and a visitor sends an
   enquiry. Everything is generic ("Vaša firma", "vasafirma.rs"); the reader
   can type their own company name and watch the same rebuild. On phones the
   browser is shorter and the site shows its phone layout (no form, no
   reviews), so the visitor taps "Pozovite" instead. */

const NAME = "Vaša firma";

const SETS = [
  {
    key: null,
    kicker: "Usluge za dom i firmu",
    line: "brzo, uredno, sa cenom unapred",
    sub: "Dolazimo isti dan. Cene i radovi su na sajtu.",
    tiles: [
      ["Usluge", "Šta radimo"],
      ["Cenovnik", "Cene unapred"],
      ["Radovi", "Pre i posle"],
    ],
    tone: "blue",
  },
  {
    key: /klim|frigo|grej|toplot|termo/,
    kicker: "Klima servis",
    line: "montaža i servis, sa cenom unapred",
    sub: "Dolazimo isti dan, u celom gradu.",
    tiles: [
      ["Montaža", "Za stan i lokal"],
      ["Servis", "Isti dan"],
      ["Čišćenje", "I dezinfekcija"],
    ],
    tone: "blue",
  },
  {
    key: /zub|dent|stomat|osmeh|ordinac/,
    kicker: "Stomatološka ordinacija",
    line: "pregled bez čekanja, cena unapred",
    sub: "Termini i subotom. Zakažite online.",
    tiles: [
      ["Pregled", "Bez čekanja"],
      ["Popravke", "Bez bola"],
      ["Estetika", "Beljenje zuba"],
    ],
    tone: "lime",
  },
  {
    key: /advok|pravn|kancelar/,
    kicker: "Advokatska kancelarija",
    line: "jasan savet i jasna cena",
    sub: "Prvi razgovor zakazujete online.",
    tiles: [
      ["Savet", "Prvi razgovor"],
      ["Ugovori", "Izrada i provera"],
      ["Zastupanje", "Pred sudom"],
    ],
    tone: "ink",
  },
  {
    key: /frizer|salon|lepot|kozmet|nokt|beauty|spa\b/,
    kicker: "Salon lepote",
    line: "termin online, bez čekanja",
    sub: "Slobodni termini su uvek na sajtu.",
    tiles: [
      ["Šišanje", "Za nju i njega"],
      ["Farbanje", "Sa savetom"],
      ["Nega", "Kosa i koža"],
    ],
    tone: "coral",
  },
  {
    key: /restoran|pica|pizz|kafe|kafan|pekar|hrana|ketering|bistro|poslast/,
    kicker: "Hrana i dostava",
    line: "sveže svaki dan, dostava do vrata",
    sub: "Meni i cene su na sajtu. Naručite online.",
    tiles: [
      ["Meni", "Sa cenama"],
      ["Dostava", "Do vrata"],
      ["Proslave", "Po dogovoru"],
    ],
    tone: "coral",
  },
  {
    key: /elektr|struj|instal/,
    kicker: "Električar",
    line: "dolazak isti dan, cena unapred",
    sub: "Hitne intervencije i u toku vikenda.",
    tiles: [
      ["Intervencije", "Isti dan"],
      ["Instalacije", "Stan i lokal"],
      ["Rasveta", "Unutra i spolja"],
    ],
    tone: "lime",
  },
];
// the examples the card runs through by itself
const AUTO = [0, 1, 2, 3];

const STEPS = ["Struktura", "Tekstovi", "Forma", "Brzina", "Praćenje"];
const STOP = Symbol("stop");
const SPRING = { type: "spring", stiffness: 320, damping: 28, mass: 0.9 };
const POP = { type: "spring", stiffness: 420, damping: 20 };
const EASE = [0.16, 1, 0.3, 1];
// load times in tenths of a second: the old site 4,8 s, the new one 0,9 s
const SLOW = 48;
const FAST = 9;
const START_SCORE = 31;
// 31 to 100 with an ease out, so the count slows as it lands
const SCORES = Array.from({ length: 18 }, (_, i) =>
  Math.round(START_SCORE + (100 - START_SCORE) * (1 - (1 - (i + 1) / 18) ** 3)),
);

const PLAIN = { č: "c", ć: "c", š: "s", ž: "z", đ: "dj" };
function domainOf(name) {
  const out = name
    .toLowerCase()
    .replace(/[čćšžđ]/g, (m) => PLAIN[m])
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 22);
  return `${out || "vasafirma"}.rs`;
}

function clean(raw) {
  const q = raw.trim().replace(/\s+/g, " ");
  return q.charAt(0).toUpperCase() + q.slice(1);
}

function pickSet(name) {
  const low = name.toLowerCase();
  return SETS.find((set) => set.key?.test(low)) ?? SETS[0];
}

function secs(v) {
  return `${Math.floor(v / 10)},${v % 10} s`;
}

/* ── icons ─────────────────────────────────────────────────────────── */

function StoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 9.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.2 4.6 4.7A1 1 0 0 1 5.5 4h13a1 1 0 0 1 .9.7L21 9.2a2.9 2.9 0 0 1-5.7.6 3.3 3.3 0 0 1-6.6 0A2.9 2.9 0 0 1 3 9.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 20v-4.5a2 2 0 0 1 4 0V20"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function Pointer() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 4.5v9.2l-1.6-1.5a1.8 1.8 0 0 0-2.6 2.5l4.6 5a4 4 0 0 0 3 1.3h2.8a4.3 4.3 0 0 0 4.3-4.3v-4.4a1.6 1.6 0 0 0-3.2 0V11a1.6 1.6 0 0 0-3.2-.6V10a1.6 1.6 0 0 0-3.2 0V4.5a1.5 1.5 0 0 0-3 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Lock() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10.5"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"
        stroke="currentColor"
        strokeWidth="2.4"
      />
    </svg>
  );
}

function Bolt() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M13.5 2 5 13.5h6L10 22l9-12.2h-6.2L13.5 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Clock() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2.6" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Monitor() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4.5"
        width="18"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9 20h6M12 16.5V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Mobile() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="6.5"
        y="2.5"
        width="11"
        height="19"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10.5 18.5h3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Call() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3.2 8.9 3a1.5 1.5 0 0 1 1.5 1l1 2.9a1.5 1.5 0 0 1-.4 1.6L9.4 9.8a12 12 0 0 0 4.8 4.8l1.3-1.6a1.5 1.5 0 0 1 1.6-.4l2.9 1a1.5 1.5 0 0 1 1 1.5l-.2 2.3a2.2 2.2 0 0 1-2.3 2A16.5 16.5 0 0 1 4.6 5.5a2.2 2.2 0 0 1 2-2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Mail() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Star() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 2.8 2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3-4.6-4.4 6.3-.8L12 2.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Broken() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 15V5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5V12M20 17v1.5a1.5 1.5 0 0 1-1.5 1.5H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="m4 15 4-4 3 3M14 12l2.5-2.5L20 13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m3 21 18-18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TILE_ICONS = [
  <svg key="a" width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5c.6 4.6 2.9 6.9 7.5 7.5-4.6.6-6.9 2.9-7.5 7.5-.6-4.6-2.9-6.9-7.5-7.5 4.6-.6 6.9-2.9 7.5-7.5Z"
      fill="currentColor"
    />
    <circle cx="19" cy="19" r="2.2" fill="currentColor" />
  </svg>,
  <svg
    key="b"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3.5 12.6V4.5a1 1 0 0 1 1-1h8.1a1 1 0 0 1 .7.3l7.2 7.2a1.5 1.5 0 0 1 0 2.1l-7.3 7.3a1.5 1.5 0 0 1-2.1 0l-7.3-7.2a1 1 0 0 1-.3-.6Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="8.5" r="1.8" fill="currentColor" />
  </svg>,
  <svg
    key="c"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="3"
      stroke="currentColor"
      strokeWidth="2.4"
    />
    <path
      d="m3.5 16.5 5-5 4 4 2.5-2.5 5 5"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />
  </svg>,
];

/* ── card ──────────────────────────────────────────────────────────── */

export default function WebCard() {
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(NAME);
  const [name, setName] = useState(NAME);
  const [set, setSet] = useState(SETS[0]);
  const [run, setRun] = useState(0);
  const [site, setSite] = useState("old");
  const [old, setOld] = useState(0);
  const [step, setStep] = useState(0);
  const [load, setLoad] = useState({ s: "run", v: 0 });
  const [line, setLine] = useState("slow");
  const [score, setScore] = useState(null);
  const [cur, setCur] = useState({
    x: 0,
    y: 0,
    on: false,
    press: false,
    jump: true,
  });
  const [hit, setHit] = useState(null);
  const [toast, setToast] = useState(false);
  const [view, setView] = useState("desktop");
  const [user, setUser] = useState(false);
  const [asked, setAsked] = useState(false);

  const root = useRef(null);
  const pageRef = useRef(null);
  const ctaRef = useRef(null);
  const sendRef = useRef(null);
  const inputRef = useRef(null);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const typedRef = useRef(NAME);
  const userRef = useRef(false);

  const type = (v) => {
    typedRef.current = v;
    setTyped(v);
  };

  /* A pause that also holds while the card is off screen, and gives up as
     soon as a newer run has started. */
  const napper = (t) => (ms) =>
    new Promise((resolve, reject) => {
      const check = () => {
        if (t !== token.current) return reject(STOP);
        if (!visible.current) {
          wakers.current.push(check);
          return;
        }
        resolve();
      };
      setTimeout(check, ms);
    });

  // where the visitor clicks: the form's button, or "Pozovite" when the
  // site shows its phone layout (no form)
  const aim = () => {
    const page = pageRef.current;
    if (!page) return { x: 0, y: 0, sx: 0, sy: 0, target: "cta" };
    const box = page.getBoundingClientRect();
    const send = sendRef.current;
    const useSend = Boolean(send && send.offsetParent !== null);
    const el = useSend ? send : ctaRef.current;
    const r = el ? el.getBoundingClientRect() : box;
    return {
      x: r.left - box.left + r.width * 0.62,
      y: r.top - box.top + r.height * 0.58,
      sx: box.width * 0.82,
      sy: box.height + 26,
      target: useSend ? "send" : "cta",
    };
  };

  const finish = (nm, st) => {
    setName(nm);
    setSet(st);
    setSite("new");
    setOld(5);
    setStep(STEPS.length + 1);
    setLoad({ s: "fast", v: FAST });
    setLine(null);
    setScore(100);
    setHit(null);
    setToast(true);
    setCur((c) => ({ ...c, on: false, press: false }));
  };

  const play = async (t, nm, st, { first = false, quick = false } = {}) => {
    const sleep = napper(t);
    if (!first) {
      setToast(false);
      setCur((c) => ({ ...c, on: false, press: false }));
      setSite("none");
      await sleep(440);
      setHit(null);
      setRun((r) => r + 1);
    }
    setName(nm);
    setSet(st);
    setStep(0);
    setOld(0);
    setScore(null);
    setLoad({ s: "run", v: 0 });
    setLine("slow");
    setSite("old");

    // the old site: a spinner, then blocks that pop in and push the page
    // around, 4,8 s in all
    const every = quick ? 2 : 1;
    const marks = quick
      ? { 4: 1, 12: 2, 22: 3, 32: 4 }
      : { 4: 1, 14: 2, 24: 3, 34: 4 };
    for (let v = every; v <= SLOW; v += every) {
      setLoad({ s: "run", v });
      if (marks[v]) setOld(marks[v]);
      await sleep(60);
    }
    setOld(5);
    setLoad({ s: "slow", v: SLOW });
    setLine(null);
    setScore(START_SCORE);
    await sleep(quick ? 800 : 1100);

    // rebuilt, block by block
    setSite("new");
    setLoad({ s: "build", v: SLOW });
    setStep(1);
    await sleep(950);
    setStep(2);
    await sleep(1000);
    setStep(3);
    await sleep(1000);

    // fast: the load time drops and the score climbs to 100
    setStep(4);
    setLine("fast");
    await sleep(280);
    setLoad({ s: "fast", v: FAST });
    for (const v of SCORES) {
      setScore(v);
      await sleep(40);
    }
    setLine(null);
    await sleep(700);

    // a visitor finds the button and gets in touch
    setStep(5);
    const p = aim();
    setCur({ x: p.sx, y: p.sy, on: false, press: false, jump: true });
    await sleep(60);
    setCur({ x: p.x, y: p.y, on: true, press: false, jump: false });
    await sleep(1050);
    setCur((c) => ({ ...c, press: true }));
    await sleep(170);
    setCur((c) => ({ ...c, press: false }));
    setHit(p.target);
    await sleep(220);
    setToast(true);
    setStep(STEPS.length + 1);
    await sleep(1100);
    setCur((c) => ({ ...c, on: false }));
  };

  // on screen or not: the auto play holds while hidden
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (!e.isIntersecting) return;
        const queued = wakers.current;
        wakers.current = [];
        for (const f of queued) f();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the example loop, until the reader takes over
  // biome-ignore lint/correctness/useExhaustiveDependencies: helpers only touch refs and setters
  useEffect(() => {
    if (reduce) {
      finish(clean(typedRef.current) || NAME, pickSet(typedRef.current));
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      let i = 0;
      for (;;) {
        await play(t, NAME, SETS[AUTO[i % AUTO.length]], { first: i === 0 });
        i += 1;
        await sleep(2300);
        if (userRef.current) return;
      }
    })().catch(() => {});
    return () => {
      if (token.current === t) token.current += 1;
    };
  }, [reduce]);

  useEffect(
    () => () => {
      token.current += 1;
    },
    [],
  );

  // the current rebuild finishes, then the card waits for the reader
  const takeOver = () => {
    if (userRef.current) return;
    userRef.current = true;
    setUser(true);
  };

  const onFocus = (e) => {
    takeOver();
    const el = e.currentTarget;
    requestAnimationFrame(() => el.select());
  };

  const submit = (e) => {
    e.preventDefault();
    takeOver();
    const nm = clean(typedRef.current);
    if (!nm) {
      inputRef.current?.focus();
      return;
    }
    type(nm);
    setAsked(true);
    inputRef.current?.blur();
    const t = ++token.current;
    const st = pickSet(nm);
    if (reduce) {
      finish(nm, st);
      return;
    }
    play(t, nm, st, { quick: true }).catch(() => {});
  };

  let tone = "wait";
  if (score !== null) {
    if (score < 50) tone = "low";
    else if (score < 90) tone = "mid";
    else tone = "high";
  }

  let hint = (
    <>
      <Pointer />
      <span className={s.long}>Upišite ime svoje firme</span>
      <span className={s.short}>Upišite ime firme</span>
    </>
  );
  if (asked)
    hint = (
      <>
        Sajt za <b>„{name}“</b>
      </>
    );
  else if (user) hint = "Pritisnite Enter ili Napravi";

  const letter = name.charAt(0).toUpperCase() || "V";

  return (
    <div className={s.stage} ref={root}>
      <div className={s.deck}>
        <div className={s.card}>
          <form className={s.bar} onSubmit={submit}>
            <span className={s.lens}>
              <StoreIcon />
            </span>
            <label className={s.field}>
              <span className={s.sr}>Ime firme</span>
              <input
                ref={inputRef}
                className={s.input}
                value={typed}
                onChange={(e) => {
                  takeOver();
                  type(e.target.value);
                }}
                onFocus={onFocus}
                placeholder="Ime vaše firme"
                enterKeyHint="go"
                autoComplete="off"
                spellCheck={false}
                maxLength={28}
              />
            </label>
            <button type="submit" className={s.go}>
              Napravi
            </button>
          </form>

          <div className={s.meta}>
            <span className={s.hint} data-user={user}>
              {hint}
            </span>
            <fieldset className={s.views}>
              <legend className={s.sr}>Prikaz sajta</legend>
              <button
                type="button"
                aria-pressed={view === "desktop"}
                title="Desktop"
                onClick={() => setView("desktop")}
              >
                <Monitor />
                <span className={s.sr}>Desktop</span>
              </button>
              <button
                type="button"
                aria-pressed={view === "phone"}
                title="Telefon"
                onClick={() => setView("phone")}
              >
                <Mobile />
                <span className={s.sr}>Telefon</span>
              </button>
            </fieldset>
            <span className={s.speed} data-tone={tone}>
              <svg className={s.ring} viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="10" cy="10" r="7" className={s.ringBg} />
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  pathLength="100"
                  className={s.ringFg}
                  style={{ strokeDashoffset: 100 - (score ?? 0) }}
                />
              </svg>
              Brzina
              <span className={s.speedNo}>
                <b>{score ?? "…"}</b>
              </span>
            </span>
          </div>

          <div className={s.main}>
            <div className={s.view} data-mode={view}>
              <div className={s.chrome}>
                <span className={s.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={s.addr}>
                  <Lock />
                  <span className={s.host}>{domainOf(name)}</span>
                </span>
                <span
                  className={s.time}
                  data-s={load.s}
                  title="Vreme učitavanja"
                >
                  {load.s === "run" || load.s === "build"
                    ? <i className={s.mini} />
                    : null}
                  {load.s === "slow" ? <Clock /> : null}
                  {load.s === "fast" ? <Bolt /> : null}
                  <motion.b
                    key={load.s === "fast" ? "fast" : "slow"}
                    initial={load.s === "fast" ? { scale: 0.5 } : false}
                    animate={{ scale: 1 }}
                    transition={POP}
                  >
                    {load.s === "build" ? "…" : secs(load.v)}
                  </motion.b>
                </span>
                <span className={s.line} data-on={line ?? "off"} />
              </div>

              <div className={s.page} ref={pageRef} aria-hidden="true">
                <AnimatePresence initial={false}>
                  {site === "old"
                    ? <motion.div
                        key={`old-${run}`}
                        className={s.layer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.97,
                          filter: "blur(4px)",
                        }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <div className={s.old}>
                          {old >= 4
                            ? <div className={s.oBanner}>
                                Dobrodošli na naš sajt!
                              </div>
                            : null}
                          {old >= 1
                            ? <div className={s.oHead}>
                                <b>{name}</b>
                                <span>
                                  <u>Početna</u> | <u>O nama</u> |{" "}
                                  <u>Kontakt</u>
                                </span>
                              </div>
                            : null}
                          {old >= 3
                            ? <div className={s.oImg}>
                                <Broken />
                                <span>slika_01.jpg</span>
                              </div>
                            : null}
                          {old >= 2
                            ? <div className={s.oText}>
                                <i style={{ width: "92%" }} />
                                <i style={{ width: "84%" }} />
                                <i style={{ width: "96%" }} />
                                <i style={{ width: "58%" }} />
                              </div>
                            : null}
                          {old >= 2
                            ? <div className={s.oFoot}>
                                Kontakt: <u>info@{domainOf(name)}</u>
                              </div>
                            : null}
                        </div>
                        {old < 5 ? <span className={s.spin} /> : null}
                      </motion.div>
                    : null}

                  {site === "new"
                    ? <motion.div
                        key={`new-${run}`}
                        className={s.layer}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <div
                          className={s.site}
                          data-form={step >= 3}
                          data-text={step >= 2}
                        >
                          <motion.div
                            className={s.nHead}
                            initial={reduce ? false : { opacity: 0, y: -14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={SPRING}
                          >
                            <span className={s.logo}>{letter}</span>
                            <b className={s.nName}>{name}</b>
                            <span className={s.nav}>
                              <i>Usluge</i>
                              <i>Cene</i>
                              <i>Radovi</i>
                            </span>
                            <span className={s.navBtn}>Kontakt</span>
                          </motion.div>

                          <motion.div
                            className={s.hero}
                            data-tone={set.tone}
                            initial={
                              reduce
                                ? false
                                : { opacity: 0, y: 16, scale: 0.96 }
                            }
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ ...SPRING, delay: 0.08 }}
                          >
                            <span className={s.heroSkel}>
                              <i />
                              <i />
                              <i />
                              <i />
                            </span>
                            <span className={s.heroText}>
                              <span className={s.kicker} style={{ "--i": 0 }}>
                                {set.kicker}
                              </span>
                              <span className={s.headline} style={{ "--i": 1 }}>
                                {name}: {set.line}
                              </span>
                              <span className={s.sub} style={{ "--i": 2 }}>
                                {set.sub}
                              </span>
                              <span className={s.ctas} style={{ "--i": 3 }}>
                                <span
                                  ref={ctaRef}
                                  className={s.cta}
                                  data-hit={hit === "cta" || undefined}
                                >
                                  {hit === "cta"
                                    ? <Check size={11} />
                                    : <Call />}
                                  Pozovite
                                </span>
                                <span className={s.ghostBtn}>Cenovnik</span>
                              </span>
                            </span>
                            <span className={s.art}>
                              <span className={s.blob} />
                              <span className={s.photo}>
                                <i className={s.sun} />
                                <i className={s.hillA} />
                                <i className={s.hillB} />
                              </span>
                              <span className={s.rate}>
                                <Star />
                                4,9
                              </span>
                            </span>
                          </motion.div>

                          <div className={s.tiles}>
                            {set.tiles.map(([label, note], i) => (
                              <motion.div
                                key={label}
                                className={s.tile}
                                initial={reduce ? false : { opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  ...SPRING,
                                  delay: 0.16 + i * 0.07,
                                }}
                              >
                                <span className={s.tIcon} data-i={i}>
                                  {TILE_ICONS[i]}
                                </span>
                                <span className={s.tBody}>
                                  <span className={s.tSkel}>
                                    <i />
                                    <i />
                                  </span>
                                  <span
                                    className={s.tText}
                                    style={{ "--i": i + 2 }}
                                  >
                                    <b>{label}</b>
                                    <small>{note}</small>
                                  </span>
                                </span>
                              </motion.div>
                            ))}
                          </div>

                          <AnimatePresence>
                            {step >= 3
                              ? <motion.div
                                  key="rev"
                                  className={s.reviews}
                                  initial={
                                    reduce ? false : { opacity: 0, y: 14 }
                                  }
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ ...SPRING, delay: 0.18 }}
                                >
                                  <span className={s.stars}>
                                    <Star />
                                    <Star />
                                    <Star />
                                    <Star />
                                    <Star />
                                  </span>
                                  <b>4,9</b>
                                  <span className={s.count}>38 ocena</span>
                                  <span className={s.faces}>
                                    <i data-c="a">M</i>
                                    <i data-c="b">J</i>
                                    <i data-c="c">S</i>
                                  </span>
                                  <span className={s.quote}>
                                    „Brzo, uredno i tačno po dogovoru.“
                                  </span>
                                </motion.div>
                              : null}
                          </AnimatePresence>

                          <AnimatePresence>
                            {step >= 3
                              ? <motion.div
                                  key="form"
                                  className={s.form}
                                  initial={
                                    reduce
                                      ? false
                                      : { opacity: 0, x: 40, scale: 0.94 }
                                  }
                                  animate={{ opacity: 1, x: 0, scale: 1 }}
                                  transition={{ ...SPRING, delay: 0.14 }}
                                >
                                  <b className={s.fTitle}>Zatražite ponudu</b>
                                  <span className={s.fNote}>
                                    Odgovor za 15 minuta
                                  </span>
                                  <span className={s.fld}>Ime i prezime</span>
                                  <span className={s.fld}>Telefon</span>
                                  <span className={s.fld} data-tall>
                                    Šta vam treba?
                                  </span>
                                  <span
                                    ref={sendRef}
                                    className={s.send}
                                    data-hit={hit === "send" || undefined}
                                  >
                                    {hit === "send"
                                      ? <>
                                          <Check size={11} />
                                          Poslato
                                        </>
                                      : "Pošalji upit"}
                                  </span>
                                </motion.div>
                              : null}
                          </AnimatePresence>
                        </div>
                        {step === 4 ? <span className={s.zap} /> : null}
                      </motion.div>
                    : null}
                </AnimatePresence>

                <AnimatePresence>
                  {toast
                    ? <motion.div
                        key="toast"
                        className={s.toast}
                        initial={
                          reduce ? false : { opacity: 0, y: -16, scale: 0.86 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={POP}
                      >
                        <span className={s.toastIcon}>
                          <Mail />
                        </span>
                        <span className={s.toastBody}>
                          <b>Novi upit</b>
                          <small>Sa sajta, upravo sada</small>
                        </span>
                      </motion.div>
                    : null}
                </AnimatePresence>

                <motion.span
                  className={s.cursor}
                  initial={false}
                  animate={{
                    x: cur.x,
                    y: cur.y,
                    opacity: cur.on ? 1 : 0,
                    scale: cur.press ? 0.8 : 1,
                  }}
                  transition={
                    cur.jump
                      ? { duration: 0 }
                      : {
                          x: { duration: 1, ease: [0.45, 0, 0.2, 1] },
                          y: { duration: 1, ease: [0.3, 0, 0.25, 1] },
                          opacity: { duration: 0.25 },
                          scale: { duration: 0.12 },
                        }
                  }
                >
                  <svg
                    className={s.arrow}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 3.2 19.2 13l-6.4 1.3 3.6 6.4-2.6 1.4-3.6-6.4L5.6 20 5 3.2Z"
                      fill="var(--ink)"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className={s.tap} />
                  {cur.press ? <span className={s.ripple} /> : null}
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
