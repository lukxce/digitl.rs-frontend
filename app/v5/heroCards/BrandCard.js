"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./brandCard.module.css";

/* The hero's brand card. A name becomes a brand system, shown the way a
   brand designer presents one: on the left the system itself (the mark,
   the logo, four colours, the typeface), on the right the same system put
   to work on a website, a business card, posts, a shop sign, a bag and a
   mug. The loop types a name, draws the mark, fills the palette, sets the
   type, then lights the applications up one by one. The reader can type
   their own name and pick one of four palettes. All names are generic. */

const SANS = "var(--font-v5-sans), var(--font-manrope), system-ui, sans-serif";
const SERIF =
  '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif';

/* four directions: a palette with a type pairing. `per` is the rough
   width of one character in em, used to keep names inside the mockups. */
const LOOKS = [
  {
    id: "terakota",
    name: "Terakota i sunce",
    P: "#c2543a",
    D: "#2c1712",
    A: "#f2b64a",
    L: "#fbf2e8",
    F: SANS,
    W: 800,
    LS: "0.05em",
    cs: "upper",
    per: 0.78,
    type: ["Manrope", "ExtraBold"],
  },
  {
    id: "petrolej",
    name: "Petrolej i led",
    P: "#0e6a75",
    D: "#0a2b30",
    A: "#8fdfe2",
    L: "#eef7f6",
    F: SANS,
    W: 800,
    LS: "-0.045em",
    cs: "lower",
    per: 0.56,
    type: ["Manrope", "ExtraBold"],
  },
  {
    id: "menta",
    name: "Menta i koral",
    P: "#23936f",
    D: "#10362b",
    A: "#ff9178",
    L: "#f0f7f2",
    F: SANS,
    W: 700,
    LS: "-0.02em",
    cs: "none",
    per: 0.6,
    type: ["Manrope", "Bold"],
  },
  {
    id: "mastilo",
    name: "Mastilo i mesing",
    P: "#1e2a4c",
    D: "#0d1326",
    A: "#c9a35f",
    L: "#f6f1e6",
    F: SERIF,
    W: 600,
    LS: "-0.005em",
    cs: "none",
    per: 0.56,
    type: ["Antikva", "SemiBold"],
  },
];

const LINE = ["Posao koji", "ostavlja utisak."];

const EXAMPLES = [
  { name: "Vaša firma", look: 0, shape: "squircle", line: LINE },
  {
    name: "Klima Lab",
    look: 1,
    shape: "drop",
    line: ["Sveže leto,", "bez čekanja."],
  },
  {
    name: "Zubni centar Osmeh",
    look: 2,
    shape: "leaf",
    line: ["Pregled", "bez straha."],
  },
  {
    name: "Pravo i partneri",
    look: 3,
    shape: "arch",
    line: ["Jasan savet,", "siguran korak."],
  },
];

/* the mark's shapes, in a 100 x 100 box; `circle` is the blank placeholder */
const SHAPES = {
  squircle:
    "M34 8H66A26 26 0 0 1 92 34V66A26 26 0 0 1 66 92H34A26 26 0 0 1 8 66V34A26 26 0 0 1 34 8Z",
  drop: "M8 8H50A42 42 0 1 1 8 50Z",
  leaf: "M8 92V50A42 42 0 0 1 50 8H92V50A42 42 0 0 1 50 92Z",
  arch: "M12 92V50A38 38 0 0 1 88 50V92Z",
  circle: "M50 8A42 42 0 1 1 50 92A42 42 0 1 1 50 8Z",
};
const PICK = ["squircle", "drop", "leaf", "arch"];
/* where the letter sits, optically, inside each shape */
const LETTER_Y = { squircle: 52, drop: 52, leaf: 52, arch: 60, circle: 52 };

const APPS = ["Sajt", "Vizitka", "Objave", "Tabla", "Kesa", "Šolja"];
const PHONE_APPS = 4;
const STEPS = ["Znak", "Boje", "Pismo", "Primene", "Pravila"];
const SWATCHES = ["P", "D", "A", "L"];
const STOP = Symbol("stop");
const EASE = [0.16, 1, 0.3, 1];
const NEUTRAL_PER = 0.6;

const PLAIN = { č: "c", ć: "c", š: "s", ž: "z", đ: "dj" };
function slug(raw) {
  const out = raw
    .toLowerCase()
    .replace(/[čćšžđ]/g, (m) => PLAIN[m])
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return out || "vasafirma";
}

function clean(raw) {
  return raw.trim().replace(/\s+/g, " ");
}

function initial(name) {
  const m = name.match(/[\p{L}\p{N}]/u);
  return m ? m[0] : "V";
}

/* a typed name gets a shape from its first letter, so the mark stays put
   while the rest of the name is being typed */
function shapeFor(name) {
  const known = EXAMPLES.find(
    (ex) => ex.name.toLowerCase() === clean(name).toLowerCase(),
  );
  if (known) return known.shape;
  const code = initial(name).toUpperCase().charCodeAt(0);
  return PICK[code % PICK.length];
}

function lineFor(name) {
  const known = EXAMPLES.find(
    (ex) => ex.name.toLowerCase() === clean(name).toLowerCase(),
  );
  return known ? known.line : LINE;
}

function cased(text, look) {
  if (look.cs === "upper") return text.toUpperCase();
  if (look.cs === "lower") return text.toLowerCase();
  return text;
}

/* SVG text that shrinks (and, past a point, squeezes) to stay inside `max` */
function Fit({ x, y, size, max, per, anchor = "start", className, children }) {
  const str = String(children);
  const est = str.length * per * size;
  let fs = size;
  let len;
  if (est > max) {
    fs = Math.max((size * max) / est, size * 0.58);
    if (str.length * per * fs > max) len = max;
  }
  return (
    <text
      x={x}
      y={y}
      fontSize={fs}
      textAnchor={anchor}
      dominantBaseline="central"
      className={className}
      textLength={len}
      lengthAdjust={len ? "spacingAndGlyphs" : undefined}
    >
      {str}
    </text>
  );
}

/* the mark: a shape with the initial set inside. Blank (a grey circle, no
   letter) until the system reaches it. `tone` picks the colour pair. */
function Mark({ b, x = 0, y = 0, size = 100, tone = "p" }) {
  const shape = b.on ? b.shape : "circle";
  return (
    <g
      transform={`translate(${x} ${y}) scale(${size / 100})`}
      className={s[`tone_${tone}`]}
    >
      <path d={SHAPES[shape]} className={s.mShape} />
      {b.on
        ? <text
            x="50"
            y={LETTER_Y[shape]}
            className={s.mLetter}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {b.letter}
          </text>
        : null}
    </g>
  );
}

/* ── the applications ─────────────────────────────────────────────── */

function Web({ b }) {
  return (
    <svg
      viewBox="0 0 400 150"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      <rect
        x="18"
        y="30"
        width="364"
        height="160"
        rx="10"
        className={s.paper}
      />
      <circle cx="32" cy="43" r="3" className={s.fG} />
      <circle cx="42" cy="43" r="3" className={s.fG} />
      <circle cx="52" cy="43" r="3" className={s.fG} />
      <rect x="140" y="35" width="120" height="16" rx="8" className={s.fM} />
      <Fit
        x={200}
        y={43.5}
        size={8.5}
        max={108}
        per={0.56}
        anchor="middle"
        className={s.ui}
      >
        {`${b.slug}.rs`}
      </Fit>
      <rect x="18" y="57" width="364" height="1" className={s.fM} />

      <Mark b={b} x={32} y={65} size={16} />
      <Fit
        x={54}
        y={73}
        size={11.5}
        max={160}
        per={b.per}
        className={`${s.bt} ${s.fD}`}
      >
        {b.word}
      </Fit>
      <rect x="236" y="71" width="20" height="4" rx="2" className={s.fG} />
      <rect x="264" y="71" width="24" height="4" rx="2" className={s.fG} />
      <rect x="296" y="71" width="18" height="4" rx="2" className={s.fG} />
      <rect x="324" y="64" width="46" height="18" rx="9" className={s.fP} />
      <text
        x="347"
        y="73.5"
        fontSize="7.5"
        textAnchor="middle"
        dominantBaseline="central"
        className={s.cta}
      >
        Kontakt
      </text>

      <Fit
        x={32}
        y={102}
        size={17}
        max={176}
        per={b.per * 0.95}
        className={`${s.bh} ${s.fD}`}
      >
        {b.line[0]}
      </Fit>
      <Fit
        x={32}
        y={122}
        size={17}
        max={176}
        per={b.per * 0.95}
        className={`${s.bh} ${s.fD}`}
      >
        {b.line[1]}
      </Fit>
      <rect x="32" y="136" width="124" height="4" rx="2" className={s.fG} />
      <rect x="32" y="144" width="92" height="4" rx="2" className={s.fG} />

      <rect x="222" y="88" width="148" height="100" rx="8" className={s.fA} />
      <Mark b={b} x={271} y={93} size={50} />
    </svg>
  );
}

function Card({ b }) {
  return (
    <svg
      viewBox="0 0 200 114"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <g transform="rotate(-8 66 64)">
        <rect x="16" y="33" width="100" height="62" rx="5" className={s.fP} />
        <Mark b={b} x={51} y={49} size={30} tone="l" />
      </g>
      <g transform="rotate(4 132 68)">
        <rect
          x="84"
          y="40"
          width="100"
          height="62"
          rx="5"
          className={s.shadow}
        />
        <rect
          x="81"
          y="37"
          width="100"
          height="62"
          rx="5"
          className={s.paper}
        />
        <Mark b={b} x={90} y={46} size={13} />
        <Fit
          x={90}
          y={76}
          size={9.5}
          max={74}
          per={b.per}
          className={`${s.bt} ${s.fD}`}
        >
          {b.word}
        </Fit>
        <rect x="90" y="84" width="44" height="2.6" rx="1.3" className={s.fG} />
        <rect
          x="90"
          y="89.5"
          width="30"
          height="2.6"
          rx="1.3"
          className={s.fG}
        />
        <rect x="171" y="45" width="3" height="46" rx="1.5" className={s.fA} />
      </g>
    </svg>
  );
}

function Posts({ b }) {
  return (
    <svg
      viewBox="0 0 200 114"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect x="12" y="25" width="84" height="84" rx="7" className={s.fP} />
      <Mark b={b} x={21} y={34} size={13} tone="l" />
      <circle cx="84" cy="40" r="5" className={s.fA} />
      <text
        x="21"
        y="82"
        fontSize="12.5"
        dominantBaseline="central"
        className={`${s.bh} ${s.fL}`}
      >
        Zakažite
      </text>
      <text
        x="21"
        y="97"
        fontSize="12.5"
        dominantBaseline="central"
        className={`${s.bh} ${s.fL}`}
      >
        online.
      </text>

      <rect x="104" y="25" width="84" height="84" rx="7" className={s.paperL} />
      <Mark b={b} x={124} y={35} size={44} />
      <Fit
        x={146}
        y={97}
        size={7.5}
        max={72}
        per={0.56}
        anchor="middle"
        className={s.ui}
      >
        {`@${b.slug}`}
      </Fit>
    </svg>
  );
}

function Sign({ b }) {
  return (
    <svg
      viewBox="0 0 130 114"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <rect x="16" y="26" width="98" height="80" className={s.paperL} />
      <rect x="22" y="32" width="86" height="19" rx="3" className={s.fP} />
      <Fit
        x={65}
        y={41.8}
        size={9}
        max={76}
        per={b.per}
        anchor="middle"
        className={`${s.bt} ${s.fL}`}
      >
        {b.word}
      </Fit>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={20 + i * 15}
          y="56"
          width="15"
          height="8"
          className={i % 2 ? s.fW : s.fP}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${20 + i * 15} 64a7.5 4 0 0 0 15 0Z`}
          className={i % 2 ? s.fW : s.fP}
        />
      ))}
      <rect x="24" y="75" width="46" height="31" className={s.glass} />
      <Mark b={b} x={39} y={82} size={16} />
      <rect x="78" y="75" width="26" height="31" className={s.fD} />
      <circle cx="99" cy="91" r="1.6" className={s.fA} />
      <rect
        x="8"
        y="105.5"
        width="114"
        height="1.5"
        rx="0.75"
        className={s.fG}
      />
    </svg>
  );
}

function Bag({ b }) {
  return (
    <svg
      viewBox="0 0 130 114"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <ellipse cx="64" cy="107" rx="36" ry="3" className={s.shadow} />
      <path d="M51 45V36a13 13 0 0 1 26 0v9" className={s.handle} />
      <rect x="36" y="42" width="58" height="64" rx="2.5" className={s.fP} />
      <rect x="36" y="42" width="58" height="6" className={s.shade} />
      <rect x="88" y="42" width="6" height="64" className={s.shade} />
      <Mark b={b} x={50} y={60} size={24} tone="l" />
      <Fit
        x={62}
        y={94}
        size={6.5}
        max={44}
        per={b.per}
        anchor="middle"
        className={`${s.bt} ${s.fL}`}
      >
        {b.word}
      </Fit>
    </svg>
  );
}

function Mug({ b }) {
  return (
    <svg
      viewBox="0 0 130 114"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <ellipse cx="62" cy="106" rx="34" ry="3" className={s.shadow} />
      <path d="M87 52h4a12 12 0 0 1 0 24h-4" className={s.mugHandle} />
      <path
        d="M36 38h52v54a12 12 0 0 1-12 12H48a12 12 0 0 1-12-12Z"
        className={s.paper}
      />
      <rect x="36" y="38" width="52" height="6" className={s.fA} />
      <Mark b={b} x={50} y={56} size={24} />
      <Fit
        x={62}
        y={90}
        size={6.5}
        max={42}
        per={b.per}
        anchor="middle"
        className={`${s.bt} ${s.fD}`}
      >
        {b.word}
      </Fit>
    </svg>
  );
}

const MOCKS = [Web, Card, Posts, Sign, Bag, Mug];

/* the mark on the system panel: drawn as an outline first, then filled
   when the palette arrives; the clear space guides come last */
function SysMark({ shape, letter, drawn, rules }) {
  return (
    <svg viewBox="0 0 100 100" className={s.markSvg} aria-hidden="true">
      <motion.g
        className={s.guides}
        initial={false}
        animate={{ opacity: rules ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <path
          d="M24 -300V400M76 -300V400M-300 24H400M-300 76H400"
          className={s.gLine}
        />
        <rect x="12" y="12" width="76" height="76" className={s.gBox} />
        <text x="18" y="50" className={s.gX}>
          x
        </text>
        <text x="50" y="18" className={s.gX}>
          x
        </text>
      </motion.g>
      <g transform="translate(24 24) scale(0.52)">
        <motion.path
          key={shape}
          d={SHAPES[shape]}
          className={s.draw}
          initial={false}
          animate={{ pathLength: drawn ? 1 : 0 }}
          transition={{
            duration: drawn ? 1 : 0.35,
            ease: [0.65, 0, 0.35, 1],
          }}
        />
        <motion.text
          x="50"
          y={LETTER_Y[shape]}
          textAnchor="middle"
          dominantBaseline="central"
          className={s.sysLetter}
          initial={false}
          animate={{ opacity: drawn ? 1 : 0, scale: drawn ? 1 : 0.6 }}
          transition={{
            duration: drawn ? 0.5 : 0.25,
            delay: drawn ? 0.55 : 0,
            ease: EASE,
          }}
        >
          {letter}
        </motion.text>
      </g>
    </svg>
  );
}

function Pen() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 19.5 5.6 15 15.8 4.8a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L9 18.4l-4.5 1.1Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="m13.8 6.8 3.4 3.4"
        stroke="currentColor"
        strokeWidth="1.9"
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

function Roll({ value }) {
  return (
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
  );
}

export default function BrandCard() {
  const reduce = useReducedMotion();
  const first = EXAMPLES[0];
  const [typed, setTyped] = useState(first.name);
  const [name, setName] = useState(first.name);
  const [look, setLook] = useState(first.look);
  const [shape, setShape] = useState(first.shape);
  const [line, setLine] = useState(first.line);
  // steps done (0-5), whether the next one is running, applications lit
  const [lvl, setLvl] = useState(3);
  const [now, setNow] = useState(false);
  const [applied, setApplied] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [user, setUser] = useState(false);
  const [hintMode, setHintMode] = useState("auto");
  const [shown, setShown] = useState("");

  const root = useRef(null);
  const inputRef = useRef(null);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const typedRef = useRef(first.name);
  const userRef = useRef(false);
  const phaseRef = useRef("idle");
  const curEx = useRef(first);
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

  const play = async (t, ex, mode) => {
    const sleep = napper(t);
    curEx.current = ex;
    if (mode === "warm") {
      await sleep(0);
      await sleep(800);
    } else {
      go("out");
      setNow(false);
      setApplied(0);
      setLvl(0);
      await sleep(mode === "type" ? 700 : 520);
      if (mode === "type") {
        let cur = typedRef.current;
        while (cur.length) {
          cur = cur.slice(0, -1);
          type(cur);
          await sleep(16);
        }
        go("typing");
        setShape(ex.shape);
        await sleep(260);
        for (let i = 1; i <= ex.name.length; i += 1) {
          const v = ex.name.slice(0, i);
          type(v);
          setName(v);
          await sleep(ex.name[i - 1] === " " ? 140 : 58 + ((i * 37) % 45));
        }
        await sleep(360);
        go("press");
        await sleep(260);
      }
      setName(ex.name);
      setShape(ex.shape);
      setLine(ex.line);
      if (ex.look != null) setLook(ex.look);
      go("build");
      // the mark draws, the palette fills, the type is set
      setNow(true);
      await sleep(1150);
      setLvl(1);
      await sleep(950);
      setLvl(2);
      await sleep(850);
      setLvl(3);
    }
    go("build");
    setNow(true);
    // then every application, one after another
    for (let i = 1; i <= APPS.length; i += 1) {
      setApplied(i);
      await sleep(i === APPS.length ? 560 : 420);
    }
    setLvl(4);
    await sleep(950);
    setLvl(5);
    setNow(false);
    go("done");
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
      setLvl(5);
      setNow(false);
      setApplied(APPS.length);
      go("done");
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      if (!userRef.current) await play(t, first, "warm");
      for (;;) {
        await sleep(3000);
        if (userRef.current) return;
        const ex = EXAMPLES[nextEx.current % EXAMPLES.length];
        nextEx.current += 1;
        await play(t, ex, "type");
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

  /* the reader steps in: stop the loop and settle on a finished system
     for the example that was on screen */
  const takeOver = () => {
    if (userRef.current) return;
    userRef.current = true;
    setUser(true);
    token.current += 1;
    const p = phaseRef.current;
    if (p === "out" || p === "typing" || p === "press") {
      const ex = curEx.current;
      type(ex.name);
      setName(ex.name);
      setShape(ex.shape);
      setLine(ex.line);
      if (ex.look != null) setLook(ex.look);
    }
    setLvl(5);
    setNow(false);
    setApplied(APPS.length);
    go("done");
  };

  const onFocus = (e) => {
    takeOver();
    setHintMode((m) => (m === "done" ? m : "edit"));
    const el = e.currentTarget;
    requestAnimationFrame(() => el.select());
  };

  const onChange = (e) => {
    takeOver();
    const v = e.target.value;
    type(v);
    setName(v);
    setShape(shapeFor(v));
    setLine(lineFor(v));
    setHintMode("edit");
  };

  const pickLook = (i) => {
    takeOver();
    setLook(i);
    setHintMode((m) => (m === "edit" ? m : "look"));
  };

  const submit = (e) => {
    e.preventDefault();
    takeOver();
    const v = clean(typedRef.current);
    if (!v) {
      inputRef.current?.focus();
      return;
    }
    type(v);
    setShown(v);
    setHintMode("done");
    inputRef.current?.blur();
    const t = ++token.current;
    const ex = { name: v, shape: shapeFor(v), line: lineFor(v), look: null };
    if (reduce) {
      setName(v);
      setShape(ex.shape);
      setLine(ex.line);
      return;
    }
    play(t, ex, "go").catch(() => {});
  };

  const L = LOOKS[look];
  const started = (i) => lvl >= i || (now && lvl === i - 1);
  const drawn = started(1);
  const colored = started(2);
  const fonted = started(3);
  const rules = started(5);
  const full = clean(name) || "Vaša firma";
  const letter = initial(full);
  const brand = (on) => ({
    on,
    shape,
    letter: L.cs === "lower" ? letter.toLowerCase() : letter.toUpperCase(),
    word: on ? cased(full, L) : full,
    per: on ? L.per : NEUTRAL_PER,
    slug: slug(full),
    line,
  });
  const sysBrand = brand(fonted);
  const phoneApplied = Math.min(applied, PHONE_APPS);

  let hint = (
    <>
      <Pointer />
      <span className={s.long}>Upišite ime svoje firme</span>
      <span className={s.short}>Upišite ime</span>
    </>
  );
  if (hintMode === "done")
    hint = (
      <>
        Brend za <b>„{shown}“</b>
      </>
    );
  else if (hintMode === "look")
    hint = (
      <>
        <span className={s.long}>Paleta:</span> <b>{L.name}</b>
      </>
    );
  else if (user)
    hint = (
      <>
        <span className={s.long}>Pritisnite Enter ili Primeni</span>
        <span className={s.short}>Enter ili Primeni</span>
      </>
    );

  return (
    <div
      className={s.stage}
      ref={root}
      style={{
        "--P": L.P,
        "--D": L.D,
        "--A": L.A,
        "--L": L.L,
        "--F": L.F,
        "--W": L.W,
        "--LS": L.LS,
      }}
    >
      <div className={s.deck}>
        <div className={s.card}>
          <form className={s.bar} onSubmit={submit}>
            <span className={s.pen}>
              <Pen />
            </span>
            <label className={s.field}>
              <span className={s.sr}>Ime firme</span>
              <input
                ref={inputRef}
                className={s.input}
                value={typed}
                onChange={onChange}
                onFocus={onFocus}
                placeholder={user ? "Ime firme, npr. Studio Lipa" : ""}
                enterKeyHint="done"
                autoComplete="off"
                spellCheck={false}
                maxLength={26}
              />
              <span className={s.ghost} aria-hidden>
                {typed}
                <i className={s.caret} data-on={phase === "typing"} />
              </span>
            </label>
            <button
              type="submit"
              className={s.go}
              data-press={phase === "press"}
            >
              Primeni
            </button>
          </form>

          <div className={s.meta}>
            <span className={s.hint} data-user={user}>
              {hint}
            </span>
            <span className={s.side}>
              <fieldset className={s.dots}>
                <legend className={s.sr}>Paleta</legend>
                {LOOKS.map((it, i) => (
                  <button
                    key={it.id}
                    type="button"
                    className={s.dot}
                    aria-label={`Paleta: ${it.name}`}
                    aria-pressed={look === i}
                    onClick={() => pickLook(i)}
                    style={{ "--c1": it.P, "--c2": it.A }}
                  />
                ))}
              </fieldset>
              <span
                className={s.count}
                data-full={applied === APPS.length}
                data-full-phone={phoneApplied === PHONE_APPS}
              >
                Primene
                <span className={s.countNo}>
                  <span className={s.wide}>
                    <Roll value={`${applied}/${APPS.length}`} />
                  </span>
                  <span className={s.narrow}>
                    <Roll value={`${phoneApplied}/${PHONE_APPS}`} />
                  </span>
                </span>
              </span>
            </span>
          </div>

          <div className={s.main}>
            <div
              className={s.sys}
              data-c={colored}
              data-t={fonted}
              data-d={drawn}
            >
              <div className={s.markTile}>
                <SysMark
                  shape={shape}
                  letter={sysBrand.letter}
                  drawn={drawn}
                  rules={rules}
                />
              </div>

              <div className={s.lockup}>
                <AnimatePresence mode="wait" initial={false}>
                  {fonted
                    ? <motion.span
                        key="on"
                        className={s.lockIn}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <svg
                          viewBox="0 0 100 100"
                          className={s.lockMark}
                          aria-hidden="true"
                        >
                          <Mark b={sysBrand} />
                        </svg>
                        <span className={s.word}>{sysBrand.word}</span>
                      </motion.span>
                    : <motion.span
                        key="off"
                        className={s.lockSkel}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        aria-hidden="true"
                      >
                        <i />
                        <i />
                      </motion.span>}
                </AnimatePresence>
              </div>

              <div className={s.colors}>
                {SWATCHES.map((k, i) => (
                  <span
                    key={k}
                    className={s.sw}
                    data-k={k}
                    style={{ "--i": i }}
                  >
                    <i>{L[k]}</i>
                  </span>
                ))}
              </div>

              <div className={s.type}>
                <span className={s.aa}>Aa</span>
                <span className={s.typeMeta}>
                  <b>{fonted ? L.type[0] : "Pismo"}</b>
                  <i>{fonted ? L.type[1] : "…"}</i>
                </span>
              </div>
            </div>

            <div className={s.apps}>
              {MOCKS.map((Mock, i) => {
                const on = applied > i;
                return (
                  <div
                    key={APPS[i]}
                    className={s.app}
                    data-on={on}
                    style={{ "--n": APPS.length - i }}
                  >
                    <span className={s.appLabel}>
                      <i />
                      {APPS[i]}
                    </span>
                    <Mock b={brand(on)} />
                  </div>
                );
              })}
            </div>
          </div>

          <div className={s.foot}>
            <span className={s.footLabel}>Šta dobijate</span>
            <span className={s.chips}>
              {STEPS.map((label, i) => {
                const n = i + 1;
                let state = "wait";
                if (lvl >= n) state = "done";
                else if (now && lvl === n - 1) state = "now";
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
    </div>
  );
}
