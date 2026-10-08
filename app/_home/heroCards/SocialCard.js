"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import s from "./socialCard.module.css";

/* The hero's social card. A week of posts for "vasafirma": the plan drops
   into the days, the content gets shot, then each day's post goes out, the
   likes and comments come in, and a message arrives, gets an answer and
   turns into an enquiry. Then the next day. The reader can press "Objavi"
   to publish the next post now, and double-tap a post to like it. Everything
   is illustrative: generic names, modest numbers. */

const DAYS = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const TYPE = { reel: "Reel", post: "Post", story: "Story" };

const POSTS = [
  {
    day: 0,
    time: "18:00",
    title: "Pre i posle",
    type: "reel",
    art: "pre",
    likes: 64,
    caption: "Pre i posle: isti prostor, dva dana kasnije.",
    comment: ["milan.k", "Razlika je ogromna!"],
    dm: {
      who: "Jelena M.",
      ini: "JM",
      tone: "spark",
      text: "Koliko košta montaža?",
      upit: true,
    },
  },
  {
    day: 1,
    time: "12:00",
    title: "Saveti",
    type: "post",
    art: "saveti",
    likes: 41,
    caption: "Tri saveta pre nego što pozovete majstora.",
    comment: ["sanja_d", "Korisno, hvala!"],
    dm: {
      who: "Marko S.",
      ini: "MS",
      tone: "mist",
      text: "Hvala na savetima, baš korisno.",
      upit: false,
    },
  },
  {
    day: 3,
    time: "09:30",
    title: "Iza kulisa",
    type: "story",
    art: "kulise",
    likes: 37,
    caption: "Iza kulisa: jutro pre prvog termina.",
    comment: ["petar.j", "Svaka čast ekipi."],
    dm: {
      who: "Ana P.",
      ini: "AP",
      tone: "lime",
      text: "Da li radite subotom?",
      upit: true,
    },
  },
  {
    day: 4,
    time: "17:00",
    title: "Recenzija",
    type: "post",
    art: "recenzija",
    likes: 48,
    caption: "„Brzo, čisto i tačno po dogovoru.“",
    comment: ["tamara.v", "Potvrđujem, isto iskustvo."],
    dm: {
      who: "Nikola D.",
      ini: "ND",
      tone: "ink",
      text: "Možete li sutra?",
      upit: true,
    },
  },
  {
    day: 5,
    time: "11:00",
    title: "Ponuda",
    type: "reel",
    art: "ponuda",
    likes: 57,
    caption: "Ponuda: -10% na prvi termin, do kraja meseca.",
    comment: ["dragan_m", "Važi li i za firme?"],
    dm: {
      who: "Ivana R.",
      ini: "IR",
      tone: "accent",
      text: "Imate li slobodan termin u petak?",
      upit: true,
    },
  },
];
const BY_DAY = DAYS.map((_, d) => POSTS.findIndex((p) => p.day === d));

/* One post's life in ticks: it goes out, a comment, a message, the answer,
   the enquiry, the check in the plan. */
const TICK = 85;
const N = 20;
const T_LIVE = 4;
const T_COMMENT = 3;
const T_DM = 5;
const T_REPLY = 9;
const T_UPIT = 13;
const T_CHECK = 16;

const EASE = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring", stiffness: 300, damping: 32, mass: 0.9 };
const POP = { type: "spring", stiffness: 420, damping: 18 };
const STOP = Symbol("stop");

// two older, already answered messages, so the inbox is never empty
const SEED = [
  {
    key: "s1",
    who: "Stefan J.",
    ini: "SJ",
    tone: "pale",
    text: "Hvala, vidimo se u utorak.",
    upit: false,
    t: N,
    old: true,
  },
  {
    key: "s2",
    who: "Milica T.",
    ini: "MT",
    tone: "mist",
    text: "Super, hvala na brzom odgovoru!",
    upit: false,
    t: N,
    old: true,
  },
];

const EMPTY = [-1, -1, -1, -1, -1];

// the first frame (and the server render): Monday's post is out
const START = {
  week: 0,
  phase: "pub",
  planN: 5,
  shotN: 5,
  prog: [N, -1, -1, -1, -1],
  cur: 0,
  carryPost: null,
  carryDms: SEED,
  followers: 1240,
  upiti: 0,
};
// reduced motion: the whole week, done
const FINAL = {
  ...START,
  phase: "done",
  prog: [N, N, N, N, N],
  cur: 4,
};

const ease3 = (x) => 1 - (1 - x) ** 3;
const likesAt = (total, t) =>
  t < 1 ? 0 : Math.round(total * ease3(Math.min(1, t / 15)));
const commentsAt = (t) => (t >= T_COMMENT) + (t >= 11) + (t >= 17);
const gainAt = (t) => (t >= 6) + (t >= 12) + (t >= 18);

function fmt(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 1 pratilac, 2 pratioca, 5 pratilaca (and 21, 22, 25 ...)
function pratioci(n) {
  const a = n % 10;
  const b = n % 100;
  if (a === 1 && b !== 11) return "pratilac";
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "pratioca";
  return "pratilaca";
}

function derive(w) {
  let upiti = w.upiti;
  let followers = w.followers;
  const dms = [];
  w.prog.forEach((t, i) => {
    if (t < 0) return;
    followers += gainAt(t);
    if (POSTS[i].dm.upit && t >= T_UPIT) upiti += 1;
  });
  for (let i = POSTS.length - 1; i >= 0; i -= 1) {
    const t = w.prog[i];
    if (t >= T_DM) dms.push({ key: `${w.week}-${i}`, ...POSTS[i].dm, t });
  }
  // four rows: the list shows three (two on phones), the fourth slides out
  const inbox = [...dms, ...w.carryDms].slice(0, 4);
  const post =
    w.cur >= 0
      ? { key: `${w.week}-${w.cur}`, i: w.cur, t: w.prog[w.cur] }
      : w.carryPost;
  return { upiti, followers, inbox, post };
}

/* ── icons ───────────────────────────────────────────────────────── */
function Svg({ size = 16, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

function Check({ size = 12 }) {
  return (
    <Svg size={size}>
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Pointer() {
  return (
    <Svg size={14}>
      <path
        d="M9 4.5v9.2l-1.6-1.5a1.8 1.8 0 0 0-2.6 2.5l4.6 5a4 4 0 0 0 3 1.3h2.8a4.3 4.3 0 0 0 4.3-4.3v-4.4a1.6 1.6 0 0 0-3.2 0V11a1.6 1.6 0 0 0-3.2-.6V10a1.6 1.6 0 0 0-3.2 0V4.5a1.5 1.5 0 0 0-3 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Heart({ size = 20 }) {
  return (
    <Svg size={size}>
      <path
        d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Bubble() {
  return (
    <Svg size={19}>
      <path
        d="M19.5 11.5a7.5 7.5 0 0 1-10.9 6.7L4.5 19.5l1.3-3.9a7.5 7.5 0 1 1 13.7-4.1Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Plane() {
  return (
    <Svg size={18}>
      <path
        d="M20.5 3.5 10.4 13.6M20.5 3.5 14 20.5l-3.6-6.9-6.9-3.6 17-6.5Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Mark() {
  return (
    <Svg size={18}>
      <path
        d="M6.5 4.5h11v15l-5.5-3.8-5.5 3.8v-15Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Clock() {
  return (
    <Svg size={13}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8v4.2l2.8 1.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TypeIcon({ type }) {
  if (type === "reel")
    return (
      <Svg size={11}>
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          stroke="currentColor"
          strokeWidth="2.4"
        />
        <path d="M10 8.6v6.8l5.6-3.4L10 8.6Z" fill="currentColor" />
      </Svg>
    );
  if (type === "story")
    return (
      <Svg size={11}>
        <circle
          cx="12"
          cy="12"
          r="8.2"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeDasharray="4.2 2.8"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </Svg>
    );
  return (
    <Svg size={11}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="m6.5 17 4-4.5 3 3 2-2 2.5 3.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.2 14.7 8.7l6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9L12 3.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ── the post pictures, drawn in CSS ─────────────────────────────── */
function Art({ kind }) {
  if (kind === "pre")
    return (
      <span className={s.art} data-art="pre">
        <i className={s.preL} />
        <i className={s.preR} />
        <i className={s.preBar} />
        <i className={s.preKnob}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9.5 7.5 5 12l4.5 4.5M14.5 7.5 19 12l-4.5 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </i>
        <em className={s.lbl} data-side="l">
          Pre
        </em>
        <em className={s.lbl} data-side="r">
          Posle
        </em>
      </span>
    );
  if (kind === "saveti")
    return (
      <span className={s.art} data-art="saveti">
        <b className={s.num}>3</b>
        <span className={s.bars}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.dots}>
          <i />
          <i />
          <i />
        </span>
      </span>
    );
  if (kind === "kulise")
    return (
      <span className={s.art} data-art="kulise">
        <span className={s.story}>
          <i />
          <i />
          <i />
        </span>
        <i className={s.corner} data-c="tl" />
        <i className={s.corner} data-c="tr" />
        <i className={s.corner} data-c="bl" />
        <i className={s.corner} data-c="br" />
        <i className={s.focus} />
      </span>
    );
  if (kind === "recenzija")
    return (
      <span className={s.art} data-art="recenzija">
        <b className={s.quote}>“</b>
        <span className={s.stars}>
          <Star />
          <Star />
          <Star />
          <Star />
          <Star />
        </span>
        <span className={s.lines}>
          <i />
          <i />
        </span>
      </span>
    );
  return (
    <span className={s.art} data-art="ponuda">
      <b className={s.off}>-10%</b>
      <span className={s.lines}>
        <i />
      </span>
    </span>
  );
}

function Roll({ value, dy = 14 }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.b
        key={value}
        initial={{ y: dy, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -dy, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {value}
      </motion.b>
    </AnimatePresence>
  );
}

export default function SocialCard() {
  const reduce = useReducedMotion();
  const [w, setW] = useState(START);
  const [user, setUser] = useState(false);
  const [liked, setLiked] = useState({});
  const [pop, setPop] = useState({ n: 0, key: "" });

  const root = useRef(null);
  const model = useRef(START);
  const token = useRef(0);
  const visible = useRef(false);
  const wakers = useRef([]);
  const userRef = useRef(false);
  const lastTap = useRef(0);
  const hold = useRef(0);

  const commit = (patch) => {
    model.current = { ...model.current, ...patch };
    setW(model.current);
  };
  const setProg = (i, t) => {
    const prog = model.current.prog.slice();
    prog[i] = t;
    commit({ prog, cur: i, phase: "pub", planN: 5, shotN: 5 });
  };
  const newWeek = () => {
    const m = model.current;
    const d = derive(m);
    commit({
      week: m.week + 1,
      phase: "plan",
      planN: 0,
      shotN: 0,
      prog: EMPTY,
      cur: -1,
      carryPost: d.post ? { ...d.post, t: N } : null,
      carryDms: d.inbox.map((x) => ({ ...x, t: N })),
      followers: d.followers,
      upiti: d.upiti,
    });
  };

  /* A pause that also holds while the card is off screen (and for a moment
     after the reader likes a post), and gives up as soon as a newer run has
     started. */
  const napper = (t) => (ms) =>
    new Promise((resolve, reject) => {
      const check = () => {
        if (t !== token.current) return reject(STOP);
        const wait = hold.current - performance.now();
        if (wait > 0) {
          setTimeout(check, wait);
          return;
        }
        if (!visible.current) {
          wakers.current.push(check);
          return;
        }
        resolve();
      };
      setTimeout(check, ms);
    });

  const planWeek = async (sleep, fast) => {
    newWeek();
    await sleep(fast ? 160 : 520);
    for (let k = 1; k <= POSTS.length; k += 1) {
      commit({ planN: k });
      await sleep(fast ? 55 : 120);
    }
    await sleep(fast ? 120 : 320);
    commit({ phase: "shoot" });
    for (let k = 1; k <= POSTS.length; k += 1) {
      commit({ shotN: k });
      await sleep(fast ? 60 : 130);
    }
    await sleep(fast ? 160 : 380);
  };

  const publish = async (sleep, i) => {
    for (let t = 0; t <= N; t += 1) {
      setProg(i, t);
      if (t < N) await sleep(TICK);
    }
  };

  // on screen or not: the loop holds while hidden
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

  // the week on repeat, until the reader takes over
  // biome-ignore lint/correctness/useExhaustiveDependencies: helpers only touch refs and setters
  useEffect(() => {
    if (userRef.current) return;
    if (reduce) {
      model.current = FINAL;
      setW(FINAL);
      return;
    }
    const t = ++token.current;
    const sleep = napper(t);
    (async () => {
      let from = 1;
      await sleep(1300);
      for (;;) {
        for (let i = from; i < POSTS.length; i += 1) {
          await publish(sleep, i);
          await sleep(220);
        }
        commit({ phase: "done" });
        await sleep(2300);
        await planWeek(sleep, false);
        from = 0;
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

  // "Objavi": the next post goes out now (a new week once all five are out)
  const publishNow = () => {
    userRef.current = true;
    setUser(true);
    const t = ++token.current;
    const m = model.current;
    const prog = m.prog.map((x) => (x >= 0 ? N : -1));
    commit({ prog, planN: 5, shotN: 5 });
    const next = prog.indexOf(-1);
    if (reduce) {
      if (next < 0) newWeek();
      setProg(next < 0 ? 0 : next, N);
      if (next === POSTS.length - 1) commit({ phase: "done" });
      return;
    }
    const sleep = napper(t);
    (async () => {
      let i = next;
      if (i < 0) {
        await planWeek(sleep, true);
        i = 0;
      }
      await publish(sleep, i);
      if (i === POSTS.length - 1) commit({ phase: "done" });
    })().catch(() => {});
  };

  const d = derive(w);
  const post = d.post;
  const P = post ? POSTS[post.i] : null;
  const isLiked = post ? Boolean(liked[post.key]) : false;
  const likes = post ? likesAt(P.likes, post.t) + (isLiked ? 1 : 0) : 0;

  const like = () => {
    if (!post) return;
    // let the reader see their like land before the next post goes out
    if (!userRef.current) hold.current = performance.now() + 2000;
    setLiked((l) => (l[post.key] ? l : { ...l, [post.key]: true }));
    setPop((p) => ({ n: p.n + 1, key: post.key }));
  };
  const toggleLike = () => {
    if (!post) return;
    setLiked((l) => ({ ...l, [post.key]: !l[post.key] }));
  };
  // double tap (or double click) on the picture: like it, with a heart
  const onTap = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const now = e.timeStamp;
    if (now - lastTap.current < 330) {
      lastTap.current = 0;
      like();
    } else lastTap.current = now;
  };

  const pub = w.phase === "pub" && w.cur >= 0;
  const curT = pub ? w.prog[w.cur] : -1;
  const hot = pub && POSTS[w.cur].dm.upit && curT >= T_UPIT && curT < N;
  const done = w.phase === "done";
  const left = w.prog.filter((x) => x < 0).length;
  const nextIdx = w.prog.indexOf(-1);
  const storyLive = pub && POSTS[w.cur].type === "story";
  const unread = d.inbox.slice(0, 3).filter((x) => x.t < T_REPLY).length;

  let next = { k: "Sledeća objava", v: "nova nedelja" };
  if (w.phase === "plan" || w.phase === "shoot")
    next = { k: "Nova nedelja", v: "plan i snimanje" };
  else if (nextIdx >= 0)
    next = {
      k: "Sledeća objava",
      v: `${DAYS[POSTS[nextIdx].day]} ${POSTS[nextIdx].time}`,
    };

  let hint = (
    <>
      <Pointer />
      <span className={s.long}>Kliknite Objavi ili dvaput na objavu</span>
      <span className={s.short}>Tapnite Objavi</span>
    </>
  );
  if (user && done && w.cur >= 0) hint = "Cela nedelja je objavljena";
  else if (user && w.cur >= 0)
    hint = (
      <span className={s.said}>
        Objavljeno: <b>{POSTS[w.cur].title}</b>
        <span className={s.long}>, još {left} u planu</span>
      </span>
    );
  else if (user) hint = "Nova nedelja, planiranje…";

  return (
    <MotionConfig reducedMotion="user">
      <div className={s.stage} ref={root}>
        <div className={s.deck}>
          <div className={s.card}>
            {/* ── account + publish ───────────────────────────────── */}
            <div className={s.bar}>
              <span className={s.avaRing} data-story={storyLive}>
                <span className={s.ava}>V</span>
              </span>
              <span className={s.who}>
                <b>@vasafirma</b>
                <span className={s.fans}>
                  <span className={s.fansNo}>
                    <Roll value={fmt(d.followers)} dy={17} />
                  </span>
                  {pratioci(d.followers)}
                </span>
              </span>
              <span className={s.next}>
                <span>{next.k}</span>
                <b>{next.v}</b>
              </span>
              <button type="button" className={s.go} onClick={publishNow}>
                {user && done ? "Nova nedelja" : "Objavi"}
              </button>
            </div>

            {/* ── hint + enquiries ────────────────────────────────── */}
            <div className={s.meta}>
              <span className={s.hint} data-user={user} aria-live="polite">
                {hint}
              </span>
              <span className={s.leads} data-done={done} data-hot={hot}>
                Upiti iz poruka
                <span className={s.leadsNo}>
                  <Roll value={d.upiti} />
                </span>
              </span>
            </div>

            {/* ── the week ────────────────────────────────────────── */}
            <div
              className={s.week}
              style={{ "--d": pub ? POSTS[w.cur].day : 0 }}
            >
              <span className={s.ring} data-on={pub} aria-hidden />
              <ol className={s.days} aria-label="Plan objava za ovu nedelju">
                {DAYS.map((day, k) => {
                  const i = BY_DAY[k];
                  const p = i >= 0 ? POSTS[i] : null;
                  const planned = p && i < w.planN;
                  const shot = p && i < w.shotN;
                  const out = p && w.prog[i] >= T_CHECK;
                  return (
                    <li
                      key={day}
                      className={s.day}
                      data-today={pub && w.cur === i}
                    >
                      <span className={s.dayName}>{day}</span>
                      <span
                        className={s.tile}
                        data-free={!p || undefined}
                        data-plan={planned || undefined}
                        data-shot={shot || undefined}
                      >
                        {p
                          ? <motion.span
                              className={s.tileIn}
                              initial={false}
                              animate={
                                planned
                                  ? { y: 0, opacity: 1, scale: 1 }
                                  : { y: -14, opacity: 0, scale: 0.9 }
                              }
                              transition={
                                planned
                                  ? POP
                                  : {
                                      duration: 0.3,
                                      ease: EASE,
                                      delay: i * 0.03,
                                    }
                              }
                            >
                              <span className={s.tileType}>
                                <TypeIcon type={p.type} />
                              </span>
                              <span className={s.tileArt}>
                                <Art kind={p.art} />
                              </span>
                            </motion.span>
                          : null}
                        <AnimatePresence>
                          {out
                            ? <motion.span
                                className={s.tileCheck}
                                initial={{ scale: 0.3, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={POP}
                              >
                                <Check size={10} />
                              </motion.span>
                            : null}
                        </AnimatePresence>
                      </span>
                      <span
                        className={s.dayTitle}
                        data-on={planned || !p || undefined}
                        data-free={!p || undefined}
                      >
                        {p ? <TypeIcon type={p.type} /> : null}
                        {p ? p.title : "Slobodno"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* ── the post that just went out + the inbox ─────────── */}
            <div className={s.main}>
              <div className={s.feed}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {post
                    ? <motion.article
                        key={post.key}
                        className={s.post}
                        initial={{ opacity: 0, y: 18, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: EASE }}
                      >
                        <header className={s.postHead}>
                          <span className={s.postAva}>V</span>
                          <span className={s.postWho}>
                            <b className={s.postName}>vasafirma</b>
                            <b className={s.postTitle}>{P.title}</b>
                            <span>
                              {TYPE[P.type]} · {DAYS[P.day]} {P.time}
                            </span>
                          </span>
                          <span
                            className={s.state}
                            data-live={post.t < T_LIVE || undefined}
                          >
                            {post.t < T_LIVE
                              ? <>
                                  <i className={s.spin} />
                                  <span className={s.word}>Objavljuje se</span>
                                </>
                              : <>
                                  <Check size={10} />
                                  <span className={s.word}>Objavljeno</span>
                                </>}
                          </span>
                        </header>
                        <div
                          className={s.shot}
                          onPointerUp={onTap}
                          title="Dvaput kliknite da vam se svidi"
                        >
                          <Art kind={P.art} />
                          <span className={s.shotType}>
                            <TypeIcon type={P.type} />
                            {TYPE[P.type]}
                          </span>
                          {pop.n > 0 && pop.key === post.key
                            ? <motion.span
                                key={pop.n}
                                className={s.burst}
                                initial={{ scale: 0.3, opacity: 0 }}
                                animate={{
                                  scale: [0.3, 1.18, 1, 1.06],
                                  opacity: [0, 1, 1, 0],
                                }}
                                transition={{
                                  duration: 0.95,
                                  times: [0, 0.25, 0.7, 1],
                                  ease: "easeOut",
                                }}
                              >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                  <path
                                    d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </motion.span>
                            : null}
                        </div>
                        <div className={s.acts}>
                          <button
                            type="button"
                            className={s.likeBtn}
                            data-on={isLiked}
                            aria-pressed={isLiked}
                            aria-label="Sviđa mi se"
                            onClick={toggleLike}
                          >
                            <motion.span
                              key={isLiked ? "y" : "n"}
                              initial={isLiked ? { scale: 0.6 } : false}
                              animate={{ scale: 1 }}
                              transition={POP}
                            >
                              <Heart />
                            </motion.span>
                          </button>
                          <b className={s.count}>{likes}</b>
                          <span className={s.act}>
                            <Bubble />
                            <b className={s.count}>{commentsAt(post.t)}</b>
                          </span>
                          <span className={s.act}>
                            <Plane />
                          </span>
                          <span className={s.save}>
                            <Mark />
                          </span>
                        </div>
                        <p className={s.caption}>
                          <b>vasafirma</b> {P.caption}
                        </p>
                        <p
                          className={s.comment}
                          data-on={post.t >= T_COMMENT || undefined}
                        >
                          <b>{P.comment[0]}</b> {P.comment[1]}
                        </p>
                      </motion.article>
                    : null}
                </AnimatePresence>
              </div>

              <div className={s.inbox}>
                <div className={s.inHead}>
                  <span className={s.inTitle}>
                    Poruke
                    <AnimatePresence initial={false}>
                      {unread > 0
                        ? <motion.em
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.4, opacity: 0 }}
                            transition={POP}
                          >
                            {unread}
                          </motion.em>
                        : null}
                    </AnimatePresence>
                  </span>
                  <span className={s.speed}>
                    <Clock />
                    odgovor za ~5 min
                  </span>
                </div>
                <ul className={s.dms}>
                  <AnimatePresence initial={false}>
                    {d.inbox.map((m) => {
                      const fresh = m.t < T_REPLY;
                      const lead = m.upit && m.t >= T_UPIT;
                      return (
                        <motion.li
                          key={m.key}
                          layout="position"
                          className={s.dmSlot}
                          initial={{ opacity: 0, y: "-100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{
                            layout: SPRING,
                            y: SPRING,
                            opacity: { duration: 0.4, ease: EASE },
                          }}
                        >
                          <span
                            className={s.dm}
                            data-new={fresh || undefined}
                            data-lead={lead || undefined}
                          >
                            <span className={s.dmAva} data-tone={m.tone}>
                              {m.ini}
                            </span>
                            <span className={s.dmBody}>
                              <span className={s.dmTop}>
                                <b>{m.who}</b>
                                <span className={s.dmMeta}>
                                  {m.old
                                    ? "juče"
                                    : fresh
                                      ? <>
                                          <i className={s.dot} />
                                          sada
                                        </>
                                      : <>
                                          <Check size={10} />
                                          <span className={s.word}>
                                            odgovoreno
                                          </span>
                                        </>}
                                </span>
                              </span>
                              <span className={s.dmText}>{m.text}</span>
                            </span>
                            <span className={s.dmTag}>
                              <AnimatePresence initial={false}>
                                {lead
                                  ? <motion.em
                                      initial={{ scale: 0.4, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0.6, opacity: 0 }}
                                      transition={POP}
                                    >
                                      Upit
                                    </motion.em>
                                  : null}
                              </AnimatePresence>
                            </span>
                          </span>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
