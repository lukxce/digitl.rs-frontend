import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import HomeV5 from "../_home/HomeV5";

export const revalidate = 60;

/* The hero's cards with the white card kept and the pieces inside drawn
   finer (skin "fine"; the rules sit at the end of each card's stylesheet).
   Out of the index until Luka picks it. */
export const metadata = {
  title: "Početna, hero, finiji elementi (proba)",
  robots: { index: false, follow: false },
};

export default async function HomeV8() {
  const clients = await getClients();
  return <HomeV5 clients={clients} fonts={sans.variable} skin="fine" />;
}
