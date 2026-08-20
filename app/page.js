import { tryGetArticlesForHome } from "../lib/cms.js";
import { tryGetClientShowcases } from "../lib/cms.js";
import HomePage from "./HomePage";

export const revalidate = 60;

export default async function Home() {
  const [articles, showcases] = await Promise.all([
    tryGetArticlesForHome(10),
    tryGetClientShowcases(4),
  ]);
  return <HomePage articles={articles} showcases={showcases} />;
}
