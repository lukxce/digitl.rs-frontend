import { sans } from "./_home/font";
import Shell from "./_home/Shell";
import NotFound from "./_usluge/NotFound";

export const metadata = {
  title: { absolute: "Stranica ne postoji | Digitl" },
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <Shell fonts={sans.variable}>
      <NotFound />
    </Shell>
  );
}
