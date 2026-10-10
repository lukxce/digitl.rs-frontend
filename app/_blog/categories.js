/* An article's category. The CMS field wins once an editor has set it; until
   then the title, and after it the description, is read for a few telling
   words. The first rule that matches decides, so the order matters. */

const RULES = [
  ["Brend", /rebrend|brend|logo|identitet/],
  ["E-trgovina", /e-trgovin|prodavnic|korp|plaćanj|e-novac|kupovin|webshop/],
  ["Oglašavanje", /oglas|google ads|meta |kampanj|budžet|cpa|roas|klik/],
  ["SEO", /seo|pretrag|rangir/],
  ["Društvene mreže", /instagram|tiktok|linkedin|društven/],
  ["Web", /sajt|brzin|web/],
];
const OTHER = "Marketing";

function read(text) {
  const t = typeof text === "string" ? text.toLowerCase() : "";
  return t ? (RULES.find(([, words]) => words.test(t))?.[0] ?? null) : null;
}

/** @param {{ category?: string | null, title?: string, description?: string | null }} article */
export function categoryOf(article) {
  const set = typeof article?.category === "string" && article.category.trim();
  return set || read(article?.title) || read(article?.description) || OTHER;
}

/** Categories in use with their counts: most articles first, then by name. */
export function countCategories(articles) {
  const counts = new Map();
  for (const a of articles)
    counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((x, y) => y.count - x.count || x.name.localeCompare(y.name, "sr"));
}
