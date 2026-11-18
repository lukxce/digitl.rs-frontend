/* Planet Residence: the story on /projects/planet-residence. A new Instagram strategy for the last, larger flats.

   Sources (studije-slucaja/assets/planet-residence/facts.md):
   - Building facts are the client's (planetresidence.rs and brochure).
   - No reach or sales data: the proposal was delivered 15 and 17 Nov 2026.
   - The dm post is not shown (temporary stock photo). 3D models and renders are the client's; ours are the
     system, layout, copy and video. */
import { img } from "./images";

const story = {
  slug: "planet-residence",
  headline:
    "Instagram koji prodaje poslednje i najveće stanove, i život u zgradi u kojoj je sve na dohvat ruke.",
  standfirst:
    "Planet Residence je stambeno-poslovni kompleks u Nišu, pored Delta Planeta. Većina od 420 stanova je prodata, a ostali su najveći: četvorosobni, sa dvorištem i penthausi. Takav stan kupuje porodica koja bira način života, ne kvadrate. Zato profil prodaje i stan i zgradu: drogerija, apoteka, teretana i spa u prizemlju, dvorište samo za stanare i Delta Planet na sto metara. Za taj nivo kupca postavili smo novu Instagram strategiju, od sistema objava do video snimaka.",
  meta: [
    { label: "Klijent", value: "Planet Residence, Niš" },
    { label: "Delatnost", value: "Stambeno-poslovni kompleks" },
    {
      label: "Šta smo radili",
      value: "Strategija, sistem objava, tekstovi, video",
    },
    { label: "Cilj", value: "Prodaja poslednjih većih stanova i garaža" },
  ],
  services: ["Društvene mreže", "Sadržaj", "Video"],
  source:
    "Podaci iz ponude Planet Residence, novembar 2026. To su brojevi koje objave pokazuju kupcu umesto prideva.",
  numbers: [
    {
      value: "167",
      label: "m², najveći stan sa dvorištem",
      note: "dvorište 49,68 m²",
    },
    {
      value: "156",
      label: "m², penthaus na 11. spratu",
      note: "terasa 47,57 m²",
    },
    { value: "503", label: "garažna mesta", note: "punjač na zahtev" },
    { value: "100 m", label: "do Delta Planeta", note: "150 m do Nišave" },
  ],
  chapters: [
    {
      id: "strategija",
      kicker: "Strategija",
      title: "Od „prodaje se stan“ do „ovako se ovde živi“.",
      body: [
        "Model je profil koji smo ranije radili za Vojvoda Residence: stan kao 3D model na pesku, život u zgradi kroz svakodnevne situacije i zgrada kroz činjenice. Za Planet Residence smo ga podigli za veće stanove: više vazduha, mornarsko plava i zlatna iz njihovog logotipa, i veliki brojevi kvadrata umesto reči „luksuzno“.",
        "Profil počinje sa dvanaest objava poređanih tako da od prvog dana kaže šta se prodaje, kako se živi i šta zgrada ima.",
      ],
      piece: {
        kind: "templates",
        title: "Četiri šablona objava",
        note: "Primeri iz predloga za Planet Residence, novembar 2026.",
        items: [
          {
            name: "Stan",
            text: "3D model stana na pesku, površina kao veliki broj, sprat i terasa.",
            src: img("planet-residence/stan-ph"),
          },
          {
            name: "Život",
            text: "Svakodnevna situacija kao naslov, činjenica iz zgrade kao odgovor.",
            src: img("planet-residence/spa"),
          },
          {
            name: "Zgrada",
            text: "Njihova fotografija, jedna činjenica i jedan broj.",
            src: img("planet-residence/garaza"),
          },
          {
            name: "Karusel",
            text: "Raspored soba sa kvadraturom svake prostorije, pa enterijer i lokacija.",
            src: img("planet-residence/raspored"),
          },
        ],
      },
    },
    {
      id: "stanovi",
      kicker: "Stanovi",
      title: "Svaki stan kao maketa na stolu.",
      body: [
        "Njihovi 3D modeli stanova imaju tačno onu boju pozadine koju ima pesak u našem sistemu, pa model stoji na objavi bez okvira, kao maketa na stolu. Uz model idu samo brojevi koje kupac velikog stana gleda: ukupna površina, terasa, sprat.",
        "Karusel za svaki stan vodi dalje: raspored soba sa kvadraturom svake prostorije, enterijer iz novih rendera i poziv na razgledanje.",
      ],
      piece: {
        kind: "feed",
        title: "Stanovi u prodaji",
        note: "3D modeli i renderi su klijentovi, raspored, tekst i sistem su naši.",
        cols: 4,
        items: ["stan-ph", "stan-dv", "raspored", "enterijer"].map((k) =>
          img(`planet-residence/${k}`),
        ),
      },
    },
    {
      id: "zivot",
      kicker: "Život u zgradi",
      title: "Komšije su drogerija, apoteka, teretana i spa.",
      body: [
        "Veliki stan se ne kupuje zbog kvadrata, nego zbog svega oko njih. U prizemlju i na mezaninu su drogerija, apoteka, picerija, teretana, banka, prodavnica tehnike i spa centar. Te stvari smo pretvorili u situacije iz dana: naslov je trenutak koji svako zna, a odgovor je činjenica iz zgrade.",
        "Uz to idu lokacija sa udaljenostima peške i stranica zakupaca sa njihovim pravim logotipima.",
      ],
      piece: {
        kind: "feed",
        title: "Život u kompleksu",
        note: "Objave za seriju o životu u zgradi i oko nje.",
        cols: 3,
        items: ["zakupci", "lokacija", "brojevi"].map((k) =>
          img(`planet-residence/${k}`),
        ),
      },
    },
    {
      id: "price",
      kicker: "Priče i video",
      title: "Priče koje vraćaju na stan, i video iz njihovih rendera.",
      body: [
        "Priče svakodnevno podsećaju šta je još dostupno, pitaju pratioce šta im je važnije u novom stanu i vode na istaknute priče, složene kao meni sajta: Stanovi, Lokacija, Prizemlje, Spa, Garaža i Kontakt.",
        "Od rendera koje je klijent poslao napravili smo kratke video snimke: isti stan u devet ujutru i devet uveče, zgrada kao novi simbol grada i obilazak četvorosobnog stana.",
      ],
      piece: {
        kind: "feed",
        title: "Priče i video",
        note: "Priče, kadrovi iz video snimaka.",
        cols: 4,
        ratio: "9 / 16",
        items: [
          "story-dan-noc",
          "story-anketa",
          "reel-simbol",
          "reel-stan",
        ].map((k) => img(`planet-residence/${k}`)),
      },
    },
    {
      id: "pravila",
      kicker: "Pravila",
      title: "Sistem koji može da vodi bilo ko iz njihovog tima.",
      body: [
        "Uz objave smo predali i pravila: ton, boje, tipografiju, četiri šablona i primere teksta. Pravilo za tekst je jedno: piše kao savetnik za prodaju koji i sam živi u zgradi. Konkretno, mirno, uvek sa brojem, bez uzvičnika.",
      ],
      piece: {
        kind: "rewrite",
        title: "Kako se piše za Planet Residence",
        note: "Primeri iz pravila za tekst, predatih uz objave.",
        pairs: [
          [
            "Luksuzni život po meri modernog čoveka.",
            "Bazen i sauna, bez izlaska iz zgrade.",
          ],
          [
            "Poslednji stanovi, ne propustite!",
            "Penthaus 155,94 m², terasa 47,57 m², jedanaesti sprat.",
          ],
          [
            "Vrhunska lokacija u srcu grada.",
            "Delta Planet je na 100 metara, a Nišava na 150.",
          ],
        ],
      },
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title:
      "Od profila zgrade u prodaji do profila koji prodaje stan i lak život oko njega.",
    body: [
      "Planet Residence je dobio Instagram strategiju napravljenu za kupca velikog stana: sistem objava iz njihovog logotipa i rendera, prvih dvanaest objava, karusele za svaki stan u prodaji, priče, istaknute priče, video snimke i plan objavljivanja za četiri nedelje.",
      "Sledeće je fotografisanje zakupaca i dvorišta i oglasi koji vode na karusele stanova koji su još u prodaji.",
    ],
  },
  takeaways: [],
};

export default story;
