/* ElektroMil: the story told on /projects/elektromil.

   What is measured and where it comes from:
   - "Prvi pozivi u prvom mesecu" and "najveći izvor novih klijenata do
     trećeg meseca" are the client's own account of where enquiries came
     from; they are an order of sources, not a count of calls.
   - Second organic result for "električar niš": a check of Google results
     for Niš on 27 Sep 2026 (OpenSEO audit).
   - Seven service pages: the live site, read 10 Oct 2026.
   We have no Search Console access for elektromilnis.rs, so there are no
   visit numbers here. Add them when there is access. */

const IMG = "https://cdn.sanity.io/images/203ybdbh/production";

const story = {
  slug: "elektromil",
  headline: "Od preporuke do najvećeg izvora upita za tri meseca.",
  standfirst:
    "Izgradili smo ElektroMilu sajt i lokalnu SEO osnovu od nule. Već u prvom mesecu sajt je počeo da donosi pozive. Do trećeg meseca postao je njihov najveći izvor novih klijenata, ispred preporuka koje su decenijama bile jedini kanal rasta.",
  meta: [
    { label: "Klijent", value: "ElektroMil, Niš" },
    { label: "Delatnost", value: "Elektroinstalaterske usluge" },
    { label: "Šta smo radili", value: "Sajt, lokalni SEO" },
    {
      label: "Podaci",
      value: "Prva tri meseca, i provera 27. septembra 2026.",
    },
  ],
  services: ["Web", "SEO"],
  source:
    "Izvor: redosled izvora upita prema ElektroMilu, i provera Google rezultata za Niš od 27. septembra 2026.",
  numbers: [
    { value: "1. mesec", label: "prvi pozivi sa pretrage", note: "" },
    {
      value: "3. mesec",
      label: "najveći izvor novih klijenata",
      note: "ispred preporuka",
    },
    {
      value: "2.",
      label: "rezultat na Google-u za „električar niš“",
      note: "27. septembar 2026.",
    },
    { value: "7", label: "usluga, svaka sa svojom stranicom", note: "" },
  ],

  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Bez prisustva na internetu, nema ni dolaznih upita.",
      body: [
        "ElektroMil ima više od decenije reputacije u Nišu, izgrađene isključivo na preporuci od usta do usta. Sa nultim digitalnim prisustvom, svaki novi posao je zavisio od preporuke ili starog klijenta koji se vraća.",
        "Vrednost ovog sajta leži u rešavanju vrlo konkretnog problema: iskusan majstor sa decenijom stvarnog rada iza sebe, potpuno nevidljiv za svakoga ko na internetu traži baš njegovu uslugu. Cilj nije bio napraviti nešto upečatljivo. Cilj je bio napraviti nešto što se rangira, brzo se učitava i navodi nekoga da podigne telefon.",
      ],
      media: [
        {
          src: `${IMG}/bd66e13588b4a1c5677d5c7053039c8f955bd8e2-1600x900.png`,
          alt: "Početna stranica sajta ElektroMil",
          caption: "Početna stranica.",
        },
      ],
    },
    {
      id: "istrazivanje",
      kicker: "Istraživanje",
      title: "Šta ljudi u Nišu zapravo kucaju u Google.",
      body: [
        "Pre nego što je napisan bilo koji red koda, istraženo je šta ljudi u Nišu zapravo kucaju u Google kada im treba električar. Ne opšti upiti, već konkretne pretrage vezane za konkretan problem: zamena osigurača, kvar na instalaciji, ugradnja klime, postavljanje EV punjača.",
        "Svaka od tih pretraga ima jasnu nameru. Osoba koja pretražuje je spremna da pozove, samo treba da pronađe pravog izvođača. Pretrage poput „električar Niš“ ili „ugradnja klime Niš“ nose visoku komercijalnu nameru, i cela strategija je izgrađena oko toga da ElektroMil bude najlakše pronađen odgovor u tom trenutku.",
      ],
      pull: "Osoba koja pretražuje je spremna da pozove, samo treba da pronađe pravog izvođača.",
    },
    {
      id: "struktura",
      kicker: "Struktura",
      title: "Sedam usluga, sedam stranica.",
      body: [
        "Na osnovu toga je izgrađena arhitektura sajta. Svaka usluga je dobila svoju stranicu, umesto da sve bude nabacano na jednu opštu stranicu usluga: elektroinstalacije, rasveta, osigurači i table, utičnice i prekidači, servis uređaja, ugradnja klima uređaja i ugradnja EV punjača.",
        "To je omogućilo da svaka stranica cilja svoj skup ključnih reči i da se pojavljuje u rezultatima pretrage za specifične upite, umesto da se sve stranice takmiče međusobno za iste opšte termine.",
      ],
      media: [
        {
          src: `${IMG}/aab8db1b77809898e29efee23f068f045acbcb3d-1600x900.png`,
          alt: "Primer stranice usluge na sajtu ElektroMil",
          caption: "Stranica jedne usluge.",
        },
        {
          src: `${IMG}/223afcd06c4a63c5c60cb5e5d998d69865ca8b9d-1600x900.png`,
          alt: "Galerija projekata na sajtu ElektroMil",
          caption: "Urađeni poslovi kao dokaz.",
        },
      ],
    },
    {
      id: "poziv",
      kicker: "Dizajn",
      title: "Svaka odluka je služila jednom cilju: da telefon zazvoni.",
      body: [
        "Broj telefona je vidljiv i klikabilan na svakoj poziciji skrolovanja. Nema nepotrebnih animacija, nema praznog teksta, nema dizajnerskog ukrasa koji ne služi cilju.",
        "Neko ko dođe na ovaj sajt već ima potrebu za električarom. Jedini preostali posao je da se ukloni svako trenje između dolaska na stranicu i poziva.",
      ],
      media: [
        {
          src: `${IMG}/c04ad9c024eca2c65ec26d0b6a3bc14fadfc4964-1600x900.png`,
          alt: "Poziv na akciju sa brojem telefona",
          caption: "Broj telefona na svakom koraku.",
        },
        {
          src: `${IMG}/ac070be14e3df329e216b19aa797bc5941ed0fd5-1600x900.png`,
          alt: "Mobilni prikaz sajta ElektroMil",
          caption: "Mobilni prikaz.",
        },
      ],
    },
    {
      id: "tehnika",
      kicker: "Tehnika",
      title: "Tehnički deo bez kompromisa.",
      body: [
        "Brzo učitavanje, mobilni prikaz kao prioritet, jer većina lokalnih pretraga dolazi sa telefona, čista URL struktura i ispravno indeksiranje kod Google-a.",
        "Ovo su stvari koje se lako zanemare, ali za lokalni servisni sajt prave razliku između toga da li ćete se pojaviti u prve tri pozicije ili ćete biti nevidljivi na drugoj strani rezultata.",
      ],
      media: [
        {
          src: `${IMG}/1d62c60a78cff9446f336e49750d5876bf067a5a-1600x900.png`,
          alt: "Tehnički prikaz brzine sajta",
          caption: "Brzina učitavanja.",
        },
      ],
    },
    {
      id: "ev-punjaci",
      kicker: "Otkriće",
      title: "EV punjači: niša koju niko nije pokrivao.",
      body: [
        "Jedna stvar se izdvojila u podacima koju nismo predviđali u tolikoj meri. Stranica za ugradnju EV punjača dovela je nesrazmerno veliki broj poseta i upita u odnosu na ostale usluge. Ispostavilo se da u Nišu praktično niko ozbiljno ne pokriva tu uslugu na internetu. Veliki igrači se fokusiraju na Beograd, a lokalni izvođači je uglavnom i ne pominju na sajtu, iako je rade.",
        "To je otkrilo praznu nišu tačno u trenutku kada je broj vlasnika električnih vozila počeo primetno da raste. ElektroMil se pozicionirao kao jedna od retkih ozbiljnih opcija u gradu za ugradnju EV punjača, i pozivi po tom osnovu i dalje redovno stižu.",
        "Ovo je dobar primer zašto je vredno graditi posebnu stranicu za svaku uslugu. Da EV punjači nisu imali sopstvenu stranicu, ta potražnja bi verovatno prošla potpuno nezapaženo.",
      ],
      media: [
        {
          src: `${IMG}/7d13f9b40d13d74b07caed08a1e7922d75b363c4-1600x900.png`,
          alt: "Stranica usluge ugradnje EV punjača",
          caption: "Ugradnja EV punjača kao posebna usluga.",
        },
      ],
    },
    {
      id: "rezultati",
      kicker: "Rezultati",
      title: "Rezultati su stigli brže nego što bi se očekivalo.",
      body: [
        "Za lokalni servisni biznis u gradu srednje veličine, dobro urađen lokalni SEO ne mora da bude igra čekanja od pola godine. Pretrage postoje svakog dana, namera je jasna, a kada sajt uđe na tržište gde je konkurencija slaba ili je uopšte nema, rangiranje dolazi relativno brzo.",
        "Već u prvom mesecu stigli su prvi pozivi direktno sa pretrage, pre bilo kakvog plaćenog oglašavanja. Do trećeg meseca sajt je postao najveći pojedinačni izvor novih klijenata za ElektroMil, prestigavši preporuke koje su decenijama bile jedini način da posao dođe do njih.",
        "Krajem septembra 2026. sajt je bio drugi rezultat na Google-u za pretragu „električar niš“.",
      ],
      viz: {
        kind: "compare",
        title: "Odakle stižu novi klijenti",
        note: "Prema ElektroMilu: redosled izvora, ne broj poziva.",
        rows: [
          {
            label: "Najveći izvor novih klijenata",
            from: "Preporuka",
            to: "Google pretraga",
          },
          {
            label: "Prisustvo na internetu",
            from: "Nikakvo",
            to: "Sajt sa sedam stranica usluga",
          },
          {
            label: "Pozicija za „električar niš“",
            from: "Nije u rezultatima",
            to: "Drugi rezultat",
          },
        ],
      },
    },
  ],

  next: {
    title: "Šta još ne znamo, i šta sledi.",
    body: [
      "Ova studija govori o redosledu izvora upita, onako kako ga vidi sam ElektroMil, ne o tačnom broju poziva po stranici. To je sledeće što treba izmeriti.",
      "Organska pretraga ima tu osobinu da što duže sajt postoji i što više sadržaja i poverenja gradi, to više prostora zauzima u rezultatima.",
    ],
  },

  takeaways: [
    {
      title: "Bez prisustva na internetu, nema ni dolaznih upita",
      text: "ElektroMil ima više od decenije reputacije u Nišu, izgrađene isključivo na preporuci od usta do usta. Sa nultim digitalnim prisustvom, svaki novi posao je zavisio od preporuke ili starog klijenta koji se vraća.",
    },
    {
      title: "Lokalna namera pretrage je bila prilika",
      text: "Pretrage poput „električar Niš“ ili „ugradnja klime Niš“ nose visoku komercijalnu nameru. Cela strategija je izgrađena oko toga da budemo najlakše pronađen odgovor u trenutku kada neko pretražuje.",
    },
    {
      title: "Lokalni SEO se brzo akumulira kada je konkurencija odsutna",
      text: "Većina lokalnih konkurenata ili nije imala sajt ili je imala sajt koji nije bio optimizovan ni za šta. Ta praznina je značila da dobro izgrađen, ispravno optimizovan sajt nije morao da čeka mesecima.",
    },
  ],
};

export default story;
