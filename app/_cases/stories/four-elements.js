/* Four Elements Spa Center: the story on /projects/four-elements. Told as what we did:
   understood the owner's idea, wrote it down as a brand book, and built the site and Instagram from it.

   Sources (studije-slucaja/assets/four-elements/facts.md):
   - No search numbers: the new site (v5) is a proposal; the study does not say it went live.
   - "The client liked the proposal" is Luka's account, 15 Nov 2026.
   - The idea behind the name is the owner's (Luka, 18 Nov 2026); never "nothing explained why".
   - Instagram posts shown are from direction 5 (spa4elements-concept/public/ig/v5). */
import { img } from "./images";

const story = {
  slug: "four-elements",
  headline:
    "Vlasnik je imao snažnu ideju iza imena. Mi smo je pretvorili u brend, a iz njega su nastali sajt i Instagram.",
  standfirst:
    "Four Elements je butik spa centar u Nišu, u kompleksu Planet Residence, sa gostima i prostorom uređenim po izuzetnoj zamisli vlasnika. Iza imena je stajala jasna ideja, ali je do sada niko nije uspeo da prenese u formu. Mi smo krenuli od nje: prvo da je razumemo, pa da napravimo brend knjigu koju će i oni i mi koristiti nadalje. Iz te knjige su nastali sajt na srpskom i engleskom i Instagram.",
  meta: [
    { label: "Klijent", value: "Four Elements Spa Center, Niš" },
    { label: "Delatnost", value: "Butik spa centar" },
    { label: "Šta smo radili", value: "Brend knjiga, sajt, Instagram" },
    { label: "Godina", value: "2026." },
  ],
  services: ["Brend", "Sajt", "Instagram"],
  numbers: [],
  chapters: [
    {
      id: "razumevanje",
      kicker: "Razumevanje",
      title: "Prvo smo slušali.",
      body: [
        "Nismo krenuli od logotipa ni od sajta, nego od razgovora sa vlasnikom: zašto baš četiri elementa, šta gost treba da oseti kad izađe, po čemu se ovaj spa razlikuje od hotelskog. Ideja je bila tu od početka, u imenu i u prostoru. Trebalo je samo da je neko zapiše.",
        "Iz tih razgovora izašla je jedna rečenica koja nosi sve ostalo: četiri elementa su ono što prostor nudi, a peti je vreme koje gost dobija za sebe.",
      ],
      pull: "Četiri elementa. Peti je vreme.",
    },
    {
      id: "brend-knjiga",
      kicker: "Brend knjiga",
      title: "Knjiga koju koriste i oni i mi.",
      body: [
        "Ideju smo zapisali kao brend knjigu: značenje znaka, boje i tipografiju, način na koji spa govori, meni rituala, pravila za fotografije, natpise, vaučere i mreže. Svako ko pravi nešto za Four Elements, njihov tim ili mi, ima isti priručnik.",
        "Zato sajt i Instagram nisu dva odvojena posla, nego dve primene iste knjige.",
      ],
      media: [
        {
          src: img("four-elements/knjiga-01"),
          alt: "Brend knjiga",
          caption: "Brend knjiga.",
        },
        {
          src: img("four-elements/knjiga-43"),
          alt: "Meni rituala",
          caption: "Meni rituala iz knjige.",
        },
      ],
    },
    {
      id: "sajt",
      kicker: "Sajt",
      title: "Sajt koji prvo pokaže prostor, pa tek onda cenu.",
      body: [
        "Dizajnirali smo novi sajt na srpskom i engleskom. Naslovna počinje njihovim videom, pa vodi kroz rituale, spa arkadu sa temperaturom svake prostorije, masaže i tretmane, i tek onda do cene i rezervacije.",
        "Rituali, masaže i cenovnik su na jednoj stranici sa filterima, dnevna karta i članstvo su objašnjeni jednostavno, a engleska verzija pokazuje cene i u evrima, za goste iz inostranstva.",
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
      ],
    },
    {
      id: "instagram",
      kicker: "Instagram",
      title: "Instagram iz iste knjige.",
      body: [
        "Postavili smo pravac za Instagram: njihove fotografije prostora, mirna tipografija i u svakoj objavi nešto tačno, minuti, stepeni ili cena. Pripremili smo prvih dvanaest objava, priče, omote istaknutih priča, video snimke i plan objavljivanja za četiri nedelje.",
      ],
      piece: {
        kind: "feed",
        title: "Iz prvih objava",
        note: "Rituali i spa arkada, novembar 2026.",
        cols: 3,
        items: ["rituals-sr-01", "arcade-01", "rituals-sr-04"].map((k) =>
          img(`four-elements/v5-${k}`),
        ),
      },
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title:
      "Od ideje koju je imao samo vlasnik do brenda koji svi mogu da nose.",
    body: [
      "Four Elements je dobio brend knjigu koja zapisuje vlasnikovu ideju, a iz nje sajt na dva jezika i Instagram spreman za objavljivanje. Knjigu nadalje koriste i oni i mi, pa svaki novi materijal govori istim jezikom. Klijentu se predlog dopao od prvog pregleda.",
      "Sledeće je puštanje novog sajta, prvi mesec objava po planu i fotografisanje tima i rituala po pravilima iz knjige.",
    ],
  },
  takeaways: [],
};

export default story;
