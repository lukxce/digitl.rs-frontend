import styles from "./chooser.module.css";

export const metadata = {
  title: "digitl — koncepti početne",
  robots: { index: false, follow: false },
};

const CONCEPTS = [
  {
    href: "/bento/dijagnoza",
    name: "Odakle vam stižu klijenti?",
    layout: "Dijagnostika, horizontalno",
    note: "Početna prestaje da bude brošura. Jedan odgovor vodi sve ostalo: dijagram se popunjava prema vama, imenuje se rupa, bira se studija slučaja koja liči na vas, odgovara se na primedbu koju ćete pomisliti, i forma stiže već napola napisana.",
    lead: true,
  },
  {
    href: "/bento/final",
    muted: true,
    name: "Jedan sistem → rezultat",
    layout: "Horizontalno, osam poglavlja",
    note: "Finalni pravac: dijagram sistema i pre/posle spojeni u jednu priču. Numerisana poglavlja daju red, strana se greje iz sive u plavu kako prolazite, a svaki klijent ima jednu karticu sa pre i posle zajedno.",
    lead: true,
  },
  {
    href: "/bento/sistem",
    name: "Jedan sistem",
    layout: "Vertikalni masonry",
    muted: true,
    note: "Pozicioniranje nacrtano: pet kanala povezanih u jedan sistem, umesto liste usluga. Dijagram mora da se vidi ceo, pa je raspored vertikalan.",
  },
  {
    href: "/bento/tabla",
    name: "Radna tabla",
    layout: "Jedan ekran, bez skrola",
    muted: true,
    note: "Početna kao izveštaj koji klijent dobija. Brojevi su iz studija slučaja. Tabla koju moraš da skroluješ nije tabla, pa staje u jedan ekran.",
  },
  {
    href: "/bento/pre-posle",
    name: "Pre / posle",
    layout: "Horizontalno prevlačenje",
    muted: true,
    note: "Kretanje udesno je sama transformacija: strana se iz sive pretvara u plavu dok prelazite sa 'pre' na 'posle'.",
  },
  {
    href: "/bento/v1",
    name: "Prvi pokušaj",
    layout: "Horizontalna traka",
    note: "Prva verzija. Struktura preuzeta sa lukxce.com, sadržaj zamenjen — ostavljeno za poređenje.",
    muted: true,
  },
];

export default function BentoChooser() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Koncepti početne strane</h1>
      <p className={styles.lede}>
        Tri pravca, svaki sa rasporedom koji mu odgovara. Svi koriste stvarne
        brojeve iz studija slučaja.
      </p>
      <ul className={styles.list}>
        {CONCEPTS.map((c) => (
          <li key={c.href}>
            <a
              className={`${styles.card} ${c.lead ? styles.lead : ""} ${c.muted ? styles.muted : ""}`}
              href={c.href}
            >
              <span className={styles.layout}>{c.layout}</span>
              <span className={styles.name}>{c.name}</span>
              <span className={styles.note}>{c.note}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
