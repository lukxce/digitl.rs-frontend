import { sans } from "../_home/font";
import Shell from "../_home/Shell";
import Hub from "../_usluge/Hub";

const URL = "https://www.digitl.rs/usluge";

export const metadata = {
  title: { absolute: "Usluge digitalnog marketinga za firme u Srbiji | Digitl" },
  description:
    "Google i Meta oglasi, SEO optimizacija, izrada sajta, vođenje društvenih mreža i dizajn logotipa. Pogledajte šta obuhvata svaka usluga i kako radimo.",
  alternates: { canonical: "/usluge" },
  openGraph: { url: URL, type: "website" },
};

const BREADCRUMBS = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Početna", item: "https://www.digitl.rs" },
    { "@type": "ListItem", position: 2, name: "Usluge", item: URL },
  ],
};

export default function UslugePage() {
  return (
    <Shell fonts={sans.variable}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMBS) }}
      />
      <Hub />
    </Shell>
  );
}
