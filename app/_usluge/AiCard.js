"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./aiCard.module.css";

/* The AI and automation page's hero card: a firm's repetitive work, done
   on its own. Three short scenes play in turn, and the tabs at the bottom
   switch between them. Ponuda: an enquiry from the site becomes an offer,
   line by line, and goes out to the customer. Cene: prices follow the
   lowest on the market, and the one big change waits for a person to
   confirm it. Pretraga: a printer model typed into a shop's search finds
   its toners, original and zamenski, with prices and stock.
   Drawn like the homepage cards with the "fine" accents as its own look:
   a white bar, white rows in a mist tray, one blue story card, numbers on
   lime. All names, prices and times are illustrative. */

const EASE = [0.16, 1, 0.3, 1];
const STOP = Symbol("stop");
const HOLD = 2900;
const QUERY = "HP LaserJet Pro M404";

/* 11040 -> "11.040" (by hand, so the server and the browser agree) */
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const eur = (n) => `${fmt(n)} €`;
const din = (n) => `${fmt(n)} din`;
const one = (n) => n % 10 === 1 && n % 100 !== 11;
function few(n) {
  const t = n % 10;
  const h = n % 100;
  return t >= 2 && t <= 4 && (h < 12 || h > 14);
}
function cena(n) {
  if (few(n)) return "cene";
  return "cena";
}
function artikal(n) {
  if (one(n)) return "artikal";
  if (few(n)) return "artikla";
  return "artikala";
}

/* ── icons ────────────────────────────────────────────────────────────── */
function Svg({ size = 16, w = 2, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
const MailIcon = () => (
  <Svg size={19} w={1.9}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
    <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
  </Svg>
);
const TagIcon = () => (
  <Svg size={19} w={1.9}>
    <path d="M3.8 12.6V5.2c0-.8.6-1.4 1.4-1.4h7.4l7.6 7.6c.6.6.6 1.4 0 2l-6 6c-.6.6-1.4.6-2 0Z" />
    <circle cx="8.4" cy="8.4" r="1.5" />
  </Svg>
);
const SearchIcon = () => (
  <Svg size={19} w={2}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
);
const BoxIcon = () => (
  <Svg w={2.2}>
    <path d="m12 3.5 7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7Z" />
    <path d="m4.5 7.7 7.5 4.3 7.5-4.3M12 12v8.5" />
  </Svg>
);
const WrenchIcon = () => (
  <Svg w={2.2}>
    <path d="M14.6 6.2a4.2 4.2 0 0 0 5.2 5.2L13 18.2a2.4 2.4 0 0 1-3.4-3.4Z" />
    <path d="M14.6 6.2a4.2 4.2 0 0 1 3-2.6l-1.5 2.9 1.8 1.8 2.9-1.5a4.2 4.2 0 0 1-1 4.6" />
  </Svg>
);
const PipeIcon = () => (
  <Svg w={2.2}>
    <path d="M6 3.5v8a5 5 0 0 0 5 5h9.5" />
    <path d="M3.5 3.5h5M20.5 14v5" />
  </Svg>
);
const TruckIcon = () => (
  <Svg w={2.1}>
    <path d="M3.5 6.5h10v9.5h-10ZM13.5 9.5h4l3 3.5v3h-7" />
    <circle cx="7.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </Svg>
);
const SnowIcon = () => (
  <Svg w={2.1}>
    <path d="M12 3.5v17M4.6 7.8l14.8 8.4M4.6 16.2l14.8-8.4" />
    <path d="m9.6 4.8 2.4 2 2.4-2M9.6 19.2l2.4-2 2.4 2" />
  </Svg>
);
const DropIcon = () => (
  <Svg w={2.2}>
    <path d="M12 3.8s6 6.4 6 10.6a6 6 0 0 1-12 0C6 10.2 12 3.8 12 3.8Z" />
  </Svg>
);
const TonerIcon = () => (
  <Svg w={2.1}>
    <rect x="3.5" y="7" width="17" height="10" rx="2.4" />
    <path d="M7.5 17v2.5h9V17M8 11h5" />
  </Svg>
);
const Check = ({ size = 12 }) => (
  <Svg size={size} w={3.2}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
const Bolt = () => (
  <Svg size={14} w={2.2}>
    <path d="M13 3.5 5.5 13.5h6l-1 7 7.5-10h-6Z" />
  </Svg>
);
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

/* ── the three scenes ─────────────────────────────────────────────────── */
const SCENES = [
  {
    tab: "Ponuda",
    Icon: MailIcon,
    go: ["Napravi ponudu", "Napravi"],
    done: "Poslato",
    sub: ["Novi upit sa sajta · Novi Sad", "Upit sa sajta"],
    name: ["2 toplotne pumpe 12 kW", ", montaža"],
    hint: ["Upit stiže, ponuda odlazi sama", "Ponuda odlazi sama"],
    pill: ["Odgovor za", "Odgovor"],
  },
  {
    tab: "Cene",
    Icon: TagIcon,
    go: ["Uskladi cene", "Uskladi"],
    done: "Usklađeno",
    sub: ["Cenovnik · provera svako jutro", "Cenovnik"],
    name: ["Klima i grejanje", ", 12 artikala"],
    hint: [
      "Male promene sama, velike uz vašu potvrdu",
      "Velike uz vašu potvrdu",
    ],
    pill: ["Ažurirano", "Ažurirano"],
  },
  {
    tab: "Pretraga",
    Icon: SearchIcon,
    go: ["Pronađi", "Pronađi"],
    done: "Pronađeno",
    sub: ["Pretraga u prodavnici", "Pretraga"],
    name: null,
    hint: ["Kupac upiše model, toneri se nađu sami", "Toneri se nađu sami"],
    pill: ["Pronađeno", "Nađeno"],
  },
];

const ITEMS = [
  {
    id: "pumpa",
    tone: "lime",
    Icon: BoxIcon,
    name: "Toplotna pumpa 12 kW",
    sub: "Vazduh-voda, monoblok",
    qty: 2,
    price: 4890,
  },
  {
    id: "montaza",
    tone: "spark",
    Icon: WrenchIcon,
    name: "Montaža i puštanje u rad",
    sub: "Ekipa iz Novog Sada",
    qty: 2,
    price: 420,
  },
  {
    id: "materijal",
    tone: "mist",
    Icon: PipeIcon,
    name: "Instalacioni materijal",
    sub: "Cevi, ventili i nosači",
    qty: 1,
    price: 360,
  },
  {
    id: "prevoz",
    tone: "ink",
    Icon: TruckIcon,
    name: "Prevoz do objekta",
    sub: "Novi Sad, uz montažu",
    qty: 1,
    price: 60,
  },
];
const SUM = ITEMS.reduce((a, it) => a + it.qty * it.price, 0);
/* seconds since the enquiry came in, after each step of the offer */
const SECS = [0, 8, 15, 21, 26, 34, 40];

const PRICES = [
  {
    id: "k35",
    tone: "mist",
    Icon: SnowIcon,
    name: "Klima 3,5 kW inverter",
    market: 389,
    was: 399,
    now: 385,
  },
  {
    id: "k53",
    tone: "lime",
    Icon: SnowIcon,
    name: "Klima 5,3 kW inverter",
    market: 579,
    was: 599,
    now: 575,
  },
  {
    id: "tp12",
    tone: "spark",
    Icon: BoxIcon,
    name: "Toplotna pumpa 12 kW",
    market: 4390,
    was: 4890,
    now: 4380,
    held: true,
  },
  {
    id: "tp8",
    tone: "ink",
    Icon: BoxIcon,
    name: "Toplotna pumpa 8 kW",
    market: 3450,
    was: 3490,
    now: 3440,
  },
  {
    id: "boj",
    tone: "mist",
    Icon: DropIcon,
    name: "Bojler 80 l",
    market: 189,
    was: 195,
    now: 185,
  },
];
/* prices updated after each row (the list stands for twelve articles);
   the held one counts once a person confirms it */
const COUNT = [0, 3, 5, 5, 8, 11];

const TONERS = [
  {
    id: "z59a",
    name: "Zamenski toner 59A",
    sub: "Odgovara M404 · 3.000 strana",
    price: 3290,
    stock: 14,
    best: true,
  },
  {
    id: "o59a",
    tone: "ink",
    name: "HP 59A original",
    sub: "CF259A · 3.000 strana",
    price: 14990,
    stock: 6,
  },
  {
    id: "z59x",
    tone: "lime",
    name: "Zamenski toner 59X",
    sub: "Veći kapacitet · 10.000 strana",
    price: 4490,
    stock: 9,
  },
  {
    id: "o59x",
    tone: "ink",
    name: "HP 59X original",
    sub: "CF259X · 10.000 strana",
    price: 24990,
    stock: 2,
  },
  {
    id: "o59a2",
    tone: "mist",
    name: "HP 59A original, 2 komada",
    sub: "Dupli paket",
    price: 28490,
    stock: 0,
  },
];

const MAX = [ITEMS.length + 2, PRICES.length, TONERS.length];
const INIT = { scene: 0, run: 0, step: 0, held: "no", typed: QUERY };

/* placeholders: fixed widths per row, the same on the server and in the
   browser */
function Skel({ n }) {
  return (
    <span className={s.rowIn} aria-hidden="true">
      <span className={s.skelFav} />
      <span className={s.skelLines}>
        <i style={{ width: `${44 + ((n * 17) % 26)}%` }} />
        <i style={{ width: `${30 + ((n * 23) % 22)}%` }} />
      </span>
      <span className={s.skelNum}>
        <i />
        <i />
      </span>
    </span>
  );
}

/* the offer's total, rolled up once it is in */
function useCount(target, on, still) {
  const [v, setV] = useState(on ? target : 0);
  useEffect(() => {
    if (!on) {
      setV(0);
      return;
    }
    if (still) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 760);
      setV(Math.round((target * (1 - (1 - p) ** 3)) / 10) * 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, on, still]);
  return v;
}

const IN = { opacity: 0, y: 8 };
const SHOW = { opacity: 1, y: 0 };
const POP = { type: "spring", stiffness: 420, damping: 18 };

/* 1. Ponuda: the lines fill in, the total turns blue, it goes out */
function Offer({ st, phase, still }) {
  const { step, run } = st;
  const sum = step > ITEMS.length;
  const sent = step > ITEMS.length + 1;
  const total = useCount(SUM, sum, still);
  return (
    <>
      <div className={s.head}>
        <span>
          Ponuda br. 214<span className={s.long}>, za kupca iz upita</span>
        </span>
        <span>Iznos</span>
      </div>
      {ITEMS.map((it, i) => {
        const on = step > i;
        return (
          <div
            key={`${run}-${it.id}`}
            className={`${s.row} ${s.item}`}
            data-empty={on ? undefined : true}
            data-next={(!on && phase === "run" && step === i) || undefined}
          >
            {on
              ? <motion.span
                  className={s.rowIn}
                  initial={still ? false : IN}
                  animate={SHOW}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className={s.mark} data-tone={it.tone}>
                    <it.Icon />
                  </span>
                  <span className={s.body}>
                    <span className={s.title}>{it.name}</span>
                    <span className={s.text}>
                      <span className={s.textIn}>{it.sub}</span>
                    </span>
                  </span>
                  <span className={s.num}>
                    <span className={s.numTop}>
                      {it.qty} × {eur(it.price)}
                    </span>
                    <b>{eur(it.qty * it.price)}</b>
                  </span>
                </motion.span>
              : <Skel n={i + 1} />}
          </div>
        );
      })}
      <div
        className={s.total}
        data-blue={sum || undefined}
        data-empty={sum ? undefined : true}
      >
        <span className={s.totalBody}>
          <span className={s.totalLabel}>Ukupno sa PDV-om</span>
          <b className={s.totalSum}>
            {sum
              ? eur(total)
              : <i className={s.totalSkel} aria-hidden="true" />}
          </b>
          <span className={s.totalSub}>PDF ponuda, važi 15 dana</span>
        </span>
        <AnimatePresence initial={false}>
          {sent
            ? <motion.em
                key="sent"
                className={s.sent}
                initial={still ? false : { scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={POP}
              >
                <span className={s.sentMark}>
                  <Check size={11} />
                </span>
                <span>
                  Poslato<span className={s.long}> kupcu</span>
                </span>
                <span className={s.sentTime}>za 40 s</span>
              </motion.em>
            : null}
        </AnimatePresence>
      </div>
    </>
  );
}

/* 2. Cene: each price drops just under the market; the big change waits */
function Prices({ st, phase, still, pressed, onConfirm }) {
  const { step, run, held } = st;
  return (
    <>
      <div className={s.head}>
        <span>
          Artikal<span className={s.long}> i najniža cena na tržištu</span>
        </span>
        <span>Naša cena</span>
      </div>
      {PRICES.map((p, i) => {
        const blue = p.held && held !== "no";
        const wait = p.held && held === "wait";
        const ok = p.held && held === "ok";
        const changed = p.held ? ok || wait : step > i;
        const next = phase === "run" && step === i;
        return (
          <div
            key={`${run}-${p.id}`}
            className={s.row}
            data-blue={blue || undefined}
            data-wait={wait || undefined}
            data-next={next || undefined}
          >
            <span className={s.rowIn}>
              <span className={s.mark} data-tone={blue ? "mine" : p.tone}>
                <p.Icon />
              </span>
              <span className={s.body}>
                <span className={s.title}>{p.name}</span>
                <span className={s.text}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {wait
                      ? <motion.em
                          key="wait"
                          className={s.tagWait}
                          initial={still ? false : { scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.6, opacity: 0 }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <i aria-hidden="true" />
                          Čeka potvrdu
                        </motion.em>
                      : null}
                    {ok
                      ? <motion.em
                          key="ok"
                          className={s.tag}
                          initial={still ? false : { scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={POP}
                        >
                          Potvrđeno
                        </motion.em>
                      : null}
                  </AnimatePresence>
                  <span className={s.textIn}>Tržište od {eur(p.market)}</span>
                </span>
              </span>
              <span className={s.num}>
                <span className={s.numTop}>
                  {changed
                    ? <s className={s.was}>{eur(p.was)}</s>
                    : <span className={s.over}>+{p.was - p.market} €</span>}
                </span>
                <span className={s.numRoll}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.b
                      key={changed ? "now" : "was"}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.38, ease: EASE }}
                    >
                      {eur(changed ? p.now : p.was)}
                    </motion.b>
                  </AnimatePresence>
                </span>
              </span>
              {wait
                ? <button
                    type="button"
                    className={s.ok}
                    onClick={onConfirm}
                    data-press={pressed || undefined}
                  >
                    Potvrdi
                  </button>
                : null}
            </span>
          </div>
        );
      })}
    </>
  );
}

/* 3. Pretraga: the model is typed, the toners that fit come in */
function Search({ st, phase, still }) {
  const { step, run } = st;
  const loading = phase === "loading";
  return (
    <>
      <div className={s.head}>
        <span className={s.headText}>
          {step > 0
            ? <>
                Odgovara za <b>{QUERY}</b>
              </>
            : "Rezultati pretrage"}
        </span>
        <span>Cena</span>
      </div>
      {TONERS.map((t, i) => {
        const on = step > i;
        let level = "out";
        if (t.stock >= 5) level = "ok";
        else if (t.stock > 0) level = "low";
        return (
          <div
            key={`${run}-${t.id}`}
            className={s.row}
            data-empty={on ? undefined : true}
            data-blue={(on && t.best) || undefined}
            data-next={loading || undefined}
          >
            {on
              ? <motion.span
                  className={s.rowIn}
                  initial={still ? false : { opacity: 0, y: 10 }}
                  animate={SHOW}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <span className={s.mark} data-tone={t.best ? "mine" : t.tone}>
                    <TonerIcon />
                  </span>
                  <span className={s.body}>
                    <span className={s.title}>{t.name}</span>
                    <span className={s.text}>
                      {t.best
                        ? <motion.em
                            className={s.tag}
                            initial={still ? false : { scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ ...POP, delay: 0.25 }}
                          >
                            Najbolja cena
                          </motion.em>
                        : null}
                      <span className={s.textIn}>{t.sub}</span>
                    </span>
                  </span>
                  <span className={s.num}>
                    <span className={s.stock} data-level={level}>
                      <i aria-hidden="true" />
                      {t.stock > 0 ? `${t.stock} na stanju` : "Po porudžbini"}
                    </span>
                    <b>{din(t.price)}</b>
                  </span>
                </motion.span>
              : <Skel n={i + 2} />}
          </div>
        );
      })}
    </>
  );
}

export default function AiCard({ footer = null }) {
  const reduce = useReducedMotion();
  // The server can't know the reader's motion setting, so the first render
  // always assumes motion; markup that depends on it switches after mount.
  const [still, setStill] = useState(false);
  useEffect(() => setStill(Boolean(reduce)), [reduce]);
  const [st, setSt] = useState(INIT);
  const [phase, setPhase] = useState("ready");
  const [pressed, setPressed] = useState(null);

  const root = useRef(null);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const stRef = useRef(INIT);
  const phaseRef = useRef("ready");
  const userRef = useRef(false);
  const timers = useRef(new Set());

  const commit = (patch) => {
    const next = { ...stRef.current, ...patch };
    stRef.current = next;
    setSt(next);
  };
  const go = (p) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };
  const press = (what) => {
    setPressed(what);
    later(() => setPressed((cur) => (cur === what ? null : cur)), 260);
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

  const playOffer = async (sleep) => {
    press("go");
    go("run");
    for (let k = 1; k <= ITEMS.length; k += 1) {
      await sleep(k === 1 ? 460 : 640);
      commit({ step: k });
    }
    await sleep(640);
    commit({ step: ITEMS.length + 1 });
    await sleep(1050);
    commit({ step: ITEMS.length + 2 });
  };

  const playPrices = async (sleep) => {
    press("go");
    go("run");
    for (let k = 1; k <= PRICES.length; k += 1) {
      await sleep(k === 1 ? 480 : 720);
      const patch = { step: k };
      if (PRICES[k - 1].held && stRef.current.held === "no")
        patch.held = "wait";
      commit(patch);
    }
    // the big change waits for a person; here the loop plays that person
    if (stRef.current.held === "wait") {
      await sleep(1300);
      if (stRef.current.held === "wait") {
        press("ok");
        await sleep(240);
        commit({ held: "ok" });
      }
    }
  };

  const playSearch = async (sleep) => {
    if (stRef.current.typed.length < QUERY.length) {
      go("typing");
      await sleep(260);
      for (let n = stRef.current.typed.length + 1; n <= QUERY.length; n += 1) {
        commit({ typed: QUERY.slice(0, n) });
        await sleep(QUERY[n - 1] === " " ? 140 : 50 + ((n * 37) % 40));
      }
      await sleep(380);
    }
    press("go");
    go("loading");
    await sleep(720);
    go("run");
    for (let k = 1; k <= TONERS.length; k += 1) {
      commit({ step: k });
      await sleep(190);
    }
  };

  const reset = (i) =>
    commit({
      scene: i,
      run: stRef.current.run + 1,
      step: 0,
      held: "no",
      typed: i === 2 ? "" : QUERY,
    });

  /* mode: "warm" (first view), "load" (another scene), "again" (the same
     scene from the start), "now" (the reader pressed the key) */
  const play = async (t, i, mode) => {
    const sleep = napper(t);
    if (mode === "load" || mode === "again") {
      reset(i);
      go("ready");
    }
    if (mode === "warm") await sleep(1200);
    if (mode === "load") await sleep(i === 2 ? 650 : 1150);
    if (mode === "again") await sleep(450);
    if (i === 0) await playOffer(sleep);
    else if (i === 1) await playPrices(sleep);
    else await playSearch(sleep);
    await sleep(320);
    go("end");
  };

  const finish = (i) => {
    commit({
      scene: i,
      run: stRef.current.run + 1,
      step: MAX[i],
      held: i === 1 ? "ok" : "no",
      typed: QUERY,
    });
    go("end");
  };

  // on screen or not: the story holds while hidden
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

  // the scenes in turn, until the reader takes over
  // biome-ignore lint/correctness/useExhaustiveDependencies: helpers only touch refs and setters
  useEffect(() => {
    if (reduce) {
      token.current += 1;
      finish(stRef.current.scene);
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      if (!userRef.current) await play(t, stRef.current.scene, "warm");
      for (;;) {
        await sleep(HOLD);
        if (userRef.current) return;
        await play(t, (stRef.current.scene + 1) % SCENES.length, "load");
      }
    })().catch(() => {});
    return () => {
      if (token.current === t) token.current += 1;
    };
  }, [reduce]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      token.current += 1;
      for (const id of pending) clearTimeout(id);
    };
  }, []);

  const takeOver = () => {
    userRef.current = true;
  };

  const pick = (i) => {
    takeOver();
    if (reduce) {
      token.current += 1;
      finish(i);
      return;
    }
    const t = ++token.current;
    play(t, i, i === stRef.current.scene ? "again" : "load").catch(() => {});
  };

  const act = () => {
    takeOver();
    const i = stRef.current.scene;
    if (reduce) {
      token.current += 1;
      finish(i);
      return;
    }
    const p = phaseRef.current;
    // pressed mid typing: the model is in, search now
    if (p === "typing") commit({ typed: QUERY });
    else if (p !== "ready" && p !== "end") return;
    const t = ++token.current;
    play(t, i, p === "end" ? "again" : "now").catch(() => {});
  };

  const confirm = () => {
    if (stRef.current.held !== "wait") return;
    takeOver();
    press("ok");
    commit({ held: "ok" });
  };

  const { scene, step, held, typed, run } = st;
  const sc = SCENES[scene];
  const busy = phase === "run" || phase === "loading";
  const end = phase === "end";

  // the key
  let label = sc.go[0];
  let short = sc.go[1];
  if (still) {
    label = sc.done;
    short = sc.done;
  } else if (end) {
    label = "Ponovo";
    short = "Ponovo";
  }

  // the live pill
  let value = "…";
  let top = false;
  if (scene === 0 && (step > 0 || phase !== "ready")) {
    value = `${SECS[step]} s`;
    top = step === MAX[0];
  } else if (scene === 1 && (step > 0 || phase !== "ready")) {
    const n = COUNT[step] + (held === "ok" ? 1 : 0);
    value = `${n} ${cena(n)}`;
    top = step === MAX[1] && held === "ok";
  } else if (scene === 2 && step > 0) {
    value = `${step} ${artikal(step)}`;
    top = step === MAX[2];
  }

  let hint = (
    <>
      <Bolt />
      <span className={s.long}>{sc.hint[0]}</span>
      <span className={s.short}>{sc.hint[1]}</span>
    </>
  );
  if (scene === 1 && held === "wait")
    hint = (
      <>
        <Pointer />
        <span className={s.long}>Veća promena čeka: pritisnite Potvrdi</span>
        <span className={s.short}>Pritisnite Potvrdi</span>
      </>
    );

  let dot = "run";
  if (end) dot = "end";
  else if (phase === "ready" && scene !== 0) dot = "idle";

  let name = null;
  if (sc.name)
    name = (
      <span className={s.nameText}>
        {sc.name[0]}
        <span className={s.long}>{sc.name[1]}</span>
      </span>
    );
  else {
    const caret = (
      <i
        className={s.caret}
        data-on={phase === "typing" || phase === "ready"}
        aria-hidden="true"
      />
    );
    name = typed
      ? <span className={s.nameText}>
          {typed}
          {caret}
        </span>
      : <span className={s.nameText} data-empty>
          {caret}
          Model štampača
        </span>;
  }

  let body = <Offer st={st} phase={phase} still={still} />;
  if (scene === 1)
    body = (
      <Prices
        st={st}
        phase={phase}
        still={still}
        pressed={pressed === "ok"}
        onConfirm={confirm}
      />
    );
  else if (scene === 2) body = <Search st={st} phase={phase} still={still} />;

  return (
    <div className={s.stage} ref={root}>
      <div className={s.deck}>
        <div className={s.card}>
          <div className={s.bar}>
            <span className={s.icon}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={scene}
                  className={s.iconIn}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <sc.Icon />
                </motion.span>
              </AnimatePresence>
            </span>
            <span className={s.field}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={scene === 2 ? "q" : `${scene}-${run}`}
                  className={s.fieldIn}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className={s.sub}>
                    <i className={s.dot} data-state={dot} aria-hidden="true" />
                    <span className={s.subText}>
                      <span className={s.long}>{sc.sub[0]}</span>
                      <span className={s.short}>{sc.sub[1]}</span>
                    </span>
                  </span>
                  <span className={s.name}>{name}</span>
                </motion.span>
              </AnimatePresence>
            </span>
            <button
              type="button"
              className={s.go}
              onClick={act}
              disabled={busy || still}
              data-busy={busy || undefined}
              data-press={pressed === "go" || undefined}
              data-done={still || undefined}
              aria-label={label}
            >
              {still ? <Check /> : null}
              <span className={s.long}>{label}</span>
              <span className={s.short}>{short}</span>
            </button>
            <span
              className={s.load}
              data-on={phase === "loading"}
              aria-hidden="true"
            />
          </div>

          <div className={s.meta}>
            <span className={s.hint}>{hint}</span>
            <span className={s.rank} data-top={top}>
              <span className={s.long}>{sc.pill[0]}</span>
              <span className={s.short}>{sc.pill[1]}</span>
              <span className={s.rankNo}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b
                    key={value}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {value}
                  </motion.b>
                </AnimatePresence>
              </span>
            </span>
          </div>

          <div className={s.tray}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={scene}
                className={s.scene}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                {body}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={s.tabs}>
            <span className={s.tabsLabel}>Primer</span>
            <fieldset className={s.chips} aria-label="Primer automatizacije">
              {SCENES.map((it, i) => {
                const on = i === scene;
                return (
                  <button
                    key={it.tab}
                    type="button"
                    aria-pressed={on}
                    className={s.chip}
                    data-on={on || undefined}
                    onClick={() => pick(i)}
                  >
                    <span className={s.chipMark}>
                      <Check size={10} />
                    </span>
                    {it.tab}
                  </button>
                );
              })}
            </fieldset>
          </div>
          {footer}
        </div>
      </div>
    </div>
  );
}
