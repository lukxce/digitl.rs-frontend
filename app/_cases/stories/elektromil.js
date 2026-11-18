/* ElektroMil: the story on /projects/elektromil (rewritten 18 Nov 2026). No link to the site (Luka, 18 Nov).

   Sources (studije-slucaja/assets/elektromil/facts.md). elektromilnis.rs did not answer on 18 Nov 2026, so the
   images are Digitl's earlier ones. No Search Console access.
   - Measured: second organic result for "električar niš" in Niš, 27 Sep and 1 Nov 2026.
   - Luka (18 Nov): now first for "električar niš" and some other searches. First calls in month one, the site
     the biggest source of new clients by month three (old study, 11 Oct).
   - PageSpeed desktop 2 Aug 2026: 96, largest content in 0,9 s.
   - The gallery (stock photos) and the form (placeholder "youremail") are not shown. */
import { img } from "./images";

const story = {
  slug: "elektromil",
  headline:
    "Firma koja godinama radi velike projekte, a na internetu nije postojala. Danas je prva na Google-u za „električar Niš“.",
  standfirst:
    "ElektroMil je elektroinstalaterska firma iz Niša sa velikim projektima iza sebe i imenom koje se prenosi preporukom. Ali ko nije znao nekoga ko je radio sa njima, nije imao kako da ih nađe. Uradili smo dizajn i sajt od nule i postavili ga za lokalnu pretragu. Danas je ElektroMil prvi za „električar Niš“.",
  meta: [
    { label: "Klijent", value: "ElektroMil, Niš" },
    { label: "Delatnost", value: "Elektroinstalacije i elektro usluge" },
    { label: "Šta smo radili", value: "Dizajn, sajt, SEO i lokalna pretraga" },
    { label: "Godina", value: "2026." },
  ],
  services: ["Dizajn", "Web", "SEO"],
  source:
    "Izvor: pretraga u Nišu, evidencija upita firme i Google PageSpeed, 2026.",
  numbers: [
    {
      value: "1.",
      label: "mesto za „električar Niš“",
      note: "ispred firmi koje su na internetu godinama",
    },
    {
      value: "1",
      label: "mesec do prvih poziva iz pretrage",
      note: "od ljudi koji firmu nisu znali",
    },
    {
      value: "3",
      label: "meseca, i sajt je najveći izvor klijenata",
      note: "ispred preporuka",
    },
    { value: "0,9 s", label: "da se sajt učita", note: "Google PageSpeed 96" },
  ],
  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Velika imena među klijentima, nijedan rezultat u pretrazi.",
      body: [
        "ElektroMil radi za domove i firme: instalacije, rasvetu, razvodne table, servis, klima uređaje i punjače za električne automobile. Iza sebe ima velike projekte, ali je ceo posao dolazio preporukom.",
        "Preporuka ima granicu. Ko traži električara kad mu nešto stane, ukuca „električar Niš“ i zove prvog koga vidi. ElektroMila tamo nije bilo.",
      ],
      pull: "Firma koja radi velike poslove ne sme da izgleda kao neko ko radi sam. Sajt je morao da pokaže ozbiljnost na prvom ekranu.",
    },
    {
      id: "dizajn",
      kicker: "Dizajn i sajt",
      title: "Sajt koji izgleda kao firma koja radi velike poslove.",
      body: [
        "Električara se zove kad nešto ne radi, i kupac odlučuje brzo: da li je ovo ozbiljna firma, da li dolaze danas i da li daju garanciju. Sajt odgovara na sva tri pitanja na prvom ekranu, sa dugmetom za poziv koje je uvek vidljivo.",
        "Crno, belo i narandžasta munja. Stranica za svaku uslugu, od elektroinstalacija do punjača za električne automobile, i hitne intervencije odmah uz broj telefona.",
      ],
      media: [
        {
          src: img("elektromil/home"),
          alt: "Naslovna",
          caption: "Naslovna strana.",
        },
        {
          src: img("elektromil/usluge"),
          alt: "Usluge",
          caption: "Sve usluge na jednom mestu.",
        },
        {
          src: img("elektromil/ev"),
          alt: "Punjači za električne automobile",
          caption: "Stranica za punjače električnih automobila.",
        },
        {
          src: img("elektromil/mobilni"),
          alt: "Sajt na telefonu",
          caption: "Na telefonu.",
        },
      ],
    },
    {
      id: "pretraga",
      kicker: "Pretraga",
      title: "Lokalna pretraga, stranicu po stranicu.",
      body: [
        "Električar se traži po gradu. Zato svaka stranica govori o Nišu i okolini, a naslovi i opisi su pisani za ono što ljudi kucaju: električar Niš, ugradnja punjača, popravka instalacija. Sajt se učitava za manje od sekunde i tehnički je čist.",
        "Prvo je došla druga pozicija za „električar Niš“, a sada je ElektroMil prvi, uz prvu stranu za još nekoliko usluga.",
      ],
      piece: {
        kind: "climb",
        title: "„električar Niš“ kroz vreme",
        query: "električar niš",
        site: "elektromilnis.rs",
        note: "Septembar: pretraga u Nišu (OpenSEO, 27. septembar 2026). Danas: pretraga firme, novembar 2026. Ostali rezultati su šematski.",
        points: [
          { when: "Pre sajta", pos: null, text: "nema ga u pretrazi" },
          { when: "Septembar", pos: 2, text: "drugo mesto" },
          { when: "Danas", pos: 1, text: "prvo mesto" },
        ],
      },
      media: [
        {
          src: img("elektromil/brzina"),
          alt: "Google PageSpeed 96",
          caption: "Google PageSpeed na računaru: 96.",
        },
      ],
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title:
      "Od firme koju znaju samo oni koji su čuli za nju do prvog rezultata u Nišu.",
    body: [
      "ElektroMil je dobio dizajn, sajt sa stranicom za svaku uslugu i prvo mesto na Google-u za „električar Niš“. Firma koja je godinama radila velike poslove sada je vidljiva i onima koji je ranije nisu znali.",
      "Sledeće su fotografije stvarnih projekata, Google profil firme sa recenzijama i stranice za veće poslove, za firme i investitore.",
    ],
  },
  takeaways: [],
};

export default story;
