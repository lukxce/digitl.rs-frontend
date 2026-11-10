"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { CONTACT } from "../_home/content";
import { ArrowRight, ArrowUpRight } from "../_home/icons";
import { Btn, EASE, useApp } from "../_home/ui";
import elektromilLogo from "../assets/clients/elektromil.webp";
import primaLogo from "../assets/clients/prima-dental.webp";
import startupsLogo from "../assets/clients/startups-rs.webp";
import thermiqLogo from "../assets/clients/thermiq.webp";
import s from "./novi.module.css";
import { Lines, Reviews, Rise, Shell, Statement } from "./Parts";
import {
  BrandSticker,
  ChartSticker,
  SearchSticker,
  SeoSticker,
  SocialSticker,
  TargetSticker,
  WebSticker,
} from "../_usluge/Stickers";

/* ── hero ─────────────────────────────────────────────────────────────── */

function Pop({ children, delay, rotate }) {
  return (
    <motion.span
      className={s.inlineSticker}
      initial={{ scale: 0, rotate: rotate - 40 }}
      animate={{ scale: 1, rotate }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay }}
      whileHover={{ rotate: rotate + 10, scale: 1.08 }}
    >
      {children}
    </motion.span>
  );
}

function Hero() {
  const { openBooking } = useApp();
  return (
    <section className={s.heroHome}>
      <motion.span
        className={s.eyebrow}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        Full-service marketing agencija
      </motion.span>
      <Lines
        as="h1"
        inView={false}
        delay={0.1}
        className={s.heroTitle}
        lines={[
          <>
            Marketing{" "}
            <Pop delay={0.75} rotate={-8}>
              <SearchSticker size="100%" />
            </Pop>{" "}
            koji
          </>,
          "donosi prave",
          <>
            rezultate.{" "}
            <Pop delay={0.95} rotate={9}>
              <ChartSticker size="100%" />
            </Pop>
          </>,
        ]}
      />
      <motion.div
        className={s.heroCtas}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
      >
        <Btn variant="accent" onClick={() => openBooking()}>
          Zakažite razgovor
        </Btn>
        <a href="#projekti" className={s.textLink}>
          Naši projekti <ArrowRight size={16} />
        </a>
      </motion.div>
    </section>
  );
}

/* ── projects: one row each, the work in a strip you can drag ──────────── */

const PROJECTS = [
  {
    slug: "thermiq",
    name: "ThermiQ",
    text: "Brend, sajt za hiljade proizvoda i SEO za ThermiQ, prodavca opreme za grejanje i klimatizaciju.",
    result:
      "Od kataloga koji niko ne nalazi do 2.836 poseta iz pretrage za 91 dan.",
    extra: [
      "/cases/thermiq/brend-boje-1920x1080.webp",
      "/cases/thermiq/brend-primena-postovi-i-storiji-1920x1080.webp",
    ],
  },
  {
    slug: "elektromil",
    name: "ElektroMil",
    text: "Sajt od nule i lokalni SEO za ElektroMil, električara iz Niša koji je deset godina radio samo na preporuci.",
    result: "Od preporuke do najvećeg izvora upita za tri meseca.",
  },
  {
    slug: "moler-nis",
    name: "Moler Niš",
    text: "Sajt sa stranicom za svaku uslugu i lokalni SEO za Moler Niš, firmu za molerske i fasadne radove.",
    result: "Od firme bez sajta do prvog mesta na Google-u za tri meseca.",
  },
  {
    slug: "servis-klime-nis",
    name: "Servis Klime Niš",
    text: "Sajt sa cenom na svakoj stranici usluge i lokalni SEO za Servis Klime Niš.",
    result: "Sajt koji razdvaja kvar od kupovine.",
  },
];

function Strip({ p, client }) {
  const outer = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cx = useSpring(x, { stiffness: 500, damping: 40 });
  const cy = useSpring(y, { stiffness: 500, damping: 40 });
  const [hover, setHover] = useState(false);
  const move = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = outer.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const metrics = client?.metrics ?? [];
  return (
    <div
      ref={outer}
      className={s.strip}
      onPointerMove={move}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <motion.div
        className={s.stripTrack}
        drag="x"
        dragConstraints={outer}
        dragElastic={0.06}
        dragTransition={{ power: 0.25, timeConstant: 260 }}
      >
        <figure className={s.tileWide}>
          <img
            src={`/novi/${p.slug}-1.webp`}
            alt={`Sajt ${p.name}, naslovna`}
            draggable="false"
          />
        </figure>
        <div className={s.tileStat}>
          <span className={s.tileLabel}>Rezultat</span>
          <b>{p.result}</b>
          <span className={s.tileFoot}>{p.name}</span>
        </div>
        <figure className={s.tileWide}>
          <img
            src={`/novi/${p.slug}-2.webp`}
            alt={`Sajt ${p.name}, usluge`}
            draggable="false"
          />
        </figure>
        <figure className={s.tilePhone}>
          <img
            src={`/novi/${p.slug}-m.webp`}
            alt={`Sajt ${p.name} na telefonu`}
            draggable="false"
          />
        </figure>
        {metrics.slice(0, 2).map((m, i) => (
          <div
            key={m.label}
            className={s.tileNumber}
            data-tone={i ? "lime" : "blue"}
          >
            <b>{m.value}</b>
            <span>{m.label}</span>
          </div>
        ))}
        <figure className={s.tileWide}>
          <img
            src={`/novi/${p.slug}-3.webp`}
            alt={`Sajt ${p.name}, detalj`}
            draggable="false"
          />
        </figure>
        {(p.extra ?? []).map((src) => (
          <figure key={src} className={s.tileWide}>
            <img src={src} alt={`Brend knjiga ${p.name}`} draggable="false" />
          </figure>
        ))}
      </motion.div>
      <motion.span
        className={s.dragCursor}
        style={{ x: cx, y: cy }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        aria-hidden="true"
      >
        Prevucite
      </motion.span>
    </div>
  );
}

function Projects({ clients }) {
  return (
    <section className={s.projects} id="projekti" aria-label="Projekti">
      {PROJECTS.map((p) => {
        const client = clients.find((c) => c.slug === p.slug);
        return (
          <article key={p.slug} className={s.projectRow}>
            <Rise className={s.projectHead}>
              <div>
                <h3 className={s.display3}>{p.name}</h3>
                <p>{p.text}</p>
              </div>
              <a href={`/projects/${p.slug}`} className={s.pillBtn}>
                Pogledajte projekat <i aria-hidden="true" />
              </a>
            </Rise>
            <Strip p={p} client={client} />
          </article>
        );
      })}
      <Rise className={s.projectsAll}>
        <a href="/projects" className={s.textLink}>
          Svi projekti <ArrowUpRight size={16} />
        </a>
      </Rise>
    </section>
  );
}

/* ── services ─────────────────────────────────────────────────────────── */

const SERVICES = [
  {
    title: "Plaćeno oglašavanje",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    cta: "Pokrenite kampanje",
    href: "/novi/usluge/placeno-oglasavanje",
    Art: TargetSticker,
  },
  {
    title: "SEO",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    cta: "Rastite u pretrazi",
    href: "/#usluge",
    Art: SeoSticker,
  },
  {
    title: "Web dizajn i razvoj",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    cta: "Isplanirajte sajt",
    href: "/#usluge",
    Art: WebSticker,
  },
  {
    title: "Društvene mreže",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    cta: "Sadržaj u stilu brenda",
    href: "/#usluge",
    Art: SocialSticker,
  },
  {
    title: "Brend i identitet",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    cta: "Izgradite brend",
    href: "/#usluge",
    Art: BrandSticker,
  },
];

function Services() {
  return (
    <section className={s.services} id="usluge" aria-labelledby="usluge-naslov">
      <div className={s.servicesHead}>
        <Lines as="h2" lines={["Usluge"]} className={s.display2} />
        <Rise as="p" className={s.lead}>
          Od brenda i sajta do oglasa, SEO-a i društvenih mreža: sve što vašem
          biznisu treba da raste na internetu, na jednom mestu.
        </Rise>
      </div>
      <div className={s.serviceGrid}>
        {SERVICES.map((x, i) => (
          <Rise key={x.title} i={i % 3} className={s.serviceCard}>
            <a href={x.href}>
              <motion.span
                className={s.serviceArt}
                whileHover={{ rotate: -6, y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                <x.Art size="100%" />
              </motion.span>
              <h3 className={s.display4}>{x.title}</h3>
              <p>{x.body}</p>
              <span className={s.pillBtn}>
                {x.cta} <i aria-hidden="true" />
              </span>
            </a>
          </Rise>
        ))}
      </div>
    </section>
  );
}

function Logos({ clients }) {
  const local = [
    { src: thermiqLogo.src, name: "ThermiQ" },
    { src: elektromilLogo.src, name: "ElektroMil" },
    { src: primaLogo.src, name: "Prima Dental" },
    { src: startupsLogo.src, name: "Startups.rs" },
  ];
  const cms = clients
    .filter(
      (c) =>
        c.logo &&
        !local.some((l) => l.name.toLowerCase() === c.name.toLowerCase()),
    )
    .map((c) => ({ src: c.logo, name: c.name, label: true }));
  return (
    <section className={s.logos} aria-label="Klijenti">
      <Rise as="span" className={s.eyebrow}>
        Izabrali su Digitl
      </Rise>
      <ul>
        {[...local, ...cms].map((l, i) => (
          <Rise as="li" key={l.name} i={i % 6}>
            <img src={l.src} alt={l.name} />
            {l.label ? <span>{l.name}</span> : null}
          </Rise>
        ))}
      </ul>
    </section>
  );
}

/* ── ways to work together ────────────────────────────────────────────── */

const WAYS = [
  {
    name: "Brend",
    items: [
      "Strategija i pozicioniranje",
      "Logo i vizuelni identitet",
      "Brend knjiga",
      "Šabloni za objave",
    ],
    price: "Projekat po fiksnoj ceni",
  },
  {
    name: "Sajt",
    items: [
      "Dizajn po meri",
      "Izrada sajta ili online prodavnice",
      "Kalkulatori i alati po meri",
      "Praćenje upita od prvog dana",
      "Održavanje i podrška",
    ],
    price: "Projekat po fiksnoj ceni",
  },
  {
    name: "Marketing",
    items: [
      "Google Ads i Meta oglasi",
      "SEO i pisanje sadržaja",
      "Vođenje društvenih mreža",
      "Nedeljna optimizacija",
      "Mesečni izveštaj",
    ],
    price: "Mesečna saradnja",
  },
];

function Ways() {
  const { openBooking } = useApp();
  return (
    <section className={s.ways} id="saradnja" aria-labelledby="saradnja-naslov">
      <Lines
        as="h2"
        lines={["Kako možemo da sarađujemo"]}
        className={`${s.display2} ${s.center}`}
      />
      <div className={s.waysGrid}>
        {WAYS.map((w, i) => (
          <Rise key={w.name} i={i} className={s.wayCard}>
            <h3>{w.name}</h3>
            <ul>
              {w.items.map((it) => (
                <li key={it}>
                  <span aria-hidden="true">✦</span>
                  {it}
                </li>
              ))}
            </ul>
            <div className={s.wayFoot}>
              <b className={s.display4}>{w.price}</b>
              <small>Ponudu dobijate posle razgovora od 30 minuta.</small>
              <div className={s.wayBtns}>
                <Btn
                  variant="accent"
                  size="sm"
                  onClick={() => openBooking(w.name)}
                >
                  Zakažite razgovor
                </Btn>
                <a href={`mailto:${CONTACT.email}`} className={s.textLink}>
                  Pišite nam
                </a>
              </div>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
}

export default function NoviHome({ clients, fonts }) {
  return (
    <Shell fonts={fonts}>
      <Hero />
      <Projects clients={clients} />
      <section className={s.statementWrap} aria-label="Šta radimo">
        <Statement
          className={s.statement}
          text="Gradimo brendove koji se izdvajaju, sajtove koji prodaju i kampanje koje dovode kupce. Od pretrage i oglasa do društvenih mreža, sve što vaš biznis traži, na jednom mestu."
        />
      </section>
      <Services />
      <Logos clients={clients} />
      <Reviews />
      <Ways />
    </Shell>
  );
}
