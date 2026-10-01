// Services and the three-question plan, worded as on the bento homepage.

export const SERVICES = [
  {
    id: "ads",
    hear: "Plaćam oglase, a ne znam šta donose.",
    proof: "Praćenje od klika do upita, u istom izveštaju kao sajt i SEO.",
    name: "Plaćeno oglašavanje",
    role: "Saobraćaj danas.",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    feeds: "Hrani sajt upitima, a SEO podacima o tome šta ljudi stvarno traže.",
    includes: [
      "Google Search i Performance Max",
      "Meta i Instagram",
      "Praćenje od klika do upita",
    ],
  },
  {
    id: "seo",
    hear: "Na Google-u nas nema ni na drugoj strani.",
    proof: "ThermiQ: 3.157 indeksiranih stranica za tri meseca.",
    name: "SEO",
    role: "Saobraćaj koji ne plaćate.",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    feeds: "Snižava cenu plaćenog klika i drži upite kad se kampanja ugasi.",
    includes: [
      "Stranica za svaku uslugu i grad",
      "Tehnički SEO na nivou šablona",
      "Sadržaj za prava pitanja",
    ],
  },
  {
    id: "web",
    hear: "Imamo posete, ali ne i prodaju.",
    proof: "Moler Niš i Servis Klime Niš: PageSpeed 100 na telefonu.",
    name: "Web",
    role: "Poseta postaje upit.",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    feeds: "Bez njega svaki drugi kanal plaća posetu koja ne postane kupac.",
    includes: [
      "Cena i kontakt pre poziva",
      "Sadržaj uređujete sami",
      "Pravljen za telefon",
    ],
  },
  {
    id: "social",
    hear: "Na mrežama objavljujemo kad se neko seti.",
    proof: "Mreže podržavaju ostale kanale, ne žive odvojeno od njih.",
    name: "Društvene mreže",
    role: "Prisutnost između kupovina.",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    feeds: "Čini da vas kupac prepozna kad vas nađe u pretrazi ili oglasu.",
    includes: [
      "Plan objava po nedeljama",
      "Reels i Stories formati",
      "Isti glas kao sajt i oglasi",
    ],
  },
  {
    id: "brand",
    hear: "Izgledamo isto kao konkurencija.",
    proof: "ThermiQ: crvena prati grejanje, plava hlađenje, na svakom formatu.",
    name: "Brend",
    role: "Sve ostalo košta manje.",
    body: "Pozicioniranje i vizuelni sistem ispod svega, da izgledate kao jedan brend.",
    feeds: "Isti oglas, ista pozicija, veći procenat klikova. To je brend.",
    includes: [
      "Pozicioniranje i poruka",
      "Logo, boje i tipografija",
      "Sistem za svaki format",
    ],
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
    a: "Obično u roku od jedne do dve nedelje nakon dogovora, zavisno od obima i kapaciteta.",
  },
  {
    q: "Za koliko se vide prvi rezultati?",
    a: "Zavisi od kanala i konkurencije. Oglasi daju podatke od prvog dana, SEO traje duže. Kod ElektroMila su prvi upiti sa pretrage stigli već u prvom mesecu.",
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
];

export const CONTACT = {
  email: "hello@digitl.rs",
  phone: "064 133 8383",
  tel: "+381641338383",
};
