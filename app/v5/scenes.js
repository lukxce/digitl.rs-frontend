"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Check, Megaphone, Phone, Pin, Sparkle, Trend } from "./icons";
import c from "./scenes.module.css";
import { EASE, Roll, useSteps } from "./ui";

const rise = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE },
};

/* ── 1. Upitnik ───────────────────────────────────────────────────────── */
const GOAL = "Duplo više porudžbina do sezone, uz istu cenu po kupcu.";

function Field({ label, on, wide = false, children }) {
  return (
    <div className={`${c.field} ${wide ? c.wide : ""}`}>
      <span className={c.fieldLabel}>
        {label} <Sparkle size={10} className={on ? c.sparkOn : c.sparkOff} />
      </span>
      {children}
    </div>
  );
}

function Box({ v }) {
  return (
    <span className={c.box}>
      {v
        ? <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {v}
          </motion.span>
        : <i className={c.skel} />}
    </span>
  );
}

function Chips({ opts, on }) {
  return (
    <span className={c.chips}>
      {opts.map((o) => (
        <span key={o} className={on.includes(o) ? c.chipOn : c.chip}>
          {on.includes(o) ? <Check size={11} strokeWidth={3} /> : null}
          {o}
        </span>
      ))}
    </span>
  );
}

export function BriefScene({ active }) {
  const k = useSteps(active, 5, 520, 300);
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    if (!active || k < 5) {
      setTyped(0);
      return;
    }
    const id = setInterval(
      () => setTyped((t) => (t >= GOAL.length ? t : t + 2)),
      30,
    );
    return () => clearInterval(id);
  }, [active, k]);

  return (
    <div className={c.scene}>
      <div className={c.sceneHead}>
        <h4>Upitnik</h4>
        <span>Oko 10 minuta, svojim rečima</span>
      </div>
      <div className={c.form}>
        <Field label="Delatnost" on={k >= 1}>
          <Box v={k >= 1 ? "Online prodavnica, kozmetika" : ""} />
        </Field>
        <Field label="Tržište" on={k >= 1}>
          <Box v={k >= 1 ? "Srbija i region" : ""} />
        </Field>
        <Field label="Kategorije koje guramo" on={k >= 2} wide>
          <Chips
            opts={["Nega lica", "Kosa", "Poklon setovi", "Muška nega"]}
            on={k >= 2 ? ["Nega lica", "Kosa", "Poklon setovi"] : []}
          />
        </Field>
        <Field label="Odakle danas dolaze kupci" on={k >= 3} wide>
          <Chips
            opts={["Instagram", "Preporuke", "Google", "Oglasi"]}
            on={k >= 3 ? ["Instagram", "Preporuke"] : []}
          />
        </Field>
        <Field label="Šta bi bilo uspeh za šest meseci" on={k >= 5} wide>
          <span className={`${c.area} ${k >= 5 ? c.areaOn : ""}`}>
            {k >= 5 ? GOAL.slice(0, typed) : ""}
            {k >= 5 && typed < GOAL.length ? <i className={c.caret} /> : null}
          </span>
        </Field>
      </div>
      <div className={c.sceneFoot}>
        <span>
          <Sparkle size={11} /> Popunjeno iz vaših reči. Svaki red možete da
          promenite.
        </span>
        <span className={c.fakeBtn}>Pošalji</span>
      </div>
    </div>
  );
}

/* ── 2. Plan pretrage ─────────────────────────────────────────────────── */
const PLAN = [
  { q: "prirodna kozmetika", intent: "Kupovna", page: "/" },
  { q: "serum za lice cena", intent: "Kupovna", page: "/nega-lica/serumi" },
  { q: "poklon set za nju", intent: "Sezonska", page: "/poklon-setovi" },
  { q: "šampon bez sulfata", intent: "Kupovna", page: "/kosa/samponi" },
  {
    q: "kako izabrati serum",
    intent: "Informativna",
    page: "/blog/vodic-serumi",
  },
];

export function PlanScene({ active }) {
  const k = useSteps(active, PLAN.length, 600, 400);
  return (
    <div className={c.scene}>
      <div className={c.sceneHead}>
        <h4>Plan pretrage</h4>
        <span>Kako vas ljudi traže, i gde to vodi</span>
      </div>
      <div className={c.planGrid}>
        <div className={c.table}>
          <div className={c.tableHead}>
            <span>Pretraga</span>
            <span>Namera</span>
            <span>Stranica</span>
          </div>
          {PLAN.map((p, i) => (
            <div key={p.q} className={`${c.tableRow} ${i < k ? c.rowOn : ""}`}>
              <span className={c.query}>{p.q}</span>
              <span className={c.intent} data-intent={p.intent}>
                {p.intent}
              </span>
              <span className={c.page}>{p.page}</span>
            </div>
          ))}
        </div>
        <div className={c.tree}>
          <span className={c.treeRoot}>vasaprodavnica.rs</span>
          {PLAN.slice(1).map((p, i) => (
            <span
              key={p.page}
              className={`${c.treeLeaf} ${i + 1 < k ? c.leafOn : ""}`}
            >
              {p.page}
            </span>
          ))}
        </div>
      </div>
      <div className={c.sceneFoot}>
        <span>
          <Sparkle size={11} /> Svaka pretraga dobija svoju stranicu, ne guraju
          se sve na jednu.
        </span>
      </div>
    </div>
  );
}

/* ── 3. Lansiranje ────────────────────────────────────────────────────── */
const LAUNCH = [
  { t: "Stranice kategorija", s: "napisane i odobrene", icon: Check },
  { t: "Google Merchant i Shopping", s: "ceo katalog, sa cenama", icon: Pin },
  {
    t: "Praćenje porudžbina i prihoda",
    s: "svaka prodaja vezana za kanal",
    icon: Phone,
  },
  { t: "Kampanja: Performance Max", s: "Google, Srbija", icon: Megaphone },
];
const RINGS = [
  ["Brzina", 100],
  ["SEO", 100],
  ["Pristupačnost", 100],
  ["Dobre prakse", 100],
];

function MiniRing({ label, value, on }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  return (
    <span className={c.miniRing}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={r} className={c.miniTrack} />
        <motion.circle
          cx="22"
          cy="22"
          r={r}
          className={c.miniBar}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: on ? circ * (1 - value / 100) : circ }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </svg>
      <b>{on ? <Roll value={value} run ms={1100} /> : "–"}</b>
      <em>{label}</em>
    </span>
  );
}

export function LaunchScene({ active }) {
  const k = useSteps(active, LAUNCH.length + 2, 650, 400);
  const ringsOn = k > LAUNCH.length;
  const live = k > LAUNCH.length + 1;
  return (
    <div className={c.scene}>
      <div className={c.sceneHead}>
        <h4>Lansiranje</h4>
        <span>Sve kreće istog dana</span>
      </div>
      <ul className={c.checklist}>
        {LAUNCH.map((x, i) => {
          const Icon = x.icon;
          const done = i < k;
          return (
            <li key={x.t} className={done ? c.checkDone : ""}>
              <span className={c.checkIcon}>
                <Icon size={14} />
              </span>
              <span className={c.checkText}>
                <b>{x.t}</b>
                <span>{x.s}</span>
              </span>
              <span className={c.checkState}>
                {done
                  ? <>
                      <Check size={12} strokeWidth={3} /> Gotovo
                    </>
                  : <i className={c.wait} />}
              </span>
            </li>
          );
        })}
      </ul>
      <div className={c.rings}>
        <span className={c.ringsLabel}>Provera na telefonu, pre objave</span>
        <div className={c.ringRow}>
          {RINGS.map(([l, v]) => (
            <MiniRing key={l} label={l} value={v} on={ringsOn} />
          ))}
        </div>
      </div>
      {live
        ? <motion.div className={c.toast} {...rise}>
            <span>
              <Check size={14} strokeWidth={3} />
            </span>
            Kampanje su uživo. Prihod se meri od danas.
          </motion.div>
        : null}
    </div>
  );
}

/* ── 4. Izveštaj ──────────────────────────────────────────────────────── */
const SOURCES = [
  { key: "site", label: "Pretraga (SEO)" },
  { key: "ref", label: "Instagram" },
  { key: "ads", label: "Oglasi" },
];
const MONTHS = [
  { m: "1. mesec", site: 6, ref: 12, ads: 8 },
  { m: "2. mesec", site: 10, ref: 12, ads: 14 },
  { m: "3. mesec", site: 16, ref: 12, ads: 18 },
];

export function ReportScene({ active }) {
  const k = useSteps(active, 4, 450, 300);
  const max = 46;
  return (
    <div className={c.scene}>
      <div className={c.sceneHead}>
        <h4>Izveštaj, 3. mesec</h4>
        <span>Jedna strana, dva minuta čitanja</span>
      </div>
      <div className={c.kpis}>
        {[
          ["Porudžbine", 412, "+31% u odnosu na 2. mesec", 0],
          ["Povrat na oglase", 4.2, "ROAS, svaki dinar u oglasima", 1],
          ["Prosečna pozicija", 3.8, "za 20 ključnih pretraga", 1],
        ].map(([l, v, sub, d]) => (
          <div key={l} className={c.kpi}>
            <span>{l}</span>
            <b>
              {k >= 1 ? <Roll value={v} decimals={d} run ms={1000} /> : "–"}
            </b>
            <em>{sub}</em>
          </div>
        ))}
      </div>
      <div className={c.bars}>
        <div className={c.barCols}>
          {MONTHS.map((mo, i) => (
            <div key={mo.m} className={c.barCol}>
              <span className={c.stack}>
                {SOURCES.map((s) => (
                  <motion.i
                    key={s.key}
                    data-s={s.key}
                    initial={{ height: 0 }}
                    animate={{
                      height: k >= 2 ? `${(mo[s.key] / max) * 100}%` : 0,
                    }}
                    transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
                  />
                ))}
              </span>
              <em>{mo.m}</em>
            </div>
          ))}
        </div>
        <div className={c.legend}>
          {SOURCES.map((s) => (
            <span key={s.key}>
              <i data-s={s.key} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
      {k >= 3
        ? <motion.div className={c.next} {...rise}>
            <Trend size={15} />
            <span>
              <b>Sledeći korak:</b> poklon setovi pred praznike. Posebna
              stranica i kampanja od novembra, kad pretraga počne da raste.
            </span>
          </motion.div>
        : null}
    </div>
  );
}

export const SCENES = [BriefScene, PlanScene, LaunchScene, ReportScene];
