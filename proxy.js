import { NextResponse } from "next/server";

/* The blog is off the site for now (Luka, 10 Nov 2026): the old posts were
   industry news and the site is to read as an agency's, page by service.
   Back on 13 Nov 2026 with the new posts written to the blog-writer rules.
   Their addresses answer 410 Gone, which tells search engines the pages were
   removed on purpose, so they drop out of the index faster than with a 404.
   The posts themselves are still in Sanity. To bring the blog back, set
   BLOG_LIVE to true and put Blog back on the homepage, in the nav and in the
   sitemap. */
export const BLOG_LIVE = true;

const GONE = `<!doctype html><html lang="sr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Stranica je uklonjena · Digitl</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;color:#0b0b16;background:#fff}
main{max-width:30em;padding:24px;text-align:center}h1{font-size:28px;letter-spacing:-.03em;margin:0 0 12px}
p{color:#575764;line-height:1.55;margin:0 0 22px}a{display:inline-block;padding:12px 20px;border-radius:999px;background:#2a29ff;color:#fff;text-decoration:none;font-weight:700}</style>
</head><body><main><h1>Ova stranica je uklonjena.</h1>
<p>Tekstovi sa bloga više nisu na sajtu. Šta radimo i kako možemo da pomognemo, pogledajte na stranici usluga.</p>
<a href="/usluge">Pogledajte usluge</a></main></body></html>`;

export function proxy() {
  if (BLOG_LIVE) return NextResponse.next();
  return new NextResponse(GONE, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}

export const config = {
  matcher: [
    "/journal",
    "/journal/:path*",
    "/v2-journal",
    "/v2-journal/:path*",
  ],
};
