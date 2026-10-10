import { Manrope } from "next/font/google";

// Serbian needs latin-ext (č, ć, đ, š, ž). Shared by the homepage and the
// blog and project pages, which all sit in the same shell.
export const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-v5-sans",
  display: "swap",
});
