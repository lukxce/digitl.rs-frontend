"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  useHorizontalScroll,
} from "./kit";
import s from "./preposle.module.css";

/**
 * Concept: "pre / posle". Horizontal on purpose — dragging right is the
 * transformation, and the page warms from grey to blue as you go.
 * Every "pre" line is condensed from the client's own case study; every
 * "posle" figure is a published metric.
 */

export default function PrePosleGrid({ pairs = [] }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  useHorizontalScroll(trackRef, stageRef);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: email,
          message: "Upit sa /bento/pre-posle",
        }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Odgovaramo u roku od jednog radnog dana.",
    invalid: "Ta adresa ne izgleda ispravno.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo.",
  }[state];

  return (
    <div className={s.stage} ref={stageRef} data-bento>
      <div className={s.wash} aria-hidden />

      <header className={s.bar}>
        <Image
          src="/digitl-logo.png"
          alt="digitl"
          width={80}
          height={22}
          className={s.logo}
          priority
        />
        <span className={s.hint}>Prevucite udesno →</span>
      </header>

      <div className={s.track} ref={trackRef}>
        <section className={`${s.col} ${s.intro}`}>
          <span className={s.label}>Pre / posle</span>
          <h1 className={s.introTitle}>
            Svaki klijent je došao iz istog mesta.
          </h1>
          <p className={s.introBody}>
            Godine zanata, nula tragova na internetu. Ovo je ono što je bilo
            pre, i šta je izmereno posle.
          </p>
          <span className={s.introArrow} aria-hidden>
            <ArrowIcon size={20} />
          </span>
        </section>

        <div className={s.side} data-side="pre">
          <span className={s.sideLabel}>Pre</span>
          {pairs.map((p) => (
            <article key={`pre-${p.slug}`} className={`${s.card} ${s.preCard}`}>
              <span className={s.cardClient}>{p.client}</span>
              <p className={s.preText}>{p.before}</p>
            </article>
          ))}
        </div>

        <section className={`${s.col} ${s.pivot}`}>
          <span className={s.pivotMark} aria-hidden />
          <p className={s.pivotText}>
            Ovde upada <strong>digitl</strong>.
          </p>
          <p className={s.pivotNote}>
            Pet kanala, jedan sistem, i merenje od prvog dana.
          </p>
        </section>

        <div className={s.side} data-side="posle">
          <span className={s.sideLabelLight}>Posle</span>
          {pairs.map((p) => (
            <a
              key={`posle-${p.slug}`}
              href={p.href}
              className={`${s.card} ${s.postCard}`}
            >
              <span className={s.cardClientLight}>{p.client}</span>
              <ul className={s.metricList}>
                {p.after.map((m) => (
                  <li key={m.label} className={s.metric}>
                    <span className={s.metricValue}>{m.value}</span>
                    <span className={s.metricLabel}>{m.label}</span>
                  </li>
                ))}
              </ul>
              <span className={s.cardArrow}>
                <ArrowIcon size={13} />
              </span>
            </a>
          ))}
        </div>

        <section className={`${s.col} ${s.cta}`}>
          <span className={s.labelLight}>Vaš red</span>
          <p className={s.ctaTitle}>Gde ste vi sada?</p>
          <form className={s.ctaForm} onSubmit={submit}>
            <input
              className={s.ctaInput}
              type="email"
              placeholder="vas@email.com"
              aria-label="Email adresa"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setState("idle");
              }}
            />
            <button
              className={s.ctaSend}
              type="submit"
              disabled={state === "sending"}
              aria-label="Pošaljite"
            >
              <ArrowIcon size={15} />
            </button>
          </form>
          <p
            className={`${s.ctaNote} ${["invalid", "error"].includes(state) ? s.ctaError : ""}`}
          >
            {note}
          </p>
          <div className={s.ctaDirect}>
            <a href={`mailto:${CONTACT.email}`}>
              <MailIcon />
              {CONTACT.email}
            </a>
            <a href={`tel:${CONTACT.tel}`}>
              <PhoneIcon />
              {CONTACT.phone}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
