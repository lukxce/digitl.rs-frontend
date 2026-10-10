/* Moler Niš: the story told on /projects/moler-nis.

   What is measured and where it comes from:
   - Page counts: the live sitemap of molernis.rs, read 10 Oct 2026
     (12 pages under /usluge: six services, a decorative-techniques hub and
     five technique pages; 15 blog posts; a price list; a paint calculator).
   - PageSpeed 100 (mobile): Google PageSpeed test, August 2026, shown in the
     screenshot in the "Brzina" chapter.
   There are no search or call numbers here yet: we had no readable Search
   Console data for this site when this was written. Add them when there is. */

const IMG = "https://cdn.sanity.io/images/203ybdbh/production";

const story = {
  slug: "moler-nis",
  headline: "Zanat koji se ne uklapa u jednu stranicu.",
  standfirst:
    "Za Moler Niš smo napravili sajt i lokalnu SEO osnovu od nule, sa fokusom na jednu stvar: da telefon zazvoni pre nego što konkurencija stigne do istog klijenta. Svaka usluga ima svoju stranicu, cena je vidljiva pre poziva, a sanacija vlage je prvi put dobila ozbiljan odgovor.",
  meta: [
    { label: "Klijent", value: "Moler Niš" },
    { label: "Delatnost", value: "Molerski radovi" },
    { label: "Šta smo radili", value: "Sajt, SEO, sadržaj" },
    { label: "Podaci", value: "Stanje sajta, oktobar 2026." },
  ],
  services: ["Web", "SEO", "Sadržaj"],
  source:
    "Izvor: Google PageSpeed test (avgust 2026) i mapa sajta molernis.rs, oktobar 2026.",
  numbers: [
    { value: "100", label: "Google PageSpeed ocena", note: "na telefonu" },
    {
      value: "12",
      label: "stranica usluga i tehnika",
      note: "šest usluga i dekorativne tehnike",
    },
    { value: "15", label: "tekstova na blogu", note: "oktobar 2026." },
    { value: "6", label: "usluga, svaka sa cenom", note: "" },
  ],

  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Reputacija bez traga na internetu.",
      body: [
        "Vrednost ovog sajta leži u rešavanju vrlo konkretnog problema: majstor koji zna razliku između pet vrsta glet mase i tri proizvođača boje, potpuno nevidljiv za svakog ko tu razliku traži na internetu. Svaka odluka na sajtu, od redosleda usluga do izbora reči u naslovu, služila je tom jednom cilju.",
        "Svaki novi klijent je stizao preko preporuke, a čim se krug poznanstava iscrpi, novih poziva više nema odakle da stignu. Za zanat koji zavisi od fizičkog prisustva na terenu, to je krug koji se sam zatvara, ne širi.",
      ],
      pull: "Nije bilo dovoljno da sajt izgleda lepo. Trebalo je da ga Google prepozna, a čovek sa mrljom na plafonu pronađe za deset sekundi.",
    },
    {
      id: "struktura",
      kicker: "Struktura",
      title: "Šest usluga, šest stranica.",
      body: [
        "Pre nego što je napisan bilo koji red teksta, pogledano je šta ljudi u Nišu zaista pišu u Google kad im zatreba moler: krečenje stana, gletovanje zida, farbanje fasade, mrlja od vlage na plafonu. Iza svake od tih fraza stoji drugačiji problem i drugačiji nivo hitnosti, pa je tako i sajt morao da bude podeljen.",
        "Krečenje, gletovanje, fasada, dekorativni premazi, tapete i sanacija vlage dobili su šest odvojenih stranica, svaka sa sopstvenim opisom procesa i cenom. Dekorativne tehnike imaju i svoje stranice: marmorino, venecijanski, sahara, travertino i stencil.",
        "Isti obrazac se ponavlja na svakoj stranici usluge: prvo šta tačno uključuje, zatim cena ili raspon, na kraju poziv na akciju. Kada radiš sa nekoliko marki i šest vrsta posla, dosledna struktura je jedini način da posetilac ne odustane usred čitanja.",
      ],
      media: [
        {
          src: `${IMG}/f5a3b867666adc831f869e75c09da5a11f4b5bb0-3200x1800.png`,
          alt: "Početna stranica sajta Moler Niš",
          caption: "Početna stranica.",
        },
        {
          src: `${IMG}/1f5a0ab74aa832197a7e2530597009fe6949528f-3200x1800.png`,
          alt: "Stranice usluga na sajtu Moler Niš",
          caption: "Svaka usluga ima svoju stranicu.",
        },
      ],
      viz: {
        kind: "stat",
        items: [
          { value: "6", label: "glavnih usluga" },
          { value: "5", label: "dekorativnih tehnika sa svojom stranicom" },
          { value: "1", label: "kalkulator boje i gleta" },
        ],
      },
    },
    {
      id: "cena",
      kicker: "Poverenje",
      title: "Cena i obilazak kao deo dizajna.",
      body: [
        "Fiksna cena i besplatan obilazak su istaknuti na svakom koraku kroz sajt, ne samo u opisu usluge. Najveći strah kod ovakvih radova nije cena, nego neizvesnost oko nje, i sajt je građen da tu neizvesnost skloni pre poziva.",
        "Na sajtu je navedeno i sa kojim markama boja se radi, Jub, Zvezda Helios, Caparol i Beckers, jer neko ko traži konkretnu marku ne treba da nagađa da li je moler uopšte ima na raspolaganju.",
      ],
      media: [
        {
          src: `${IMG}/c957d86c695adcc5438119edb4e5ccad73d18e7d-3200x1800.png`,
          alt: "Cenovnik molerskih radova",
          caption: "Cenovnik po vrsti posla.",
        },
        {
          src: `${IMG}/3ab0f0a628ea2252ff1695435242b40f9b4d196f-3200x1800.png`,
          alt: "Kontakt stranica sajta Moler Niš",
          caption: "Kontakt i područje koje pokriva.",
        },
      ],
    },
    {
      id: "brzina",
      kicker: "Brzina",
      title: "Kad brzina učitavanja postane deo zanatske reputacije.",
      body: [
        "Sto od sto na mobilnom PageSpeed testu nije nešto što se očekuje od sajta lokalnog zanatlije, to je nivo koji obično vide veliki brendovi sa timovima developera. Ovde znači da se stranica pojavi na ekranu pre nego što neko uopšte stigne da odloži telefon.",
        "Dugmad za poziv su krupna i dostupna palcem na prvi dodir, a redosled informacija na mobilnom je isti kao na desktopu, ne osiromašena verzija.",
      ],
      media: [
        {
          src: `${IMG}/d65883aa009074fd5537b447e087dca3ae03d3ff-3200x1800.png`,
          alt: "Google PageSpeed rezultat 100 na mobilnom testu",
          caption: "PageSpeed test na telefonu: 100 od 100.",
        },
        {
          src: `${IMG}/e568efdbc86b82061fa8933e853906958180afc7-3200x1800.png`,
          alt: "Mobilni prikaz sajta Moler Niš",
          caption: "Mobilni prikaz.",
        },
      ],
    },
    {
      id: "vlaga",
      kicker: "Prilika",
      title: "Usluga koju niko ne priznaje da radi.",
      body: [
        "Sanacija vlage se izdvojila kao posao koji gotovo svaki moler u gradu zapravo radi, ali retko ko je priznaje kao ozbiljnu, samostalnu uslugu. Obično se pominje u prolazu, kao dodatak uz krečenje, u najboljem slučaju jednom rečenicom.",
        "Za nekog ko uveče kuca „vlaga na zidu Niš“ u Google, rezultati pretrage su iznenađujuće prazni, iako je to posao koji se radi svakog meseca negde u gradu. Dobila je sopstvenu stranicu sa redosledom koji prati stvarni proces: prvo uzrok, zatim tretman i izolacioni premaz, tek na kraju gletovanje i krečenje.",
        "Taj konkretan, tehnički ton, umesto uopštene rečenice „rešavamo probleme sa vlagom“, jedan je od retkih ozbiljnih odgovora u Nišu na tu pretragu.",
      ],
      media: [
        {
          src: `${IMG}/bfe4a228bf03b1c9b82888019949feca9971da54-3200x1800.png`,
          alt: "Stranica usluge sanacije vlage",
          caption: "Sanacija vlage kao posebna usluga.",
        },
      ],
    },
    {
      id: "sadrzaj",
      kicker: "Sadržaj",
      title: "Blog koji odgovara na pitanja pre poziva.",
      body: [
        "Na blogu je petnaest tekstova o stvarima koje ljudi pitaju pre nego što pozovu majstora: koliko košta krečenje stana u Nišu, koliko gleta ide po kvadratu, jeftina ili skupa boja, zašto prvo krečenje u novogradnji pukne.",
        "Uz njih stoji kalkulator koji računa koliko boje i gleta treba za prostor, pa posetilac dobije okvirnu cifru i pre nego što zatraži obilazak.",
      ],
    },
  ],

  next: {
    title: "Šta još ne znamo, i šta sledi.",
    body: [
      "U ovoj studiji nema brojeva poziva ni poseta iz pretrage. Moler Niš pokriva Niš i okolinu, uključujući Nišku Banju, Medijanu, Pantelej i Crveni Krst, a šta mu sajt od toga donosi tek treba da se izmeri.",
      "Osnova koja već stoji su stranice napravljene oko stvarnih pretraga umesto pretpostavki, tehnički deo koji ne mora da se popravlja naknadno, i sadržaj koji pokriva posao koji ostatak lokalne konkurencije jednostavno preskače.",
    ],
  },

  takeaways: [
    {
      title: "Reputacija bez traga na internetu",
      text: "Svaki novi klijent je stizao preko preporuke, a čim se krug poznanstava iscrpi, novih poziva više nema odakle da stignu. Za zanat koji zavisi od fizičkog prisustva na terenu, to je krug koji se sam zatvara, ne širi.",
    },
    {
      title: "Šest usluga, šest stranica",
      text: "Krečenje, gletovanje, fasada, dekorativni premazi, tapete i sanacija vlage su šest različitih pretraga u Google-u. Neko ko traži isključivo fasadera ne treba da čita o tapetama da bi došao do onog što mu treba.",
    },
    {
      title: "Cena i obilazak kao deo dizajna",
      text: "Najveći strah kod ovakvih radova nije cena, nego neizvesnost oko nje, i sajt je građen da tu neizvesnost skloni pre poziva.",
    },
  ],
};

export default story;
