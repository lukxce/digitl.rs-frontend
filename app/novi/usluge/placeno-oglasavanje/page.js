import { sans } from "../../../_home/font";
import NoviAds from "../../../_novi/Ads";
import { serif } from "../../../_novi/font";

/* A test of a service page in the new design: paid ads. Out of the index. */
export const metadata = {
  title: "Plaćeno oglašavanje, novi dizajn (proba)",
  robots: { index: false, follow: false },
};

export default function NoviAdsPage() {
  return <NoviAds fonts={`${sans.variable} ${serif.variable}`} />;
}
