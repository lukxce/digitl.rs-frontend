"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import b from "./base.module.css";
import s from "./booking.module.css";
import { ArrowRight, Check, Mail, Sparkle } from "./icons";
import { EASE, Honest, Kicker, Reveal, useApp } from "./ui";

const TOPICS = [
  "Ceo marketing",
  "Oglasi",
  "SEO",
  "Sajt",
  "Mreže",
  "Brend",
  "Nisam siguran",
];
const TIMES = ["10:00", "12:00", "14:00", "16:00"];

/** The next five working days, built on the client so server and browser agree. */
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
      day: d
        .toLocaleDateString("sr-Latn-RS", { weekday: "short" })
        .replace(".", ""),
      date: d.toLocaleDateString("sr-Latn-RS", {
        day: "numeric",
        month: "numeric",
      }),
      long: d.toLocaleDateString("sr-Latn-RS", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    });
  }
  return out;
}

function Chip({ on, children, onClick, small = false }) {
  return (
    <button
      type="button"
      className={`${s.chip} ${small ? s.chipSm : ""} ${on ? s.chipOn : ""}`}
      aria-pressed={on}
      onClick={onClick}
    >
      {on ? <Check size={13} strokeWidth={3} /> : null}
      {children}
    </button>
  );
}

function PlanCard({ audit }) {
  const lcp = audit?.metrics?.lcp;
  const slow = lcp?.value && lcp.value > 2500;
  const lines = [
    audit?.scores
      ? slow
        ? `Ubrzati ${audit.host} na telefonu: glavni sadržaj za ${lcp.display}, Google-ov cilj je ispod 2,5 s`
        : `${audit.host} je brz (brzina ${audit.scores.performance}). Fokus na pozicije, ne na brzinu`
      : "Ubrzati sajt na telefonu, ako kasni",
    "Posebna stranica za svaku uslugu koju želite da gurate",
    "Google profil: radno vreme, slike i kategorije",
  ];
  return (
    <div className={s.plan}>
      <div className={s.planHead}>
        <span>
          <Sparkle size={12} /> Posle razgovora dobijate plan u tri tačke
        </span>
        <Honest>
          {audit?.scores ? "Prva tačka iz vaše provere" : "Primer"}
        </Honest>
      </div>
      <ol>
        {lines.map((l, i) => (
          <motion.li
            key={l}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease: EASE }}
          >
            <span>{i + 1}</span>
            {l}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function Booking() {
  const { audit, topic } = useApp();
  const [days, setDays] = useState([]);
  const [topics, setTopics] = useState([]);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [note, setNote] = useState("");
  const [attach, setAttach] = useState(true);
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => setDays(nextWorkdays()), []);
  useEffect(() => {
    if (topic) setTopics((t) => (t.includes(topic) ? t : [...t, topic]));
  }, [topic]);
  useEffect(() => {
    if (audit?.host) setSite((v) => v || audit.host);
  }, [audit?.host]);

  const dayObj = days.find((d) => d.key === day);
  const toggle = (t) =>
    setTopics((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t],
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
    const slot = dayObj ? `${dayObj.long}${time ? `, ${time}` : ""}` : time;
    const text = [
      "Zahtev za razgovor (digitl.rs/v5)",
      `Teme: ${topics.length ? topics.join(", ") : "nije izabrano"}`,
      `Željeni termin: ${slot || "nije izabran"}`,
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
        "Zahtev nije poslat. Pokušajte ponovo za minut, ili pišite na hello@digitl.rs.",
      );
    }
  }

  return (
    <section className={b.sectionTight} data-theme="light">
      <span id="razgovor" className={b.anchor} />
      <div className={b.container}>
        <div className={s.panel} data-theme="dark">
          <Sparkle
            size={280}
            className={`${b.sparkleMark} ${b.spinSlow} ${s.spark}`}
          />
          <div className={s.copy}>
            <Reveal>
              <Kicker tone="dark">Besplatno, 30 minuta</Kicker>
            </Reveal>
            <Reveal i={1} as="h2" className={`${b.h2} ${s.title}`}>
              Zakažite razgovor i donesite svoj sajt
            </Reveal>
            <Reveal i={2} as="p" className={s.body}>
              Otvorimo vaš sajt, Google profil i konkurenciju, i kažemo šta je
              prioritet, a šta može da čeka. Razgovor ne obavezuje ni na šta.
            </Reveal>
            <Reveal i={3}>
              <PlanCard audit={audit} />
            </Reveal>
          </div>

          <div className={s.formCard}>
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
                    <h3>Zahtev je poslat</h3>
                    <p>
                      Javljamo se na <b>{email.trim()}</b> da potvrdimo termin
                      {dayObj
                        ? ` (${dayObj.long}${time ? `, ${time}` : ""})`
                        : ""}
                      .
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
                      <div className={s.groupHead}>
                        <span>Izaberite dan</span>
                        <em>30 minuta</em>
                      </div>
                      <div className={s.days}>
                        {days.map((d) => (
                          <button
                            key={d.key}
                            type="button"
                            aria-pressed={day === d.key}
                            className={`${s.day} ${day === d.key ? s.dayOn : ""}`}
                            onClick={() => setDay(d.key)}
                          >
                            <span>{d.day}</span>
                            <b>{d.date}</b>
                          </button>
                        ))}
                      </div>
                      <div className={s.times}>
                        {TIMES.map((t) => (
                          <Chip
                            key={t}
                            small
                            on={time === t}
                            onClick={() => setTime(t)}
                          >
                            {t}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <div className={s.group}>
                      <div className={s.groupHead}>
                        <span>O čemu pričamo</span>
                        <em>može više</em>
                      </div>
                      <div className={s.topics}>
                        {TOPICS.map((t) => (
                          <Chip
                            key={t}
                            small
                            on={topics.includes(t)}
                            onClick={() => toggle(t)}
                          >
                            {t}
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
                          placeholder="vi@vasafirma.rs"
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
                          placeholder="vasafirma.rs"
                          value={site}
                          onChange={(e) => setSite(e.target.value)}
                        />
                      </label>
                      <label className={`${s.field} ${s.fieldWide}`}>
                        <span>
                          Poruka <em>(nije obavezno)</em>
                        </span>
                        <textarea
                          rows={2}
                          placeholder="Čime se bavite i šta biste voleli da se promeni?"
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
                        {state === "sending" ? "Šaljemo…" : "Pošaljite zahtev"}
                      </span>
                      <ArrowRight size={17} />
                    </button>
                    {error
                      ? <p className={s.error} role="alert">
                          {error}
                        </p>
                      : <p className={s.micro}>
                          Slanje ne obavezuje ni na šta. Termin potvrđujemo
                          mejlom.
                        </p>}
                  </motion.form>}
            </AnimatePresence>
          </div>
        </div>

        <div className={s.alt}>
          <span>
            <Mail size={16} /> Radije pišete?
          </span>
          <a href="mailto:hello@digitl.rs">hello@digitl.rs</a>
        </div>
      </div>
    </section>
  );
}
