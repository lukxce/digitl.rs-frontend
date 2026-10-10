import { getArticles, getClients } from "./_home/data";
import { sans } from "./_home/font";
import HomeV5 from "./_home/HomeV5";

export const revalidate = 60;

/* Title and description come from the layout, which carries the site's
   real ones. The previous homepages live on, out of the index, at /v2
   (the original) and /v3 (the bento). */
export const metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [clients, articles] = await Promise.all([getClients(), getArticles()]);
  return <HomeV5 clients={clients} articles={articles} fonts={sans.variable} />;
}
