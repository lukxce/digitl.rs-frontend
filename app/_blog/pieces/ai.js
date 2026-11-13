"use client";

/* Bespoke pieces for "AI za firme i šest poslova koje možete automatizovati
   odmah". Every fact comes from the post (draft-widgets.md):
   - ai-poslovi: the six tasks as a picker; each one drawn as a small line
     from where the data comes from, through the tool, to the person who
     still approves, and on to the customer or inside the firm.
   - ai-ponuda: the same example quote put together by hand and from the
     price list, side by side, counted in steps (the post gives no minutes).
   - ai-podaci: a sorter; the reader puts each piece of customer data into
     "sme u alat" or "ne unosite" and gets the post's rule for it. */

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Lock, Rotate, X } from "../../_home/icons";
import s from "./ai.module.css";

const EASE = [0.16, 1, 0.3, 1];

const rise = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, ease: EASE },
};

/* ── 1. the six tasks ─────────────────────────────────────────────────── */

const TASKS = [
  {
    short: "Ponude",
    name: "Ponude iz cenovnika",
    from: "Cenovnik ili katalog sa važećim cenama",
    does: "Pronađe svaku stavku u cenovniku, upiše važeću cenu i složi dokument u izgledu koji firma već koristi.",
    rules: true,
    ai: true,
    how: "Pravila, AI samo za tekst poruke",
    human: "Popust i uslove pre slanja",
    personal: "Da, ime i kontakt",
    risky: true,
    out: "kupac",
  },
  {
    short: "Pitanja kupaca",
    name: "Odgovori na ponovljena pitanja",
    from: "Rokovi, garancija, uslovi prodaje",
    does: "Asistent odgovara samo iz dokumenta koji mu date, a pitanje koje ne zna prosleđuje čoveku sa celim razgovorom.",
    rules: false,
    ai: true,
    how: "AI",
    human: "Pitanja na koja asistent nema odgovor",
    personal: "Da, kad kupac piše",
    risky: true,
    out: "kupac",
  },
  {
    short: "Cene",
    name: "Cene i podaci o proizvodima",
    from: "Cenovnici dobavljača i cene konkurencije",
    does: "Svako jutro proveri cene dobavljača i konkurencije i postavi cenu po pravilu koje je odredila prodavnica.",
    rules: true,
    ai: true,
    how: "Pravila za cene, AI za neuredne tabele i opise",
    human: "Veliku promenu cene",
    personal: "Ne",
    risky: false,
    out: "kupac",
  },
  {
    short: "Upiti u CRM",
    name: "Upiti u CRM",
    from: "E-pošta i forma na sajtu",
    does: "Upit sam uđe u CRM, sa podsetnikom kad treba javiti kupcu i oznakom vrste i hitnosti.",
    rules: true,
    ai: true,
    how: "Pravila, AI za razvrstavanje",
    human: "Šta ćete kupcu ponuditi",
    personal: "Da",
    risky: true,
    out: "firma",
  },
  {
    short: "Sažeci",
    name: "Sažeci poziva i sastanaka",
    from: "Snimak ili beleške",
    does: "Napravi sažetak sa dogovorenim koracima i imenom osobe zadužene za svaki.",
    rules: false,
    ai: true,
    how: "AI",
    human: "Tačnost sažetka i zaduženja",
    personal: "Da, kad je kupac u razgovoru",
    risky: true,
    out: "firma",
  },
  {
    short: "Izveštaji",
    name: "Izveštaji",
    from: "Programi za prodaju, upite i lager",
    does: "Svakog ponedeljka složi izveštaj iz programa koje već koristite, sa kratkim komentarom šta se promenilo.",
    rules: true,
    ai: true,
    how: "Pravila, AI za kratak komentar",
    human: "Odluke koje slede iz brojeva",
    personal: "Obično ne",
    risky: false,
    out: "firma",
  },
];

function Tasks() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });
  const still = useReducedMotion();
  const [on, setOn] = useState(0);
  const t = TASKS[on];
  const groups = [
    { label: "Kupac vidi direktno", from: 0 },
    { label: "Ostaje unutar firme", from: 3 },
  ];
  const nodes = [
    { k: "Odakle", v: t.from },
    { k: "Alat", v: t.how, tool: true },
    { k: "Čovek odobrava", v: t.human, human: true },
    {
      k: t.out === "kupac" ? "Stiže do kupca" : "Ostaje u firmi",
      v: t.out === "kupac" ? "Kupac vidi rezultat" : "Koristi ga vaš tim",
      end: true,
    },
  ];
  return (
    <motion.div ref={ref} className={s.tasks} {...rise}>
      <div className={s.pickGroups}>
        {groups.map((g) => (
          <div key={g.label} className={s.pickGroup}>
            <span className={s.label}>{g.label}</span>
            <div className={s.pick} role="tablist" aria-label={g.label}>
              {TASKS.slice(g.from, g.from + 3).map((x, j) => {
                const i = g.from + j;
                return (
                  <button
                    key={x.name}
                    type="button"
                    role="tab"
                    aria-selected={on === i}
                    onClick={() => setOn(i)}
                    className={s.pickBtn}
                  >
                    <em>{String(i + 1).padStart(2, "0")}</em>
                    <span>{x.short}</span>
                    {on === i
                      ? <motion.i
                          layoutId="ai-pick"
                          className={s.pickBg}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 36,
                          }}
                        />
                      : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={s.taskCard} role="tabpanel">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={on}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={s.taskInner}
          >
            <div className={s.taskHead}>
              <b>{t.name}</b>
              <div className={s.tags}>
                <span data-on={t.rules ? "" : undefined}>Pravila</span>
                <span data-on={t.ai ? "" : undefined} data-ai="">
                  AI
                </span>
              </div>
            </div>
            <div className={s.taskDoes}>{t.does}</div>

            <div className={s.flow}>
              {nodes.map((n, i) => (
                <motion.div
                  key={n.k}
                  className={s.node}
                  data-tool={n.tool ? "" : undefined}
                  data-human={n.human ? "" : undefined}
                  data-end={n.end ? "" : undefined}
                  initial={still ? false : { opacity: 0, y: 8 }}
                  animate={seen ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.45,
                    ease: EASE,
                    delay: 0.08 + i * 0.1,
                  }}
                >
                  <span className={s.nodeK}>{n.k}</span>
                  <span className={s.nodeV}>{n.v}</span>
                  {i < nodes.length - 1
                    ? <span className={s.wire} aria-hidden="true">
                        {still || !seen
                          ? null
                          : <i
                              style={{ animationDelay: `${0.5 + i * 0.9}s` }}
                            />}
                      </span>
                    : null}
                </motion.div>
              ))}
            </div>

            <div className={s.personal} data-risky={t.risky ? "" : undefined}>
              <Lock size={15} />
              <span>
                Lični podaci kupaca: <b>{t.personal}</b>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── 2. the same quote, by hand and from the price list ──────────────── */

const ITEMS = [
  { name: "Pločice 60 x 60", qty: "24 m²", price: "45.360" },
  { name: "Lepak za pločice", qty: "10 kom", price: "8.900" },
  { name: "Fug masa", qty: "4 kom", price: "2.760" },
];
const NOTE = "Poštovani, u prilogu je ponuda za stavke koje ste tražili.";

/* by hand: find, copy, for each line, then the note, then the check */
const HAND = [
  ...ITEMS.flatMap((it, i) => [
    { who: "c", text: `Traži „${it.name}“ u cenovniku`, row: i, phase: "find" },
    { who: "c", text: "Prepisuje cenu u dokument", row: i, phase: "type" },
  ]),
  { who: "c", text: "Kuca poruku kupcu", phase: "note" },
  { who: "c", text: "Proverava popust i uslove", phase: "check" },
];
/* from the price list: the tool does the lines, the model the note */
const AUTO = [
  { who: "t", text: "Alat pronađe svaku stavku u cenovniku", phase: "find" },
  { who: "t", text: "Upiše važeću cenu", phase: "type" },
  { who: "t", text: "Složi dokument u izgledu firme", phase: "doc" },
  { who: "ai", text: "Jezički model piše prateću poruku", phase: "note" },
  { who: "c", text: "Prodavac proverava popust i uslove", phase: "check" },
];
const TICK = 100;
const HAND_STEP = 11; // ticks per step by hand
const AUTO_STEP = 5; // ticks per step for the tool

function Quote() {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const still = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [run, setRun] = useState(0);
  const [ok, setOk] = useState(false);
  const end = HAND.length * HAND_STEP;

  // biome-ignore lint/correctness/useExhaustiveDependencies: run restarts on replay
  useEffect(() => {
    if (!seen) return;
    if (still) {
      setTick(end);
      return;
    }
    setTick(0);
    const id = setInterval(() => {
      setTick((v) => {
        if (v >= end) {
          clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, TICK);
    return () => clearInterval(id);
  }, [seen, still, run]);

  const replay = () => {
    setOk(false);
    setRun((r) => r + 1);
  };

  /* where each side is: index of the current step and how far into it */
  const at = (steps, per) => {
    const i = Math.min(steps.length, Math.floor(tick / per));
    const part = i >= steps.length ? 1 : (tick % per) / per;
    return { i, part };
  };
  const hand = at(HAND, HAND_STEP);
  /* the tool stops at the person: the last step waits for "Odobri" */
  const autoRaw = at(AUTO, AUTO_STEP);
  const gate = AUTO.length - 1;
  const auto =
    autoRaw.i >= gate ? { i: ok ? AUTO.length : gate, part: 0 } : autoRaw;

  const handRow = (r) => {
    const find = r * 2;
    const type = find + 1;
    if (hand.i > type) return { state: "done", shown: ITEMS[r].price };
    if (hand.i === type) {
      const p = ITEMS[r].price;
      return {
        state: "typing",
        shown: p.slice(0, Math.ceil(hand.part * p.length)),
      };
    }
    if (hand.i === find) return { state: "find", shown: "" };
    return { state: "wait", shown: "" };
  };
  const handNote = () => {
    const n = ITEMS.length * 2;
    if (hand.i > n) return NOTE;
    if (hand.i === n) return NOTE.slice(0, Math.ceil(hand.part * NOTE.length));
    return "";
  };
  const autoRow = () => {
    if (auto.i > 1) return { state: "done" };
    if (auto.i === 1) return { state: "fill" };
    if (auto.i === 0) return { state: "find" };
    return { state: "wait" };
  };
  const autoNote = () => {
    if (auto.i > 3) return NOTE;
    if (auto.i === 3)
      return NOTE.slice(0, Math.ceil(autoRaw.part * NOTE.length * 1.6));
    return "";
  };

  const sides = [
    {
      key: "hand",
      name: "Ručno",
      steps: HAND,
      cur: hand.i,
      rows: ITEMS.map((_, r) => handRow(r)),
      note: handNote(),
      doc: true,
      people: HAND.filter((x) => x.who === "c").length,
    },
    {
      key: "auto",
      name: "Iz cenovnika",
      steps: AUTO,
      cur: auto.i,
      rows: ITEMS.map((it) => {
        const st = autoRow().state;
        return {
          state: st,
          shown: st === "done" || st === "fill" ? it.price : "",
        };
      }),
      note: autoNote(),
      doc: auto.i > 2,
      people: AUTO.filter((x) => x.who === "c").length,
    },
  ];

  return (
    <motion.div ref={ref} className={s.quote} {...rise}>
      <div className={s.quoteTop}>
        <span className={s.label}>Ista ponuda, dva puta</span>
        <span className={s.label}>Primer, pojednostavljeno</span>
      </div>
      <div className={s.lanes}>
        {sides.map((side) => {
          const doneAll = side.cur >= side.steps.length;
          const step = side.steps[Math.min(side.cur, side.steps.length - 1)];
          const atGate = side.key === "auto" && side.cur === gate && !ok;
          return (
            <div
              key={side.key}
              className={s.lane}
              data-auto={side.key === "auto" ? "" : undefined}
            >
              <div className={s.laneHead}>
                <b>{side.name}</b>
                <span className={s.count}>
                  <em>{side.people}</em>{" "}
                  {side.people === 1 ? "ručni korak" : "ručnih koraka"}
                </span>
              </div>

              <div className={s.doc} data-ready={side.doc ? "" : undefined}>
                <div className={s.docHead}>
                  <span>Ponuda</span>
                  <span>Vaša firma</span>
                </div>
                {ITEMS.map((it, r) => {
                  const row = side.rows[r];
                  return (
                    <div key={it.name} className={s.row} data-state={row.state}>
                      <span className={s.rowName}>
                        {it.name}
                        <small>{it.qty}</small>
                      </span>
                      <span className={s.price}>
                        <span className={s.num}>
                          {row.shown
                            ? <>
                                {row.shown}
                                <small> din</small>
                              </>
                            : null}
                          {row.state === "typing"
                            ? <i className={s.caret} />
                            : null}
                        </span>
                        <em className={s.src}>
                          {side.key === "auto" && row.state === "done"
                            ? "iz cenovnika"
                            : "\u00a0"}
                        </em>
                      </span>
                    </div>
                  );
                })}
                <div className={s.note} data-on={side.note ? "" : undefined}>
                  <span className={s.noteK}>
                    Poruka kupcu
                    {side.key === "auto" ? <em>AI</em> : null}
                  </span>
                  <span className={s.noteV}>{side.note || " "}</span>
                </div>
              </div>

              <div className={s.pips} aria-hidden="true">
                {side.steps.map((x, i) => (
                  <i
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed steps
                    key={i}
                    data-who={x.who}
                    data-done={i < side.cur ? "" : undefined}
                    data-now={i === side.cur ? "" : undefined}
                  />
                ))}
              </div>

              <div className={s.status} aria-live="polite">
                {doneAll
                  ? <span className={s.ready}>
                      <Check size={14} strokeWidth={3} /> Spremno za slanje
                    </span>
                  : atGate
                    ? <button
                        type="button"
                        className={s.approve}
                        onClick={() => setOk(true)}
                      >
                        Odobri<span className={s.long}> popust i uslove</span>{" "}
                        <ArrowRight size={15} />
                      </button>
                    : seen
                      ? <span className={s.now} data-who={step.who}>
                          {step.text}
                        </span>
                      : <span className={s.now}>&nbsp;</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className={s.quoteFoot}>
        <div className={s.legend} aria-hidden="true">
          <span>
            <i data-who="c" /> Čovek
          </span>
          <span>
            <i data-who="t" /> Alat po pravilu
          </span>
          <span>
            <i data-who="ai" /> Jezički model
          </span>
        </div>
        <button type="button" className={s.replay} onClick={replay}>
          <Rotate size={14} /> Ponovo
        </button>
      </div>
      <div className={s.quoteRule}>
        Cenu u ponudu upisuje cenovnik, a jezički model piše samo prateću poruku
        kupcu.
      </div>
    </motion.div>
  );
}

/* ── 3. what may go into the free ChatGPT ────────────────────────────── */

const DATA = [
  {
    item: "Ime i telefon iz žalbe kupca",
    yes: false,
    why: "Po članu 4 zakona, podatak o ličnosti je svaki podatak o licu čiji je identitet određen ili odrediv.",
  },
  {
    item: "Tekst žalbe, bez imena i telefona",
    yes: true,
    why: "Član 5 traži da obrada bude ograničena na ono što je neophodno, a za ljubazan odgovor ime i telefon nisu potrebni.",
  },
  {
    item: "E-adresa kupca",
    yes: false,
    why: "Ime, telefon, e-adresa i sve drugo po čemu se kupac može prepoznati su podaci o ličnosti.",
  },
  {
    item: "Nacrt opisa proizvoda",
    yes: true,
    why: "Za tekst bez podataka o kupcima, kao što su nacrt opisa proizvoda ili prateće poruke, besplatni nalog je dovoljan.",
  },
  {
    item: "Ponuda sa imenom i telefonom kupca",
    yes: false,
    why: "Ime i telefon kupca u ponudi su podaci o ličnosti, pa ni ponuda ne ide u besplatni ChatGPT.",
  },
  {
    item: "Prateća poruka uz ponudu, bez podataka kupca",
    yes: true,
    why: "Za tekst bez podataka o kupcima, kao što su nacrt opisa proizvoda ili prateće poruke, besplatni nalog je dovoljan.",
  },
  {
    item: "Adresa i JMBG kupca",
    yes: false,
    why: "Pre nego što tekst kupca nalepite u AI alat, obrišite ime, telefon, e-adresu, adresu i JMBG.",
  },
  {
    item: "Snimak poziva sa kupcem",
    yes: false,
    why: "Snimak sadrži glas i ime kupca uz sve što je rekao, a sve to su po članu 4 podaci o ličnosti.",
  },
];

function Sorter() {
  const [i, setI] = useState(0);
  const [picks, setPicks] = useState([]);
  const cur = DATA[i];
  const pick = picks[i];
  const answered = pick !== undefined;
  const over = i >= DATA.length;
  const right = picks.filter((p, j) => p === DATA[j].yes).length;

  const choose = (v) => {
    if (answered) return;
    setPicks((p) => {
      const n = [...p];
      n[i] = v;
      return n;
    });
  };
  const restart = () => {
    setI(0);
    setPicks([]);
  };

  const bin = (yes) =>
    DATA.map((d, j) => ({ ...d, j })).filter(
      (d, j) => picks[j] !== undefined && d.yes === yes,
    );

  return (
    <motion.div className={s.sorter} {...rise}>
      <div className={s.sorterTop}>
        <span className={s.label}>Šta sme u besplatni ChatGPT</span>
        <em className={s.counter}>
          {over
            ? `${right} / ${DATA.length} tačno`
            : `${i + 1} / ${DATA.length}`}
        </em>
      </div>

      <div className={s.stage}>
        <AnimatePresence mode="wait" initial={false}>
          {over
            ? <motion.div
                key="over"
                className={s.final}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <b className={s.finalNum}>
                  {right}
                  <small>/ {DATA.length}</small>
                </b>
                <div className={s.finalText}>
                  <span>
                    Za posao sa podacima kupaca koristite <b>poslovni nalog</b>{" "}
                    sa potpisanim DPA.
                  </span>
                  <span>Zapišite koji alat dobija koje podatke i zašto.</span>
                  <span>Na ličnom nalogu ne ocenjujte odgovore palcem.</span>
                </div>
                <button type="button" className={s.replay} onClick={restart}>
                  <Rotate size={14} /> Ispočetka
                </button>
              </motion.div>
            : <motion.div
                key={i}
                className={s.card}
                data-verdict={
                  answered ? (pick === cur.yes ? "right" : "wrong") : undefined
                }
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  opacity: 0,
                  x: pick ? -40 : 40,
                  transition: { duration: 0.25 },
                }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className={s.cardK}>Primer</span>
                <b className={s.cardItem}>{cur.item}</b>
                {answered
                  ? <motion.div
                      className={s.why}
                      data-yes={cur.yes ? "" : undefined}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <span className={s.whyHead}>
                        <i aria-hidden="true">
                          {cur.yes
                            ? <Check size={12} strokeWidth={3} />
                            : <X size={11} strokeWidth={3} />}
                        </i>
                        {pick === cur.yes ? "Tačno" : "Ne baš"}:{" "}
                        {cur.yes ? "sme u alat" : "ne unosite"}
                      </span>
                      <span>{cur.why}</span>
                    </motion.div>
                  : null}
                <div className={s.choices}>
                  {answered
                    ? <button
                        type="button"
                        className={s.next}
                        onClick={() => setI((v) => v + 1)}
                      >
                        {i === DATA.length - 1 ? "Rezultat" : "Sledeće"}{" "}
                        <ArrowRight size={15} />
                      </button>
                    : <>
                        <button
                          type="button"
                          className={s.choice}
                          data-kind="yes"
                          onClick={() => choose(true)}
                        >
                          <Check size={14} strokeWidth={3} /> Sme u alat
                        </button>
                        <button
                          type="button"
                          className={s.choice}
                          data-kind="no"
                          onClick={() => choose(false)}
                        >
                          <X size={13} strokeWidth={3} /> Ne unosite
                        </button>
                      </>}
                </div>
              </motion.div>}
        </AnimatePresence>
      </div>

      <div className={s.bins}>
        {[true, false].map((yes) => (
          <div
            key={String(yes)}
            className={s.bin}
            data-yes={yes ? "" : undefined}
          >
            <span className={s.binHead}>
              {yes ? "Sme u alat" : "Ne unosite"} <em>{bin(yes).length}</em>
            </span>
            <div className={s.chips}>
              <AnimatePresence>
                {bin(yes).map((d) => (
                  <motion.span
                    key={d.j}
                    className={s.chip}
                    data-miss={picks[d.j] !== d.yes ? "" : undefined}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  >
                    <i aria-hidden="true">
                      {picks[d.j] === d.yes
                        ? <Check size={11} strokeWidth={3} />
                        : <X size={10} strokeWidth={3} />}
                    </i>
                    {d.item}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export const PIECES = {
  "ai-poslovi": Tasks,
  "ai-ponuda": Quote,
  "ai-podaci": Sorter,
};
