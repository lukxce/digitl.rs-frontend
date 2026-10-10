// Services and the three-question plan. `title` and `body` are the original
// homepage's wording (the front of each card); `lead`, `includes` and `fact`
// are the back: what we do, what is in it, and what we measure.

export const SERVICES = [
  {
    id: "ads",
    title: "Plaćeno oglašavanje (Search & Social)",
    name: "Plaćeno oglašavanje",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    lead: "Postavljamo kampanje, pratimo svaki upit i budžet pomeramo tamo gde donosi prodaju.",
    includes: [
      "Google oglasi: pretraga i Performance Max",
      "Meta oglasi: Facebook i Instagram",
      "Tekstovi i vizuali oglasa",
    ],
    fact: ["Merimo", "Cena po upitu, za svaku kampanju"],
  },
  {
    id: "seo",
    title: "Search Engine Optimization (SEO)",
    name: "SEO",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    lead: "Sređujemo sajt i sadržaj da vas kupci nađu baš kad traže ono što nudite.",
    includes: [
      "Tehnički SEO i brzina sajta",
      "Stranica za svaku uslugu i grad",
      "Tekstovi koji odgovaraju na pitanja kupaca",
    ],
    fact: ["Merimo", "Pozicije, posete i upiti iz pretrage"],
  },
  {
    id: "web",
    title: "Web dizajn & razvoj",
    name: "Web",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    lead: "Dizajniramo i izrađujemo sajt koji se brzo učitava i posetioca vodi do upita ili kupovine.",
    includes: [
      "Dizajn i izrada sajta ili online prodavnice",
      "Brzo učitavanje, prvo na telefonu",
      "Sadržaj menjate sami, bez programera",
    ],
    fact: ["Merimo", "Brzina sajta i stopa konverzije"],
  },
  {
    id: "social",
    title: "Upravljanje društvenim mrežama",
    name: "Društvene mreže",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    lead: "Planiramo, dizajniramo i objavljujemo sadržaj, da vaš brend na mrežama izgleda isto kao na sajtu i u oglasima.",
    includes: [
      "Mesečni plan objava",
      "Dizajn objava, Reels i Stories",
      "Tekstovi i objavljivanje",
    ],
    fact: ["Merimo", "Doseg, angažovanje i posete sajtu"],
  },
  {
    id: "brand",
    title: "Branding & identitet",
    name: "Brend",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    lead: "Određujemo šta vaš brend govori i kako izgleda, pa to primenjujemo na sajt, mreže i oglase.",
    includes: [
      "Pozicioniranje i glavna poruka",
      "Logo, boje i tipografija",
      "Šabloni za objave i oglase",
    ],
    fact: ["Rezultat", "Brend knjiga i svi fajlovi"],
  },
];

export const QUIZ = [
  {
    id: "izvor",
    q: "Kako vas ljudi najčešće nađu?",
    options: [
      {
        id: "preporuka",
        label: "Preko preporuke",
        w: { seo: 3, ads: 2, web: 2 },
        match: "moler-nis",
        gap: "Preporuka radi dok se krug poznanstava ne istroši. Posle toga nema odakle.",
      },
      {
        id: "placeno",
        label: "Preko oglasa koje plaćamo",
        w: { seo: 3, brand: 2 },
        match: "thermiq",
        gap: "Oglasi rade dok plaćate. Onog dana kad stanete, stanu i upiti.",
      },
      {
        id: "organski",
        label: "Nađu nas na Google-u",
        w: { ads: 3, social: 2 },
        match: "servis-klime-nis",
        gap: "To je dobra osnova, ali nemate dugme kad vam zatreba više posla ovog meseca.",
      },
      {
        id: "mreze",
        label: "Preko Instagrama i Facebooka",
        w: { seo: 3, web: 2 },
        match: "thermiq",
        gap: "Mreže vas čine poznatim. Kupac koji je spreman da kupi ipak prvo pretražuje.",
      },
      {
        id: "nista",
        label: "Iskreno, ne znam",
        w: { web: 3, seo: 2, ads: 2 },
        match: "elektromil",
        gap: "Niste jedini. Prvo što radimo jeste da se to sazna, jer bez toga je svaki dinar nagađanje.",
      },
    ],
  },
  {
    id: "sajt",
    q: "Imate li sajt i jeste li zadovoljni njime?",
    options: [
      { id: "nemamo", label: "Nemamo sajt", w: { web: 4, brand: 2 } },
      { id: "star", label: "Imamo, ali je star i spor", w: { web: 3, seo: 1 } },
      {
        id: "ok",
        label: "Izgleda dobro, ali ne donosi upite",
        w: { web: 2, ads: 1 },
      },
      { id: "dobar", label: "Zadovoljni smo njime", w: { ads: 1, seo: 1 } },
    ],
  },
  {
    id: "cilj",
    q: "Šta bi vam najviše značilo za pola godine?",
    options: [
      {
        id: "brzo",
        label: "Više upita i prodaje, što pre",
        w: { ads: 4, web: 2 },
      },
      {
        id: "stabilno",
        label: "Da posao stiže i kad ne plaćamo oglase",
        w: { seo: 4, web: 1 },
      },
      {
        id: "poznatost",
        label: "Da nas ljudi znaju po imenu",
        w: { brand: 4, social: 3 },
      },
      {
        id: "sve",
        label: "Sve pomalo, ne znam odakle da krenem",
        w: { web: 2, seo: 2, ads: 2, brand: 1 },
      },
    ],
  },
];

/** Answers (one option id per question) → ranked services, the gap line and the closest case. */
export function makePlan(answers) {
  const score = Object.fromEntries(SERVICES.map((s) => [s.id, 0]));
  const picked = QUIZ.map((q, i) => q.options.find((o) => o.id === answers[i]));
  for (const o of picked)
    for (const [k, v] of Object.entries(o?.w ?? {})) score[k] += v;
  const ranked = [...SERVICES]
    .sort((a, b) => score[b.id] - score[a.id])
    .map((s) => s.id);
  return {
    ranked,
    top: ranked.slice(0, 3),
    gap: picked[0]?.gap ?? "",
    match: picked[0]?.match ?? null,
    answers: picked.map((o, i) => `${QUIZ[i].q} ${o?.label ?? "-"}`),
  };
}

export const STEPS = [
  [
    "Razumevanje",
    "Analiziramo biznis, ciljeve i dosadašnje brojeve, da vidimo šta radi, a šta ne.",
  ],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i konkretne odluke o sledećem koraku."],
];

// Words you won't hear from us (bento card "Nećete čuti od nas").
export const NEVER = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
  "omnichannel",
];

export const FAQ = [
  {
    q: "Koliko brzo možemo da krenemo?",
    a: "Obično u roku od 1 do 2 nedelje nakon dogovora, zavisno od obima i kapaciteta.",
  },
  {
    q: "Šta ako nismo sigurni šta nam tačno treba?",
    a: "Zato i postoji prvi razgovor. Pogledamo brojeve i kažemo vam šta je prioritet, a šta može da čeka.",
  },
  {
    q: "Radite samo kompletne projekte ili i pojedinačne usluge?",
    a: "Oba, ali najbolje radimo kao stalni partner koji vodi ceo marketing.",
  },
  {
    q: "Kako izgleda komunikacija tokom saradnje?",
    a: "Direktno i redovno. Radite sa ljudima koji donose odluke, ne sa account menadžerom.",
  },
  {
    q: "Sa kakvim firmama najčešće radite?",
    a: "Od lokalnih biznisa do etabliranih brendova, svuda gde se marketing meri rezultatom.",
  },
];

export const CONTACT = {
  email: "hello@digitl.rs",
  phone: "064 133 8383",
  tel: "+381641338383",
  // the client portal (digitl hub)
  hub: "https://hub.digitl.rs/login",
  // the English site
  en: "https://www.digitl.me",
};
