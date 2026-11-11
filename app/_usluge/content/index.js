/* The service pages' copy, one module per page, keyed by slug. */
import aiAutomatizacija from "./ai-automatizacija";
import brending from "./brending-i-vizuelni-identitet";
import izradaSajta from "./izrada-sajta";
import placenoOglasavanje from "./placeno-oglasavanje";
import seoOptimizacija from "./seo-optimizacija";
import vodjenjeDrustvenihMreza from "./vodjenje-drustvenih-mreza";

export const PAGES = Object.fromEntries(
  [
    placenoOglasavanje,
    seoOptimizacija,
    izradaSajta,
    vodjenjeDrustvenihMreza,
    brending,
    aiAutomatizacija,
  ].map((p) => [p.slug, p]),
);
