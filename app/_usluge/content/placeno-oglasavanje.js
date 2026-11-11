/* Za potvrdu (Luka): claims about how Digitl works that this page makes and
   that no approved source states, one per line, so Luka can confirm or cut
   them before the page goes live.
   - Merenje poziva, formi i poruka podešavamo pre pokretanja kampanja.
   - Kampanje pregledamo i podešavamo svake nedelje: pregledamo pretrage i publike, isključujemo one bez upita, pomeramo budžet.
   - Radimo u nalozima za oglase koji su na ime klijenta; nalozi, istorija i podaci ostaju klijentu posle saradnje.
   - Na Meti stranica firme i Instagram profil ostaju klijentu, a mi dobijamo ulogu sa pravom da vodimo oglase.
   - Nalog koji je druga agencija otvorila na svoje ime prvo tražimo da se preda klijentu, ili otvaramo nov.
   - Budžet za oglase klijent plaća direktno Google-u i Meti, sa svoje kartice u svom nalogu.
   - Tekstove oglasa pišemo mi i pravimo vizuale (slika ili kratak video) u istom izgledu kao sajt i profil; koristimo klijentove fotografije kad ih ima.
   - Posebne stranice za kampanje (landing) radimo u okviru izrade sajta.
   - Nijedna kampanja ne kreće dok je klijent ne pogleda i odobri.
   - Ljudima koji su već bili na sajtu prikazujemo podsetnik (remarketing).
   - Iz kampanja isključujemo pretrage koje troše novac bez upita.
   - Posle pregleda dajemo predlog kanala i mesečnog budžeta za oglase.
   - Postojeće kampanje prvo pregledamo i dajemo spisak šta gasimo, zadržavamo i dodajemo; kampanje koje donose upite ne diramo dok nove ne pokažu bolje.
   - Mesečni izveštaj ima potrošnju po kampanji i kanalu, upite po vrsti, cenu po upitu i promenu od prošlog meseca, isključene pretrage i publike i predlog za sledeći mesec.
   - Za online prodavnice umesto upita pratimo kupovine i njihovu vrednost.
   - Naknadu za vođenje određujemo prema broju kampanja i kanala i prema tome da li pravimo vizuale (stranice za kampanje idu kroz izradu sajta, pa nisu u ovoj naknadi).
   - Prodaje koje se zaključe kasnije (telefonom, u prodavnici) možemo automatski da uvozimo u Google Ads iz klijentove tabele ili programa, i tu vezu pravimo u okviru usluge AI i automatizacija.
   - Sa skromnim budžetom savetujemo jedan kanal; lokalnim uslugama koje se traže kad zatrebaju prvo kampanju u pretrazi.
   - Prvi klikovi stižu prvih dana posle odobrenja oglasa, a za cenu po upitu na koju se može računati treba nekoliko nedelja podataka.
   - Sa klijentima van Beograda dogovor ide telefonom, porukama i preko klijentskog portala. */

const page = {
  slug: "placeno-oglasavanje",
  service: "ads",
  seo: {
    title: "Plaćeno oglašavanje: Google Ads i Meta oglasi | Digitl",
    description:
      "Plaćeno oglašavanje za firme: Google Ads i oglasi na Facebook-u i Instagram-u, sa cenom po upitu za svaku kampanju. Pogledajte od čega zavisi cena.",
  },
  label: "Oglašavanje na internetu",
  h1: "Plaćeno oglašavanje",
  lead: "Vodimo plaćeno oglašavanje za firme koje od oglasa očekuju pozive, poruke i prodaju, na Google-u i na Facebook-u i Instagram-u. Pre prvog oglasa podešavamo merenje upita, pa za svaku kampanju znate koliko vas košta jedan upit. Taj broj dobijate u mesečnom izveštaju, uz predlog kako da rasporedimo budžet sledećeg meseca.",
  proof: [],
  intro: {
    title: "Kako plaćeni oglasi dovode upite",
    body: [
      "Kod plaćenog oglašavanja platformi plaćate da vaš oglas vidi tačno onaj ko vam treba, a za firme u Srbiji to su najčešće dva kanala. Google oglašavanje je plaćeno mesto u rezultatima pretrage koje dobijate kad neko ukuca ono što prodajete, a uglavnom ga plaćate tek kad neko klikne na oglas. Takav oglas stoji iznad ili ispod običnih rezultata, označen kao sponzorisan. Meta oglasi se pojavljuju na Facebook-u i Instagram-u ljudima koji vas nisu tražili, ali po mestu i interesovanjima liče na vaše kupce.",
      "Od te razlike zavisi kako pravimo oglas za svaki kanal. Na Google-u oglas vidi čovek kome je usluga već potrebna i koji sad bira koga da pozove, pa tekst treba tačno da odgovori na ono što je ukucao. Na Facebook-u i Instagram-u oglas mora da privuče pažnju nekoga ko lista objave i ne misli na vas, zato tamo slika i prva rečenica odlučuju više od same ponude.",
      "Oba kanala vodimo kao jedan budžet i merimo ih istim brojem, cenom po upitu. Kad Google donosi pozive jeftinije od Instagram-a, novac prebacujemo na Google, i obrnuto. Isto radimo između dve kampanje u istom kanalu, a razlog za svaku takvu odluku piše u mesečnom izveštaju.",
    ],
  },
  included: {
    title: "Šta je uključeno",
    intro:
      "Možete da naručite jedan kanal ili oba, a merenje upita podešavamo uz svaki.",
    items: [
      {
        title: "Google Ads kampanje",
        sub: "Oglasi u Google pretrazi",
        text: "Biramo pretrage za koje vredi platiti klik i pišemo tekstove oglasa. Pretrage ljudi koji traže zaposlenje ili besplatan savet troše novac bez upita, pa ih isključujemo iz kampanje.",
      },
      {
        title: "Meta oglasi na Facebook-u i Instagram-u",
        sub: "Publika, vizual i tekst",
        text: "Pravimo vizual, sliku ili kratak video, i pišemo tekst oglasa. Publiku biramo po mestu, uzrastu i interesovanjima, a ljudima koji su već bili na vašem sajtu prikazujemo podsetnik.",
      },
      {
        title: "Analitika i praćenje konverzija",
        sub: "Pozivi, forme i poruke",
        text: "Podešavamo merenje tako da se svaki poziv, poslata forma i poruka upišu uz kampanju iz koje su stigli. Tek tada cena po upitu postaje broj na koji možete da se oslonite.",
      },
    ],
  },
  steps: {
    title: "Kako radimo",
    intro:
      "Koraci su isti za Google i za Metu. Prva tri radimo jednom, pre nego što se pojavi prvi oglas. Poslednja dva ponavljamo svake nedelje i svakog meseca dok kampanje traju.",
    items: [
      {
        title: "Pregled i budžet",
        text: "Pregledamo vaše dosadašnje kampanje, ako ih imate, i šta ljudi kucaju u Google kad traže ono što prodajete. Na osnovu toga dobijate predlog kanala i mesečnog budžeta za oglase.",
      },
      {
        title: "Merenje pre oglasa",
        text: "Merenje postavljamo na sajt i u naloge za oglase pre prvog prikaza, pa se pozivi i poruke broje od prvog dana kampanje. Inače biste prve nedelje oglasa platili bez podatka o tome šta je donelo upit.",
      },
      {
        title: "Oglasi na odobrenje",
        text: "Pišemo tekstove, pravimo vizuale i biramo pretrage i publike. Nijedna kampanja ne kreće dok je vi ne pogledate i odobrite.",
      },
      {
        title: "Nedeljna podešavanja",
        text: "Svake nedelje pregledamo pretrage i publike koje su donele klikove i isključujemo one posle kojih niko nije zvao ni pisao. Budžet pomeramo na kampanje sa nižom cenom po upitu.",
      },
      {
        title: "Mesečni izveštaj",
        text: "Jednom mesečno šaljemo potrošnju, broj upita i cenu po upitu za svaku kampanju, uz predlog šta menjamo dalje. Iste brojeve vidite i u klijentskom portalu.",
      },
    ],
  },
  cases: [],
  guide: [
    {
      title: "Koliko košta plaćeno oglašavanje i od čega zavisi cena",
      body: [
        "Cenu čine dva odvojena iznosa: budžet koji ide direktno Google-u ili Meti za klikove i prikaze, i naknada koju plaćate nama za vođenje kampanja.",
        "Budžet za oglase raste i pada sa konkurencijom. Google za svaku pretragu održi aukciju u kojoj ne pobeđuje uvek najviša ponuda, jer [u računicu ulazi i kvalitet oglasa i stranice na koju vodi](https://support.google.com/google-ads/answer/1704431?hl=sr). Oglas koji tačno odgovara pretrazi zato može da dobije bolje mesto i po nižoj ceni klika.",
        "Visinu budžeta najviše pomeraju:",
        {
          list: [
            "broj firmi koje plaćaju iste pretrage u vašoj delatnosti",
            "područje na kome se oglas prikazuje, od jednog grada do cele Srbije",
            "sezona u kojoj vaši kupci traže najviše",
            "broj upita koji želite mesečno",
          ],
        },
        "Naknada za vođenje zavisi od broja kampanja i kanala. Jedna kampanja u pretrazi traži manje rada od više kampanja na oba kanala, sa vizualima koje svakog meseca pravimo iznova.",
        "Sa skromnim budžetom savetujemo jedan kanal. Novac podeljen na Google i Metu odjednom retko skupi dovoljno upita na bilo kojoj strani da bi se videlo šta radi, pa posle nekoliko meseci znate jedva više nego na početku.",
        "Oglasi donose upite onoliko dugo koliko ih plaćate. Posete iz pretrage za koje ne plaćate klik dolaze od [SEO optimizacije](/usluge/seo-optimizacija), i firmi koja planira dalje od ove sezone treba oboje.",
      ],
    },
    {
      title: "Google ili Facebook i Instagram, odakle da krenete",
      body: [
        "Ako ljudi vašu uslugu traže kad im zatreba, krenite od Google pretrage. Proizvod koji kupac mora prvo da vidi da bi ga poželeo bolje prolazi na Facebook-u i Instagram-u.",
        {
          table: {
            head: ["Šta poredite", "Google pretraga", "Facebook i Instagram"],
            rows: [
              [
                "Ko vidi oglas",
                "Čovek koji upravo traži uslugu ili proizvod",
                "Čovek koji lista objave i ne traži vas",
              ],
              [
                "Šta najbolje prolazi",
                "Usluge koje se traže kad zatrebaju, proizvodi koje ljudi traže po imenu",
                "Proizvodi koji se biraju okom, nova ponuda, lokalna publika",
              ],
              ["Za šta uglavnom plaćate", "Klik na oglas", "Prikaz oglasa"],
              [
                "Šta oglas nosi",
                "Tekst koji odgovara na pretragu",
                "Slika ili kratak video",
              ],
              [
                "Slaba tačka",
                "Malo pretraga za proizvod koji ljudi još ne poznaju",
                "Više upita koji se ne završe kupovinom",
              ],
            ],
          },
        },
        "Za vodoinstalatera ili servis bele tehnike prvo bismo postavili kampanju u pretrazi, pošto njih ljudi traže tek onog dana kad nešto procuri ili stane. Kuhinje po meri ili nov restoran prolaze bolje kad ih ljudi vide pre nego što su počeli da traže, i tu Meta oglasi obično dolaze prvi.",
        "Oglašavanje na društvenim mrežama i redovne objave na profilu su dve odvojene usluge. Oglas dovodi ljude do ponude, a profil sa urednim objavama ih uverava kad posle klika dođu da vide ko ste i da li još radite. Za objave na profilu imamo posebnu uslugu, [vođenje društvenih mreža](/usluge/vodjenje-drustvenih-mreza).",
        "Ako ste i dalje između dva kanala, [tri pitanja na početnoj strani](/#vas-plan) za oko pola minuta daju predlog odakle da počnete.",
      ],
    },
    {
      title: "Šta merimo i šta vidite u mesečnom izveštaju",
      body: [
        "Glavni broj je cena po upitu, za svaku kampanju posebno. Računamo je tako što potrošnju na oglase podelimo sa brojem poziva, formi i poruka koje su iz te kampanje stigle.",
        { visual: "report" },
        "Mesečni izveštaj, kao na primeru iznad, ima ove delove:",
        {
          list: [
            "potrošnju po kampanji i po kanalu",
            "broj upita, podeljen na pozive, forme i poruke",
            "cenu po upitu i kako se menjala od prošlog meseca",
            "pretrage i publike koje smo isključili",
            "predlog šta menjamo sledećeg meseca",
          ],
        },
        "Za online prodavnicu umesto upita brojimo kupovine i njihovu vrednost, pa izveštaj pokazuje koliko je prodaje donela svaka kampanja u odnosu na ono što je potrošila.",
        "Kod firmi koje upit pretvaraju u prodaju telefonom ili u prodavnici, Google Ads tu prodaju sam ne vidi. Zaključene prodaje zato možemo automatski da uvozimo u Google Ads iz tabele ili programa u kom ih vodite, pa izveštaj pokazuje i koja kampanja donosi kupce. Tu vezu pravimo u okviru [automatizacije poslovanja](/usluge/ai-automatizacija).",
        "Klikove i prikaze vidite u istom izveštaju, ali po njima ne odlučujemo. Kampanja sa mnogo jeftinih klikova i bez ijednog poziva troši novac, koliko god lepo izgledala na grafikonu. Znate li danas koliko vas je koštao poslednji poziv iz oglasa?",
        "Kad oglasi dovode posete a upita nema, problem je obično stranica na koju oglas vodi i na kojoj kupac ne nađe odgovor na ono što je ukucao. Tada predlažemo izmene te stranice ili posebnu stranicu za kampanju, koju radimo u okviru [izrade sajta](/usluge/izrada-sajta).",
      ],
    },
    {
      title: "Čiji su nalozi za oglase i podaci o kampanjama",
      body: [
        "Vaši. Nalog za oglase na Google-u i nalog na Meti otvaraju se na vašu firmu, a mi u njima radimo sa pristupom koji nam date.",
        "Stranica firme na Facebook-u i Instagram profil ostaju vaši, a mi dobijamo ulogu koja nam dozvoljava da vodimo oglase. Budžet se naplaćuje sa vaše kartice u vašem nalogu, pa svaki dinar koji je otišao Google-u ili Meti vidite na računu koji vam oni šalju.",
        "Istorija naloga čuva sve što ste već platili da naučite. U njoj piše koje pretrage donose upit, koliko je koji upit koštao i koje publike ne kupuju. Google i Meta iz tih podataka uče kome da prikazuju oglase, pa nalog sa istorijom posle promene agencije ne kreće od nule.",
        "Kad agencija vodi kampanje iz svog naloga, ta istorija posle raskida ostaje kod nje i vi sledeću kampanju plaćate kao da je prva. Ako saradnja sa nama prestane, naš pristup ukidate u podešavanjima naloga, a kampanje i podaci ostaju gde su bili.",
        "Ako je vaš sadašnji nalog otvorila druga agencija na svoje ime, prvo tražimo da vam preda vlasništvo. Kad to ne ide, otvaramo nov nalog na vašu firmu. Pre nego što bilo kome predate oglase, pitajte na čije ime se otvara nalog.",
      ],
    },
  ],
  price: {
    from: null,
    note: "Naknadu za vođenje određujemo prema broju kampanja i kanala i prema tome da li pravimo i vizuale za oglase. Budžet za oglase je poseban iznos i ide direktno Google-u i Meti.",
  },
  faq: [
    {
      q: "Šta radi agencija za Google Ads, a šta ostaje vama?",
      a: "Mi biramo pretrage i publike, pravimo oglase i podešavamo merenje, a budžet pomeramo svake nedelje. Vama ostaje ono što samo vi znate: koje usluge najviše zarađuju, kada ste zauzeti i šta kupci pitaju na telefonu. Te tri stvari nam kažete na početku, i od njih zavisi na šta trošimo novac.",
    },
    {
      q: "Koliko brzo stižu prvi upiti iz oglasa?",
      a: "Oglas počinje da se prikazuje čim ga Google ili Meta pregledaju i odobre, pa prvi klikovi stižu već prvih dana. Za cenu po upitu na koju možete da računate treba nekoliko nedelja podataka, dok ne vidimo koje pretrage i publike donose pozive a koje samo troše budžet.",
    },
    {
      q: "Da li radite Google oglašavanje za firme van Beograda?",
      a: "Da, iz Beograda vodimo oglase za firme iz cele Srbije, a dogovaramo se telefonom, porukama i preko klijentskog portala. Oglas se ionako podešava na područje gde su vaši kupci. To može da bude jedan grad, krug od nekoliko kilometara oko radnje ili cela zemlja.",
    },
    {
      q: "Da li vi pravite slike i tekstove za oglase?",
      a: "Pravimo. Tekstove oglasa pišemo mi, a vizuale za Facebook i Instagram radimo u istom izgledu kao vaš sajt i profil, pa kupac koji klikne odmah prepozna firmu. Ako imate fotografije sa terena ili iz radnje, koristimo njih, i to je obično bolje od fotografija sa interneta.",
    },
    {
      q: "Može li oglašavanje samo na Instagram-u, bez Facebook-a?",
      a: "Može, oba se vode iz istog Meta naloga, a za svaku kampanju biramo gde će se oglas prikazivati. Cena prikaza na Instagram-u zavisi od publike i od toga koliko drugih oglašivača u isto vreme cilja iste ljude, pa je unapred ne znamo tačno. Posle prvih dana vidimo je u nalogu i po njoj podešavamo budžet.",
    },
    {
      q: "Šta ako već imamo nalog i kampanje koje neko vodi?",
      a: "Onda krećemo od pregleda naloga, čija istorija pokazuje šta je već probano. Pre bilo kakve izmene proveravamo merenje i pretrage koje su trošile novac. Od nas dobijate spisak onoga što bismo ugasili, zadržali i dodali, a kampanje koje donose upite ne diramo dok nove ne pokažu da rade bolje.",
    },
    {
      q: "Garantujete li broj upita ili prvo mesto u oglasima?",
      a: "Ne. Broj upita zavisi od vaše ponude i sajta koliko i od oglasa, a mesto oglasa Google određuje na svakoj pretrazi iznova. Obećati možemo merenje svakog upita i izveštaj svakog meseca, pa uvek vidite koja kampanja donosi upite i po kojoj ceni.",
    },
  ],
  cta: {
    title: "Saznajte koliki budžet za oglase vam treba",
    text: "Zakažite razgovor, pa ćemo pregledati vaše dosadašnje kampanje ili, ako ih nemate, pretrage po kojima kupci traže ono što prodajete. Posle pregleda dobijate predlog na kom kanalu da počnete i sa kolikim mesečnim budžetom. Ako niste sigurni da su oglasi prvi korak, odgovorite na tri pitanja i dobićete preporuku od čega da krenete.",
  },
};

export default page;
