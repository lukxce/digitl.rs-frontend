"use client";

import { useState } from "react";
import elektromil from "../assets/clients/elektromil.webp";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import thermiq from "../assets/clients/thermiq.webp";
import b from "./base.module.css";
import { ArrowRight, Phone, Rotate, Search } from "./icons";
import p from "./problems.module.css";
import { EASE, Reveal, SectionHead, useApp } from "./ui";

/* ── logo strip ───────────────────────────────────────────────────────── */
export function LogoStrip({ clients }) {
  const local = [
    { src: thermiq.src, name: "ThermiQ" },
    { src: elektromil.src, name: "ElektroMil" },
    { src: primaDental.src, name: "Prima Dental" },
    { src: startupsRs.src, name: "Startups.rs" },
  ];
  const fromCms = clients
    .filter(
      (c) =>
        c.logo &&
        !local.some((l) => l.name.toLowerCase() === c.name.toLowerCase()),
    )
    .map((c) => ({ src: c.logo, name: c.name, label: true }));
  const logos = [...local, ...fromCms];

  return (
    <div className={p.strip}>
      <div className={`${b.container} ${p.stripInner}`}>
        <p className={p.stripStat}>
          <b>50+ uspešnih saradnji,</b> od majstora iz Niša do distributera sa
          hiljadama proizvoda.
        </p>
        <div
          className={`${b.marqueeWrap} ${p.stripRail}`}
          style={{ "--dur": "38s" }}
        >
          <div className={b.marquee}>
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className={p.stripSet}
                aria-hidden={copy ? "true" : undefined}
              >
                {logos.map((l) => (
                  <span key={l.name} className={p.logo}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={l.src} alt={copy ? "" : l.name} />
                    {l.label ? <b>{l.name}</b> : null}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── flip-card illustrations ──────────────────────────────────────────── */
function ArtSite() {
  return (
    <span className={p.artSite}>
      <span className={p.browserBar}>
        <i />
        <i />
        <i />
      </span>
      <span className={p.line} style={{ width: "62%" }} />
      <span className={p.line} style={{ width: "84%", opacity: 0.5 }} />
      <span className={p.line} style={{ width: "70%", opacity: 0.5 }} />
      <span className={p.callBtn}>
        <Phone size={11} strokeWidth={2.6} /> Naručite
      </span>
      <span className={p.zero}>0 porudžbina danas</span>
    </span>
  );
}

function ArtSerp() {
  return (
    <span className={p.artSerp}>
      <span className={p.searchBar}>
        <Search size={11} strokeWidth={2.6} /> električar niš
      </span>
      {[0, 1, 2].map((k) => (
        <span key={k} className={p.result}>
          <i />
          <span />
        </span>
      ))}
      <span className={`${p.result} ${p.resultYou}`}>
        <i />
        <span />
        <em>vi</em>
      </span>
    </span>
  );
}

function ArtAds() {
  return (
    <span className={p.artAds}>
      {[34, 58, 44, 76, 52, 88].map((hgt, k) => (
        <i
          key={k}
          style={{ height: `${hgt}%`, animationDelay: `${k * 90}ms` }}
        />
      ))}
      <b>?</b>
    </span>
  );
}

function ArtCalendar() {
  const on = new Set([2, 9, 23]);
  return (
    <span className={p.artCal}>
      {Array.from({ length: 28 }, (_, k) => (
        <i
          key={k}
          data-on={on.has(k) ? "true" : undefined}
          style={{ animationDelay: `${k * 30}ms` }}
        />
      ))}
    </span>
  );
}

function ArtBrand() {
  return (
    <span className={p.artBrand}>
      <i />
      <i />
      <i />
    </span>
  );
}

const CARDS = [
  {
    key: "web",
    tone: "accent",
    q: "Imamo posete, ali ne i prodaju.",
    Art: ArtSite,
    tag: "Sajt",
    title: "Sajt koji prodaje",
    body: "Brz na telefonu, cena i sledeći korak vidljivi odmah, svaka usluga i kategorija na svojoj stranici. Sadržaj posle uređujete sami.",
    proof: "Moler Niš i Servis Klime Niš: PageSpeed 100 na telefonu.",
    client: "Moler Niš",
  },
  {
    key: "seo",
    tone: "panel",
    q: "Na Google-u nas nema ni na drugoj strani.",
    Art: ArtSerp,
    tag: "SEO",
    title: "Prvi tamo gde vas traže",
    body: "Stranica za svaku uslugu i grad, tehnički SEO na nivou šablona i sadržaj koji odgovara na prava pitanja, na Google-u i u AI pretrazi.",
    proof: "ThermiQ: 3.157 indeksiranih stranica za tri meseca.",
    client: "ThermiQ",
  },
  {
    key: "ads",
    tone: "lime",
    q: "Plaćam oglase, a ne znam šta donose.",
    Art: ArtAds,
    tag: "Oglasi",
    title: "Svaki dinar vezan za upit",
    body: "Google Search i Performance Max, Meta i Instagram kampanje, postavljene da donose prodaju, ne samo klikove.",
    proof: "Praćenje od klika do upita, u istom izveštaju kao sajt i SEO.",
  },
  {
    key: "social",
    tone: "spark",
    q: "Na mrežama objavljujemo kad se neko seti.",
    Art: ArtCalendar,
    tag: "Mreže",
    title: "Plan, a ne inspiracija",
    body: "Plan objava po nedeljama, formati za Reels i Stories, i isti glas kao na sajtu i u oglasima.",
    proof: "Mreže podržavaju ostale kanale, ne žive odvojeno od njih.",
  },
  {
    key: "brand",
    tone: "soft",
    q: "Izgledamo isto kao konkurencija.",
    Art: ArtBrand,
    tag: "Brend",
    title: "Razlog da izaberu baš vas",
    body: "Pozicioniranje, poruka, logo, boje i tipografija, kao sistem koji radi na svakom formatu.",
    proof: "ThermiQ: crvena prati grejanje, plava hlađenje, na svakom formatu.",
    client: "ThermiQ",
  },
];

function FlipCard({ card, i, href }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { Art } = card;

  const onMove = (e) => {
    if (flipped || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * -10,
      y: ((e.clientX - r.left) / r.width - 0.5) * 12,
    });
  };

  return (
    <Reveal i={i} className={p.cell}>
      <div
        className={`${b.flip} ${p.flip}`}
        data-flipped={flipped}
        onPointerMove={onMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: `transform 0.5s cubic-bezier(${EASE.join(",")})`,
        }}
      >
        <div className={b.flipInner}>
          <button
            type="button"
            className={`${b.flipFace} ${p.front}`}
            data-tone={card.tone}
            onClick={() => setFlipped(true)}
            aria-label={`${card.q} Okrenite za odgovor.`}
            tabIndex={flipped ? -1 : 0}
          >
            <span className={p.no}>0{i + 1}</span>
            <span className={p.art}>
              <Art />
            </span>
            <span className={p.q}>„{card.q}“</span>
            <span className={p.hint}>
              <Rotate size={13} /> Okrenite za odgovor
            </span>
          </button>

          <div
            className={`${b.flipFace} ${b.flipBack} ${p.back}`}
            aria-hidden={!flipped}
          >
            <span className={p.backTag} data-tone={card.tone}>
              {card.tag}
            </span>
            <h3 className={p.backTitle}>{card.title}</h3>
            <p className={p.backBody}>{card.body}</p>
            <p className={p.proof}>{card.proof}</p>
            <div className={p.backFoot}>
              {href
                ? <a
                    className={b.textLink}
                    href={href}
                    tabIndex={flipped ? 0 : -1}
                  >
                    Projekat <ArrowRight size={14} />
                  </a>
                : <span />}
              <button
                type="button"
                className={p.flipBack}
                onClick={() => setFlipped(false)}
                tabIndex={flipped ? 0 : -1}
              >
                <Rotate size={13} /> Nazad
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Problems({ clients }) {
  const { book } = useApp();
  const hrefFor = (name) => clients.find((c) => c.name === name)?.href;

  return (
    <section id="usluge" className={b.section} data-theme="light">
      <div className={b.container}>
        <SectionHead
          kicker="Usluge"
          title="Pet rečenica koje čujemo na prvom razgovoru"
          intro="Svaka ima svoju uslugu, a sve rade kao jedan sistem: oglasi dovode ljude na sajt, sajt ih pretvara u pozive, SEO smanjuje cenu svakog sledećeg. Okrenite karticu za odgovor."
        />
        <div className={p.grid}>
          {CARDS.map((c, i) => (
            <FlipCard
              key={c.key}
              card={c}
              i={i}
              href={c.client ? hrefFor(c.client) : null}
            />
          ))}
        </div>
        <p className={p.after}>
          Prepoznali ste svoju?{" "}
          <button type="button" className={b.textLink} onClick={() => book()}>
            Razgovor je besplatan i traje 30 minuta <ArrowRight size={14} />
          </button>
        </p>
      </div>
    </section>
  );
}
