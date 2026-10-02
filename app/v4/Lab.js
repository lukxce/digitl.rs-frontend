"use client";

import b from "../v5/base.module.css";
import H01Search from "./heroes/H01Search";
import H02Pills from "./heroes/H02Pills";
import H03Wall from "./heroes/H03Wall";
import H04Spotlight from "./heroes/H04Spotlight";
import H05Phone from "./heroes/H05Phone";
import H06BeforeAfter from "./heroes/H06BeforeAfter";
import H07Bento from "./heroes/H07Bento";
import H08Report from "./heroes/H08Report";
import H09Chat from "./heroes/H09Chat";
import H10Type from "./heroes/H10Type";
import l from "./lab.module.css";

/* digitl.rs/v4: ten different heroes for the homepage, each a full working
   hero with the same headline, so they can be compared side by side and the
   winner moved into /v5. Brings its own chrome (data-own-chrome). */

const IDEAS = [
  {
    no: "01",
    name: "Prvo mesto",
    what: "Google pretraga u kojoj se vaš sajt penje do prvog mesta.",
    try: "Ukucajte svoju delatnost i grad u polje za pretragu.",
    Hero: H01Search,
  },
  {
    no: "02",
    name: "Usluge u ruci",
    what: "Usluge kao pilule koje padaju i slažu se, sa pravom fizikom.",
    try: "Uhvatite pilulu i bacite je. Tapnite da vidite šta je.",
    Hero: H02Pills,
  },
  {
    no: "03",
    name: "Zid radova",
    what: "Nagnut zid pravih sajtova naših klijenata koji stalno klizi.",
    try: "Pomerite miš preko zida, pređite preko sajta.",
    Hero: H03Wall,
  },
  {
    no: "04",
    name: "Reflektor",
    what: "Ispod naslova je skriven sav marketing koji radimo; kursor ga osvetli.",
    try: "Vozite miš po pozadini (na telefonu prstom).",
    Hero: H04Spotlight,
  },
  {
    no: "05",
    name: "Telefon zvoni",
    what: "Telefon na koji stižu upiti, onako kako izgleda kad marketing radi.",
    try: "Pomerite miš oko telefona, kliknite na njega.",
    Hero: H05Phone,
  },
  {
    no: "06",
    name: "Pre i posle",
    what: "Tipičan stari sajt naspram sajta koji smo napravili.",
    try: "Povucite ručicu levo-desno.",
    Hero: H06BeforeAfter,
  },
  {
    no: "07",
    name: "Bento uživo",
    what: "Mreža živih mini-prikaza za svaku uslugu, kao na bento početnoj.",
    try: "Pređite mišem preko pločica, kliknite na neku.",
    Hero: H07Bento,
  },
  {
    no: "08",
    name: "Izveštaj",
    what: "Mesečni izveštaj kakav dobijate, kao glavna slika.",
    try: "Menjajte period i kanal.",
    Hero: H08Report,
  },
  {
    no: "09",
    name: "Razgovor",
    what: "Ćaskanje u kom birate svoj problem i odmah dobijete prvi korak.",
    try: "Izaberite jedan od ponuđenih odgovora.",
    Hero: H09Chat,
  },
  {
    no: "10",
    name: "Velika slova",
    what: "Ogromna slova sa živim gradijentom u bojama digitla.",
    try: "Pomerite miš (prst) preko slova.",
    Hero: H10Type,
  },
];

export default function Lab({ clients, fonts }) {
  return (
    <div className={`${b.root} ${fonts} ${l.lab}`} data-own-chrome>
      <header className={l.top}>
        <span className={l.brand}>
          digitl <i>Hero laboratorija</i>
        </span>
        <span className={l.note}>10 ideja · birajte po broju</span>
      </header>
      <nav className={l.index} aria-label="Ideje">
        {IDEAS.map((x) => (
          <a key={x.no} href={`#h${x.no}`}>
            <b>{x.no}</b> {x.name}
          </a>
        ))}
      </nav>
      <main>
        {IDEAS.map(({ no, name, what, try: hint, Hero }) => (
          <section key={no} id={`h${no}`} className={l.idea}>
            <div className={l.meta}>
              <span className={l.no}>{no}</span>
              <div>
                <h2>{name}</h2>
                <p>{what}</p>
              </div>
              <span className={l.try}>Probajte: {hint}</span>
            </div>
            <div className={l.frame}>
              <Hero clients={clients} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
