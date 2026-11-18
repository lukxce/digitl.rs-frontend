/* Four Elements Spa Center: the story on /projects/four-elements. Brand from the idea, site, Instagram.

   Sources (studije-slucaja/assets/four-elements/facts.md):
   - No search numbers: the new site (v5) is a proposal; the study does not say it went live.
   - "The client liked the proposal" is Luka's account, 15 Nov 2026.
   - The building is Planet Residence (not "Delta Residence"). Services and prices are the spa's own.
   - Proposals the owner has not accepted yet (Quintessence, cosmetics) are not mentioned. */
import { img } from "./images";

const story = {
  slug: "four-elements",
  headline:
    "Vlasnik je imao snažnu ideju iza imena. Mi smo je pretvorili u brend, a iz njega su nastali sajt i Instagram.",
  standfirst:
    "Four Elements je butik spa centar u Nišu, u kompleksu Planet Residence, sa gostima i prostorom uređenim po izuzetnoj zamisli vlasnika. Iza imena je stajala jasna ideja, ali je do sada niko nije uspeo da prenese u formu. Mi smo krenuli od nje: prvo da je razumemo, pa da napravimo brend knjigu koju će i oni i mi koristiti nadalje. Iz te knjige su nastali sajt na srpskom i engleskom i Instagram sa objavama, pričama i video snimcima.",
  meta: [
    { label: "Klijent", value: "Four Elements Spa Center, Niš" },
    { label: "Delatnost", value: "Butik spa centar" },
    { label: "Šta smo radili", value: "Ideja, brend knjiga, sajt, Instagram" },
    { label: "Godina", value: "2026." },
  ],
  services: ["Brend", "Sajt", "Instagram"],
  numbers: [],
  chapters: [
    {
      id: "ideja",
      kicker: "Ideja",
      title: "Četiri elementa. Peti je vreme.",
      body: [
        "U starom shvatanju sveta četiri elementa grade sve, a peti, kvintesencija, je najčistiji. U spa centru četiri elementa su ono što prostor nudi: kamen, vodu, paru i toplotu. Peti je ono što gost dobija: vreme samo za sebe.",
        "Ideja nije naša. Bila je vlasnikova od početka, u imenu i u prostoru, i u njihovim rečima: „Četiri elementa, jedno vreme, samo za vas“. Naš posao je bio da je razumemo i zapišemo tako da je svako može preneti dalje.",
      ],
      widget: {
        kind: "stats",
        lines: [
          "Zemlja | Piling, maska od blata, toplo kamenje",
          "Voda | Bazen, hidro zona i hladan tuš",
          "Vazduh | Parno kupatilo sa eukaliptusom i slana soba",
          "Vatra | Finska sauna na 90 °C i topla ulja",
        ],
      },
      media: [
        {
          src: img("four-elements/knjiga-06"),
          alt: "Četiri elementa. Peti je vreme.",
          caption: "Ideja, iz brend knjige.",
        },
      ],
    },
    {
      id: "znak",
      kicker: "Znak i sistem",
      title: "Znak koji se čita kao sat.",
      body: [
        "Znak je ostao njihov, ali je dobio značenje. List je na dvanaest, vazduh na tri, plamen na šest, talas na devet. Prazna sredina je peti element, vreme.",
        "Iz toga raste ceo sistem. Boje dolaze iz kamena, drveta i zlata, a boje elemenata se pojavljuju samo kao tanka linija ili tačka. Rituali imaju dva sistema znakova: linijske ikone za sajt, meni i Instagram, rimske brojeve za vrata, peškire i etikete.",
      ],
      media: [
        {
          src: img("four-elements/knjiga-01"),
          alt: "Brend knjiga",
          caption: "Brend knjiga.",
        },
        {
          src: img("four-elements/knjiga-15"),
          alt: "Znak",
          caption: "Šest delova, jedan znak.",
        },
        {
          src: img("four-elements/knjiga-20"),
          alt: "Paleta",
          caption: "Paleta iz kamena, drveta i zlata.",
        },
        {
          src: img("four-elements/knjiga-28"),
          alt: "Znakovi rituala",
          caption: "Linija za svaki element.",
        },
      ],
    },
    {
      id: "glas",
      kicker: "Glas i primena",
      title: "Domaćin, a ne prodavac.",
      body: [
        "Spa centar ne prodaje uslugu, prodaje odmor. Zato brend govori sporo i tačno: umesto prideva, mere i materijali. „Finska sauna, 90 °C“ govori više od „vrhunskog iskustva“. Tri vrednosti, tišina, ritual i pažnja, vode svaku rečenicu.",
        "Brend knjiga pokriva sve što gost dodirne: meni rituala složen kao meni dobrog restorana, poklon vaučer, natpise, pakovanja, sajt i Instagram, sa pravilima šta se sme, a šta ne.",
      ],
      widget: {
        kind: "toggle",
        lines: [
          "A: Kako spa centri obično pišu",
          "- Vrhunsko iskustvo opuštanja",
          "- Luksuzni tretmani za vaše telo i duh",
          "- Prepustite se magiji",
          "B: Kako piše Four Elements",
          "- Finska sauna, 90 °C, vlažnost 10 do 20%",
          "- Ritual vode, 90 minuta, 9.700 RSD",
          "- Broj gostiju je ograničen, da svako ima svoj prostor",
        ],
      },
      media: [
        {
          src: img("four-elements/knjiga-43"),
          alt: "Meni rituala",
          caption: "Meni rituala, složen kao meni restorana.",
        },
      ],
    },
    {
      id: "sajt",
      kicker: "Sajt",
      title: "Sajt koji prvo pokaže prostor, pa tek onda cenu.",
      body: [
        "Gost spa centra kupuje osećaj pre nego što kupi termin. Naslovna zato počinje njihovim videom, pa vodi kroz rituale, spa arkadu sa temperaturom i vlagom svake prostorije, masaže i tretmane, i tek onda do cene i rezervacije.",
        "Rituali, masaže i cenovnik su na jednom mestu, sa filterima. Dnevna karta i članstvo su objašnjeni jednostavno, a ceo sajt postoji i na engleskom, sa cenama u dinarima i približno u evrima, za goste iz inostranstva.",
      ],
      media: [
        {
          src: img("four-elements/rituali"),
          alt: "Rituali",
          caption: "Rituali.",
        },
        {
          src: img("four-elements/cenovnik"),
          alt: "Masaže i cenovnik",
          caption: "Masaže, tretmani i cenovnik.",
        },
        {
          src: img("four-elements/en"),
          alt: "Engleska verzija",
          caption: "Engleska verzija.",
        },
        {
          src: img("four-elements/arkada"),
          alt: "Spa arkada",
          caption: "Spa arkada.",
        },
      ],
    },
    {
      id: "instagram",
      kicker: "Instagram",
      title: "Tamno, filmski i konkretno.",
      body: [
        "Instagram spa centara je pun peškira i sveća bez ijedne informacije. Pravac koji smo postavili koristi njihove fotografije u tamnim, filmskim tonovima sa zlatnim detaljem, a svaka objava kaže nešto tačno: minute, stepene, cenu, ime terapeuta.",
        "Profil počinje sa dvanaest objava: četiri rituala, šetnja kroz spa arkadu, masaže, tim i članstvo, uz priče, omote za istaknute priče, video snimke i plan objavljivanja za četiri nedelje.",
      ],
      piece: {
        kind: "feed",
        title: "Prve objave",
        note: "Iz serija Četiri rituala, Spa arkada, Članstvo i Tim.",
        cols: 3,
        items: [
          "ig-zemlja",
          "ig-arkada",
          "ig-clanstvo",
          "ig-tim",
          "ig-sauna",
          "ig-vatra",
        ].map((k) => img(`four-elements/${k}`)),
      },
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title: "Od ideje koju je imao samo vlasnik do brenda koji svi mogu da nose.",
    body: [
      "Four Elements je dobio brend knjigu koja zapisuje vlasnikovu ideju i pravila za svaku primenu, a iz nje sajt na dva jezika i Instagram spreman za objavljivanje. Knjigu nadalje koriste i oni i mi, pa svaki novi materijal govori istim jezikom. Klijentu se predlog dopao od prvog pregleda.",
      "Sledeće je puštanje novog sajta, prvi mesec objava po planu i fotografisanje tima i rituala po pravilima iz brend knjige.",
    ],
  },
  takeaways: [],
};

export default story;
