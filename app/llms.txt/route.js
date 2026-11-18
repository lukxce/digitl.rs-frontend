import { PAGES } from "../_usluge/content";
import { plain } from "../_usluge/Rich";
import { SERVICE_SLUGS, SERVICES_UPDATED } from "../_usluge/slugs";

const SITE = "https://www.digitl.rs";

/* A plain-text map of the site for AI assistants (llms.txt): who Digitl is,
   the service pages with their one-paragraph summary and starting price,
   and the case studies. Built from the same copy the pages use. */
export const dynamic = "force-static";

export function GET() {
  const services = SERVICE_SLUGS.map((slug) => {
    const p = PAGES[slug];
    const price = p.price?.from
      ? ` Cena od ${p.price.from} €${p.price.per ? ` ${p.price.per}` : ""}.`
      : "";
    return `- [${p.h1}](${SITE}/usluge/${slug}): ${plain(p.lead)}${price}`;
  }).join("\n");
  const body = `# Digitl

> Digitl je full-service marketing agencija iz Beograda (digitl.rs). Vodi plaćeno oglašavanje na Google-u i društvenim mrežama, SEO optimizaciju, izradu sajtova i online prodavnica, vođenje društvenih mreža, brending i automatizaciju poslovanja, kao jedan sistem, za firme širom Srbije. Svaka saradnja se veže za broj koji klijent može da proveri.

Kontakt: hello@digitl.rs, +381 64 133 8383. Engleski sajt: https://www.digitl.me

## Usluge

${services}

## Projekti

- [Ideal Keramika, web shop pločica i opreme za kupatilo](${SITE}/projects/ideal-keramika)
- [ThermiQ, online prodavnica grejanja i klimatizacije](${SITE}/projects/thermiq)
- [TonerPro, online prodavnica tonera](${SITE}/projects/tonerpro)
- [Four Elements, brend, sajt i Instagram za butik spa centar](${SITE}/projects/four-elements)
- [Planet Residence, Instagram za prodaju stanova](${SITE}/projects/planet-residence)
- [Moler Niš, molerski radovi](${SITE}/projects/moler-nis)
- [ElektroMil, električar iz Niša](${SITE}/projects/elektromil)

Ažurirano: ${SERVICES_UPDATED}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
