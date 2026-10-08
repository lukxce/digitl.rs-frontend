/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Design studies that have since become the homepage, or were retired.
  async redirects() {
    return [
      { source: "/v2home", destination: "/v2", permanent: true },
      { source: "/v4", destination: "/", permanent: true },
      { source: "/v5", destination: "/", permanent: true },
      { source: "/v6", destination: "/", permanent: true },
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
