/* ThermiQ: the story told on /projects/thermiq.

   Every number here is measured, not estimated:
   - Search numbers: Google Search Console, property sc-domain:thermiq.rs,
     5 Jul to 3 Oct 2026 (91 days), read from Fortress HQ on 10 Oct 2026.
     "Pages" figures are Search Console's last 28 days in that window.
   - Visits by channel: Google Analytics 4, 8 Jul to 5 Oct 2026.
   - Indexed pages (3.157): Search Console page indexing, September 2026.
   - Metadata figures: our own check of 2.485 product pages, 6 Oct 2026.
   Update the window and the numbers together, never one without the other. */

const IMG = "https://cdn.sanity.io/images/203ybdbh/production";

const story = {
  slug: "thermiq",
  headline: "Od kataloga koji niko ne nalazi do 2.836 poseta iz pretrage.",
  standfirst:
    "ThermiQ prodaje isti Bosch, isti Vaillant i istu MDV klimu kao svaki drugi distributer u Beogradu. Dobili su nov identitet, sajt koji nosi hiljade proizvoda i SEO postavljen na nivou šablona. Za tri meseca broj nedeljnih poseta iz Google pretrage porastao je više od četiri puta.",
  meta: [
    { label: "Klijent", value: "ThermiQ, Beograd" },
    { label: "Delatnost", value: "Grejanje i klimatizacija" },
    {
      label: "Šta smo radili",
      value: "Brend, sajt, SEO, sadržaj, društvene mreže, praćenje",
    },
    { label: "Podaci", value: "5. jul do 3. oktobar 2026." },
  ],
  services: ["Brend", "Web", "SEO", "Društvene mreže", "Sadržaj"],
  source:
    "Izvor: Google Search Console i Google Analytics 4, od 5. jula do 3. oktobra 2026.",
  numbers: [
    {
      value: "2.836",
      label: "poseta iz Google pretrage",
      note: "za 91 dan",
    },
    {
      value: "51.773",
      label: "prikaza u rezultatima pretrage",
      note: "za 91 dan",
    },
    {
      value: "7,1",
      label: "prosečna pozicija u poslednjih 28 dana",
      note: "na početku je bila 10,3",
    },
    {
      value: "3.157",
      label: "stranica u Google indeksu",
      note: "septembar 2026.",
    },
  ],

  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Roba je ista. Odluka nije.",
      body: [
        "Vrednost ovog projekta svodi se na jednu neugodnu činjenicu: ThermiQ prodaje istu opremu kao i svi ostali. Isti kotlovi, iste pumpe, iste klime, često i ista nabavna cena. Kad je roba identična, kupac nema po čemu da bira osim po ceni, osim ako mu ne date nešto drugo po čemu će birati.",
        "Prosečan posao u ovoj kategoriji prolazi kroz četiri para ruku: prodavca opreme, majstora, električara i nekoga ko na kraju sve to pusti u rad. Kad nešto krene naopako, svako pokazuje na prethodnog. Kupac to zna i pre nego što počne, i zato okleva i traži tri ponude.",
        "Sajt pre nas nije pričao tu priču. Brend nije imao jasnu poziciju, stranice proizvoda nisu bile optimizovane ni za pretragu ni za konverziju, a ogroman katalog od hiljade proizvoda, desetine brendova i pet glavnih kategorija postojao je, ali ga gotovo niko nije mogao pronaći organski.",
      ],
      pull: "Kupac ne bira uređaj, nego odluku koju donosi jednom u petnaest godina.",
      viz: {
        kind: "stat",
        items: [
          { value: "15", label: "godina do sledeće ovakve odluke" },
          { value: "4", label: "izvođača u prosečnom poslu" },
          { value: "1", label: "sezona da se sve završi" },
        ],
      },
    },
    {
      id: "brend",
      kicker: "Brend",
      title: "Crvena prati grejanje, plava prati hlađenje.",
      body: [
        "Vizuelni sistem nije bio vežba iz estetike nego pravilo koje se primenjuje bez razmišljanja. Crvena je dodeljena grejanju: kotlovima, podnom grejanju, akcijama. Plava hlađenju: toplotnim pumpama, klimatizaciji, tehničkom sadržaju. Na svakom formatu mora da se pojavi bar jedan element druge boje, jer sam znak spaja sunce i pahulju, a gradijent ide od crvene do plave.",
        "Praktična korist je jednostavna. Kad neko otvori bilo koju stranicu ili bilo koju objavu, odmah zna da li gleda opremu za grejanje ili hlađenje, i da gleda ThermiQ, a ne nasumičnu prodavnicu opreme.",
      ],
      media: [
        {
          src: `${IMG}/da713ac6d6c4ab588f793586cfd5ea27e80f1ad6-1600x900.png`,
          alt: "Topla i hladna varijanta istog banera: crvena za grejanje, plava za hlađenje",
          caption:
            "Isti baner u dve teme: crvena za grejanje, plava za hlađenje.",
        },
        {
          src: `${IMG}/6377522fe88196964f3fd4c73d935b6cb37c6438-1600x900.png`,
          alt: "Ista poruka prelomljena za tri različita formata",
          caption: "Ista poruka, tri formata, jedno pravilo.",
        },
      ],
    },
    {
      id: "mreze",
      kicker: "Društvene mreže",
      title: "Instagram: od nasumičnog feeda do sistema.",
      body: [
        "Instagram profil je pre saradnje bio nekonzistentan. Mešavina montažnih fotografija sa terena i šablona dobavljača, bez ijedne oznake da je reč o ThermiQ-u. Preradili smo ga po istom brend sistemu kao sajt: highlight kategorije po tipu opreme, jedinstven stil objava i vizuelna gramatika koja prati isto pravilo, crvena za grejanje i plava za hlađenje.",
        "Cilj nije bio samo da profil izgleda bolje. Svaka objava sada jasno pokazuje da li je reč o grejanju ili hlađenju, profil deluje kao ozbiljan tehnički partner umesto još jednog prodavca uređaja, i vodi saobraćaj nazad ka sajtu i katalogu.",
      ],
      media: [
        {
          src: `${IMG}/a3737c92339e97bf4960b34f528aa3808c689b96-1440x900.png`,
          alt: "Instagram feed pre i posle: zatečeni mešani feed i novi profil na ThermiQ brend sistemu",
          caption: "Levo zatečeni feed, desno profil na novom sistemu.",
        },
      ],
    },
    {
      id: "sajt",
      kicker: "Sajt",
      title: "Sajt koji nosi ceo katalog, a i dalje se lako koristi.",
      body: [
        "ThermiQ nije sajt sa par proizvoda nego pun e-commerce katalog: klimatizacija i ventilacija, vodovod i kanalizacija, grejanje i oprema, alati i pribor za instalatere, sanitarije. Redizajn je morao da reši dva problema istovremeno. Da katalog te veličine bude lak za pretragu i kupovinu, i da svaka stranica proizvoda bude strukturisana tako da je Google može indeksirati i rangirati.",
        "Usluge koje su ranije bile zakopane u kategorijama proizvoda dobile su svoje stranice: montaža klima uređaja, toplotne pumpe, podno grejanje, projektovanje. Dodata je i sekcija akcija sa jasno prikazanom uštedom po proizvodu, kao i sistem dnevne promene cena, tako da sajt ostaje usklađen sa nabavkom bez ručnog ažuriranja svake stavke pojedinačno.",
      ],
      media: [
        {
          src: `${IMG}/869884e0b64e6cf4f929483d34efa476257f1198-3200x1800.png`,
          alt: "Nova početna stranica ThermiQ sajta",
          caption: "Nova početna stranica.",
        },
        {
          src: `${IMG}/86244b29741584d5367d86d97bcea86958f896a3-3200x1800.png`,
          alt: "Struktura kataloga sa kategorijama i brojem proizvoda",
          caption: "Katalog po kategorijama, sa brojem proizvoda u svakoj.",
        },
        {
          src: `${IMG}/459e94ac307bad04c276f7b039d22ed431db6734-3200x1800.png`,
          alt: "Posebna stranica za servis i montažu toplotnih pumpi",
          caption: "Usluge su dobile svoje stranice.",
        },
        {
          src: `${IMG}/9c19ef78f8ab57516f6dff0b3b7c5ca58256ef14-3200x1800.png`,
          alt: "Sekcija akcija sa prikazanom uštedom po proizvodu",
          caption: "Akcije sa uštedom prikazanom po proizvodu.",
        },
      ],
    },
    {
      id: "seo",
      kicker: "SEO",
      title: "Optimizacija hiljada proizvoda, ne pojedinačnih stranica.",
      body: [
        "Kada katalog ima ovoliko artikala, ručna optimizacija nije opcija. Naslovi, meta opisi, strukturirani podaci i interno povezivanje postavljeni su na nivou šablona, tako da se automatski primenjuju na ceo katalog umesto da se rade proizvod po proizvod.",
        "To je omogućilo nešto što bi inače trajalo godinama ručnog rada: da Google indeksira i rangira ceo asortiman, od najprodavanijih toplotnih pumpi do sitnog pribora za instalatere.",
        "Početkom oktobra otišli smo korak dalje i proverili šablone na 2.485 stranica proizvoda. Ispravan opis za pretragu imalo je 29% njih, a posle izmene ima ga svaka. Broj proizvoda koji dele naslov sa drugim proizvodom pao je sa 247 na 4, a svih 114 kategorija dobilo je sopstveni naslov i opis umesto jednog zajedničkog šablona. Ta izmena je uživo od 7. oktobra, pa se njen efekat još ne vidi u brojevima ispod.",
      ],
      viz: {
        kind: "compare",
        title: "Šabloni pre i posle, na uzorku od 2.485 proizvoda",
        note: "Naša provera, 6. oktobar 2026.",
        rows: [
          {
            label: "Stranice sa ispravnim opisom za pretragu",
            from: "29%",
            to: "100%",
          },
          {
            label: "Proizvodi koji dele naslov sa drugim proizvodom",
            from: "247",
            to: "4",
          },
          {
            label: "Kategorije sa sopstvenim naslovom i opisom",
            from: "0",
            to: "114",
          },
        ],
      },
      media: [
        {
          src: `${IMG}/d61b39b1ef6f06ba34a086d17855ae7dc9f9abdf-1600x900.png`,
          alt: "Google Search Console, rast broja indeksiranih stranica",
          caption:
            "Search Console: broj indeksiranih stranica raste u stepenicama.",
        },
      ],
    },
    {
      id: "kalkulatori",
      kicker: "Alati",
      title: "Kalkulator kao ulazna tačka, ne kao igračka.",
      body: [
        "Kalkulator toplotne pumpe odgovara na pitanje koje kupci postavljaju mnogo pre nego što su spremni da kupe: koja mi snaga uopšte treba. Premala pumpa neće zagrejati prostor po najhladnijim danima, a prevelika nepotrebno poskupljuje kupovinu za desetine hiljada dinara.",
        "To je edukativna tačka ulaska bez pritiska. Dovodi ljude koji tek istražuju opciju grejanja i usput pokriva upit koji konkurencija uglavnom ignoriše. Oba kalkulatora su danas među pet najposećenijih stranica sajta iz pretrage, odmah iza početne.",
      ],
      viz: {
        kind: "table",
        title: "Kalkulatori u pretrazi, poslednjih 28 dana",
        note: "Search Console, 28 dana zaključno sa 3. oktobrom 2026.",
        columns: ["Stranica", "Prikazi", "Klikovi", "Prosečna pozicija"],
        rows: [
          ["Kalkulator radijatora", "523", "24", "4,3"],
          ["Kalkulator toplotne pumpe", "373", "17", "5,0"],
        ],
      },
      media: [
        {
          src: `${IMG}/5f2781a4dc02c0e7928bdb52c8931b8b4647982d-3200x1800.png`,
          alt: "Kalkulator za toplotnu pumpu",
          caption: "Kalkulator toplotne pumpe.",
        },
      ],
    },
    {
      id: "rezultati",
      kicker: "Rezultati",
      title: "Postepeno ubrzanje, ne jednokratan skok.",
      body: [
        "U prvoj punoj nedelji jula sajt je iz Google pretrage dobio 80 poseta. U trećoj nedelji septembra dobio ih je 343. Između te dve tačke nema skoka: kriva raste iz nedelje u nedelju, kako nove serije proizvoda i kategorija ulaze u indeks.",
        "Za 91 dan to je 2.836 poseta i 51.773 prikaza u rezultatima pretrage. Prosečna pozicija je sa 10,3 u prvih 28 dana došla na 7,1 u poslednjih 28, što znači da se veliki deo kataloga danas nalazi na prvoj strani rezultata.",
      ],
      viz: {
        kind: "trend",
        title: "Posete iz Google pretrage po nedeljama",
        unit: "klikova nedeljno",
        note: "Search Console, pune nedelje od 6. jula do 27. septembra 2026.",
        points: [
          { label: "6. jul", value: 80 },
          { label: "13. jul", value: 74 },
          { label: "20. jul", value: 133 },
          { label: "27. jul", value: 143 },
          { label: "3. avg", value: 207 },
          { label: "10. avg", value: 229 },
          { label: "17. avg", value: 246 },
          { label: "24. avg", value: 290 },
          { label: "31. avg", value: 240 },
          { label: "7. sep", value: 257 },
          { label: "14. sep", value: 343 },
          { label: "21. sep", value: 341 },
        ],
      },
    },
    {
      id: "pre-posle",
      kicker: "Rezultati",
      title: "Prvih 28 dana naspram poslednjih 28.",
      body: [
        "Najpoštenije poređenje je sajt sa samim sobom. Isti period od četiri nedelje, na početku merenja i na njegovom kraju.",
      ],
      viz: {
        kind: "compare",
        title: "Prvih 28 dana i poslednjih 28 dana",
        note: "Search Console, 5. jul do 1. avgust i 6. septembar do 3. oktobar 2026.",
        rows: [
          {
            label: "Posete iz pretrage",
            from: "422",
            to: "1.222",
            change: "2,9 puta više",
          },
          {
            label: "Prikazi u rezultatima",
            from: "8.938",
            to: "20.401",
            change: "2,3 puta više",
          },
          {
            label: "Prosečna pozicija",
            from: "10,3",
            to: "7,1",
            change: "tri mesta bliže vrhu",
          },
        ],
      },
    },
    {
      id: "katalog",
      kicker: "Rezultati",
      title: "Katalog radi širinom, ne jednom stranicom.",
      body: [
        "U poslednjih 28 dana Google je u rezultatima prikazao 2.450 različitih stranica sajta, a 616 njih je dobilo bar jednu posetu. Ne postoji jedna stranica koja nosi saobraćaj: 83% poseta iz pretrage stiže pravo na stranice proizvoda.",
        "To je posledica rada na šablonima. Kupac koji ukuca tačan model kotla ili radijatora ne sleće na početnu, nego na stranicu baš tog proizvoda.",
      ],
      viz: {
        kind: "share",
        title: "Gde stižu posete iz pretrage",
        note: "Search Console, 28 dana zaključno sa 3. oktobrom 2026. Ukupno 1.238 poseta.",
        items: [
          { label: "Stranice proizvoda", value: 82.7, detail: "1.024 posete" },
          { label: "Početna", value: 6.9, detail: "85 poseta" },
          { label: "Kategorije", value: 4.6, detail: "57 poseta" },
          { label: "Kalkulatori i ostalo", value: 4.1, detail: "51 poseta" },
          { label: "Stranice usluga", value: 1.7, detail: "21 poseta" },
        ],
      },
    },
    {
      id: "kanali",
      kicker: "Rezultati",
      title: "Pretraga je postala glavni kanal.",
      body: [
        "Od 5.414 poseta sajtu u ovom periodu, 3.449 je stiglo iz organske pretrage. To je 64% ukupnog saobraćaja, bez dinara po kliku. Nedeljni broj organskih poseta porastao je sa 93 sredinom jula na 409 sredinom septembra.",
        "Jedan detalj vredi izdvojiti: 121 poseta je stigla iz AI asistenata. Ljudi već pitaju ChatGPT i slične alate koju opremu da kupe, i deo njih odatle stiže na sajt.",
      ],
      viz: {
        kind: "share",
        title: "Odakle dolaze posete sajtu",
        note: "Google Analytics 4, 8. jul do 5. oktobar 2026. Ukupno 5.414 poseta.",
        items: [
          { label: "Organska pretraga", value: 63.7, detail: "3.449 poseta" },
          { label: "Plaćeni oglasi", value: 22.2, detail: "1.200 poseta" },
          { label: "Direktno", value: 9.5, detail: "517 poseta" },
          {
            label: "Društvene mreže i ostalo",
            value: 2.3,
            detail: "127 poseta",
          },
          { label: "AI asistenti", value: 2.2, detail: "121 poseta" },
        ],
      },
    },
    {
      id: "sadrzaj",
      kicker: "Sadržaj",
      title: "Blog pisan iz pitanja kupaca, ne iz glave.",
      body: [
        "Pre nego što je napisan ijedan tekst, prikupili smo 3.202 različita pitanja koja ljudi u Srbiji kucaju u Google o grejanju i hlađenju. Najveće grupe su potrošnja toplotne pumpe, koliko kilovata treba po kvadratu i poređenje pumpe sa gasom i peletom.",
        "Iz toga je 6. oktobra objavljeno 14 tekstova, svaki sa ciframa iz ThermiQ cenovnika i kalkulatora i sa četiri najčešća pitanja na kraju. Pisani su istim tonom kao brend: broj pre prideva, i ograničenje izgovoreno naglas.",
        "Ti tekstovi još nisu u brojevima iznad, jer su objavljeni posle perioda merenja.",
      ],
      viz: {
        kind: "stat",
        items: [
          { value: "3.202", label: "pitanja kupaca iz pretrage" },
          { value: "14", label: "objavljenih tekstova" },
          { value: "4", label: "odgovorena pitanja u svakom" },
        ],
      },
    },
  ],

  next: {
    title: "Šta još ne znamo, i šta sledi.",
    body: [
      "Ova studija meri posete, ne prodaju. Do oktobra sajt nije beležio koja stranica i koji kanal dovode do upita i porudžbine, pa bi svaki broj o prodaji ovde bio procena.",
      "Zato je u oktobru u sajt ugrađeno praćenje koje za svaki upit i svaku porudžbinu beleži odakle je kupac došao, od prvog klika. Kad se skupi dovoljno podataka, sledeća verzija ove studije imaće prodaju po kanalu, a ne samo posete.",
    ],
  },

  takeaways: [
    {
      title: "Kad je roba ista, dizajnira se jedino odluka",
      text: "ThermiQ prodaje isti Bosch, isti Vaillant i istu MDV jedinicu kao i svaki drugi distributer u Beogradu. Kad je proizvod identičan, cela kategorija se svede na to ko je jeftiniji. Posao brenda nije bio da bude najjeftiniji, nego da ukloni strah od pogrešnog izbora.",
    },
    {
      title: "Katalog sa hiljadama proizvoda se ne optimizuje ručno",
      text: "Pet glavnih kategorija, desetine brendova, hiljade artikala. Naslovi, meta opisi, strukturirani podaci i interno povezivanje postavljeni su na nivou šablona, tako da se primenjuju na ceo asortiman.",
    },
    {
      title: "Kalkulator hvata kupca pre nego što je kupac",
      text: "Kalkulator toplotne pumpe ne prodaje ništa. Odgovara na pitanje koje ljudi postavljaju mesecima pre kupovine: koja mi snaga uopšte treba. To je ulazna tačka bez pritiska, koja gradi poverenje pre nego što iko pomene cenu.",
    },
  ],
};

export default story;
