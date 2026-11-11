/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Design studies that have since become the homepage, or were retired.
  async redirects() {
    return [
      { source: "/v2home", destination: "/v1", permanent: true },
      // the /v2 test became the homepage (11 Nov 2026); not permanent, so
      // the address can hold the next test
      { source: "/v2", destination: "/", permanent: false },
      // the hero card tests; /v9 became the homepage's cards (11 Nov 2026)
      { source: "/v7", destination: "/", permanent: false },
      { source: "/v8", destination: "/", permanent: false },
      { source: "/v9", destination: "/", permanent: false },
      { source: "/v4", destination: "/", permanent: true },
      { source: "/v5", destination: "/", permanent: true },
      { source: "/v6", destination: "/", permanent: true },
      // The WordPress site's service pages and contact page (Wayback, 2025
      // and Jan 2026) lead to their new pages.
      { source: "/services", destination: "/usluge", permanent: true },
      {
        source: "/services/web-dizajn-izrada-sajtova",
        destination: "/usluge/izrada-sajta",
        permanent: true,
      },
      {
        source: "/services/seo-optimizacija",
        destination: "/usluge/seo-optimizacija",
        permanent: true,
      },
      {
        source: "/services/oglasavanje-na-drustvenim-mrezama",
        destination: "/usluge/placeno-oglasavanje",
        permanent: true,
      },
      {
        source: "/services/vodenje-drustvenih-mreza",
        destination: "/usluge/vodjenje-drustvenih-mreza",
        permanent: true,
      },
      { source: "/kontakt", destination: "/#kontakt", permanent: true },
      // the brand page was renamed before it went live (11 Nov 2026)
      {
        source: "/usluge/dizajn-logotipa",
        destination: "/usluge/brending-i-vizuelni-identitet",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.digitl.me",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "api.digitl.rs",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
