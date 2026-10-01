import { Manrope } from "next/font/google";
import V6 from "./V6";

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-v5-sans",
  display: "swap",
});

export const metadata = {
  title: "Katalog elemenata",
  // A working catalogue to pick from, not a page for search.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <V6 fonts={sans.variable} />;
}
