"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { date } from "../_home/Blog";
import Booking from "../_home/Booking";
import b from "../_home/base.module.css";
import { CARD_SKIN, CONTACT, SERVICE_PAGES } from "../_home/content";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Mail,
  Phone,
} from "../_home/icons";
import { SOCIALS } from "../_home/Nav";
import { AppProvider, EASE, useApp } from "../_home/ui";
import { STICKERS } from "../_usluge/Stickers";
import logo from "../assets/digitl-logo.png";
import s from "./bio.module.css";

/* Everything the reader sees, in one place, so the English site only swaps
   this block. The words come from the homepage: the hero, the booking
   dialog, the section heads and the footer. */
const T = {
  kind: "Full-Service marketing agencija",
  slots: "2 slobodna mesta",
  // the homepage headline, with the same two words in blue
  claim: ["Marketing koji donosi ", "prave rezultate."],
  book: "Zakažite razgovor",
  bookSub: "Besplatan prvi razgovor",
  // the lead the dialog sends says where it came from
  bookTopic: "Instagram",
  second: {
    label: "Pozovite",
    sub: CONTACT.phone,
    href: `tel:${CONTACT.tel}`,
    Icon: Phone,
  },
  dockSecond: "Pozovite",
  dockBook: "Zakažite",
  blogLabel: "Najnoviji tekstovi",
  blogTitle: "Blog",
  blogAll: "Svi tekstovi",
  newest: "Najnovije",
  minutes: (m) => `${m} min čitanja`,
  workLabel: "Projekti",
  workTitle: "Odabrani projekti",
  workAll: "Svi projekti",
  workAllNote: "Studije slučaja sa brojevima, periodom i izvorom.",
  servicesLabel: "Usluge",
  servicesTitle: "Naše usluge",
  servicesAll: "Sve usluge",
  servicesHub: "/usluge",
  socialLabel: "Pratite nas",
  socialTitle: "Na mrežama",
  city: "© 2026 Digitl · Beograd / London",
  other: { label: "English", href: CONTACT.en, lang: "en" },
};

/* instagram.com/digitl.rs, read straight off the profile's address */
const handle = (href) => {
  const u = new URL(href);
  return `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/$/, "")}`;
};

function More({ href, children }) {
  return (
    <Link href={href} className={s.more}>
      {children}
      <i>
        <ArrowRight size={13} />
      </i>
    </Link>
  );
}

function SecHead({ label, title, href, more }) {
  return (
    <div className={s.secHead}>
      <div>
        <span className={b.label}>{label}</span>
        <h2>{title}</h2>
      </div>
      {href ? <More href={href}>{more}</More> : null}
    </div>
  );
}

/** A block below the fold rises in once, the first time it is seen. */
function Rise({ children, className, as = "section", ...rest }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  );
}

function Header() {
  const Ads = STICKERS.ads;
  const Seo = STICKERS.seo;
  const Social = STICKERS.social;
  return (
    <header className={s.head}>
      <div className={`${s.markWrap} ${b.fadeUp}`}>
        <span className={`${s.stk} ${s.stk1}`}>
          <Ads size="100%" />
        </span>
        <span className={`${s.stk} ${s.stk2}`}>
          <Seo size="100%" />
        </span>
        <span className={`${s.stk} ${s.stk3}`}>
          <Social size="100%" />
        </span>
        <Link href="/" className={s.mark} aria-label="Digitl, početna">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" width={64} height={64} />
        </Link>
      </div>
      <h1
        className={`${s.name} ${b.fadeUp}`}
        style={{ animationDelay: "80ms" }}
      >
        digitl
      </h1>
      <p
        className={`${s.kind} ${b.fadeUp}`}
        style={{ animationDelay: "130ms" }}
      >
        {T.kind}
      </p>
      <p
        className={`${s.claim} ${b.fadeUp}`}
        style={{ animationDelay: "190ms" }}
      >
        {T.claim[0]}
        <span>{T.claim[1]}</span>
      </p>
      <span
        className={`${s.slots} ${b.fadeUp}`}
        style={{ animationDelay: "250ms" }}
      >
        <span className={b.liveDot} />
        {T.slots}
      </span>
    </header>
  );
}

function Actions({ innerRef }) {
  const { openBooking } = useApp();
  const Second = T.second.Icon;
  return (
    <div
      ref={innerRef}
      className={`${s.actions} ${b.fadeUp}`}
      style={{ animationDelay: "320ms" }}
    >
      <button
        type="button"
        className={s.primary}
        onClick={() => openBooking(T.bookTopic)}
      >
        <span className={s.actIcon}>
          <Calendar size={20} />
        </span>
        <span className={s.actText}>
          <b>{T.book}</b>
          <small>{T.bookSub}</small>
        </span>
        <span className={s.actKey}>
          <ArrowRight size={18} />
        </span>
        <span className={s.shine} aria-hidden="true" />
      </button>
      <a className={s.secondary} href={T.second.href}>
        <span className={s.actIcon}>
          <Second size={19} />
        </span>
        <span className={s.actText}>
          <b>{T.second.label}</b>
          <small>{T.second.sub}</small>
        </span>
        <span className={s.actKey}>
          <ArrowRight size={18} />
        </span>
      </a>
    </div>
  );
}

function Posts({ articles }) {
  if (!articles.length) return null;
  const [lead, ...rest] = articles;
  return (
    <section
      className={`${s.sec} ${b.fadeUp}`}
      style={{ animationDelay: "420ms" }}
      aria-labelledby="bio-blog"
    >
      <SecHead
        label={T.blogLabel}
        title={<span id="bio-blog">{T.blogTitle}</span>}
        href="/journal"
        more={T.blogAll}
      />
      <div className={s.tray}>
        <Link href={`/journal/${lead.slug}`} className={s.lead}>
          <span className={s.leadPic}>
            {lead.cover
              ? // eslint-disable-next-line @next/next/no-img-element
                <img src={lead.cover} alt="" />
              : null}
            <span className={s.newChip}>{T.newest}</span>
          </span>
          <span className={s.leadText}>
            <span className={s.when}>
              {date(lead.publishedAt)}
              {lead.minutes ? ` · ${T.minutes(lead.minutes)}` : ""}
            </span>
            <b>{lead.title}</b>
          </span>
          <i className={s.key} aria-hidden="true">
            <ArrowRight size={16} />
          </i>
        </Link>
        {rest.slice(0, 3).map((a) => (
          <Link key={a.slug} href={`/journal/${a.slug}`} className={s.row}>
            <span className={s.rowPic}>
              {a.cover
                ? // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.cover} alt="" loading="lazy" />
                : null}
            </span>
            <span className={s.rowText}>
              <span className={s.when}>{date(a.publishedAt)}</span>
              <b>{a.title}</b>
            </span>
            <i className={s.keySm} aria-hidden="true">
              <ArrowRight size={14} />
            </i>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Work({ clients }) {
  if (!clients.length) return null;
  return (
    <Rise className={s.sec} aria-labelledby="bio-work">
      <SecHead
        label={T.workLabel}
        title={<span id="bio-work">{T.workTitle}</span>}
        href="/projects"
        more={T.workAll}
      />
      <div className={s.rail}>
        {clients.map((c) => {
          const m = c.metrics[0];
          return (
            <Link key={c.slug} href={c.href} className={s.case}>
              <span className={s.casePic}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.cover} alt="" loading="lazy" />
                {c.category
                  ? <span className={s.caseCat}>{c.category}</span>
                  : null}
                <i className={s.caseKey} aria-hidden="true">
                  <ArrowUpRight size={16} />
                </i>
              </span>
              <span className={s.caseText}>
                {m
                  ? <span className={s.metric}>
                      <b className={b.tnum}>{m.value}</b>
                      <small>{m.label}</small>
                    </span>
                  : null}
                <span className={s.caseName}>{c.name}</span>
              </span>
            </Link>
          );
        })}
        <Link href="/projects" className={`${s.case} ${s.caseAll}`}>
          <span className={s.caseAllText}>
            <b>{T.workAll}</b>
            <small>{T.workAllNote}</small>
          </span>
          <i className={s.caseKey} aria-hidden="true">
            <ArrowRight size={16} />
          </i>
        </Link>
      </div>
    </Rise>
  );
}

function Services() {
  return (
    <Rise className={s.sec} aria-labelledby="bio-services">
      <SecHead
        label={T.servicesLabel}
        title={<span id="bio-services">{T.servicesTitle}</span>}
        href={T.servicesHub}
        more={T.servicesAll}
      />
      <div className={`${s.tray} ${s.grid}`}>
        {SERVICE_PAGES.map((sv) => {
          const Sticker = STICKERS[sv.id];
          return (
            <Link key={sv.id} href={sv.page} className={s.svc}>
              <span className={s.svcSticker}>
                <Sticker size="100%" />
              </span>
              <b>{sv.footer}</b>
              <i className={s.svcKey} aria-hidden="true">
                <ArrowUpRight size={14} />
              </i>
            </Link>
          );
        })}
      </div>
    </Rise>
  );
}

function Socials() {
  if (!SOCIALS.length) return null;
  return (
    <Rise className={s.sec} aria-labelledby="bio-social">
      <SecHead
        label={T.socialLabel}
        title={<span id="bio-social">{T.socialTitle}</span>}
      />
      <div className={s.tray}>
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={s.social}
          >
            <span className={s.socialIcon}>
              <Icon />
            </span>
            <span className={s.rowText}>
              <b>{label}</b>
              <span className={s.when}>{handle(href)}</span>
            </span>
            <i className={s.keySm} aria-hidden="true">
              <ArrowUpRight size={14} />
            </i>
          </a>
        ))}
      </div>
    </Rise>
  );
}

/* Once the two big buttons are scrolled away, the same two come back as a
   small dock at the bottom, under the thumb. */
function Dock({ show }) {
  const { openBooking } = useApp();
  const Second = T.second.Icon;
  return (
    <AnimatePresence>
      {show
        ? <motion.div
            className={s.dock}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <a className={s.dockSecond} href={T.second.href}>
              <Second size={17} />
              {T.dockSecond}
            </a>
            <button
              type="button"
              className={s.dockBook}
              onClick={() => openBooking(T.bookTopic)}
            >
              {T.dockBook}
              <span className={s.dockArrow}>
                <ArrowRight size={15} />
              </span>
            </button>
          </motion.div>
        : null}
    </AnimatePresence>
  );
}

function Page({ articles, clients }) {
  const actions = useRef(null);
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = actions.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) =>
      setPast(!e.isIntersecting && e.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <main className={s.col}>
        <Header />
        <Actions innerRef={actions} />
        <Posts articles={articles} />
        <Work clients={clients} />
        <Services />
        <Socials />
        <footer className={s.foot}>
          <a href={`mailto:${CONTACT.email}`}>
            <Mail size={14} />
            {CONTACT.email}
          </a>
          <a href={T.other.href} hrefLang={T.other.lang} lang={T.other.lang}>
            {T.other.label}
            <ArrowUpRight size={12} />
          </a>
          <span>{T.city}</span>
        </footer>
      </main>
      <Dock show={past} />
    </>
  );
}

/** The page behind the link in Digitl's Instagram bio: who we are in one
    line, the two ways to reach us, then the newest posts, the work, the
    services and the profiles, each a thumb away on a phone. On a wide
    screen it stays a single centred column. */
export default function Bio({ articles = [], clients = [], fonts }) {
  return (
    <div
      className={`${b.root} ${fonts} ${s.page}`}
      data-own-chrome
      data-skin={CARD_SKIN}
    >
      <MotionConfig reducedMotion="user">
        <AppProvider home={false}>
          <Page articles={articles} clients={clients} />
          <Booking />
        </AppProvider>
      </MotionConfig>
    </div>
  );
}
