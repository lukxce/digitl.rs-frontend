import elektromil from "./elektromil";
import fourElements from "./four-elements";
import idealKeramika from "./ideal-keramika";
import molerNis from "./moler-nis";
import planetResidence from "./planet-residence";
import praxisCentar from "./praxis-centar";
import servisKlimeNis from "./servis-klime-nis";
import thermiq from "./thermiq";
import tonerpro from "./tonerpro";

/* Case studies that have a full story (chapters, measured numbers, charts and
   interactive pieces) written for the new design, keyed by the Sanity slug.
   A project without one falls back to its Sanity text. */
const STORIES = {
  "moler-nis": molerNis,
  elektromil,
  "planet-residence": planetResidence,
  "four-elements": fourElements,
  tonerpro,
  "praxis-centar": praxisCentar,
  thermiq,
  "ideal-keramika": idealKeramika,
  "servis-klime-nis": servisKlimeNis,
};

export function getStory(slug) {
  return STORIES[slug] ?? null;
}
