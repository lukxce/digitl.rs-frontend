"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import l from "./blog.module.css";
import { ArrowRight, Check } from "./icons";
import { EASE, Head } from "./ui";

export const date = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("sr-Latn-RS", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

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

/* The blog on the homepage, in the hero cards' language: white cards in a
   grey tray, the newest one large with its cover, the next three as rows,
   each key an arrow in a circle. */
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
          <a className={l.allKey} href="/journal">
            Svi tekstovi
            <i>
              <ArrowRight size={15} />
            </i>
          </a>
        </div>

        <div className={l.tray}>
          <motion.a
            href={`/journal/${lead.slug}`}
            className={l.leadCard}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className={l.leadPic}>
              {lead.cover
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={lead.cover} alt="" loading="lazy" />
                : null}
            </span>
            <span className={l.leadText}>
              <span className={l.when}>
                <span className={l.newChip}>Najnovije</span>
                {date(lead.publishedAt)}
                {lead.minutes ? ` · ${lead.minutes} min čitanja` : ""}
              </span>
              <b>{lead.title}</b>
              {lead.description ? <em>{lead.description}</em> : null}
            </span>
            <i className={l.key} aria-hidden="true">
              <ArrowRight size={18} />
            </i>
          </motion.a>

          {more.length
            ? <div className={l.rows}>
                {more.map((a, i) => (
                  <motion.a
                    key={a.slug}
                    href={`/journal/${a.slug}`}
                    className={l.rowCard}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      delay: 0.1 + i * 0.08,
                      duration: 0.6,
                      ease: EASE,
                    }}
                  >
                    <span className={l.rowPic}>
                      {a.cover
                        ? // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.cover} alt="" loading="lazy" />
                        : null}
                    </span>
                    <span className={l.rowText}>
                      <span className={l.when}>
                        {date(a.publishedAt)}
                        {a.minutes ? ` · ${a.minutes} min` : ""}
                      </span>
                      <b>{a.title}</b>
                    </span>
                    <i className={l.keySm} aria-hidden="true">
                      <ArrowRight size={15} />
                    </i>
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
