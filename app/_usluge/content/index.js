/* The five service pages' copy, one module per page, keyed by slug. */
import dizajnLogotipa from "./dizajn-logotipa";
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
    dizajnLogotipa,
  ].map((p) => [p.slug, p]),
);
