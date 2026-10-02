"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h01.module.css";

/* 01 · Prvo mesto. An illustrative search: a kind of business and a city,
   generic rivals, and "vasafirma.rs" climbing from sixth place to first.
   Nothing here is a real result, and the caption under the card says so.
   The reader can type their own business and city and watch the same climb. */

const CITIES = [
  "sremska mitrovica",
  "novi sad",
  "novi pazar",
  "beograd",
  "niš",
  "nis",
  "kragujevac",
  "subotica",
  "zrenjanin",
  "pančevo",
  "čačak",
  "kraljevo",
  "smederevo",
  "leskovac",
  "valjevo",
  "kruševac",
  "vranje",
  "šabac",
  "užice",
  "sombor",
  "požarevac",
  "pirot",
  "zaječar",
  "kikinda",
  "jagodina",
  "vršac",
  "zemun",
  "london",
];

const EXAMPLES = [
  {
    q: "klima servis beograd",
    key: /klim/,
    rivals: [
      [
        "majstor-plus.rs",
        "Majstor Plus",
        "Servis, čišćenje i punjenje klima uređaja. Pozovite za termin.",
      ],
      [
        "servis24.rs",
        "Servis24",
        "Radimo sve marke uređaja. Pogledajte zone u kojima dolazimo.",
      ],
      [
        "brzi-servis.rs",
        "Brzi Servis",
        "Montaža i servis klima uređaja za stanove i lokale.",
      ],
    ],
    mine: "Dolazimo isti dan, sa cenom unapred. Pogledajte radove i utiske klijenata.",
  },
  {
    q: "stomatolog niš",
    key: /stomat|zub|dent/,
    rivals: [
      [
        "dental-centar.rs",
        "Dental Centar",
        "Popravke, proteze i estetika zuba. Zakažite pregled telefonom.",
      ],
      [
        "osmeh-studio.rs",
        "Osmeh Studio",
        "Ordinacija u centru grada. Radimo i subotom.",
      ],
      [
        "porodicni-zubar.rs",
        "Porodični Zubar",
        "Preventiva, lečenje i izbeljivanje zuba za celu porodicu.",
      ],
    ],
    mine: "Cene unapred i termini i subotom. Upoznajte tim i zakažite pregled online.",
  },
  {
    q: "advokat novi sad",
    key: /advok|pravn/,
    rivals: [
      [
        "pravni-savet.rs",
        "Pravni Savet",
        "Porodično, radno i privredno pravo. Prvi razgovor telefonom.",
      ],
      [
        "advokati-online.rs",
        "Advokati Online",
        "Pronađite advokata po oblasti prava i gradu.",
      ],
      [
        "kancelarija-pravo.rs",
        "Kancelarija Pravo",
        "Zastupanje fizičkih i pravnih lica pred sudovima.",
      ],
    ],
    mine: "Jasna cena prvog razgovora. Oblasti prava, tim i zakazivanje online.",
  },
  {
    q: "električar niš",
    key: /elektri|struj/,
    rivals: [
      [
        "majstor-plus.rs",
        "Majstor Plus",
        "Električarske intervencije, razvodne table i instalacije.",
      ],
      [
        "elektro-24.rs",
        "Elektro 24",
        "Hitne intervencije u toku dana. Pozovite za dolazak.",
      ],
      [
        "brzi-servis.rs",
        "Brzi Servis",
        "Zamena instalacija, utičnica i rasvete u stanovima.",
      ],
    ],
    mine: "Dolazimo isti dan, sa cenom unapred. Zakažite online ili pozovite.",
  },
];

const GENERIC = {
  rivals: [
    [
      "pro-usluge.rs",
      "Pro Usluge",
      "Usluge za fizička i pravna lica. Pozovite i dogovorite termin.",
    ],
    [
      "top-izbor.rs",
      "Top Izbor",
      "Uporedite ponude iz svog grada na jednom mestu.",
    ],
    [
      "lokalni-vodic.rs",
      "Lokalni Vodič",
      "Firme iz vašeg kraja, sa kontakt podacima i radnim vremenom.",
    ],
  ],
  mine: "Cene, radovi i utisci klijenata na jednom mestu. Zakažite online.",
};

const START = ["a", "b", "c", "d", "e", "v"];
const FINAL = ["v", "a", "b", "c", "d", "e"];
const STEPS = ["Brz sajt", "Google profil", "Sadržaj", "Recenzije", "Oglasi"];
const SLOTS = [1, 2, 3, 4, 5, 6];
const STOP = Symbol("stop");

function capWords(text) {
  return text.replace(/(^|\s)(\S)/g, (_, sp, ch) => sp + ch.toUpperCase());
}

/* "klima servis beograd" -> "Klima servis Beograd" (cap = false keeps the
   first word lower case, for titles that put a brand in front). */
function pretty(raw, cap) {
  let q = raw.trim().replace(/\s+/g, " ");
  const low = q.toLowerCase();
  for (const city of CITIES) {
    if (low === city || low.endsWith(` ${city}`)) {
      q = q.slice(0, q.length - city.length) + capWords(city);
      break;
    }
  }
  return cap ? q.charAt(0).toUpperCase() + q.slice(1) : q;
}

const PLAIN = { č: "c", ć: "c", š: "s", ž: "z", đ: "dj" };
function slug(raw) {
  const out = raw
    .toLowerCase()
    .replace(/[čćšžđ]/g, (m) => PLAIN[m])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 26)
    .replace(/-+$/, "");
  return out || "usluge";
}

function matchSet(q) {
  const low = q.toLowerCase();
  return EXAMPLES.find((ex) => ex.key.test(low)) ?? GENERIC;
}

function build(q, set) {
  const Q = pretty(q, true);
  const lower = pretty(q, false);
  const path = slug(q);
  const [a, b, c] = set.rivals;
  return {
    a: {
      host: a[0],
      path,
      letter: a[1][0],
      tone: "ink",
      title: `${Q} | ${a[1]}`,
      text: a[2],
    },
    b: {
      host: b[0],
      path: "usluge",
      letter: b[1][0],
      tone: "spark",
      title: `${b[1]}: ${lower}`,
      text: b[2],
    },
    c: {
      host: c[0],
      path: "cenovnik",
      letter: c[1][0],
      tone: "lime",
      title: `${Q}, cene i termini`,
      text: c[2],
    },
    d: {
      host: "imenik-firmi.rs",
      path: "pretraga",
      letter: "I",
      tone: "mist",
      title: `${Q}: adrese i telefoni`,
      text: "Spisak firmi sa adresama, telefonima i radnim vremenom.",
    },
    e: {
      host: "pitaj-komsiju.rs",
      path: "teme",
      letter: "P",
      tone: "pale",
      title: `„${lower}“: iskustva i preporuke`,
      text: "Korisnici dele iskustva sa firmama iz svog kraja.",
    },
    v: {
      host: "vasafirma.rs",
      path,
      letter: "V",
      tone: "mine",
      title: `${Q} | Vaša firma`,
      text: set.mine,
      mine: true,
    },
  };
}

function up(order) {
  const i = order.indexOf("v");
  if (i <= 0) return order;
  const next = order.slice();
  next[i] = next[i - 1];
  next[i - 1] = "v";
  return next;
}

const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 };

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      width="12"
      height="12"
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

export default function H01Search() {
  const reduce = useReducedMotion();
  const first = EXAMPLES[0];
  const [typed, setTyped] = useState(first.q);
  const [query, setQuery] = useState(first.q);
  const [items, setItems] = useState(() => build(first.q, first));
  const [order, setOrder] = useState(START);
  const [phase, setPhase] = useState("shown");
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const [user, setUser] = useState(false);
  const [asked, setAsked] = useState(false);

  const root = useRef(null);
  const inputRef = useRef(null);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const typedRef = useRef(first.q);
  const userRef = useRef(false);
  const phaseRef = useRef("shown");
  const nextEx = useRef(1);

  const type = (v) => {
    typedRef.current = v;
    setTyped(v);
  };
  const go = (p) => {
    phaseRef.current = p;
    setPhase(p);
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

  const play = async (t, q, set, mode) => {
    const sleep = napper(t);
    if (mode === "type") {
      go("out");
      await sleep(420);
      let cur = typedRef.current;
      while (cur.length) {
        cur = cur.slice(0, -1);
        type(cur);
        await sleep(16);
      }
      go("typing");
      await sleep(280);
      for (let i = 1; i <= q.length; i += 1) {
        type(q.slice(0, i));
        await sleep(q[i - 1] === " " ? 150 : 55 + ((i * 37) % 45));
      }
      await sleep(420);
    }
    if (mode === "warm") {
      await sleep(1000);
    } else {
      go("loading");
      await sleep(640);
      setQuery(q);
      setItems(build(q, set));
      setOrder(START);
      setStep(0);
      setRun((r) => r + 1);
      go("shown");
      await sleep(1250);
    }
    go("climb");
    for (let k = 1; k <= STEPS.length; k += 1) {
      setOrder(up);
      setStep(k);
      await sleep(k === STEPS.length ? 620 : 880);
    }
    go("top");
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
      setOrder(FINAL);
      setStep(STEPS.length);
      go("top");
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      if (!userRef.current) await play(t, first.q, first, "warm");
      for (;;) {
        await sleep(2800);
        if (userRef.current) return;
        const ex = EXAMPLES[nextEx.current % EXAMPLES.length];
        nextEx.current += 1;
        await play(t, ex.q, ex, "type");
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

  const takeOver = () => {
    if (userRef.current) return;
    userRef.current = true;
    setUser(true);
    // mid typing or between queries: stop there and show the last results
    const p = phaseRef.current;
    if (p === "out" || p === "typing" || p === "loading") {
      token.current += 1;
      type(query);
      go(order[0] === "v" ? "top" : "shown");
    }
  };

  const onFocus = (e) => {
    takeOver();
    const el = e.currentTarget;
    requestAnimationFrame(() => el.select());
  };

  const submit = (e) => {
    e.preventDefault();
    takeOver();
    const q = typedRef.current.trim().replace(/\s+/g, " ");
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    setAsked(true);
    inputRef.current?.blur();
    const t = ++token.current;
    const set = matchSet(q);
    if (reduce) {
      setQuery(q);
      setItems(build(q, set));
      setOrder(FINAL);
      setStep(STEPS.length);
      setRun((r) => r + 1);
      go("top");
      return;
    }
    play(t, q, set, "go").catch(() => {});
  };

  const live = phase === "shown" || phase === "climb" || phase === "top";
  const pos = order.indexOf("v");
  const top = phase === "top";

  let hint = (
    <>
      <Pointer />
      <span className={s.long}>Probajte sa svojom delatnošću i gradom</span>
      <span className={s.short}>Probajte svoju delatnost</span>
    </>
  );
  if (asked)
    hint = (
      <>
        Rezultati za <b>„{query}“</b>
      </>
    );
  else if (user) hint = "Pritisnite Enter ili Pretraži";

  return (
    <div className={s.hero} ref={root}>
      <div className={s.grid}>
        <HeroCopy align="left" />

        <div className={s.stage}>
          <div className={s.deck}>
            <div className={s.card}>
              <form className={s.bar} onSubmit={submit} role="search">
                <span className={s.lens}>
                  <SearchIcon />
                </span>
                <label className={s.field}>
                  <span className={s.sr}>Delatnost i grad</span>
                  <input
                    ref={inputRef}
                    className={s.input}
                    value={typed}
                    onChange={(e) => {
                      takeOver();
                      type(e.target.value);
                    }}
                    onFocus={onFocus}
                    placeholder={
                      user ? "Delatnost i grad, npr. frizer novi sad" : ""
                    }
                    enterKeyHint="search"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={48}
                  />
                  <span className={s.ghost} aria-hidden>
                    {typed}
                    <i className={s.caret} data-on={phase === "typing"} />
                  </span>
                </label>
                <button type="submit" className={s.go}>
                  Pretraži
                </button>
                <span className={s.load} data-on={phase === "loading"} />
              </form>

              <div className={s.meta}>
                <span className={s.hint} data-user={user}>
                  {hint}
                </span>
                <span className={s.rank} data-top={top && live}>
                  Vaš sajt
                  <span className={s.rankNo}>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.b
                        key={live ? pos : "x"}
                        initial={{ y: 14, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -14, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {live ? `#${pos + 1}` : "…"}
                      </motion.b>
                    </AnimatePresence>
                  </span>
                </span>
              </div>

              <div className={s.list}>
                <ol className={s.rail} aria-hidden>
                  {SLOTS.map((n) => (
                    <li
                      key={n}
                      data-on={live && n === pos + 1}
                      data-top={live && top && n === 1}
                    >
                      {n}
                    </li>
                  ))}
                </ol>

                <div className={s.stack}>
                  <ul className={s.skel} data-on={!live} aria-hidden>
                    {SLOTS.map((n) => (
                      <li key={n} className={s.skelRow}>
                        <span className={s.skelFav} />
                        <span className={s.skelLines}>
                          <i style={{ width: `${34 + ((n * 17) % 22)}%` }} />
                          <i style={{ width: `${62 + ((n * 23) % 28)}%` }} />
                          <i style={{ width: `${70 + ((n * 13) % 22)}%` }} />
                        </span>
                      </li>
                    ))}
                  </ul>

                  <ul className={s.rows} data-on={live} aria-live="polite">
                    {order.map((id) => {
                      const it = items[id];
                      return (
                        <motion.li
                          key={`${run}-${id}`}
                          layout="position"
                          className={s.row}
                          data-mine={it.mine || undefined}
                          data-top={(it.mine && top) || undefined}
                          initial={run === 0 ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            layout: reduce ? { duration: 0 } : SPRING,
                            default: {
                              duration: 0.5,
                              ease: [0.16, 1, 0.3, 1],
                              delay: START.indexOf(id) * 0.06,
                            },
                          }}
                        >
                          <span className={s.fav} data-tone={it.tone}>
                            {it.letter}
                          </span>
                          <span className={s.body}>
                            <span className={s.url}>
                              <b>{it.host}</b>
                              <span className={s.path}>› {it.path}</span>
                              {it.mine
                                ? <em className={s.tag}>Vaš sajt</em>
                                : null}
                            </span>
                            <span className={s.title}>{it.title}</span>
                            <span className={s.text}>{it.text}</span>
                          </span>
                          <AnimatePresence>
                            {it.mine && top
                              ? <motion.span
                                  className={s.badge}
                                  initial={{ scale: 0.4, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.6, opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 18,
                                  }}
                                >
                                  #1
                                </motion.span>
                              : null}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className={s.foot}>
                <span className={s.footLabel}>Šta ga penje</span>
                <span className={s.chips}>
                  {STEPS.map((label, i) => {
                    const n = i + 1;
                    const moving = phase === "climb" || top;
                    let state = "wait";
                    if (moving && (n < step || (n === step && top)))
                      state = "done";
                    else if (moving && n === step) state = "now";
                    return (
                      <span key={label} className={s.chip} data-state={state}>
                        <span className={s.chipMark}>
                          <Check />
                        </span>
                        {label}
                      </span>
                    );
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className={s.caption}>
            Ilustracija: tako izgleda kad SEO i oglasi rade zajedno.
          </p>
        </div>
      </div>
    </div>
  );
}
