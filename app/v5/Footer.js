"use client";

import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import { CONTACT } from "./content";
import f from "./footer.module.css";
import { Lock } from "./icons";
import { LINKS, SOCIALS } from "./Nav";

export default function Footer() {
  return (
    <footer className={f.footer}>
      <div className={b.container}>
        <div className={f.card}>
          <div className={f.row}>
            <div className={f.brand}>
              <a href="#top" className={f.logo} aria-label="Digitl, na vrh">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt="" />
                <span>digitl</span>
              </a>
              <p>
                Agencija za rast. Strategija, oglasi, SEO, sajt i brend kao
                jedan sistem.
              </p>
            </div>
            <nav className={f.links} aria-label="Na ovoj stranici">
              {LINKS.map((l) => (
                <a key={l.href} href={l.href}>
                  {l.label}
                </a>
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
