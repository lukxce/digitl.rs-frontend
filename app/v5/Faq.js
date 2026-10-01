"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import b from "./base.module.css";
import f from "./faq.module.css";
import { Plus } from "./icons";
import { Btn, EASE, Kicker, Reveal } from "./ui";

const FAQ = [
  {
    q: "Koliko brzo možemo da krenemo?",
    a: "Obično u roku od jedne do dve nedelje nakon dogovora, zavisno od obima i kapaciteta.",
  },
  {
    q: "Za koliko se vide prvi rezultati?",
    a: "Zavisi od kanala i konkurencije. Oglasi daju podatke od prvog dana, SEO traje duže. Kod ElektroMila su prvi upiti sa pretrage stigli već u prvom mesecu, a do trećeg je sajt postao najveći izvor novih klijenata.",
  },
  {
    q: "Šta ako nismo sigurni šta nam tačno treba?",
    a: "Zato i postoji prvi razgovor. Pogledamo brojeve i kažemo vam šta je prioritet, a šta može da čeka.",
  },
  {
    q: "Radite samo kompletne projekte ili i pojedinačne usluge?",
    a: "Oba, ali najbolje radimo kao stalni partner koji vodi ceo marketing.",
  },
  {
    q: "Kako izgleda komunikacija tokom saradnje?",
    a: "Direktno i redovno. Radite sa ljudima koji donose odluke, ne sa account menadžerom.",
  },
  {
    q: "Sa kakvim firmama najčešće radite?",
    a: "Od lokalnih biznisa do etabliranih brendova, svuda gde se marketing meri rezultatom.",
  },
  {
    q: "Mogu li da vidim sajtove koje ste napravili?",
    a: "Da. Svi projekti su na stranici Projekti, sa brojevima. Brzinu svakog sajta možete sami da izmerite u alatu na vrhu ove stranice.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className={b.section} data-theme="light">
      <span id="pitanja" className={b.anchor} />
      <div className={`${b.container} ${f.grid}`}>
        <div className={f.side}>
          <Reveal>
            <Kicker>Pitanja</Kicker>
          </Reveal>
          <Reveal i={1} as="h2" className={b.h2}>
            Pitanja koja čujemo pre prvog razgovora
          </Reveal>
          <Reveal i={2} as="p" className={f.sideText}>
            Kratki, iskreni odgovori. Za sve ostalo postoji razgovor od 30
            minuta, ili mejl.
          </Reveal>
          <Reveal i={3}>
            <Btn href="mailto:hello@digitl.rs" variant="ghost" size="md">
              hello@digitl.rs
            </Btn>
          </Reveal>
        </div>

        <ul className={f.list}>
          {FAQ.map((x, i) => {
            const on = open === i;
            return (
              <li key={x.q} className={f.item}>
                <button
                  type="button"
                  className={f.q}
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                >
                  <span>{x.q}</span>
                  <span className={`${f.icon} ${on ? f.iconOn : ""}`}>
                    <Plus size={16} strokeWidth={2.4} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {on
                    ? <motion.div
                        id={`faq-${i}`}
                        key="a"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className={f.aWrap}
                      >
                        <p className={f.a}>{x.a}</p>
                      </motion.div>
                    : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
