"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import digitlLogo from "../assets/digitl-logo.png";
import elektromilLogo from "../assets/elektromil-logo.webp";
import {
  IconBrand,
  IconMotion,
  IconProduct,
  IconStrategy,
  IconWeb,
} from "../components/serviceIcons";
import s from "./bento.module.css";

/* ── content ─────────────────────────────────────────────────────────── */

const SERVICES = [
  [IconProduct, "Plaćeno oglašavanje", "Google i društvene mreže"],
  [IconWeb, "Web dizajn & razvoj", "Brzi sajtovi koji konvertuju"],
  [IconStrategy, "SEO", "Google i AI pretraga"],
  [IconMotion, "Društvene mreže", "Dosledan brend na kanalima"],
  [IconBrand, "Branding & identitet", "Pozicioniranje i vizuelni sistem"],
];

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i konkretne odluke o sledećem koraku."],
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
  [
    "Sa kakvim firmama radite?",
    "Od lokalnih biznisa do etabliranih brendova, svuda gde se marketing meri rezultatom.",
  ],
];

const TAGS = ["Oglašavanje", "Web", "SEO", "Društvene mreže", "Brend"];

/* ── primitives ──────────────────────────────────────────────────────── */

function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ flip = false }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={flip ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({ className = "", index, as: Tag = "div", children, ...rest }) {
  return (
    <Tag
      className={`${s.card} ${className}`}
      style={{ "--i": index }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ── horizontal track behaviour ──────────────────────────────────────── */

function useHorizontalScroll(trackRef, progressRef) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Only hijack the wheel while the track actually scrolls sideways, so the
    // stacked phone layout keeps normal vertical scrolling.
    const sideways = () => el.scrollWidth > el.clientWidth + 8;
    let target = el.scrollLeft;
    let raf = 0;

    const max = () => el.scrollWidth - el.clientWidth;
    const clamp = (v) => Math.max(0, Math.min(v, max()));

    const tick = () => {
      const next = el.scrollLeft + (target - el.scrollLeft) * 0.14;
      if (Math.abs(target - next) < 0.5) {
        el.scrollLeft = target;
        raf = 0;
        return;
      }
      el.scrollLeft = next;
      raf = requestAnimationFrame(tick);
    };

    const scrollTo = (value) => {
      target = clamp(value);
      if (reduce.matches) {
        el.scrollLeft = target;
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (!sideways()) return;
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!delta) return;
      e.preventDefault();
      if (!raf) target = el.scrollLeft;
      scrollTo(target + delta);
    };

    const onScroll = () => {
      if (!raf) target = el.scrollLeft;
      const m = max();
      progressRef.current?.style.setProperty(
        "--progress",
        String(m > 0 ? el.scrollLeft / m : 0),
      );
    };

    const onKey = (e) => {
      if (!sideways()) return;
      if (e.target.closest?.("input, textarea, select")) return;
      const page = el.clientWidth * 0.8;
      const moves = {
        ArrowRight: 320,
        ArrowLeft: -320,
        PageDown: page,
        PageUp: -page,
      };
      if (e.key in moves) {
        e.preventDefault();
        if (!raf) target = el.scrollLeft;
        scrollTo(target + moves[e.key]);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollTo(max());
      }
    };

    // Mouse drag-to-scroll; a click that ends a drag must not open a link.
    let drag = null;
    let suppressClick = false;
    const onPointerDown = (e) => {
      if (!sideways() || e.pointerType !== "mouse" || e.button !== 0) return;
      if (e.target.closest("input, textarea, button, [data-no-drag]")) return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
    };
    const onPointerMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        el.setAttribute("data-dragging", "");
      }
      if (drag.moved) {
        cancelAnimationFrame(raf);
        raf = 0;
        el.scrollLeft = drag.left - dx;
        target = el.scrollLeft;
      }
    };
    const onPointerUp = () => {
      if (drag?.moved) suppressClick = true;
      drag = null;
      el.removeAttribute("data-dragging");
    };
    const onClickCapture = (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };
    const onDragStart = (e) => e.preventDefault();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);
    window.addEventListener("keydown", onKey);
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("keydown", onKey);
    };
  }, [trackRef, progressRef]);
}

function useTheme() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bento-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // No stored preference is fine; the system setting still applies.
    }
  }, []);
  const toggle = () => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next =
      (theme ?? (dark ? "dark" : "light")) === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("bento-theme", next);
    } catch {
      // Not persisting is fine; the toggle still works for this visit.
    }
  };
  return [theme, toggle];
}

/* ── cards ───────────────────────────────────────────────────────────── */

function IntroCard() {
  return (
    <Card index={0} className={s.intro}>
      <span className={s.introGlyph} aria-hidden />
      <Image
        src={digitlLogo}
        alt="digitl"
        className={s.introLogo}
        width={104}
        height={28}
        priority
      />
      <h1 className={s.introTitle}>Marketing koji donosi prave rezultate.</h1>
      <p className={s.introBody}>
        Kompletan marketing kao jedan sistem, ne meni nepovezanih usluga.
      </p>
      <div className={s.tagRow}>
        {TAGS.map((t) => (
          <span key={t} className={s.tag}>
            {t}
          </span>
        ))}
      </div>
      <a className={s.introCta} href="/contact">
        Zakažite razgovor
        <span className={s.ctaArrow}>
          <ArrowIcon size={13} />
        </span>
      </a>
    </Card>
  );
}

function ServicesCard() {
  return (
    <Card index={1} className={s.services}>
      <span className={s.eyebrow}>Usluge</span>
      <ul className={s.serviceList}>
        {SERVICES.map(([Icon, title, note]) => (
          <li key={title} className={s.serviceItem}>
            <span className={s.serviceIcon} aria-hidden>
              <Icon />
            </span>
            <span className={s.serviceText}>
              <span className={s.strong}>{title}</span>
              <span className={s.muted}>{note}</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProcessCard() {
  return (
    <Card index={2} className={s.process}>
      <span className={s.eyebrow}>Kako radimo</span>
      <ol className={s.stepList}>
        {STEPS.map(([title, note], i) => (
          <li key={title} className={s.stepItem}>
            <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={s.serviceText}>
              <span className={s.strong}>{title}</span>
              <span className={s.muted}>{note}</span>
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function WorkCard({ showcases }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipe = useRef(null);
  const slides = showcases.slice(0, 4);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      4200,
    );
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;
  const go = (step) =>
    setIndex((i) => (i + step + slides.length) % slides.length);
  const active = slides[index];

  return (
    <Card
      index={3}
      className={s.work}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={s.slidesViewport}
        data-no-drag
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
        >
          {slides.map((card, i) => (
            <div
              key={card.slug ?? i}
              className={s.slide}
              aria-hidden={i !== index}
            >
              {card.backgroundSrc
                ? <Image
                    src={card.backgroundSrc}
                    alt={card.title ?? ""}
                    fill
                    sizes="420px"
                    className={s.cover}
                  />
                : null}
            </div>
          ))}
        </div>
        {slides.length > 1
          ? <div className={s.slideControls}>
              <button
                type="button"
                className={s.slideButton}
                onClick={() => go(-1)}
                aria-label="Prethodni projekat"
              >
                <ChevronIcon flip />
              </button>
              <div className={s.dots}>
                {slides.map((c, i) => (
                  <button
                    key={c.slug ?? i}
                    type="button"
                    aria-current={i === index}
                    className={`${s.dot} ${i === index ? s.dotActive : ""}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Projekat ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className={s.slideButton}
                onClick={() => go(1)}
                aria-label="Sledeći projekat"
              >
                <ChevronIcon />
              </button>
            </div>
          : null}
      </div>
      <a className={s.workFoot} href={active.href ?? "/projects"}>
        {active.thumbSrc
          ? <Image
              src={active.thumbSrc}
              alt=""
              width={40}
              height={40}
              className={s.thumb}
            />
          : null}
        <span className={s.serviceText}>
          <span className={s.strong}>{active.clientName ?? active.title}</span>
          <span className={s.muted}>{active.subtitle}</span>
        </span>
        <span className={s.roundLink}>
          <ArrowIcon />
        </span>
      </a>
    </Card>
  );
}

function ArticleCard({ article, index }) {
  return (
    <Card
      as="a"
      index={index}
      href={`/journal/${article.slug}`}
      className={s.article}
    >
      <span className={s.eyebrow}>Blog</span>
      <span className={s.articleTitle}>{article.title}</span>
      <span className={s.articleFoot}>
        <span className={s.muted}>{formatDate(article.publishedAt)}</span>
        <span className={s.roundLink}>
          <ArrowIcon />
        </span>
      </span>
    </Card>
  );
}

function ClientsCard() {
  return (
    <Card index={6} className={s.clients}>
      <span className={s.eyebrow}>Izabrali su digitl</span>
      <div className={s.logoRow}>
        <Image
          src={elektromilLogo}
          alt="Elektromil"
          height={26}
          className={s.clientLogo}
        />
        <span className={s.clientName}>ThermiQ</span>
        <span className={s.clientName}>Prima Dental</span>
        <span className={s.clientName}>Moler Niš</span>
      </div>
    </Card>
  );
}

function FaqCard() {
  const [open, setOpen] = useState(0);
  return (
    <Card index={7} className={s.faq}>
      <span className={s.eyebrow}>Česta pitanja</span>
      <ul className={s.faqList}>
        {FAQS.map(([q, a], i) => (
          <li key={q} className={s.faqItem}>
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
    </Card>
  );
}

function WorldwideCard() {
  return (
    <Card
      as="a"
      index={8}
      className={s.worldwide}
      href="https://digitl.me"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={s.eyebrow} data-on-dark>
        Van Srbije
      </span>
      <span className={s.worldwideTitle}>digitl.me</span>
      <span className={s.muted} data-on-dark>
        Isti tim, isti pristup, na engleskom.
      </span>
      <span className={s.cornerArrow}>
        <ArrowIcon />
      </span>
    </Card>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.6"
        y="4.8"
        width="18.8"
        height="14.4"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.4 7l8.6 6 8.6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.2 3.5l2.4 4-1.9 2a12.4 12.4 0 005.1 5.1l2-1.9 4 2.4v3a1.9 1.9 0 01-2.1 1.9C9.3 19.3 4.7 14.7 3.6 5.6A1.9 1.9 0 015.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DirectCard() {
  return (
    <Card index={8.5} className={s.direct}>
      <span className={s.eyebrow}>Direktno</span>
      <a className={s.directRow} href="mailto:hello@digitl.rs">
        <span className={s.directIcon}>
          <MailIcon />
        </span>
        <span className={s.strong}>hello@digitl.rs</span>
      </a>
      <a className={s.directRow} href="tel:+381641338383">
        <span className={s.directIcon}>
          <PhoneIcon />
        </span>
        <span className={s.strong}>064 133 8383</span>
      </a>
    </Card>
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
    done: "Prijavljeni ste. Vidimo se u inboxu.",
    error: "Nije uspelo. Pokušajte ponovo za minut.",
  }[state];

  return (
    <Card index={9} className={s.newsletter}>
      <span className={s.eyebrow}>Budite u toku</span>
      <form className={s.form} onSubmit={submit}>
        <input
          className={s.input}
          type="email"
          value={email}
          placeholder="vas@email.com"
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          aria-label="Email adresa"
        />
        <button
          className={s.submit}
          type="submit"
          disabled={state === "sending"}
          aria-label="Prijavite se"
        >
          <ArrowIcon size={15} />
        </button>
      </form>
      <p
        className={`${s.formNote} ${state === "invalid" || state === "error" ? s.formError : ""}`}
      >
        {note}
      </p>
    </Card>
  );
}

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
    idle: null,
    invalid: "Ta adresa ne izgleda ispravno.",
    empty: "Napišite nešto. Bilo šta.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <Card index={10} className={s.contact} id="kontakt">
      <span className={s.eyebrow}>Recite zdravo</span>
      <p className={s.contactTitle}>
        Stigli ste do kraja. To je više nego što dobije većina sajtova.
      </p>
      <form className={s.contactForm} onSubmit={submit}>
        <input
          className={s.contactInput}
          type="email"
          placeholder="vas@email.com"
          value={form.email}
          aria-label="Email adresa"
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setState("idle");
          }}
        />
        <textarea
          className={s.contactArea}
          rows={3}
          placeholder="Na čemu radite?"
          value={form.message}
          aria-label="Poruka"
          onChange={(e) => {
            setForm({ ...form, message: e.target.value });
            setState("idle");
          }}
        />
        <button
          className={s.contactSubmit}
          type="submit"
          disabled={state === "sending"}
        >
          Pošaljite
          <span className={s.contactSubmitIcon}>
            <ArrowIcon />
          </span>
        </button>
      </form>
      {note
        ? <p
            className={`${s.formNote} ${["invalid", "empty", "error"].includes(state) ? s.formError : ""}`}
          >
            {note}
          </p>
        : null}
    </Card>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const [systemDark, setSystemDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setSystemDark(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  // Picked in JS: CSS-only variants fought over which icon was visible.
  const isDark = theme ? theme === "dark" : systemDark;
  return (
    <button
      type="button"
      className={s.themeToggle}
      onClick={onToggle}
      aria-label={isDark ? "Svetla tema" : "Tamna tema"}
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
              strokeWidth="2"
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
              r="4.4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>}
    </button>
  );
}

/* ── grid ────────────────────────────────────────────────────────────── */

export default function BentoGrid({ articles = [], showcases = [] }) {
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const [theme, toggleTheme] = useTheme();
  useHorizontalScroll(trackRef, progressRef);

  const posts = articles.slice(0, 3);

  return (
    <div className={s.stage} data-theme={theme ?? undefined} data-bento>
      <div className={s.root}>
        <div className={s.topbar}>
          <div className={s.scrollHint}>
            <span>Skrolujte u stranu.</span>
            <span ref={progressRef} className={s.progress}>
              <span className={s.progressFill} />
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <div className={s.track} ref={trackRef}>
          <div className={s.col} data-col="intro">
            <IntroCard />
          </div>

          <div className={s.col} data-col="services">
            <ServicesCard />
          </div>

          <div className={s.col} data-col="work">
            <WorkCard showcases={showcases} />
            <Card as="a" index={4} href="/projects" className={s.allLink}>
              <span>Svi projekti</span>
              <span className={s.roundLink}>
                <ArrowIcon />
              </span>
            </Card>
          </div>

          <div className={s.col} data-col="process">
            <ProcessCard />
          </div>

          <div className={s.col} data-col="journal">
            {posts.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={5 + i * 0.2} />
            ))}
            <Card as="a" index={6} href="/journal" className={s.allLink}>
              <span>Svi tekstovi</span>
              <span className={s.roundLink}>
                <ArrowIcon />
              </span>
            </Card>
          </div>

          <div className={s.col} data-col="tiles">
            <ClientsCard />
            <WorldwideCard />
            <DirectCard />
            <NewsletterCard />
            <FaqCard />
          </div>

          <div className={s.col} data-col="end">
            <ContactCard />
          </div>
        </div>
      </div>
    </div>
  );
}
