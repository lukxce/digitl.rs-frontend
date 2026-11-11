"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { STICKERS } from "../_usluge/Stickers";
import logo from "../assets/digitl-logo.png";
import { IconInstagram, IconLinkedin, IconX } from "../components/socialIcons";
import { CONTACT, SERVICES } from "./content";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Lock,
  Mail,
  Phone,
} from "./icons";
import n from "./nav.module.css";
import { Btn, EASE, useApp } from "./ui";

// The same menu everywhere: Usluge and Projekti are their own pages; the
// rest are sections of the homepage (reached by gliding there, or by going
// home first from an inner page). Every page ends with the contact form.
// Usluge also opens the five service pages beneath it (Luka, 11 Nov 2026:
// the hub must be reachable from the menu, for search and breadcrumbs).
export const LINKS = [
  { href: "/usluge", label: "Usluge", services: true },
  { href: "#proces", label: "Kako radimo" },
  { href: "/projects", label: "Projekti" },
  { href: "#kontakt", label: "Kontakt" },
];

export const INNER_LINKS = [
  { href: "/usluge", label: "Usluge", services: true },
  { href: "/#proces", label: "Kako radimo" },
  { href: "/projects", label: "Projekti" },
  { href: "#kontakt", label: "Kontakt" },
];

/** A link that glides when it points into this page and navigates otherwise. */
export function NavLink({ href, onGo, children, ...rest }) {
  if (href.startsWith("#"))
    return (
      <a href={href} onClick={(e) => onGo(e, href)} {...rest}>
        {children}
      </a>
    );
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/** Usluge in the bar and in the floating pill: the word goes to /usluge,
    and pointing at it (or pressing the arrow beside it) opens the five
    service pages and a way to all of them. */
function ServicesDrop({ href, label }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const timer = useRef(0);
  const id = useId();
  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  // a short grace, so a pointer crossing the gap to the panel keeps it
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 160);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      wrap.current?.querySelector("button")?.focus();
    };
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);
  const close = () => setOpen(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover intent only; the link and the arrow button carry the interaction
    <div
      ref={wrap}
      className={n.drop}
      data-open={open ? "true" : undefined}
      onPointerEnter={(e) => e.pointerType === "mouse" && show()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Link href={href} className={n.dropLink}>
        {label}
      </Link>
      <button
        type="button"
        className={n.dropBtn}
        aria-expanded={open}
        aria-controls={id}
        aria-label="Prikaži usluge"
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown size={14} />
      </button>
      <AnimatePresence>
        {open
          ? <motion.div
              id={id}
              className={n.panel}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <ul className={n.panelList}>
                {SERVICES.map((sv, i) => {
                  const Sticker = STICKERS[sv.id];
                  return (
                    <motion.li
                      key={sv.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + i * 0.03,
                        duration: 0.3,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={sv.page}
                        className={n.panelItem}
                        onClick={close}
                      >
                        <span className={n.panelSticker}>
                          <Sticker size="100%" />
                        </span>
                        <span className={n.panelText}>
                          <b>{sv.footer}</b>
                          <small>{sv.title}</small>
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <Link href={href} className={n.panelAll} onClick={close}>
                <span className={n.panelAllLabel}>Sve usluge</span>
                <b>Usluge digitalnog marketinga</b>
                <span className={n.panelAllNote}>
                  Jedna usluga ili ceo marketing kao jedan sistem.
                </span>
                <span className={n.panelAllArrow}>
                  <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          : null}
      </AnimatePresence>
    </div>
  );
}

/** One link of the bar or the pill; Usluge brings its panel. */
function BarLink({ l, onGo }) {
  if (l.services) return <ServicesDrop href={l.href} label={l.label} />;
  return (
    <NavLink href={l.href} onGo={onGo}>
      {l.label}
    </NavLink>
  );
}

export const SOCIALS = [
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

function Logo({ home, onGo }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt="" />
      <span>digitl</span>
    </>
  );
  return home
    ? <a
        href="#top"
        className={n.logo}
        aria-label="Digitl, na vrh"
        onClick={(e) => onGo(e, "#top")}
      >
        {inner}
      </a>
    : <Link href="/" className={n.logo} aria-label="Digitl, početna">
        {inner}
      </Link>;
}

/** The menu panel: pages on the left, how to reach us on the right. */
function Menu({ onClose, onBook, onGo, links }) {
  return (
    <motion.div
      className={n.sheet}
      role="dialog"
      aria-label="Meni"
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className={n.sheetMain}>
        <nav className={n.sheetLinks} aria-label="Stranica">
          {links.map((l, i) => [
            <motion.a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                onClose();
                onGo(e, l.href);
              }}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.05 + i * 0.04,
                duration: 0.35,
                ease: EASE,
              }}
            >
              {l.label}
              <ArrowRight size={15} />
            </motion.a>,
            l.services
              ? <motion.div
                  key={`${l.href}-sub`}
                  className={n.sheetSub}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.07 + i * 0.04,
                    duration: 0.35,
                    ease: EASE,
                  }}
                >
                  {SERVICES.map((sv) => {
                    const Sticker = STICKERS[sv.id];
                    return (
                      <Link key={sv.id} href={sv.page} onClick={onClose}>
                        <Sticker size={22} />
                        {sv.footer}
                      </Link>
                    );
                  })}
                </motion.div>
              : null,
          ])}
        </nav>
        <a className={n.login} href={CONTACT.hub}>
          <span className={n.loginIcon}>
            <Lock size={16} />
          </span>
          <span className={n.loginText}>
            <b>Prijava za klijente</b>
            <small>Izveštaji, odobrenja i zahtevi</small>
          </span>
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className={n.sheetSide}>
        <span className={n.status}>
          <i /> 2 slobodna mesta
        </span>
        <a className={n.contact} href={`mailto:${CONTACT.email}`}>
          <span>
            <Mail size={16} />
          </span>
          <b>{CONTACT.email}</b>
        </a>
        <a className={n.contact} href={`tel:${CONTACT.tel}`}>
          <span>
            <Phone size={16} />
          </span>
          <b>{CONTACT.phone}</b>
        </a>
        <div className={n.socials}>
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
        <Btn
          variant="accent"
          size="sm"
          onClick={() => {
            onClose();
            onBook();
          }}
        >
          Zakaži razgovor
        </Btn>
        <span className={n.city}>
          Beograd / London
          <a href={CONTACT.en} hrefLang="en" lang="en">
            English <ArrowUpRight size={12} />
          </a>
        </span>
      </div>
    </motion.div>
  );
}

/** A plain bar at the top that turns into a small pill and follows the page. */
export default function Nav() {
  const { openBooking, scrollTo, home } = useApp();
  const router = useRouter();
  const links = home ? LINKS : INNER_LINKS;
  // In-page links glide instead of jumping (Lenis is off on phones). Links
  // to another page, with or without a section ("/#usluge"), go through the
  // router, so they never depend on the browser's own jump to a fragment;
  // the homepage scrolls to the section itself when it arrives (ui.js).
  const go = (e, href) => {
    e.preventDefault();
    if (href.startsWith("#")) scrollTo(href);
    else router.push(href);
  };
  const [floating, setFloating] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setFloating(window.scrollY > window.innerHeight * 0.55);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    // Close once the page has really moved, not on the first stray scroll
    // event (a settling flick, the toolbar hiding, a late layout shift).
    const y0 = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - y0) > 48) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  const menuBtn = (cls) => (
    <button
      type="button"
      className={cls}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
    >
      <span className={n.burger} data-open={open ? "true" : undefined}>
        <i />
        <i />
      </span>
      Meni
    </button>
  );

  return (
    <>
      <header className={n.bar}>
        <Logo home={home} onGo={go} />
        <nav className={n.links} aria-label="Glavna">
          {links.map((l) => (
            <BarLink key={l.href} l={l} onGo={go} />
          ))}
        </nav>
        <div className={n.actions}>
          <a
            className={n.lang}
            href={CONTACT.en}
            hrefLang="en"
            lang="en"
            aria-label="English site"
          >
            EN
          </a>
          <Btn
            variant="accent"
            size="sm"
            onClick={() => openBooking()}
            className={n.cta}
          >
            Zakaži razgovor
          </Btn>
          {menuBtn(n.menuBtn)}
        </div>
        <AnimatePresence>
          {open && !floating
            ? <Menu
                onClose={() => setOpen(false)}
                onBook={() => openBooking()}
                onGo={go}
                links={links}
              />
            : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {floating
          ? <motion.div
              className={n.pill}
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Logo home={home} onGo={go} />
              <nav className={n.pillLinks} aria-label="Brze veze">
                {links.slice(0, 4).map((l) => (
                  <BarLink key={l.href} l={l} onGo={go} />
                ))}
              </nav>
              <span className={n.pillIcons}>
                <a href={`tel:${CONTACT.tel}`} aria-label="Pozovite">
                  <Phone size={15} />
                </a>
                <a href={`mailto:${CONTACT.email}`} aria-label="Pišite nam">
                  <Mail size={15} />
                </a>
              </span>
              {menuBtn(n.pillMenu)}
              <Btn
                variant="accent"
                size="sm"
                arrow={false}
                onClick={() => openBooking()}
              >
                Zakaži
              </Btn>
              <AnimatePresence>
                {open
                  ? <Menu
                      onClose={() => setOpen(false)}
                      onBook={() => openBooking()}
                      onGo={go}
                      links={links}
                    />
                  : null}
              </AnimatePresence>
            </motion.div>
          : null}
      </AnimatePresence>
    </>
  );
}
