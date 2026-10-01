"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import l from "./blog.module.css";
import { ArrowRight, ArrowUpRight, Check } from "./icons";
import { EASE, Head } from "./ui";

const date = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("sr-Latn-RS", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

function Meta({ a, light = false }) {
  return (
    <span className={`${l.meta} ${light ? l.metaLight : ""}`}>
      {a.avatar
        ? // eslint-disable-next-line @next/next/no-img-element
          <img src={a.avatar} alt="" />
        : null}
      {a.author ? <b>{a.author}</b> : null}
      <span>{date(a.publishedAt)}</span>
      {a.minutes ? <span>{a.minutes} min čitanja</span> : null}
    </span>
  );
}

function Newsletter({ covers }) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Upišite ispravan mejl.");
      return;
    }
    setError("");
    setState("sending");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email: email.trim(), company } }),
      });
      if (!res.ok) throw new Error("send");
      setState("done");
    } catch {
      setState("idle");
      setError("Prijava nije prošla. Pokušajte ponovo za minut.");
    }
  }

  return (
    <div className={l.news}>
      <div className={l.newsCopy}>
        <span className={l.newsLabel}>Newsletter</span>
        <h3>Trendovi i taktike, bez buke.</h3>
        <p>
          Jednom do dvaput mesečno, bez spama. Samo ono što smo stvarno videli
          da radi.
        </p>
        <AnimatePresence mode="wait" initial={false}>
          {state === "done"
            ? <motion.p
                key="ok"
                className={l.ok}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                role="status"
              >
                <Check size={16} strokeWidth={3} /> Prijavljeni ste. Prvi tekst
                stiže uskoro.
              </motion.p>
            : <motion.form
                key="form"
                className={l.form}
                onSubmit={submit}
                exit={{ opacity: 0 }}
                noValidate
              >
                <label className={b.srOnly} htmlFor="v5-news">
                  Mejl
                </label>
                <input
                  id="v5-news"
                  type="email"
                  autoComplete="email"
                  placeholder="vas@mejl.rs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className={l.honeypot}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  aria-hidden="true"
                />
                <button type="submit" disabled={state === "sending"}>
                  {state === "sending" ? "Šaljem…" : "Prijavite se"}
                  <ArrowRight size={16} />
                </button>
              </motion.form>}
        </AnimatePresence>
        {error
          ? <p className={l.err} role="alert">
              {error}
            </p>
          : null}
      </div>
      <div className={l.fan} aria-hidden="true">
        {covers.slice(0, 3).map((src, i) => (
          <motion.span
            key={src}
            className={l.fanCard}
            style={{ zIndex: 3 - i }}
            initial={{ rotate: 0, x: 0, y: 30, opacity: 0 }}
            whileInView={{
              rotate: [-8, 2, 10][i],
              x: [-70, 0, 70][i],
              y: [10, -10, 14][i],
              opacity: 1,
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function Blog({ articles }) {
  if (!articles.length) return null;
  const [first, ...rest] = articles;
  const side = rest.slice(0, 3);
  const covers = articles.map((a) => a.cover).filter(Boolean);

  return (
    <section className={b.section} data-section="Blog">
      <div className={b.container}>
        <div className={l.top}>
          <Head
            id="blog"
            label="Blog"
            title="Pišemo o tome šta radi."
            intro="Šta se menja u oglasima, pretrazi i prodaji u Srbiji, i šta to znači za vaš posao."
          />
          <a className={l.all} href="/journal">
            Svi tekstovi <ArrowUpRight size={15} />
          </a>
        </div>

        <div className={l.grid}>
          <motion.a
            href={`/journal/${first.slug}`}
            className={l.featured}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className={l.cover}>
              {first.cover
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={first.cover} alt="" loading="lazy" />
                : null}
              <span className={l.new}>Najnovije</span>
            </span>
            <span className={l.fBody}>
              <Meta a={first} />
              <b className={l.fTitle}>{first.title}</b>
              <span className={l.desc}>{first.description}</span>
              <span className={l.read}>
                Pročitajte <ArrowRight size={14} />
              </span>
            </span>
          </motion.a>

          <div className={l.side}>
            {side.map((a, i) => (
              <motion.a
                key={a.slug}
                href={`/journal/${a.slug}`}
                className={l.row}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
              >
                <span className={l.thumb}>
                  {a.cover
                    ? // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover} alt="" loading="lazy" />
                    : null}
                </span>
                <span className={l.rBody}>
                  <Meta a={a} />
                  <b>{a.title}</b>
                </span>
              </motion.a>
            ))}
          </div>
        </div>

        <Newsletter covers={covers} />
      </div>
    </section>
  );
}
