"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import b from "./base.module.css";
import s from "./booking.module.css";
import { ArrowRight, Check, Message } from "./icons";
import { Chapter, EASE, Reveal, useApp } from "./ui";

const GOALS = [
  "Strategija i brend",
  "Oglasi",
  "SEO",
  "Sajt ili e-commerce",
  "Mreže i sadržaj",
  "Ceo marketing",
];
const BUDGETS = [
  "Do 1.000 €",
  "1.000 – 3.000 €",
  "3.000 – 10.000 €",
  "10.000 € +",
];
const STEPS = [
  {
    t: "Razgovor od 30 minuta",
    d: "Besplatno i bez obaveze. Pogledamo vaše brojeve, sajt i konkurenciju.",
  },
  {
    t: "Plan",
    d: "Kažemo šta je prioritet, šta može da čeka, i koji broj pratimo.",
  },
  {
    t: "Start za 1–2 nedelje",
    d: "Obično krećemo u roku od jedne do dve nedelje od dogovora.",
  },
];

function Chip({ on, children, onClick }) {
  return (
    <button
      type="button"
      className={`${s.chip} ${on ? s.chipOn : ""}`}
      aria-pressed={on}
      onClick={onClick}
    >
      {on ? <Check size={13} strokeWidth={3} /> : null}
      {children}
    </button>
  );
}

export default function Booking() {
  const { audit, topic } = useApp();
  const [goals, setGoals] = useState([]);
  const [budget, setBudget] = useState(null);
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [note, setNote] = useState("");
  const [attach, setAttach] = useState(true);
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (topic) setGoals((g) => (g.includes(topic) ? g : [...g, topic]));
  }, [topic]);
  useEffect(() => {
    if (audit?.host) setSite((v) => v || audit.host);
  }, [audit?.host]);

  const toggle = (g) =>
    setGoals((arr) =>
      arr.includes(g) ? arr.filter((x) => x !== g) : [...arr, g],
    );
  const report = audit?.scores
    ? `Brzina ${audit.scores.performance} · SEO ${audit.scores.seo} · Pristupačnost ${audit.scores.accessibility} · Dobre prakse ${audit.scores.bestPractices}`
    : null;

  async function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Upišite mejl na koji možemo da odgovorimo.");
      return;
    }
    setError("");
    setState("sending");
    const text = [
      "Strateški razgovor (digitl.rs/v5)",
      `Interesuje ih: ${goals.length ? goals.join(", ") : "nije izabrano"}`,
      `Mesečni budžet za marketing: ${budget ?? "nije izabran"}`,
      site.trim() ? `Sajt: ${site.trim()}` : null,
      report && attach
        ? `Provera sajta (${audit.host}, telefon): ${report}; LCP ${audit.metrics?.lcp?.display ?? "?"}`
        : null,
      audit?.error && attach
        ? `Provera sajta nije uspela (${audit.host}): ${audit.error}`
        : null,
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
    <section className={s.section} data-theme="light">
      <div className={b.container}>
        <Chapter
          n="5"
          name="Početak"
          id="pocetak"
          title={
            <>
              Sledeći krug <em>počinje razgovorom.</em>
            </>
          }
          sub="Primamo ograničen broj klijenata, da bi svaki radio direktno sa ljudima koji odlučuju. Trenutno: dva slobodna mesta."
        />

        <div className={s.grid}>
          <div className={s.side}>
            <ol className={s.steps}>
              {STEPS.map((st, i) => (
                <Reveal as="li" key={st.t} i={i}>
                  <span className={s.stepNo}>{i + 1}</span>
                  <span>
                    <b>{st.t}</b>
                    <span>{st.d}</span>
                  </span>
                </Reveal>
              ))}
            </ol>
            <Reveal i={3} className={s.note}>
              <span className={s.noteIcon}>
                <Message size={17} />
              </span>
              <p>
                <b>Radite sa ljudima koji donose odluke,</b> ne sa account
                menadžerom. Ili pišite direktno na{" "}
                <a href="mailto:hello@digitl.rs">hello@digitl.rs</a>.
              </p>
            </Reveal>
          </div>

          <div className={s.card}>
            <AnimatePresence mode="wait" initial={false}>
              {state === "done"
                ? <motion.div
                    key="done"
                    className={s.done}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    role="status"
                  >
                    <span className={s.doneMark}>
                      <Check size={28} strokeWidth={3} />
                    </span>
                    <h3>Poruka je stigla</h3>
                    <p>
                      Javljamo se na <b>{email.trim()}</b> da dogovorimo termin.
                    </p>
                  </motion.div>
                : <motion.form
                    key="form"
                    className={s.form}
                    onSubmit={submit}
                    exit={{ opacity: 0 }}
                    noValidate
                  >
                    <div className={s.group}>
                      <span className={s.groupLabel}>Šta vas zanima</span>
                      <div className={s.chips}>
                        {GOALS.map((g) => (
                          <Chip
                            key={g}
                            on={goals.includes(g)}
                            onClick={() => toggle(g)}
                          >
                            {g}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div className={s.group}>
                      <span className={s.groupLabel}>
                        Mesečni budžet za marketing <em>(okvirno)</em>
                      </span>
                      <div className={s.chips}>
                        {BUDGETS.map((g) => (
                          <Chip
                            key={g}
                            on={budget === g}
                            onClick={() => setBudget(budget === g ? null : g)}
                          >
                            {g}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <div className={s.fields}>
                      <label className={s.field}>
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
                      <label className={s.field}>
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
                      <label className={`${s.field} ${s.wide}`}>
                        <span>
                          Šta želite da postignete <em>(nije obavezno)</em>
                        </span>
                        <textarea
                          rows={2}
                          placeholder="Npr. više porudžbina do leta, uz istu cenu po kupcu."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </label>
                    </div>
                    {report || audit?.error
                      ? <label className={s.attach}>
                          <input
                            type="checkbox"
                            checked={attach}
                            onChange={(e) => setAttach(e.target.checked)}
                          />
                          <span className={s.attachBox}>
                            <Check size={12} strokeWidth={3} />
                          </span>
                          <span>
                            <b>Priložite proveru za {audit.host}</b>
                            <em>
                              {report ??
                                "Merenje nije uspelo, izmerićemo ručno."}
                            </em>
                          </span>
                        </label>
                      : null}
                    <input
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                      className={s.honeypot}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      aria-hidden="true"
                    />
                    <button
                      type="submit"
                      className={`${b.btn} ${b.btn_accent} ${b.btn_lg} ${s.submit}`}
                      disabled={state === "sending"}
                    >
                      <span>
                        {state === "sending" ? "Šaljemo…" : "Pošaljite"}
                      </span>
                      <ArrowRight size={17} />
                    </button>
                    {error
                      ? <p className={s.error} role="alert">
                          {error}
                        </p>
                      : <p className={s.micro}>
                          Slanje ne obavezuje ni na šta.
                        </p>}
                  </motion.form>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
