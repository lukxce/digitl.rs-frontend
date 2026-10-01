"use client";

import { useEffect, useRef, useState } from "react";
import { Btn } from "../v5/ui";
import k from "./break.module.css";

/* A tidy mini site that, on demand, turns into the average small-business
   site: a slow white screen, fallback fonts, a banner that shoves the text
   down, images arriving last, then the cookie wall, a newsletter popup and a
   chat bubble. "Popravite" puts it back, loaded in under a second. */

// ms after "Pokvarite" when each nuisance arrives
const TIMELINE = [
  ["blank", 0],
  ["raw", 1600],
  ["shift", 2500],
  ["images", 3400],
  ["cookie", 4300],
  ["popup", 5200],
  ["chat", 6100],
];

export default function Break() {
  const [mode, setMode] = useState("good");
  const [phase, setPhase] = useState(-1);
  const [secs, setSecs] = useState(0.9);
  const timers = useRef([]);

  const clear = () => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const breakIt = () => {
    clear();
    setMode("bad");
    setPhase(0);
    setSecs(0);
    TIMELINE.forEach(([, at], i) => {
      timers.current.push(setTimeout(() => setPhase(i), at));
    });
    const t0 = Date.now();
    const tick = () => {
      const s = (Date.now() - t0) / 1000;
      setSecs(Math.min(s, 7.4));
      if (s < 7.4) timers.current.push(setTimeout(tick, 100));
    };
    tick();
  };

  const fixIt = () => {
    clear();
    setMode("fixing");
    setPhase(-1);
    setSecs(0);
    timers.current.push(setTimeout(() => setSecs(0.9), 120));
    timers.current.push(setTimeout(() => setMode("good"), 900));
  };

  const at = (name) =>
    mode === "bad" && phase >= TIMELINE.findIndex(([n]) => n === name);
  const bad = mode === "bad";

  return (
    <div className={k.wrap}>
      <div className={k.controls}>
        <div className={k.timer} data-bad={bad ? "true" : undefined}>
          <span>Učitavanje</span>
          <b>{secs.toFixed(1).replace(".", ",")} s</b>
        </div>
        {bad
          ? <Btn variant="accent" onClick={fixIt}>
              Popravite sajt
            </Btn>
          : <Btn variant="ink" onClick={breakIt}>
              Pokvarite sajt
            </Btn>}
        <span className={k.honest}>Simulacija, ne pravi sajt</span>
      </div>

      <div className={k.browser}>
        <div className={k.chrome}>
          <span className={k.lights}>
            <i />
            <i />
            <i />
          </span>
          <span className={k.url}>
            vasafirma.rs
            <i
              className={k.load}
              data-bad={bad ? "true" : undefined}
              key={mode}
            />
          </span>
        </div>

        <div
          className={k.site}
          data-mode={mode}
          data-raw={at("raw") ? "true" : undefined}
          data-blank={bad && phase < 1 ? "true" : undefined}
        >
          {at("shift")
            ? <div className={k.banner}>
                Akcija! Pozovite odmah za popust od 10%!!!
              </div>
            : null}
          <nav className={k.nav}>
            <b>Vaša firma</b>
            <span>Usluge</span>
            <span>O nama</span>
            <span>Kontakt</span>
          </nav>
          <div className={k.hero}>
            <div className={k.text}>
              <h3>Popravke u istom danu, sa cenom unapred.</h3>
              <p>
                Dolazimo na adresu, javljamo cenu pre posla i garantujemo na sve
                radove.
              </p>
              <span className={k.cta}>Zakažite</span>
            </div>
            <div
              className={k.img}
              data-loaded={!bad || at("images") ? "true" : undefined}
            />
          </div>
          <div className={k.cards}>
            {["Brzo", "Pošteno", "Garancija"].map((t) => (
              <span
                key={t}
                className={k.card}
                data-loaded={!bad || at("images") ? "true" : undefined}
              >
                <i />
                {t}
              </span>
            ))}
          </div>

          {bad && phase < 1
            ? <div className={k.spinner}>
                <i />
              </div>
            : null}
          {at("cookie")
            ? <div className={k.cookie}>
                <p>
                  Ovaj sajt koristi kolačiće. Nastavkom korišćenja prihvatate
                  uslove korišćenja i politiku privatnosti.
                </p>
                <span>Prihvatam sve</span>
              </div>
            : null}
          {at("popup")
            ? <div className={k.popup}>
                <i className={k.x}>×</i>
                <b>Ne propustite!</b>
                <p>Prijavite se na naš newsletter i saznajte prvi za akcije.</p>
                <span className={k.field} />
                <span className={k.popBtn}>Prijavi me</span>
              </div>
            : null}
          {at("chat")
            ? <div className={k.chat}>Zdravo! 👋 Kako možemo da pomognemo?</div>
            : null}
        </div>
      </div>

      <p className={k.caption}>
        {bad
          ? phase >= TIMELINE.length - 1
            ? "Ovo je prosečan sajt malog biznisa. Kupac je otišao negde oko druge sekunde."
            : "Sajt se učitava…"
          : mode === "fixing"
            ? "Sređujemo…"
            : "Ovako izgleda sajt koji pravimo. Pritisnite „Pokvarite sajt“."}
      </p>
    </div>
  );
}
