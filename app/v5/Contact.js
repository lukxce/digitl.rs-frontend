"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import b from "./base.module.css";
import c from "./contact.module.css";
import { CONTACT, SERVICES } from "./content";
import { ArrowRight, Check, Mail, Phone } from "./icons";
import { IconInstagram, IconLinkedin, IconX } from "../components/socialIcons";
import { EASE, useApp } from "./ui";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/digitl.rs",
    Icon: IconInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/digitl-rs",
    Icon: IconLinkedin,
  },
  { label: "X", href: "https://x.com/digitl_rs", Icon: IconX },
];

const TOPICS = [...SERVICES.map((s) => s.name), "Ceo marketing"];

export default function Contact() {
  const { plan, topic } = useApp();
  const [topics, setTopics] = useState([]);
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (topic) setTopics((t) => (t.includes(topic) ? t : [...t, topic]));
  }, [topic]);
  useEffect(() => {
    if (plan)
      setTopics(plan.top.map((id) => SERVICES.find((s) => s.id === id).name));
  }, [plan]);

  const toggle = (t) =>
    setTopics((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t],
    );

  async function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Upišite mejl na koji možemo da odgovorimo.");
      return;
    }
    setError("");
    setState("sending");
    const text = [
      "Prvi razgovor (digitl.rs/v5)",
      `Interesuje ih: ${topics.length ? topics.join(", ") : "nije izabrano"}`,
      site.trim() ? `Sajt: ${site.trim()}` : null,
      plan ? `Plan sa sajta: ${plan.answers.join(" | ")}` : null,
      note.trim() ? `Poruka: ${note.trim()}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { email: email.trim(), text, company } }),
      });
      if (!res.ok) throw new Error("send");
      setState("done");
    } catch {
      setState("idle");
      setError(
        "Poruka nije poslata. Pokušajte ponovo za minut, ili pišite na hello@digitl.rs.",
      );
    }
  }

  return (
    <section className={b.section} data-section="Kontakt">
      <span id="kontakt" className={b.anchor} />
      <div className={b.container}>
        <div className={c.panel}>
          <span className={c.glyph} aria-hidden="true" />
          <div className={c.copy}>
            <span className={c.label}>30 minuta, bez obaveze</span>
            <h2 className={c.title}>Besplatan prvi razgovor.</h2>
            <p className={c.text}>
              Pogledamo vaše brojeve, sajt i konkurenciju, i kažemo šta je
              prioritet, a šta može da čeka.
            </p>
            <div className={c.tiles}>
              <a className={c.tile} href={`mailto:${CONTACT.email}`}>
                <span>
                  <b>Pišite nam</b>
                  <em>{CONTACT.email}</em>
                </span>
                <Mail size={18} />
              </a>
              <a className={c.tile} href={`tel:${CONTACT.tel}`}>
                <span>
                  <b>Pozovite</b>
                  <em>{CONTACT.phone}</em>
                </span>
                <Phone size={18} />
              </a>
            </div>
            <div className={c.socials}>
              <span>Pratite nas</span>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon />
                </a>
              ))}
            </div>
            {plan
              ? <p className={c.planNote}>
                  <Check size={14} strokeWidth={3} /> Vaš plan iz tri pitanja
                  ide uz poruku.
                </p>
              : null}
          </div>

          <div className={c.card}>
            <AnimatePresence mode="wait" initial={false}>
              {state === "done"
                ? <motion.div
                    key="done"
                    className={c.done}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    role="status"
                  >
                    <span className={c.doneMark}>
                      <Check size={26} strokeWidth={3} />
                    </span>
                    <h3>Poruka je stigla</h3>
                    <p>
                      Javljamo se na <b>{email.trim()}</b> da dogovorimo termin.
                    </p>
                  </motion.div>
                : <motion.form
                    key="form"
                    className={c.form}
                    onSubmit={submit}
                    exit={{ opacity: 0 }}
                    noValidate
                  >
                    <div className={c.group}>
                      <span className={c.groupLabel}>Šta vas zanima</span>
                      <div className={c.chips}>
                        {TOPICS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`${c.chip} ${topics.includes(t) ? c.chipOn : ""}`}
                            aria-pressed={topics.includes(t)}
                            onClick={() => toggle(t)}
                          >
                            {topics.includes(t)
                              ? <Check size={13} strokeWidth={3} />
                              : null}
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={c.fields}>
                      <label className={c.field}>
                        <span>Mejl</span>
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="ime@firma.rs"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </label>
                      <label className={c.field}>
                        <span>
                          Sajt <em>(nije obavezno)</em>
                        </span>
                        <input
                          type="text"
                          inputMode="url"
                          autoComplete="url"
                          placeholder="firma.rs"
                          value={site}
                          onChange={(e) => setSite(e.target.value)}
                        />
                      </label>
                      <label className={`${c.field} ${c.wide}`}>
                        <span>
                          Poruka <em>(nije obavezno)</em>
                        </span>
                        <textarea
                          rows={3}
                          placeholder="Čime se bavite i šta biste voleli da se promeni?"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      className={c.honeypot}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      aria-hidden="true"
                    />
                    <button
                      type="submit"
                      className={`${b.btn} ${b.btn_accent} ${c.submit}`}
                      disabled={state === "sending"}
                    >
                      <span>
                        {state === "sending" ? "Šaljemo…" : "Pošaljite"}
                      </span>
                      <span className={b.arrow}>
                        <ArrowRight size={16} />
                      </span>
                    </button>
                    {error
                      ? <p className={c.error} role="alert">
                          {error}
                        </p>
                      : <p className={c.micro}>
                          Odgovaramo lično. Slanje ne obavezuje ni na šta.
                        </p>}
                  </motion.form>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
