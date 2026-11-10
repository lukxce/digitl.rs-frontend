/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   - "Za lokalnu uslugu u gradu sa malo konkurencije pretraga obično počne ozbiljno da donosi upite za oko tri meseca" (opšte pravilo izvedeno iz Moler Niš i ElektroMil)
   - "U prvom mesecu gledamo da li je Google pročitao sve stranice", pozicije poredimo od drugog i trećeg meseca
   - Posle prvog pregleda klijent dobija spisak stranica i popravki za prva tri meseca
   - Cenu (iznos) za SEO dajemo posle pregleda sajta i pretraga u delatnosti klijenta
   - Na Google profilu firme sređujemo delatnost i fotografije urađenih poslova
   - Proveravamo da podešavanja sajta ne blokiraju robote kojima AI alati čitaju stranice
   - SEO radimo i na postojećem sajtu koji nismo mi pravili, ako je brz i može da se menja
   - Mesečni izveštaj pokazuje posete iz pretrage po stranici, upite koji su stigli iz pretrage i spisak posla za sledeći mesec
   - U klijentskom portalu se vidi spisak urađenih stranica i popravki
   - Ako klijent nema Google Search Console, podešavamo ga na početku saradnje */

const page = {
  slug: "seo-optimizacija",
  service: "seo",
  seo: {
    title: "SEO optimizacija sajta za Google i AI pretragu | Digitl",
    description:
      "SEO optimizacija sajta za firme iz Srbije: šta tačno radimo, koliko traje dok pretraga ne počne da donosi upite i od čega zavisi cena. Zakažite razgovor.",
  },
  label: "Search Engine Optimization (SEO)",
  h1: "SEO optimizacija sajta",
  lead: "Pišemo stranice za usluge koje prodajete i sređujemo sajt i Google profil firme, da vas na Google-u i u AI pretrazi nađu ljudi koji već traže takvu uslugu. Radimo za firme iz cele Srbije, od zanatskih radnji i ordinacija do online prodavnica. Svakog meseca vidite pozicije, posete i upite iz pretrage.",
  proof: [
    { value: "2.836", label: "poseta iz pretrage", href: "/projects/thermiq" },
    {
      value: "516",
      label: "klikova iz Google pretrage za tri meseca",
      href: "/projects/moler-nis",
    },
    {
      value: "Najveći izvor",
      label: "upita za tri meseca",
      href: "/projects/elektromil",
    },
  ],
  intro: {
    title: "Šta je SEO optimizacija i šta od nje dobijate",
    body: [
      "SEO optimizacija je posao na sajtu i oko njega koji pomaže da vas Google prikaže ljudima koji traže baš ono što prodajete, bez plaćanja po kliku. Naziv je skraćenica od Search Engine Optimization, optimizacija za pretraživače. Iste stranice i iste podatke o firmi danas čitaju i AI asistenti poput ChatGPT-a kad nekome preporučuju majstora ili prodavnicu.",
      "Pozicija na Google-u je za nas međukorak. Pratimo za koje pretrage se sajt pojavljuje i koliko ljudi iz njih dođe na sajt, a na kraju i koliko njih pozove ili pošalje poruku. Posao vam donosi taj poslednji broj, pa po njemu biramo koju stranicu pišemo ili popravljamo sledeću.",
      "Od SEO-a nemojte očekivati upite već sledeće nedelje. Ako vam posao treba odmah, brže će ga doneti [plaćeno oglašavanje](/usluge/placeno-oglasavanje), a SEO gradite paralelno da biste za nekoliko meseci manje zavisili od oglasa. Kad niste sigurni šta vam je prvi korak, [plan od tri pitanja](/#vas-plan) za pola minuta preporučuje da li da počnete od SEO-a ili od nečeg drugog.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "SEO usluge možete da naručite sve četiri zajedno ili samo onu koja vašem sajtu nedostaje.",
    items: [
      {
        title: "Pisanje sadržaja",
        sub: "stranice usluga i tekstovi",
        text: "Za svaku uslugu pišemo posebnu stranicu sa vašim cenama i rokovima, a uz nju tekstove koji odgovaraju na ono što ljudi pitaju pre nego što pozovu.",
      },
      {
        title: "Tehnički SEO",
        sub: "brzina i indeksiranje",
        text: "Proveravamo da li Google vidi svaku stranicu i da li ju je uvrstio u pretragu, što se zove indeksiranje. Zatim sređujemo naslove, opise i brzinu sajta na telefonu.",
      },
      {
        title: "Lokalni SEO",
        sub: "Google profil i mape",
        text: "Sređujemo Google profil firme i pazimo da ime, telefon i adresa budu isti na sajtu i u poslovnim imenicima. Tako vas lakše nađu ljudi iz vašeg grada, i u pretrazi i na mapi.",
      },
      {
        title: "AEO, optimizacija za AI pretragu",
        sub: "ChatGPT i AI odgovori",
        text: "Na sajtu pišemo jasne odgovore na pitanja kupaca i firmu opisujemo istim rečima svuda gde se pominje, pa AI asistent lakše pronađe vaš sajt i tačno ga prepriča.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "Redosled je isti za mali sajt usluga i za katalog sa hiljadama proizvoda, razlikuje se samo obim posla.",
    items: [
      {
        title: "Pregled pretraga",
        text: "Skupljamo pretrage kojima vas kupci traže, na primer uslugu sa imenom grada ili rečju „cena“, i gledamo za koje se vaš sajt već pojavljuje.",
      },
      {
        title: "Tehnička provera",
        text: "Merimo brzinu na telefonu i čitamo greške koje Google prijavljuje u Search Console-u, pa ono što koči ceo sajt popravljamo pre bilo kog novog teksta.",
      },
      {
        title: "Stranica po pretrazi",
        text: "Svaku uslugu i svako veće pitanje kupaca vezujemo za jednu stranicu. Pišemo stranice koje nedostaju i dopunjujemo one koje postoje.",
      },
      {
        title: "Izveštaj i plan",
        text: "U mesečnom izveštaju vidite šta se pomerilo u pretrazi i odakle stižu upiti, zajedno sa spiskom posla za sledeći mesec.",
      },
    ],
  },
  cases: [
    {
      slug: "moler-nis",
      title: "Moler Niš",
      text: "Za molersku firmu iz Niša, bez sajta i bez poznatog imena, rezultat je bio prvo mesto na Google-u za tri meseca.",
    },
    {
      slug: "elektromil",
      title: "ElektroMil",
      text: "Električaru iz Niša Google pretraga je postala najveći izvor upita za tri meseca, ispred preporuka koje su ranije donosile sav posao.",
    },
  ],
  guide: [
    {
      title: "Za koliko vremena SEO optimizacija daje rezultate",
      body: [
        "Za lokalnu uslugu u gradu sa malo konkurencije pretraga obično počne ozbiljno da donosi upite za oko tri meseca. U Beogradu i u traženim delatnostima računajte na duži rok.",
        "Toliko je trajalo kod molera i električara iz Niša, a kod električara je pomoglo i to što većina lokalnih firmi nije imala sajt sređen za pretragu.",
        "Rok najviše pomeraju tri stvari:",
        {
          list: [
            "koliko firmi u vašem gradu ima sređen sajt za iste usluge",
            "u kakvom je stanju sajt (stari sajt sa greškama prvo traži popravke)",
            "koliko usluga treba pokriti i koliko stranica za njih već postoji",
          ],
        },
        "U prvom mesecu gledamo da li je Google pročitao sve stranice i za koje pretrage se sajt uopšte pojavljuje. Pozicije za glavne pretrage poredimo od drugog i trećeg meseca, kad ima šta da se poredi.",
        "Oglas nestane iz pretrage onog dana kad prestanete da plaćate, a stranica koja je stigla na prvu stranu tu obično ostaje dok je sadržaj tačan i dok neko ne napiše bolji odgovor.",
      ],
    },
    {
      title: "Od čega zavisi cena SEO optimizacije",
      body: [
        "Cenu određuje obim posla, a njega najviše menjaju broj usluga koje sajt treba da pokrije i broj firmi koje se bore za iste pretrage.",
        "Isti paket ne može da pokrije i molera iz Niša i webshop sa hiljadama proizvoda, pa obim procenjujemo tek kad pogledamo sajt i pretrage u vašoj delatnosti.",
        {
          table: {
            head: ["Šta gledamo", "Kako to menja posao"],
            rows: [
              [
                "Broj usluga",
                "Svaka usluga dobija svoju stranicu sa opisom posla, cenom i odgovorima na pitanja kupaca. Više usluga znači više pisanja.",
              ],
              [
                "Stanje sajta",
                "Spor sajt ili stranice koje Google ne vidi traže tehničke popravke pre novog sadržaja.",
              ],
              [
                "Konkurencija",
                "U gradu gde malo firmi ima sređen sajt dovoljno je manje stranica. Za tražene usluge u Beogradu treba više stranica i više meseci.",
              ],
              [
                "Veličina kataloga",
                "Webshop sa hiljadama proizvoda sređujemo kroz šablone za naslove i opise, što je drugi posao od pisanja stranica usluga.",
              ],
              [
                "Google profil i imenici",
                "Ako profil firme ne postoji ili se podaci po imenicima razlikuju, prvo ih sređujemo i usklađujemo.",
              ],
            ],
          },
        },
        "Pre nego što bilo kome platite SEO, tražite spisak stranica i popravki za prva tri meseca. Bez njega posle tri meseca nemate po čemu da proverite šta ste dobili za svoj novac. Kod nas taj spisak stiže posle prvog pregleda, zajedno sa cenom.",
      ],
    },
    {
      title: "Kako radi lokalna SEO optimizacija za firmu iz jednog grada",
      body: [
        "Ljudi iz vašeg grada vas traže u Google pretrazi i na Google mapama, a na oba mesta Google bira između firmi za koje zna šta tačno rade i gde.",
        "Zato kod lokalnih firmi prvo sređujemo ovo:",
        {
          list: [
            "Google profil firme sa tačnom delatnošću i fotografijama urađenih poslova",
            "isto ime firme, telefon i adresu, napisane istim redom i istim rečima na sajtu, profilu i u svakom imeniku",
            "posebnu stranicu za svaku uslugu, sa opisom posla i cenom",
          ],
        },
        "Cena napisana na sajtu dovodi ljude koji uz uslugu u Google ukucaju i reč „cena“. Na [sajtu Moler Niš](/projects/moler-nis) stranica sa cenama donosi najviše klikova iz pretrage, više od početne strane.",
        "Ako radite u nekoliko gradova, nemojte praviti kopije iste stranice u kojima se menja samo naziv grada. Google takve stranice u svojim [pravilima o spamu](https://developers.google.com/search/docs/essentials/spam-policies) navodi kao doorway stranice, a sajt sa njima može da padne u rezultatima ili sasvim nestane iz njih.",
        "Stranica za drugi grad ima smisla kad ima nešto svoje, na primer poslove urađene baš tamo ili drugačije rokove dolaska.",
      ],
    },
    {
      title: "Šta pomaže da vas nađu ChatGPT i AI pretraga",
      body: [
        "AI asistenti poput ChatGPT-a sastavljaju odgovor iz stranica koje pronađu, pa im pomaže sajt sa jasnim odgovorima i firma opisana istim rečima svuda gde se pominje.",
        "AEO (Answer Engine Optimization) je zato najvećim delom urednički posao, a kod nas se svodi na četiri stvari:",
        {
          list: [
            "na stranici usluge, odmah ispod naslova, rečenica koja odgovara na pitanje kupca, na primer koliko posao košta ili traje",
            "isti opis firme i usluga na sajtu, Google profilu, društvenim mrežama i u imenicima",
            "cene i radno vreme napisani kao tekst na stranici, nikad samo na slici",
            "podešavanja sajta koja ne blokiraju robote kojima AI alati čitaju stranice",
          ],
        },
        "Recimo da na sajtu piše da radite samo u Nišu, a na Google profilu cela južna Srbija: asistent tada nema jasan odgovor na pitanje gde radite. Nijedna oznaka u kodu, uključujući strukturirane podatke, ne garantuje da će vas ChatGPT pomenuti, i to vam kažemo pre nego što bilo šta platite.",
        "Takve posete već stižu i firmama u Srbiji: na [sajt ThermiQ-a](/projects/thermiq) deo poseta dolazi iz AI asistenata, od ljudi koji ih pitaju koju opremu za grejanje i hlađenje da kupe.",
      ],
    },
  ],
  price: {
    from: null,
    note: "Cenu računamo za konkretan spisak stranica i popravki, pa pre početka znate i iznos i šta za njega dobijate.",
  },
  faq: [
    {
      q: "Možete li da garantujete prvo mesto na Google-u?",
      a: "Ne možemo, jer redosled rezultata određuje Google, a on u svom [vodiču za izbor SEO stručnjaka](https://developers.google.com/search/docs/fundamentals/do-i-need-seo) piše da prvo mesto niko ne može da garantuje. Obećavamo ono što zavisi od nas: spisak posla za svaki mesec i izveštaj koji pokazuje šta se od toga pomerilo. Ako vam neko garantuje prvo mesto, pitajte ga za koju pretragu i do kada.",
    },
    {
      q: "Da li radite SEO za firme iz Niša i drugih gradova?",
      a: "Da, radimo sa firmama iz cele Srbije, na daljinu iz Beograda. Za lokalni SEO ne moramo da budemo u vašem gradu, jer pretrage i Google profil firme sređujemo na isti način za Niš, Novi Sad ili Kragujevac. Moler Niš i ElektroMil su firme iz Niša, a ThermiQ je distributer iz Beograda.",
    },
    {
      q: "Radite li SEO optimizaciju za webshop?",
      a: "Radimo, i tu je posao drugačiji nego kod sajta sa nekoliko usluga. Kad prodavnica ima stotine ili hiljade proizvoda, naslove i opise podešavamo u šablonu, pa važe za ceo katalog odjednom. Tako je rađen ThermiQ, katalog sa hiljadama proizvoda koji je od jula do oktobra 2026. imao 2.836 poseta iz pretrage.",
    },
    {
      q: "Treba li za SEO nov sajt?",
      a: "Ne treba, ako se sajt brzo učitava na telefonu i ako na njemu možemo da menjamo tekstove i dodajemo stranice. Tada radimo na postojećem sajtu, ko god da ga je pravio. Ako je spor ili zaključan za izmene, predložićemo [izradu novog sajta](/usluge/izrada-sajta), pošto na takvom sajtu ni dobar tekst ne stiže daleko u pretrazi.",
    },
    {
      q: "Kako se vidi da SEO donosi upite?",
      a: "Po brojevima u mesečnom izveštaju. U njemu su pozicije za pretrage od kojih zavisi vaš posao, posete iz Google pretrage po stranici i upiti koji su stigli iz pretrage. Posao koji tog meseca radimo vidite i u klijentskom portalu, sa spiskom urađenih stranica i popravki.",
    },
    {
      q: "Šta vam treba od nas da bismo počeli?",
      a: "Pristup sajtu i Google profilu firme, ako ga imate, i spisak usluga koje želite da prodajete, sa cenama ili bar rasponom cena. Treba nam i Google Search Console, besplatan Google-ov alat koji pokazuje kako sajt stoji u pretrazi. Ako ga nemate, podešavamo ga na početku saradnje.",
    },
    {
      q: "Može li vlasnik firme sam da radi SEO?",
      a: "Osnove optimizacije sajta za Google može, i vredi ih znati i kad radite sa agencijom. Napišite posebnu stranicu za svaku uslugu, sa cenom gde god možete, i u Search Console-u proveravajte koje stranice Google nije uvrstio u pretragu. Agencija se isplati kad vam za to ne ostaje vremena, ili kad se za iste pretrage u vašem gradu bori mnogo firmi.",
    },
  ],
  cta: {
    title: "Saznajte za koje pretrage vas kupci još ne nalaze",
    text: "Zakažite razgovor, pa ćemo pogledati za koje pretrage se vaš sajt pojavljuje i koje stranice mu nedostaju. Ako vam treba samo smer, odgovorite na tri pitanja i dobićete preporuku od čega da krenete.",
  },
};

export default page;
