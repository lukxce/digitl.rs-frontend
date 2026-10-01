"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EASE } from "../v5/ui";
import n from "./bingo.module.css";

const PHRASES = [
  "Bićete prvi na Google-u",
  "Ovo će biti viralno",
  "Treba nam veći budžet",
  "Algoritam se promenio",
  "Radimo 360°",
  "Gradimo awareness",
  "Rezultati za 6 meseci",
  "Konkurencija ulaže više",
  "Treba vam rebrend",
];
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function Bingo() {
  const [hit, setHit] = useState([]);
  const line = LINES.find((l) => l.every((i) => hit.includes(i)));
  const toggle = (i) =>
    setHit((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]));

  return (
    <div className={n.wrap}>
      <div className={n.board}>
        <div className={n.grid}>
          {PHRASES.map((p, i) => {
            const on = hit.includes(i);
            const inLine = line?.includes(i);
            return (
              <button
                key={p}
                type="button"
                className={n.cell}
                data-on={on ? "true" : undefined}
                data-line={inLine ? "true" : undefined}
                onClick={() => toggle(i)}
                aria-pressed={on}
              >
                <span>{p}</span>
                <AnimatePresence>
                  {on
                    ? <motion.i
                        className={n.mark}
                        initial={{ scale: 1.8, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: -8 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      />
                    : null}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        <AnimatePresence>
          {line
            ? <motion.div
                className={n.stamp}
                initial={{ scale: 2.6, opacity: 0, rotate: 10 }}
                animate={{ scale: 1, opacity: 1, rotate: -9 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 420, damping: 16 }}
              >
                BINGO
              </motion.div>
            : null}
        </AnimatePresence>
      </div>
      <div className={n.side}>
        <span className={n.label}>Jeste li ovo čuli?</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={line ? "won" : "play"}
            className={n.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {line
              ? "Bingo. Znamo kako zvuči. Zato ovo od nas nećete čuti."
              : "Kliknite sve što vam je neka agencija već obećala. Skupite red."}
          </motion.p>
        </AnimatePresence>
        <span className={n.count}>{hit.length} od 9</span>
        {hit.length
          ? <button
              type="button"
              className={n.reset}
              onClick={() => setHit([])}
            >
              Ispočetka
            </button>
          : null}
      </div>
    </div>
  );
}
