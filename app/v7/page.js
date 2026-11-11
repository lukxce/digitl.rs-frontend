import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import HomeV5 from "../_home/HomeV5";

export const revalidate = 60;

/* A test of the hero's cards drawn in the service pages' sticker language:
   the homepage as it is, with skin "sticker" on the cards (the rules sit at
   the end of each card's stylesheet). Out of the index until Luka picks
   it. /v4 to /v6 are old permanent redirects that browsers remember, so
   the test lives here. */
export const metadata = {
  title: "Početna, hero u novom stilu (proba)",
  robots: { index: false, follow: false },
};

export default async function HomeV7() {
  const clients = await getClients();
  return <HomeV5 clients={clients} fonts={sans.variable} skin="sticker" />;
}
