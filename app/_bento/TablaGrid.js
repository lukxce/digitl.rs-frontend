"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  ThemeToggle,
  useTheme,
} from "./kit";
import s from "./tabla.module.css";

/**
 * Concept: the homepage as the reporting dashboard digitl hands clients.
 * Deliberately fits one screen on desktop — a dashboard you have to scroll
 * isn't a dashboard. Numbers come from the case studies, never invented.
 */

const MEASURED = [
  ["CPL", "cena po upitu"],
  ["CPA", "cena po klijentu"],
  ["ROAS", "prihod na uloženo"],
  ["Pozicija", "vidljivost u pretrazi"],
];

const STEPS = ["Razumevanje", "Planiranje", "Lansiranje", "Optimizacija"];

function Panel({ area, className = "", children, ...rest }) {
  return (
    <section
      className={`${s.panel} ${className}`}
      style={{ gridArea: area }}
      {...rest}
    >
      {children}
    </section>
  );
}

export default function TablaGrid({ kpis = [], clients = [] }) {
  const [theme, toggleTheme] = useTheme("bento-tabla-theme");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

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
          message: "Zahtev za razgovor sa /bento/tabla",
        }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Bez obaveze. Odgovaramo u roku od jednog radnog dana.",
    invalid: "Ta adresa ne izgleda ispravno.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <div className={s.stage} data-theme={theme ?? undefined} data-bento>
      <div className={s.screen}>
        <header className={s.bar}>
          <div className={s.barLeft}>
            <Image
              src="/digitl-logo.png"
              alt="digitl"
              width={80}
              height={22}
              className={s.logo}
              priority
            />
            <span className={s.barDivider} aria-hidden />
            <span className={s.barLabel}>Radna tabla</span>
          </div>
          <div className={s.barRight}>
            <span className={s.live}>
              <span className={s.liveDot} aria-hidden />
              Brojevi iz naših studija slučaja
            </span>
            <ThemeToggle
              theme={theme}
              onToggle={toggleTheme}
              className={s.themeToggle}
            />
          </div>
        </header>

        <div className={s.board}>
          <Panel area="hero" className={s.hero}>
            <h1 className={s.heroTitle}>
              Marketing koji donosi <em>prave</em> rezultate.
            </h1>
            <p className={s.heroBody}>
              Svaki kanal se meri na istom mestu. Ovo je ono što merimo i šta je
              do sada izmereno.
            </p>
            <ul className={s.measured}>
              {MEASURED.map(([k, v]) => (
                <li key={k} className={s.measuredItem}>
                  <span className={s.measuredKey}>{k}</span>
                  <span className={s.measuredVal}>{v}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {kpis.slice(0, 4).map((k, i) => (
            <Panel
              key={`${k.client}-${k.label}`}
              area={`kpi${i + 1}`}
              className={s.kpi}
            >
              <span className={s.kpiLabel}>{k.label}</span>
              <span className={s.kpiValue}>{k.value}</span>
              <span className={s.kpiClient}>{k.client}</span>
            </Panel>
          ))}

          <Panel area="clients" className={s.clients}>
            <div className={s.panelHead}>
              <span className={s.eyebrow}>Klijenti</span>
              <a className={s.panelLink} href="/projects">
                Svi projekti <ArrowIcon size={12} />
              </a>
            </div>
            <ul className={s.clientList}>
              {clients.map((c) => (
                <li key={c.slug}>
                  <a className={s.clientRow} href={c.href}>
                    <span className={s.clientName}>
                      {c.clientName ?? c.title}
                    </span>
                    <span className={s.clientCat}>{c.category}</span>
                    <span className={s.clientMetric}>{c.metric ?? "—"}</span>
                    <span className={s.clientArrow}>
                      <ArrowIcon size={12} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel area="process" className={s.process}>
            <span className={s.eyebrow}>Ciklus</span>
            <ol className={s.stepper}>
              {STEPS.map((step, i) => (
                <li key={step} className={s.step}>
                  <span className={s.stepNum}>{i + 1}</span>
                  <span className={s.stepName}>{step}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel area="cta" className={s.cta}>
            <span className={s.eyebrowLight}>Prvi korak</span>
            <p className={s.ctaTitle}>Da vidimo vaše brojeve.</p>
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
          </Panel>
        </div>
      </div>
    </div>
  );
}
