/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   - Sajtove pravimo po meri, u Next.js-u, sa urednikom sadržaja Sanity u kome klijent sam menja tekst, cene i slike.
   - Sajt pravimo prvo za telefon, pa tek onda za računar.
   - Pre dizajna gledamo šta kupci kucaju u Google i od toga pravimo spisak stranica, po jednu za svaku uslugu.
   - Tekst za stranice pišemo mi, iz razgovora sa klijentom, a klijent ga čita i ispravlja pre objave.
   - Klijent vidi i odobrava dizajn pre nego što počne programiranje; pregled ide preko video poziva.
   - Svaki korak završavamo pre sledećeg: dizajn ne počinje dok spisak stranica nije gotov.
   - Pre objave sajt proveravamo na Google PageSpeed testu za telefon.
   - Posle objave prvo menjamo stranice sa kojih ljudi odlaze bez upita ili poziva.
   - Kad klijent ima stari sajt, njegove adrese preusmeravamo na nove; pre prerade u Search Console-u gledamo koje stranice već donose posete.
   - Tačan rok izrade upisujemo u ponudu, a ponuda je razložena po stavkama.
   - Domen glasi na firmu klijenta; sajt, tekst, fotografije i kod (kod sajta po meri) pripadaju klijentu.
   - Ko plaća i vodi domen i hosting dogovaramo u ponudi.
   - Ako klijent promeni izvođača, uz sajt dobija sve pristupe.
   - Održavanje obuhvata praćenje brzine i grešaka, ažuriranje, nove stranice i izmene rasporeda; nije obavezno, izmene se mogu naručiti pojedinačno.
   - Klijenti na održavanju sajta vide rad u klijentskom portalu i dobijaju mesečni izveštaj o brzini i upitima.
   - Osnovni SEO ulazi u izradu: naslov i opis za Google na svakoj stranici, mapa sajta, brzina; stalni SEO je posebna usluga.
   - Promena sačuvana u uredniku sama se pojavi na sajtu, bez programera.
   - Pravimo sajtove i za advokate, restorane i agencije za nekretnine.
   - Poređenje WordPress-a i sajta po meri (tabela) i stav da za firmu kojoj sajt treba da donosi upite biramo sajt po meri, a da je za vizitkartu WordPress sa dobrim šablonom dovoljan. */

const page = {
  slug: "izrada-sajta",
  service: "web",
  seo: {
    title: "Izrada sajta i online prodavnice za vašu firmu | Digitl",
    description:
      "Sajt ili online prodavnica po meri, brza na telefonu i sa stranicom za svaku uslugu. Pogledajte od čega zavisi cena izrade sajta i zakažite razgovor.",
  },
  label: "Web dizajn i razvoj",
  h1: "Izrada sajta i online prodavnice",
  lead: "Pravimo sajtove i online prodavnice za firme u Srbiji, od zanatskih firmi iz Niša do distributera sa hiljadama proizvoda. Svaka usluga koju nudite dobija svoju stranicu, sa tekstom i slikama koje posle objave menjate sami. Sajt pravimo prvo za telefon, da se otvori brzo i da kupac stigne do vašeg broja pre nego što odustane.",
  proof: [
    {
      value: "100",
      label: "Google PageSpeed ocena na telefonu",
      href: "/projects/moler-nis",
    },
    {
      value: "1.",
      label: "mesto na Google-u za tri meseca",
      href: "/projects/moler-nis",
    },
    { value: "50+", label: "uspešnih saradnji", href: "/projects" },
  ],
  intro: {
    title: "Izrada web sajta za firmu",
    body: [
      "Izrada sajta je posao koji počinje od toga šta vaš kupac kuca u Google i šta mora da zna pre nego što vas pozove, pa tek onda dolaze dizajn i programiranje. Zato prvo pravimo spisak stranica, po jednu za svaku uslugu koju ljudi traže posebno.",
      "Kod [molerske firme iz Niša](/projects/moler-nis) to je bilo šest usluga i šest stranica, uz poseban cenovnik. Na tom sajtu danas stranica sa cenama donosi najviše klikova iz pretrage, mahom od ljudi koji uz naziv usluge u Google ukucaju i reč cena. Servisu klima smo kvar i kupovinu nove klime razdvojili na posebne stranice, pošto onaj kome je klima stala u avgustu i onaj ko u martu bira novu ne traže isto.",
      "Google za indeksiranje i rangiranje koristi [mobilnu verziju sajta](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing), pa dizajn kod nas počinje od ekrana telefona. Posle objave na sajt vode pretraga i [oglasi](/usluge/placeno-oglasavanje), a mi od prvog dana merimo njegovu brzinu i to koliko posetilaca pošalje upit ili pozove vaš broj. Sve troje planiramo zajedno, i to mislimo kad kažemo kompletan marketing kao jedan sistem, ne meni nepovezanih usluga.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "Sve tri stavke možete da naručite zajedno ili posebno, sa SEO-om i oglasima ili bez njih.",
    items: [
      {
        title: "Dizajn i izrada sajta ili online prodavnice",
        sub: "od plana do objave",
        text: "Od spiska stranica do objave na vašem domenu radimo i tekst i dizajn i kod. Uz sajt dobijate urednik sadržaja u kome sami menjate cene, tekst i slike.",
      },
      {
        title: "Kalkulatori i alati po meri",
        sub: "računica pre poziva",
        text: "Pravimo kalkulatore za pitanje koje kupac postavi pre kupovine, na primer koja mu snaga klime treba ili koliko boje i gleta ide na zidove njegovog stana. Vaš broj stoji pored rezultata.",
      },
      {
        title: "Održavanje i podrška",
        sub: "posle objave",
        text: "Pratimo da li sajt ostaje brz i ispravan posle svake izmene. Menjamo i ono što u uredniku ne možete sami, kao što je raspored stranice ili nova funkcija.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "Svaki korak završavamo pre sledećeg, pa dizajn ne počinje dok spisak stranica nije gotov.",
    items: [
      {
        title: "Pretrage i stranice",
        text: "Gledamo kojim rečima vaši kupci traže svaku uslugu. Svaka pretraga iza koje stoji dovoljno ljudi dobija svoju stranicu na spisku, sa onim što ta stranica mora da kaže.",
      },
      {
        title: "Tekst i dizajn",
        text: "Pišemo tekst za svaku stranicu i dizajniramo je prvo za ekran telefona. Dizajn vidite i odobravate pre nego što počne programiranje.",
      },
      {
        title: "Programiranje",
        text: "Sajt programiramo po meri i povezujemo ga sa urednikom sadržaja. Pre objave ga proveravamo na Google PageSpeed testu za telefon.",
      },
      {
        title: "Objava",
        text: "Sajt postavljamo na vaš domen. Ako ste imali stari sajt, njegove adrese preusmeravamo na nove, da ne izgubite posete koje već stižu iz pretrage.",
      },
      {
        title: "Merenje i izmene",
        text: "Posle objave pratimo brzinu i koliko posetilaca pošalje upit ili kupi. Stranice sa kojih ljudi odlaze bez poziva menjamo prve.",
      },
    ],
  },
  cases: [
    {
      slug: "servis-klime-nis",
      title: "Servis Klime Niš",
      text: "Sajt koji razdvaja kvar od kupovine, sa cenom vidljivom pre poziva. Google PageSpeed ocena 100 na telefonu.",
    },
    {
      slug: "thermiq",
      title: "ThermiQ",
      text: "Online prodavnica distributera grejanja i hlađenja, sa hiljadama proizvoda u katalogu. Za 91 dan sajt je dobio 2.836 poseta iz pretrage.",
    },
  ],
  guide: [
    {
      title: "Od čega zavisi cena izrade sajta?",
      body: [
        "Cenu izrade sajta najviše pomera broj različitih vrsta stranica i ono što sajt mora da izračuna ili poveže sa drugim programom, mnogo više od samog broja stranica.",
        "Šest stranica usluga koje dele isti raspored brže se prave od tri stranice koje izgledaju svaka drugačije, pošto se raspored dizajnira i programira jednom. Kad pravimo ponudu, gledamo ove stavke:",
        {
          list: [
            "koliko različitih rasporeda treba, na primer naslovna, usluga, cenovnik i projekat",
            "da li tekst pišemo mi ili ga već imate",
            "kalkulator, formular za zakazivanje ili drugi alat koji se programira posebno",
            "za prodavnicu, broj proizvoda i u kakvom su stanju podaci o njima",
            "veza sa programom za lager ili knjigovodstvo, ako cene i stanje treba da se menjaju sami",
            "da li već imate logo i boje ili ih pravimo pre sajta",
            "prelazak sa starog sajta, sa preusmeravanjem starih adresa",
          ],
        },
        "Najveći skok u ceni je između sajta i prodavnice. Prodavnica sa hiljadama artikala košta više zbog podataka, koje treba uvesti iz tabele i srediti po kategorijama. Uz to ide i šablon koji svakom proizvodu sam napiše naslov i opis za Google, kakav smo postavili za ThermiQ.",
        "Ako treba da se uštedi, mi bismo pre smanjili broj posebnih dizajna nego broj stranica usluga. Svaka stranica usluge hvata svoju pretragu, dok poseban dizajn stranice o nama ne dovodi nikoga sa Google-a.",
      ],
    },
    {
      title: "Koliko traje izrada sajta i šta vi pripremate?",
      body: [
        "Sa radom obično krećemo 1 do 2 nedelje posle dogovora. Tačan rok upisujemo u ponudu, kad znamo spisak stranica i da li pravimo prodavnicu.",
        "Rok najviše zavisi od sadržaja. Programiranje ide po planu, ali sajt ne objavljujemo dok ne stignu vaše cene i fotografije.",
        "Zato je dobro da pre početka skupite ovo:",
        {
          list: [
            "spisak usluga ili proizvoda, sa cenama koje želite da objavite",
            "fotografije stvarnih radova, prostora ili ljudi, makar i sa telefona",
            "logo i boje, ako ih imate; ako nemate, [logo i vizuelni identitet](/usluge/dizajn-logotipa) radimo pre sajta",
            "područje koje pokrivate i radno vreme",
            "pristup domenu i starom sajtu, ako postoje",
            "za prodavnicu, tabelu proizvoda sa šiframa, cenama i stanjem na lageru",
          ],
        },
        "Tekst ne morate da pišete sami, pošto ga pišemo mi iz razgovora sa vama. Pre objave ga pročitajte red po red, jer samo vi znate da li je svaka cena tačna i da li tu uslugu zaista radite onako kako je opisana.",
        "Fotografije sa telefona koje pokazuju vaš stvarni posao kupcu govore više od lepše slike preuzete sa interneta, koju je kupac možda već video na drugim sajtovima.",
      ],
    },
    {
      title: "WordPress ili sajt po meri, šta da izaberete?",
      body: [
        "WordPress odgovara jednostavnom sajtu koji treba brzo da krene. Sajt po meri se isplati kad od sajta očekujete upite i brzo otvaranje na telefonu.",
        "WordPress je besplatan sistem za upravljanje sadržajem, sa hiljadama gotovih šablona i dodataka koje može da instalira i neko ko ne programira. Sajt po meri mi programiramo od nule u Next.js-u i povezujemo ga sa urednikom sadržaja Sanity, pa svaka stranica ima tačno ona polja koja vaš posao traži.",
        {
          table: {
            head: ["Šta gledate", "WordPress", "Sajt po meri"],
            rows: [
              ["Početak", "Brz, uz gotov šablon", "Sporiji, svaka stranica se dizajnira za vas"],
              ["Nova funkcija", "Instalirate dodatak", "Programira je neko ko zna kod sajta"],
              ["Brzina na telefonu", "Zavisi od šablona i broja dodataka", "Brzina se planira od prvog reda koda"],
              ["Održavanje", "Redovno ažuriranje sistema, šablona i dodataka", "Manje tuđih dodataka koje treba pratiti"],
              ["Menjanje teksta", "Poznat administratorski panel", "Urednik sa poljima napravljenim za vaš sajt"],
              ["Ko može da preuzme sajt", "Gotovo svaki web programer", "Programer koji radi u Next.js-u, kojih je manje"],
            ],
          },
        },
        "Manji broj programera koji rade u Next.js-u je stvaran nedostatak sajta po meri, i treba da ga znate pre nego što potpišete ugovor za izradu sajta sa bilo kim, pa i sa nama. Kod WordPress-a je slabo mesto održavanje, pošto neko mora redovno da ažurira dodatke dok god sajt radi.",
        "Za firmu kojoj sajt treba da donosi upite iz pretrage mi biramo sajt po meri, pre svega zbog brzine na telefonu i manje posla oko ažuriranja. Za vizitkartu od jedne stranice koja se menja jednom godišnje, WordPress sa dobrim šablonom je dovoljan.",
      ],
    },
    {
      title: "Šta dobijate kad je sajt gotov i čiji je?",
      body: [
        "Dobijate sajt na domenu koji glasi na vašu firmu, nalog u uredniku sadržaja i pristup podacima o posetama. Tekst i fotografije ostaju vaši i kad prestanemo da radimo zajedno.",
        "Ko god da vam pravi sajt, pre potpisivanja proverite da će ovo biti na vaše ime:",
        {
          list: [
            "domen, registrovan na vašu firmu ili radnju",
            "nalog za Google Search Console i Google Analytics, gde se vide pretrage i posete",
            "administratorski pristup uredniku sadržaja",
            "kod sajta, ako je pravljen po meri",
          ],
        },
        "Domen i hosting su troškovi koji traju dok sajt radi. Hosting je mesto na serveru gde sajt stoji, a domen se obično plaća jednom godišnje. Ko ih plaća i vodi dogovaramo još u ponudi, da vas posle predaje ništa ne iznenadi.",
        "Kad sajt posle objave održavamo mi, izmene i merenja vidite u klijentskom portalu i jednom mesečno dobijate izveštaj o brzini sajta i upitima koji su stigli. Ako jednog dana odlučite da promenite izvođača, uz sajt dobijate i sve pristupe, pa novi programer nastavlja tamo gde smo stali.",
      ],
    },
  ],
  price: {
    from: null,
    note: "Cenu računamo posle prvog razgovora, kad znamo koliko vrsta stranica, alata i proizvoda sajt treba da ima. U ponudi su stavke i rok, pa vidite za šta tačno plaćate.",
  },
  faq: [
    {
      q: "Radite li izradu sajta i za firme van Beograda?",
      a: "Da, radimo sa firmama iz cele Srbije, iako sedimo u Beogradu. Za izradu sajta ne moramo da se vidimo uživo, pošto dizajn zajedno pregledamo preko video poziva, a tekst vam šaljemo na čitanje. Dva sajta iz naših projekata, za molersku firmu i za servis klima, rađena su za firme iz Niša.",
    },
    {
      q: "Da li je SEO optimizacija uključena u izradu sajta?",
      a: "Osnova jeste. Svaka stranica dobija naslov i opis za Google, sajt ima mapu za pretraživače i brzo se otvara na telefonu. Novi tekstovi i lokalni SEO iz meseca u mesec spadaju u [SEO optimizaciju](/usluge/seo-optimizacija), posebnu uslugu koju možete da uključite odmah ili tek kad sajt proradi i dobije prve posete.",
    },
    {
      q: "Mogu li sam da menjam tekst, cene i slike na sajtu?",
      a: "Možete, i za to vam ne treba programer. Uz sajt dobijate nalog u uredniku sadržaja Sanity, gde svaka stranica ima svoja polja za naslov, tekst, cenu i fotografije. Kad sačuvate promenu, sajt je prikaže sam. Raspored stranice i nove funkcije menjamo mi, u okviru održavanja ili kao pojedinačnu izmenu.",
    },
    {
      q: "Šta je drugačije kod izrade online prodavnice?",
      a: "Kod prodavnice je glavni posao u stranici proizvoda, više nego u naslovnoj. Kupac koji ukuca tačan model treba da sleti baš na taj proizvod, sa cenom, stanjem i dugmetom za kupovinu. Za ThermiQ smo postavili i dnevnu promenu cena, pa prodavnica prati nabavku bez ručnog menjanja svake stavke.",
    },
    {
      q: "Šta obuhvata održavanje sajta?",
      a: "Održavanje pokriva ono što posle objave ne možete sami u uredniku. Ažuriramo delove sajta koji to traže i ispravljamo greške na stranicama. Kad počnete da radite u novom gradu ili uvedete novu uslugu, dodajemo stranicu za nju. Ako sajt menjate retko, stalno održavanje vam ne treba i izmenu naručite kad zatreba.",
    },
    {
      q: "Pravite li sajtove za advokate, restorane i agencije za nekretnine?",
      a: "Da, i delatnost pre svega menja spisak stranica. Advokatu treba stranica za svaku oblast prava koju ljudi traže, a restoranu jelovnik koji osoblje lako menja i adresa koja se vidi odmah. Agenciji za nekretnine treba pretraga oglasa po ceni i lokaciji. Na prvom razgovoru prođemo kroz pretrage u vašoj delatnosti i od njih složimo spisak.",
    },
    {
      q: "Možete li da preradite postojeći sajt umesto da pravite novi?",
      a: "Možemo, i ThermiQ je bio takav posao. Postojeći katalog dobio je nov dizajn, a usluge koje su ranije bile zakopane među proizvodima dobile su svoje stranice. Pre prerade u Search Console-u gledamo koje stranice već donose posete, da ih sačuvamo ili preusmerimo na nove adrese.",
    },
  ],
  cta: {
    title: "Zakažite razgovor i saznajte koje stranice vam trebaju",
    text: "Pošaljite nam adresu postojećeg sajta ili spisak usluga, pa ćemo na razgovoru reći koje stranice vašim kupcima trebaju i šta kod vas najviše određuje cenu izrade. Ako niste sigurni da je sajt prvi korak, [odgovorite na tri pitanja](/#vas-plan) i dobićete preporuku od čega da krenete.",
  },
};

export default page;
