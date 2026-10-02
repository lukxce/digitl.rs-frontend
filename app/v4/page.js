import { Manrope } from "next/font/google";
import { getClients } from "../v5/data";
import Lab from "./Lab";

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-v5-sans",
  display: "swap",
});

export const revalidate = 60;

export const metadata = {
  title: "Hero laboratorija · digitl",
  robots: { index: false, follow: false },
};

export default async function Page() {
  const clients = await getClients();
  return <Lab clients={clients} fonts={sans.variable} />;
}
