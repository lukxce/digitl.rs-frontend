"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import {
  Check,
  FileText,
  Globe,
  Layers,
  Megaphone,
  Pin,
  Quote,
  Tag,
} from "./icons";
import s from "./position.module.css";
import { EASE, Reveal, Roll, SectionHead, Segmented, useVisible } from "./ui";

const JOBS = [
  {
    icon: Globe,
    area: "Sajt",
    pain: "Napravljen pre pet godina, na telefonu se sporo otvara",
    done: "Brz na telefonu, napravljen da prodaje",
  },
  {
    icon: Layers,
    area: "Usluge",
    pain: "Sve nabacano na jednu stranicu „usluge“",
    done: "Svaka usluga ima svoju stranicu i svoju pretragu",
  },
  {
    icon: Tag,
    area: "Cena",
    pain: "Klijent mora da pozove da bi je saznao",
    done: "Vidljiva pre poziva, na svakoj stranici usluge",
  },
  {
    icon: Pin,
    area: "Google profil",
    pain: "Nepopunjen, bez slika i radnog vremena",
    done: "Sređen profil i isti podaci na svakom mestu",
  },
  {
    icon: Megaphone,
    area: "Oglasi",
    pain: "Pojačana objava kad se neko seti",
    done: "Google i Meta kampanje sa praćenjem upita",
  },
  {
    icon: FileText,
    area: "Izveštaj",
    pain: "Ne znate odakle je došao poziv",
    done: "Jednom mesečno: pozivi, upiti i odakle su došli",
  },
];

// Backlinko's analysis of 4 million Google results: #1 averages 27.6% CTR, #3 11%,
// #1 is 10× more likely to be clicked than #10, and 0.63% click anything on page 2.
const POSITIONS = [
  {
    key: "1",
    label: "1. mesto",
    value: 27.6,
    dec: 1,
    text: "pretraga završi klikom na prvi rezultat",
  },
  {
    key: "3",
    label: "3. mesto",
    value: 11,
    dec: 1,
    text: "klikne na treći rezultat",
  },
  {
    key: "10",
    label: "10. mesto",
    value: 2.8,
    dec: 1,
    approx: true,
    text: "na deseti, deset puta manje nego na prvi",
  },
  {
    key: "p2",
    label: "2. strana",
    value: 0.63,
    dec: 2,
    text: "klikne bilo šta na drugoj strani Google-a",
  },
];

function WithWithout() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.45);
  const [mode, setMode] = useState("bez");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!visible || touched) return;
    const t = setTimeout(
      () => setMode((m) => (m === "bez" ? "sa" : "bez")),
      mode === "bez" ? 4200 : 5200,
    );
    return () => clearTimeout(t);
  }, [visible, touched, mode]);

  const sa = mode === "sa";

  return (
    <div
      ref={ref}
      className={`${s.todo} ${sa ? s.todoSa : ""}`}
      data-theme={sa ? "dark" : "light"}
    >
      <motion.span
        className={s.todoBg}
        aria-hidden="true"
        initial={false}
        animate={{ opacity: sa ? 1 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      <div className={s.todoTop}>
        <Segmented
          id="withwithout"
          tone={sa ? "dark" : "light"}
          label="Poređenje"
          options={[
            { key: "bez", label: "Bez sistema" },
            { key: "sa", label: "Sa Digitl-om" },
          ]}
          value={mode}
          onChange={(k) => {
            setTouched(true);
            setMode(k);
          }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={mode}
            className={s.todoWho}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {sa
              ? "Ko ovo radi: mi. Vi odobravate."
              : "Ko ovo radi: vi, kad stignete."}
          </motion.span>
        </AnimatePresence>
      </div>
      <ul className={s.jobs}>
        {JOBS.map((j, i) => {
          const Icon = j.icon;
          return (
            <li key={j.area} className={s.job}>
              <span className={s.jobIcon}>
                <Icon size={16} />
              </span>
              <b>{j.area}</b>
              <span className={s.jobState}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mode}
                    className={sa ? s.done : s.pain}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.35, ease: EASE, delay: i * 0.04 }}
                  >
                    {sa ? <Check size={13} strokeWidth={3} /> : <i />}
                    {sa ? j.done : j.pain}
                  </motion.span>
                </AnimatePresence>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Dots() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.4);
  const [k, setK] = useState("1");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!visible || touched) return;
    const t = setTimeout(() => {
      const i = POSITIONS.findIndex((p) => p.key === k);
      setK(POSITIONS[(i + 1) % POSITIONS.length].key);
    }, 3200);
    return () => clearTimeout(t);
  }, [visible, touched, k]);

  const cur = POSITIONS.find((p) => p.key === k);
  const lit = visible ? cur.value : 0;

  return (
    <div ref={ref} className={s.lime}>
      <div className={s.limeHead}>
        <span className={s.big}>
          {cur.approx ? "≈" : ""}
          <Roll
            value={visible ? cur.value : 0}
            decimals={cur.dec}
            run
            ms={900}
          />
          <small>%</small>
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={k}
            className={s.bigLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {cur.text}
          </motion.span>
        </AnimatePresence>
      </div>

      <div
        className={s.dots}
        role="img"
        aria-label={`${cur.value} od 100 pretraga, ${cur.label}`}
      >
        {Array.from({ length: 100 }, (_, i) => {
          const row = Math.floor(i / 10);
          const col = i % 10;
          const on = i < Math.floor(lit);
          const part = !on && i === Math.floor(lit) ? lit % 1 : 0;
          return (
            <i
              key={i}
              data-on={on ? "true" : part > 0.05 ? "part" : undefined}
              style={{
                transitionDelay: `${(col + row) * 14}ms`,
                "--part": part,
              }}
            />
          );
        })}
      </div>

      <Segmented
        id="position"
        tone="lime"
        label="Pozicija na Google-u"
        options={POSITIONS.map((p) => ({ key: p.key, label: p.label }))}
        value={k}
        onChange={(v) => {
          setTouched(true);
          setK(v);
        }}
      />
      <p className={s.limeSource}>
        Od 100 pretraga. Prosečan procenat klikova po poziciji, Backlinko,
        analiza 4 miliona Google rezultata.
      </p>
    </div>
  );
}

export default function Position({ clients }) {
  const elektro = clients.find((c) => /elektro/i.test(c.name));
  return (
    <section className={`${b.section} ${s.section}`} data-theme="light">
      <div className={b.container}>
        <SectionHead
          id="pozicija"
          kicker="Zašto pozicija odlučuje"
          title="Prvo mesto dobija deset puta više klikova od desetog"
          intro="Kupci ne listaju. Kliknu na prvih par rezultata i tamo kupuju, zovu ili ostavljaju upit. Zato radimo na poziciji i na sajtu koji ih dočeka, a ne na broju objava."
        />
        <div className={s.grid}>
          <WithWithout />
          <Dots />
        </div>

        <Reveal className={s.quote} as="figure">
          <Quote size={34} className={s.quoteMark} />
          <blockquote>
            Do trećeg meseca sajt je postao njihov najveći izvor novih
            klijenata, ispred preporuka koje su decenijama bile jedini kanal
            rasta.
          </blockquote>
          <figcaption>
            {elektro?.logo
              ? <span className={s.quoteLogo}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={elektro.logo} alt="" />
                </span>
              : null}
            <span>
              <b>ElektroMil, Niš</b>
              <a href={elektro?.href ?? "/projects"}>Iz studije slučaja</a>
            </span>
          </figcaption>
        </Reveal>
      </div>
    </section>
  );
}
