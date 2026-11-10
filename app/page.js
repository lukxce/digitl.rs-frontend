import { getClients } from "./_home/data";
import { sans } from "./_home/font";
import HomeV5 from "./_home/HomeV5";

export const revalidate = 60;

/* Title and description come from the layout, which carries the site's
   real ones. The previous homepages live on, out of the index, at /v2
   (the original) and /v3 (the bento). */
export const metadata = { alternates: { canonical: "/" } };

/* Who Digitl is, for search engines and AI answers: one name, one phone,
   one email, the same profiles everywhere. */
const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.digitl.rs/#organization",
  name: "Digitl",
  url: "https://www.digitl.rs",
  logo: "https://www.digitl.rs/icon.png",
  email: "hello@digitl.rs",
  telephone: "+381641338383",
  description:
    "Marketing agencija iz Srbije: Google i Meta oglasi, SEO, izrada sajtova, društvene mreže i brend kao jedan sistem.",
  areaServed: { "@type": "Country", name: "Srbija" },
  sameAs: [
    "https://www.instagram.com/digitl.rs",
    "https://www.linkedin.com/company/digitl-rs",
    "https://x.com/digitl_rs",
    "https://www.digitl.me",
  ],
};

export default async function Home() {
  const clients = await getClients();
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION) }}
      />
      <HomeV5 clients={clients} fonts={sans.variable} />
    </>
  );
}
