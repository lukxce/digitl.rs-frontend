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

const SITE_URL = "https://www.digitl.me";
const SITE_NAME = "Digitl";
const SITE_TITLE = "Digitl | Full-Service Marketing Agency";
const SITE_DESCRIPTION =
  "Digitl is a full-service marketing agency for businesses that want real results: paid advertising, web design and development, SEO, social media and branding.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Digitl",
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <SmoothScroll>
          <SiteNav />
          <div className={layoutStyles.shell}>{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
