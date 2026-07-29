import { Manrope } from "next/font/google";
import SiteNav from "./components/SiteNav";
import SmoothScroll from "./components/SmoothScroll";
import layoutStyles from "./layout.module.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Digitl | Full-Service marketing agencija",
    template: "%s · Digitl",
  },
  description: "Digitl je full-service marketing agencija koja vodi ceo vaš marketing kao jedan sistem: plaćeno oglašavanje, web, SEO, društvene mreže i brend. Marketing koji se meri profitom, ne aktivnošću.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr" className={manrope.variable}>
      <body>
        <SmoothScroll>
          <SiteNav />
          <div className={layoutStyles.shell}>{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
