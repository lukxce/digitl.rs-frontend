import { getClients } from "../_home/data";
import { sans } from "../_home/font";
import HomeV5 from "../_home/HomeV5";

export const revalidate = 60;

/* A test of the homepage drawn closer to the service pages: the same
   layout and copy, with the services' stickers on the service cards and
   the steps as the service pages' cards. Out of the index until Luka
   picks it. The first homepage design moved to /v1. */
export const metadata = {
  title: "Početna, usklađena sa uslugama (proba)",
  robots: { index: false, follow: false },
};

export default async function HomeV2() {
  const clients = await getClients();
  return <HomeV5 clients={clients} fonts={sans.variable} look="v2" />;
}
