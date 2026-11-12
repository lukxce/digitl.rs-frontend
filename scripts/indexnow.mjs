/* Tell Bing (and the other IndexNow engines) which URLs changed, right after
   a deploy:  node scripts/indexnow.mjs   (all sitemap URLs)
              node scripts/indexnow.mjs /usluge/seo-optimizacija ...
   The key file lives at public/<key>.txt. Bing's index feeds ChatGPT search. */
const KEY = "84bad6b5d586a9bef5fe9e1959015c53";
const HOST = "www.digitl.rs";
const args = process.argv.slice(2);
let urls = args.map((p) => `https://${HOST}${p.startsWith("/") ? p : "/" + p}`);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});
console.log(res.status, res.statusText, urls.length, "URLs");
