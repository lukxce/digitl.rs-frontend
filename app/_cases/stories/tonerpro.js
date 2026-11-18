/* TonerPro: the story on /projects/tonerpro. Everything from zero.

   Sources (studije-slucaja/assets/tonerpro/facts.md):
   - Live and indexable on tonerpro.rs from 1 Nov 2026. Search Console (Fortress project 13), 1 to 15 Nov:
     42 clicks, 980 impressions, first clicks 3 Nov; about 160 of 198 visible queries average 10 or better.
   - Catalogue 18 Nov: 522 products, 12 brands, 2.598 printer models, 598 printer pages.
   - 7 orders in the first 3 days: Luka's account (18 Nov 2026); the shop's database holds the ones
     that went through the cart, the rest came by phone and chat.
   - No AI model in the code: the finder is rule-based search. Do not call it AI.
   - Prices in the finder and quick order: TonerPro's own retail prices, 18 Nov 2026.
   - Seller and supplier are never named (Luka, 2 Nov). */
import { img } from "./images";

const T = (code, pages, price) => ({ code, pages, price });

const story = {
  slug: "tonerpro",
  headline:
    "Prodavnica tonera od nule za dve nedelje: 7 porudžbina u prva tri dana i prva strana Google-a prve sedmice.",
  standfirst:
    "TonerPro je online prodavnica tonera, kertridža i ribona sa isporukom po celoj Srbiji. Kada smo krenuli, postojao je samo spisak artikala kod veletrgovca. Uradili smo sve: ime i brend, web shop, katalog u kome je svaki toner povezan sa štampačima kojima odgovara, alate za kupce i firme, SEO i sadržaj.",
  meta: [
    { label: "Klijent", value: "TonerPro, Srbija" },
    { label: "Delatnost", value: "Toneri, kertridži i ribon trake" },
    {
      label: "Šta smo radili",
      value: "Ime, brend, web shop, alati, SEO, sadržaj",
    },
    { label: "Podaci", value: "1. do 15. novembar 2026." },
  ],
  services: ["Brend", "Web shop", "SEO"],
  source:
    "Izvor: Google Search Console i evidencija porudžbina, od pokretanja 1. novembra do 15. novembra 2026.",
  numbers: [
    {
      value: "7",
      label: "porudžbina u prva tri dana",
      note: "bez ijednog plaćenog oglasa",
    },
    {
      value: "2.",
      label: "dan, prvi kupci iz Google pretrage",
      note: "na potpuno novom domenu",
    },
    {
      value: "3/4",
      label: "pretraga je na prvoj strani",
      note: "u prvih 15 dana",
    },
    {
      value: "598",
      label: "stranica za modele štampača",
      note: "za 2.598 modela",
    },
  ],
  chapters: [
    {
      id: "brend",
      kicker: "Ime i brend",
      title: "Ime koje kaže šta prodaje, i četiri tačke boje.",
      body: [
        "Za toner se ne traži ljubav prema brendu, traži se sigurnost: da odgovara štampaču i da štampa kako treba. Ime TonerPro to kaže bez objašnjenja, a znak su četiri tačke boje iz kojih nastaje svaka odštampana strana.",
        "Svaki proizvod dobija svoju kutiju, nacrtanu iz podataka: šifra, boja i kapacitet su na istom mestu na svakoj kutiji, pa kupac na prvi pogled vidi da gleda pravi toner. Nema tuđih fotografija i nema dve iste slike za različite proizvode.",
      ],
      media: [
        {
          src: img("tonerpro/logo-ploca"),
          alt: "Znak TonerPro na četiri podloge",
          caption: "Znak na četiri podloge.",
        },
        {
          src: img("tonerpro/kutije"),
          alt: "Kutije proizvoda nacrtane iz podataka",
          caption: "Kutije nacrtane iz podataka.",
        },
        {
          src: img("tonerpro/boje"),
          alt: "Boje brenda",
          caption: "Mastilo nosi, žuta prodaje.",
        },
      ],
    },
    {
      id: "katalog",
      kicker: "Web shop i katalog",
      title: "Katalog u kome svaki toner zna kojim štampačima odgovara.",
      body: [
        "Najveći strah kupca tonera je da kupi pogrešan. Zato smo za svaki od 522 proizvoda napravili spisak štampača kojima odgovara, ukupno 2.598 modela, i od toga stranicu za svaki štampač, sa samo onim tonerima koji tu sigurno rade.",
        "Uz svaki zamenski toner piše koliko strana štampa i koliko košta jedna strana. Kupuje se bez naloga, pouzećem ili uplatom po predračunu, sa računom sa PDV-om za firme. Stranice se učitavaju odmah, i kada kategorija ima stotine artikala.",
      ],
      media: [
        {
          src: img("tonerpro/stampac"),
          alt: "Stranica štampača",
          caption: "Stranica štampača sa tonerima koji mu odgovaraju.",
        },
        {
          src: img("tonerpro/proizvod"),
          alt: "Stranica tonera 85A",
          caption: "Toner sa cenom po strani i proverom štampača.",
        },
      ],
    },
    {
      id: "pronadji",
      kicker: "Pronađi toner",
      title: "Kupac ukuca model štampača, sajt mu ponudi toner.",
      body: [
        "Malo ko zna šifru tonera napamet, ali svako može da pročita model sa štampača. Zato pretraga na sajtu prepoznaje i jedno i drugo, bez obzira na razmake, crtice i velika slova. Isto radi vodič „Pronađi toner“ u tri koraka i provera „Odgovara li mom štampaču?“ na svakom proizvodu.",
        "Probajte ispod: upišite model štampača ili izaberite jedan od ponuđenih.",
      ],
      piece: {
        kind: "finder",
        title: "Pronađite toner za svoj štampač",
        note: "Primer sa pravim podacima iz kataloga TonerPro, cene iz novembra 2026.",
        examples: ["Laser 107a", "MFP M130a", "P1102", "HL-L2350", "M404"],
        printers: {
          "HP Laser 107a": [
            T("106A", 1000, 810),
            T("106X", 2500, 1150),
            T("106XL", 5000, 1200),
          ],
          "HP LaserJet Pro MFP M130a": [
            T("17A", 1600, 670),
            T("17X", 4000, 860),
            T("19A", 12000, 860),
          ],
          "HP LaserJet Pro P1102": [T("85A", 2000, 670)],
          "Brother HL-L2350DW": [T("TN-2420", 1200, 1050)],
          "HP LaserJet Pro M404dn": [
            T("59A", 10000, 1390),
            T("59X", 10000, 1820),
          ],
        },
      },
    },
    {
      id: "firme",
      kicker: "Za firme",
      title: "Firma nalepi spisak, dobije korpu i predračun.",
      body: [
        "Kancelarija sa deset štampača ne kupuje toner po toner. Ima spisak šifara i treba joj predračun sa PDV-om, isti dan. Za takve kupce napravili smo brzu porudžbinu: firma nalepi spisak iz Excel-a, a sajt svaki red upari sa proizvodom, izračuna ukupno i stavi sve u korpu jednim klikom.",
        "Ko želi ponudu, pošalje upit sa štampačima i količinama, a upit stiže u administraciju da prodavac odgovori predračunom. Probajte: promenite količine ili dodajte šifru.",
      ],
      piece: {
        kind: "quickorder",
        title: "Brza porudžbina po šiframa",
        note: "Prave cene zamenskih tonera iz kataloga TonerPro, novembar 2026.",
        start: "85A 5\nTN-2420 2\nTK-1110 x3\n106A 4\nCF259X 1",
        items: {
          "85A": { name: "HP 85A zamenski", price: 670 },
          "17A": { name: "HP 17A zamenski", price: 670 },
          "106A": { name: "HP 106A zamenski", price: 810 },
          "106X": { name: "HP 106X zamenski", price: 1150 },
          "12A": { name: "HP 12A zamenski", price: 670 },
          "83A": { name: "HP 83A zamenski", price: 510 },
          CF259X: { name: "HP 59X zamenski", price: 1820 },
          "59X": { name: "HP 59X zamenski", price: 1820 },
          "TN-2420": { name: "Brother TN-2420 zamenski", price: 1050 },
          "TN-1050": { name: "Brother TN-1050 zamenski", price: 570 },
          "TK-1110": { name: "Kyocera TK-1110 zamenski", price: 480 },
          "TK-1150": { name: "Kyocera TK-1150 zamenski", price: 670 },
        },
      },
      media: [
        {
          src: img("tonerpro/brza"),
          alt: "Brza porudžbina na sajtu",
          caption: "Brza porudžbina na sajtu.",
        },
        {
          src: img("tonerpro/firme"),
          alt: "Upit za firme",
          caption: "Upit za ponudu. Podaci u obrascu su primer.",
        },
      ],
    },
    {
      id: "pretraga",
      kicker: "Pretraga i prvi kupci",
      title: "Prva strana Google-a za modele štampača, prve sedmice.",
      body: [
        "Novi domen obično mesecima čeka prve posete. TonerPro je dobio prve klikove iz Google pretrage drugog dana, jer je svaka stranica štampača odgovor na tačno ono što ljudi kucaju: model i reč toner. Stranice štampača objavljujemo u talasima, po tome koliko se koji model traži.",
        "U prva tri dana stiglo je 7 porudžbina, bez ijednog plaćenog oglasa. Opšte pretrage kao „toner“ su sledeći korak, preko bloga i vodiča.",
      ],
      piece: {
        kind: "serp",
        title: "Gde je TonerPro kada kupac traži toner za svoj štampač",
        site: "tonerpro.rs",
        note: "Prosečna pozicija iz Google Search Console-a, 1. do 15. novembar 2026. Ostali rezultati su šematski.",
        queries: [
          { q: "brother 2402 toner", pos: "2" },
          { q: "mfc-l2802dw toner", pos: "3" },
          { q: "toner bizhub c250i", pos: "3" },
          { q: "m227fdw toner", pos: "3,5" },
          { q: "canon ir1643i toner", pos: "5" },
          { q: "hp m130a toner", pos: "5,3" },
        ],
      },
      media: [
        {
          src: img("tonerpro/blog"),
          alt: "Blog TonerPro",
          caption: "Blog o tonerima i štampačima.",
        },
        {
          src: img("tonerpro/clanak"),
          alt: "Tekst na blogu",
          caption: "Tekst sa kratkim odgovorom na vrhu.",
        },
      ],
    },
    {
      id: "mreze",
      kicker: "Administracija i mreže",
      title:
        "Ceo posao iz jednog prozora, i kancelarijski humor na Instagramu.",
      body: [
        "Iza sajta je administracija napravljena za ovu prodavnicu: proizvodi sa cenom, stanjem i redosledom po potražnji, porudžbine sa statusom, upiti firmi, poruke iz četa, blog i statistika bez kolačića, koja pokazuje i šta su kupci tražili a nisu našli.",
        "O toneru niko ne želi da čita. O štampaču koji štampa prazne strane petkom u pet, želi svako. Instagram smo zato postavili oko situacija iz kancelarije, sa tonerom kao rešenjem, a uz porudžbinu idu nalepnice iz iste serije.",
      ],
      piece: {
        kind: "feed",
        title: "Predlog Instagram profila",
        note: "Objave za prvi mesec, novembar 2026.",
        cols: 3,
        items: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => img(`tonerpro/ig-${n}`)),
      },
      media: [
        {
          src: img("tonerpro/nalepnice"),
          alt: "Nalepnice u paketu",
          caption: "Nalepnice koje idu u paket.",
        },
      ],
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title:
      "Od spiska artikala do prodavnice koju kupci nalaze po modelu svog štampača.",
    body: [
      "Za dve nedelje TonerPro je dobio ime, brend, web shop sa 522 proizvoda i 598 stranica štampača, alate koji kupcu nađu pravi toner i firmama skrate naručivanje, prvu stranu Google-a za stotine modela štampača i 7 porudžbina u prva tri dana.",
      "Sledeće su ponude za firme sa PDF predračunom, sledeći talas stranica štampača po potražnji i tekstovi za opšte pretrage.",
    ],
  },
  takeaways: [],
};

export default story;
