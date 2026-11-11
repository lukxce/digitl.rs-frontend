/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   Urađeni projekti (iz tvoje poruke i beleški, proveri formulaciju):
   - ThermiQ: ponude se prave automatski, sa važećim cenama iz kataloga.
   - ThermiQ: program svake nedelje prati cene konkurencije i cenu prodavnice postavlja prema najnižoj; promena veća od 15% ne ide na sajt dok je čovek ne potvrdi.
   - ThermiQ: cene se svakog dana menjaju preko API-ja, bez ručnog unosa.
   - ThermiQ: prodaja iz upita vraća se u Google Ads kao konverzija, pa se vidi koja je kampanja donela kupca.
   - ThermiQ: na upite kupaca odgovara se iz administracije prodavnice.
   - ThermiQ: roba koja se prodaje na metar ima cenu po metru, pa program poredi iste jedinice.
   - Ideal Keramika: ponude se prave automatski.
   - Ideal Keramika: cenovnici i podaci o proizvodima od više proizvođača ulaze u katalog sami, raspoređeni po kategorijama i osobinama prodavnice.
   - Ideal Keramika: svaki proizvod i svaka kategorija imaju automatski napisan naslov i opis za Google.
   - Ideal Keramika: kupac i prodavnica dobiju poruku e-poštom čim stigne porudžbina ili upit.
   - TonerPro: kupac upiše model štampača i dobije tonere koji mu odgovaraju.
   - TonerPro: cene se drže najnižim na tržištu, uz donju granicu marže.
   - Praxis: CRM napravljen za njih, program u kome se vodi evidencija klijenata (bez drugih detalja).
   Kako radimo (novo na ovoj stranici):
   - Pre izrade zapisujemo koliko zadatak traje danas, da posle ima sa čim da se poredi.
   - Prvi korak je prolazak kroz običnu nedelju u firmi i spisak ručnih zadataka.
   - Automatizaciju uvodimo zadatak po zadatak; prvi alat je proveren u radu pre nego što počne drugi.
   - Nov alat prvo radi uporedo sa ručnim postupkom, dok se rezultati ne poklope.
   - Svaka automatizacija ima granicu do koje radi sama; sve preko nje čeka potvrdu čoveka iz firme.
   - Naše automatizacije imaju pregled pre uvoza i zapis svake promene.
   - AI stavljamo tamo gde čovek brzo proveri rezultat pre nego što stigne do kupca.
   - Zadatak koji se retko ponavlja ne predlažemo za automatizaciju.
   - Pratimo greške i promene u izvorima i alat prilagođavamo u okviru održavanja; dok se ne prilagodi, ne menja ništa sam.
   - Rad i izmene klijent vidi u klijentskom portalu i mesečnom izveštaju.
   - Sajt povezujemo sa fiskalnom kasom, lagerom ili knjigovodstvenim programom kad taj program ima API ili izvoz u tabelu; to proveravamo pre ponude.
   - Usluge koje nudimo, a nisu među urađenim projektima: AI asistent na sajtu, upiti sa sajta u CRM sa podsetnikom, čitanje podataka iz faktura, opisi i prevodi, nedeljni izveštaj koji se sastavi sam.
   - AI asistent odgovara samo iz podataka firme, pitanje koje ne zna prosleđuje čoveku sa celim razgovorom, a pre puštanja ga proveravamo na pitanjima koja su kupci stvarno slali.
   - Podaci ostaju u bazi i na nalozima klijenta; AI modelu šaljemo samo podatke potrebne za zadatak.
   - Svaku od tri grupe (cene i katalog, ponude i upiti, veze između programa) klijent može da naruči posebno.
   - Iznos izrade i trošak održavanja pišemo u ponudi posle prvog razgovora. */

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
  lead: "Pravimo AI alate i automatizacije koje u prodavnicama i drugim firmama preuzimaju zadatke koji se ponavljaju svake nedelje. Ponuda se sastavi sama, cene prate konkurenciju, a cenovnik dobavljača uđe u katalog bez prepisivanja. Vi potvrđujete samo ono što traži odluku, na primer veliku promenu cene.",
  proof: [
    {
      value: "Svake nedelje",
      label: "cene prema najnižoj kod konkurencije",
      href: "/projects/thermiq",
    },
    {
      value: "Uz potvrdu",
      label: "samo velike promene cena",
      href: "/projects/thermiq",
    },
  ],
  intro: {
    title: "Šta je automatizacija poslovanja i gde pomaže AI",
    body: [
      "Automatizacija poslovanja je program koji umesto zaposlenog radi zadatke sa stalnim pravilima, od prepisivanja cena do slanja potvrde porudžbine. AI (veštačka inteligencija) tu preuzima i zadatke koji su do skoro tražili čoveka, kao što su čitanje cenovnika u kome svaki dobavljač kolone zove drugačije ili pisanje opisa proizvoda iz tehničkih podataka.",
      "Korist od automatizacije meri se u satima i greškama. Ako je nekome prepisivanje cenovnika uzimalo celo prepodne svake nedelje, posle automatizacije mu ostaje samo da pregleda promene koje je program napravio i potvrdi one koje traže odluku. Zato pre izrade zapisujemo koliko zadatak traje danas, da posle imate sa čim da poredite.",
      "Alate ugrađujemo u sajt koji već imate ili u [novi sajt koji pravimo za vas](/usluge/izrada-sajta), i povezujemo ih sa programima koje firma koristi. Tako smo radili za online prodavnice ThermiQ, Ideal Keramika i TonerPro, a za Praxis smo napravili CRM, program u kome se vodi evidencija klijenata. Kod ThermiQ-a se uz to prodaja iz upita vraća u Google Ads, pa se u [oglasima](/usluge/placeno-oglasavanje) vidi koja je kampanja donela kupca.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "Automatizacije smo podelili po mestu gde ručni rad nastaje, i svaku grupu možete da naručite posebno.",
    items: [
      {
        title: "Cene i katalog proizvoda",
        sub: "cene, cenovnici, opisi",
        text: "Program prati cene konkurencije i menja vaše po pravilu koje postavite, uz donju granicu marže. Cenovnike dobavljača uvozi u vaše kategorije, a svakom proizvodu napiše naslov i opis za Google.",
      },
      {
        title: "Ponude, upiti i kupci",
        sub: "od upita do odgovora",
        text: "Ponude se prave same, a potvrde porudžbina i upita odlaze bez ručnog slanja. Upit sa sajta ulazi u CRM sa podsetnikom kad treba javiti kupcu, dok AI asistent na sajtu odgovara na česta pitanja.",
      },
      {
        title: "Veze između programa",
        sub: "sajt, kasa, knjigovodstvo",
        text: "Sajt povezujemo sa fiskalnom kasom, lagerom ili knjigovodstvenim programom, pa se stanje i cene menjaju na jednom mestu. Nedeljni izveštaj o prodaji i upitima sastavi se sam, iz podataka koje programi već imaju.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "Automatizaciju uvodimo zadatak po zadatak, pa je prvi alat proveren u radu pre nego što počnemo drugi.",
    items: [
      {
        title: "Ručni zadaci",
        text: "Sa vama prolazimo kroz običnu nedelju u firmi i zapisujemo šta se radi ručno, ko to radi i koliko vremena uzima.",
      },
      {
        title: "Pravila i granice",
        text: "Za zadatak koji ide prvi zapisujemo pravila, na primer prema kojoj ceni se računa vaša. Dogovaramo šta program radi sam, a šta čeka vašu potvrdu.",
      },
      {
        title: "Izrada i proba",
        text: "Pravimo alat i puštamo ga da radi uporedo sa ručnim postupkom. Rezultate poredimo dok se ne poklope.",
      },
      {
        title: "Puštanje u rad",
        text: "Alat radi sam, po rasporedu ili čim stigne nov podatak. Promene preko dogovorene granice stižu vam na potvrdu pre nego što ih kupac vidi.",
      },
      {
        title: "Praćenje i izmene",
        text: "Pratimo greške i promene u izvorima, kao što je nov raspored kolona u cenovniku dobavljača. Šta smo menjali vidite u klijentskom portalu i mesečnom izveštaju.",
      },
    ],
  },
  cases: [
    {
      slug: "thermiq",
      title: "ThermiQ",
      text: "Prodavnica opreme za grejanje i hlađenje sa hiljadama proizvoda. Cene svake nedelje prate najnižu cenu kod konkurencije, a na upite kupaca odgovara se iz administracije prodavnice.",
    },
  ],
  guide: [
    {
      title: "Koje zadatke u firmi vredi automatizovati",
      body: [
        "Vredi automatizovati zadatak koji se često ponavlja po istim pravilima i čiji podaci već postoje u tabeli, programu ili na sajtu.",
        "Ovo su zadaci koje smo već automatizovali za klijente:",
        {
          table: {
            head: ["Zadatak", "Šta radi automatizacija", "Gde radi"],
            rows: [
              [
                "Ponude za kupce",
                "Ponuda se pravi sama, sa važećim cenama iz kataloga",
                "ThermiQ, Ideal Keramika",
              ],
              [
                "Cene prema konkurenciji",
                "Program prati cene istih proizvoda u drugim prodavnicama i prema najnižoj menja vašu",
                "ThermiQ, TonerPro",
              ],
              [
                "Cenovnici dobavljača",
                "Cene i podaci od više proizvođača ulaze u katalog, raspoređeni po vašim kategorijama i osobinama",
                "Ideal Keramika",
              ],
              [
                "Naslovi i opisi za Google",
                "Svaki proizvod i svaka kategorija dobijaju svoj naslov i opis za pretragu",
                "Ideal Keramika",
              ],
              [
                "Potvrde porudžbina i upita",
                "Kupac i prodavnica dobiju poruku e-poštom čim porudžbina ili upit stigne",
                "Ideal Keramika",
              ],
              [
                "Pretraga po štampaču",
                "Kupac upiše model štampača i dobije tonere koji mu odgovaraju",
                "TonerPro",
              ],
              [
                "Prodaja iz upita",
                "Prodaja koja je počela od oglasa vraća se u Google Ads kao konverzija",
                "ThermiQ",
              ],
              [
                "Evidencija klijenata",
                "CRM napravljen za firmu, sa svim klijentima na jednom mestu",
                "Praxis",
              ],
            ],
          },
        },
        "Isti pristup važi i za zadatke koje ima skoro svaka firma, šta god da prodaje. Za njih možemo da napravimo:",
        {
          list: [
            "AI asistenta na sajtu, koji na česta pitanja kupaca odgovara iz vaših cena, uslova i rokova",
            "prelazak upita sa sajta u CRM, sa podsetnikom kad treba javiti kupcu",
            "vezu sajta sa fiskalnom kasom, lagerom ili knjigovodstvenim programom",
            "čitanje iznosa i šifara iz faktura i drugih dokumenata u PDF-u",
          ],
        },
        "Naslovi i opisi proizvoda spadaju i u [SEO optimizaciju](/usluge/seo-optimizacija). Kod prodavnice sa hiljadama artikala ručno pisanje nikad ne stigne do kraja kataloga, pa naslov i opis za svaki proizvod i svaku kategoriju piše program.",
      ],
    },
    {
      title: "Kada vam treba AI, a kada obična automatizacija",
      body: [
        "AI vam treba kad program mora da razume tekst ili tabelu koja svaki put izgleda drugačije. Za zadatak sa jasnim pravilima dovoljna je obična automatizacija, koja je jeftinija i uvek daje isti rezultat.",
        "Praćenje cena je zadatak sa jasnim pravilima. Program nađe najnižu cenu istog proizvoda i proveri da li vaša nova cena ostaje iznad granice marže, a za to AI ne treba.",
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
        "AI greši drugačije od programa sa pravilima, jer i netačan odgovor napiše uverljivo. Zato ga stavljamo tamo gde čovek brzo proveri rezultat pre nego što stigne do kupca, na primer opis proizvoda pre objave.",
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
        "API je način na koji dva programa razmenjuju podatke bez čoveka između njih. Preko API-ja ThermiQ svakog dana dobija nove cene. Kad program nema API, podaci idu preko izvoza u tabelu, što traži više provera.",
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
        "Kod ThermiQ-a program svake nedelje menja cene prema konkurenciji, a promena veća od 15% ne ide na sajt dok je neko iz firme ne pogleda i potvrdi.",
        "Granica hvata greške u sparivanju proizvoda. Recimo da druga prodavnica isti materijal prodaje po rolni, a vi po metru. Program koji samo poredi brojeve tada bi vašu cenu spustio daleko ispod nabavne, pa ThermiQ za robu na metar ima i cenu po metru.",
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
    from: null,
    note: "Cena zavisi od toga koliko programa povezujemo, koliko izvora podataka ima i u kakvom su stanju, i da li zadatak traži AI. Iznos izrade i trošak održavanja pišemo u ponudi posle prvog razgovora.",
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
      a: "Alat koji čita taj izvor tada mora da se prilagodi novom obliku podataka. Pratimo greške i neobične rezultate, na primer cenu koja preko noći padne mnogo više nego inače, i alat prilagođavamo u okviru održavanja. Dok to ne uradimo, program ne menja cene sam.",
    },
    {
      q: "Može li AI asistent da odgovara kupcima na sajtu?",
      a: "Može, na pitanja čiji odgovor već postoji u vašim podacima, kao što su rok isporuke, garancija ili radno vreme. Asistent odgovara samo iz onoga što mu date, a pitanje koje ne zna ili koje traži ponudu prosleđuje čoveku, sa celim razgovorom. Pre puštanja ga proveravamo na pitanjima koja su vam kupci stvarno slali.",
    },
    {
      q: "Radite li automatizaciju i za firme koje nisu online prodavnice?",
      a: "Radimo, i CRM za Praxis je takav primer. Firmama koje prodaju usluge najviše vremena obično odnose upiti, ponude i podsetnici za javljanje kupcu, a to su zadaci sa jasnim pravilima.",
    },
    {
      q: "Gde stoje podaci i ko ih vidi?",
      a: "Podaci ostaju u vašoj bazi i na nalozima koji glase na vašu firmu. Kad zadatak koristi AI, modelu šaljemo samo ono što mu za taj zadatak treba, na primer tehničke podatke proizvoda za opis, bez podataka o kupcima.",
    },
  ],
  cta: {
    title: "Pokažite nam zadatak koji vam uzima najviše vremena",
    text: "Zakažite razgovor i opišite jedan zadatak koji danas radite ručno, na primer ponude, cene ili uvoz cenovnika. Reći ćemo vam da li ga vredi automatizovati, šta bi program radio sam i šta bi čekalo vašu potvrdu.",
  },
};

export default page;
