import { notFound } from "next/navigation";
import { sans } from "../../_home/font";
import Shell from "../../_home/Shell";
import { PAGES } from "../../_usluge/content";
import { plain } from "../../_usluge/Rich";
import ServicePage from "../../_usluge/ServicePage";
import { SERVICE_SLUGS, SERVICES_UPDATED } from "../../_usluge/slugs";

const SITE = "https://www.digitl.rs";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return {
    title: { absolute: page.seo.title },
    description: page.seo.description,
    alternates: { canonical: `/usluge/${slug}` },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url: `${SITE}/usluge/${slug}`,
      type: "website",
      images: [
        { url: `/og/${slug}.png`, width: 1200, height: 630, alt: page.h1 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
      images: [`/og/${slug}.png`],
    },
  };
}

/* What the page offers and where it sits, for search engines and AI
   answers. No FAQ markup: Google no longer shows it for sites like ours. */
function jsonLd(page) {
  const url = `${SITE}/usluge/${page.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      serviceType: page.label,
      description: plain(page.lead),
      url,
      image: `${SITE}/og/${page.slug}.png`,
      dateModified: SERVICES_UPDATED,
      areaServed: { "@type": "Country", name: "Srbija" },
      // the starting price, where one is published on the page
      ...(page.price?.from
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: page.price.from,
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: page.price.from,
                priceCurrency: "EUR",
                ...(page.price.per === "mesečno"
                  ? { unitText: "MON", billingDuration: "P1M" }
                  : {}),
              },
            },
          }
        : {}),
      provider: {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Digitl",
        url: SITE,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: SITE },
        {
          "@type": "ListItem",
          position: 2,
          name: "Usluge",
          item: `${SITE}/usluge`,
        },
        { "@type": "ListItem", position: 3, name: page.h1, item: url },
      ],
    },
  ];
}

export default async function ServiceRoute({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return (
    <Shell fonts={sans.variable}>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(page)) }}
      />
      <ServicePage page={page} />
    </Shell>
  );
}
