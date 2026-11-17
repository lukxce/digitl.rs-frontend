import Bio from "../_bio/Bio";
import { getArticles, getClients } from "../_home/data";
import { sans } from "../_home/font";

export const revalidate = 60;

/* The page behind the link in the Instagram bio. A utility page: out of the
   index and out of the sitemap. */
export const metadata = {
  title: "Brze veze",
  description:
    "Najnoviji tekstovi, projekti, usluge i kontakt agencije Digitl, na jednom mestu.",
  alternates: { canonical: "/bio" },
  robots: { index: false, follow: true },
};

export default async function BioPage() {
  const [clients, articles] = await Promise.all([getClients(), getArticles()]);
  return <Bio clients={clients} articles={articles} fonts={sans.variable} />;
}
