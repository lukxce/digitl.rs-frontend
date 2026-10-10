/* Servis Klime Niš: the story told on /projects/servis-klime-nis.

   What is measured and where it comes from:
   - Page counts: the live sitemap of servisklimenis.rs, read 10 Oct 2026
     (4 service pages, 12 blog posts, a price list and a calculator).
   - PageSpeed 100 (mobile): Google PageSpeed test, August 2026, shown in the
     screenshot in the "Brzina" chapter.
   - Search positions: Google Search Console, 15 Jul to 12 Aug 2026.
   The earlier version of this study described a device catalogue; the site
   no longer has one (/shop is gone), so it is not mentioned here. */

const IMG = "https://cdn.sanity.io/images/203ybdbh/production";

const story = {
  slug: "servis-klime-nis",
  headline: "Sajt koji razdvaja kvar od kupovine.",
  standfirst:
    "Neko kome je klima stala u avgustu i neko ko u martu bira novu nisu isti posetilac. Za Servis Klime Niš smo napravili sajt sa sopstvenom stranicom za svaku uslugu, cenom vidljivom pre poziva i sadržajem koji radi i van sezone.",
  meta: [
    { label: "Klijent", value: "Servis Klime Niš" },
    { label: "Delatnost", value: "Servis klima uređaja" },
    { label: "Šta smo radili", value: "Sajt, SEO, sadržaj" },
    { label: "Podaci", value: "Stanje sajta, oktobar 2026." },
  ],
  services: ["Web", "SEO", "Sadržaj"],
  source:
    "Izvor: Google PageSpeed test (avgust 2026), Google Search Console (15. jul do 12. avgust 2026) i mapa sajta, oktobar 2026.",
  numbers: [
    { value: "100", label: "Google PageSpeed ocena", note: "na telefonu" },
    { value: "4", label: "usluge, svaka sa svojom stranicom", note: "" },
    { value: "12", label: "tekstova na blogu", note: "oktobar 2026." },
    {
      value: "3.",
      label: "prosečna pozicija za „klima uređaji niš“",
      note: "sredina avgusta 2026.",
    },
  ],

  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Dva različita čoveka otvaraju isti sajt.",
      body: [
        "Vrednost ovog sajta je u tome što razdvaja dve potpuno različite osobe koje mu dolaze: onog ko ima pokvarenu klimu i treba mu neko odmah, i onog ko tek bira šta da uradi sa svojom. Struktura servisnih stranica građena je tačno oko te razlike.",
      ],
      pull: "Neko ko zove u avgustu zbog kvara i neko ko planira kupovinu u martu nisu isti posetilac, i sajt im ne sme davati isti odgovor.",
    },
    {
      id: "struktura",
      kicker: "Struktura",
      title: "Četiri razloga da neko traži klima servis.",
      body: [
        "Dijagnostika, montaža, popravka i servis su četiri različita razloga zbog kojih neko traži klima servis, svaki sa svojom hitnošću i svojom pretragom u Google-u. Svaka je dobila svoju stranicu umesto da bude podnaslov na jednoj opštoj strani usluga.",
        "Struktura stranica je postavljena tako da svaka cilja svoj skup pretraga umesto da se sve tuku za isti opšti termin. Uz njih stoje cenovnik i kalkulator koji odgovara na pitanje koja snaga klime nekome uopšte treba.",
      ],
      media: [
        {
          src: `${IMG}/8f8f210716bab9b475d88eb7c1ca55f2a837578e-3200x1800.png`,
          alt: "Početna stranica sajta Servis Klime Niš",
          caption: "Početna: usluga, grad i poziv odmah na vrhu.",
        },
        {
          src: `${IMG}/71666c4fa3cb31afc825d0e816777bbf02455fc4-3200x1800.png`,
          alt: "Stranice usluga: dijagnostika, montaža, popravka i servis",
          caption: "Svaka usluga ima svoju stranicu.",
        },
      ],
      viz: {
        kind: "stat",
        items: [
          { value: "4", label: "stranice usluga" },
          { value: "1", label: "cenovnik sa cenama" },
          { value: "1", label: "kalkulator snage klime" },
        ],
      },
    },
    {
      id: "cena",
      kicker: "Poverenje",
      title: "Cena vidljiva pre poziva.",
      body: [
        "Kod većine konkurencije cena ostaje nepoznata dok se serviser ne pojavi na vratima. Ovde je vidljiva unapred, na stranici svake usluge i u cenovniku, kao stvarna razlika u pristupu, ne marketinška fraza.",
        "Pokrivenost je jednako jasna: sedam opština, Niš i okolina, uključujući Nišku Banju, Medijanu, Pantelej, Crveni Krst i Palilulu, navedeno na sajtu umesto podrazumevano.",
      ],
      media: [
        {
          src: `${IMG}/ef52679237363c5fc0743a2d63c7133a9e2c5dba-3200x1800.png`,
          alt: "Kontakt stranica sa pokrivenim opštinama",
          caption: "Kontakt i područje koje servis pokriva.",
        },
      ],
    },
    {
      id: "brzina",
      kicker: "Brzina",
      title: "Zašto sekunda učitavanja odlučuje ko će pozvati.",
      body: [
        "Klima servisi obično nemaju ni blizu ovakvu ocenu brzine, a ovaj sajt vraća 100 od 100 na mobilnom PageSpeed testu. Kad neko zove u paničnom stanju zbog vrućine u julu ili hladnog stana u januaru, svaka sekunda čekanja na učitavanje stranice je razlog da se ode na sledeći rezultat.",
        "Mobilni prikaz nosi prioritet jer najveći deo saobraćaja stiže sa telefona u trenutku kada nešto stane s radom.",
      ],
      media: [
        {
          src: `${IMG}/c4c35c3944828f05b5c40cd76bd86bf3ae08b2f9-3200x1800.png`,
          alt: "Google PageSpeed rezultat 100 na mobilnom testu",
          caption: "PageSpeed test na telefonu: 100 od 100.",
        },
        {
          src: `${IMG}/7c4ed8f794e94c4fbc5fbe35fd6c1c8a960919e8-3200x1800.png`,
          alt: "Mobilni prikaz sajta",
          caption: "Mobilni prikaz, pravljen kao glavni.",
        },
      ],
    },
    {
      id: "sadrzaj",
      kicker: "Sadržaj",
      title: "Mesec u godini koji konkurencija ignoriše.",
      body: [
        "Grejanje klimom zimi se pokazalo kao tema koju lokalna konkurencija skoro potpuno preskače. Svi pišu o hlađenju i montaži pred sezonu, dok o zimskoj upotrebi, poređenju potrošnje sa toplanom ili gasom na niskim temperaturama, gotovo niko lokalno ne piše ništa.",
        "Prvi tekst na blogu je posvećen tačno toj temi, sa konkretnim brojkama i poređenjem, ne uopštenim savetima. Danas ih je na blogu dvanaest: od potrošnje struje i izbora klime po kvadraturi do toga zašto klima curi vodu.",
        "To sajt pozicionira kao jedan od retkih lokalnih izvora koji odgovara i na pitanje o grejanju, ne samo o hlađenju. Neko ko tim putem reši problem zimi, po pravilu se vrati istoj firmi i za letnji servis.",
      ],
      media: [
        {
          src: `${IMG}/daf6d760ca966612e4abad10c159ed15cfa6df12-3200x1800.png`,
          alt: "Tekst na blogu o grejanju klimom zimi",
          caption: "Tekst o grejanju klimom, sa računicom.",
        },
      ],
    },
    {
      id: "pretraga",
      kicker: "Rezultati",
      title: "Prvi signali iz pretrage.",
      body: [
        "Posle prvih meseci sajt se u Nišu pojavljuje na prvoj strani Google-a za pretrage koje nose posao. Ovo su prosečne pozicije iz Search Console-a, ne jednokratna provera.",
        "Montaža je bila slabija tačka: te pretrage su tada bile daleko od prve strane.",
      ],
      viz: {
        kind: "table",
        title: "Prosečne pozicije u Google pretrazi",
        note: "Google Search Console, 15. jul do 12. avgust 2026.",
        columns: ["Pretraga", "Prosečna pozicija"],
        rows: [
          ["klima uređaji niš", "3"],
          ["klima servis niš", "7"],
          ["čišćenje klime niš cena", "9 do 11"],
        ],
      },
    },
  ],

  next: {
    title: "Šta još ne znamo, i šta sledi.",
    body: [
      "Ova studija pokazuje temelj i prve pozicije, ne pozive. Konkretne brojke poziva i upita su nešto što tek treba da se izmeri.",
      "Ono što je već na mestu je tehnički temelj koji nije ostavljen za kasnije i sadržaj koji pokriva zimsku upotrebu klime, deo tržišta koji konkurencija ostavlja potpuno praznim.",
    ],
  },

  takeaways: [
    {
      title: "Sezonski posao, sajt koji ne ćuti van sezone",
      text: "Klima je proizvod od dva meseca godišnje za većinu firmi u Nišu, leti se prodaje, a ostatak godine sajt praktično ćuti. Cilj ovde je bio suprotan: sadržaj i usluge koje rade tokom cele godine.",
    },
    {
      title: "Četiri usluge, četiri stranice",
      text: "Dijagnostika, montaža, popravka i servis su dobili svaku svoju stranicu. Svaka cilja svoj skup pretraga, umesto da se sve tuku za isti opšti termin.",
    },
    {
      title: "Cena vidljiva pre poziva",
      text: "Kod većine konkurencije cena ostaje nepoznata dok se serviser ne pojavi na vratima. Ovde je vidljiva unapred, kao stvarna razlika u pristupu, ne marketinška fraza.",
    },
  ],
};

export default story;
