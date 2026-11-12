import { tryGetClientShowcases } from "../../lib/cms.js";
import { cardOf } from "../_cases/lib";
import Listing from "../_cases/Listing";
import { getStory } from "../_cases/stories";
import { sans } from "../_home/font";
import Shell from "../_home/Shell";

export const revalidate = 60;

export const metadata = {
  title: { absolute: "Projekti i studije slučaja | Digitl" },
  description:
    "Studije slučaja sa brojevima, periodom i izvorom: posete iz pretrage, pozicije na Google-u i upiti za firme iz Srbije, od lokalnih servisa do online prodavnice.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const showcases = await tryGetClientShowcases();
  const projects = showcases.map((s) => cardOf(s, getStory(s.slug)));
  return (
    <Shell fonts={sans.variable}>
      <Listing projects={projects} />
    </Shell>
  );
}
