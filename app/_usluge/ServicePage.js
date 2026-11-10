"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import b from "../_home/base.module.css";
import { SERVICES } from "../_home/content";
import { CARDS } from "../_home/HeroShowcase";
import { ArrowRight, ArrowUpRight, Plus } from "../_home/icons";
import x from "../_home/sections.module.css";
import { Btn, EASE, Reveal, useApp } from "../_home/ui";
import ReportSample from "./ReportSample";
import Rich from "./Rich";
import { STICKERS } from "./Stickers";
import u from "./usluge.module.css";

/* One service page: the homepage's language (light page, grey and brand
   cards, the same hero card that shows the service working), calmer than
   the homepage. From the /novi test it borrows the sticker beside the
   title, the joined circles of what is included and the tilted step
   cards. All copy comes from the page's content module. */

/* the case studies' client names, for short button labels */
const CLIENTS = {
  thermiq: "ThermiQ",
  "moler-nis": "Moler Niš",
  "servis-klime-nis": "Servis Klime Niš",
  elektromil: "ElektroMil",
};

/* ── the price slot ───────────────────────────────────────────────────────
   Until Luka sets a price, the slot shows only on the local preview. */
export function Price({ price, className = "" }) {
  if (price?.from)
    return (
      <p className={`${u.price} ${className}`}>
        <span>Cena</span>
        <b>od {price.from} €</b>
      </p>
    );
  if (process.env.NODE_ENV !== "production")
    return (
      <p className={`${u.priceSlot} ${className}`}>
        Ovde ide cena „od … €“. Vidi se samo lokalno dok je ne upišete.
      </p>
    );
  return null;
}

/* ── hero ─────────────────────────────────────────────────────────────── */
function Hero({ page }) {
  const { openBooking } = useApp();
  const Sticker = STICKERS[page.service];
  const Card = CARDS.find((c) => c.id === page.service)?.Card;
  const firstCase = page.cases?.[0];
  return (
    <section className={u.hero}>
      <div className={`${b.container} ${u.heroGrid}`}>
        <div className={u.heroCopy}>
          <nav className={u.crumbs} aria-label="Putanja">
            <Link href="/">Početna</Link>
            <span aria-hidden="true">/</span>
            <Link href="/usluge">Usluge</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{page.h1}</span>
          </nav>
          <span className={b.label}>{page.label}</span>
          <h1 className={`${b.display} ${u.title}`}>
            {page.h1}{" "}
            {Sticker
              ? <motion.span
                  className={u.sticker}
                  aria-hidden="true"
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 8 }}
                  transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 14,
                    delay: 0.3,
                  }}
                  whileHover={{ rotate: -6, scale: 1.08 }}
                >
                  <Sticker size="100%" />
                </motion.span>
              : null}
          </h1>
          <p className={u.lead}>
            <Rich text={page.lead} />
          </p>
          <div className={u.ctas}>
            <Btn variant="accent" onClick={() => openBooking()}>
              Zakažite razgovor
            </Btn>
            <Btn
              variant="ghost"
              arrow={false}
              href={firstCase ? `/projects/${firstCase.slug}` : "/projects"}
            >
              {firstCase && CLIENTS[firstCase.slug]
                ? `Projekat ${CLIENTS[firstCase.slug]}`
                : "Naši projekti"}
            </Btn>
          </div>
          {page.price?.from ? <Price price={page.price} /> : null}
          {page.proof?.length
            ? <ul className={u.proof}>
                {page.proof.map((p) => (
                  <li key={p.label}>
                    <Link href={p.href}>
                      <b>{p.value}</b>
                      <span>{p.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            : null}
        </div>
        {Card
          ? <div className={u.heroCard}>
              <Card />
            </div>
          : null}
      </div>
    </section>
  );
}

/* ── what we do: the long paragraph, beside its heading ───────────────── */
function Intro({ intro }) {
  return (
    <section className={b.section}>
      <div className={`${b.container} ${u.split}`}>
        <div className={u.splitHead}>
          <span className={b.label}>Šta radimo</span>
          <h2 className={b.h2}>{intro.title}</h2>
        </div>
        <div className={u.prose}>
          {intro.body.map((p, i) => (
            <Reveal as="p" key={p.slice(0, 24)} i={i}>
              <Rich text={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── what is included: joined circles; the one you point at fills in ──── */
function Included({ data }) {
  const [on, setOn] = useState(0);
  return (
    <section className={`${b.section} ${u.included}`}>
      <div className={b.container}>
        <div className={`${b.head} ${b.headCenter}`}>
          <span className={b.label}>U usluzi</span>
          <h2 className={b.h2}>{data.title}</h2>
          {data.intro ? <p className={b.intro}>{data.intro}</p> : null}
        </div>
        <ul className={u.rings} data-n={data.items.length}>
          {data.items.map((it, i) => (
            <motion.li
              key={it.title}
              data-on={on === i ? "true" : undefined}
              tabIndex={0}
              onMouseEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
              onClick={() => setOn(i)}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 18,
                delay: i * 0.08,
              }}
            >
              <span className={u.ringIn}>
                <h3>{it.title}</h3>
                <em>{it.sub}</em>
                <p>{it.text}</p>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── how we work: tilted cards in a row ───────────────────────────────── */
function Steps({ data }) {
  return (
    <section className={`${b.section} ${b.glow} ${u.steps}`}>
      <div className={b.container}>
        <div className={b.head}>
          <span className={b.label}>Proces</span>
          <h2 className={b.h2}>{data.title}</h2>
          {data.intro ? <p className={b.intro}>{data.intro}</p> : null}
        </div>
      </div>
      <ol className={u.stepRow} data-n={data.items.length}>
        {data.items.map((s, i) => (
          <Reveal as="li" key={s.title} i={i} className={u.step}>
            <span className={u.stepNum}>
              {String(i + 1).padStart(2, "0")}/
            </span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

/* ── projects that show the service ───────────────────────────────────── */
function Cases({ cases }) {
  if (!cases?.length) return null;
  return (
    <section className={b.section}>
      <div className={b.container}>
        <div className={b.head}>
          <span className={b.label}>Projekti</span>
          <h2 className={b.h2}>Odabrani projekti</h2>
        </div>
        <div className={u.cases} data-n={cases.length}>
          {cases.map((c, i) => (
            <Reveal key={c.slug} i={i}>
              <Link href={`/projects/${c.slug}`} className={u.case}>
                <span className={u.caseImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/novi/${c.slug}-1.webp`}
                    alt={`Sajt ${c.title}`}
                    loading="lazy"
                  />
                </span>
                <span className={u.caseText}>
                  <b>{c.title}</b>
                  <em>{c.text}</em>
                </span>
                <i className={u.caseGo} aria-hidden="true">
                  <ArrowUpRight size={18} />
                </i>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── the depth: questions buyers ask before they hire ─────────────────── */
function Block({ block }) {
  if (typeof block === "string")
    return (
      <p>
        <Rich text={block} />
      </p>
    );
  if (block.list)
    return (
      <ul className={u.list}>
        {block.list.map((li) => (
          <li key={li}>
            <Rich text={li} />
          </li>
        ))}
      </ul>
    );
  if (block.visual === "report") return <ReportSample />;
  if (block.table)
    return (
      <div className={u.tableWrap}>
        <table className={u.table}>
          <thead>
            <tr>
              {block.table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((r) => (
              <tr key={r.join("|")}>
                {r.map((c, i) =>
                  i === 0
                    ? <th key={`${i}-${c}`} scope="row">
                        <Rich text={c} />
                      </th>
                    : <td key={`${i}-${c}`}>
                        <Rich text={c} />
                      </td>,
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return null;
}

function Guide({ guide, price }) {
  const { openBooking } = useApp();
  return (
    <section className={`${b.section} ${u.guide}`}>
      <div className={b.container}>
        {guide.map((g, i) => (
          <article key={g.title} className={u.guideItem}>
            <div className={u.guideHead}>
              <span className={u.guideNo}>{String(i + 1).padStart(2, "0")}</span>
              <h2>{g.title}</h2>
            </div>
            <div className={u.prose}>
              {g.body.map((blk, j) => (
                <Block
                  key={typeof blk === "string" ? blk.slice(0, 30) : `b${j}`}
                  block={blk}
                />
              ))}
            </div>
          </article>
        ))}
        {price?.note
          ? <Reveal className={u.priceCard}>
              <div>
                <span className={b.label}>Cena</span>
                <p>{price.note}</p>
              </div>
              <div className={u.priceSide}>
                <Price price={price} className={u.priceInCard} />
                <Btn variant="accent" onClick={() => openBooking()}>
                  Zatražite ponudu
                </Btn>
              </div>
            </Reveal>
          : null}
      </div>
    </section>
  );
}

/* ── the closing call ─────────────────────────────────────────────────── */
function Cta({ cta }) {
  const { openBooking } = useApp();
  return (
    <section className={u.ctaBand}>
      <div className={b.container}>
        <Reveal className={u.ctaCard}>
          <h2>{cta.title}</h2>
          <p>
            <Rich text={cta.text} />
          </p>
          <div className={u.ctas}>
            <Btn variant="white" onClick={() => openBooking()}>
              Zakažite razgovor
            </Btn>
            <Btn variant="glass" arrow={false} href="/#vas-plan">
              Tri pitanja, pola minuta
            </Btn>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── questions: the homepage's list, every answer in the page ─────────── */
function Faq({ items }) {
  const [open, setOpen] = useState(0);
  const { openBooking } = useApp();
  return (
    <section className={b.section}>
      <div className={`${b.container} ${x.faq}`}>
        <div className={x.faqSide}>
          <div className={b.head}>
            <span className={b.label}>Pitanja</span>
            <h2 className={b.h2}>Česta pitanja</h2>
            <p className={b.intro}>
              Ako vašeg pitanja nema ovde, pišite na hello@digitl.rs.
            </p>
          </div>
          <Btn variant="accent" size="sm" onClick={() => openBooking()}>
            Zakažite razgovor
          </Btn>
        </div>
        <ul className={x.faqList}>
          {items.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q}>
                <h3 className={u.faqQ}>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`pitanje-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <i className={on ? x.plusOn : ""}>
                      <Plus size={16} strokeWidth={2.4} />
                    </i>
                  </button>
                </h3>
                <motion.div
                  id={`pitanje-${i}`}
                  className={x.answer}
                  initial={false}
                  animate={
                    on
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.4, ease: EASE }}
                  aria-hidden={!on}
                >
                  <p>
                    <Rich text={f.a} />
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── the other four services ──────────────────────────────────────────── */
export function OtherServices({ current, title = "Ostale usluge" }) {
  const list = SERVICES.filter((s) => s.id !== current);
  return (
    <section className={b.section}>
      <div className={b.container}>
        <div className={b.head}>
          <span className={b.label}>Jedan sistem</span>
          <h2 className={b.h2}>{title}</h2>
          <p className={b.intro}>
            Kompletan marketing kao jedan sistem, ne meni nepovezanih usluga.
          </p>
        </div>
        <ul className={u.others}>
          {list.map((s, i) => {
            const Sticker = STICKERS[s.id];
            return (
              <Reveal as="li" key={s.id} i={i}>
                <Link href={s.page} className={u.other} data-tone={s.id}>
                  <span className={u.otherSticker} aria-hidden="true">
                    <Sticker size="100%" />
                  </span>
                  <b>{s.title}</b>
                  <em>{s.body}</em>
                  <span className={u.otherGo}>
                    Više o usluzi <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function ServicePage({ page }) {
  return (
    <>
      <Hero page={page} />
      <Intro intro={page.intro} />
      <Included data={page.included} />
      <Steps data={page.steps} />
      <Cases cases={page.cases} />
      <Guide guide={page.guide} price={page.price} />
      <Cta cta={page.cta} />
      <Faq items={page.faq} />
      <OtherServices current={page.service} />
    </>
  );
}
