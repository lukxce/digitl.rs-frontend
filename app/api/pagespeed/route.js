// Proxies Google PageSpeed Insights for the v5 "Dijagnoza" tool.
// Server-side so a PAGESPEED_API_KEY can raise the quota without being shipped
// to the browser; keyless calls share Google's global daily quota and run out.
// Returns only what the page draws, not the 1–2 MB Lighthouse report.

export const maxDuration = 60;

const TTL = 60 * 60 * 1000;
const cache = new Map();

function normalise(input) {
  const raw = String(input ?? "").trim();
  if (!raw || raw.length > 300) return null;
  let url;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase();
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return null;
  if (/^(localhost|.*\.local|.*\.internal)$/.test(host)) return null;
  url.hash = "";
  return url;
}

const METRICS = {
  fcp: "first-contentful-paint",
  lcp: "largest-contentful-paint",
  cls: "cumulative-layout-shift",
  tbt: "total-blocking-time",
  si: "speed-index",
};

function savingsOf(a) {
  const ms = Math.max(
    a.details?.overallSavingsMs ?? 0,
    a.metricSavings?.LCP ?? 0,
    a.metricSavings?.FCP ?? 0,
  );
  const bytes = a.details?.overallSavingsBytes ?? 0;
  return { ms, bytes };
}

function slim(data) {
  const lh = data?.lighthouseResult;
  const cats = lh?.categories;
  if (!cats?.performance) return null;
  const score = (k) =>
    typeof cats[k]?.score === "number" ? Math.round(cats[k].score * 100) : null;
  const A = lh.audits ?? {};

  const metrics = {};
  for (const [k, id] of Object.entries(METRICS)) {
    const a = A[id];
    if (!a) continue;
    metrics[k] = {
      value: a.numericValue ?? null,
      display: a.displayValue ?? "",
      score: a.score ?? null,
    };
  }

  // Failing opportunities and insights with a real estimated saving, biggest first.
  const seen = new Set();
  const fixes = Object.values(A)
    .filter((a) => typeof a.score === "number" && a.score < 0.9)
    .filter(
      (a) => a.details?.type === "opportunity" || a.id.endsWith("-insight"),
    )
    .map((a) => ({ a, ...savingsOf(a) }))
    .filter((x) => x.ms > 0 || x.bytes > 0)
    .sort((x, y) => y.ms - x.ms || y.bytes - x.bytes)
    .filter(({ a }) => (seen.has(a.title) ? false : seen.add(a.title)))
    .slice(0, 3)
    .map(({ a, ms }) => ({
      title: a.title,
      display: a.displayValue ?? "",
      ms: Math.round(ms),
    }));

  return {
    url: lh.finalDisplayedUrl ?? lh.finalUrl ?? lh.requestedUrl,
    fetchedAt: lh.fetchTime ?? new Date().toISOString(),
    scores: {
      performance: score("performance"),
      seo: score("seo"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
    },
    metrics,
    shot: A["final-screenshot"]?.details?.data ?? null,
    fixes,
  };
}

export async function GET(request) {
  const target = normalise(new URL(request.url).searchParams.get("url"));
  if (!target) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const cacheKey = target.href;
  const hit = cache.get(cacheKey);
  if (hit && Date.now() - hit.at < TTL) {
    return Response.json({ ...hit.result, cached: true });
  }

  const api = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  api.searchParams.set("url", target.href);
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("locale", "sr-Latn");
  for (const c of ["performance", "seo", "accessibility", "best-practices"]) {
    api.searchParams.append("category", c);
  }
  const key = process.env.PAGESPEED_API_KEY?.trim();
  if (key) api.searchParams.set("key", key);

  // Local development only: replay a saved Lighthouse report instead of
  // spending quota (PSI_FIXTURE=/path/to/lighthouse.json).
  if (process.env.NODE_ENV === "development" && process.env.PSI_FIXTURE) {
    const { readFile } = await import("node:fs/promises");
    const lh = JSON.parse(await readFile(process.env.PSI_FIXTURE, "utf8"));
    await new Promise((r) => setTimeout(r, 6000));
    return Response.json(slim({ lighthouseResult: lh.lighthouseResult ?? lh }));
  }

  let res;
  try {
    res = await fetch(api, {
      cache: "no-store",
      signal: AbortSignal.timeout(55_000),
    });
  } catch {
    return Response.json({ error: "timeout" }, { status: 504 });
  }

  if (res.status === 429) {
    return Response.json({ error: "quota" }, { status: 429 });
  }
  if (!res.ok) {
    // Google answers 400/500 when it can't load the page (DNS, 4xx/5xx, blocked).
    return Response.json({ error: "unreachable" }, { status: 502 });
  }

  const result = slim(await res.json().catch(() => null));
  if (!result) {
    return Response.json({ error: "unreachable" }, { status: 502 });
  }
  cache.set(cacheKey, { at: Date.now(), result });
  if (cache.size > 200) cache.delete(cache.keys().next().value);
  return Response.json(result);
}
