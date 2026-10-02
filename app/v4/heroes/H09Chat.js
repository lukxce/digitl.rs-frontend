"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h09.module.css";

/* 09 · Razgovor. A short scripted chat: the reader picks what bothers them
   and gets an honest first step and a suggested mix of services. The script
   only describes how digitl works (audit first, monthly report); it promises
   no results. */

const TOPICS = [
  {
    id: "upiti",
    label: "Nemamo dovoljno upita",
    say: [
      "To je najčešći problem sa kojim nam se jave. Prvo gledamo odakle sada dolaze upiti i gde ih gubite.",
      "Prvi korak je pregled sajta, Google profila i oglasa. Posle toga znate šta je prioritet i koliko to košta.",
    ],
    plan: ["SEO", "Plaćeno oglašavanje", "Web"],
    first: "pregled sajta, Google profila i oglasa",
  },
  {
    id: "oglasi",
    label: "Oglasi troše, a ne donose",
    say: [
      "Često problem nije budžet, nego to što se ne meri šta oglas donese. Kampanja može da ima mnogo klikova, a nijedan poziv.",
      "Prvo proveravamo merenje, koga oglasi gađaju i gde ih šalju. Posle toga svakog meseca dobijate izveštaj: šta gasimo, a šta guramo.",
    ],
    plan: ["Plaćeno oglašavanje", "Web"],
    first: "provera merenja i stranica na koje oglasi vode",
  },
  {
    id: "sajt",
    label: "Sajt nam je star i spor",
    say: [
      "Spor sajt gubi ljude pre nego što vide šta nudite, naročito na telefonu.",
      "Prvo merimo brzinu i gledamo gde posetioci odustaju. Onda pravimo brz sajt sa jasnim putem do upita, a ono što već imate na Google-u ne gubite.",
    ],
    plan: ["Web", "SEO", "Brend"],
    first: "merenje brzine i puta do upita",
  },
  {
    id: "merenje",
    label: "Ne znamo šta od marketinga radi",
    say: [
      "To čujemo često. Kad se oglasi, mreže i sajt vode odvojeno, niko ne vidi celu sliku.",
      "Prvo povezujemo merenje, da svaki upit ima izvor. Posle toga dobijate mesečni izveštaj sa jednim brojem: koliko vam je marketing doneo.",
    ],
    plan: ["Plaćeno oglašavanje", "SEO", "Društvene mreže"],
    first: "pregled svih kanala i povezivanje merenja",
  },
];

const GREETING = {
  id: "hi",
  from: "bot",
  text: "Zdravo. Šta vas trenutno najviše muči?",
};

const EASE = [0.16, 1, 0.3, 1];

function Avatar({ size = "sm" }) {
  return (
    <span className={s.avatar} data-size={size} aria-hidden>
      d
    </span>
  );
}

function Restart() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Send() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12 4 4.5 20 12 4 19.5 5 12Zm0 0h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Seen() {
  return (
    <svg
      width="15"
      height="10"
      viewBox="0 0 22 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m1 7.5 4.5 4.5L14 2.5M10 11.5l1 .5L20.5 2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function H09Chat() {
  const reduce = useReducedMotion();
  const [log, setLog] = useState([GREETING]);
  const [asked, setAsked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [typing, setTyping] = useState(false);
  const [pressed, setPressed] = useState(null);

  const panel = useRef(null);
  const box = useRef(null);
  const token = useRef(0);
  const busyRef = useRef(false);
  const touched = useRef(false);
  const demoed = useRef(false);
  const seq = useRef(0);
  const reduceRef = useRef(false);
  reduceRef.current = !!reduce;

  const add = (msg) => {
    seq.current += 1;
    const id = `m${seq.current}`;
    setLog((l) => [...l, { ...msg, id }]);
  };

  const pick = async (tp) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const t = token.current;
    const quick = reduceRef.current;
    const wait = (ms) =>
      new Promise((resolve, reject) => {
        setTimeout(
          () => (t === token.current ? resolve() : reject(0)),
          quick ? 0 : ms,
        );
      });
    setAsked((a) => [...a, tp.id]);
    add({ from: "me", text: tp.label });
    try {
      await wait(380);
      if (!quick) setTyping(true);
      await wait(900);
      setTyping(false);
      add({ from: "bot", text: tp.say[0] });
      await wait(320);
      if (!quick) setTyping(true);
      await wait(1000);
      setTyping(false);
      add({ from: "bot", text: tp.say[1] });
      await wait(520);
      add({ from: "card", topic: tp.id });
      await wait(260);
    } catch {
      return;
    }
    busyRef.current = false;
    setBusy(false);
  };

  const choose = (tp) => {
    touched.current = true;
    pick(tp);
  };

  const restart = () => {
    touched.current = true;
    token.current += 1;
    busyRef.current = false;
    setBusy(false);
    setTyping(false);
    setAsked([]);
    setLog([GREETING]);
    box.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  // keep the newest message in view, inside the chat only (never the page)
  const lastId = log[log.length - 1].id;
  useEffect(() => {
    const el = box.current;
    if (!el || (lastId === "hi" && !typing)) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: reduceRef.current ? "auto" : "smooth",
    });
  }, [lastId, typing, busy]);

  // the first time the chat is in view, show the flow once if nobody clicks
  // biome-ignore lint/correctness/useExhaustiveDependencies: pick only touches refs and setters
  useEffect(() => {
    const el = panel.current;
    if (!el || reduce) return;
    let timer = 0;
    let press = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        clearTimeout(timer);
        if (demoed.current || touched.current) {
          io.disconnect();
          return;
        }
        if (!e.isIntersecting) return;
        timer = setTimeout(() => {
          if (demoed.current || touched.current || busyRef.current) return;
          demoed.current = true;
          io.disconnect();
          setPressed(TOPICS[0].id);
          press = setTimeout(() => {
            setPressed(null);
            pick(TOPICS[0]);
          }, 450);
        }, 2000);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      clearTimeout(press);
    };
  }, [reduce]);

  useEffect(
    () => () => {
      token.current += 1;
    },
    [],
  );

  const lastMine = log.findLastIndex((m) => m.from === "me");
  const left = TOPICS.filter((tp) => !asked.includes(tp.id));
  const showChips = !busy && !typing;
  const enter = (from) =>
    reduce
      ? false
      : {
          opacity: 0,
          y: 12,
          scale: 0.96,
          transformOrigin: from === "me" ? "100% 100%" : "0% 100%",
        };

  return (
    <div className={s.hero}>
      <div className={s.grid}>
        <HeroCopy align="left" />

        <div className={s.stage}>
          <section
            ref={panel}
            className={s.panel}
            aria-label="Razgovor sa digitl timom"
            onPointerDown={() => {
              touched.current = true;
            }}
          >
            <header className={s.head}>
              <span className={s.who}>
                <Avatar size="lg" />
                <span className={s.online} aria-hidden />
              </span>
              <span className={s.name}>
                <b>digitl tim</b>
                <span className={s.status}>
                  <i aria-hidden /> na mreži
                </span>
              </span>
            </header>

            <div className={s.log} ref={box} aria-live="polite">
              <div className={s.intro}>
                <Avatar size="xl" />
                <b>digitl tim</b>
                <p>
                  Oglasi, SEO, sajt, mreže i brend. Recite šta vas muči, a mi
                  predlažemo prvi korak.
                </p>
                <span className={s.day}>Danas</span>
              </div>

              {log.map((m, i) => {
                const next = log[i + 1];
                const tail =
                  m.from !== "me" &&
                  (!next || next.from === "me") &&
                  !(typing && i === log.length - 1);
                if (m.from === "card") {
                  const tp = TOPICS.find((x) => x.id === m.topic);
                  return (
                    <motion.div
                      key={m.id}
                      className={s.row}
                      data-from="bot"
                      initial={enter("bot")}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <span className={s.slot}>{tail ? <Avatar /> : null}</span>
                      <div className={s.card}>
                        <span className={s.eyebrow}>Predlog</span>
                        <span className={s.plan}>
                          {tp.plan.map((p) => (
                            <span key={p}>{p}</span>
                          ))}
                        </span>
                        <p className={s.first}>
                          <b>Prvi korak:</b> {tp.first}.
                        </p>
                        <button type="button" className={s.book}>
                          Zakažite razgovor
                          <span>
                            <Arrow />
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  );
                }
                return (
                  <motion.div
                    key={m.id}
                    className={s.row}
                    data-from={m.from}
                    data-tail={tail || undefined}
                    initial={m.id === "hi" ? false : enter(m.from)}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    {m.from === "bot"
                      ? <span className={s.slot}>
                          {tail ? <Avatar /> : null}
                        </span>
                      : null}
                    <p className={s.bubble}>
                      {m.text}
                      {m.from === "me" && i === lastMine
                        ? <span className={s.seen}>
                            <Seen />
                          </span>
                        : null}
                    </p>
                  </motion.div>
                );
              })}

              <AnimatePresence>
                {typing
                  ? <motion.div
                      key="typing"
                      className={s.row}
                      data-from="bot"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      <span className={s.slot}>
                        <Avatar />
                      </span>
                      <span className={s.typing} role="status">
                        <i />
                        <i />
                        <i />
                        <span className={s.sr}>digitl tim piše</span>
                      </span>
                    </motion.div>
                  : null}
              </AnimatePresence>

              {showChips
                ? <div className={s.replies} key={`r${log.length}`}>
                    {asked.length > 0
                      ? <motion.button
                          type="button"
                          className={s.chip}
                          data-kind="again"
                          onClick={restart}
                          initial={reduce ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          <Restart /> Pitajte još nešto
                        </motion.button>
                      : null}
                    {left.map((tp, i) => (
                      <motion.button
                        key={tp.id}
                        type="button"
                        className={s.chip}
                        data-pressed={pressed === tp.id || undefined}
                        onClick={() => choose(tp)}
                        initial={
                          reduce || asked.length === 0
                            ? false
                            : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: EASE,
                          delay: 0.06 * (i + 1),
                        }}
                      >
                        {tp.label}
                      </motion.button>
                    ))}
                  </div>
                : null}
            </div>

            <div className={s.compose} aria-hidden>
              <span className={s.field}>
                {showChips ? "Izaberite jedan od odgovora" : "digitl tim piše…"}
              </span>
              <span className={s.send}>
                <Send />
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
