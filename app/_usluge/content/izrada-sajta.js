/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   - Sajtove pravimo po meri, u Next.js-u, sa urednikom sadržaja Sanity u kome klijent sam menja tekst, cene i slike.
   - Izrada počinje razgovorom o firmi, kupcima i tome čemu sajt služi (prodaja, upiti ili prezentacija firme), pa tek onda dizajn.
   - Spisak stranica pravimo od toga kojim rečima kupci traže ono što klijent nudi.
   - Sajt dizajniramo prvo za ekran telefona.
   - Tekst za stranice pišemo mi, a klijent ga čita i ispravlja pre objave.
   - Klijent vidi i odobrava dizajn pre nego što počne programiranje; pregled ide preko video poziva.
   - Od klijenta u izradi tražimo cene i fotografije, odobrenje dizajna i čitanje teksta; sve ostalo radimo mi.
   - Pre objave sajt proveravamo na Google PageSpeed testu za telefon.
   - Posle objave prvo menjamo stranice sa kojih ljudi odlaze bez upita ili poziva.
   - Kad klijent ima stari sajt, njegove adrese preusmeravamo na nove; pre prerade u Search Console-u gledamo koje stranice već donose posete.
   - Tačan rok izrade upisujemo u ponudu, a ponuda je razložena po stavkama; veza sa kasom, plaćanjem ili lagerom je posebna stavka.
   - Sajt povezujemo sa kasom, plaćanjem karticom i programom za lager ili knjigovodstvo (Luka ih je naveo kao stavke cene); veze i automatizacije radimo i kao posebnu uslugu (AI i automatizacija).
   - Plaćanje karticom vezujemo za banku ili servis za plaćanje sa kojim klijent ima ugovor i pre objave proveravamo da porudžbina i plaćanje prolaze do kraja; prodavnicu povezujemo i sa kasom u radnji.
   - Stranice sajta po meri pripremljene su unapred, sajt ima malo tuđeg koda i retko traži ažuriranje; isti sajt kasnije može da dobije prodavnicu ili drugi jezik bez prelaska na novi sistem (pasus i tabela o WordPress-u).
   - WordPress pravimo kad ga klijent želi (Luka).
   - Hosting i https sertifikat za naše sajtove podešavamo mi; ranije verzije ostaju sačuvane i izmenu koja nešto pokvari vraćamo na prethodnu.
   - Održavanje obuhvata proveru brzine i grešaka, ažuriranje, nove stranice i izmene rasporeda i funkcija; nije obavezno, izmene se mogu naručiti pojedinačno.
   - Klijenti na održavanju sajta vide rad u klijentskom portalu i dobijaju mesečni izveštaj o brzini i upitima.
   - Ko plaća i vodi domen i hosting dogovaramo u ponudi.
   - Domen glasi na firmu klijenta; sajt, tekst, fotografije i kod (kod sajta po meri) pripadaju klijentu.
   - Ako klijent promeni izvođača, uz sajt dobija sve pristupe.
   - Osnovni SEO ulazi u izradu: naslov i opis za Google na svakoj stranici, mapa sajta, brzina; stalni SEO je posebna usluga.
   - Promena sačuvana u uredniku sama se pojavi na sajtu, bez programera.
   - Pravimo sajtove i za advokate, restorane i agencije za nekretnine. */

const page = {
  slug: "izrada-sajta",
  service: "web",
  seo: {
    title: "Izrada sajta i online prodavnice za vašu firmu | Digitl",
    description:
      "Brz sajt ili online prodavnica po meri, za firme od jednog čoveka do distributera. Pogledajte od čega zavisi cena izrade sajta i zakažite razgovor.",
  },
  label: "Web dizajn i razvoj",
  h1: "Izrada sajta i online prodavnice",
  lead: "Pravimo sajtove i online prodavnice za firme u Srbiji, od majstora koji radi sam do distributera sa hiljadama proizvoda. Svaki sajt pravimo da bude brz, jer kupac sa telefona ne čeka sporu stranicu, nego se vrati na Google i pozove sledeću firmu. Od prvog dana merimo koliko posetilaca vas pozove ili kupi, pa u brojkama vidite koliko vam novih kupaca sajt donosi.",
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
    title: "Izrada web sajta počinje od vaše firme",
    body: [
      "Kakav sajt vam treba zavisi od toga zašto kupac dolazi na njega. Neko hoće odmah da kupi proizvod, neko traži firmu za uslugu koja mu treba, a neko je za vas već čuo i želi da vidi ko ste pre prvog sastanka.",
      "Online prodavnica treba da odvede kupca do proizvoda, cene i plaćanja bez ijednog poziva. Sajt firme koja radi usluge treba da donese upit ili poziv, pa cena, područje rada i broj telefona stoje na vidnom mestu. Distributeri i firme koje rade preko preporuka često žele prezentaciju firme, sajt koji uredno pokaže šta rade i s kim su radili.",
      "Zato izrada kod nas počinje razgovorom o vašoj firmi i kupcima, a dizajn dolazi tek kad znamo čemu sajt služi. Od toga zavise spisak stranica i alati koje sajt mora da ima, pa i cena koju vidite u ponudi.",
      "Posle objave na sajt vode [pretraga](/usluge/seo-optimizacija) i [oglasi](/usluge/placeno-oglasavanje), pa ih planiramo zajedno sa sajtom, od prvog dana.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "Izradu, alate po meri i održavanje možete da naručite zajedno ili posebno, sa SEO-om i oglasima ili bez njih.",
    items: [
      {
        title: "Dizajn i izrada sajta ili online prodavnice",
        sub: "od plana do objave",
        text: "Od spiska stranica do objave na vašem domenu radimo tekst, dizajn i kod. Uz sajt dobijate urednik sadržaja u kome sami menjate cene, tekst i slike.",
      },
      {
        title: "Alati i povezivanja po meri",
        sub: "kalkulator, kasa, plaćanje",
        text: "Kalkulator za pitanje koje kupac postavi pre kupovine, na primer koja mu klima treba. Sajt povezujemo i sa kasom, plaćanjem karticom ili programom za lager.",
      },
      {
        title: "Održavanje i hosting",
        sub: "posle objave",
        text: "Hosting i https sertifikat su na nama. Posle svake izmene proveravamo da li je sajt ostao brz i ispravan, a nove stranice i funkcije dodajemo kad vam zatrebaju.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "Od vas su nam potrebni cene i fotografije, a u toku izrade odobravate dizajn i čitate tekst pre objave. Sve ostalo, od plana stranica do merenja, radimo mi.",
    items: [
      {
        title: "Razgovor i spisak stranica",
        text: "Prolazimo kroz ono što prodajete i kome, pa gledamo kojim rečima ljudi to traže. Od toga pravimo spisak stranica i onoga što svaka mora da kaže.",
      },
      {
        title: "Tekst i dizajn",
        text: "Pišemo tekst za svaku stranicu i dizajniramo je, prvo za ekran telefona. Dizajn vidite i odobravate pre nego što počne programiranje.",
      },
      {
        title: "Programiranje",
        text: "Sajt programiramo po meri i povezujemo ga sa urednikom sadržaja, a po potrebi i sa kasom ili plaćanjem. Pre objave mu proveravamo brzinu na Google PageSpeed testu za telefon.",
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
      slug: "ideal-keramika",
      title: "Ideal Keramika",
      text: "Web shop sa 8.532 proizvoda za prodavnicu pločica i opreme za kupatilo u Beogradu. Prve prodaje stigle su deset dana posle pokretanja.",
    },
    {
      slug: "thermiq",
      title: "ThermiQ",
      text: "Online prodavnica opreme za grejanje i klimatizaciju u Beogradu, sa 4.275 proizvoda. Za tri meseca sajt je dobio 4.719 poseta iz Google pretrage.",
    },
  ],
  guide: [
    {
      title: "Od čega zavisi cena izrade sajta?",
      body: [
        "Cenu izrade sajta najviše pomeraju vrsta sajta i veze sa drugim programima, mnogo više od samog broja stranica.",
        "Kad pravimo ponudu, gledamo ove stavke:",
        {
          list: [
            "vrsta sajta: prezentacija firme, sajt za usluge ili online prodavnica",
            "veza sa kasom, plaćanje karticom na sajtu ili veza sa programom za lager i knjigovodstvo, da se cene i stanje menjaju sami",
            "kalkulator, formular za zakazivanje ili drugi alat koji se programira posebno",
            "koliko različitih rasporeda stranica treba, na primer naslovna, usluga, cenovnik i projekat",
            "da li tekst pišemo mi ili ga već imate",
            "za prodavnicu, broj proizvoda i u kakvom su stanju podaci o njima",
            "da li već imate logo i boje ili ih pravimo pre sajta",
            "prelazak sa starog sajta, sa preusmeravanjem starih adresa",
          ],
        },
        "Najveći skok u ceni je između sajta i prodavnice. Prodavnica sa hiljadama artikala košta više zbog podataka, koje treba uvesti iz tabele i srediti po kategorijama. Uz to ide i šablon koji svakom proizvodu sam napiše naslov i opis za Google, kakav smo postavili za ThermiQ.",
        "Svaka veza sa drugim programom pravi se za sistem koji vaša firma već koristi, pa je u ponudi posebna stavka. Takve veze i automatizacije koje rade iza sajta radimo i kao zasebnu uslugu, [AI i automatizaciju poslovanja](/usluge/ai-automatizacija).",
        "Šest stranica usluga koje dele isti raspored brže se prave od tri stranice koje izgledaju svaka drugačije, pošto se raspored dizajnira i programira jednom.",
        "Ako treba da se uštedi, mi bismo pre smanjili broj posebnih dizajna nego broj stranica usluga. Svaka stranica usluge hvata svoju pretragu, dok poseban dizajn stranice o nama ne dovodi nikoga sa Google-a.",
      ],
    },
    {
      title: "Koliko traje izrada sajta i šta vi pripremate?",
      body: [
        "Izradu obično počinjemo 1 do 2 nedelje posle dogovora. Tačan rok upisujemo u ponudu, kad znamo spisak stranica i da li pravimo prodavnicu.",
        "Rok najviše zavisi od sadržaja. Programiranje ide po planu, ali sajt ne objavljujemo dok ne stignu vaše cene i fotografije.",
        "Zato je dobro da pre početka skupite ovo:",
        {
          list: [
            "spisak usluga ili proizvoda, sa cenama koje želite da objavite",
            "fotografije stvarnih radova, prostora ili ljudi, makar i sa telefona",
            "logo i boje, ako ih imate; ako nemate, [logo i vizuelni identitet](/usluge/brending-i-vizuelni-identitet) radimo pre sajta",
            "područje koje pokrivate i radno vreme",
            "pristup domenu i starom sajtu, ako postoje",
            "za prodavnicu, tabelu proizvoda sa šiframa, cenama i stanjem na lageru",
          ],
        },
        "Tekst ne morate da pišete sami, pošto ga pišemo mi iz razgovora sa vama. Pre objave ga pročitajte red po red, jer samo vi znate da li je svaka cena tačna i da li tu uslugu zaista radite onako kako je opisana.",
        "Fotografije sa telefona koje pokazuju vaše stvarne radove kupcu govore više od lepše slike preuzete sa interneta, koju je kupac možda već video na drugim sajtovima.",
      ],
    },
    {
      title: "WordPress ili sajt po meri, šta da izaberete?",
      body: [
        "Sajtove pravimo po meri, u savremenim tehnologijama, jer se takav sajt brže otvara i teže ga je napasti. Ako više volite WordPress, pravimo i njega.",
        "WordPress je besplatan sistem za upravljanje sadržajem, sa hiljadama gotovih šablona i dodataka koje može da instalira i neko ko ne programira. Sajt po meri programiramo u Next.js-u i povezujemo ga sa urednikom sadržaja Sanity, pa svaka stranica ima tačno ona polja koja vašoj firmi trebaju.",
        "Stranice sajta po meri pripremljene su unapred, pa se na telefonu otvaraju bez čekanja da se učitaju šablon i dodaci. Sajt koji smo napravili za [molersku firmu](/projects/moler-nis) ima Google PageSpeed ocenu 100 na telefonu.",
        "Bezbednost je druga razlika. Prema [izveštaju firme Patchstack](https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/), 91% novih bezbednosnih propusta nađenih u WordPress-u tokom 2025. bilo je u dodacima. Sajt po meri ima mnogo manje tuđeg koda, pa ima i manje mesta za napad i manje ažuriranja posle kojih nešto prestane da radi.",
        "Kad vam zatreba kalkulator, veza sa kasom ili nova vrsta stranice, programiramo je baš za vaš sajt. Tako sajt raste zajedno sa firmom, pa kasnije može da dobije prodavnicu ili drugi jezik bez prelaska na novi sistem.",
        {
          table: {
            head: ["Šta gledate", "Sajt po meri", "WordPress"],
            rows: [
              [
                "Brzina na telefonu",
                "Stranice su pripremljene unapred i otvaraju se odmah",
                "Zavisi od šablona i broja dodataka",
              ],
              [
                "Bezbednost",
                "Malo tuđeg koda, pa malo mesta za napad",
                "Dodaci su najčešće mesto napada i traže stalno ažuriranje",
              ],
              [
                "Nova funkcija",
                "Programiramo je za vaš sajt",
                "Instalirate dodatak, ako postoji onaj koji radi baš to",
              ],
              [
                "Održavanje",
                "Manje tuđih delova koje treba pratiti",
                "Redovno ažuriranje sistema, šablona i dodataka",
              ],
              [
                "Menjanje teksta",
                "Urednik sa poljima napravljenim za vaš sajt",
                "Poznat administratorski panel",
              ],
              [
                "Početak",
                "Sporiji, svaka stranica se dizajnira za vas",
                "Brz, uz gotov šablon",
              ],
              [
                "Ko može da preuzme sajt",
                "Programer koji radi u Next.js-u, kojih je manje",
                "Gotovo svaki web programer",
              ],
            ],
          },
        },
        "Manji broj programera koji rade u Next.js-u je stvaran nedostatak sajta po meri, i treba da ga znate pre nego što potpišete ugovor za izradu sajta sa bilo kim, pa i sa nama.",
        "WordPress pravimo kad ga vi želite, na primer kad vaši ljudi već rade u njemu. Tada računajte na redovno ažuriranje sistema i dodataka dok god sajt radi.",
      ],
    },
    {
      title: "Šta obuhvataju održavanje i hosting sajta?",
      body: [
        "Hosting je server na kome sajt stoji i sa koga se otvara posetiocima. Održavanje pokriva provere i izmene posle objave, sve što ne možete sami u uredniku.",
        "Hosting za sajtove koje pravimo podešavamo mi. Sajt dobija https sertifikat, katanac pored adrese bez koga Chrome i drugi pregledači posetiocu ispišu da stranica nije bezbedna. Ranije verzije sajta ostaju sačuvane, pa izmenu koja nešto pokvari vraćamo na prethodnu verziju.",
        "U održavanje sajta ulazi:",
        {
          list: [
            "provera brzine i grešaka posle svake izmene",
            "ažuriranje delova sajta koji to traže",
            "nova stranica kad uvedete novu uslugu ili počnete da radite u novom gradu",
            "izmena rasporeda i nove funkcije, koje u uredniku ne možete sami",
            "mesečni izveštaj o brzini sajta i upitima koji su stigli, a sve izmene vidite i u klijentskom portalu",
          ],
        },
        "Održavanje nije obavezno. Ako sajt menjate retko, stalno održavanje vam ne treba i svaku izmenu možete da naručite posebno, tek kad vam zatreba.",
        "Domen i hosting su troškovi koji traju dok sajt radi, a domen se obično plaća jednom godišnje. Ko ih plaća i vodi dogovaramo još u ponudi, da vas posle predaje ništa ne iznenadi.",
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
        "Ako jednog dana odlučite da promenite izvođača, uz sajt dobijate i sve pristupe, pa novi programer nastavlja tamo gde smo stali.",
      ],
    },
  ],
  price: {
    from: null,
    note: "Najmanje košta jednostavan sajt koji predstavlja firmu. Cenu podižu prodavnica, kalkulatori po meri i veze sa kasom, plaćanjem ili programom za lager. Pomeraju je i broj različitih vrsta stranica i to da li tekst pišemo mi. U ponudi su stavke i rok.",
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
      a: "Kod prodavnice najviše pažnje traži stranica proizvoda, više nego naslovna. Kupac koji ukuca tačan model treba da sleti baš na taj proizvod, sa cenom, stanjem i dugmetom za kupovinu. Za ThermiQ smo postavili i dnevnu promenu cena, pa prodavnica prati nabavku bez ručnog menjanja svake stavke.",
    },
    {
      q: "Može li online prodavnica da prima plaćanje karticom?",
      a: "Može. Plaćanje karticom ide preko banke ili servisa za plaćanje sa kojim vaša firma potpiše ugovor. Mi tu vezu programiramo u prodavnici i pre objave proveravamo da porudžbina i plaćanje prolaze do kraja. Ako prodajete i u radnji, prodavnicu možemo da povežemo i sa kasom.",
    },
    {
      q: "Pravite li sajtove za advokate, restorane i agencije za nekretnine?",
      a: "Da, i delatnost pre svega menja spisak stranica. Advokatu treba stranica za svaku oblast prava koju ljudi traže, a restoranu jelovnik koji osoblje lako menja i adresa koja se vidi odmah. Agenciji za nekretnine treba pretraga oglasa po ceni i lokaciji. Na prvom razgovoru prođemo kroz pretrage u vašoj delatnosti i od njih složimo spisak.",
    },
    {
      q: "Možete li da preradite postojeći sajt umesto da pravite novi?",
      a: "Možemo, a ThermiQ je primer takve prerade. Postojeći katalog dobio je nov dizajn, a usluge koje su ranije bile zakopane među proizvodima dobile su svoje stranice. Pre prerade u Search Console-u gledamo koje stranice već donose posete, da ih sačuvamo ili preusmerimo na nove adrese.",
    },
  ],
  cta: {
    title: "Zakažite razgovor i saznajte kakav sajt vašoj firmi treba",
    text: "Pošaljite nam adresu postojećeg sajta ili napišite šta prodajete i kome. Na razgovoru ćemo reći kakav sajt vam treba, sa čim treba da se poveže i šta kod vas najviše određuje cenu izrade. Ako niste sigurni da je sajt prvi korak, [odgovorite na tri pitanja](/#vas-plan) i dobićete preporuku od čega da krenete.",
  },
};

export default page;
