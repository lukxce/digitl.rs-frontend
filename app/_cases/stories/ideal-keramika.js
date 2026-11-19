/* Ideal Keramika: the story on /projects/ideal-keramika. Accent: the web shop.

   Sources (studije-slucaja/assets/ideal-keramika/facts.md):
   - Catalogue: live sitemap 18 Nov 2026: 8.532 products, 122 categories, 43 brands, tiles 4.017.
   - Search Console (Fortress project 5), 17 Oct to 15 Nov 2026: 611 clicks, 9.506 impressions.
     Weeks: 19.10. 90, 26.10. 120, 2.11. 204, 9.11. 190. "oprema za kupatilo beograd" 2,0.
     Product name and code searches (codes 3 to 9,75, collections 2,5 to 5,3): average about 4,9.
   - Supplier imports 3.659 items; 8.033 photos to WebP, 755 MB to 445 MB.
   - Luka (18 Nov 2026): first sales 10 days after launch, as soon as Google indexed the site. */
import { img } from "./images";

const story = {
  slug: "ideal-keramika",
  sticker: "web",
  headline:
    "Web shop sa 8.532 proizvoda koji je za 30 dana dobio 611 poseta iz Google pretrage, a prve prodaje deset dana posle pokretanja.",
  standfirst:
    "Ideal Keramika je prodavnica pločica, sanitarija i opreme za kupatilo u Beogradu, sa dva salona. Dizajnirali smo i napravili njihov novi web shop od nule: katalog, filtere, pretragu, kupovinu, administraciju i uvoz cena od dobavljača. Prve prodaje stigle su deset dana posle pokretanja, čim je Google indeksirao sajt.",
  meta: [
    { label: "Klijent", value: "Ideal Keramika, Beograd" },
    { label: "Delatnost", value: "Pločice, sanitarije i oprema za kupatilo" },
    {
      label: "Šta smo radili",
      value: "Dizajn, izrada web shopa, katalog i uvoz, SEO",
    },
    { label: "Podaci", value: "17. oktobar do 15. novembar 2026." },
  ],
  services: ["Web shop", "Dizajn", "SEO"],
  source:
    "Izvor: sitemap sajta i Google Search Console, od 17. oktobra, kada je sajt prešao na idealkeramika.rs, do 15. novembra 2026.",
  numbers: [
    {
      value: "611",
      label: "poseta iz Google pretrage",
      note: "za prvih 30 dana",
    },
    {
      value: "10",
      label: "dana do prvih prodaja",
      note: "čim je Google indeksirao sajt",
    },
    { value: "8.532", label: "proizvoda na sajtu", note: "od 43 proizvođača" },
    {
      value: "72%",
      label: "poseta traži tačan proizvod",
      note: "po nazivu ili šifri",
    },
  ],
  chapters: [
    {
      id: "dizajn",
      kicker: "Dizajn",
      title: "Salon keramike, prenet na ekran.",
      body: [
        "U salonu kupac vidi pločicu u punoj veličini, pored kade i slavine. Na sajtu to mora da uradi fotografija. Zato je dizajn miran i taman: crno, belo i jedna crvena za akciju, da roba bude jedina boja na strani.",
        "Pločice, sanitarije, slavine, tuš kabine i nameštaj imaju svoja odeljenja, a naslovna vodi u njih velikim fotografijama. Svaka stranica je rađena prvo za telefon, jer se pločice najčešće biraju uveče, sa kauča. Besplatno savetovanje od 45 minuta u jednom od dva salona zakazuje se sa bilo koje stranice.",
      ],
      media: [
        {
          src: img("ideal-keramika/laptop"),
          alt: "Katalog na ekranu",
          caption: "Katalog kao izlog.",
        },
        {
          src: img("ideal-keramika/proizvod"),
          alt: "Stranica pločice",
          caption: "Pločica: format, svojstva i cena po m².",
        },
      ],
    },
    {
      id: "katalog",
      kicker: "Katalog i filteri",
      title: "4.017 pločica, i put do jedne za tri klika.",
      body: [
        "Kada je u jednom odeljenju četiri hiljade artikala, katalog je dobar onoliko koliko su dobri filteri. Svako odeljenje ima svoje: pločice po formatu, površini, masi i efektu, slavine po vrsti i montaži. Pored svake opcije piše koliko artikala ostaje kada se izabere, pa kupac nikad ne završi na praznoj strani.",
        "Pretraga predlaže dok kupac kuca: prvo marku, pa odeljenje, pa proizvode. Ko ukuca „calacatta“, dobije 104 pločice podeljene po kategoriji i proizvođaču, sa prečicama za najčešće formate.",
      ],
      media: [
        {
          src: img("ideal-keramika/kategorija"),
          alt: "Odeljenje pločica sa filterima",
          caption: "Pločice sa filterima i brojem artikala uz svaku opciju.",
        },
      ],
    },
    {
      id: "kupovina",
      kicker: "Kupovina",
      title: "Kupovina kakvu traže i kupac i majstor.",
      body: [
        "Pločice se kupuju po kvadratu, slavine po komadu, a investitor kupuje za celu zgradu. Kupovina je zato napravljena za sva tri: cena po m² ili po komadu sa stanjem na lageru, kupovina kao fizičko lice ili firma, dostava ili preuzimanje u salonu, nalog sa istorijom porudžbina i listom želja.",
        "Za investitore i izvođače prodavac u administraciji pravi ponudu i šalje je kao link i PDF, sa rokom važenja. Mejlovi za porudžbinu, upit i termin u salonu stižu i kupcu i prodaji.",
      ],
    },
    {
      id: "uvoz",
      kicker: "Uvoz i slike",
      title: "Cenovnik dobavljača ulazi u katalog bez prepisivanja.",
      body: [
        "Ideal Keramika radi sa mnogo dobavljača, i svaki šalje cenovnik u svojoj tabeli. Ručni unos hiljada artikala bio bi posao za mesece, a svaka nova cena još jedan dan posla.",
        "Za svakog dobavljača napravili smo uvoz koji čita njegovu tabelu, prepoznaje svojstva po vrsti proizvoda i upisuje artikle u katalog. Isti uvoz kasnije menja cene po šifri, sa rezervnom kopijom koja vraća sve kako je bilo. Fotografije smo prebacili u brz format za web, pa sajt učitava iste slike sa 41% manje podataka.",
      ],
      viz: {
        kind: "stat",
        items: [
          {
            value: "3.659",
            label: "artikala uvezeno iz tabela sedam dobavljača",
          },
          { value: "8.033", label: "fotografije prebačene u brz format" },
          { value: "41%", label: "manje podataka za iste slike" },
        ],
      },
    },
    {
      id: "pretraga",
      kicker: "Pretraga",
      title: "Svaki proizvod može da izađe na Google, od prvog dana.",
      body: [
        "Ko kupuje kupatilo, često već zna šta hoće: ukuca naziv kolekcije ili šifru slavine sa računa majstora. Zato smo za 8.182 proizvoda i 121 kategoriju napisali naslove i opise po pravilu, sa markom, kolekcijom, formatom i cenom. Stari sajt smo preusmerili na nove stranice, adresu po adresu, da se ništa od stare vidljivosti ne izgubi.",
        "Rezultat: Ideal Keramika se pojavljuje kada kupac ukuca „oprema za kupatilo beograd“, a za pretrage po nazivu i šifri proizvoda u proseku je među prvih pet rezultata. Odatle dolazi i 72% svih poseta.",
      ],
      piece: {
        kind: "serp",
        title: "Kupac je ukucao „oprema za kupatilo beograd“",
        site: "idealkeramika.rs",
        note: "Prosečna pozicija iz Google Search Console-a, 17. oktobar do 15. novembar 2026. Ostali rezultati su šematski.",
        queries: [{ q: "oprema za kupatilo beograd", pos: "2,0" }],
      },
      viz: {
        kind: "trend",
        title: "Posete iz Google pretrage po nedeljama",
        unit: "poseta nedeljno",
        note: "Search Console, pune nedelje od 19. oktobra do 15. novembra 2026.",
        points: [
          { label: "19. okt", value: 90 },
          { label: "26. okt", value: 120 },
          { label: "2. nov", value: 204 },
          { label: "9. nov", value: 190 },
        ],
      },
    },
    {
      id: "administracija",
      kicker: "Administracija",
      title: "Prodaja, salon i katalog iz jednog prozora.",
      body: [
        "Iza sajta je administracija koju koriste prodavci u oba salona. Porudžbine, upiti, ponude i zakazani termini stižu na jedno mesto, a uz svaki piše odakle je kupac došao: iz Google pretrage, sa Instagrama ili direktno.",
        "Iz istog prozora prodavac odgovara na upit mejlom, pravi ponudu za investitora, menja akcije i banere i dodaje nove proizvode. Obrazac za proizvod se menja po vrsti robe: pločica ima format i pakovanje, slavina završnicu.",
      ],
    },
    {
      id: "rezultat",
      kicker: "Rezultat",
      title:
        "Od kataloga u tabelama do prodavnice koja prodaje od desetog dana.",
      body: [
        "Ideal Keramika je dobila web shop koji pokazuje ceo asortiman, kupovinu za fizička lica, firme i investitore, uvoz cena bez prepisivanja i administraciju u kojoj prodaja vidi sve na jednom mestu. Prve prodaje stigle su deset dana posle pokretanja, a posete iz pretrage rastu iz nedelje u nedelju.",
      ],
      viz: {
        kind: "compare",
        title: "Prva i četvrta nedelja na novom domenu",
        note: "Search Console, 19. do 25. oktobra i 9. do 15. novembra 2026.",
        rows: [
          {
            label: "Posete iz pretrage",
            from: "90",
            to: "190",
            change: "2,1 puta više",
          },
          {
            label: "Prikazi u rezultatima",
            from: "1.750",
            to: "2.654",
            change: "1,5 puta više",
          },
        ],
      },
    },
  ],
  next: {
    label: "Sledeći koraci",
    title: "Vodiči za kupce i oglasi koji znaju šta je prodaja.",
    body: [
      "Sledeće su vodiči za kupce po odeljenjima, kalkulator pločica po pakovanju i povezivanje Google Analytics-a i oglasa sa izvorom svake porudžbine.",
    ],
  },
  takeaways: [],
};

export default story;
