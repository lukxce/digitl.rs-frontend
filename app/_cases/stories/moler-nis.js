/* Moler Niš: the story on /projects/moler-nis (rewritten 18 Nov 2026). A small client, accent on the site.

   Sources (studije-slucaja/assets/moler-nis/facts.md):
   - Domain molernis.rs registered 14 Jul 2026, site live 19 Jul.
   - Search Console (Fortress project 8, data from 17 Aug): 17 Aug to 15 Nov 2026 576 clicks, 14.614 impressions.
     Main keyword: 3,7 in the week of 17 Aug, 1,1 to 1,9 every week since; 1,4 in the last 28 days. Luka asked
     (18 Nov) not to name it: "glavna ključna reč".
     Last 28 days: 24 of the 31 searches with at least 10 impressions average 10 or better. Price list = top page.
   - Luka: calls started almost right after launch; 0 din on ads (no ad accounts in Fortress).
   - A firm with more than 11 years of experience (Luka confirmed 18 Nov). Never a one-man show. */
import { img } from "./images";

const story = {
  slug: "moler-nis",
  headline:
    "Od firme bez sajta do prvog mesta na Google-u za glavnu ključnu reč, za manje od dva meseca.",
  standfirst:
    "Moler Niš je molerska firma iz Niša sa preko 11 godina iskustva, koja nije imala sajt ni ime koje ljudi kucaju u pretragu. Mali klijent, i baš zato dobar primer: predložili smo domen, napravili sajt od nule i napisali sav sadržaj. Za manje od dva meseca firma je prva na Google-u za svoju glavnu ključnu reč, a pozivi su krenuli skoro odmah.",
  meta: [
    { label: "Klijent", value: "Moler Niš" },
    { label: "Delatnost", value: "Molerski i fasadni radovi" },
    { label: "Šta smo radili", value: "Domen, sajt, SEO, sadržaj" },
    { label: "Podaci", value: "Avgust do novembar 2026." },
  ],
  services: ["Web", "SEO", "Sadržaj"],
  source:
    "Izvor: Google Search Console, od 17. avgusta do 15. novembra 2026. Sajt je pokrenut sredinom jula.",
  numbers: [
    {
      value: "1.",
      label: "mesto za glavnu ključnu reč",
      note: "za manje od dva meseca",
    },
    {
      value: "24",
      label: "pretrage na prvoj strani Google-a",
      note: "od 31 najčešće",
    },
    {
      value: "576",
      label: "poseta iz pretrage za tri meseca",
      note: "sa 14 na 64 nedeljno",
    },
    {
      value: "0 din.",
      label: "potrošeno na oglase",
      note: "svi pozivi stižu iz pretrage",
    },
  ],
  chapters: [
    {
      id: "polazna-tacka",
      kicker: "Polazna tačka",
      title: "Firma koja radi dobro, a na internetu je nema.",
      body: [
        "Moler Niš radi krečenje, gletovanje, fasade, dekorativne premaze i sanaciju vlage za stanove, kuće i lokale u Nišu i okolini. Posao su dobijali samo preporukom, a kada se krug poznanstava iscrpi, novih poziva nema odakle da stignu.",
        "Firma nije imala ni ime koje ljudi kucaju u pretragu. Zato smo predložili domen molernis.rs, isti kao ono što ljudi traže, i od nule napravili sajt sa jednim ciljem: da telefon zazvoni.",
      ],
      pull: "Mala firma ne treba veliki budžet. Treba joj sajt koji Google razume i koji za pet sekundi kaže ko ste, šta radite i koliko košta.",
    },
    {
      id: "sajt",
      kicker: "Sajt",
      title: "Stranica za svaku uslugu, poziv uvek na dohvat palca.",
      body: [
        "Ko traži molera, traži ga danas i želi da zna tri stvari: da li radite u njegovom delu grada, koliko košta i kako da vas pozove. Sajt to kaže na prvom ekranu, a dugme za poziv je uvek vidljivo.",
        "Krečenje, gletovanje, fasade, dekorativni premazi, tapete i sanacija vlage imaju svaka svoju stranicu, sa onim što je uključeno i sa cenom. Sajt ima ocenu 100 na Google PageSpeed testu za telefon, jer većina poziva stiže sa telefona.",
      ],
      media: [
        {
          src: img("moler-nis/gletovanje"),
          alt: "Stranica usluge gletovanje",
          caption: "Stranica usluge sa cenom.",
        },
        {
          src: img("moler-nis/dekorativni"),
          alt: "Dekorativne tehnike",
          caption: "Dekorativni premazi i tehnike.",
        },
        {
          src: img("moler-nis/pagespeed"),
          alt: "PageSpeed 100 na telefonu",
          caption: "Google PageSpeed na telefonu: 100.",
        },
      ],
    },
    {
      id: "pretraga",
      kicker: "Pretraga",
      title: "Prvo mesto za glavnu ključnu reč, i prva strana za cene.",
      body: [
        "Za glavnu ključnu reč sajt je bio na prvoj strani već pet nedelja posle registracije domena, a od kraja avgusta je prvi, nedelju za nedeljom. Ali posao ne donosi samo ta pretraga. Ljudi kucaju cenu: koliko košta krečenje po kvadratu, koliko košta obrada špaletni. Za te pretrage smo pisali stranice i tekstove, i tu je sajt sada na prvoj strani.",
        "Izaberite pretragu i pogledajte gde je sajt.",
      ],
      piece: {
        kind: "serp",
        title: "Gde je Moler Niš kada kupac traži molera",
        site: "molernis.rs",
        note: "Prosečna pozicija iz Google Search Console-a, 19. oktobar do 15. novembar 2026. Ostali rezultati su šematski.",
        queries: [
          { q: "moler niš", pos: "1,4" },
          { q: "obrada špaletni oko prozora cena niš", pos: "2,5" },
          { q: "cena krečenja po kvadratu niš", pos: "3,7" },
          { q: "krečenje niš cena", pos: "3,9" },
          { q: "gletovanje i krečenje cena niš", pos: "4,6" },
          { q: "krečenje niš", pos: "4,8" },
          { q: "farbanje stolarije cena niš", pos: "4,8" },
        ],
      },
      viz: {
        kind: "trend",
        title: "Posete iz Google pretrage po nedeljama",
        unit: "poseta nedeljno",
        note: "Search Console, pune nedelje od 17. avgusta do 15. novembra 2026.",
        points: [
          { label: "17. avg", value: 14 },
          { label: "24. avg", value: 27 },
          { label: "31. avg", value: 39 },
          { label: "7. sep", value: 39 },
          { label: "14. sep", value: 52 },
          { label: "21. sep", value: 60 },
          { label: "28. sep", value: 43 },
          { label: "5. okt", value: 48 },
          { label: "12. okt", value: 44 },
          { label: "19. okt", value: 41 },
          { label: "26. okt", value: 47 },
          { label: "2. nov", value: 58 },
          { label: "9. nov", value: 64 },
        ],
      },
    },
    {
      id: "cenovnik",
      kicker: "Cenovnik i kalkulator",
      title: "Cena na sajtu dovodi ljude i štedi telefon.",
      body: [
        "Većina molera ne piše cene. Zato je cenovnik najposećenija stranica na sajtu: ko ukuca cenu krečenja u Nišu, stiže na njega. A ko pozove posle cenovnika, već zna okvir cene i zove da zakaže, a ne da pita koliko košta.",
        "Kalkulator boje radi isto za one koji tek planiraju: unesu dimenzije sobe i dobiju površinu, litre boje i kilograme gleta, sa dugmetom za poziv ispod.",
      ],
      media: [
        {
          src: img("moler-nis/cenovnik"),
          alt: "Cenovnik molerskih radova",
          caption: "Cenovnik po kvadratu i po komadu.",
        },
        {
          src: img("moler-nis/kalkulator"),
          alt: "Rezultat kalkulatora boje",
          caption: "Kalkulator: površina, boja i glet za sobu.",
        },
      ],
    },
    {
      id: "blog",
      kicker: "Blog",
      title: "Tekstovi za one koji tek istražuju.",
      body: [
        "Pre nego što zovu molera, ljudi pitaju Google koliko košta krečenje stana ili šta znače pukotine na zidu. Firma koja na to odgovori ostaje u glavi. Tekst „Koliko košta krečenje stana u Nišu“ je treća stranica po posetama, odmah posle cenovnika i naslovne.",
      ],
      media: [
        {
          src: img("moler-nis/blog"),
          alt: "Tekst na blogu",
          caption: "„Koliko košta krečenje stana u Nišu“.",
        },
      ],
    },
  ],
  next: {
    label: "Rezultat i sledeći koraci",
    title: "Mala firma, prvo mesto na Google-u i pozivi bez oglasa.",
    body: [
      "Za manje od dva meseca Moler Niš je od firme bez sajta postao prvi rezultat za svoju glavnu ključnu reč, sa prvom stranom za pretrage cena koje donose posao i pozivima koji su krenuli skoro odmah. Bez oglasa.",
      "Sledeće su fotografije stvarnih radova na sajtu, recenzije i povezivanje sa Google profilom firme, da prvo mesto ostane njihovo.",
    ],
  },
  takeaways: [],
};

export default story;
