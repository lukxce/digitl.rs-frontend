/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live. Klijenti su na stranici bez imena; ime u
   zagradi je samo za tebe.
   Primeri iz rada (anonimno):
   - Online prodavnica opreme za grejanje i hlađenje sa hiljadama proizvoda (ThermiQ): svako jutro alat proveri cene dobavljača i konkurencije i postavi cenu 4% ispod najniže cene konkurencije; promena veća od 15% čeka da je neko iz prodavnice pogleda i potvrdi.
   - Ista prodavnica: preko API-ja svako jutro dobija nove cene; roba koja se prodaje na metar ima cenu po metru, pa alat poredi iste jedinice.
   - Prodavnica keramike i sanitarija (Ideal Keramika): cenovnici mnogo proizvođača, svaki u drugačijoj tabeli, ulaze u katalog sami, raspoređeni po kategorijama i osobinama; svaki proizvod dobije naslov i opis za Google.
   - Ponude za kupce prave se iz kataloga sa važećim cenama, a prodavac ih samo proveri i pošalje (u tekstu uz keramiku; isto važi za ThermiQ).
   - Prodavnica tonera (TonerPro): pretraga po modelu štampača vraća tonere koji odgovaraju; cene prate najnižu cenu na tržištu do granice marže koju određuje vlasnik.
   - Jedna firma (Praxis): CRM, program u kome se vodi evidencija klijenata (bez drugih detalja).
   Kako radimo (novo na ovoj stranici):
   - Pregled poslovanja: razgovaramo sa vlasnikom i sa ljudima koji zadatke rade svaki dan; zapisujemo šta se radi ručno, koliko traje i gde se greši.
   - Idejno rešenje: predlog koji zadatak ide prvi, odakle alat uzima podatke i šta odlučuju ljudi, sa cenom i rokom za svaki deo.
   - Izrada i održavanje: alat povezujemo sa sajtom i programima koje klijent koristi, pratimo ga i prilagođavamo kad se izvor promeni; dok se ne prilagodi, alat ne menja cene sam.
   - Svaki deo uvodimo posebno; nov alat neko vreme radi uporedo sa ručnim postupkom dok se rezultati ne poklope.
   - Pre izrade zapisujemo koliko zadatak traje, a posle prvih nedelja poredimo; rezultat i izmene klijent vidi u klijentskom portalu i mesečnom izveštaju.
   - Svaka automatizacija ima granicu do koje radi sama; sve preko nje čeka potvrdu čoveka iz firme.
   - AI stavljamo tamo gde čovek brzo proveri rezultat pre nego što stigne do kupca.
   - Zadatak koji se retko ponavlja ne predlažemo za automatizaciju.
   - Kolona „Šta odlučuje čovek“ u tabeli (granica marže, artikli koje uvoz ne rasporedi, popust za veće kupce, provera iznosa pre knjiženja i ostalo) opisuje kako takve alate pravimo.
   - Usluge koje nudimo, a nisu među urađenim primerima: AI asistent na sajtu, upiti sa sajta u CRM sa podsetnikom, čitanje podataka iz faktura, prodaja iz upita nazad u Google Ads (rađeno za ThermiQ, ali bez imena).
   - Sajt povezujemo sa fiskalnom kasom, lagerom ili knjigovodstvenim programom kad taj program ima API ili izvoz u tabelu; to proveravamo pre ponude.
   - AI asistent odgovara samo iz podataka firme, pitanje koje ne zna prosleđuje čoveku sa celim razgovorom, a pre puštanja ga proveravamo na pitanjima koja su kupci stvarno slali.
   - Podaci ostaju u bazi i na nalozima klijenta; AI modelu šaljemo samo podatke potrebne za zadatak.
   - Tačan iznos izrade i održavanja klijent dobija uz idejno rešenje, posle prvog razgovora. */

const page = {
  slug: "ai-automatizacija",
  service: "ai",
  seo: {
    title: "AI i automatizacija poslovanja za firme u Srbiji | Digitl",
    description:
      "Ponude koje se prave same, cene koje prate konkurenciju i cenovnici dobavljača bez prepisivanja. Pogledajte šta automatizujemo i zakažite razgovor.",
  },
  label: "AI i automatizacija",
  h1: "AI i automatizacija poslovanja",
  lead: "Pravimo AI alate i automatizacije koje sa vaših zaposlenih skidaju zadatke koji se ponavljaju svake nedelje. Cene se svako jutro usklade sa konkurencijom, ponuda se sastavi sama, a cenovnik dobavljača uđe u katalog bez prepisivanja. Vaši ljudi odlučuju samo o onome što traži procenu, na primer o velikoj promeni cene.",
  proof: [],
  intro: {
    title: "Šta je automatizacija poslovanja i gde pomaže AI",
    body: [
      "Automatizacija poslovanja znači da zadatke koji se ponavljaju po stalnim pravilima više ne rade vaši zaposleni ručno. To su prepisivanje cena, unos cenovnika dobavljača, sastavljanje ponuda i podsećanje na upite na koje niko nije odgovorio. Ljudima tako ostaje vreme za ono što traži procenu, kao što su razgovor sa kupcem ili odluka o ceni.",
      "AI (veštačka inteligencija) pomaže kod zadataka u kojima ulaz nije uredan, na primer kad svaki dobavljač kolone u cenovniku zove drugačije ili kad iz tehničkih podataka treba napisati opis proizvoda. Korist merimo u satima i greškama, pa pre izrade zapisujemo koliko zadatak traje danas.",
      "Za online prodavnicu opreme za grejanje i hlađenje, sa hiljadama proizvoda, napravili smo praćenje cena. Svako jutro alat proveri cene dobavljača i konkurencije i postavi cenu 4% ispod najniže cene konkurencije. Promena veća od 15% čeka da je neko iz prodavnice pogleda i potvrdi.",
      "Prodavnica keramike i sanitarija dobija cenovnike od mnogo proizvođača, svaki u drugačijoj tabeli. Uvoz ih sada sam raspoređuje u kategorije i osobine prodavnice, a svaki proizvod dobije naslov i opis za Google. Ponude za kupce prave se iz istog kataloga sa važećim cenama, pa prodavac samo proveri ponudu i pošalje je.",
      "Kupac u prodavnici tonera obično zna samo model svog štampača. Za tu prodavnicu smo napravili pretragu u kojoj upiše model i dobije tonere koji mu odgovaraju, a cene prate najnižu cenu na tržištu do granice marže koju određuje vlasnik.",
    ],
  },
  included: {
    title: "Šta dobijate od saradnje",
    intro:
      "Pre nego što napravimo bilo kakav alat, upoznajemo kako vaša firma radi danas i gde gubi vreme.",
    items: [
      {
        title: "Pregled poslovanja",
        sub: "gde odlazi vreme",
        text: "Razgovaramo sa vama i sa ljudima koji zadatke rade svaki dan. Zapisujemo šta se radi ručno, koliko traje i gde se greši, na primer cena koja kasni ili upit na koji niko nije odgovorio.",
      },
      {
        title: "Idejno rešenje",
        sub: "šta i kako automatizovati",
        text: "Dobijate predlog koji zadatak automatizujemo prvi, odakle alat uzima podatke i šta i dalje odlučuju vaši ljudi. Uz predlog idu cena i rok za svaki deo.",
      },
      {
        title: "Izrada i održavanje",
        sub: "i posle puštanja u rad",
        text: "Alat pravimo i povezujemo sa sajtom i programima koje već koristite. Posle puštanja ga pratimo i prilagođavamo kad dobavljač promeni cenovnik ili konkurent promeni sajt.",
      },
    ],
  },
  steps: {
    title: "Kako uvodimo automatizaciju",
    intro:
      "Svaki deo idejnog rešenja uvodimo posebno, pa prvi alat radi i proveren je pre nego što počnemo drugi.",
    items: [
      {
        title: "Pravila i granice",
        text: "Sa osobom koja zadatak radi danas zapisujemo pravila, na primer od koje cene se računa vaša. Dogovaramo šta ide samo, a šta čeka vašu potvrdu.",
      },
      {
        title: "Proba uz ručni rad",
        text: "Alat neko vreme radi uporedo sa ručnim postupkom. Rezultate poredimo dok se ne poklope.",
      },
      {
        title: "Puštanje u rad",
        text: "Alat radi sam, po rasporedu ili čim stigne nov podatak. Promene preko dogovorene granice stižu vam na potvrdu pre nego što ih kupac vidi.",
      },
      {
        title: "Poređenje sa ranijim",
        text: "Posle prvih nedelja poredimo koliko zadatak traje sada sa onim što smo zapisali na početku. Rezultat i izmene vidite u klijentskom portalu i mesečnom izveštaju.",
      },
    ],
  },
  cases: [],
  guide: [
    {
      title: "Koje zadatke u firmi vredi automatizovati",
      body: [
        "Vredi automatizovati zadatak koji se često ponavlja po istim pravilima i čiji podaci već postoje u tabeli, programu ili na sajtu.",
        "Ovo su zadaci koje automatizujemo, uz ono što posle toga i dalje odlučuju vaši ljudi:",
        {
          table: {
            head: ["Zadatak", "Šta ide samo", "Šta odlučuje čovek"],
            rows: [
              [
                "Cene prema konkurenciji",
                "Svako jutro se proveravaju cene konkurencije i dobavljača, pa se vaše menjaju po pravilu",
                "Pravilo, granica marže i promene veće od dogovorene granice",
              ],
              [
                "Cenovnici dobavljača",
                "Cene i podaci proizvođača ulaze u katalog, raspoređeni po vašim kategorijama i osobinama",
                "Artikli koje uvoz ne može sam da rasporedi",
              ],
              [
                "Ponude za kupce",
                "Ponuda se sastavi iz kataloga, sa važećim cenama",
                "Popust i uslovi za veće kupce",
              ],
              [
                "Upiti sa sajta",
                "Upit ulazi u CRM, sa podsetnikom kad treba javiti kupcu",
                "Šta ćete kupcu ponuditi",
              ],
              [
                "Naslovi i opisi za Google",
                "Svaki proizvod i svaka kategorija dobiju naslov i opis za pretragu",
                "Provera primera pre objave",
              ],
              [
                "Pitanja kupaca",
                "AI asistent na sajtu odgovara iz vaših cena, rokova i uslova",
                "Pitanja koja asistent ne zna, pa ih prosledi dalje",
              ],
              [
                "Fakture i dokumenti",
                "Iznosi i šifre iz PDF-a prelaze u tabelu",
                "Provera iznosa pre knjiženja",
              ],
              [
                "Prodaja iz upita",
                "Prodaja se vraća u Google Ads kao konverzija, pa se vidi koja je kampanja donela kupca",
                "Budžet po kampanjama, uz [plaćeno oglašavanje](/usluge/placeno-oglasavanje)",
              ],
            ],
          },
        },
        "Naslovi i opisi proizvoda spadaju i u [SEO optimizaciju](/usluge/seo-optimizacija). Kod prodavnice sa hiljadama artikala ručno pisanje nikad ne stigne do kraja kataloga, pa ga preuzima automatizacija.",
      ],
    },
    {
      title: "Kada vam treba AI, a kada obična automatizacija",
      body: [
        "AI vam treba kad zadatak traži razumevanje teksta ili tabele koja svaki put izgleda drugačije. Za zadatak sa jasnim pravilima dovoljna je obična automatizacija, koja je jeftinija i uvek daje isti rezultat.",
        "Praćenje cena je zadatak sa jasnim pravilima. Alat nađe najnižu cenu istog proizvoda, postavi vašu 4% ispod nje i proveri da li ostaje iznad granice marže, a za to AI ne treba.",
        "AI ima smisla tamo gde je ulaz neuredan ili gde treba napisati tekst:",
        {
          list: [
            "cenovnici dobavljača u kojima se ista osobina zove različito, kod jednog „boja“, a kod drugog „nijansa“",
            "opisi proizvoda i prevodi na druge jezike, napisani iz tehničkih podataka",
            "upiti kupaca koje treba razvrstati po vrsti i hitnosti",
            "fakture i dokumenti iz kojih treba izvući iznose i šifre",
            "odgovori na pitanja kupaca iz vaših cena i uslova",
          ],
        },
        "AI greši drugačije od automatizacije sa pravilima, jer i netačan odgovor napiše uverljivo. Zato ga stavljamo tamo gde čovek brzo proveri rezultat pre nego što stigne do kupca, na primer opis proizvoda pre objave.",
      ],
    },
    {
      title: "Odakle da počnete sa automatizacijom",
      body: [
        "Počnite od zadatka koji se često ponavlja i u kome greška košta, na primer od cene koja kasni za nabavkom ili ponude koja čeka danima.",
        "Pre nego što bilo kome naručite automatizaciju, za svaki zadatak koji vam pada na pamet odgovorite na ova pitanja:",
        {
          list: [
            "koliko puta nedeljno se zadatak ponavlja i koliko traje svaki put",
            "da li onaj ko ga radi može da zapiše pravila u nekoliko rečenica",
            "da li su podaci već u tabeli, programu ili na sajtu, ili stižu na papiru",
            "šta se dešava kad zadatak kasni ili se u njemu pogreši",
          ],
        },
        "Zadatak koji neko uradi jednom mesečno za nekoliko minuta neće vratiti ni cenu izrade ni trošak održavanja, pa takav zadatak ne predlažemo ni kad je tehnički lak.",
        "Kod prodavnice bismo prvo uzeli cene ili uvoz cenovnika, pošto tamo pogrešna cena odmah košta novac ili kupca koji je video nižu cenu u drugoj prodavnici. Kod firme koja prodaje usluge prvi su obično upiti i ponude, jer kupac koji dugo čeka odgovor pozove nekog drugog.",
      ],
    },
    {
      title: "Od čega zavisi cena automatizacije",
      body: [
        "Cenu najviše određuje koliko programa i izvora podataka treba povezati i u kakvom su stanju ti podaci, više nego sam broj proizvoda.",
        "API je način na koji dva programa razmenjuju podatke bez čoveka između njih. Jedna prodavnica sa kojom radimo preko API-ja svako jutro dobija nove cene. Kad program nema API, podaci idu preko izvoza u tabelu, što traži više provera.",
        "Kad pravimo ponudu, gledamo ove stavke:",
        {
          list: [
            "koliko programa povezujemo i da li imaju API ili samo izvoz u tabelu",
            "koliko ima izvora, na primer dobavljača ili prodavnica čije cene pratite",
            "da li se šifre proizvoda poklapaju između vas i dobavljača ili ih treba sparivati",
            "da li zadatak traži AI, čije se korišćenje plaća po broju obrada",
            "da li treba ekran na kome čovek odobrava promene preko granice",
          ],
        },
        "Posle izrade ostaje održavanje. Dobavljač promeni izgled cenovnika ili prodavnica koju pratite promeni sajt, pa alat treba prilagoditi novom obliku podataka.",
      ],
    },
    {
      title: "Kako automatizacija ostaje pod vašom kontrolom",
      body: [
        "Svaka automatizacija koju pravimo ima granicu do koje radi sama, a sve preko nje čeka potvrdu nekoga iz vaše firme.",
        "Kod praćenja cena granica je procenat promene, pa veliku razliku uvek vidi čovek pre kupca. Takva razlika često znači da su upoređena dva različita proizvoda.",
        "Recimo da druga prodavnica isti materijal prodaje po rolni, a vi po metru. Alat koji samo poredi brojeve tada bi vašu cenu spustio daleko ispod nabavne, pa prodavnica opreme za grejanje sa kojom radimo za robu na metar ima i cenu po metru.",
        "Ko god da vam pravi automatizaciju, proverite da ima ovo:",
        {
          list: [
            "granicu preko koje promena čeka potvrdu čoveka",
            "pregled pre uvoza, da vidite šta će se promeniti pre nego što se promeni",
            "zapis svake promene, sa vremenom i izvorom",
          ],
        },
        "Bez zapisa promena ne možete da utvrdite zašto je cena nekog proizvoda juče bila drugačija, a to je prvo pitanje kad se kupac požali.",
      ],
    },
  ],
  price: {
    from: 100,
    note: "Iznos zavisi od toga koliko programa povezujemo, koliko izvora podataka ima i u kakvom su stanju, i da li zadatak traži AI. Tačnu cenu izrade i održavanja dobijate uz idejno rešenje, posle prvog razgovora.",
  },
  faq: [
    {
      q: "Da li AI zamenjuje zaposlene?",
      a: "Preuzima prepisivanje i proveravanje, a odluke ostaju ljudima. Prodavac koji više ne prepisuje cenovnike ima više vremena za kupce, a veliku promenu cene ili ponudu za važnog kupca i dalje odobrava neko iz firme.",
    },
    {
      q: "Treba li nam nov sajt da bismo uveli automatizaciju?",
      a: "Ne mora. Praćenje cena, uvoz cenovnika i izveštaji mogu da rade uz sajt koji već imate, ako sajt može da primi podatke spolja. Kad je postojeći sajt zatvoren za izmene ili nema način da primi nove cene, predložićemo [izradu novog sajta](/usluge/izrada-sajta), pošto bi se cene na starom i dalje unosile ručno.",
    },
    {
      q: "Možete li da povežete sajt sa fiskalnom kasom ili knjigovodstvenim programom?",
      a: "Možemo, kad taj program ima API ili bar izvoz podataka u tabelu. Tada stanje na lageru i cene menjate samo u programu koji već koristite, a sajt ih preuzme sam. Na prvom razgovoru nam recite koji program koristite, pa ćemo pre ponude proveriti šta on dozvoljava.",
    },
    {
      q: "Šta se dešava kad dobavljač promeni cenovnik ili konkurent promeni sajt?",
      a: "Alat koji čita taj izvor tada mora da se prilagodi novom obliku podataka. Pratimo greške i neobične rezultate, na primer cenu koja preko noći padne mnogo više nego inače, i alat prilagođavamo u okviru održavanja. Dok to ne uradimo, alat ne menja cene sam.",
    },
    {
      q: "Može li AI asistent da odgovara kupcima na sajtu?",
      a: "Može, na pitanja čiji odgovor već postoji u vašim podacima, kao što su rok isporuke, garancija ili radno vreme. Asistent odgovara samo iz onoga što mu date, a pitanje koje ne zna ili koje traži ponudu prosleđuje čoveku, sa celim razgovorom. Pre puštanja ga proveravamo na pitanjima koja su vam kupci stvarno slali.",
    },
    {
      q: "Radite li automatizaciju i za firme koje nisu online prodavnice?",
      a: "Radimo. Za jednu firmu smo napravili CRM, program u kome se vodi evidencija klijenata. Firmama koje prodaju usluge najviše vremena obično odnose upiti, ponude i podsetnici za javljanje kupcu, a to su zadaci sa jasnim pravilima.",
    },
    {
      q: "Gde stoje podaci i ko ih vidi?",
      a: "Podaci ostaju u vašoj bazi i na nalozima koji glase na vašu firmu. Kad zadatak koristi AI, modelu šaljemo samo ono što mu za taj zadatak treba, na primer tehničke podatke proizvoda za opis, bez podataka o kupcima.",
    },
  ],
  cta: {
    title: "Pokažite nam zadatak koji vam uzima najviše vremena",
    text: "Zakažite razgovor i opišite jedan zadatak koji danas radite ručno, na primer ponude, cene ili uvoz cenovnika. Reći ćemo vam da li ga vredi automatizovati, šta bi išlo samo i šta bi čekalo vašu potvrdu.",
  },
};

export default page;
