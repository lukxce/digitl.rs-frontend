import { sanityClient } from "../../../lib/sanity/client.js";
import TablaGrid from "../../_bento/TablaGrid";

export const revalidate = 60;

export const metadata = {
  title: "digitl — radna tabla",
  robots: { index: false, follow: false },
};

/**
 * Everything on this page is a number the case studies already publish.
 * If Sanity is unreachable the panels render empty rather than inventing
 * a figure, which is the whole point of the concept.
 */
async function getBoard() {
  try {
    const rows = await sanityClient.fetch(
      `*[_type == "clientShowcase"] | order(publishedAt desc){
        title, clientName, category, "slug": slug,
        "metrics": successRate[]{title, subtitle}
      }`,
    );

    const pick = (client, needle) => {
      const doc = rows.find((r) => r.clientName === client);
      const m = doc?.metrics?.find((x) =>
        x?.subtitle?.toLowerCase().includes(needle),
      );
      return m ? { value: m.title, label: m.subtitle, client } : null;
    };

    const kpis = [
      pick("ThermiQ", "impresija"),
      pick("ThermiQ", "indeksiranih"),
      pick("ThermiQ", "pozicija"),
      pick("Servis Klime Niš", "pagespeed"),
    ].filter(Boolean);

    const clients = rows.map((r) => {
      const slug = typeof r.slug === "string" ? r.slug : r.slug?.current;
      return {
        slug,
        href: slug ? `/projects/${slug}` : "/projects",
        title: r.title,
        clientName: r.clientName,
        category: r.category,
        // The first metric reads as that client's headline result.
        metric: r.metrics?.[0] ? `${r.metrics[0].title}` : null,
      };
    });

    return { kpis, clients };
  } catch {
    return { kpis: [], clients: [] };
  }
}

export default async function TablaPage() {
  const { kpis, clients } = await getBoard();
  return <TablaGrid kpis={kpis} clients={clients} />;
}
