"use client";

import logo from "../assets/digitl-logo.png";
import b from "../v5/base.module.css";
import Bingo from "./Bingo";
import Break from "./Break";
import c from "./catalog.module.css";
import Chips from "./Chips";
import Cost from "./Cost";
import Device from "./Device";
import Globe from "./Globe";
import Serp from "./Serp";
import Spy from "./Spy";

const ITEMS = [
  {
    name: "Pokvarite sajt",
    why: "Jedno dugme pretvori uredan sajt u prosečan sajt malog biznisa: sporo učitavanje, kolačići, iskačući prozor, tekst koji skače. Pa ga popravi. Pokazuje razliku umesto da je opisuje.",
    where: "Uz uslugu Web, ili odmah posle heroja",
    El: Break,
  },
  {
    name: "Vaš uređaj kaže",
    why: "Bez ijednog unosa pročita ono što pregledač već zna (ekran, mreža, blokator oglasa, doba dana) i okrene to u poruku o vašem kupcu. Ništa se ne šalje.",
    where: "Između usluga i rezultata",
    El: Device,
  },
  {
    name: "Vi na prvom mestu",
    why: "Upišete delatnost i grad, i vidite Google rezultate sa vašom firmom. Klizačem je pomerate sa 10. na 1. mesto i vidite koliko klikova to nosi, po javnim podacima.",
    where: "Uz uslugu SEO",
    El: Serp,
  },
  {
    name: "100 žetona",
    why: "Raspodelite 100 žetona na oglase, SEO, sajt, mreže i brend. Kartica komentariše raspodelu, a raspodela postaje brief za prvi razgovor.",
    where: "Iznad kontakt forme",
    El: Chips,
  },
  {
    name: "Koliko vas košta jedan upit",
    why: "Budžet i broj upita, i odmah cena po upitu. Plus koliko upita više donosi 20% bolja cena. Čista matematika, bez ijedne tvrdnje o nama.",
    where: "Uz uslugu Plaćeno oglašavanje",
    El: Cost,
  },
  {
    name: "Agencijski bingo",
    why: "Devet obećanja koja ste već čuli od agencija. Skupite red i dobijete pečat. Šala koja kaže ono što mi ne obećavamo.",
    where: "Umesto trake „Nećete čuti od nas“",
    El: Bingo,
  },
  {
    name: "Špijun konkurencije",
    why: "Upišete ime ili sajt konkurenta i otvorite njegove aktivne oglase u javnim bibliotekama Mete i Google-a. Pravi podaci, jednim klikom.",
    where: "Uz rezultate ili kao zaseban alat",
    El: Spy,
  },
  {
    name: "Beograd · London",
    why: "Globus od tačaka koji se vrti, sa obe kancelarije i tačnim vremenom u oba grada. Mala, živa potvrda da smo stvarni ljudi na stvarnim mestima.",
    where: "U kontaktu ili u futeru",
    El: Globe,
  },
];

export default function V6({ fonts }) {
  return (
    <div className={`${b.root} ${fonts}`} data-own-chrome>
      <header className={c.bar}>
        <a href="/v5" className={c.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" />
          <span>digitl</span>
        </a>
        <nav className={c.index} aria-label="Elementi">
          {ITEMS.map((it, i) => (
            <a key={it.name} href={`#e${i + 1}`}>
              {String(i + 1).padStart(2, "0")}
            </a>
          ))}
        </nav>
        <a href="/v5" className={c.back}>
          Nazad na v5
        </a>
      </header>

      <main>
        <section className={c.intro}>
          <div className={b.container}>
            <span className={b.label}>v6 · Katalog elemenata</span>
            <h1 className={c.title}>
              Osam novih elemenata. Izaberite koji idu na sajt.
            </h1>
            <p className={b.intro}>
              Svaki radi uživo, isto kao što bi radio na sajtu. Ispod svakog
              piše šta radi i gde bismo ga stavili. Dovoljno je da mi javite
              brojeve.
            </p>
          </div>
        </section>

        {ITEMS.map(({ name, why, where, El }, i) => (
          <section
            key={name}
            id={`e${i + 1}`}
            className={c.item}
            data-alt={i % 2 ? "true" : undefined}
          >
            <div className={b.container}>
              <div className={c.head}>
                <span className={c.num}>{String(i + 1).padStart(2, "0")}</span>
                <div className={c.headText}>
                  <h2>{name}</h2>
                  <p>{why}</p>
                </div>
                <span className={c.where}>
                  <em>Predlog mesta</em>
                  {where}
                </span>
              </div>
              <div className={c.stage}>
                <El />
              </div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
