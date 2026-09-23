"use client";

import Image from "next/image";
import prima_dentalLogo from "../assets/clients/prima-dental.webp";
import thermiqLogo from "../assets/clients/thermiq.webp";
import elektromilLogo from "../assets/clients/elektromil.webp";
import startups_rsLogo from "../assets/clients/startups-rs.webp";
import locationIcon from "../assets/location.svg";
import stripeSvg from "../assets/stripe.svg";
import { useEffect, useRef, useState } from "react";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "../components/serviceIcons";
import { IconInstagram, IconLinkedin, IconX } from "../components/socialIcons";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  formatDate,
  useHorizontalScroll,
} from "./kit";
import s from "./dijagnoza.module.css";

/**
 * digitl.rs homepage concept: a short diagnostic instead of a brochure.
 *
 * Three questions decide which services are recommended; everything after
 * reacts. Type scale and card radii follow the lukxce badge grid, and the
 * small tiles are scattered into whatever vertical slack a column leaves
 * rather than clustered in one chapter.
 */

const SERVICE_LIST = [
  {
    id: "ads",
    Icon: IconProduct,
    name: "Plaćeno oglašavanje",
    role: "Saobraćaj danas.",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    feeds: "Hrani web upitima, a SEO podacima o tome šta ljudi stvarno traže.",
  },
  {
    id: "seo",
    Icon: IconStrategy,
    name: "SEO",
    role: "Saobraćaj koji ne plaćate.",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    feeds: "Snižava cenu plaćenog klika i drži upite kad se kampanja ugasi.",
  },
  {
    id: "web",
    Icon: IconWeb,
    name: "Web",
    role: "Poseta postaje upit.",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    feeds: "Bez njega svaki drugi kanal plaća za posetu koja ne postane poziv.",
  },
  {
    id: "social",
    Icon: IconMotion,
    name: "Društvene mreže",
    role: "Prisutnost između kupovina.",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    feeds: "Čini da vas kupac prepozna kad vas nađe u pretrazi ili oglasu.",
  },
  {
    id: "brand",
    Icon: IconBrand,
    name: "Brend",
    role: "Sve ostalo košta manje.",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    feeds: "Isti oglas, ista pozicija, veći procenat klikova. To je brend.",
  },
];

const SERVICES = Object.fromEntries(SERVICE_LIST.map((x) => [x.id, x]));

const QUIZ = [
  {
    id: "izvor",
    q: "Kako vas ljudi najčešće nađu?",
    options: [
      {
        id: "preporuka",
        label: "Preko preporuke",
        w: { seo: 3, ads: 2, web: 2 },
        match: "moler-nis",
        gap: "Preporuka radi dok se krug poznanstava ne istroši. Posle toga nema odakle.",
      },
      {
        id: "placeno",
        label: "Preko oglasa koje plaćamo",
        w: { seo: 3, brand: 2 },
        match: "thermiq",
        gap: "Oglasi rade dok plaćate. Onog dana kad stanete, stanu i pozivi.",
      },
      {
        id: "organski",
        label: "Nađu nas na Google-u",
        w: { ads: 3, social: 2 },
        match: "servis-klime-nis",
        gap: "To je dobra osnova, ali nemate dugme kad vam zatreba više posla ovog meseca.",
      },
      {
        id: "mreze",
        label: "Preko Instagrama i Facebooka",
        w: { seo: 3, web: 2 },
        match: "thermiq",
        gap: "Mreže vas čine poznatim. Čovek koji je spreman da kupi ipak prvo pretražuje.",
      },
      {
        id: "nista",
        label: "Iskreno, ne znam",
        w: { web: 3, seo: 2, ads: 2 },
        match: "elektromil",
        gap: "Niste jedini. Prvo što radimo jeste da se to sazna, jer bez toga je svaki dinar nagađanje.",
      },
    ],
  },
  {
    id: "sajt",
    q: "Imate li sajt i jeste li zadovoljni njime?",
    options: [
      { id: "nemamo", label: "Nemamo sajt", w: { web: 4, brand: 2 } },
      { id: "star", label: "Imamo, ali je star i spor", w: { web: 3, seo: 1 } },
      {
        id: "ok",
        label: "Izgleda dobro, ali niko ne zove",
        w: { web: 2, ads: 1 },
      },
      { id: "dobar", label: "Zadovoljni smo njime", w: { ads: 1, seo: 1 } },
    ],
  },
  {
    id: "cilj",
    q: "Šta bi vam najviše značilo za pola godine?",
    options: [
      { id: "brzo", label: "Da zvoni telefon, što pre", w: { ads: 4, web: 2 } },
      {
        id: "stabilno",
        label: "Da posao stiže i kad ne plaćamo oglase",
        w: { seo: 4, web: 1 },
      },
      {
        id: "poznatost",
        label: "Da nas ljudi znaju po imenu",
        w: { brand: 4, social: 3 },
      },
      {
        id: "sve",
        label: "Sve pomalo, ne znam odakle da krenem",
        w: { web: 2, seo: 2, ads: 2, brand: 1 },
      },
    ],
  },
];

const STEPS = [
  ["Razumevanje", "Biznis, ciljevi i dosadašnji brojevi."],
  ["Planiranje", "Prioriteti, kanali i plan rasta."],
  ["Lansiranje", "Pokrećemo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Izveštaji i odluke o sledećem koraku."],
];

/* Heights are the ones the site's own carousel uses, so each mark keeps
   its intended size instead of being squashed to a common box. */
/* The hero pill carries the site's own claim. */
const OPEN_SLOTS = 2;

/* Matching the heights made a wide wordmark read three times the size of a
   compact mark — at h=30 these ran 45px to 127px wide. Matching the AREA
   instead is what the eye actually reads as "the same size". */
const CLIENT_LOGOS = [
  { src: prima_dentalLogo, alt: "Prima Dental", w: 129, h: 29 },
  { src: thermiqLogo, alt: "ThermiQ", w: 93, h: 27 },
  { src: elektromilLogo, alt: "ElektroMil", w: 126, h: 22 },
  { src: startups_rsLogo, alt: "startups.rs", w: 110, h: 26 },
];

const SOCIALS = [
  {
    id: "ig",
    Icon: IconInstagram,
    handle: "@digitl.rs",
    href: "https://www.instagram.com/digitl.rs",
  },
  {
    id: "li",
    Icon: IconLinkedin,
    handle: "digitl",
    href: "https://www.linkedin.com/company/digitl-rs",
  },
  {
    id: "x",
    Icon: IconX,
    handle: "@digitl_rs",
    href: "https://x.com/digitl_rs",
  },
];

/* ── primitives ──────────────────────────────────────────── */

function Chapter({ n, title, width, children }) {
  return (
    <section className={s.chapter} style={width ? { "--w": width } : undefined}>
      <header className={s.chapterHead}>
        <span className={s.chapterNum} data-n>
          {n}
        </span>
        <span className={s.chapterTitle} data-title>
          {title}
        </span>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

function CountUp({ value, run }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const m = String(value).match(/^([\d.,]+)(.*)$/);
    if (
      !run ||
      !m ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(value);
      return;
    }
    const target = Number.parseFloat(m[1].replace(/\./g, "").replace(",", "."));
    if (Number.isNaN(target)) return setShown(value);
    const isInt = !m[1].includes(",");
    const t0 = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / 800);
      const n = target * (1 - (1 - p) ** 3);
      setShown(
        `${isInt ? Math.round(n).toLocaleString("sr-RS") : n.toFixed(1).replace(".", ",")}${m[2]}`,
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run]);
  return <>{shown}</>;
}

function useStored(key, initial) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setV(saved);
    } catch {
      // Blocked storage just means the default sticks for this visit.
    }
  }, [key]);
  const set = (next) => {
    setV(next);
    try {
      localStorage.setItem(key, next);
    } catch {
      // Not persisting is fine.
    }
  };
  return [v, set];
}

/* ── scattered filler tiles ──────────────────────────────── */

function ClientsTile() {
  // Two identical runs, translated -50%, so the loop has no seam.
  const run = (key) =>
    CLIENT_LOGOS.map((l) => (
      <span key={`${key}-${l.alt}`} className={s.logoItem}>
        <Image
          src={l.src}
          alt={l.alt}
          height={l.h}
          width={l.w}
          style={{ height: `${l.h}px`, width: `${l.w}px` }}
          unoptimized
        />
      </span>
    ));

  return (
    <article className={`${s.card} ${s.clientsCard}`}>
      <span className={s.eyebrow}>Radili smo sa</span>
      <div className={s.marquee}>
        <div className={s.marqueeTrack}>
          {run("a")}
          {run("b")}
        </div>
      </div>
    </article>
  );
}

/* Rotates through the case studies' own takeaways. Real lessons, not a
   manifesto. */
function LessonsTile({ lessons }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (lessons.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % lessons.length), 6000);
    return () => clearInterval(id);
  }, [lessons.length]);
  if (lessons.length === 0) return null;
  const l = lessons[i];
  return (
    <article className={`${s.card} ${s.lessons}`}>
      <span className={s.cardTop}>
        <span className={s.eyebrow}>Naučeno na projektima</span>
        <span className={s.eyebrow}>
          {i + 1} / {lessons.length}
        </span>
      </span>
      <p className={s.lessonText} key={l.text}>
        {l.text}
      </p>
      <a className={s.lessonClient} href={l.href}>
        {l.client} <ArrowIcon size={11} />
      </a>
    </article>
  );
}

/* lukxce's toggle: shows the moon in dark and the sun in light, and on
   "auto" follows the system so the icon never contradicts the page. */
function ThemeToggle({ theme, onToggle, label }) {
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setSystemDark(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  const isDark = theme === "auto" ? systemDark : theme === "dark";
  return (
    <button
      type="button"
      className={s.themeToggle}
      onClick={() => onToggle(isDark)}
      aria-label={label}
      title={label}
    >
      {isDark
        ? <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        : <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>}
    </button>
  );
}

/* Desktop only: a pill of chapter numbers that follows the track. */
function ChapterNav({ trackRef }) {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const secs = [...track.querySelectorAll("section")];
    setItems(
      secs.map((el, i) => ({
        i,
        n: el.querySelector("[data-n]")?.textContent ?? "",
        title: el.querySelector("[data-title]")?.textContent ?? "",
      })),
    );
    // The chapter whose left edge is nearest the track's left edge is the
    // one being read. Cheaper and steadier than an observer.
    const onScroll = () => {
      const x = track.scrollLeft + 40;
      let best = 0;
      let dist = Number.POSITIVE_INFINITY;
      secs.forEach((el, k) => {
        const d = Math.abs(el.offsetLeft - x);
        if (d < dist) {
          dist = d;
          best = k;
        }
      });
      setActive(best);
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [trackRef]);
  if (items.length === 0) return null;
  const go = (i) => {
    const track = trackRef.current;
    const el = track?.querySelectorAll("section")[i];
    if (track && el)
      track.dispatchEvent(
        new CustomEvent("dg:scrollto", { detail: el.offsetLeft - 40 }),
      );
  };
  return (
    <nav className={s.chapterNav} aria-label="Poglavlja">
      {items.map((it) => (
        <button
          key={it.i}
          type="button"
          className={`${s.navDot} ${it.i === active ? s.navDotOn : ""}`}
          onClick={() => go(it.i)}
          aria-label={`${it.n} ${it.title}`}
          aria-current={it.i === active ? "true" : undefined}
        >
          <span className={s.navNum}>{it.n}</span>
          <span className={s.navTitle}>{it.title}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── service sheet ───────────────────────────────────────── */

function ServiceSheet({ id, recommended, onClose }) {
  useEffect(() => {
    if (!id) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [id, onClose]);
  if (!id) return null;
  const sv = SERVICES[id];
  const { Icon } = sv;
  return (
    <div
      className={s.sheetWrap}
      role="dialog"
      aria-modal="true"
      aria-label={sv.name}
    >
      <button
        type="button"
        className={s.sheetBackdrop}
        onClick={onClose}
        aria-label="Zatvori"
      />
      <div className={s.sheet}>
        <div className={s.sheetHead}>
          <span className={s.sheetIcon} aria-hidden>
            <Icon />
          </span>
          <button
            type="button"
            className={s.sheetClose}
            onClick={onClose}
            aria-label="Zatvori"
          >
            ×
          </button>
        </div>
        {recommended
          ? <span className={s.sheetFlag}>Preporučeno za vas</span>
          : null}
        <h2 className={s.sheetTitle}>{sv.name}</h2>
        <p className={s.sheetRole}>{sv.role}</p>
        <p className={s.sheetBody}>{sv.body}</p>
        <div className={s.sheetFeeds}>
          <span className={s.eyebrow}>Kako se vezuje za ostalo</span>
          <p>{sv.feeds}</p>
        </div>
        <a className={s.sheetCta} href="#contact" onClick={onClose}>
          Pitajte nas o ovome{" "}
          <span className={s.iconCircle}>
            <ArrowIcon size={12} />
          </span>
        </a>
      </div>
    </div>
  );
}

/* ── case study ──────────────────────────────────────────── */

function CaseCard({ client }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const swipe = useRef(null);
  const slides = [
    { kind: "cover" },
    ...client.after.map((m) => ({ kind: "stat", ...m })),
  ];

  useEffect(() => {
    if (paused || flipped || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4200,
    );
    return () => clearInterval(id);
  }, [paused, flipped, slides.length]);

  const go = (step) =>
    setIndex((i) => (i + step + slides.length) % slides.length);

  return (
    <div className={`${s.flip} ${s.caseFlip} ${flipped ? s.flipped : ""}`}>
      <div className={s.flipInner}>
        <article
          className={`${s.card} ${s.face} ${s.caseCard}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={() => setFlipped(true)}
        >
          <div
            className={s.slidesViewport}
            data-no-drag
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => {
              swipe.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipe.current == null) return;
              const dx = e.clientX - swipe.current;
              swipe.current = null;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }}
          >
            <div
              className={s.slides}
              style={{ transform: `translateX(${-index * 100}%)` }}
              aria-live="polite"
            >
              {slides.map((sl, i) => (
                <div
                  key={sl.kind + i}
                  className={`${s.slide} ${sl.kind === "stat" ? s.slideStat : ""}`}
                  aria-hidden={i !== index}
                >
                  {sl.kind === "cover"
                    ? client.cover
                      ? <Image
                          src={client.cover}
                          alt={client.clientName}
                          fill
                          sizes="340px"
                          className={s.caseImg}
                        />
                      : null
                    : <>
                        <span className={s.statValue}>
                          <CountUp value={sl.value} run={i === index} />
                        </span>
                        <span className={s.statLabel}>{sl.label}</span>
                      </>}
                </div>
              ))}
            </div>

            {slides.length > 1
              ? <div className={s.slideControls}>
                  <button
                    type="button"
                    className={s.slideBtn}
                    onClick={() => go(-1)}
                    aria-label="Prethodno"
                  >
                    <ArrowIcon size={12} />
                  </button>
                  <div className={s.dotsRow}>
                    {slides.map((sl, i) => (
                      <button
                        key={sl.kind + i}
                        type="button"
                        aria-current={i === index}
                        className={`${s.dot} ${i === index ? s.dotActive : ""}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Slajd ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className={s.slideBtn}
                    onClick={() => go(1)}
                    aria-label="Sledeće"
                  >
                    <ArrowIcon size={12} />
                  </button>
                </div>
              : null}
          </div>

          <div className={s.caseFoot}>
            <span className={s.caseText}>
              <span className={s.strong}>{client.clientName}</span>
              <span className={s.muted}>{client.category}</span>
            </span>
            <span className={s.caseHint}>
              Odakle su krenuli <ArrowIcon size={11} />
            </span>
          </div>
        </article>

        <article
          className={`${s.card} ${s.face} ${s.caseBack}`}
          onClick={() => setFlipped(false)}
        >
          <span className={s.faceTag}>Pre</span>
          <p className={s.caseBefore}>{client.before}</p>
          <div className={s.caseBackFoot}>
            <button
              type="button"
              className={s.chipLight}
              onClick={() => setFlipped(false)}
            >
              Nazad
            </button>
            <a className={s.faceLink} href={client.href}>
              Cela priča <ArrowIcon size={11} />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}

function NewsletterCard() {
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
    <article className={`${s.card} ${s.newsletter}`}>
      <span className={s.eyebrow}>Budite u toku</span>
      <p className={s.newsTitle}>Trendovi i taktike, bez buke.</p>
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
          <ArrowIcon size={14} />
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
    </article>
  );
}

/* ── contact ─────────────────────────────────────────────── */

function ContactCard({ prefill }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState("idle");

  useEffect(() => {
    if (!touched) setMessage(prefill ? `${prefill} ` : "");
  }, [prefill, touched]);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    if (!message.trim()) return setState("empty");
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email, message }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) {
        setEmail("");
        setMessage("");
        setTouched(false);
      }
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
    error: "Nije poslato. Pokušajte ponovo.",
  }[state];

  return (
    <article className={`${s.card} ${s.contact}`} id="contact">
      <span className={s.dots} aria-hidden />
      <span className={s.eyebrow}>Vaš red</span>
      <p className={s.contactTitle}>
        {prefill ? "Nastavite rečenicu." : "Napravimo brend koji se izdvaja."}
      </p>
      <form className={s.contactForm} onSubmit={submit}>
        <input
          className={s.field}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
        <textarea
          className={s.field}
          rows={2}
          placeholder="Čime se bavite?"
          aria-label="Poruka"
          value={message}
          onChange={(e) => {
            setTouched(true);
            setMessage(e.target.value);
            setState("idle");
          }}
        />
        <button className={s.send} type="submit" disabled={state === "sending"}>
          Pošaljite{" "}
          <span className={s.iconCircleBlue}>
            <ArrowIcon size={13} />
          </span>
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
    </article>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function DijagnozaGrid({
  clients = [],
  articles = [],
  testimonials = [],
  lessons = [],
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sheet, setSheet] = useState(null);
  const device = "desktop";
  const [theme, setTheme] = useStored("dijagnoza-theme", "auto");
  const progressRef = useRef(null);
  useHorizontalScroll(trackRef, progressRef);

  const picked = QUIZ.map((q) =>
    q.options.find((o) => o.id === answers[q.id]),
  ).filter(Boolean);
  const done = picked.length === QUIZ.length;
  const scores = {};
  for (const o of picked)
    for (const [k, v] of Object.entries(o.w)) scores[k] = (scores[k] ?? 0) + v;
  const recommended = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k);
  const first = picked[0] ?? null;
  const matched =
    (first && clients.find((c) => c.slug === first.match)) ??
    clients[0] ??
    null;
  const cases = matched
    ? [matched, ...clients.filter((c) => c.slug !== matched.slug)].slice(0, 2)
    : clients.slice(0, 2);
  const q = QUIZ[step];

  function answer(qid, oid) {
    setAnswers((a) => ({ ...a, [qid]: oid }));
    // No scroll: the recommendation replaces the quiz inside this same card.
    if (step < QUIZ.length - 1) setStep(step + 1);
  }

  /* A metric of ours that is a bare number is the only kind worth guessing. */

  return (
    <div
      className={s.stage}
      ref={stageRef}
      data-bento
      data-device={device}
      data-theme={theme}
    >
      {/* data-lenis-prevent: the site's smooth scroll otherwise swallows the
          wheel here and the phone frame never scrolls. */}
      <div className={s.viewport} data-lenis-prevent>
        <div className={s.inner}>
          <header className={s.bar}>
            <div className={s.scrollHint}>
              <span>Skrolujte u stranu. Tako je zamišljeno.</span>
              <span ref={progressRef} className={s.progress} aria-hidden>
                <span className={s.progressFill} />
              </span>
              <ThemeToggle
                theme={theme}
                label="Promeni temu"
                onToggle={(isDark) => setTheme(isDark ? "light" : "dark")}
              />
            </div>
          </header>

          <div className={s.track} ref={trackRef}>
            {/* 01 ─ badge, in the lukxce shape */}
            <Chapter n="01" title="Digitl" width="398px">
              <article className={`${s.card} ${s.badge}`}>
                <span className={s.lanyard} aria-hidden>
                  <Image
                    src={stripeSvg}
                    alt=""
                    width={63}
                    height={164}
                    className={s.lanyardImg}
                    priority
                    unoptimized
                  />
                </span>
                <span className={s.hole} aria-hidden />

                <div className={s.badgeTop}>
                  <span className={s.avatar} aria-hidden />
                  <span className={s.who}>
                    <span className={s.name}>Digitl</span>
                    <span className={s.muted}>
                      Full-Service
                      <br />
                      marketing agencija
                    </span>
                  </span>
                  <span className={s.available}>
                    <span className={s.pulse} aria-hidden />
                    {OPEN_SLOTS} slobodna mesta
                  </span>
                </div>

                <h1 className={s.headline}>
                  Marketing koji donosi prave rezultate.
                </h1>
                <p className={s.lede}>
                  Gradimo brendove koji se izdvajaju, konvertuju bolje i rastu
                  brže. Sve što vaš biznis traži, na jednom mestu.
                </p>

                <div className={s.heroRow}>
                  <a className={s.btnPrimary} href="#contact">
                    Zakaži razgovor
                    <span className={s.iconCircle}>
                      <ArrowIcon size={12} />
                    </span>
                  </a>
                  <a className={s.btnGhost} href="/projects">
                    Naši projekti
                  </a>
                </div>

                <div className={s.badgeBottom}>
                  <p className={s.location}>
                    <Image src={locationIcon} alt="" width={11} height={11} />
                    <strong className={s.locationCity}>Beograd / London</strong>
                  </p>
                  <a
                    className={s.enLink}
                    href="https://digitl.me"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    English Website <ArrowIcon size={11} />
                  </a>
                </div>
              </article>
            </Chapter>

            {/* 02 ─ what we do, at a size the card can carry */}
            <Chapter n="02" title="Usluge" width="420px">
              <article className={`${s.card} ${s.allCard}`}>
                <span className={s.eyebrow}>Sve što radimo</span>
                <ul className={s.allList}>
                  {SERVICE_LIST.map((sv) => (
                    <li key={sv.id}>
                      <button
                        type="button"
                        className={s.allRow}
                        onClick={() => setSheet(sv.id)}
                      >
                        <span className={s.allIcon} aria-hidden>
                          <sv.Icon />
                        </span>
                        <span className={s.allText}>
                          <span className={s.allName}>{sv.name}</span>
                          <span className={s.allDesc}>{sv.body}</span>
                        </span>
                        <span className={s.allArrow} aria-hidden>
                          <ArrowIcon size={12} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </article>
            </Chapter>

            {/* 03 ─ the three questions, and the call that follows them */}
            <Chapter n="03" title="Preporuka" width="360px">
              <div className={s.resultFace} data-anchor="result">
                {done
                  ? <>
                      {recommended.map((id, i) => {
                        const sv = SERVICES[id];
                        return (
                          <button
                            key={id}
                            type="button"
                            className={`${s.rec} ${i === 0 ? s.recTop : ""}`}
                            onClick={() => setSheet(id)}
                          >
                            <span className={s.recIcon} aria-hidden>
                              <sv.Icon />
                            </span>
                            <span className={s.recText}>
                              <span className={s.strong}>{sv.name}</span>
                              <span className={s.muted}>{sv.role}</span>
                            </span>
                            {i === 0
                              ? <span className={s.recBadge}>prvo</span>
                              : null}
                            <span className={s.recArrow} aria-hidden>
                              <ArrowIcon size={11} />
                            </span>
                          </button>
                        );
                      })}
                    </>
                  : <article className={`${s.card} ${s.quiz}`}>
                      <div className={s.quizTop}>
                        <span className={s.eyebrow}>
                          {Math.min(step + 1, QUIZ.length)} / {QUIZ.length}
                        </span>
                        <span className={s.pips} aria-hidden>
                          {QUIZ.map((qq, i) => (
                            <span
                              key={qq.id}
                              className={`${s.pip} ${answers[qq.id] ? s.pipDone : ""} ${i === step && !done ? s.pipNow : ""}`}
                            />
                          ))}
                        </span>
                      </div>
                      <h2 className={s.quizQ} key={q.id}>
                        {q.q}
                      </h2>
                      <div className={s.options}>
                        {q.options.map((o) => (
                          <button
                            key={o.id}
                            type="button"
                            className={s.option}
                            onClick={() => answer(q.id, o.id)}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      {step > 0
                        ? <button
                            type="button"
                            className={s.back}
                            onClick={() => setStep(step - 1)}
                          >
                            ← Nazad
                          </button>
                        : null}
                    </article>}
              </div>
              <article className={`${s.card} ${s.book}`}>
                <span className={s.bookGlyph} aria-hidden />
                <span className={s.eyebrowLight}>30 minuta, bez obaveze</span>
                <p className={s.bookTitle}>Besplatan prvi razgovor.</p>
                <p className={s.bookNote}>
                  Pogledamo brojeve i kažemo šta je prioritet, a šta može da
                  čeka.
                </p>
                <div className={s.bookRow}>
                  <a
                    className={s.bookTile}
                    href={`mailto:${CONTACT.email}?subject=Zakazivanje razgovora`}
                  >
                    <span className={s.bookTileText}>
                      <span className={s.bookTileName}>Zakažite</span>
                      <span className={s.bookTileSub}>{CONTACT.email}</span>
                    </span>
                    <MailIcon />
                  </a>
                  <a className={s.bookTile} href={`tel:${CONTACT.tel}`}>
                    <span className={s.bookTileText}>
                      <span className={s.bookTileName}>Pozovite</span>
                      <span className={s.bookTileSub}>{CONTACT.phone}</span>
                    </span>
                    <PhoneIcon />
                  </a>
                </div>
              </article>
            </Chapter>

            {/* 04 ─ two case studies, stacked */}
            <Chapter n="04" title="Projekti" width="400px">
              {cases.map((c) => (
                <CaseCard key={c.slug} client={c} />
              ))}
              <a href="/projects" className={`${s.card} ${s.allLink}`}>
                Svi projekti{" "}
                <span className={s.iconCircleSm}>
                  <ArrowIcon size={11} />
                </span>
              </a>
            </Chapter>

            {/* 05 ─ who they were, what they said, what it taught us */}
            <Chapter n="05" title="Šta kažu" width="360px">
              {testimonials.length > 0
                ? <article className={`${s.card} ${s.quote}`}>
                    <p className={s.quoteBody}>{testimonials[0].body}</p>
                    <span className={s.quoteWho}>
                      <span className={s.quoteAvatar} aria-hidden>
                        {testimonials[0].name.slice(0, 1)}
                      </span>
                      <span>
                        <span className={s.strong}>{testimonials[0].name}</span>
                        <span className={s.muted}>{testimonials[0].role}</span>
                      </span>
                    </span>
                  </article>
                : <article className={`${s.card} ${s.quoteEmpty}`}>
                    <span className={s.eyebrow}>Prazno namerno</span>
                    <p className={s.quoteBody}>
                      Ovde idu prave preporuke klijenata.
                    </p>
                    <span className={s.muted}>
                      Na sajtu su trenutno šablonske, od ljudi koji nisu vaši
                      klijenti.
                    </span>
                  </article>}
              <ClientsTile />
              <LessonsTile lessons={lessons} />
            </Chapter>

            {/* 06 ─ process */}
            <Chapter n="06" title="Kako radimo" width="400px">
              <article className={`${s.card} ${s.processCard}`}>
                <div className={s.processTop}>
                  <span className={s.processNum} aria-hidden>
                    {STEPS.length}
                  </span>
                  <span className={s.processText}>
                    <span className={s.processTitle}>Kako radimo</span>
                    <span className={s.processNote}>
                      Jedan povezan proces koji drži strategiju, egzekuciju i
                      rezultate u istom pravcu.
                    </span>
                  </span>
                </div>
                <ol className={s.stepList}>
                  {STEPS.map(([title, note], i) => (
                    <li key={title} className={s.stepItem} style={{ "--i": i }}>
                      <span className={s.stepNum}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={s.stepText}>
                        <span className={s.strong}>{title}</span>
                        <span className={s.muted}>
                          {i === 0 && first
                            ? `Zašto ${first.label.toLowerCase()} više ne nosi sama.`
                            : note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
              <span className={s.hideOnPhone}>
                <NewsletterCard />
              </span>
            </Chapter>

            <Chapter n="07" title="Blog" width="310px">
              {articles.slice(0, 3).map((a) => (
                <a
                  key={a.slug}
                  href={`/journal/${a.slug}`}
                  className={`${s.card} ${s.post}`}
                >
                  <span className={s.postTitle}>{a.title}</span>
                  <span className={s.postFoot}>
                    <span className={s.muted}>{formatDate(a.publishedAt)}</span>
                    <span className={s.iconCircleSm}>
                      <ArrowIcon size={11} />
                    </span>
                  </span>
                </a>
              ))}
              <a href="/journal" className={`${s.card} ${s.allLink}`}>
                Svi tekstovi{" "}
                <span className={s.iconCircleSm}>
                  <ArrowIcon size={11} />
                </span>
              </a>
              {/* On a phone the columns become one list, and the signup
                  belongs after the posts rather than before them. */}
              <span className={s.phoneOnly}>
                <NewsletterCard />
              </span>
            </Chapter>

            {/* 08 ─ the two bases, and the count that goes with them */}
            <Chapter n="08" title="Kontakt" width="360px">
              <ContactCard
                prefill={
                  first
                    ? `Klijenti nam stižu preko: ${first.label.toLowerCase()}.`
                    : ""
                }
              />
              <div className={s.directRow}>
                <a className={s.directLink} href={`mailto:${CONTACT.email}`}>
                  <MailIcon /> {CONTACT.email}
                </a>
                <a className={s.directLink} href={`tel:${CONTACT.tel}`}>
                  <PhoneIcon /> {CONTACT.phone}
                </a>
              </div>

              <div className={s.socialRow}>
                {SOCIALS.map((so) => (
                  <a
                    key={so.id}
                    className={s.social}
                    href={so.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={s.socialIcon} aria-hidden>
                      <so.Icon />
                    </span>
                    <span className={s.socialHandle}>{so.handle}</span>
                  </a>
                ))}
              </div>
            </Chapter>
          </div>
        </div>
      </div>

      <ChapterNav trackRef={trackRef} />

      <ServiceSheet
        id={sheet}
        recommended={sheet ? recommended.includes(sheet) : false}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}
