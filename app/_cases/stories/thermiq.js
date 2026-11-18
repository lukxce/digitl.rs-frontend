/* ThermiQ: the story on /projects/thermiq (rewritten 18 Nov 2026).

   Every number is measured, nothing is inflated:
   - Search: Search Console via Fortress HQ (project 6), 18 Aug to 16 Nov 2026 (91 days): 4.719 clicks,
     106.019 impressions, avg position 7,2. Weekly totals in WEEKS. "80 a week" is the first week of July.
   - Of the 500 most common queries 376 average position 10 or better, 64 position 3 or better.
   - Blog: 376 clicks, 18.623 impressions; the 91 days before: 92 and 4.961.
   - Calculators: radiators 52 clicks, 2.250 impressions, pos 4,6; heat pump 23 clicks, 572 impressions, pos 5,5.
     GA4 calculator_result 69 (11 Aug to 17 Nov).
   - GA4 (G-E85LZPHST9), 11 Aug to 17 Nov 2026: 7.288 visits, 6.058 from search (83%), 213 from AI assistants
     (Aug 26, Oct 67 = 2,6x). Purchases, calls and enquiries tracked from 3 Nov: 10, 41 and 7 to 17 Nov.
   - Luka (18 Nov 2026): an enquiry that came from ChatGPT turned into an order; filters show in search.
   - Site: 4.275 products, 129 categories, 16 posts, 3 calculators (sitemap, 18 Nov 2026).
   - Price tool: first live run 9 Nov 2026 (479 prices, 436 up, 12 over 15%). */
import { img } from "./images";

const story = {
  slug: "thermiq",
  headline:
    "Prodavnica opreme za grejanje koja za tri meseca dobija 4.719 poseta iz Google pretrage, i sve oko nje.",
  standfirst:
    "Thermiq je prodavnica opreme za grejanje, klimatizaciju, vodovod i sanitarije u Beogradu: kotlova, toplotnih pumpi, klima uređaja, radijatora i bojlera. Za njih smo uradili sve: web shop od nule, pretragu i sadržaj, novi vizuelni identitet, društvene mreže, oglase i alate koji prodavnici štede rad.",
  meta: [
    { label: "Klijent", value: "Thermiq DS, Beograd" },
    {
      label: "Delatnost",
      value: "Grejanje, klimatizacija, vodovod i sanitarije",
    },
    {
      label: "Šta smo radili",
      value: "Web shop, SEO, brend, mreže, oglasi, alati",
    },
    { label: "Podaci", value: "Avgust do novembar 2026." },
  ],
  services: ["Web shop", "SEO", "Brend", "Mreže", "Oglasi"],
  source:
    "Izvor: Google Search Console i Google Analytics 4, od 18. avgusta do 16. novembra 2026. Početak jula je iz iste evidencije.",
  numbers: [
    {
      value: "7×",
      label: "više poseta iz pretrage nedeljno",
      note: "sa 80 u julu na 561 u novembru",
    },
    {
      value: "4.719",
      label: "poseta iz Google pretrage",
      note: "za 91 dan, nijedna plaćena",
    },
    {
      value: "106.019",
      label: "prikaza u Google rezultatima",
      note: "oko 2.140 dnevno u novembru",
    },
    {
      value: "376",
      label: "pretraga na prvoj strani",
      note: "u proseku, od 500 najčešćih",
    },
  ],
  chapters: [
    {
      id: "web-shop",
      kicker: "Web shop",
      title: "Web shop sa 4.275 proizvoda, napravljen da ga Google pročita.",
      body: [
        "Kupac u ovoj industriji retko ukuca ime prodavnice. Ukuca tačan model ili pitanje: koja pumpa za 200 kvadrata, koliko košta podno grejanje. Sajt smo zato napravili tako da svaki artikal, svaka kategorija i svaki odgovor mogu sami da izađu u pretrazi.",
        "Svih 4.275 stranica proizvoda ima optimizovan naslov i opis, sa modelom, markom i onim što kupac kuca. Kupovina radi na računaru i telefonu, sa isporukom po celoj Srbiji i plaćanjem na rate. Najviše poseta iz pretrage i dalje dolazi pravo na proizvode: pretraga dovodi ljude koji znaju šta kupuju.",
      ],
      viz: {
        kind: "trend",
        title: "Posete iz Google pretrage po nedeljama",
        unit: "poseta nedeljno",
        note: "Search Console, prva nedelja jula i pune nedelje od 17. avgusta do 15. novembra 2026.",
        points: [
          { label: "jul", value: 80 },
          { label: "17. avg", value: 200 },
          { label: "24. avg", value: 290 },
          { label: "31. avg", value: 240 },
          { label: "7. sep", value: 257 },
          { label: "14. sep", value: 343 },
          { label: "21. sep", value: 341 },
          { label: "28. sep", value: 291 },
          { label: "5. okt", value: 338 },
          { label: "12. okt", value: 485 },
          { label: "19. okt", value: 360 },
          { label: "26. okt", value: 496 },
          { label: "2. nov", value: 561 },
          { label: "9. nov", value: 517 },
        ],
      },
      media: [
        {
          src: img("thermiq/proizvod"),
          alt: "Stranica proizvoda",
          caption: "Stranica proizvoda.",
        },
        {
          src: img("thermiq/kategorija"),
          alt: "Kategorija toplotne pumpe",
          caption: "Kategorija sa filterima po marki i snazi.",
        },
      ],
    },
    {
      id: "kategorije",
      kicker: "Kategorije i filteri",
      title:
        "Kategorije i filteri koji izlaze na pretragu po marki, vrsti i snazi.",
      body: [
        "Katalog je složen u 129 kategorija, i svaka je dobila svoj naslov, opis i artikle. Tako Thermiq izlazi i kada kupac još nije izabrao model, nego traži vrstu uređaja ili marku.",
        "Isto važi i za filtere: kupac koji ukuca marku i snagu, kao „klima 24 btu“, stiže pravo na uređaje te snage. Izaberite pretragu ispod i pogledajte gde je Thermiq.",
      ],
      piece: {
        kind: "serp",
        title: "Gde je Thermiq kada kupac traži",
        site: "thermiq.rs",
        note: "Prosečna pozicija iz Google Search Console-a, 18. avgust do 16. novembar 2026. Ostali rezultati su šematski.",
        queries: [
          { q: "romstal kotao na drva", pos: "1,8" },
          { q: "calidor radijatori", pos: "2,9" },
          { q: "romstal radijatori", pos: "3,4" },
          { q: "kotao na biomasu", pos: "4,6" },
          { q: "vision kotao na pelet", pos: "4,7" },
          { q: "romstal 12000 btu", pos: "5,8" },
        ],
      },
    },
    {
      id: "kalkulatori",
      kicker: "Kalkulatori",
      title: "Kalkulatori koji dovode kupca dok tek istražuje.",
      body: [
        "Pre nego što kupi radijator ili toplotnu pumpu, čovek pita koliko snage mu treba. Ko dobije odgovor, dobije i kupca. Zato smo napravili tri kalkulatora: za radijatore, toplotne pumpe i klime.",
        "Kalkulator traži nekoliko podataka o prostoru i za minut daje preporuku, sa proizvodima koji odgovaraju i brojem telefona prodavca. Kalkulatori su na prvoj strani Google-a za pretrage koje ljudi zaista kucaju, a 69 ljudi je do kraja izračunalo šta im treba.",
      ],
      viz: {
        kind: "table",
        title: "Kalkulatori u pretrazi",
        note: "Search Console, 18. avgust do 16. novembar 2026.",
        columns: ["Šta je kupac ukucao", "Prosečna pozicija"],
        rows: [
          ["kalkulator radijatora", "4,6"],
          ["snaga radijatora po rebru", "3,9"],
          ["kalkulator za toplotnu pumpu", "5,2"],
          ["jačina toplotne pumpe za 200 kvadrata", "3,8"],
        ],
      },
      media: [
        {
          src: img("thermiq/kalkulator"),
          alt: "Kalkulator za toplotnu pumpu",
          caption: "Kalkulator za toplotnu pumpu: četiri koraka do preporuke.",
        },
      ],
    },
    {
      id: "blog",
      kicker: "Blog",
      title: "Saveti za kupce, i deo sajta koji najbrže raste.",
      body: [
        "Blog odgovara na pitanja koja kupci postavljaju pre kupovine i posle ugradnje: koliki treba da bude pritisak u kotlu, koliko kW pumpe treba kući, koliko rebara radijatora ide po kvadratu. Svaki tekst se završava proizvodom koji rešava to pitanje.",
        "Za tri meseca blog je doneo četiri puta više poseta nego u prethodna tri.",
      ],
      viz: {
        kind: "compare",
        title: "Blog, prethodna tri meseca i poslednja tri",
        note: "Search Console, 91 dan pre 18. avgusta i 18. avgust do 16. novembar 2026.",
        rows: [
          {
            label: "Posete iz pretrage",
            from: "92",
            to: "376",
            change: "4 puta više",
          },
          {
            label: "Prikazi u rezultatima",
            from: "4.961",
            to: "18.623",
            change: "3,8 puta više",
          },
        ],
      },
    },
    {
      id: "ai",
      kicker: "AI pretraga",
      title: "ChatGPT već šalje kupce na Thermiq, i prvi je već kupio.",
      body: [
        "Sve više ljudi ne gugla, nego pita ChatGPT koja pumpa im treba ili koliko košta podno grejanje. Asistent tada odgovori i navede izvor. Tekstove i stranice smo pisali tako da ih AI može da navede: odgovor u prvoj rečenici, tabela sa brojevima, jasno pitanje u naslovu.",
        "Rezultat je novi kanal koji većina prodavnica u Srbiji nema. ChatGPT i drugi asistenti navode Thermiqove stranice kao izvor, ljudi koji odatle dođu ostaju na sajtu kao i oni iz Google-a, a prvi upit koji je stigao iz ChatGPT-a već je postao porudžbina.",
      ],
      viz: {
        kind: "stat",
        items: [
          { value: "213", label: "poseta iz ChatGPT-a i drugih AI asistenata" },
          {
            value: "2,6×",
            label: "više takvih poseta u oktobru nego u avgustu",
          },
          {
            value: "57%",
            label: "tih poseta je angažovano, isto kao iz Google-a",
          },
        ],
      },
    },
    {
      id: "brend",
      kicker: "Logo i dizajn",
      title: "Znak koji kaže čime se firma bavi, i sistem koji iz njega raste.",
      body: [
        "Logotip spaja sunce i pahulju, a između njih su dva talasa: crveni za toplo i plavi za hladno. U drugoj verziji identiteta od ta dva talasa napravili smo ceo grafički jezik.",
        "Polja se završavaju na talasu. Kartica proizvoda bojom podloge kaže da li uređaj greje ili hladi. Ista linija, ispravljena u cev, vodi kroz ponudu, katalog, mejl i objave. Sve je zapisano u brend knjizi, od pozicije „sve na jednom mestu“ do etikete na polici.",
      ],
      media: [
        {
          src: img("thermiq/knjiga-01"),
          alt: "Brend knjiga 2.0",
          caption: "Brend knjiga 2.0.",
        },
        {
          src: img("thermiq/knjiga-03"),
          alt: "Poglavlje brend knjige",
          caption: "Pozicija i ton, iz brend knjige.",
        },
        {
          src: img("thermiq/kartice"),
          alt: "Kartice proizvoda",
          caption: "Kartice proizvoda: boja kaže da li greje ili hladi.",
        },
        {
          src: img("thermiq/geometrija"),
          alt: "Geometrija talasa",
          caption: "Talas i cev.",
        },
        {
          src: img("thermiq/papir"),
          alt: "Katalog i ponuda",
          caption: "Katalog i ponuda.",
        },
        { src: img("thermiq/vizitke"), alt: "Vizitke", caption: "Vizitke." },
      ],
    },
    {
      id: "mreze",
      kicker: "Društvene mreže",
      title: "Objave koje odgovaraju na pitanje, pa nude proizvod.",
      body: [
        "Thermiq na Instagramu ne objavljuje akcije reda radi. Teme biramo iz onoga što ljudi kucaju u Google: koliko kvadrata greje klima od 24.000 BTU, koliki pritisak treba kotlu, koja pumpa ide kući od 200 m². Svaka objava daje odgovor sa brojem i završava se proizvodom sa cenom.",
        "Uz objave pravimo kratke video snimke i karusele, sve u brend sistemu, i plan objavljivanja za celu sezonu grejanja.",
      ],
      piece: {
        kind: "feed",
        title: "Serija „Proizvodi i pitanja“",
        note: "Objave za Instagram, novembar 2026.",
        cols: 3,
        items: [
          "ig-hisense",
          "ig-pritisak",
          "ig-klima",
          "ig-bosch",
          "ig-pumpa",
          "ig-podno",
        ].map((k) => img(`thermiq/${k}`)),
      },
    },
    {
      id: "oglasi",
      kicker: "Oglasi",
      title: "Video oglasi za skupe uređaje, i merenje pre budžeta.",
      body: [
        "Za proizvode koji nose prodaju, toplotne pumpe Hisense, kotlove Bosch i klime Romstal, napravili smo video oglase za Instagram i Facebook. Svaki pokazuje uređaj, cenu i jedan razlog za kupovinu.",
        "Oglasi bez merenja troše budžet naslepo, pa smo pre kampanja postavili merenje od prvog pregleda do naplaćenog posla. Za prve dve nedelje sajt je zabeležio 10 kupovina preko korpe, 41 poziv i 7 upita. To je polazna linija za svaku kampanju.",
      ],
      widget: {
        kind: "steps",
        lines: [
          "Pregled | Sajt beleži koji proizvod je kupac gledao.",
          "Korpa i poziv | Dodavanje u korpu, poziv sa sajta i poslat upit.",
          "Porudžbina | Kupovina sa vrednošću, poslata platformama za oglase.",
          "Posao iz upita | Prodaja zaključena telefonom ulazi u isti izveštaj.",
        ],
      },
      piece: {
        kind: "feed",
        title: "Video oglasi",
        note: "Kadrovi iz video oglasa, format 4:5 za Instagram i Facebook.",
        cols: 4,
        items: ["ad-hisense", "ad-bosch", "ad-ecovent", "ad-hisense80"].map(
          (k) => img(`thermiq/${k}`),
        ),
      },
    },
    {
      id: "cene",
      kicker: "Praćenje cena",
      title: "Cene konkurencije, svakog ponedeljka, bez ijedne tabele.",
      body: [
        "Kada mnogo prodavaca nudi istu opremu, cena odlučuje brže nego bilo gde. Napravili smo alat koji svakog ponedeljka pročita cene konkurenata, upari ih sa Thermiqovim artiklima po šifri i predloži novu cenu po pravilu koje je zadao vlasnik.",
        "Promene unutar dozvoljenog okvira odlaze pravo na sajt, a sve što odskače više od 15% čeka čoveka. U prvom prolazu usklađeno je 479 cena, a na 436 artikala Thermiq je prodavao jeftinije nego što je tržište tražilo. Probajte ispod: ispravite predlog i pošaljite cenu.",
      ],
      piece: {
        kind: "pricetool",
        title: "Preko 15%",
        sub: "Promene koje čekaju potvrdu, izveštaj od ponedeljka",
        note: "Redovi su primer. Prvi prolaz uživo: 9. novembar 2026.",
        rows: [
          {
            code: "73PG1543",
            name: "Grundfos MAGNA3 40-120 F",
            now: 145860,
            proposal: "396.740",
          },
          {
            code: "0010021977",
            name: "Vaillant ecoTEC plus VU 30",
            now: 214300,
            proposal: "176.920",
          },
          {
            code: "40HA0012",
            name: "Climaflex Stabil 22 × 9 mm",
            now: 1980,
            proposal: "2.410",
          },
          {
            code: "530975",
            name: "Hisense Hi-Therma AHZ-120",
            now: 414710,
            proposal: "489.300",
          },
        ],
      },
    },
    {
      id: "upiti",
      kicker: "Upiti",
      title: "Svaki upit ima vlasnika, odgovor i ishod.",
      body: [
        "Ko kupuje kotao ili toplotnu pumpu prvo pita, pa tek onda kupuje. Zato je upit ovde jednako važan kao porudžbina. Upiti sa sajta stižu na jedno mesto u administraciji, prodavac odgovara iz istog prozora, a odgovor odlazi kupcu mejlom i ostaje zapisan uz upit.",
        "Kada se posao zaključi, upit dobija oznaku da je realizovan, a ta prodaja odlazi u Google Ads kao konverzija. Tako kampanje uče od naplaćenih poslova, a ne od klikova.",
      ],
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title:
      "Od kataloga koji se ne vidi do prodavnice koju nalaze i Google i ChatGPT.",
    body: [
      "Za tri meseca Thermiq je dobio web shop koji se sam pojavljuje pred ljudima koji traže konkretan uređaj, brend koji se prepoznaje od sajta do vizitke, objave i oglase iz istog sistema, cene koje prate tržište bez ručnog rada i upite koji se ne gube. Rast iz pretrage došao je bez plaćenih oglasa.",
      "Sledeće je povratak kampanja na merenje koje zna šta je prodaja, stranice usluga za montažu i servis i nova sezona sadržaja po brend knjizi.",
    ],
  },
  takeaways: [],
};

export default story;
