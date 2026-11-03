import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import { serif } from "../_novi/font";
import NoviHome from "../_novi/Home";

export const revalidate = 60;

/* A test of a new homepage (structure and motion after madetight.com, in
   Digitl's light brand). Out of the index until Luka picks it. */
export const metadata = {
  title: "Novi dizajn, početna (proba)",
  robots: { index: false, follow: false },
};

export default async function NoviPage() {
  const clients = await getClients();
  return (
    <NoviHome clients={clients} fonts={`${sans.variable} ${serif.variable}`} />
  );
}
