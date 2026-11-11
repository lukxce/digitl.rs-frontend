import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import HomeV5 from "../_home/HomeV5";

export const revalidate = 60;

/* The hero's cards in direction C (skin "lift"): the white card leans
   like the steps' cards and the pieces that tell each story come off it as
   stickers. The rules sit at the end of each card's stylesheet. Out of
   the index until Luka picks it. /v4 to /v6 are old permanent redirects
   that browsers remember, so the tests live at /v7 and /v8. */
export const metadata = {
  title: "Početna, hero u novom stilu (proba)",
  robots: { index: false, follow: false },
};

export default async function HomeV7() {
  const clients = await getClients();
  return <HomeV5 clients={clients} fonts={sans.variable} skin="lift" />;
}
