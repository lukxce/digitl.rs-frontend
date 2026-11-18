/* Four Elements Spa Center: the story on /projects/four-elements (rewritten 19 Nov 2026, humanize pass).

   Sources (studije-slucaja/assets/four-elements/facts.md):
   - No search numbers: the new site (v5) is a proposal; the study does not say it went live.
   - "The client liked the proposal" is Luka's account, 15 Nov 2026.
   - The idea behind the name is the owner's (Luka, 18 Nov 2026).
   - Posts and reels are direction 5 (spa4elements-concept/public/ig/v5). */
import { img } from "./images";

const reel = (n) => ({
  src: img(`four-elements/reel-${n}`),
  poster: img(`four-elements/reel-${n}-poster`),
});

const story = {
  slug: "four-elements",
  headline:
    "Za butik spa centar u Nišu zapisali smo vlasnikovu ideju u brend knjigu, a po njoj napravili sajt na dva jezika i Instagram.",
  standfirst:
    "Four Elements je butik spa centar u Nišu, u kompleksu Planet Residence. Vlasnik ga je uredio oko jedne ideje: četiri elementa, zemlja, voda, vazduh i vatra, i peti, vreme koje gost dobija za sebe. Ideja je postojala u imenu i u prostoru, ali nigde nije bila zapisana, pa je svaki materijal izgledao drugačije. Zapisali smo je kao brend knjigu sa znakom, bojama, tonom i pravilima, i po toj knjizi napravili sajt na srpskom i engleskom i prve objave i rilsove za Instagram.",
  meta: [
    { label: "Klijent", value: "Four Elements Spa Center, Niš" },
    { label: "Delatnost", value: "Butik spa centar" },
    {
      label: "Šta smo radili",
      value: "Brend knjiga, sajt, Instagram i rilsovi",
    },
    { label: "Godina", value: "2026." },
  ],
  services: ["Brend", "Sajt", "Instagram"],
  numbers: [],
  chapters: [
    {
      id: "razgovor",
      kicker: "Razgovor",
      title: "Prvi korak su bili razgovori sa vlasnikom.",
      body: [
        "Pitali smo zašto baš četiri elementa, šta gost treba da oseti kad izađe i po čemu se ovaj spa razlikuje od hotelskog. Odgovori su bili jasni, ali su postojali samo u razgovoru.",
        "Iz tih razgovora izašla je rečenica na kojoj stoji ceo brend: četiri elementa su ono što prostor nudi, a peti je vreme koje gost dobija za sebe.",
      ],
      pull: "Četiri elementa. Peti je vreme.",
    },
    {
      id: "brend-knjiga",
      kicker: "Brend knjiga",
      title: "Pravila koja koristi i njihov tim i naš.",
      body: [
        "U knjigu smo zapisali šta znači znak, koje su boje i slova, kako spa piše, kako izgleda meni rituala i kako se slikaju prostor i tim. Tu su i pravila za natpise, vaučere i Instagram.",
        "Ko god pravi nešto za Four Elements, njihov tim ili mi, radi po istim pravilima, pa vaučer, sajt i objava izgledaju kao delovi iste celine.",
      ],
      media: [
        {
          src: img("four-elements/knjiga-15"),
          alt: "Znak",
          caption: "Znak: list, vazduh, plamen i talas, a u sredini vreme.",
        },
      ],
    },
    {
      id: "sajt",
      kicker: "Sajt",
      title: "Na sajtu gost prvo vidi prostor, pa cenu.",
      body: [
        "Naslovna počinje njihovim videom, pa vodi kroz rituale, spa arkadu sa temperaturom svake prostorije, masaže i tretmane. Cena i rezervacija dolaze tek posle toga, kad gost već zna šta dobija.",
        "Rituali, masaže i cenovnik su na jednoj stranici sa filterima. Engleska verzija prikazuje cene i u evrima, za goste iz inostranstva.",
      ],
      media: [
        {
          src: img("four-elements/rituali"),
          alt: "Rituali",
          caption: "Rituali.",
        },
        {
          src: img("four-elements/arkada"),
          alt: "Spa arkada",
          caption: "Spa arkada sa temperaturom svake prostorije.",
        },
      ],
    },
    {
      id: "instagram",
      kicker: "Instagram",
      title: "Rilsovi i objave sa njihovim fotografijama.",
      body: [
        "Za Instagram koristimo fotografije njihovog prostora i tima, u toplim i tamnim tonovima, i u svakoj objavi jedan tačan podatak: minute, stepene ili cenu. Rilsovi vode kroz rituale, spa arkadu i tim.",
        "Pripremili smo prvih dvanaest objava, priče, omote istaknutih priča, četiri rilsa i plan objavljivanja za četiri nedelje.",
      ],
      piece: {
        kind: "reels",
        title: "Rilsovi",
        note: "Brend film, rituali, spa arkada i tim, novembar 2026.",
        items: [
          reel("brand-sr"),
          reel("rituals-sr"),
          reel("arcade-sr"),
          reel("team-sr"),
        ],
      },
      extra: {
        kind: "feed",
        title: "Iz prvih dvanaest objava",
        note: "Objave za početak profila.",
        cols: 3,
        items: ["grid-01", "grid-06", "grid-08"].map((k) =>
          img(`four-elements/v5-${k}`),
        ),
      },
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title: "Brend knjiga, sajt i Instagram po istim pravilima.",
    body: [
      "Four Elements ima brend knjigu u kojoj je zapisana vlasnikova ideja, sajt na srpskom i engleskom i Instagram spreman za objavljivanje. Klijentu se predlog dopao od prvog pregleda.",
      "Sledeće je puštanje novog sajta, prvi mesec objava po planu i fotografisanje tima i rituala po pravilima iz knjige.",
    ],
  },
  takeaways: [],
};

export default story;
