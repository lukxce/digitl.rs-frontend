"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { EASE, Roll } from "../v5/ui";
import k from "./cost.module.css";

/* Pure arithmetic on the visitor's own numbers. A 20% lower cost per enquiry
   means the same budget buys 25% more enquiries (1 / 0.8). */

function Slider({ label, value, min, max, step, onChange, format }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className={k.slider}>
      <span className={k.sHead}>
        <span>{label}</span>
        <b>{format(value)}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--p": `${p}%` }}
      />
    </label>
  );
}

const eur = (n) => `${n.toLocaleString("sr-RS")} €`;

export default function Cost() {
  const [budget, setBudget] = useState(1500);
  const [leads, setLeads] = useState(30);
  const per = budget / Math.max(1, leads);
  const better = Math.round(leads / 0.8);
  const extra = better - leads;
  const dots = Math.min(better, 60);

  return (
    <div className={k.wrap}>
      <div className={k.inputs}>
        <Slider
          label="Mesečni budžet za marketing"
          value={budget}
          min={100}
          max={10000}
          step={100}
          onChange={setBudget}
          format={eur}
        />
        <Slider
          label="Upita mesečno (pozivi, poruke, forme)"
          value={leads}
          min={1}
          max={200}
          step={1}
          onChange={setLeads}
          format={(n) => n}
        />
        <p className={k.note}>Unesite svoje brojeve. Ništa se ne šalje.</p>
      </div>

      <div className={k.out}>
        <span className={k.label}>Jedan upit vas košta</span>
        <span className={k.big}>
          <Roll value={per} decimals={per < 100 ? 1 : 0} ms={500} suffix=" €" />
        </span>
        <div className={k.dots} aria-hidden="true">
          {Array.from({ length: dots }, (_, i) => (
            <motion.i
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.01, duration: 0.3, ease: EASE }}
              data-new={i >= Math.min(leads, 60) ? "true" : undefined}
            />
          ))}
        </div>
        <p className={k.line}>
          Ako cenu po upitu spustimo za 20%, isti budžet donosi <b>{better}</b>{" "}
          upita mesečno, odnosno <b>+{extra}</b>.
          {better > 60 ? " (Prikazano do 60 tačaka.)" : ""}
        </p>
        <span className={k.legend}>
          <i /> sadašnji upiti <i data-new="true" /> dodatni upiti
        </span>
      </div>
    </div>
  );
}
