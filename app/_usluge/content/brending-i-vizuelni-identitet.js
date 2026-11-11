/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   - Brending delimo na četiri dela (pozicioniranje, vizuelni identitet, brend knjiga, šabloni) i svaki se može naručiti posebno. Ranije su bila tri dela, a šabloni su išli uz brend knjigu.
   - Vizuelni identitet koji radimo obuhvata i grafičke elemente i stil fotografija (ranije su se pominjala samo pravila za fotografije).
   - Logo predajemo kao vektor (SVG i PDF) i kao PNG sa providnom pozadinom.
   - Predajemo verziju logotipa u boji, jednobojnu i belu verziju za tamnu podlogu.
   - Uz logo ide skraćeni znak za profilnu sliku i ikonicu sajta.
   - Brend knjiga počinje pričom brenda (ko ste, za koga radite, po čemu se razlikujete).
   - U brend knjizi su kodovi boja za ekran (HEX, RGB) i za štampu (CMYK), fontovi sa veličinama i podatak gde se fontovi nabavljaju.
   - Brend knjiga ima pravila sa primerima dobre i pogrešne upotrebe.
   - Klijent dobija i izvorne fajlove.
   - Posle isplate imovinska prava na logo i identitet prenosimo na klijenta, i to piše u ugovoru.
   - Pokazujemo nekoliko pravaca identiteta (broj nije naveden), svaki sa svojim logotipom, bojama i fontovima, postavljen na zaglavlje sajta, objavu i oglas. Ranije su to bili pravci logotipa.
   - Uz svaki pravac objašnjavamo koji deo priče brenda nosi.
   - Broj krugova izmena i rok za svaki korak pišemo u ponudi.
   - Pozicioniranje zapisujemo i kad se naručuje samo logo (isti redosled koraka).
   - Pravce pokazujemo svima koji odlučuju, na istom sastanku.
   - Podela u tabeli na tri obima (logo, vizuelni identitet, identitet i brend knjiga) i šta ulazi u svaki; grafički elementi su sada u drugoj koloni.
   - Šabloni pokrivaju objave, storije i oglase; klijent u njima menja tekst i fotografiju (u kom alatu?).
   - Stari logo možemo da zadržimo i nacrtamo ponovo kao vektor.
   - Rad na daljinu: razgovori, predlozi i izmene preko video poziva i poruka.
   - Fajlove za štampu pripremamo po zahtevima štamparije koju klijent izabere.
   - Strana ne navodi tipično trajanje u danima ili nedeljama; ako želite broj, dodajte ga u odgovor "Koliko traje izrada logotipa i identiteta?". */

const page = {
  slug: "brending-i-vizuelni-identitet",
  service: "brand",
  seo: {
    title: "Brending, dizajn logotipa i vizuelni identitet | Digitl",
    description:
      "Brending za firme: pozicioniranje, dizajn logotipa i vizuelnog identiteta, brend knjiga i šabloni, da vas kupac prepozna svuda. Zakažite razgovor.",
  },
  label: "Brend i identitet",
  h1: "Brending i vizuelni identitet",
  lead: "Polazimo od priče vaše firme, od toga šta radite, za koga i po čemu se razlikujete, pa iz nje dizajniramo logo i ceo vizuelni identitet. Pravila za boje, fontove i upotrebu logotipa zapisujemo u brend knjigu, a uz nju dobijate šablone za objave i oglase. Tako vas kupac prepoznaje kao istu firmu na sajtu, na Instagramu i na tabli ispred lokala.",
  proof: [],
  intro: {
    title: "Šta je brending i šta od njega dobijate",
    body: [
      "Brending je izrada svega po čemu kupac pamti vašu firmu, od priče o tome ko ste i kako radite do boje na vizitkarti. Počinje pozicioniranjem, odnosno odlukom o tome po čemu se vaša firma razlikuje od drugih koje nude isto, pa iz te odluke posle izlaze i izgled i ton kojim firma piše.",
      "Vizuelni identitet je skup boja, fontova, logotipa i grafičkih elemenata po kome vas kupac prepoznaje svuda gde vas sreće. Uz njih idu pravila za upotrebu, recimo koja boja nosi akciju i koliko praznog prostora ostaje oko logotipa. Logo je najvidljiviji deo identiteta, ali sam logo ne kaže kojim slovima se piše cena ni kakve fotografije idu u oglas.",
      "Recimo da vaš logo postoji samo kao jedan JPG, a objave i cenovnike pravi onaj ko je tog dana slobodan. Posle godinu dana firma ima tri nijanse plave i dva različita fonta, pa kupac koji je video vaš oglas na Instagramu ne prepoznaje istu firmu kad otvori sajt.",
      "Zato sve odluke zapisujemo u brend knjigu i pravimo šablone za formate koje najčešće koristite. Po njima sledeći baner ili cenovnik može da napravi vaš zaposleni, druga agencija ili štamparija, a da izgleda kao sve ostalo što firma objavljuje. Svaki nov materijal se onda slaže od gotovih delova, pa nastaje brže i ne plaćate da neko ispočetka bira boje i slova.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "Brending ima četiri dela. Svaki možete da naručite i posebno, ali svaki polazi od onog pre njega, pa najviše vrede ovim redom.",
    items: [
      {
        title: "Strategija i pozicioniranje",
        sub: "šta brend govori i kome",
        text: "Razgovaramo o vašim kupcima i o tome zašto biraju baš vas. Iz toga pišemo jednu ili dve rečenice koje posle vode svaki crtež i svaki tekst.",
      },
      {
        title: "Vizuelni identitet",
        sub: "logo, boje, fontovi i elementi",
        text: "Crtamo logo u verzijama za svetlu i tamnu podlogu i biramo paletu u kojoj svaka boja ima namenu. Uz to biramo fontove i grafičke elemente koji se ponavljaju na svakom materijalu.",
      },
      {
        title: "Brend knjiga",
        sub: "pravila sa primerima",
        text: "Zapisujemo pravila za logo, boje, fontove i ton komunikacije, svako sa primerom. Po knjizi vaše materijale može da pravi i neko ko nije bio ni na jednom našem sastanku.",
      },
      {
        title: "Šabloni za objave i oglase",
        sub: "gotovi formati",
        text: "Pravimo šablone za objave, storije i oglase u formatima koje zaista koristite. U njima se menjaju tekst i fotografija, a raspored i boje ostaju isti.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "I kad naručite samo logo, prvo zapisujemo pozicioniranje. Redosled ostaje isti, samo su koraci kraći.",
    items: [
      {
        title: "Upoznavanje",
        text: "Gledamo sve gde se firma danas pojavljuje, od fakture do Instagrama. Pitamo šta prodajete, kome i s kim vas kupci porede.",
      },
      {
        title: "Priča brenda",
        text: "Priču vaše firme zapisujemo u nekoliko rečenica koje odobravate pre nego što počnemo da crtamo. One posle rešavaju svaki spor oko boje ili slova.",
      },
      {
        title: "Pravci identiteta",
        text: "Pokazujemo nekoliko različitih pravaca, svaki sa svojim logotipom, bojama i fontovima. Svaki postavljamo na zaglavlje sajta, objavu i oglas, pa identitet birate tamo gde će ga kupac videti.",
      },
      {
        title: "Doterivanje i pravila",
        text: "Izabrani pravac doterujemo kroz dogovorene krugove izmena. Zatim slažemo pravila za boje, fontove, razmake i fotografije i zapisujemo ih u brend knjigu.",
      },
      {
        title: "Šabloni i predaja",
        text: "Pravimo šablone i predajemo ih zajedno sa fajlovima i brend knjigom. Ako vodimo i vaš sajt, mreže ili oglase, identitet tamo primenjujemo odmah.",
      },
    ],
  },
  cases: [
    {
      slug: "thermiq",
      title: "ThermiQ, Beograd",
      text: "Nov identitet i brend knjiga u tri dela: brend, ton i primena. Crvena prati grejanje, plava hlađenje, od sajta do Instagrama.",
    },
  ],
  guide: [
    {
      title: "Šta je vizuelni identitet i šta ga čini?",
      body: [
        "Vizuelni identitet čini pet delova, i svaki mora da radi i na ekranu telefona i u štampi.",
        {
          list: [
            "logo, u verziji u boji, jednobojnoj i beloj za tamnu podlogu, uz skraćeni znak za profilnu sliku i ikonicu sajta u pregledaču",
            "boje, svaka sa namenom, na primer koja nosi akcije, a koja tehnički sadržaj",
            "fontovi, obično jedan za naslove i jedan za tekst",
            "grafički elementi koji se ponavljaju, kao okviri, linije, ikonice ili oblik izveden iz logotipa",
            "stil fotografija, recimo da li prikazujete ljude na terenu ili proizvod na čistoj pozadini",
          ],
        },
        "Kupac firmu prepoznaje po ponavljanju. Kad vidi istu boju i isti font na vizitkarti, u oglasu i na sajtu, posle nekoliko susreta zna čija je objava i pre nego što pročita ime.",
        "Zato vam treba i jednobojna verzija logotipa za pečat i fakturu koja se štampa crno-belo, a bez nje svako ko pravi dokument sam pretvara logo u sivo i svaki put dobije drugu nijansu.",
        "Logo crtamo kao vektor, sliku od linija i krivih koja ostaje oštra na bilo kojoj veličini. JPG razvučen na tablu od dva metra dobije mutne ivice, a na tamnoj fotografiji oko logotipa ostaje beli pravougaonik.",
      ],
    },
    {
      title: "Šta je brend knjiga i šta dobijate u njoj?",
      body: [
        "Brend knjiga je priručnik sa pravilima za logo, boje, fontove i ton komunikacije, u kome uz svako pravilo stoji primer. Knjiga koju predajemo ima ove delove:",
        {
          list: [
            "priču brenda: ko ste, za koga radite i po čemu se razlikujete",
            "zaštitni prostor oko logotipa i najmanju veličinu na kojoj se logo još čita",
            "boje sa kodovima za ekran (HEX i RGB) i za štampu (CMYK)",
            "fontove sa veličinama za naslove, tekst i cene, uz podatak gde se nabavljaju",
            "ton komunikacije, sa rečenicama koje firma koristi i onima koje izbegava",
            "primere na sajtu, objavama, storijima i oglasima, a pored njih i pogrešnu upotrebu",
          ],
        },
        "U brend knjizi [ThermiQ-a](/projects/thermiq) ton ima pet pravila, i uz svako stoji primer kako kategorija obično piše i šta umesto toga piše ThermiQ.",
        "Bez knjige pravila zna samo dizajner koji ih je smislio. Kad objave preuzme neko drugi, firma polako počinje da izgleda drugačije, a to se primeti tek kad se dva materijala nađu jedan pored drugog.",
        "Uz knjigu predajemo logo kao vektor u SVG i PDF formatu i kao PNG sa providnom pozadinom, zajedno sa izvornim fajlovima. Ove fajlove tražite od svakoga ko vam radi identitet, i od nas i od bilo koga drugog. Ako neki fali, tražite ga odmah pri predaji, jer za koju godinu ni dizajner obično više ne zna gde je ostao izvorni crtež.",
        "Šabloni idu uz knjigu, i kad objave vodimo mi kroz [vođenje društvenih mreža](/usluge/vodjenje-drustvenih-mreza), po njima pravimo objave iz meseca u mesec. Profil tako ostaje prepoznatljiv i kad ga kupac lista unazad.",
      ],
    },
    {
      title: "Da li vam treba samo logo ili ceo identitet?",
      body: [
        "Firmi koja tek počinje, sa jednim ili dva kanala, dovoljan je dizajn logotipa sa osnovnim bojama. Ceo vizuelni identitet vam treba kad se pojavljujete na više mesta, recimo na sajtu, na mrežama i u oglasima.",
        {
          table: {
            head: [
              "Šta dobijate",
              "Logo",
              "Vizuelni identitet",
              "Identitet i brend knjiga",
            ],
            rows: [
              [
                "Pozicioniranje u jednoj ili dve rečenice",
                "kratko",
                "da",
                "da",
              ],
              ["Logo u svim verzijama i fajlovima", "da", "da", "da"],
              ["Paleta sa namenom svake boje", "osnovne boje", "da", "da"],
              ["Fontovi i grafički elementi", "ne", "da", "da"],
              ["Primeri na sajtu, objavi i oglasu", "ne", "da", "da"],
              ["Pisana pravila i ton komunikacije", "ne", "ne", "da"],
              ["Šabloni za objave, storije i oglase", "ne", "ne", "da"],
              [
                "Kome odgovara",
                "firmi na početku, sa jednim ili dva kanala",
                "firmi sa sajtom i profilima koje vodi sama",
                "firmi u kojoj materijale pravi više ljudi ili spoljni saradnik",
              ],
            ],
          },
        },
        "Između vizuelnog identiteta i identiteta sa brend knjigom birate po tome ko će sledećeg meseca praviti objave i oglase. Ko je to kod vas?",
        "Ako ih pravite sami, pravila nosite u glavi, pa vam je dovoljan vizuelni identitet i jedna strana na kojoj su kodovi boja i fontovi. Kad objave i oglase pravi više ljudi ili spoljni saradnik, pisana pravila vam štede raspravu oko svake objave.",
        "Ceo identitet vam treba i pre [izrade sajta](/usluge/izrada-sajta), da izgled bude odlučen pre prve stranice. Dizajner sajta koji nema gotove boje i fontove mora sam da ih izmisli, pa za nekoliko meseci firma ima dva identiteta koja se međusobno ne slažu.",
      ],
    },
    {
      title: "Od čega zavisi cena brendinga i dizajna logotipa?",
      body: [
        "Cenu najviše određuje obim, odnosno koliko od četiri dela brendinga radimo. Odmah posle toga dolazi broj formata za koje pravimo šablone i primere.",
        "Baner za zaglavlje sajta i baner za telefon slažemo kao dve posebne kompozicije, jer isti raspored ne staje na uzak ekran. Svaki dodatni format je zato još jedno slaganje.",
        "Ponudu menjaju i ova pitanja:",
        {
          list: [
            "da li pravimo nov identitet ili osvežavamo postojeći",
            "da li firma već zna šta je izdvaja ili to prvo zapisujemo zajedno",
            "da li vam treba više verzija logotipa, recimo za dve delatnosti ili dve lokacije",
            "da li brend knjiga pokriva i ton komunikacije",
            "koliko krugova izmena dogovaramo",
          ],
        },
        "Na broju šablona možete da uštedite bez rizika. Počnite sa formatima koje objavljujete svake nedelje, a ostale dodajte tek kad vam prvi put zatrebaju za akciju, sajam ili novu lokaciju.",
        "Ako niste sigurni da je brend uopšte prvi korak, odgovorite na [tri pitanja](/#vas-plan) i dobićete preporuku od čega da krenete.",
      ],
    },
  ],
  price: {
    from: null,
    note: "Cena zavisi od toga koje delove brendinga radimo, od samog logotipa do pozicioniranja, brend knjige i šablona. Iznos i rok za svaki korak pišemo u ponudi posle prvog razgovora.",
  },
  faq: [
    {
      q: "Koliko traje izrada logotipa i identiteta?",
      a: "Sam logo traje kraće od celog identiteta sa brend knjigom i šablonima, a rok najviše zavisi od toga koliko brzo se kod vas donose odluke između krugova izmena. Najduže obično traje dogovor unutar firme, posebno kad o izgledu odlučuju dva suvlasnika ili cela porodica. Zato pravce pokazujemo svima koji odlučuju na istom sastanku, da se mišljenja ne skupljaju nedelju dana preko poruka. Rok za svaki korak upisujemo u ponudu.",
    },
    {
      q: "Koliko predloga logotipa dobijam?",
      a: "Dobijate nekoliko pravaca koji se jasno razlikuju, i svaki uz logo ima svoje boje i fontove, prikazane na primerima iz vaše delatnosti. Izabrani pravac posle doterujemo kroz krugove izmena, a njihov broj piše u ponudi. Gomila sličnih skica samo produži odluku, pa radije pokazujemo manje predloga i uz svaki objasnimo koju rečenicu iz pozicioniranja nosi.",
    },
    {
      q: "Ko je vlasnik logotipa i identiteta posle predaje?",
      a: "Vi. Posle isplate imovinska prava na logo i identitet prenosimo na vas, i to piše u ugovoru. Pošto dobijate i izvorne fajlove, logo i šablone možete da date bilo kojoj štampariji ili agenciji. Ako želite i zakonsku zaštitu imena i logotipa, prijavu žiga podnosite [Zavodu za intelektualnu svojinu](https://www.zis.gov.rs/prava/zig/).",
    },
    {
      q: "Da li je dovoljan logo iz AI alata ili besplatnog generatora?",
      a: "Za proveru ideje često jeste, i za par minuta vidite šta vam se dopada. Pre nego što takav logo stavite na tablu i fakture, proverite da li dobijate vektorski fajl i da li uslovi korišćenja alata dozvoljavaju komercijalnu upotrebu. Proverite i da li sličan logo već koristi neko drugi, jer isti alat koristi mnogo firmi. Predlog koji vam se dopada ponesite na prvi razgovor kao polaznu tačku.",
    },
    {
      q: "Imamo stari logo, da li moramo da ga menjamo?",
      a: "Ne morate, i često ne treba. Ako ga kupci prepoznaju, zadržavamo ono po čemu ga pamte, recimo oblik ili boju. Taj deo crtamo ponovo kao čist vektorski fajl i oko njega gradimo paletu, fontove i pravila. Nov logo predlažemo tek kad se stari ne čita na profilnoj slici veličine nokta ili kad previše liči na logo neke druge firme iz vaše branše.",
    },
    {
      q: "Da li radite brending za firme van Beograda?",
      a: "Da. Radimo iz Beograda za firme iz cele Srbije, a razgovori, predlozi i izmene idu preko video poziva i poruka. Fajlove i brend knjigu dobijate elektronski. Kad krene štampa, fajlove pripremamo po zahtevima štamparije koju sami izaberete u svom gradu, pa ne morate da tražite štampu u Beogradu.",
    },
    {
      q: "Da li mi treba agencija za brending ili je dovoljan dizajner?",
      a: "Za sam logo vam je dobar samostalni dizajner sasvim dovoljan. Agencija ima smisla kad identitet odmah ide na sajt, mreže i oglase, jer ga tada primenjuju isti ljudi koji vode te kanale i znaju zašto je neko pravilo tu. Mi vodimo i sajt, mreže i oglase, pa brend knjiga kod nas ne završi u fioci.",
    },
  ],
  cta: {
    title: "Isti izgled na svakom mestu",
    text: "Zakažite razgovor i pošaljite nam logo i nekoliko materijala koje danas koristite, od cenovnika do objava na mrežama. Reći ćemo vam da li vam treba nov identitet ili samo zapisana pravila za postojeći, i od kog dela brendinga bismo krenuli.",
  },
};

export default page;
