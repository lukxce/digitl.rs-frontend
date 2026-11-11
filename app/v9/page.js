import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import HomeV5 from "../_home/HomeV5";

export const revalidate = 60;

/* The hero's cards as Luka asked on 11 Nov 2026: mostly D ("fine", /v8),
   with the same pieces as C ("lift", /v7) coming off the card, and
   nothing leaning ("flat" takes every tilt back). The rules sit at the
   end of each card's stylesheet. Out of the index until Luka picks it. */
export const metadata = {
  title: "Početna, hero D sa delovima iz C (proba)",
  robots: { index: false, follow: false },
};

export default async function HomeV9() {
  const clients = await getClients();
  return (
    <HomeV5 clients={clients} fonts={sans.variable} skin="fine lift flat" />
  );
}
