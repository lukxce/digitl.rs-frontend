"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import k from "./booking.module.css";
import { CONTACT } from "./content";
import { Check, Clock, Mail, Phone, Video, X } from "./icons";
import { Btn, EASE, useApp } from "./ui";

/* Everything the reader sees, in one place, so the English site only swaps
   this block. */
const T = {
  locale: "sr-Latn-RS",
  label: "Besplatan prvi razgovor",
  title: "Zakažite razgovor.",
  text: "Pogledamo brojeve i kažemo vam šta je prioritet, a šta može da čeka.",
  minutes: "30 minuta",
  either: "Video poziv ili telefon",
  write: "Radije pišete?",
  day: "Dan",
  time: "Vreme",
  zone: (tz) =>
    tz === "Europe/Belgrade"
      ? "Vreme je po Beogradu."
      : `Vreme je prikazano po vašoj vremenskoj zoni (${tz}).`,
  how: "Kako vam odgovara",
  video: "Video poziv",
  phone: "Telefon",
  name: "Ime",
  email: "Mejl",
  tel: "Telefon",
  telNote: "za poziv telefonom",
  note: "O čemu biste pričali",
  optional: "nije obavezno",
  notePlaceholder: "Na primer: želimo više upita sa Google-a",
  nothing: "Izaberite dan i vreme.",
  at: "u",
  submit: "Zakažite termin",
  sending: "Šaljem…",
  doneTitle: "Termin je poslat",
  doneText: "Javljamo se na",
  doneText2: "da potvrdimo termin.",
  close: "Zatvori",
  errSlot: "Izaberite dan i vreme.",
  errEmail: "Upišite mejl na koji možemo da odgovorimo.",
  errTel: "Upišite broj na koji da vas pozovemo.",
  errSend:
    "Zahtev nije poslat. Pokušajte ponovo za minut, ili pišite na hello@digitl.rs.",
  // the message we receive
  head: "Zakazivanje razgovora (digitl.rs)",
  msg: {
    slot: "Termin",
    ours: "Beograd",
    theirs: "Kod njih",
    how: "Kako",
    name: "Ime",
    tel: "Telefon",
    topic: "Tema",
    plan: "Plan sa sajta",
    note: "Poruka",
  },
  id: "zakazi-naslov",
};

// Our working hours, on Belgrade time. Ten working days, from tomorrow.
const ZONE = "Europe/Belgrade";
const HOURS = [10, 11, 12, 13, 14, 15, 16];
const DAYS = 10;

/** Minutes the zone is ahead of UTC at a given instant. */
function offset(date, timeZone) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return (asUtc - Math.floor(date.getTime() / 60000) * 60000) / 60000;
}

/** The instant of a Belgrade wall-clock hour on a Belgrade date. */
function belgrade(y, m, d, h) {
  const guess = new Date(Date.UTC(y, m, d, h));
  return new Date(guess.getTime() - offset(guess, ZONE) * 60000);
}

/** The next working days in Belgrade, each with its hours as instants. */
function workingDays() {
  const now = new Date();
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(now)
      .map((x) => [x.type, x.value]),
  );
  const out = [];
  let day = new Date(Date.UTC(+p.year, +p.month - 1, +p.day));
  while (out.length < DAYS) {
    day = new Date(day.getTime() + 86400000);
    const wd = day.getUTCDay();
    if (wd === 0 || wd === 6) continue;
    const [y, m, d] = [
      day.getUTCFullYear(),
      day.getUTCMonth(),
      day.getUTCDate(),
    ];
    out.push({
      key: `${y}-${m + 1}-${d}`,
      date: belgrade(y, m, d, 12),
      slots: HOURS.map((h) => belgrade(y, m, d, h)),
    });
  }
  return out;
}

const fmt = (date, opts, tz) =>
  new Intl.DateTimeFormat(T.locale, { ...opts, timeZone: tz }).format(date);
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export default function Booking() {
  const { booking, closeBooking, plan } = useApp();
  const open = Boolean(booking);
  const lenis = useLenis();

  const [days, setDays] = useState([]);
  const [tz, setTz] = useState(ZONE);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState(null);
  const [how, setHow] = useState("video");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [note, setNote] = useState("");
  const [company, setCompany] = useState("");
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  const dialog = useRef(null);
  const opener = useRef(null);

  // a fresh calendar every time it opens; the page stays still behind it
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    setDays(workingDays());
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || ZONE);
    setDay(0);
    setSlot(null);
    setState("idle");
    setError("");
    lenis?.stop();
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => {
      dialog.current?.querySelector("[data-first]")?.focus();
    }, 60);
    return () => {
      clearTimeout(t);
      html.style.overflow = before;
      lenis?.start();
      opener.current?.focus?.();
    };
  }, [open, lenis]);

  // Escape closes; Tab stays inside the dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeBooking();
      if (e.key !== "Tab" || !dialog.current) return;
      const f = [
        ...dialog.current.querySelectorAll(
          "button:not([disabled]), a[href], input:not([tabindex='-1']), textarea",
        ),
      ];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeBooking]);

  const picked = slot !== null && days[day] ? days[day].slots[slot] : null;
  const when = picked
    ? cap(
        `${fmt(picked, { weekday: "long", day: "numeric", month: "long" }, tz)} ${T.at} ${fmt(picked, { hour: "2-digit", minute: "2-digit" }, tz)}`,
      )
    : null;

  async function submit(e) {
    e.preventDefault();
    if (!picked) return setError(T.errSlot);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError(T.errEmail);
    if (how === "phone" && tel.trim().length < 6) return setError(T.errTel);
    setError("");
    setState("sending");
    const m = T.msg;
    const ours = `${fmt(picked, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, ZONE)} ${T.at} ${fmt(picked, { hour: "2-digit", minute: "2-digit" }, ZONE)} (${m.ours})`;
    const text = [
      T.head,
      `${m.slot}: ${ours}`,
      tz !== ZONE ? `${m.theirs}: ${when} (${tz})` : null,
      `${m.how}: ${how === "phone" ? T.phone : T.video}`,
      name.trim() ? `${m.name}: ${name.trim()}` : null,
      tel.trim() ? `${m.tel}: ${tel.trim()}` : null,
      booking?.topic ? `${m.topic}: ${booking.topic}` : null,
      plan ? `${m.plan}: ${plan.answers.join(" | ")}` : null,
      note.trim() ? `${m.note}: ${note.trim()}` : null,
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
      setError(T.errSend);
    }
  }

  return (
    <AnimatePresence>
      {open
        ? <motion.div
            className={k.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeBooking();
            }}
            data-lenis-prevent
          >
            <motion.div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={T.id}
              className={k.dialog}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <button
                type="button"
                className={k.close}
                onClick={closeBooking}
                aria-label={T.close}
              >
                <X size={18} />
              </button>

              <div className={k.side}>
                <span className={k.glyph} aria-hidden="true" />
                <span className={k.label}>{T.label}</span>
                <h2 id={T.id} className={k.title}>
                  {T.title}
                </h2>
                <p className={k.text}>{T.text}</p>
                <ul className={k.facts}>
                  <li>
                    <Clock size={16} /> {T.minutes}
                  </li>
                  <li>
                    <Video size={16} /> {T.either}
                  </li>
                </ul>
                <div className={k.chosen} aria-live="polite">
                  {when
                    ? <>
                        <span className={k.dot} />
                        {when}
                      </>
                    : <span className={k.muted}>{T.nothing}</span>}
                </div>
                <a className={k.write} href={`mailto:${CONTACT.email}`}>
                  <Mail size={15} /> {T.write} <b>{CONTACT.email}</b>
                </a>
              </div>

              <div className={k.main}>
                <AnimatePresence mode="wait" initial={false}>
                  {state === "done"
                    ? <motion.div
                        key="done"
                        className={k.done}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        role="status"
                      >
                        <span className={k.doneMark}>
                          <Check size={26} strokeWidth={3} />
                        </span>
                        <h3>{T.doneTitle}</h3>
                        <p className={k.doneWhen}>{when}</p>
                        <p>
                          {T.doneText} <b>{email.trim()}</b> {T.doneText2}
                        </p>
                        <Btn
                          variant="ink"
                          size="sm"
                          arrow={false}
                          onClick={closeBooking}
                        >
                          {T.close}
                        </Btn>
                      </motion.div>
                    : <motion.form
                        key="form"
                        className={k.form}
                        onSubmit={submit}
                        exit={{ opacity: 0 }}
                        noValidate
                      >
                        <div className={k.group}>
                          <span className={k.groupLabel}>{T.day}</span>
                          <div className={k.days}>
                            {days.map((d, i) => (
                              <button
                                key={d.key}
                                type="button"
                                data-first={i === 0 ? "" : undefined}
                                className={`${k.day} ${i === day ? k.on : ""}`}
                                aria-pressed={i === day}
                                onClick={() => {
                                  setDay(i);
                                  setSlot(null);
                                }}
                              >
                                <em>{fmt(d.date, { weekday: "short" }, tz)}</em>
                                <b>{fmt(d.date, { day: "numeric" }, tz)}</b>
                                <em>{fmt(d.date, { month: "short" }, tz)}</em>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={k.group}>
                          <span className={k.groupLabel}>{T.time}</span>
                          <div className={k.times}>
                            {(days[day]?.slots ?? []).map((s, i) => (
                              <button
                                key={s.getTime()}
                                type="button"
                                className={`${k.time} ${i === slot ? k.on : ""}`}
                                aria-pressed={i === slot}
                                onClick={() => setSlot(i)}
                              >
                                {fmt(
                                  s,
                                  { hour: "2-digit", minute: "2-digit" },
                                  tz,
                                )}
                              </button>
                            ))}
                          </div>
                          <span className={k.micro}>{T.zone(tz)}</span>
                        </div>

                        <div className={k.group}>
                          <span className={k.groupLabel}>{T.how}</span>
                          <div className={k.hows}>
                            {[
                              ["video", T.video, Video],
                              ["phone", T.phone, Phone],
                            ].map(([id, label, Icon]) => (
                              <button
                                key={id}
                                type="button"
                                className={`${k.how} ${how === id ? k.on : ""}`}
                                aria-pressed={how === id}
                                onClick={() => setHow(id)}
                              >
                                <Icon size={16} /> {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className={k.fields}>
                          <label className={k.field}>
                            <span>{T.name}</span>
                            <input
                              type="text"
                              autoComplete="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </label>
                          <label className={k.field}>
                            <span>{T.email}</span>
                            <input
                              type="email"
                              autoComplete="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </label>
                          {how === "phone"
                            ? <label className={`${k.field} ${k.wide}`}>
                                <span>
                                  {T.tel} <em>{T.telNote}</em>
                                </span>
                                <input
                                  type="tel"
                                  autoComplete="tel"
                                  value={tel}
                                  onChange={(e) => setTel(e.target.value)}
                                />
                              </label>
                            : null}
                          <label className={`${k.field} ${k.wide}`}>
                            <span>
                              {T.note} <em>{T.optional}</em>
                            </span>
                            <input
                              type="text"
                              placeholder={T.notePlaceholder}
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                            />
                          </label>
                          <input
                            type="text"
                            name="company"
                            tabIndex={-1}
                            autoComplete="off"
                            className={k.honeypot}
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            aria-hidden="true"
                          />
                        </div>

                        {error
                          ? <p className={k.error} role="alert">
                              {error}
                            </p>
                          : null}

                        <Btn
                          type="submit"
                          variant="accent"
                          className={k.submit}
                          disabled={state === "sending"}
                        >
                          {state === "sending" ? T.sending : T.submit}
                        </Btn>
                      </motion.form>}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        : null}
    </AnimatePresence>
  );
}
