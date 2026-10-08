"use client";

import { useState } from "react";
import b from "../v5/base.module.css";
import Hero from "../v5/Hero";
import HeroShowcase, { CARDS } from "../v5/HeroShowcase";
import { AppProvider } from "../v5/ui";
import l from "./lab.module.css";

/* digitl.rs/v6: the hero cards, one per service. On top the hero exactly as
   it would sit on /v5, with a different card on each visit; the bar above
   it forces one. Below, all five side by side. */

const NOTES = {
  seo: "Vaš sajt se penje do prvog mesta u pretrazi.",
  ads: "Kampanja koja gasi skupe oglase i pojačava one koji donose upite.",
  social: "Objave idu po planu, a poruke se pretvaraju u upite.",
  web: "Spor stari sajt postaje brz sajt koji donosi upite.",
  brand: "Ime, boje i znak, primenjeni svuda odjednom.",
};

export default function Lab({ clients, fonts }) {
  const [show, setShow] = useState(null);
  const [nonce, setNonce] = useState(0);
  return (
    <div className={`${b.root} ${fonts} ${l.lab}`} data-own-chrome>
      <AppProvider>
        <div className={l.bar}>
          <span className={l.brand}>
            digitl <i>Hero kartice</i>
          </span>
          <div className={l.picks} role="group" aria-label="Kartica">
            <button
              type="button"
              data-on={show === null || undefined}
              onClick={() => {
                setShow(null);
                setNonce((n) => n + 1);
              }}
            >
              ↻ Nasumično
            </button>
            {CARDS.map((c) => (
              <button
                key={c.id}
                type="button"
                data-on={show === c.id || undefined}
                onClick={() => setShow(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className={l.preview}>
          <Hero
            clients={clients}
            visual={<HeroShowcase show={show} nonce={nonce} />}
          />
        </div>

        <section className={l.all}>
          <h2>Svih pet, jedna pored druge</h2>
          <div className={l.grid}>
            {CARDS.map(({ id, name, Card }, i) => (
              <figure key={id} id={`k-${id}`} className={l.item}>
                <figcaption>
                  <b>{String(i + 1).padStart(2, "0")}</b> {name}
                  <span>{NOTES[id]}</span>
                </figcaption>
                <Card />
              </figure>
            ))}
          </div>
        </section>
      </AppProvider>
    </div>
  );
}
