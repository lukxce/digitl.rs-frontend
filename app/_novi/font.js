import { Instrument_Serif } from "next/font/google";

// The editorial serif for the "serif" headline option of the /novi test
// pages. Serbian needs latin-ext (č, ć, đ, š, ž).
export const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-novi-serif",
  display: "swap",
});
