"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "../components/serviceIcons";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  ThemeToggle,
  formatDate,
  useReveal,
  useTheme,
} from "./kit";
import SistemDiagram from "./SistemDiagram";
import s from "./sistem.module.css";

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i konkretne odluke o sledećem koraku."],
];

const PARTS = [
  [IconProduct, "Plaćeno oglašavanje", "Donosi saobraćaj danas."],
  [IconStrategy, "SEO", "Gradi saobraćaj koji ne plaćate."],
  [IconWeb, "Web", "Pretvara taj saobraćaj u upite."],
  [IconMotion, "Društvene mreže", "Održava brend prisutnim između kupovina."],
  [IconBrand, "Brend", "Čini da sve ostalo košta manje."],
];

const FAQS = [
  [
    "Koliko brzo možemo da krenemo?",
    "Obično u roku od 1 do 2 nedelje nakon dogovora, zavisno od obima i kapaciteta.",
  ],
  [
    "Šta ako nismo sigurni šta nam treba?",
    "Zato i postoji prvi razgovor. Pogledamo brojeve i kažemo vam šta je prioritet.",
  ],
  [
    "Kompletni projekti ili pojedinačne usluge?",
    "Oba, ali najbolje radimo kao stalni partner koji vodi ceo marketing.",
  ],
  [
    "Kako izgleda komunikacija?",
    "Direktno i redovno. Radite sa ljudima koji donose odluke, ne sa account menadžerom.",
  ],
];

function Tile({ className = "", as: Tag = "div", children, ...rest }) {
  return (
    <Tag className={`${s.tile} ${className}`} data-reveal {...rest}>
      {children}
    </Tag>
  );
}

function ContactTile() {
  const [form, setForm] = useState({ email: "", message: "" });
  const [state, setState] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setState("invalid");
    if (!form.message.trim()) return setState("empty");
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setForm({ email: "", message: "" });
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Odgovaramo u roku od jednog radnog dana.",
    invalid: "Ta adresa ne izgleda ispravno.",
    empty: "Napišite nešto. Bilo šta.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <Tile className={`${s.contact} ${s.spanWide}`} id="kontakt">
      <div className={s.contactLeft}>
        <span className={s.eyebrowLight}>Prvi korak</span>
        <p className={s.contactTitle}>
          Jedan razgovor je dovoljan da vidimo ima li ovde sistema.
        </p>
        <div className={s.directRow}>
          <a className={s.directLink} href={`mailto:${CONTACT.email}`}>
            <MailIcon />
            {CONTACT.email}
          </a>
          <a className={s.directLink} href={`tel:${CONTACT.tel}`}>
            <PhoneIcon />
            {CONTACT.phone}
          </a>
        </div>
      </div>
      <form className={s.contactForm} onSubmit={submit}>
        <input
          className={s.field}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setState("idle");
          }}
        />
        <textarea
          className={s.field}
          rows={3}
          placeholder="Na čemu radite?"
          aria-label="Poruka"
          value={form.message}
          onChange={(e) => {
            setForm({ ...form, message: e.target.value });
            setState("idle");
          }}
        />
        <button className={s.send} type="submit" disabled={state === "sending"}>
          Pošaljite
          <span className={s.sendIcon}>
            <ArrowIcon />
          </span>
        </button>
        <p
          className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
        >
          {note}
        </p>
      </form>
    </Tile>
  );
}

function NewsletterTile() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    setState("sending");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) setEmail("");
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Jednom do dva puta mesečno. Bez spama.",
    invalid: "Ta adresa ne izgleda ispravno.",
    sending: "Šaljemo…",
    done: "Prijavljeni ste.",
    error: "Nije uspelo. Pokušajte ponovo.",
  }[state];

  return (
    <Tile className={s.newsletter}>
      <span className={s.eyebrow}>Budite u toku</span>
      <form className={s.subForm} onSubmit={submit}>
        <input
          className={s.subInput}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
        <button
          className={s.subSend}
          type="submit"
          disabled={state === "sending"}
          aria-label="Prijavite se"
        >
          <ArrowIcon size={15} />
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
    </Tile>
  );
}

function FaqTile() {
  const [open, setOpen] = useState(0);
  return (
    <Tile className={s.faq}>
      <span className={s.eyebrow}>Česta pitanja</span>
      <ul className={s.faqList}>
        {FAQS.map(([q, a], i) => (
          <li key={q}>
            <button
              type="button"
              className={s.faqQ}
              aria-expanded={i === open}
              onClick={() => setOpen(i === open ? -1 : i)}
            >
              <span>{q}</span>
              <span className={s.faqSign} aria-hidden>
                {i === open ? "–" : "+"}
              </span>
            </button>
            {i === open ? <p className={s.faqA}>{a}</p> : null}
          </li>
        ))}
      </ul>
    </Tile>
  );
}

export default function SistemGrid({
  articles = [],
  showcases = [],
  proof = [],
}) {
  const rootRef = useRef(null);
  const [theme, toggleTheme] = useTheme("bento-sistem-theme");
  useReveal(rootRef);

  const work = showcases.slice(0, 3);
  const posts = articles.slice(0, 2);

  return (
    <div
      className={s.stage}
      data-theme={theme ?? undefined}
      data-bento
      ref={rootRef}
    >
      <header className={s.bar}>
        <Image
          src="/digitl-logo.png"
          alt="digitl"
          width={86}
          height={24}
          className={s.logo}
          priority
        />
        <ThemeToggle
          theme={theme}
          onToggle={toggleTheme}
          className={s.themeToggle}
        />
      </header>

      <main className={s.grid}>
        {/* the argument, drawn */}
        <section className={`${s.tile} ${s.hero} ${s.spanFull}`} data-reveal>
          <div className={s.heroHead}>
            <h1 className={s.heroTitle}>
              Marketing koji donosi <em>prave</em> rezultate.
            </h1>
            <p className={s.heroBody}>
              Ne meni nepovezanih usluga. Pet kanala koji se hrane jedan drugim
              i mere se na istom mestu.
            </p>
            <a className={s.heroCta} href="#kontakt">
              Zakažite razgovor
              <span className={s.heroCtaIcon}>
                <ArrowIcon size={13} />
              </span>
            </a>
          </div>
          <div className={s.heroDiagram}>
            <SistemDiagram />
          </div>
        </section>

        {/* what each part is for — a role, not a service listing */}
        <Tile className={`${s.parts} ${s.spanWide}`}>
          <span className={s.eyebrow}>Uloga svakog dela</span>
          <ul className={s.partList}>
            {PARTS.map(([Icon, title, role]) => (
              <li key={title} className={s.partItem}>
                <span className={s.partIcon} aria-hidden>
                  <Icon />
                </span>
                <span className={s.partTitle}>{title}</span>
                <span className={s.partRole}>{role}</span>
              </li>
            ))}
          </ul>
        </Tile>

        {/* real numbers from the case studies */}
        {proof.map((p) => (
          <Tile key={`${p.client}-${p.value}`} className={s.proof}>
            <span className={s.proofValue}>{p.value}</span>
            <span className={s.proofLabel}>{p.label}</span>
            <span className={s.proofClient}>{p.client}</span>
          </Tile>
        ))}

        {work.map((card) => (
          <Tile key={card.slug} as="a" href={card.href} className={s.work}>
            {card.backgroundSrc
              ? <span className={s.workShot}>
                  <Image
                    src={card.backgroundSrc}
                    alt={card.title ?? ""}
                    fill
                    sizes="420px"
                    className={s.workImg}
                  />
                </span>
              : null}
            <span className={s.workFoot}>
              <span>
                <span className={s.workName}>
                  {card.clientName ?? card.title}
                </span>
                <span className={s.workCat}>{card.category}</span>
              </span>
              <span className={s.round}>
                <ArrowIcon />
              </span>
            </span>
          </Tile>
        ))}

        <Tile className={s.process}>
          <span className={s.eyebrow}>Kako radimo</span>
          <ol className={s.stepList}>
            {STEPS.map(([title, note], i) => (
              <li key={title} className={s.stepItem}>
                <span className={s.stepNum}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className={s.stepTitle}>{title}</span>
                  <span className={s.stepNote}>{note}</span>
                </span>
              </li>
            ))}
          </ol>
        </Tile>

        <FaqTile />

        {posts.map((a) => (
          <Tile
            key={a.slug}
            as="a"
            href={`/journal/${a.slug}`}
            className={s.post}
          >
            <span className={s.eyebrow}>Blog</span>
            <span className={s.postTitle}>{a.title}</span>
            <span className={s.postFoot}>
              <span className={s.postDate}>{formatDate(a.publishedAt)}</span>
              <span className={s.round}>
                <ArrowIcon />
              </span>
            </span>
          </Tile>
        ))}

        <NewsletterTile />
        <ContactTile />
      </main>
    </div>
  );
}
