/* Praxis centar: the story on /projects/praxis-centar. Site redesign and the clinic's own platform (CRM).

   Sources (studije-slucaja/assets/praxis-centar/facts.md):
   - New site live on praxiscentar.rs 13 Nov 2026; Search Console has only 3 days of it (to 15 Nov), so NO
     before/after claim. Re-pull around 1 Dec 2026.
   - Search Console (Fortress project 7), 16 Oct to 12 Nov 2026 (old site): the /nas-tim doctor pages about 825
     clicks in 28 days; "praxis centar" position 1,03; "radan stojanovic" 1,1; the helikobakterija article 315
     clicks and 15.224 impressions in 28 days. Doctor pages kept on their old addresses, old URLs redirected.
   - Platform "Praxis Ordinacija" at platforma.praxiscentar.rs; screenshots are from the local DEMO with invented
     patients, prices and notes (never production). Whether the clinic uses every module daily: not verified.
   - "Dve decenije", "jedini smo": the clinic's own words, not used here. */
import { img } from "./images";

const story = {
  slug: "praxis-centar",
  headline:
    "Novi sajt za centar koji leči timom, i platforma za ordinaciju umesto Excel tabela.",
  standfirst:
    "Praxis centar je privatni centar za psihijatriju i psihoterapiju u Beogradu, na Vračaru, specijalizovan za lečenje poremećaja ishrane i gojaznosti timskim radom: psihijatar, psiholog, nutricionista i konsultanti iz Kliničkog centra rade sa istim pacijentom. Stari sajt to nije pokazivao, a termini, pacijenti i plaćanja vodili su se u tabelama. Napravili smo novi sajt i platformu za rad ordinacije, u kojoj je i blog koji centar sam objavljuje.",
  meta: [
    { label: "Klijent", value: "Praxis centar, Beograd" },
    { label: "Delatnost", value: "Psihijatrija i psihoterapija" },
    {
      label: "Šta smo radili",
      value: "Redizajn sajta, platforma za ordinaciju, blog",
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
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Centar koji leči timom, i sajt koji je izgledao kao jedan lekar.",
      body: [
        "Praxis leči poremećaje ishrane i gojaznost tako da sa istim pacijentom radi ceo tim. Stari sajt na WordPress-u to nije pokazivao: bio je spisak tekstova i stranica, a najviše poseta su donosile stranice pojedinačnih lekara.",
        "Iza sajta, termini, pacijenti i plaćanja vodili su se u tabelama, a zahtevi sa sajta stizali su mejlom.",
      ],
      media: [
        {
          src: img("praxis-centar/staro"),
          alt: "Stari sajt Praxis centra",
          caption: "Stari sajt, pre redizajna.",
        },
      ],
    },
    {
      id: "sajt",
      kicker: "Novi sajt",
      title: "Jedan stručnjak nije dovoljan. Zato radi ceo tim.",
      body: [
        "Novi sajt počinje od onoga po čemu se Praxis razlikuje: tim. Naslovna objašnjava kako psihijatar, psiholog, nutricionista i konsultanti rade zajedno, svaka usluga kaže kome je namenjena i ko je vodi, a svaki lekar ima svoju stranicu sa biografijom, oblastima rada i dugmetom za termin.",
        "Dizajn je miran, svetao i bez kliničke hladnoće, jer ovaj sajt čitaju ljudi koji se teško odlučuju da potraže pomoć.",
      ],
      media: [
        {
          src: img("praxis-centar/usluga"),
          alt: "Stranica usluge",
          caption: "Usluga: kome je namenjena i ko je vodi.",
        },
        {
          src: img("praxis-centar/tim"),
          alt: "Tim",
          caption: "Ceo tim na jednom mestu.",
        },
        {
          src: img("praxis-centar/doktor"),
          alt: "Stranica lekara",
          caption: "Stranica lekara sa zakazivanjem.",
        },
      ],
    },
    {
      id: "selidba",
      kicker: "Prelazak bez gubitka",
      title: "Nov sajt, iste adrese za sve što je već donosilo posete.",
      body: [
        "Najveća opasnost redizajna je da sajt izgubi ono što je Google već znao. Stranice lekara donosile su oko 825 poseta mesečno, a samo stranica prof. dr Radana Stojanovića bila je na drugom mestu u pretrazi. Zato su stranice lekara ostale na istim adresama, a stari tekstovi, kategorije i usluge preusmereni su na nove stranice.",
        "Prenesena su i 34 teksta sa starog sajta. Tekst o ishrani kod helikobakterije sam donosi preko 300 poseta mesečno.",
      ],
      widget: {
        kind: "steps",
        lines: [
          "Popis | Svaka adresa starog sajta i koliko poseta donosi.",
          "Iste adrese | Stranice lekara ostaju gde jesu, sa novim izgledom.",
          "Preusmerenja | Stari tekstovi, kategorije i usluge vode na nove stranice.",
          "Praćenje | Pozicije i posete posle prelaska, nedelju po nedelju.",
        ],
      },
    },
    {
      id: "platforma",
      kicker: "Platforma za ordinaciju",
      title:
        "Termini, pacijenti i plaćanja na jednom mestu, umesto u tabelama.",
      body: [
        "Pre nego što smo počeli, pogledali smo deset gotovih programa za ordinacije, osam stranih i dva domaća. Nijedan nije odgovarao načinu na koji Praxis radi, pa smo napravili sopstvenu platformu, Praxis Ordinacija.",
        "Na jednom ekranu je današnji dan: termini, ko je stigao, novi zahtevi sa sajta i neplaćeni pregledi. Kalendar ima kolonu za svakog lekara, zahtev sa sajta se potvrđuje jednim klikom, a svaki pacijent ima karton sa istorijom termina i plaćanja sa brojem fiskalnog računa. Recepcija vidi termine i plaćanja, ali nikada beleške sa terapije: to ne skriva ekran, nego server.",
      ],
      widget: {
        kind: "toggle",
        lines: [
          "A: Pre",
          "- Termini i pacijenti u Excel tabelama",
          "- Zahtevi sa sajta stižu mejlom",
          "- Izveštaj se sklapa ručno na kraju meseca",
          "B: Sa platformom",
          "- Kalendar sa kolonom za svakog lekara",
          "- Zahtev sa sajta se potvrđuje jednim klikom",
          "- Izveštaj o posetama i prihodu po lekaru u svakom trenutku",
        ],
      },
      media: [
        {
          src: img("praxis-centar/crm-danas"),
          alt: "Današnji dan u platformi",
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
          src: img("praxis-centar/crm-karton"),
          alt: "Karton pacijenta",
          caption: "Karton pacijenta sa istorijom termina.",
        },
        {
          src: img("praxis-centar/crm-izvestaji"),
          alt: "Izveštaji",
          caption: "Izveštaji po lekaru i usluzi.",
        },
        {
          src: img("praxis-centar/crm-prijava"),
          alt: "Prijava u platformu",
          caption: "Prijava u platformu. Podaci na slikama su izmišljeni.",
        },
      ],
    },
    {
      id: "blog",
      kicker: "Blog",
      title: "Tekstove pišu lekari, i objavljuju ih sami.",
      body: [
        "Blog je deo platforme: lekar napiše tekst u istom programu u kom vodi termine, i on se odmah pojavljuje na sajtu, sa naslovom i opisom za pretragu. Bez programera i bez čekanja.",
        "Tako se nastavlja ono što je i na starom sajtu donosilo najviše novih ljudi: stručni odgovori na pitanja koja pacijenti postavljaju Google-u.",
      ],
      media: [
        {
          src: img("praxis-centar/crm-blog"),
          alt: "Pisanje teksta u platformi",
          caption: "Novi tekst se piše u platformi.",
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
    title: "Sajt koji pokazuje tim, i ordinacija bez tabela.",
    body: [
      "Praxis centar je dobio sajt koji objašnjava kako leči, sa stranicama lekara na istim adresama koje Google već zna, i platformu u kojoj su termini, pacijenti, plaćanja i blog na jednom mestu.",
      "Sledeće je praćenje pretrage posle prelaska, stranice za opšte pretrage kao psihoterapija i psihijatar u Beogradu, i zakazivanje termina direktno sa sajta preko platforme.",
    ],
  },
  takeaways: [],
};

export default story;
