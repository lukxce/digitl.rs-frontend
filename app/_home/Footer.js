"use client";

import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { CONTACT } from "./content";
import f from "./footer.module.css";
import { Lock } from "./icons";
import Link from "next/link";
import { INNER_LINKS, LINKS, NavLink, SOCIALS } from "./Nav";
import { useApp } from "./ui";

export default function Footer() {
  const { scrollTo, home } = useApp();
  const links = home ? LINKS : INNER_LINKS;
  const go = (e, href) => {
    e.preventDefault();
    scrollTo(href);
  };
  return (
    <footer className={f.footer}>
      <div className={b.container}>
        <div className={f.card}>
          <div className={f.row}>
            <div className={f.brand}>
              {home
                ? <a
                    href="#top"
                    className={f.logo}
                    aria-label="Digitl, na vrh"
                    onClick={(e) => go(e, "#top")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt="" />
                    <span>digitl</span>
                  </a>
                : <Link
                    href="/"
                    className={f.logo}
                    aria-label="Digitl, početna"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt="" />
                    <span>digitl</span>
                  </Link>}
              <p>
                Full-Service marketing agencija. Sve što vaš biznis traži, na
                jednom mestu.
              </p>
            </div>
            <nav className={f.links} aria-label="Na ovoj stranici">
              {links.map((l) => (
                <NavLink key={l.href} href={l.href} onGo={go}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className={f.socials}>
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
          </div>
          <div className={f.base}>
            <span>© 2026 Digitl · Beograd / London</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.en} hrefLang="en" lang="en">
              English
            </a>
            <a className={f.login} href={CONTACT.hub}>
              <Lock size={13} />
              Prijava za klijente
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
