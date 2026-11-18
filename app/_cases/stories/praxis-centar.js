/* Praxis centar: the story on /projects/praxis-centar (rewritten 19 Nov 2026, humanize pass).

   Sources (studije-slucaja/assets/praxis-centar/facts.md):
   - New site live on praxiscentar.rs 13 Nov 2026; Search Console has 3 days of it, so NO before/after claim.
     Re-pull Fortress project 7 around 1 Dec 2026.
   - Search Console, 16 Oct to 12 Nov 2026 (old site): /nas-tim doctor pages about 825 clicks in 28 days;
     "praxis centar" 1,03; the helikobakterija article 315 clicks in 28 days.
   - Platform screenshots: local DEMO, invented patients. Reception never sees clinical notes (server-side).
   - Social media: Luka (19 Nov) will hand-pick posts; add a chapter when he sends them. */
import { img } from "./images";

const story = {
  slug: "praxis-centar",
  headline:
    "Novi sajt i program za termine, kartone i plaćanja za centar za psihijatriju i psihoterapiju u Beogradu.",
  standfirst:
    "Praxis centar je privatni centar za psihijatriju i psihoterapiju na Vračaru. Leče poremećaje ishrane i gojaznost, a sa jednim pacijentom radi više stručnjaka: psihijatar, psiholog, nutricionista i konsultanti iz Kliničkog centra. Stari sajt na WordPress-u to nije objašnjavao, a termini, pacijenti i plaćanja vodili su se u Excel tabelama. Napravili smo novi sajt i program za rad ordinacije, sa blogom koji lekari sami objavljuju.",
  meta: [
    { label: "Klijent", value: "Praxis centar, Beograd" },
    { label: "Delatnost", value: "Psihijatrija i psihoterapija" },
    {
      label: "Šta smo radili",
      value: "Redizajn sajta, program za ordinaciju, blog",
    },
    { label: "Godina", value: "2026." },
  ],
  services: ["Sajt", "CRM", "SEO"],
  source:
    "Izvor: Google Search Console, 28 dana pre prelaska na novi sajt (16. oktobar do 12. novembar 2026).",
  numbers: [
    {
      value: "825",
      label: "poseta mesečno sa stranica lekara",
      note: "sačuvane na istim adresama",
    },
    {
      value: "1.",
      label: "mesto za ime centra i imena lekara",
      note: "u Google pretrazi",
    },
    {
      value: "315",
      label: "poseta mesečno sa jednog teksta",
      note: "o ishrani kod helikobakterije",
    },
  ],
  chapters: [
    {
      id: "redizajn",
      kicker: "Redizajn",
      title: "Isti centar, sajt koji objašnjava ko radi sa pacijentom.",
      body: [
        "Na starom sajtu naslovna je bila jedan dugačak tekst. Na novom, naslovna objašnjava kako psihijatar, psiholog, nutricionista i konsultanti rade sa istim pacijentom, svaka usluga ima svoju stranicu sa opisom kome je namenjena, a svaki lekar stranicu sa biografijom i dugmetom za termin.",
        "Povucite crtu levo i desno da vidite stari i novi sajt.",
      ],
      piece: {
        kind: "beforeafter",
        title: "Naslovna strana",
        note: "Stari sajt je radio prethodni izvođač (snimak iz aprila 2026). Novi sajt je naš, uživo od 13. novembra 2026.",
        before: img("praxis-centar/staro"),
        after: img("praxis-centar/home"),
        beforeLabel: "Stari sajt",
        afterLabel: "Novi sajt",
      },
      media: [
        {
          src: img("praxis-centar/usluga"),
          alt: "Stranica usluge",
          caption: "Usluga: kome je namenjena i ko je vodi.",
        },
        {
          src: img("praxis-centar/doktor"),
          alt: "Stranica lekara",
          caption: "Stranica lekara sa zakazivanjem.",
        },
      ],
    },
    {
      id: "adrese",
      kicker: "Prelazak",
      title: "Stranice koje su donosile posete ostale su na istim adresama.",
      body: [
        "Kad se sajt menja, lako se izgube pozicije koje je Google već dao starim stranicama. Stranice lekara donosile su oko 825 poseta mesečno, a stranica prof. dr Radana Stojanovića bila je u proseku druga u pretrazi za njegovo ime.",
        "Zato su stranice lekara ostale na istim adresama, a stari tekstovi, kategorije i usluge preusmereni su na nove stranice. Prenesena su i 34 teksta sa starog sajta.",
      ],
      piece: {
        kind: "redirects",
        title: "Stare adrese posle prelaska",
        note: "Provereno na praxiscentar.rs, 18. novembar 2026.",
        rows: [
          {
            from: "/nas-tim/radan-stojanovic",
            to: "/nas-tim/radan-stojanovic",
            kind: "isto",
          },
          {
            from: "/nas-tim/marija-djurovic",
            to: "/nas-tim/marija-djurovic",
            kind: "isto",
          },
          {
            from: "/adhd-kod-odraslih",
            to: "/blog/adhd-kod-odraslih",
            kind: "301",
          },
          {
            from: "/category/arfid",
            to: "/blog/arfid-izbegavajuce-restriktivni-poremecaj-ishrane",
            kind: "301",
          },
          {
            from: "/category/psihoterapija",
            to: "/blog#psihoterapija",
            kind: "301",
          },
        ],
      },
    },
    {
      id: "program",
      kicker: "Program za ordinaciju",
      title: "Termini, pacijenti i plaćanja u jednom programu.",
      body: [
        "Pre nego što smo počeli, pogledali smo deset gotovih programa za ordinacije, osam stranih i dva domaća. Nijedan nije odgovarao načinu na koji Praxis radi, pa smo napravili program Praxis Ordinacija.",
        "Na jednom ekranu je današnji dan: termini, ko je stigao, novi zahtevi sa sajta i neplaćeni pregledi. Kalendar ima kolonu za svakog lekara, zahtev sa sajta se potvrđuje jednim klikom, a uz svako plaćanje stoji broj fiskalnog računa.",
      ],
      media: [
        {
          src: img("praxis-centar/crm-danas"),
          alt: "Današnji dan u programu",
          caption: "Današnji dan: termini, dolasci, zahtevi i plaćanja.",
        },
        {
          src: img("praxis-centar/crm-kalendar"),
          alt: "Kalendar",
          caption: "Kalendar sa kolonom za svakog lekara.",
        },
        {
          src: img("praxis-centar/crm-zahtevi"),
          alt: "Zahtevi sa sajta",
          caption: "Zahtevi za termin sa sajta.",
        },
        {
          src: img("praxis-centar/crm-izvestaji"),
          alt: "Izveštaji",
          caption:
            "Izveštaji po lekaru i usluzi. Podaci na slikama su izmišljeni.",
        },
      ],
    },
    {
      id: "uloge",
      kicker: "Ko šta vidi",
      title: "Beleške sa terapije vidi samo lekar.",
      body: [
        "Recepcija zakazuje termine i naplaćuje preglede, pa vidi kalendar, kontakt i plaćanja. Beleške sa terapije vidi samo lekar koji ih je napisao, a beleška se posle potpisa zaključava. Zabranu za recepciju proverava server, pa ne zavisi od toga šta je prikazano na ekranu.",
        "Izaberite ulogu i pogledajte isti karton.",
      ],
      piece: {
        kind: "roles",
        title: "Karton pacijenta",
        note: "Primer sa izmišljenim podacima.",
        roles: ["Recepcija", "Lekar"],
        fields: [
          { k: "Pacijent", v: "Ana Petrović, 34" },
          { k: "Sledeći termin", v: "Četvrtak, 12:00, psihoterapija" },
          { k: "Plaćanje", v: "Plaćeno, fiskalni račun 4471" },
          {
            k: "Beleška sa terapije",
            v: "Potpisana i zaključana, 14. novembar",
            hide: ["Recepcija"],
          },
          {
            k: "Plan lečenja",
            v: "Psihoterapija jednom nedeljno, kontrola kod nutricioniste",
            hide: ["Recepcija"],
          },
        ],
      },
    },
    {
      id: "blog",
      kicker: "Blog",
      title: "Tekstove pišu lekari i sami ih objavljuju.",
      body: [
        "Blog je deo istog programa. Lekar napiše tekst tamo gde vodi termine, doda naslov i opis za pretragu, i tekst se pojavljuje na sajtu.",
        "Stručni odgovori na pitanja koja pacijenti postavljaju Google-u donosili su najviše novih ljudi i na starom sajtu, pa se tu i nastavlja.",
      ],
      media: [
        {
          src: img("praxis-centar/crm-blog"),
          alt: "Pisanje teksta u programu",
          caption: "Novi tekst se piše u programu.",
        },
        {
          src: img("praxis-centar/blog"),
          alt: "Blog na sajtu",
          caption: "I pojavljuje se na sajtu.",
        },
      ],
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title: "Novi sajt na starim adresama i program za celu ordinaciju.",
    body: [
      "Praxis centar ima sajt koji objašnjava kako leči, stranice lekara na adresama koje Google već zna i program u kom su termini, pacijenti, plaćanja i blog.",
      "Sledeće je praćenje pretrage posle prelaska, stranice za opšte pretrage kao psihoterapija i psihijatar u Beogradu i zakazivanje termina sa sajta preko programa.",
    ],
  },
  takeaways: [],
};

export default story;
