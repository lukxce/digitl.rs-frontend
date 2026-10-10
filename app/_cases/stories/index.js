import elektromil from "./elektromil";
import molerNis from "./moler-nis";
import servisKlimeNis from "./servis-klime-nis";
import thermiq from "./thermiq";

/* Case studies that have a full story (chapters, measured numbers, charts)
   written for the new design, keyed by the Sanity slug. A project without
   one falls back to its Sanity text. */
const STORIES = {
  thermiq,
  elektromil,
  "moler-nis": molerNis,
  "servis-klime-nis": servisKlimeNis,
};

export function getStory(slug) {
  return STORIES[slug] ?? null;
}
