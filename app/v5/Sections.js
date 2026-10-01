"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import primaDental from "../assets/clients/prima-dental.webp";
import startupsRs from "../assets/clients/startups-rs.webp";
import logo from "../assets/digitl-logo.png";
import { Btn, Counter, EASE, Kicker, Reveal, SectionHead, Segmented, useVisible } from "./ui";
import s from "./v5.module.css";

/* ── Marquee ──────────────────────────────────────────────────────────────── */
export function Marquee({ clients }) {
  const items = [
    ...clients.filter((c) => c.logo).map((c) => ({ name: c.name, src: c.logo })),
    { name: "Prima Dental", src: primaDental.src },
    { name: "Startups.rs", src: startupsRs.src },
  ];
  const row = [...items, ...items];
  return (
    <section className={s.marqueeSec} data-theme="light">
      <div className={s.container}>
        <p className={s.label}>Rade sa nama</p>
      </div>
      <div className={`${s.marqueeWrap} ${s.fadeX}`}>
        <div className={s.marquee}>
          {row.map((x, i) => (
            <span key={`${x.name}-${i}`} className={s.marqueeItem} aria-hidden={i >= items.length}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.src} alt="" />
              {x.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Services tour ────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    key: "ads",
    label: "Oglašavanje",
    title: "Plaćeno oglašavanje",
    body: "Kampanje na Google-u i mrežama, postavljene i skalirane da donose prodaju, ne samo klikove.",
    points: ["Google Search i Performance Max", "Meta i Instagram kampanje", "Praćenje od klika do upita"],
  },
  {
    key: "seo",
    label: "SEO",
    title: "SEO",
    body: "Budite prvi tamo gde kupci traže rešenje, na Google-u i u AI pretrazi.",
    points: ["Stranica za svaku uslugu i grad", "Tehnički SEO na nivou šablona", "Sadržaj koji odgovara na prava pitanja"],
  },
  {
    key: "web",
    label: "Web",
    title: "Web",
    body: "Brzi sajtovi napravljeni da konvertuju, da plaćeni saobraćaj pretvore u kupce.",
    points: ["Cena i kontakt vidljivi pre poziva", "Sadržaj uređujete sami", "Napravljen za telefon pre svega"],
  },
  {
    key: "social",
    label: "Mreže",
    title: "Društvene mreže",
    body: "Dosledan brend na mrežama koji podržava sve ostale kanale.",
    points: ["Plan objava po nedeljama", "Formati za Reels i Stories", "Isti glas kao sajt i oglasi"],
  },
  {
    key: "brand",
    label: "Brend",
    title: "Brend",
    body: "Pozicioniranje i vizuelni sistem ispod svega ostalog.",
    points: ["Pozicioniranje i poruka", "Logo, boje i tipografija", "Sistem koji radi na svakom formatu"],
  },
];

function Sample({ children = "Ilustracija" }) {
  return <span className={s.sampleTag}>● {children}</span>;
}

function AdsViz() {
  const bars = [
    { label: "Prikazi", w: 100 },
    { label: "Klikovi", w: 42 },
    { label: "Upiti", w: 14 },
  ];
  return (
    <div className={s.vizInner}>
      <Sample />
      <motion.div
        className={s.adCard}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className={s.adSponsor}>Sponzorisano</span>
        <b>Servis klime, cena vidljiva unapred.</b>
        <span className={s.adCta}>Pozovite</span>
      </motion.div>
      <div className={s.funnel}>
        {bars.map((b, i) => (
          <div key={b.label} className={s.funnelRow}>
            <span>{b.label}</span>
            <div className={s.funnelTrack}>
              <motion.div
                className={s.funnelFill}
                style={{ background: i === 2 ? "var(--secondary)" : undefined }}
                initial={{ width: 0 }}
                animate={{ width: `${b.w}%` }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className={s.vizNote}>Pratimo ceo put, ne samo klik.</p>
    </div>
  );
}

function SeoViz() {
  const query = "električar niš";
  const [typed, setTyped] = useState("");
  const [up, setUp] = useState(false);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(query.slice(0, i));
      if (i >= query.length) clearInterval(id);
    }, 70);
    const t = setTimeout(() => setUp(true), 1700);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);
  const others = ["Imenik majstora", "Oglasi za usluge", "Forum: preporuke"];
  const yours = { name: "Vaš sajt", url: "vasafirma.rs/elektricar-nis" };
  const order = up ? [yours, ...others.map((o) => ({ name: o }))] : [...others.map((o) => ({ name: o })), yours];
  return (
    <div className={s.vizInner}>
      <Sample />
      <div className={s.searchBox}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>
          {typed}
          <i className={s.caret} />
        </span>
      </div>
      <div className={s.serp}>
        {order.map((r) => (
          <motion.div
            layout
            key={r.name}
            transition={{ duration: 0.7, ease: EASE }}
            className={`${s.serpRow} ${r.url ? s.serpYours : ""}`}
          >
            <span className={s.serpFav} />
            <div>
              <b>{r.name}</b>
              <span>{r.url ?? "———————— ——————"}</span>
            </div>
            {r.url && up ? <em className={s.serpUp}>↑ 1</em> : null}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WebViz() {
  const C = 2 * Math.PI * 54;
  const metric = { num: 100, decimals: 0, suffix: "" };
  return (
    <div className={s.vizInner}>
      <div className={s.ringWrap}>
        <svg viewBox="0 0 128 128" className={s.ring} aria-hidden="true">
          <circle cx="64" cy="64" r="54" className={s.ringTrack} />
          <motion.circle
            cx="64"
            cy="64"
            r="54"
            className={s.ringFill}
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.3, ease: EASE }}
          />
        </svg>
        <span className={s.ringNum}>
          <Counter metric={metric} />
        </span>
      </div>
      <p className={s.vizCaption}>
        <b>Google PageSpeed na telefonu</b>
        Servis Klime Niš i Moler Niš
      </p>
      <div className={s.vitals}>
        {["Učitavanje", "Odziv", "Stabilnost"].map((v, i) => (
          <motion.span
            key={v}
            className={s.vital}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: EASE }}
          >
            <i />
            {v}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function SocialViz() {
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  const tones = ["var(--accent)", "var(--panel)", "var(--secondary)", "var(--spark)", "var(--accent-pale)"];
  return (
    <div className={s.vizInner}>
      <Sample />
      <div className={s.feedGrid}>
        {tiles.map((i) => {
          const r = Math.floor(i / 3);
          const c = i % 3;
          return (
            <motion.span
              key={i}
              className={s.feedTile}
              style={{ background: tones[(i * 2) % tones.length] }}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (r + c) * 0.09, duration: 0.55, ease: EASE }}
            >
              {i % 3 === 1 ? (
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="#fff" />
                </svg>
              ) : null}
            </motion.span>
          );
        })}
      </div>
      <p className={s.vizNote}>Nedelja 1 do 3, isti glas na svakom formatu.</p>
    </div>
  );
}

function BrandViz() {
  const swatches = [
    { name: "Plava", hex: "#2A29FF", bg: "var(--accent)" },
    { name: "Noć", hex: "#0B0B0D", bg: "#0b0b0d" },
    { name: "Limeta", hex: "#9EF34A", bg: "var(--secondary)" },
    { name: "Koral", hex: "#FF8078", bg: "var(--spark)" },
  ];
  return (
    <div className={s.vizInner}>
      <Sample>Digitl vizuelni sistem</Sample>
      <div className={s.brandTop}>
        <motion.img
          src={logo.src}
          alt=""
          className={s.brandMark}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.div
          className={s.specimen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
        >
          <b>Aa</b>
          <span>Manrope · 400–800</span>
        </motion.div>
      </div>
      <div className={s.swatches}>
        {swatches.map((w, i) => (
          <motion.div
            key={w.name}
            className={s.swatch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.6, ease: EASE }}
          >
            <span style={{ background: w.bg }} />
            <b>{w.name}</b>
            <em>{w.hex}</em>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const VIZ = { ads: AdsViz, seo: SeoViz, web: WebViz, social: SocialViz, brand: BrandViz };
const TOUR_DWELL = 6500;

export function Services() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [k, setK] = useState(SERVICES[0].key);
  const [touched, setTouched] = useState(false);
  const idx = SERVICES.findIndex((x) => x.key === k);
  const svc = SERVICES[idx];
  const Viz = VIZ[k];

  useEffect(() => {
    if (!visible || touched) return;
    const id = setTimeout(() => setK(SERVICES[(idx + 1) % SERVICES.length].key), TOUR_DWELL);
    return () => clearTimeout(id);
  }, [visible, touched, idx]);

  return (
    <section id="usluge" className={s.section} data-theme="light" ref={ref}>
      <div className={s.container}>
        <SectionHead
          kicker="Šta radimo"
          title="Sve što vaš biznis traži, na jednom mestu."
          intro="Pet usluga koje rade kao jedan sistem. Oglasi dovode ljude na sajt koji ih pretvara u upite, SEO smanjuje cenu svakog sledećeg, a brend drži sve na okupu."
        />
        <Reveal className={s.tourBar}>
          <Segmented
            id="services"
            options={SERVICES.map((x) => ({ key: x.key, label: x.label }))}
            value={k}
            onChange={(v) => {
              setTouched(true);
              setK(v);
            }}
          />
          <span className={s.tourProgress} aria-hidden="true">
            {visible && !touched ? (
              <motion.i
                key={k}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: TOUR_DWELL / 1000, ease: "linear" }}
              />
            ) : null}
          </span>
        </Reveal>

        <div className={s.tourGrid}>
          <AnimatePresence mode="wait">
            <motion.div
              key={k}
              className={s.tourCopy}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className={s.tourNum}>0{idx + 1}</span>
              <h3 className={s.h3}>{svc.title}</h3>
              <p className={s.body}>{svc.body}</p>
              <ul className={s.points}>
                {svc.points.map((p) => (
                  <li key={p}>
                    <span className={s.check} aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24">
                        <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          <div className={s.vizCard}>
            <AnimatePresence mode="wait">
              <motion.div
                key={k}
                className={s.vizSwap}
                initial={{ opacity: 0, filter: "blur(6px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(6px)", y: -6 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {visible || touched ? <Viz /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Without / With ───────────────────────────────────────────────────────── */
const JOBS = [
  { area: "Oglasi", pain: "Budžet se troši, a niko ne zna šta je donelo upit.", done: "Svaki dinar je vezan za upit ili prodaju." },
  { area: "Sajt", pain: "Lep sajt koji ne zvoni.", done: "Brz sajt koji vodi do poziva." },
  { area: "SEO", pain: "Jedna stranica „usluge“ za sve.", done: "Svaka usluga ima svoju stranicu." },
  { area: "Mreže", pain: "Objave kad se neko seti.", done: "Dosledan brend i plan po nedeljama." },
  { area: "Izveštaji", pain: "Izveštaj od 40 strana bez odluke.", done: "Jasni izveštaji i konkretne odluke o sledećem koraku." },
];

export function WithWithout() {
  const [mode, setMode] = useState("Bez sistema");
  const on = mode === "Sa Digitl-om";
  return (
    <section id="zasto" className={`${s.section} ${s.tintSecondary}`} data-theme="light">
      <div className={`${s.container} ${s.wwGrid}`}>
        <div className={s.wwCopy}>
          <Reveal>
            <Kicker>Zašto jedan tim</Kicker>
          </Reveal>
          <Reveal i={1} as="h2" className={s.h2}>
            Marketing koji se meri profitom, ne aktivnošću.
          </Reveal>
          <Reveal i={2} as="p" className={s.body}>
            Većina firmi ima nekoga za oglase, nekoga za sajt i nekoga za mreže. Niko nije odgovoran
            za broj koji se zapravo računa.
          </Reveal>
          <Reveal i={3}>
            <Segmented id="ww" options={["Bez sistema", "Sa Digitl-om"]} value={mode} onChange={setMode} />
          </Reveal>
        </div>

        <div className={`${s.wwCard} ${on ? s.wwCardOn : ""}`}>
          {/* Gradients with CSS variables can't interpolate, so the dark panel fades in as a layer. */}
          <motion.span
            className={s.wwDark}
            aria-hidden="true"
            initial={false}
            animate={{ opacity: on ? 1 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <ul className={s.wwList}>
            {JOBS.map((j, i) => (
              <li key={j.area} className={s.wwRow}>
                <span className={s.wwArea}>{j.area}</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={on ? "d" : "p"}
                    className={`${s.wwLine} ${on ? s.wwDone : s.wwPain}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: EASE }}
                  >
                    <i aria-hidden="true">{on ? "✓" : "✕"}</i>
                    {on ? j.done : j.pain}
                  </motion.span>
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ── Proof (dark) ─────────────────────────────────────────────────────────── */
const PROOF_DWELL = 7500;

export function Proof({ clients }) {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [slug, setSlug] = useState(clients[0]?.slug);
  const [touched, setTouched] = useState(false);
  const idx = Math.max(0, clients.findIndex((c) => c.slug === slug));
  const c = clients[idx];

  useEffect(() => {
    if (!visible || touched || clients.length < 2) return;
    const id = setTimeout(() => setSlug(clients[(idx + 1) % clients.length].slug), PROOF_DWELL);
    return () => clearTimeout(id);
  }, [visible, touched, idx, clients]);

  if (!c) return null;

  return (
    <section id="projekti" className={s.panelSection} data-theme="light" ref={ref}>
      <div className={s.container}>
        {/* the theme flag sits on the panel, not the section, so the nav pill only
            turns dark over the dark surface itself */}
        <div className={s.darkPanel} data-theme="dark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo.src} alt="" className={s.panelWatermark} aria-hidden="true" />
          <SectionHead
            dark
            kicker="Projekti"
            title="Brojevi iz stvarnih projekata."
            intro="Svaki projekat počinje istim pitanjem: odakle bi trebalo da dolaze novi klijenti, a odakle zapravo dolaze."
          />
          <Reveal className={s.tourBar}>
            <Segmented
              id="proof"
              dark
              options={clients.map((x) => ({ key: x.slug, label: x.name }))}
              value={c.slug}
              onChange={(v) => {
                setTouched(true);
                setSlug(v);
              }}
            />
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={c.slug}
              className={s.proofGrid}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className={s.proofCopy}>
                <span className={s.proofCat}>{c.category}</span>
                <h3 className={s.h3}>{c.takeaways[0]?.title ?? c.name}</h3>
                <p className={s.paleBody}>{c.takeaways[0]?.description}</p>
                <div className={s.proofStats}>
                  {c.metrics.map((m) => (
                    <div key={m.label} className={s.darkTile}>
                      <b>
                        <Counter metric={m} run={visible} />
                      </b>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
                <Btn href={c.href} variant="white" size="md" arrow>
                  Ceo projekat: {c.name}
                </Btn>
              </div>
              <div className={s.proofVisual}>
                <span className={s.ghostCard1} aria-hidden="true" />
                <div className={s.proofWindow}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.cover} alt={`Sajt za ${c.name}`} />
                </div>
                {c.takeaways.slice(1, 3).map((t, i) => (
                  <motion.div
                    key={t.title}
                    className={`${s.floatNote} ${i ? s.floatNote2 : ""}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: EASE }}
                  >
                    <span className={s.liveDot} />
                    {t.title}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
          <p className={s.sourceDark}>Iz studija slučaja na digitl.rs.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Process step tour ───────────────────────────────────────────────────── */
const STEPS = [
  { title: "Razumevanje", body: "Analiziramo biznis, ciljeve i dosadašnje brojeve da vidimo šta radi, a šta ne." },
  { title: "Planiranje", body: "Postavljamo prioritete, kanale i jasan plan rasta." },
  { title: "Lansiranje", body: "Pokrećemo, testiramo i skaliramo ono što zarađuje." },
  { title: "Optimizacija", body: "Jasni izveštaji i konkretne odluke o sledećem koraku." },
];
const STEP_DWELL = 7000;

function StepViz({ i }) {
  if (i === 0) {
    const dots = Array.from({ length: 60 }, (_, k) => k);
    const lit = new Set([7, 12, 23, 31, 38, 44, 52]);
    return (
      <div className={s.dotGrid}>
        {dots.map((k) => (
          <motion.i
            key={k}
            className={lit.has(k) ? s.dotLit : ""}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: lit.has(k) ? 1 : 0.35, scale: 1 }}
            transition={{ delay: ((k % 10) + Math.floor(k / 10)) * 0.025, duration: 0.5, ease: EASE }}
          />
        ))}
      </div>
    );
  }
  if (i === 1) {
    const rows = [
      { name: "Google pretraga", w: 88 },
      { name: "Sajt i brzina", w: 72 },
      { name: "Meta oglasi", w: 54 },
      { name: "Mreže", w: 36 },
    ];
    return (
      <div className={s.planRows}>
        {rows.map((r, k) => (
          <motion.div
            key={r.name}
            className={s.planRow}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: k * 0.12, duration: 0.6, ease: EASE }}
          >
            <span className={s.planRank}>{k + 1}</span>
            <b>{r.name}</b>
            <span className={s.planTrack}>
              <motion.i
                initial={{ width: 0 }}
                animate={{ width: `${r.w}%` }}
                transition={{ delay: 0.3 + k * 0.12, duration: 0.9, ease: EASE }}
              />
            </span>
          </motion.div>
        ))}
      </div>
    );
  }
  if (i === 2) {
    const runs = ["Kampanja A", "Kampanja B", "Kampanja C"];
    return (
      <div className={s.launchRows}>
        {runs.map((r, k) => (
          <div key={r} className={s.launchRow}>
            <b>{r}</b>
            <span className={s.livePill}>
              <span className={s.liveDot} /> uživo
            </span>
            <span className={s.launchTrack}>
              <motion.i
                initial={{ width: 0 }}
                animate={{ width: ["0%", `${[78, 46, 92][k]}%`] }}
                transition={{ delay: k * 0.2, duration: 2.2, ease: EASE }}
              />
            </span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 320 170" className={s.lineChart} aria-hidden="true">
      {[40, 85, 130].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} className={s.gridLine} />
      ))}
      <motion.path
        d="M0 150 C 40 140, 60 120, 90 124 S 150 96, 180 88 S 240 52, 270 40 S 305 22, 320 18"
        className={s.chartPath}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      <motion.circle
        cx="320"
        cy="18"
        r="7"
        className={s.chartDot}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.4, duration: 0.5, ease: EASE }}
      />
    </svg>
  );
}

export function Process() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!visible || paused) return;
    const id = setTimeout(() => setI((v) => (v + 1) % STEPS.length), STEP_DWELL);
    return () => clearTimeout(id);
  }, [visible, paused, i]);

  const next = STEPS[(i + 1) % STEPS.length];

  return (
    <section id="proces" className={s.section} data-theme="light" ref={ref}>
      <div className={s.container}>
        <SectionHead
          kicker="Kako radimo"
          title="Jedan povezan proces, od početka do kraja."
          intro="Strategija, egzekucija i rezultati u istom pravcu. Vidite šta radimo i zašto, u svakom koraku."
        />
        <Reveal className={s.stepBar}>
          {STEPS.map((st, k) => (
            <button
              key={st.title}
              type="button"
              className={`${s.stepTab} ${k === i ? s.stepTabOn : ""}`}
              onClick={() => {
                setPaused(true);
                setI(k);
              }}
              aria-pressed={k === i}
            >
              <span className={s.stepTrack}>
                {k < i ? <i style={{ transform: "scaleX(1)" }} /> : null}
                {k === i ? (
                  <motion.i
                    key={`run-${i}-${paused}`}
                    initial={{ scaleX: paused || !visible ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: paused || !visible ? 0 : STEP_DWELL / 1000, ease: "linear" }}
                  />
                ) : null}
              </span>
              <span className={s.stepTabLabel}>
                <b>0{k + 1}</b> <span>{st.title}</span>
              </span>
            </button>
          ))}
        </Reveal>

        <div className={s.stepCard}>
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              className={s.stepCopy}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <span className={s.outlineNum}>0{i + 1}</span>
              <h3 className={s.h3}>{STEPS[i].title}</h3>
              <p className={s.body}>{STEPS[i].body}</p>
              <div className={s.stepControls}>
                <button type="button" className={s.ctl} onClick={() => setPaused((p) => !p)}>
                  {paused ? "▶ Nastavi" : "❚❚ Pauza"}
                </button>
                <button
                  type="button"
                  className={s.ctl}
                  onClick={() => {
                    setPaused(true);
                    setI((v) => (v - 1 + STEPS.length) % STEPS.length);
                  }}
                >
                  ← Nazad
                </button>
                <button
                  type="button"
                  className={s.ctlNext}
                  onClick={() => {
                    setPaused(true);
                    setI((v) => (v + 1) % STEPS.length);
                  }}
                >
                  Sledeće: {next.title} →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className={s.stepVisual}>
            <span className={s.sampleTagLight}>● Ilustracija</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                className={s.stepVizSwap}
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {visible || paused ? <StepViz i={i} /> : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ flip cards ───────────────────────────────────────────────────────── */
const FAQS = [
  { q: "Koliko brzo možemo da krenemo?", a: "Obično u roku od 1 do 2 nedelje nakon dogovora, zavisno od obima i kapaciteta." },
  { q: "Šta ako nismo sigurni šta nam tačno treba?", a: "Zato i postoji prvi razgovor. Pogledamo brojeve i kažemo vam šta je prioritet, a šta može da čeka." },
  { q: "Radite samo kompletne projekte ili i pojedinačne usluge?", a: "Oba, ali najbolje radimo kao stalni partner koji vodi ceo marketing." },
  { q: "Kako izgleda komunikacija tokom saradnje?", a: "Direktno i redovno. Radite sa ljudima koji donose odluke, ne sa account menadžerom." },
  { q: "Sa kakvim firmama najčešće radite?", a: "Od lokalnih biznisa do etabliranih brendova, svuda gde se marketing meri rezultatom." },
];
const FACES = ["faceAccent", "facePanel", "faceLime", "faceMist", "faceCoral"];

function FlipCard({ item, tone, i }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <Reveal i={i} className={s.flipCell}>
      <button
        type="button"
        className={s.flip}
        data-flipped={flipped}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          setTilt({
            x: ((e.clientY - r.top) / r.height - 0.5) * -7,
            y: ((e.clientX - r.left) / r.width - 0.5) * 7,
          });
        }}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ "--tx": `${tilt.x}deg`, "--ty": `${tilt.y}deg` }}
      >
        <span className={s.flipInner}>
          <span className={`${s.flipFace} ${s[FACES[tone]]}`}>
            <span className={s.flipQuote}>“</span>
            <span className={s.flipQ}>{item.q}</span>
            <span className={s.flipHint}>Okrenite za odgovor ↻</span>
          </span>
          <span className={`${s.flipFace} ${s.flipBack}`}>
            <span className={s.flipAnsLabel}>Odgovor</span>
            <span className={s.flipA}>{item.a}</span>
            <span className={s.flipHintInk}>Nazad ↻</span>
          </span>
        </span>
      </button>
    </Reveal>
  );
}

export function Faq() {
  return (
    <section id="pitanja" className={`${s.section} ${s.tintAccent}`} data-theme="light">
      <div className={s.container}>
        <SectionHead
          kicker="Pitanja"
          title="Ono što nas pitaju pre prvog razgovora."
          intro="Kratki, iskreni odgovori. Za sve ostalo postoji besplatan pregled."
        />
        <div className={s.flipGrid}>
          {FAQS.map((f, i) => (
            <FlipCard key={f.q} item={f} tone={i} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Journal ──────────────────────────────────────────────────────────────── */
export function Journal({ articles }) {
  if (!articles.length) return null;
  return (
    <section className={s.section} data-theme="light">
      <div className={s.container}>
        <SectionHead kicker="Sa bloga" title="Šta pišemo ovih dana." />
        <div className={s.postGrid}>
          {articles.map((a, i) => (
            <Reveal key={a.slug} i={i}>
              <a href={`/journal/${a.slug}`} className={s.post}>
                <span className={s.postDate}>
                  {a.publishedAt
                    ? new Date(a.publishedAt).toLocaleDateString("sr-Latn-RS", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </span>
                <b>{a.title}</b>
                <span className={s.postGo}>
                  Pročitajte <span aria-hidden="true">→</span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
