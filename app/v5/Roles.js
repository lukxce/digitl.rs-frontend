"use client";

import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import {
  Check,
  FileText,
  Globe,
  Megaphone,
  Message,
  Pen,
  Search,
  Sparkle,
} from "./icons";
import s from "./roles.module.css";
import { Reveal, SectionHead, useVisible } from "./ui";

const WE = [
  {
    t: "Tekstovi za sajt i oglase",
    log: "Pišemo ih mi, vi samo potvrdite",
    icon: Pen,
  },
  {
    t: "Sajt, hosting i brzina",
    log: "Izmene, ažuriranja, provera na telefonu",
    icon: Globe,
  },
  {
    t: "Google i Meta kampanje",
    log: "Postavka, testovi, budžet pod kontrolom",
    icon: Megaphone,
  },
  {
    t: "SEO i Google profil",
    log: "Nove stranice, interno povezivanje, pozicije",
    icon: Search,
  },
  {
    t: "Mesečni izveštaj",
    log: "Pozivi, upiti i odakle su došli",
    icon: FileText,
  },
];

const YOU = [
  { t: "Koje usluge guramo", when: "na početku saradnje" },
  { t: "Izgled sajta pre objave", when: "pre lansiranja" },
  { t: "Budžet za oglase", when: "svakog meseca" },
  { t: "Sledeći prioritet", when: "posle svakog izveštaja" },
];

function Thumb({ i }) {
  if (i === 0)
    return (
      <span className={`${s.thumb} ${s.thumbChips}`}>
        <i />
        <i />
        <i />
      </span>
    );
  if (i === 1)
    return (
      <span className={`${s.thumb} ${s.thumbSite}`}>
        <i />
        <i />
        <i />
      </span>
    );
  if (i === 2)
    return (
      <span className={`${s.thumb} ${s.thumbBudget}`}>
        <span>
          <i />
          <i />
          <i />
        </span>
        <b>RSD</b>
      </span>
    );
  return (
    <span className={`${s.thumb} ${s.thumbNext}`}>
      <i />
      <i />
      <Sparkle size={12} />
    </span>
  );
}

export default function Roles() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [working, setWorking] = useState(-1);
  const [signed, setSigned] = useState(() => YOU.map(() => false));

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    setWorking(0);
    const id = setInterval(() => {
      i++;
      setWorking(i % WE.length);
    }, 1700);
    return () => clearInterval(id);
  }, [visible]);

  const all = signed.every(Boolean);

  return (
    <section className={b.section} data-theme="light">
      <div className={b.container}>
        <SectionHead
          id="uloge"
          kicker="Ko šta radi"
          title="Mi vodimo marketing. Vi vodite posao."
          intro="Tekstove, sajt, oglase i izveštaje radimo mi. Četiri odluke koje menjaju posao ostaju vaše, i bez vašeg odobrenja ništa ne ide uživo."
        />

        <div ref={ref} className={s.board}>
          <div className={s.we} data-theme="dark">
            <Sparkle
              size={240}
              className={`${b.sparkleMark} ${b.spinSlow} ${s.spark}`}
            />
            <div className={s.colHead}>
              <h3>Digitl radi</h3>
              <span>U pozadini, svakog dana</span>
            </div>
            <ul className={s.weList}>
              {WE.map((w, i) => {
                const Icon = w.icon;
                const busy = working === i;
                return (
                  <li key={w.t} className={busy ? s.busy : ""}>
                    <span className={s.weIcon}>
                      <Icon size={17} />
                    </span>
                    <span className={s.weText}>
                      <b>{w.t}</b>
                      <span>{w.log}</span>
                    </span>
                    <span className={s.weState}>
                      {busy
                        ? <>
                            <span className={b.spinner} /> <em>Radimo</em>
                          </>
                        : <span className={s.weDone}>
                            <Check size={13} strokeWidth={3} /> <em>Gotovo</em>
                          </span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={s.you}>
            <div className={s.colHead}>
              <h3>Vi odlučujete</h3>
              <span>{all ? "Sve odobreno" : "Kliknite da odobrite"}</span>
            </div>
            <ul className={s.youList}>
              {YOU.map((y, i) => (
                <li key={y.t}>
                  <button
                    type="button"
                    aria-pressed={signed[i]}
                    className={signed[i] ? s.signed : ""}
                    onClick={() =>
                      setSigned((arr) => arr.map((v, k) => (k === i ? !v : v)))
                    }
                  >
                    <Thumb i={i} />
                    <span className={s.youText}>
                      <b>{y.t}</b>
                      <span>{y.when}</span>
                    </span>
                    <span className={s.youState}>
                      <span className={s.box}>
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <em>{signed[i] ? "Odobreno" : "Vaša odluka"}</em>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className={s.tally}>
              <span className={s.tallyBar}>
                {signed.map((v, i) => (
                  <i key={YOU[i].t} data-on={v ? "true" : undefined} />
                ))}
              </span>
              <span>
                {signed.filter(Boolean).length} od {YOU.length} odobreno
                {all ? ", krećemo." : ""}
              </span>
            </div>
          </div>
        </div>

        <Reveal className={s.note}>
          <span className={s.noteIcon}>
            <Message size={18} />
          </span>
          <p>
            <b>
              Radite sa ljudima koji donose odluke, ne sa account menadžerom.
            </b>{" "}
            Komunikacija je direktna i redovna, od prvog razgovora do svakog
            izveštaja.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
