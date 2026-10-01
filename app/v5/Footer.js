"use client";

import logo from "../assets/digitl-logo.png";
import b from "./base.module.css";
import f from "./footer.module.css";
import GrowthField from "./GrowthField";
import { CHAPTERS } from "./Nav";
import { Btn, useApp } from "./ui";

export default function Footer({ articles }) {
  const { book, openAudit } = useApp();
  return (
    <footer className={f.footer} data-theme="dark">
      <div className={`${b.container} ${f.top}`}>
        <p className={f.line}>
          Rast koji se vidi <span>u prihodu.</span>
        </p>
        <div className={f.ctas}>
          <Btn variant="white" size="lg" arrow onClick={() => book()}>
            Zakažite strateški razgovor
          </Btn>
          <Btn variant="glass" size="lg" onClick={openAudit}>
            Proverite svoj sajt
          </Btn>
        </div>
      </div>

      <div className={f.land} aria-hidden="true">
        <GrowthField className={f.field} theme="blue" horizon={0.62} />
      </div>

      <div className={`${b.container} ${f.cols}`}>
        <div className={f.brand}>
          <a href="#top" className={f.logo} aria-label="Digitl, na vrh">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="" />
            <span>digitl</span>
          </a>
          <p>
            Agencija za rast. Strategija, oglasi, SEO, sajt i brend kao jedan
            sistem.
          </p>
          <p className={f.meta}>Beograd / London · hello@digitl.rs</p>
        </div>
        <nav className={f.col} aria-label="Poglavlja">
          <span>Priča</span>
          {CHAPTERS.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.n}. {c.label}
            </a>
          ))}
        </nav>
        <nav className={f.col} aria-label="Digitl">
          <span>Digitl</span>
          <a href="/projects">Projekti</a>
          <a href="/journal">Blog</a>
          <a href="mailto:hello@digitl.rs">Kontakt</a>
        </nav>
        {articles.length
          ? <nav className={f.col} aria-label="Sa bloga">
              <span>Sa bloga</span>
              {articles.map((a) => (
                <a key={a.slug} href={`/journal/${a.slug}`}>
                  {a.title}
                </a>
              ))}
            </nav>
          : null}
      </div>
      <div className={`${b.container} ${f.base}`}>
        <span>© 2026 Digitl</span>
        <span>Marketing koji se meri profitom, ne aktivnošću.</span>
      </div>
    </footer>
  );
}
