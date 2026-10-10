"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import l from "./blog.module.css";
import { ArrowRight, ArrowUpRight, Check } from "./icons";
import { EASE, Head } from "./ui";

export const date = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("sr-Latn-RS", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

function Meta({ a }) {
  return (
    <span className={l.meta}>
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

export function Newsletter({ id = "home-news" }) {
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
        <h3>Budite u toku.</h3>
        <p>
          Trendovi, taktike i uvidi iz sveta marketinga koji vam pomažu da
          rastete brže, jednom do dva puta mesečno, direktno u inbox.
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
                <label className={b.srOnly} htmlFor={id}>
                  Mejl
                </label>
                <input
                  id={id}
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
    </div>
  );
}

export default function Blog({ articles }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  const more = rest.slice(0, 3);

  return (
    <section className={`${b.section} ${l.section}`} data-section="Blog">
      <div className={b.container}>
        <div className={l.top}>
          <Head
            id="blog"
            label="Najnoviji tekstovi"
            title="Blog."
            intro="Praktični uvidi o marketingu, rastu i izgradnji brendova koji se izdvajaju."
          />
          <a className={l.all} href="/journal">
            Svi tekstovi <ArrowUpRight size={15} />
          </a>
        </div>

        <div className={l.layout}>
          {/* the latest article, told like the front of a magazine */}
          <motion.a
            href={`/journal/${lead.slug}`}
            className={l.lead}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className={l.leadCover}>
              {lead.cover
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.cover} alt="" loading="lazy" />
                : null}
              <span className={l.new}>Najnovije</span>
            </span>
            <span className={l.leadBody}>
              <Meta a={lead} />
              <b className={l.leadTitle}>{lead.title}</b>
              {lead.description
                ? <span className={l.excerpt}>{lead.description}</span>
                : null}
              <span className={l.read}>
                Pročitajte tekst <ArrowRight size={15} />
              </span>
            </span>
          </motion.a>

          {/* the next ones as a reading list */}
          {more.length
            ? <div className={l.list}>
                <span className={l.listLabel}>Još sa bloga</span>
                {more.map((a, i) => (
                  <motion.a
                    key={a.slug}
                    href={`/journal/${a.slug}`}
                    className={l.item}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      delay: 0.1 + i * 0.08,
                      duration: 0.6,
                      ease: EASE,
                    }}
                  >
                    <span className={l.itemBody}>
                      <span className={l.itemMeta}>
                        <span>{date(a.publishedAt)}</span>
                        {a.minutes
                          ? <span>{a.minutes} min čitanja</span>
                          : null}
                      </span>
                      <b className={l.itemTitle}>{a.title}</b>
                      {a.description
                        ? <span className={l.itemExcerpt}>{a.description}</span>
                        : null}
                    </span>
                    <span className={l.thumb}>
                      {a.cover
                        ? // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.cover} alt="" loading="lazy" />
                        : null}
                    </span>
                  </motion.a>
                ))}
              </div>
            : null}
        </div>

        <Newsletter />
      </div>
    </section>
  );
}
