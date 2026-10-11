/* Moler Niš: the story told on /projects/moler-nis.

   What is measured and where it comes from:
   - PageSpeed 100 (mobile): Google PageSpeed test, August 2026, shown in the
     screenshot in the "Brzina" chapter.
   - Service pages, price list, paint calculator, 15 blog posts: the live
     sitemap of molernis.rs, read 11 Oct 2026.
   - First in search, the price list first for price searches, more than
     five calls a day three months after launch, clicks and impressions
     still growing, nothing spent on ads: Luka's own account, 11 Oct 2026.
     He runs the site and sees its calls and its Search Console. We could
     NOT check these in a tool (Google blocked an automated results check,
     and this site's Search Console is not readable from here), so confirm
     the wording with him before changing any of those lines.
   - Who the client is (a painting firm from Niš with no site and no name
     people would search for; we proposed the molernis.rs domain): Luka,
     11 Oct 2026. */

const IMG = "https://cdn.sanity.io/images/203ybdbh/production";

const story = {
  slug: "moler-nis",
  headline: "Od firme bez sajta do prvog mesta na Google-u za tri meseca.",
  standfirst:
    "Molerska firma iz Niša nije imala sajt, ni ime koje bi ljudi tražili. Predložili smo domen molernis.rs, ime koje je isto što i pretraga, i od nule napravili sajt sa jednim ciljem: da telefon zazvoni pre nego što konkurencija stigne do istog klijenta. Tri meseca kasnije sajt je prvi u pretrazi i donosi više od pet poziva dnevno, bez dinara za oglase.",
  meta: [
    { label: "Klijent", value: "Molerska firma iz Niša" },
    { label: "Delatnost", value: "Molerski radovi" },
    { label: "Šta smo radili", value: "Domen, sajt, SEO, sadržaj" },
    { label: "Podaci", value: "Prva tri meseca, stanje u oktobru 2026." },
  ],
  services: ["Web", "SEO", "Sadržaj"],
  source:
    "Izvor: Google PageSpeed test (avgust 2026), i pozicije u Google pretrazi i evidencija poziva za oktobar 2026.",
  numbers: [
    {
      value: "1.",
      label: "mesto na Google-u za molerske radove u Nišu",
      note: "tri meseca posle lansiranja",
    },
    {
      value: "5+",
      label: "poziva dnevno",
      note: "tri meseca posle lansiranja",
    },
    {
      value: "0 din.",
      label: "potrošeno na oglase",
      note: "svi pozivi stižu iz pretrage",
    },
    { value: "100", label: "Google PageSpeed ocena", note: "na telefonu" },
  ],

  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Firma bez sajta i bez imena koje se traži.",
      body: [
        "Klijent je firma koja se u Nišu bavi molerskim radovima. Pre saradnje nije imala sajt. Svaki novi klijent je stizao preko preporuke, a čim se krug poznanstava iscrpi, novih poziva više nema odakle da stignu. Za zanat koji zavisi od fizičkog prisustva na terenu, to je krug koji se sam zatvara, ne širi.",
        "Firma nije imala ni ime koje bi ljudi prepoznali i ukucali u pretragu. Zato smo predložili domen molernis.rs: ime koje je isto što i ono što ljudi traže. Ko ukuca „moler niš“, u rezultatima vidi adresu koja mu ponavlja sopstveno pitanje, a nov sajt bez istorije od prvog dana jasno govori i ljudima i Google-u o čemu je. Tako se do prve strane stiže brže nego sa imenom koje tek treba da se nauči.",
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
    },
    {
      id: "cena",
      kicker: "Poverenje",
      title: "Cena i obilazak kao deo dizajna.",
      body: [
        "Fiksna cena i besplatan obilazak su istaknuti na svakom koraku kroz sajt, ne samo u opisu usluge. Najveći strah kod ovakvih radova nije cena, nego neizvesnost oko nje, i sajt je građen da tu neizvesnost skloni pre poziva.",
        "Zato je cenovnik posebna stranica, sa cenom po vrsti posla. Mnogi uz uslugu odmah ukucaju i reč „cena“, pa je baš ta stranica danas prvi rezultat kad neko u Nišu traži koliko košta krečenje ili gletovanje.",
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
      title: "Sto od sto na telefonu, jer se moler traži s telefona.",
      body: [
        "Molera retko ko traži sa računara. Traži ga čovek koji stoji u sobi sa mrljom na plafonu i telefonom u ruci, često na slabom signalu. Ako stranica čeka tri sekunde, on se vraća na rezultate i zove sledećeg. Zato je brzina ovde merena tamo gde se odlučuje: na telefonu.",
        "Na Google PageSpeed testu za telefon sajt ima 100 od 100. Iza toga stoji nekoliko odluka donetih pre dizajna: stranice stižu gotove, umesto da se sklapaju u telefonu posetioca, slike se šalju u veličini ekrana koji ih traži, a font je deo sajta, pa tekst ne čeka drugi server i ne poskakuje kad se učita.",
        "Brzina je i signal za pretragu, jer je Google meri na svakoj stranici i uzima u obzir pri rangiranju. Dugmad za poziv su krupna i pod palcem, a redosled informacija na telefonu je isti kao na računaru, ne osiromašena verzija.",
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
      title:
        "Sadržaj za one koji traže majstora i za one koji se tek raspituju.",
      body: [
        "Vrednost ovog sajta je u vrlo konkretnom problemu koji rešava: firma koja zna razliku između pet vrsta glet mase i tri proizvođača boje bila je nevidljiva za svakog ko tu razliku traži na internetu. Na blogu je zato petnaest tekstova o onome što ljudi pitaju pre nego što pozovu majstora: koliko košta krečenje stana u Nišu, koliko gleta ide po kvadratu, jeftina ili skupa boja, zašto prvo krečenje u novogradnji pukne.",
        "Tako sajt ne privlači samo one koji majstora traže danas, nego i one koji se tek informišu. Kad im za mesec dana zatreba moler, već znaju čiji su savet čitali, i to ime im je prvo u glavi.",
        "Kalkulator boje i gleta radi isti posao drugim putem. Ko računa koliko mu materijala treba, već planira radove. Dobije okvirnu cifru i pre obilaska, a broj telefona mu je na istoj stranici, pa je od računice do poziva jedan dodir.",
      ],
    },
  ],

  next: {
    label: "Rezultat i sledeći koraci",
    title: "Prvo mesto u pretrazi, bez dinara za oglase.",
    body: [
      "Tri meseca posle lansiranja sajt je prvi u pretrazi za molerske radove u Nišu, a broj klikova i prikaza u Google-u raste iz meseca u mesec. Sa sajta stiže više od pet poziva dnevno.",
      "Zato je sledeći korak sadržaj, ne oglasi. Dok pretraga sama dovodi dovoljno posla, klijent nema potrebe da plaća reklame. Novi tekstovi i stranice idu tamo gde ljudi već pitaju, a dobrog odgovora u Nišu još nema.",
    ],
  },

  takeaways: [
    {
      title: "Ime koje je isto što i pretraga",
      text: "Firma bez prepoznatljivog imena dobila je domen molernis.rs. Nov sajt bez istorije tako od prvog dana govori i ljudima i Google-u o čemu je.",
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
