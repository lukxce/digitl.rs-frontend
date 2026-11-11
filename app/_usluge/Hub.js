"use client";

import { motion } from "motion/react";
import Link from "next/link";
import b from "../_home/base.module.css";
import { SERVICE_PAGES, SERVICES, STEPS } from "../_home/content";
import { ArrowRight } from "../_home/icons";
import { Btn, Reveal, useApp } from "../_home/ui";
import { STICKERS } from "./Stickers";
import u from "./usluge.module.css";

/* /usluge: the five services in one place, each card leading to its page,
   then how we work and where to start. Card titles, card lines, the rows
   and the steps are the homepage's approved wording. */

export const HUB = {
  title: "Usluge digitalnog marketinga",
  lead: "Vodimo oglase na Google-u i Meta mrežama, SEO, izradu sajtova, društvene mreže i brend. Možete da uzmete jednu uslugu, a najviše dobijate kad vodimo ceo marketing kao jedan sistem.",
  body: [
    "Digitl je marketing agencija koja za firme u Srbiji vodi oglase, SEO, sajt, društvene mreže i brend. Kad usluge vodimo zajedno, oglasi vode na stranice napravljene za njih, a sajt, mreže i oglasi izgledaju kao isti brend.",
    "Za svaki kanal merimo nešto konkretno: cenu po upitu kod oglasa, pozicije, posete i upite iz pretrage kod SEO-a, brzinu i stopu konverzije kod sajta. Te brojeve vidite u mesečnom izveštaju.",
  ],
};

/* the hero's right side: the five service stickers, scattered, each
   springing in once and tilting when you point at it; each leads to its
   page */
const SCATTER = [
  { id: "ads", x: "6%", y: "8%", r: -10, s: 1 },
  { id: "seo", x: "52%", y: "0%", r: 8, s: 0.92 },
  { id: "web", x: "36%", y: "44%", r: -4, s: 1.08 },
  { id: "social", x: "70%", y: "46%", r: 12, s: 0.9 },
  { id: "brand", x: "4%", y: "62%", r: 6, s: 0.88 },
];

function Scatter() {
  return (
    <div className={u.scatter}>
      {SCATTER.map((it, i) => {
        const Sticker = STICKERS[it.id];
        const service = SERVICES.find((s) => s.id === it.id);
        return (
          <motion.a
            key={it.id}
            href={service?.page}
            className={u.scatterItem}
            style={{ left: it.x, top: it.y, "--s": it.s }}
            initial={{ scale: 0, rotate: it.r - 30 }}
            animate={{ scale: 1, rotate: it.r }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 14,
              delay: 0.25 + i * 0.09,
            }}
            whileHover={{ rotate: it.r - 12, scale: 1.06 }}
          >
            <Sticker size="100%" />
            <em>{service?.footer}</em>
          </motion.a>
        );
      })}
    </div>
  );
}

export default function Hub() {
  const { openBooking } = useApp();
  return (
    <>
      <section className={u.hero}>
        <div className={`${b.container} ${u.heroGrid}`}>
          <div className={u.heroCopy}>
            <nav className={u.crumbs} aria-label="Putanja">
              <Link href="/">Početna</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Usluge</span>
            </nav>
            <span className={b.label}>Naše usluge</span>
            <h1 className={`${b.display} ${u.title}`}>{HUB.title}</h1>
            <p className={u.lead}>{HUB.lead}</p>
            <div className={u.ctas}>
              <Btn variant="accent" onClick={() => openBooking()}>
                Zakažite razgovor
              </Btn>
              <Btn variant="ghost" arrow={false} href="/projects">
                Naši projekti
              </Btn>
            </div>
          </div>
          <Scatter />
        </div>
      </section>

      <section className={b.section}>
        <div className={b.container}>
          <ul className={u.hubList}>
            {SERVICE_PAGES.map((s, i) => {
              const Sticker = STICKERS[s.id];
              return (
                <Reveal as="li" key={s.id} i={i}>
                  <Link href={s.page} className={u.hubItem} data-tone={s.id}>
                    <span className={u.hubSticker} aria-hidden="true">
                      <Sticker size="100%" />
                    </span>
                    <span className={u.hubMain}>
                      <h2>{s.title}</h2>
                      <p>{s.body}</p>
                      <span className={u.hubGo}>
                        Više o usluzi <ArrowRight size={14} />
                      </span>
                    </span>
                    <ul className={u.hubRows}>
                      {s.includes.map((row) => (
                        <li key={row}>{row}</li>
                      ))}
                    </ul>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section className={`${b.section} ${b.glow}`}>
        <div className={`${b.container} ${u.split}`}>
          <div className={u.splitHead}>
            <span className={b.label}>Jedan sistem</span>
            <h2 className={u.splitTitle}>
              Kompletan marketing kao jedan sistem, ne meni nepovezanih usluga.
            </h2>
          </div>
          <div className={u.prose}>
            {HUB.body.map((p, i) => (
              <Reveal as="p" key={p.slice(0, 24)} i={i}>
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${b.section} ${u.steps}`}>
        <div className={b.container}>
          <div className={b.head}>
            <span className={b.label}>Kako radimo</span>
            <h2 className={b.h2}>Kako izgleda raditi sa nama</h2>
            <p className={b.intro}>
              Jedan proces od prvog razgovora do mesečnog izveštaja. U svakom
              koraku znate šta radimo i šta je sledeće.
            </p>
          </div>
        </div>
        <ol className={u.stepRow} data-n={STEPS.length}>
          {STEPS.map(([title, text], i) => (
            <Reveal as="li" key={title} i={i} className={u.step}>
              <span className={u.stepNum}>
                {String(i + 1).padStart(2, "0")}/
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className={u.ctaBand}>
        <div className={b.container}>
          <Reveal className={u.ctaCard}>
            <h2>Odakle da krenete?</h2>
            <p>
              Odgovorite na tri kratka pitanja i dobićete preporuku: šta vam je
              od marketinga sada najpotrebnije i od čega je najpametnije da
              krenete.
            </p>
            <div className={u.ctas}>
              <Btn variant="white" href="/#vas-plan">
                Tri pitanja, pola minuta
              </Btn>
              <Btn variant="glass" arrow={false} onClick={() => openBooking()}>
                Zakažite razgovor
              </Btn>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
