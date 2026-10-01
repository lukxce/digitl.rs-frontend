"use client";

import { motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import { SERVICES } from "./content";
import { ArrowRight, Check, Rotate, Search } from "./icons";
import s from "./services.module.css";
import { EASE, Head, useApp } from "./ui";

/* ── one small looping scene per service, drawn in CSS ─────────────────── */
function ArtAds() {
  return (
    <span className={s.artAds}>
      <span className={s.adCard}>
        <em>Sponzorisano</em>
        <i />
        <i />
        <span className={s.adBtn}>Kupite</span>
      </span>
      <span className={s.cursor} />
      <span className={s.adToast}>
        <Check size={11} strokeWidth={3} /> +1 upit
      </span>
    </span>
  );
}

function ArtSeo() {
  return (
    <span className={s.artSeo}>
      <span className={s.searchBar}>
        <Search size={11} strokeWidth={2.6} /> pretraga vaših kupaca
      </span>
      <span className={s.results}>
        {[0, 1, 2].map((k) => (
          <span key={k} className={s.result}>
            <i />
            <span />
          </span>
        ))}
        <span className={`${s.result} ${s.resultYou}`}>
          <i />
          <span />
          <em>vi</em>
        </span>
      </span>
    </span>
  );
}

function ArtWeb() {
  return (
    <span className={s.artWeb}>
      <span className={s.phone}>
        <span className={s.load} />
        <span className={s.ln} style={{ width: "55%" }} />
        <span className={s.block} />
        <span className={s.ln} style={{ width: "85%" }} />
        <span className={s.ln} style={{ width: "70%" }} />
        <span className={s.webBtn} />
      </span>
      <span className={s.gauge}>
        <b>100</b>
        <em>brzina</em>
      </span>
    </span>
  );
}

function ArtSocial() {
  return (
    <span className={s.artSocial}>
      {Array.from({ length: 9 }, (_, k) => (
        <i key={k} style={{ animationDelay: `${k * 0.22}s` }} />
      ))}
      <span className={s.heart}>♥</span>
    </span>
  );
}

function ArtBrand() {
  return (
    <span className={s.artBrand}>
      <i className={s.swA} />
      <i className={s.swB} />
      <i className={s.swC} />
      <b className={s.mark}>Aa</b>
    </span>
  );
}

const ART = {
  ads: ArtAds,
  seo: ArtSeo,
  web: ArtWeb,
  social: ArtSocial,
  brand: ArtBrand,
};

function Card({ x, i, rank, wide, onAsk }) {
  const [flipped, setFlipped] = useState(false);
  const Art = ART[x.id];
  return (
    <motion.li
      layout
      className={`${s.cell} ${wide ? s.wide : ""}`}
      transition={{ layout: { duration: 0.7, ease: EASE } }}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className={s.flip} data-flipped={flipped}>
        <div className={s.inner}>
          <button
            type="button"
            className={s.front}
            data-tone={x.id}
            onClick={() => setFlipped(true)}
            tabIndex={flipped ? -1 : 0}
            aria-label={`${x.name}. Okrenite za detalje.`}
          >
            <span className={s.frontTop}>
              <span className={s.no}>0{i + 1}</span>
              {rank >= 0
                ? <span className={s.badge}>Za vas #{rank + 1}</span>
                : null}
            </span>
            <span className={s.art}>
              <Art />
            </span>
            <span className={s.frontText}>
              <b>{x.name}</b>
              <em>{x.role}</em>
            </span>
            <span className={s.hint}>
              <Rotate size={13} /> Okrenite
            </span>
          </button>

          <div className={s.back} aria-hidden={!flipped}>
            <span className={s.backName}>{x.name}</span>
            <p className={s.hear}>„{x.hear}“</p>
            <p className={s.body}>{x.body}</p>
            <ul className={s.includes}>
              {x.includes.map((t) => (
                <li key={t}>
                  <Check size={12} strokeWidth={3} /> {t}
                </li>
              ))}
            </ul>
            <p className={s.proof}>{x.proof}</p>
            <div className={s.backFoot}>
              <button
                type="button"
                className={s.ask}
                onClick={() => onAsk(x.name)}
                tabIndex={flipped ? 0 : -1}
              >
                Razgovarajmo <ArrowRight size={14} />
              </button>
              <button
                type="button"
                className={s.unflip}
                onClick={() => setFlipped(false)}
                tabIndex={flipped ? 0 : -1}
              >
                <Rotate size={13} /> Nazad
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default function Services() {
  const { plan, book } = useApp();
  const order = plan ? plan.ranked : SERVICES.map((x) => x.id);
  const list = order.map((id) => SERVICES.find((x) => x.id === id));

  return (
    <section className={b.section} data-section="Usluge">
      <div className={b.container}>
        <div className={s.top}>
          <Head
            id="usluge"
            label="Usluge"
            title="Pet usluga, jedan tim."
            intro="Oglasi, SEO, web, mreže i brend. Svaka ima svoj posao, a vode se zajedno. Okrenite karticu za detalje."
          />
          {plan
            ? <p className={s.planNote}>
                Poređano po vašem planu. <b>Prve dve</b> su mesto odakle bismo
                krenuli.
              </p>
            : null}
        </div>
        <ul className={s.grid}>
          {list.map((x, i) => (
            <Card
              key={x.id}
              x={x}
              i={i}
              rank={plan ? plan.top.indexOf(x.id) : -1}
              wide={i < 2}
              onAsk={book}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
