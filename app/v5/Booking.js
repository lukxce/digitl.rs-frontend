"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Btn, EASE, Kicker, Reveal } from "./ui";
import s from "./v5.module.css";

const TOPICS = ["Oglasi", "SEO", "Sajt", "Mreže", "Brend", "Nisam siguran"];
const TIMES = ["10:00", "12:00", "14:00", "16:00"];

/** The next five working days, built on the client so the server and the browser agree. */
function nextWorkdays(n = 5) {
  const out = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    out.push({
      key: d.toISOString().slice(0, 10),
      day: d.toLocaleDateString("sr-Latn-RS", { weekday: "short" }).replace(".", ""),
      date: d.toLocaleDateString("sr-Latn-RS", { day: "numeric", month: "numeric" }),
      long: d.toLocaleDateString("sr-Latn-RS", { weekday: "long", day: "numeric", month: "long" }),
    });
  }
  return out;
}

function Chip({ on, children, onClick }) {
  return (
    <button type="button" className={`${s.chip} ${on ? s.chipOn : ""}`} aria-pressed={on} onClick={onClick}>
      {on ? (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className={s.sumLine}>
      <span>{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.b
          key={value || "—"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {value || "—"}
        </motion.b>
      </AnimatePresence>
    </div>
  );
}

export default function Booking() {
  const [days, setDays] = useState([]);
  const [topics, setTopics] = useState([]);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => setDays(nextWorkdays()), []);

  const dayObj = days.find((d) => d.key === day);
  const slot = dayObj && time ? `${dayObj.long}, ${time}` : dayObj ? dayObj.long : time ?? "";

  async function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Upišite email na koji možemo da odgovorimo.");
      return;
    }
    setError("");
    setState("sending");
    const text = [
      "Besplatan pregled (digitl.rs/v5)",
      `Teme: ${topics.length ? topics.join(", ") : "nije izabrano"}`,
      `Željeni termin: ${slot || "nije izabran"}`,
      site.trim() ? `Sajt: ${site.trim()}` : null,
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
      setError("Zahtev nije poslat. Pokušajte ponovo za minut, ili pišite na hello@digitl.rs.");
    }
  }

  return (
    <section id="pregled" className={s.section} data-theme="light">
      <div className={s.container}>
        <div className={s.bookGrid}>
          <div className={s.bookMain}>
            <Reveal>
              <Kicker dot>Besplatan pregled</Kicker>
            </Reveal>
            <Reveal i={1} as="h2" className={s.h2}>
              30 minuta. Bez obaveze.
            </Reveal>
            <Reveal i={2} as="p" className={s.body}>
              Pogledamo vaše brojeve i kažemo šta bismo prvo promenili. Ako vam posle toga ne trebamo,
              i to je dobar ishod.
            </Reveal>

            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div
                  key="done"
                  className={s.bookDone}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span className={s.doneCheck}>
                    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h3 className={s.h3}>Zahtev je stigao.</h3>
                  <p className={s.body}>Javljamo se na {email} da potvrdimo termin.</p>
                </motion.div>
              ) : (
                <motion.form key="form" className={s.bookForm} onSubmit={submit} noValidate exit={{ opacity: 0 }}>
                  <fieldset>
                    <legend>Šta da pogledamo?</legend>
                    <div className={s.chipRow}>
                      {TOPICS.map((t) => (
                        <Chip
                          key={t}
                          on={topics.includes(t)}
                          onClick={() => setTopics((v) => (v.includes(t) ? v.filter((x) => x !== t) : [...v, t]))}
                        >
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>Kog dana?</legend>
                    <div className={s.chipRow}>
                      {days.map((d) => (
                        <Chip key={d.key} on={day === d.key} onClick={() => setDay(d.key)}>
                          <span className={s.dayChip}>
                            <b>{d.day}</b> {d.date}
                          </span>
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend>U koje vreme?</legend>
                    <div className={s.chipRow}>
                      {TIMES.map((t) => (
                        <Chip key={t} on={time === t} onClick={() => setTime(t)}>
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <div className={s.fields}>
                    <label>
                      <span>Email</span>
                      <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ime@firma.rs" />
                    </label>
                    <label>
                      <span>
                        Sajt <em>(opciono)</em>
                      </span>
                      <input type="url" inputMode="url" value={site} onChange={(e) => setSite(e.target.value)} placeholder="firma.rs" />
                    </label>
                    <label className={s.fieldWide}>
                      <span>
                        Nešto što treba da znamo <em>(opciono)</em>
                      </span>
                      <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Npr. oglasi troše, a upita nema." />
                    </label>
                    {/* honeypot — hidden from people, filled by bots */}
                    <input
                      className={s.hp}
                      tabIndex={-1}
                      autoComplete="off"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      aria-hidden="true"
                    />
                  </div>
                  <div className={s.bookActions}>
                    <button type="submit" className={`${s.btn} ${s.btn_accent} ${s.btn_lg}`} disabled={state === "sending"}>
                      <span>{state === "sending" ? "Šaljemo…" : "Pošaljite zahtev"}</span>
                    </button>
                    <p className={s.micro}>Slanje zahteva vas ni na šta ne obavezuje.</p>
                  </div>
                  {error ? (
                    <p className={s.formError} role="alert">
                      {error}
                    </p>
                  ) : null}
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <aside className={s.summary}>
            <span className={s.summaryLabel}>Vaš pregled</span>
            <SummaryLine label="Teme" value={topics.join(", ")} />
            <SummaryLine label="Termin" value={slot} />
            <SummaryLine label="Kontakt" value={email.trim()} />
            <div className={s.sumFoot}>
              <span>30 min</span>
              <span>Besplatno, bez obaveze</span>
            </div>
            <Btn href="mailto:hello@digitl.rs" variant="glass" size="md">
              Ili pišite na hello@digitl.rs
            </Btn>
          </aside>
        </div>
      </div>
    </section>
  );
}
