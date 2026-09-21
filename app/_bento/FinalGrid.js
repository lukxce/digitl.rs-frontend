"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  formatDate,
  useHorizontalScroll,
} from "./kit";
import SistemDiagram from "./SistemDiagram";
import s from "./final.module.css";

/**
 * The final concept: "jedan sistem" and "pre / posle" merged into one
 * left-to-right story. Chapters are numbered so the order is explicit, and
 * the page warms from grey to blue as you move through it — the wash is
 * bound to scroll progress, so reaching the end IS the transformation.
 *
 * Each client appears exactly once, with its before and after in the same
 * card, which is what stopped the two concepts repeating each other.
 */

const ROLES = [
  [IconProduct, "Oglašavanje", "Donosi saobraćaj danas."],
  [IconStrategy, "SEO", "Gradi saobraćaj koji ne plaćate."],
  [IconWeb, "Web", "Pretvara taj saobraćaj u upite."],
  [IconMotion, "Mreže", "Drži brend prisutnim između kupovina."],
  [IconBrand, "Brend", "Čini da sve ostalo košta manje."],
];

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i odluke o sledećem koraku."],
];

const ASK = [
  "Zašto vam Google Ads troši budžet na sopstveni brend",
  "Da li vam treba SEO ili samo brži sajt",
  "Koliko vas stvarno košta jedan upit",
  "Zašto konkurent sa gorim sajtom rangira bolje",
  "Da li se Instagram isplati za vaš biznis",
  "Šta je „dobar“ CPA u vašoj kategoriji",
  "Zašto saobraćaj raste, a prodaja ne",
  "Kada ugasiti kampanju, a kada je pustiti",
  "Zašto je jeftiniji klik često skuplji klijent",
];

const NECE_SE_CUTI = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
  "digitalna transformacija",
  "out of the box",
  "ekosistem rešenja",
];

/* ── chapters ─────────────────────────────────────────────── */

function Chapter({ n, title, children, width }) {
  return (
    <section className={s.chapter} style={width ? { "--w": width } : undefined}>
      <header className={s.chapterHead}>
        <span className={s.chapterNum}>{n}</span>
        <span className={s.chapterTitle}>{title}</span>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

/* ── playful tiles ────────────────────────────────────────── */

function AskCard() {
  const [i, setI] = useState(0);
  return (
    <article className={`${s.card} ${s.ask}`}>
      <span className={s.eyebrow}>Pitajte nas o</span>
      <p className={s.askText}>{ASK[i]}</p>
      <button
        type="button"
        className={s.askMore}
        onClick={() => setI((v) => (v + 1) % ASK.length)}
      >
        Još jedno
      </button>
    </article>
  );
}

function BuzzCard() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % NECE_SE_CUTI.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <article className={`${s.card} ${s.buzz}`}>
      <span className={s.eyebrow}>Nećete čuti od nas</span>
      <p className={s.buzzWord} key={NECE_SE_CUTI[i]}>
        {NECE_SE_CUTI[i]}
      </p>
      <span className={s.buzzNote}>Ni na jednom sastanku. Obećavamo.</span>
    </article>
  );
}

function ClockCard() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const read = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Belgrade",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
      setNow({ hh: get("hour"), mm: get("minute"), h: Number(get("hour")) });
    };
    read();
    const id = setInterval(read, 15_000);
    return () => clearInterval(id);
  }, []);

  const line =
    now == null
      ? ""
      : now.h < 8
        ? "Prerano. Kampanje ipak rade."
        : now.h < 17
          ? "Radimo. Javite se."
          : now.h < 22
            ? "Još uvek gledamo izveštaje."
            : "Spavamo. Google Ads ne.";

  return (
    <article className={`${s.card} ${s.clock}`}>
      <span className={s.eyebrow}>Srbija · GMT+2</span>
      <p className={s.clockTime} suppressHydrationWarning>
        {now ? `${now.hh}:${now.mm}` : "--:--"}
      </p>
      <span className={s.clockNote}>{line}</span>
    </article>
  );
}

/* ── contact ──────────────────────────────────────────────── */

function ContactCard() {
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
    idle: "Stigli ste do kraja. To je više nego što dobije većina sajtova.",
    invalid: "Ta adresa ne izgleda ispravno.",
    empty: "Napišite nešto. Bilo šta.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <article className={`${s.card} ${s.contact}`} id="kontakt">
      <span className={s.eyebrowLight}>Vaš red</span>
      <p className={s.contactTitle}>Gde ste vi sada?</p>
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
          rows={2}
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
      </form>
      <p
        className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
      <div className={s.direct}>
        <a href={`mailto:${CONTACT.email}`}>
          <MailIcon />
          {CONTACT.email}
        </a>
        <a href={`tel:${CONTACT.tel}`}>
          <PhoneIcon />
          {CONTACT.phone}
        </a>
      </div>
    </article>
  );
}

/* ── the page ─────────────────────────────────────────────── */

export default function FinalGrid({ pairs = [], articles = [] }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  useHorizontalScroll(trackRef, stageRef);
  const posts = articles.slice(0, 2);

  return (
    <div className={s.stage} ref={stageRef} data-bento>
      <div className={s.wash} aria-hidden />

      <header className={s.bar}>
        <Image
          src="/digitl-logo.png"
          alt="digitl"
          width={84}
          height={23}
          className={s.logo}
          priority
        />
        <span className={s.hint}>
          Prevucite udesno
          <span className={s.hintArrow} aria-hidden>
            <ArrowIcon size={13} />
          </span>
        </span>
      </header>

      <div className={s.track} ref={trackRef}>
        {/* 01 ─ the promise */}
        <Chapter n="01" title="Obećanje" width="380px">
          <article className={`${s.card} ${s.intro}`}>
            <h1 className={s.introTitle}>
              Marketing koji donosi <em>prave</em> rezultate.
            </h1>
            <p className={s.introBody}>
              Ne meni nepovezanih usluga. Pet kanala koji se hrane jedan drugim
              i mere se na istom mestu.
            </p>
            <a className={s.introCta} href="#kontakt">
              Zakažite razgovor
              <span className={s.introCtaIcon}>
                <ArrowIcon size={13} />
              </span>
            </a>
          </article>
        </Chapter>

        {/* 02 ─ the system, drawn */}
        <Chapter n="02" title="Jedan sistem" width="720px">
          <article className={`${s.card} ${s.diagramCard}`}>
            <SistemDiagram styles={s} />
          </article>
          <div className={s.roleRow}>
            {ROLES.map(([Icon, title, role]) => (
              <span key={title} className={s.role}>
                <span className={s.roleIcon} aria-hidden>
                  <Icon />
                </span>
                <span className={s.roleTitle}>{title}</span>
                <span className={s.roleNote}>{role}</span>
              </span>
            ))}
          </div>
        </Chapter>

        {/* 03 ─ the turn */}
        <Chapter n="03" title="Prekretnica" width="250px">
          <article className={`${s.card} ${s.pivot}`}>
            <span className={s.pivotMark} aria-hidden />
            <p className={s.pivotText}>
              Svaki klijent je došao iz <strong>istog mesta</strong>.
            </p>
            <p className={s.pivotNote}>
              Godine zanata, nula tragova na internetu.
            </p>
          </article>
        </Chapter>

        {/* 04 ─ before and after, one card per client */}
        <Chapter
          n="04"
          title="Pre i posle"
          width={pairs.length > 2 ? "760px" : "380px"}
        >
          <div className={s.pairGrid}>
            {pairs.map((p) => (
              <a key={p.slug} href={p.href} className={`${s.card} ${s.pair}`}>
                <span className={s.pairClient}>{p.client}</span>

                <span className={s.pairBefore}>
                  <span className={s.pairTag}>Pre</span>
                  <span className={s.pairText}>{p.before}</span>
                </span>

                <span className={s.pairRule} aria-hidden />

                <span className={s.pairAfter}>
                  <span className={s.pairTagAfter}>Posle</span>
                  <span className={s.metricRow}>
                    {p.after.map((m) => (
                      <span key={m.label} className={s.metric}>
                        <span className={s.metricValue}>{m.value}</span>
                        <span className={s.metricLabel}>{m.label}</span>
                      </span>
                    ))}
                  </span>
                </span>

                <span className={s.pairArrow}>
                  <ArrowIcon size={13} />
                </span>
              </a>
            ))}
          </div>
        </Chapter>

        {/* 05 ─ how */}
        <Chapter n="05" title="Kako radimo" width="330px">
          <article className={`${s.card} ${s.process}`}>
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
          </article>
        </Chapter>

        {/* 06 ─ the human bit */}
        <Chapter n="06" title="Sitnice" width="520px">
          <div className={s.funGrid}>
            <AskCard />
            <ClockCard />
            <BuzzCard />
          </div>
        </Chapter>

        {/* 07 ─ writing */}
        <Chapter n="07" title="Blog" width="300px">
          <div className={s.postCol}>
            {posts.map((a) => (
              <a
                key={a.slug}
                href={`/journal/${a.slug}`}
                className={`${s.card} ${s.post}`}
              >
                <span className={s.postTitle}>{a.title}</span>
                <span className={s.postFoot}>
                  <span className={s.postDate}>
                    {formatDate(a.publishedAt)}
                  </span>
                  <span className={s.round}>
                    <ArrowIcon />
                  </span>
                </span>
              </a>
            ))}
            <a href="/journal" className={`${s.card} ${s.allPosts}`}>
              Svi tekstovi
              <span className={s.round}>
                <ArrowIcon />
              </span>
            </a>
          </div>
        </Chapter>

        {/* 08 ─ over to you */}
        <Chapter n="08" title="Kontakt" width="340px">
          <ContactCard />
        </Chapter>
      </div>
    </div>
  );
}
