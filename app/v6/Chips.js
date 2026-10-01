"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE, Roll } from "../v5/ui";
import h from "./chips.module.css";

const AREAS = [
  { id: "ads", name: "Plaćeno oglašavanje", color: "#2a29ff" },
  { id: "seo", name: "SEO", color: "#0b0b16" },
  { id: "web", name: "Web", color: "#9ef34a" },
  { id: "social", name: "Društvene mreže", color: "#ff8078" },
  { id: "brand", name: "Brend", color: "#b5b4ff" },
];
const STEP = 5;

function verdict(v) {
  if (v.ads >= 60)
    return [
      "Brzo, ali na kredit.",
      "Oglasi donose ljude od prvog dana, ali onog dana kad stanete, stanu i upiti. Bez SEO-a nema ničega što ostaje.",
    ];
  if (v.web <= 5)
    return [
      "Svaki kanal će curiti.",
      "Bez sajta koji pretvara posetu u upit, plaćate za ljude koji odu. Sajt je kofa u koju se sve sipa.",
    ];
  if (v.seo >= 50)
    return [
      "Sporo, ali trajno.",
      "SEO gradi saobraćaj koji ne plaćate, ali prvi rezultati traju. Malo oglasa na početku kupuje vreme dok SEO ne proradi.",
    ];
  if (v.social >= 45)
    return [
      "Poznati, ali neprodati.",
      "Mreže vas čine poznatim. Kupac koji je spreman da kupi ipak prvo pretražuje, i tu vas mora naći.",
    ];
  if (v.brand >= 45)
    return [
      "Lep temelj bez kuće.",
      "Brend čini da sve ostalo košta manje, ali sam ne dovodi nikoga. Treba mu kanal koji ga nosi.",
    ];
  const spread = Object.values(v).filter((x) => x >= 10).length;
  if (spread >= 4)
    return [
      "Ovo liči na sistem.",
      "Novac ide u više kanala koji se međusobno hrane. Ovako i mi najčešće počinjemo, pa pomeramo ka onome što donosi najviše.",
    ];
  return [
    "Zanimljiv izbor.",
    "Raspodela ima jasan fokus. Na prvom razgovoru proverimo da li se slaže sa onim odakle vam danas dolaze kupci.",
  ];
}

/** A donut drawn from the allocation; each arc animates to its new size. */
function Donut({ v }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox="0 0 180 180" className={h.donut} aria-hidden="true">
      <circle cx="90" cy="90" r={r} className={h.track} />
      {AREAS.map((a) => {
        const len = (v[a.id] / 100) * circ;
        const off = acc;
        acc += len;
        return (
          <motion.circle
            key={a.id}
            cx="90"
            cy="90"
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth="22"
            initial={false}
            animate={{
              strokeDasharray: `${Math.max(0, len - 2)} ${circ}`,
              strokeDashoffset: -off,
            }}
            transition={{ duration: 0.6, ease: EASE }}
            transform="rotate(-90 90 90)"
          />
        );
      })}
    </svg>
  );
}

export default function Chips() {
  const [v, setV] = useState({
    ads: 40,
    seo: 20,
    web: 20,
    social: 10,
    brand: 10,
  });

  const change = (id, d) => {
    setV((cur) => {
      const next = { ...cur };
      if (d > 0) {
        // Take the chips from whichever other area has the most.
        const donor = Object.keys(next)
          .filter((k) => k !== id && next[k] >= STEP)
          .sort((a, z) => next[z] - next[a])[0];
        if (!donor) return cur;
        next[donor] -= STEP;
        next[id] += STEP;
      } else {
        if (next[id] < STEP) return cur;
        const taker = Object.keys(next)
          .filter((k) => k !== id)
          .sort((a, z) => next[a] - next[z])[0];
        next[id] -= STEP;
        next[taker] += STEP;
      }
      return next;
    });
  };

  const [title, text] = verdict(v);
  const brief = AREAS.map((a) => `${a.name}: ${v[a.id]}%`).join("\n");
  const mail = `mailto:hello@digitl.rs?subject=${encodeURIComponent("Brief: raspodela 100 žetona")}&body=${encodeURIComponent(`Ovako bih podelio budžet:\n\n${brief}\n\n`)}`;

  return (
    <div className={h.wrap}>
      <div className={h.controls}>
        {AREAS.map((a) => (
          <div key={a.id} className={h.row}>
            <span className={h.name}>
              <i style={{ background: a.color }} />
              {a.name}
            </span>
            <span className={h.track2}>
              <motion.i
                initial={false}
                animate={{ width: `${v[a.id]}%` }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ background: a.color }}
              />
            </span>
            <span className={h.step}>
              <button
                type="button"
                onClick={() => change(a.id, -1)}
                aria-label={`Manje za ${a.name}`}
                disabled={v[a.id] < STEP}
              >
                −
              </button>
              <b>
                <Roll value={v[a.id]} ms={400} />
              </b>
              <button
                type="button"
                onClick={() => change(a.id, 1)}
                aria-label={`Više za ${a.name}`}
              >
                +
              </button>
            </span>
          </div>
        ))}
        <p className={h.hint}>
          Svaki klik pomera 5 žetona. Ukupno je uvek 100.
        </p>
      </div>

      <div className={h.out}>
        <div className={h.chart}>
          <Donut v={v} />
          <span className={h.center}>
            <b>100</b>
            <em>žetona</em>
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            className={h.verdict}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <b>{title}</b>
            <p>{text}</p>
          </motion.div>
        </AnimatePresence>
        <a className={h.send} href={mail}>
          Pošaljite kao brief
        </a>
      </div>
    </div>
  );
}
