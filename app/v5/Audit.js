"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import a from "./audit.module.css";
import b from "./base.module.css";
import { ArrowRight, Check, Rotate, Search } from "./icons";
import { Btn, EASE, Roll, useApp } from "./ui";

const PLACEHOLDERS = [
  "vasafirma.rs",
  "www.vas-sajt.rs",
  "imefirme.co.rs",
  "vasa-radnja.rs/usluge",
];

const STEPS = [
  "Google otvara sajt na sporijem telefonu, preko 4G mreže",
  "Meri kada se pojavi prvi, pa glavni sadržaj",
  "Proverava da li sadržaj skače dok se učitava",
  "Čita naslove, opise i linkove koje Google vidi",
  "Sabira ocene u četiri kategorije",
];

const CATEGORIES = [
  ["performance", "Brzina"],
  ["seo", "SEO"],
  ["accessibility", "Pristupačnost"],
  ["bestPractices", "Dobre prakse"],
];

const METRICS = [
  ["fcp", "Prvi prikaz", "FCP"],
  ["lcp", "Glavni sadržaj", "LCP"],
  ["cls", "Pomeranje", "CLS"],
  ["tbt", "Blokiranje", "TBT"],
];

const ERRORS = {
  invalid: "Upišite adresu sajta, na primer vasafirma.rs",
  quota:
    "Google je za danas potrošio besplatne provere preko našeg sajta. Pošaljite nam adresu i izmerićemo ručno, ili probajte ponovo sutra.",
  unreachable:
    "Google nije uspeo da otvori taj sajt. Proverite adresu, i da li sajt radi kad ga otvorite sami.",
  timeout: "Merenje je trajalo predugo, Google je prekinuo. Probajte ponovo.",
  network: "Veza je pukla usred merenja. Probajte ponovo.",
};

const band = (v) =>
  v == null ? "none" : v >= 90 ? "good" : v >= 50 ? "ok" : "bad";

function hostOf(input) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(u.hostname) ? u : null;
  } catch {
    return null;
  }
}

/** Typewriter placeholder that pauses while the field has focus or text. */
function useTypewriter(paused) {
  const [ph, setPh] = useState(PLACEHOLDERS[0]);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    let i = 0;
    let j = 0;
    let dir = 1;
    let hold = 0;
    const id = setInterval(() => {
      const s = PLACEHOLDERS[i];
      if (hold > 0) hold--;
      else {
        j += dir;
        if (j >= s.length) {
          dir = -1;
          hold = 34;
        }
        if (j <= 0) {
          dir = 1;
          i = (i + 1) % PLACEHOLDERS.length;
        }
      }
      setPh(s.slice(0, Math.max(0, j)) + (j < s.length ? "▍" : ""));
    }, 55);
    return () => clearInterval(id);
  }, [paused]);
  return ph;
}

function Ring({ value, label, run }) {
  const r = 27;
  const c = 2 * Math.PI * r;
  const v = value ?? 0;
  return (
    <div className={a.ring} data-band={band(value)}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} className={a.ringTrack} />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          className={a.ringBar}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: run ? c * (1 - v / 100) : c }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
        />
      </svg>
      <b>{value == null ? "–" : <Roll value={v} run={run} ms={1300} />}</b>
      <span>{label}</span>
    </div>
  );
}

function Running({ host, elapsed }) {
  const step = Math.min(STEPS.length - 1, Math.floor(elapsed / 4.5));
  const pct = Math.min(92, (elapsed / 26) * 100);
  return (
    <div className={a.running}>
      <div className={a.phone} aria-hidden="true">
        <span className={a.phoneNotch} />
        <span className={a.scan} />
        <span className={a.skel} style={{ width: "46%" }} />
        <span className={a.skelBlock} />
        <span className={a.skel} style={{ width: "88%" }} />
        <span className={a.skel} style={{ width: "72%" }} />
        <span className={a.skel} style={{ width: "80%" }} />
        <span className={a.skelBtn} />
      </div>
      <div className={a.runCopy}>
        <p className={a.runHead}>
          Merimo <b>{host}</b>
          <span className={b.tnum}>{elapsed} s</span>
        </p>
        <div className={a.progress}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <ol className={a.steps}>
          {STEPS.map((t, i) => (
            <li
              key={t}
              data-state={i < step ? "done" : i === step ? "now" : "next"}
            >
              <span className={a.stepMark}>
                {i < step ? <Check size={12} strokeWidth={3} /> : null}
              </span>
              {t}
            </li>
          ))}
        </ol>
        <p className={b.source}>
          Obično traje 15 do 30 sekundi. Rezultat dolazi direktno od Google-a.
        </p>
      </div>
    </div>
  );
}

function Verdict({ r, host }) {
  const lcp = r.metrics.lcp?.display || "";
  const p = r.scores.performance;
  if (p >= 90) {
    return (
      <p className={a.verdict}>
        <b>Brz sajt.</b> {host} na telefonu prikaže glavni sadržaj za {lcp}.
        Sledeće pitanje je da li vas ljudi nalaze na Google-u, i da li ih sajt
        vodi do poziva.
      </p>
    );
  }
  if (p >= 50) {
    return (
      <p className={a.verdict}>
        <b>Ima prostora.</b> Glavni sadržaj se na telefonu pojavi za {lcp}. Po
        Google-ovim podacima, kad učitavanje pređe sa 1 na 3 sekunde,
        verovatnoća da posetilac ode raste za 32%.
      </p>
    );
  }
  return (
    <p className={a.verdict}>
      <b>Ovo vas košta kupaca.</b> Glavni sadržaj se na telefonu pojavi tek za{" "}
      {lcp}, a već između 1 i 5 sekundi verovatnoća da posetilac ode raste za
      90%, po Google-ovim podacima.
    </p>
  );
}

function Results({ r, host, onAgain }) {
  const { book } = useApp();
  const [run, setRun] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRun(true), 60);
    return () => clearTimeout(t);
  }, []);
  const perf = r.scores.performance ?? 0;

  return (
    <div className={a.results}>
      <div className={a.resHead}>
        <p>
          <b>{host}</b>
          <span>
            Telefon · izmereno{" "}
            {r.cached ? "u poslednjih sat vremena" : "upravo sada"}
          </span>
        </p>
        <button type="button" className={a.again} onClick={onAgain}>
          <Rotate size={13} /> Nova provera
        </button>
      </div>

      <div className={a.resGrid}>
        <figure className={a.shotFrame}>
          {r.shot
            ? // eslint-disable-next-line @next/next/no-img-element
              <img src={r.shot} alt={`Kako Google vidi ${host} na telefonu`} />
            : <span className={a.shotEmpty}>Bez snimka</span>}
          <figcaption>Ovako ga je Google video</figcaption>
        </figure>

        <div className={a.resMain}>
          <div className={a.rings}>
            {CATEGORIES.map(([k, label]) => (
              <Ring key={k} value={r.scores[k]} label={label} run={run} />
            ))}
          </div>
          <div className={a.metrics}>
            {METRICS.map(([k, label, abbr]) => {
              const m = r.metrics[k];
              if (!m) return null;
              const s =
                m.score == null
                  ? "none"
                  : m.score >= 0.9
                    ? "good"
                    : m.score >= 0.5
                      ? "ok"
                      : "bad";
              return (
                <div key={k} className={a.metric} data-band={s}>
                  <span>
                    <i /> {label} <em>{abbr}</em>
                  </span>
                  <b className={b.tnum}>{m.display || "–"}</b>
                </div>
              );
            })}
          </div>
          <Verdict r={r} host={host} />
          <p className={a.scale}>
            <span data-band="good">90–100 dobro</span>
            <span data-band="ok">50–89 srednje</span>
            <span data-band="bad">0–49 loše</span>
            <em>Google-ova skala</em>
          </p>
        </div>

        <div className={a.resSide}>
          <p className={a.sideTitle}>Šta bismo prvo popravili</p>
          {r.fixes.length
            ? <ol className={a.fixes}>
                {r.fixes.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.1,
                      duration: 0.5,
                      ease: EASE,
                    }}
                  >
                    <span className={a.fixNo}>{i + 1}</span>
                    <span>
                      <b>{f.title}</b>
                      {f.display ? <em>{f.display}</em> : null}
                    </span>
                  </motion.li>
                ))}
              </ol>
            : <p className={a.noFixes}>
                Google ne vidi ništa veliko za popravku na ovoj stranici.
              </p>}

          <div className={a.compare}>
            <p className={a.sideTitle}>Brzina na telefonu</p>
            {[
              [host, perf, true, null],
              ["Moler Niš", 100, false, "molernis.rs"],
              ["Servis Klime Niš", 100, false, "servisklimenis.rs"],
            ]
              .filter(([, , you, domain]) => you || !host.startsWith(domain))
              .map(([name, v, you]) => (
                <div
                  key={name}
                  className={a.bar}
                  data-you={you ? "true" : undefined}
                  data-band={band(v)}
                >
                  <span>{name}</span>
                  <span className={a.barTrack}>
                    <motion.i
                      initial={{ width: 0 }}
                      animate={{ width: run ? `${v}%` : 0 }}
                      transition={{
                        duration: 1,
                        ease: EASE,
                        delay: you ? 0.2 : 0.35,
                      }}
                    />
                  </span>
                  <b className={b.tnum}>{v}</b>
                </div>
              ))}
            <p className={b.source}>
              Naši sajtovi: ocene iz studija slučaja na digitl.rs.
            </p>
          </div>

          <div className={a.resCtas}>
            <Btn variant="accent" size="sm" onClick={() => book("Web")}>
              Pošaljite nam izveštaj
            </Btn>
          </div>
          <p className={b.source}>
            Kažemo šta od ovoga stvarno utiče na pozive, a šta je kozmetika.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Audit() {
  const { setAudit, focusAudit, book } = useApp();
  const input = useRef(null);
  const ctrl = useRef(null);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [state, setState] = useState("idle");
  const [host, setHost] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const ph = useTypewriter(focused || Boolean(text));

  useEffect(() => {
    if (!focusAudit) return;
    const t = setTimeout(
      () => input.current?.focus({ preventScroll: true }),
      700,
    );
    return () => clearTimeout(t);
  }, [focusAudit]);

  useEffect(() => {
    if (state !== "running") return;
    const t0 = Date.now();
    const id = setInterval(
      () => setElapsed(Math.round((Date.now() - t0) / 1000)),
      500,
    );
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => () => ctrl.current?.abort(), []);

  async function run(e) {
    e?.preventDefault();
    const u = hostOf(text);
    if (!u) {
      setError("invalid");
      setState("error");
      return;
    }
    const h =
      u.hostname.replace(/^www\./, "") + (u.pathname !== "/" ? u.pathname : "");
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    setHost(h);
    setElapsed(0);
    setError(null);
    setResult(null);
    setState("running");
    try {
      const res = await fetch(
        `/api/pagespeed?url=${encodeURIComponent(u.href)}`,
        { signal: ctrl.current.signal },
      );
      const data = await res.json().catch(() => ({ error: "network" }));
      if (!res.ok || data.error) {
        const kind = ERRORS[data.error] ? data.error : "unreachable";
        setError(kind);
        setState("error");
        setAudit({ host: h, error: kind });
        return;
      }
      setResult(data);
      setState("done");
      setAudit({ host: h, ...data });
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError("network");
      setState("error");
    }
  }

  const again = () => {
    setState("idle");
    setResult(null);
    setText("");
    setTimeout(() => input.current?.focus({ preventScroll: true }), 50);
  };

  const open = state === "running" || state === "done";

  return (
    <div id="provera" className={a.console} data-chapter>
      <div className={a.top}>
        <span className={a.live}>
          <span className={b.liveDot} />
          Uživo, preko Google PageSpeed Insights
        </span>
        <span className={a.free}>Besplatno · bez prijave</span>
      </div>

      <form className={a.form} onSubmit={run}>
        <Search
          size={24}
          className={`${a.spark} ${state === "running" ? b.spin : ""}`}
        />
        <label htmlFor="audit-url" className={b.srOnly}>
          Adresa vašeg sajta
        </label>
        <input
          id="audit-url"
          ref={input}
          className={a.input}
          value={text}
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={focused ? "vasafirma.rs" : `Ukucajte svoj sajt: ${ph}`}
          onChange={(e) => {
            setText(e.target.value);
            if (state === "error") setState("idle");
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button
          type="submit"
          className={`${b.btn} ${b.btn_accent} ${a.go}`}
          disabled={state === "running"}
        >
          <span className={a.goLabel}>
            {state === "running" ? "Merimo…" : "Proveri sajt"}
          </span>
          <span className={b.arrow}>
            <ArrowRight size={16} />
          </span>
        </button>
      </form>

      <div className={a.chips}>
        {CATEGORIES.map(([k, label]) => (
          <span key={k} className={a.chip}>
            <i data-k={k} />
            {label}
          </span>
        ))}
        <span className={a.chipNote}>
          Isti test kojim Google ocenjuje sajtove na telefonu.
        </span>
      </div>

      <AnimatePresence initial={false}>
        {state === "error"
          ? <motion.div
              key="err"
              className={a.error}
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p>{ERRORS[error]}</p>
              {error === "quota" || error === "unreachable"
                ? <Btn
                    variant="ink"
                    size="sm"
                    arrow
                    onClick={() => book("Web")}
                  >
                    Pošaljite adresu nama
                  </Btn>
                : null}
            </motion.div>
          : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open
          ? <motion.div
              key="panel"
              className={a.panelWrap}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className={a.panel} aria-live="polite">
                <AnimatePresence mode="wait">
                  {state === "running"
                    ? <motion.div
                        key="run"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Running host={host} elapsed={elapsed} />
                      </motion.div>
                    : result
                      ? <motion.div
                          key="res"
                          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          transition={{ duration: 0.5, ease: EASE }}
                        >
                          <Results r={result} host={host} onAgain={again} />
                        </motion.div>
                      : null}
                </AnimatePresence>
              </div>
            </motion.div>
          : null}
      </AnimatePresence>

      {state === "idle" || state === "error"
        ? <p className={a.foot}>
            Upišite adresu i za dvadesetak sekundi vidite ocenu, šta se na
            telefonu učitava sporo i šta bismo prvo popravili. Bez mejla, bez
            prijave.
          </p>
        : null}
    </div>
  );
}
