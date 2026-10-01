"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { EASE, Roll } from "../v5/ui";
import g from "./serp.module.css";

// Backlinko, 4 million Google results: average organic CTR by position.
const CTR = [27.6, 15.8, 11.0, 8.4, 6.3, 4.9, 3.9, 3.3, 2.7, 2.4];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 22) || "vasafirma";

export default function Serp() {
  const [trade, setTrade] = useState("zubar");
  const [city, setCity] = useState("Novi Sad");
  const [name, setName] = useState("Vaša ordinacija");
  const [pos, setPos] = useState(7);

  const ctr = CTR[pos - 1];
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={g.wrap}>
      <div className={g.side}>
        <div className={g.fields}>
          <label>
            <span>Delatnost</span>
            <input value={trade} onChange={(e) => setTrade(e.target.value)} />
          </label>
          <label>
            <span>Grad</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label className={g.wide}>
            <span>Naziv firme</span>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>

        <div className={g.slider}>
          <div className={g.sliderHead}>
            <span>Vaša pozicija na Google-u</span>
            <b>{pos}. mesto</b>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={11 - pos}
            onChange={(e) => setPos(11 - Number(e.target.value))}
            aria-label="Pozicija"
            style={{ "--p": `${((10 - pos) / 9) * 100}%` }}
          />
          <div className={g.ticks}>
            <span>10.</span>
            <span>1.</span>
          </div>
        </div>

        <div className={g.result}>
          <span className={g.big}>
            <Roll value={ctr} decimals={1} ms={600} suffix="%" />
          </span>
          <p>
            klikova u proseku ide na {pos}. mesto. Od 1.000 ljudi koji ukucaju „
            {trade} {city}“, to je oko{" "}
            <b>
              <Roll value={Math.round(ctr * 10)} ms={600} />
            </b>{" "}
            poseta
            {pos > 1
              ? <>
                  {" "}
                  umesto <b>{Math.round(CTR[0] * 10)}</b> na prvom mestu.
                </>
              : ", najviše što pretraga daje."}
          </p>
          <div className={g.bars} aria-hidden="true">
            {CTR.map((v, i) => (
              <i
                key={v}
                data-you={i + 1 === pos ? "true" : undefined}
                style={{ height: `${(v / CTR[0]) * 100}%` }}
              />
            ))}
          </div>
          <span className={g.source}>
            Prosečan procenat klikova po poziciji, Backlinko, 4 miliona Google
            rezultata.
          </span>
        </div>
      </div>

      <div className={g.serp}>
        <div className={g.search}>
          <span className={g.gLogo}>
            <b>G</b>
          </span>
          <span className={g.query}>
            {trade} {city}
          </span>
        </div>
        <span className={g.count}>Svi rezultati · Mape · Slike</span>
        <ol className={g.list}>
          {rows.map((n) => {
            const you = n === pos;
            return (
              <motion.li
                key={you ? "you" : `r${n < pos ? n : n - 1}`}
                layout
                transition={{ duration: 0.5, ease: EASE }}
                className={you ? g.you : g.other}
              >
                {you
                  ? <>
                      <span className={g.site}>
                        <i>{name.slice(0, 1).toUpperCase() || "V"}</i>
                        <span>
                          <b>{name || "Vaša firma"}</b>
                          <em>https://{slug(name)}.rs</em>
                        </span>
                      </span>
                      <span className={g.title}>
                        {trade
                          ? trade[0].toUpperCase() + trade.slice(1)
                          : "Usluge"}{" "}
                        {city} · {name || "Vaša firma"}
                      </span>
                      <span className={g.desc}>
                        Cene unapred, termin u istoj nedelji i sve usluge na
                        jednom mestu. Pogledajte cenovnik i zakažite online.
                      </span>
                    </>
                  : <>
                      <span className={g.site}>
                        <i />
                        <span>
                          <s style={{ width: `${40 + ((n * 17) % 30)}%` }} />
                          <s style={{ width: `${30 + ((n * 11) % 20)}%` }} />
                        </span>
                      </span>
                      <s
                        className={g.tLine}
                        style={{ width: `${55 + ((n * 13) % 35)}%` }}
                      />
                      <s className={g.dLine} />
                    </>}
              </motion.li>
            );
          })}
        </ol>
        <span className={g.honest}>
          Ilustracija rezultata. Ostale firme su sakrivene.
        </span>
      </div>
    </div>
  );
}
