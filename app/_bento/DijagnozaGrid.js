"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ArrowIcon,
  CONTACT,
  MailIcon,
  PhoneIcon,
  formatDate,
  useHorizontalScroll,
} from "./kit";
import s from "./dijagnoza.module.css";

/**
 * The homepage as a diagnostic rather than a brochure.
 *
 * One answer — where your customers come from today — drives everything
 * downstream: which channels light up in the system diagram, which gap is
 * named, which case study is shown, which objection is answered, and what
 * the contact form arrives pre-filled with. The existing content is all
 * still here; none of it is presented as a list.
 */

const CHANNELS = [
  ["ads", "Plaćeno oglašavanje", "Donosi saobraćaj danas."],
  ["seo", "SEO", "Gradi saobraćaj koji ne plaćate."],
  ["web", "Web", "Pretvara taj saobraćaj u upite."],
  ["social", "Društvene mreže", "Drži brend prisutnim između kupovina."],
  ["brand", "Brend", "Čini da sve ostalo košta manje."],
];

/**
 * Each answer maps to the channels already working, the gap worth naming,
 * the client whose story is closest, and the objection that usually comes
 * next. The diagnosis lines are general and checkable, not promises.
 */
const SOURCES = [
  {
    id: "preporuka",
    label: "Preporuka",
    sub: "Od usta do usta",
    have: ["brand"],
    gapTitle: "Preporuka ima plafon.",
    gap: "Radi dok se krug poznanstava ne iscrpi. Tada novih poziva nema odakle da stignu, jer vas niko ko vas već ne zna ne može naći.",
    match: "moler-nis",
    objection: [
      "Radi nam i ovako, zašto bih menjao?",
      "I dalje će raditi. Razlika je što prestajete da zavisite isključivo od toga ko vas već zna.",
    ],
    prefill: "Klijenti nam trenutno stižu uglavnom preko preporuke.",
  },
  {
    id: "placeno",
    label: "Plaćeni oglasi",
    sub: "Google, Meta",
    have: ["ads", "web"],
    gapTitle: "Plaćeno radi dok plaćate.",
    gap: "Onog dana kad ugasite kampanju, saobraćaj staje. Bez organskog dela, cena upita raste svake godine jer je svaki klik iznajmljen.",
    match: "thermiq",
    objection: [
      "Zar SEO nije spor?",
      "Jeste. Zato se pokreće dok plaćeno još uvek nosi, a ne umesto njega.",
    ],
    prefill: "Trenutno se oslanjamo na plaćene oglase.",
  },
  {
    id: "organski",
    label: "Google, organski",
    sub: "Bez plaćenog",
    have: ["seo", "web"],
    gapTitle: "Organski donosi, ali ne možete da mu pojačate tempo.",
    gap: "Kad vam treba više upita ovog meseca, nemate ručicu za to. Plaćeni deo je ta ručica, a mreže i brend čine da klik bude jeftiniji.",
    match: "servis-klime-nis",
    objection: [
      "Ako sam već prvi, šta će mi oglasi?",
      "Za trenutke kad tražnja skoči, a vi hoćete više od onoga što pozicija sama donosi.",
    ],
    prefill: "Klijenti nas nalaze organski preko Google-a.",
  },
  {
    id: "mreze",
    label: "Društvene mreže",
    sub: "Instagram, Facebook",
    have: ["social", "brand"],
    gapTitle: "Mreže grade poznatost, ne nameru.",
    gap: "Kupac koji je spreman da kupi ne skroluje, nego pretražuje. Ako vas u tom trenutku nema u pretrazi, poznatost koju ste izgradili pokupi neko drugi.",
    match: "thermiq",
    objection: [
      "Imamo dosta pratilaca, zar to nije dovoljno?",
      "Pratioci su publika. Upiti su prihod. Nije isto i ne prelazi samo od sebe.",
    ],
    prefill: "Najviše ulažemo u društvene mreže.",
  },
  {
    id: "neznam",
    label: "Ne znam tačno",
    sub: "Ne merimo",
    have: [],
    gapTitle: "To je prvi problem, i najjeftiniji za rešavanje.",
    gap: "Bez merenja je svaka odluka o budžetu nagađanje. Merenje se postavlja za nekoliko dana i odmah pokazuje šta već radi, a šta samo troši.",
    match: "elektromil",
    objection: [
      "Koliko to košta da se postavi?",
      "Manje nego jedan mesec budžeta koji trenutno ne umete da pripišete nijednom kanalu.",
    ],
    prefill: "Iskreno, ne merimo odakle nam stižu klijenti.",
  },
];

const STEPS = [
  ["Razumevanje", "Analiziramo biznis, ciljeve i dosadašnje brojeve."],
  ["Planiranje", "Postavljamo prioritete, kanale i jasan plan rasta."],
  ["Lansiranje", "Pokrećemo, testiramo i skaliramo ono što zarađuje."],
  ["Optimizacija", "Jasni izveštaji i odluke o sledećem koraku."],
];

const ASK = [
  "Zašto vam Google Ads troši budžet na sopstveni brend",
  "Da li vam treba SEO ili samo brži sajt",
  "Koliko vas stvarno košta jedan upit",
  "Zašto konkurent sa gorim sajtom rangira bolje",
  "Zašto saobraćaj raste, a prodaja ne",
  "Kada ugasiti kampanju, a kada je pustiti",
  "Zašto je jeftiniji klik često skuplji klijent",
];

const NECE_SE_CUTI = [
  "sinergija",
  "disruptivno",
  "360° rešenje",
  "growth hacking",
  "holistički pristup",
  "digitalna transformacija",
];

/* ── the diagram, driven by the answer ───────────────────── */

const NODE_W = 250;
const NODE_H = 54;
const GAP = 16;
const HUB_X = 610;
const HUB_R = 54;
const VB_W = 1120;

function SystemDiagram({ have, answered }) {
  const total = CHANNELS.length * NODE_H + (CHANNELS.length - 1) * GAP;
  const top = 28;
  const vbH = total + top * 2;
  const hubY = top + total / 2;

  return (
    <svg
      className={s.diagram}
      viewBox={`0 0 ${VB_W} ${vbH}`}
      role="img"
      aria-label="Pet kanala povezanih u jedan sistem"
    >
      <title>Pet kanala povezanih u jedan sistem</title>

      <g className={s.wires}>
        {CHANNELS.map(([id], i) => {
          const y = top + i * (NODE_H + GAP) + NODE_H / 2;
          const x1 = HUB_X - HUB_R;
          const mid = (NODE_W + x1) / 2;
          const on = have.includes(id);
          return (
            <path
              key={id}
              className={`${s.wire} ${answered && on ? s.wireOn : ""} ${answered && !on ? s.wireOff : ""}`}
              style={{ "--d": `${i * 0.24}s` }}
              d={`M ${NODE_W} ${y} C ${mid} ${y}, ${mid} ${hubY}, ${x1} ${hubY}`}
            />
          );
        })}
        <path
          className={s.wireOut}
          d={`M ${HUB_X + HUB_R} ${hubY} L ${VB_W - 300} ${hubY}`}
        />
      </g>

      {CHANNELS.map(([id, label], i) => {
        const y = top + i * (NODE_H + GAP);
        const on = have.includes(id);
        const cls = !answered
          ? s.node
          : on
            ? `${s.node} ${s.nodeOn}`
            : `${s.node} ${s.nodeOff}`;
        return (
          <g key={id}>
            <rect
              className={cls}
              x="0"
              y={y}
              width={NODE_W}
              height={NODE_H}
              rx="16"
            />
            <circle
              className={`${s.nodeDot} ${answered && on ? s.dotOn : ""}`}
              cx="26"
              cy={y + NODE_H / 2}
              r="4.5"
            />
            <text
              className={`${s.nodeText} ${answered && !on ? s.nodeTextOff : ""}`}
              x="46"
              y={y + NODE_H / 2 + 5}
            >
              {label}
            </text>
            {answered && !on
              ? <text
                  className={s.nodeAdd}
                  x={NODE_W - 22}
                  y={y + NODE_H / 2 + 5}
                >
                  +
                </text>
              : null}
          </g>
        );
      })}

      <circle className={s.hubHalo} cx={HUB_X} cy={hubY} r={HUB_R + 14} />
      <circle className={s.hub} cx={HUB_X} cy={hubY} r={HUB_R} />
      <text className={s.hubText} x={HUB_X} y={hubY - 3} textAnchor="middle">
        jedan
      </text>
      <text className={s.hubText} x={HUB_X} y={hubY + 17} textAnchor="middle">
        sistem
      </text>

      <rect
        className={s.outNode}
        x={VB_W - 300}
        y={hubY - 44}
        width="300"
        height="88"
        rx="18"
      />
      <text className={s.outLabel} x={VB_W - 274} y={hubY - 12}>
        REZULTAT
      </text>
      <text className={s.outText} x={VB_W - 274} y={hubY + 14}>
        Upiti koji se
      </text>
      <text className={s.outText} x={VB_W - 274} y={hubY + 36}>
        pretvaraju u posao
      </text>
    </svg>
  );
}

/* ── small pieces ────────────────────────────────────────── */

function Chapter({ n, title, width, children }) {
  return (
    <section className={s.chapter} style={width ? { "--w": width } : undefined}>
      <header className={s.chapterHead}>
        <span className={s.chapterNum}>{n}</span>
        <span className={s.chapterTitle}>{title}</span>
      </header>
      <div className={s.chapterBody}>{children}</div>
    </section>
  );
}

function AskCard() {
  const [i, setI] = useState(0);
  return (
    <article className={`${s.card} ${s.ask}`}>
      <span className={s.eyebrow}>Pitajte nas o</span>
      <p className={s.askText}>{ASK[i]}</p>
      <button
        type="button"
        className={s.askMore}
        onClick={() => setI((v) => (v + 1) % ASK.length)}
      >
        Još jedno
      </button>
    </article>
  );
}

function BuzzCard() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % NECE_SE_CUTI.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <article className={`${s.card} ${s.buzz}`}>
      <span className={s.eyebrow}>Nećete čuti od nas</span>
      <p className={s.buzzWord} key={NECE_SE_CUTI[i]}>
        {NECE_SE_CUTI[i]}
      </p>
      <span className={s.smallNote}>Ni na jednom sastanku.</span>
    </article>
  );
}

function ClockCard() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const read = () => {
      const p = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Belgrade",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const g = (t) => p.find((x) => x.type === t)?.value ?? "";
      setNow({ hh: g("hour"), mm: g("minute"), h: Number(g("hour")) });
    };
    read();
    const id = setInterval(read, 15_000);
    return () => clearInterval(id);
  }, []);

  const line =
    now == null
      ? ""
      : now.h < 8
        ? "Prerano. Kampanje ipak rade."
        : now.h < 17
          ? "Radimo. Javite se."
          : now.h < 22
            ? "Još gledamo izveštaje."
            : "Spavamo. Google Ads ne.";

  return (
    <article className={`${s.card} ${s.clock}`}>
      <span className={s.eyebrow}>Srbija · GMT+2</span>
      <p className={s.clockTime} suppressHydrationWarning>
        {now ? `${now.hh}:${now.mm}` : "--:--"}
      </p>
      <span className={s.smallNote}>{line}</span>
    </article>
  );
}

/* ── page ────────────────────────────────────────────────── */

export default function DijagnozaGrid({ clients = [], articles = [] }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const [pick, setPick] = useState(null);
  useHorizontalScroll(trackRef, stageRef);

  const source = SOURCES.find((x) => x.id === pick) ?? null;
  const have = source?.have ?? [];
  const matched =
    (source && clients.find((c) => c.slug === source.match)) ??
    clients[0] ??
    null;
  const posts = articles.slice(0, 2);

  // Answering nudges the track along, so the answer visibly moves the page on.
  function choose(id) {
    setPick(id);
    const el = trackRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const target = el.querySelector("[data-scroll-anchor]");
      if (!target) return;
      const left = target.offsetLeft - 34;
      el.scrollTo({
        left,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });
  }

  return (
    <div
      className={s.stage}
      ref={stageRef}
      data-bento
      data-answered={source ? "" : undefined}
    >
      <div className={s.wash} aria-hidden />

      <header className={s.bar}>
        <Image
          src="/digitl-logo.png"
          alt="digitl"
          width={82}
          height={22}
          className={s.logo}
          priority
        />
        {source
          ? <button
              type="button"
              className={s.reset}
              onClick={() => setPick(null)}
            >
              Počnite ispočetka
            </button>
          : <span className={s.hint}>
              Odgovorite, pa prevucite
              <span className={s.hintArrow} aria-hidden>
                <ArrowIcon size={13} />
              </span>
            </span>}
      </header>

      <div className={s.track} ref={trackRef}>
        {/* 01 — the question replaces the headline */}
        <Chapter n="01" title="Pitanje" width="420px">
          <article className={`${s.card} ${s.question}`}>
            <p className={s.kicker}>Marketing koji donosi prave rezultate.</p>
            <h1 className={s.questionTitle}>
              Odakle vam danas stižu klijenti?
            </h1>
            <div className={s.options}>
              {SOURCES.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`${s.option} ${pick === o.id ? s.optionOn : ""}`}
                  onClick={() => choose(o.id)}
                  aria-pressed={pick === o.id}
                >
                  <span className={s.optionLabel}>{o.label}</span>
                  <span className={s.optionSub}>{o.sub}</span>
                </button>
              ))}
            </div>
          </article>
        </Chapter>

        {/* 02 — the services, as a system that reacts */}
        <Chapter n="02" title="Vaš sistem" width="700px">
          <article className={`${s.card} ${s.diagramCard}`} data-scroll-anchor>
            <SystemDiagram have={have} answered={Boolean(source)} />
            <p className={s.diagramNote}>
              {source
                ? "Puna linija je ono što već radi kod vas. Isprekidana je ono što nedostaje da sistem bude zatvoren."
                : "Pet kanala, jedan sistem. Odgovorite levo i popuniće se prema vama."}
            </p>
          </article>
          <div className={s.roleRow}>
            {CHANNELS.map(([id, label, role]) => (
              <span
                key={id}
                className={`${s.role} ${source && !have.includes(id) ? s.roleGap : ""}`}
              >
                <span className={s.roleTitle}>{label}</span>
                <span className={s.roleNote}>{role}</span>
              </span>
            ))}
          </div>
        </Chapter>

        {/* 03 — the gap, named */}
        <Chapter n="03" title="Gde je rupa" width="330px">
          <article className={`${s.card} ${s.gap}`}>
            {source
              ? <>
                  <span className={s.eyebrowLight}>Vaš slučaj</span>
                  <p className={s.gapTitle}>{source.gapTitle}</p>
                  <p className={s.gapBody}>{source.gap}</p>
                </>
              : <>
                  <span className={s.eyebrowLight}>Čeka odgovor</span>
                  <p className={s.gapTitle}>
                    Svaki izvor klijenata ima svoju rupu.
                  </p>
                  <p className={s.gapBody}>
                    Recite nam odakle vam stižu i reći ćemo koja je vaša.
                  </p>
                </>}
          </article>
        </Chapter>

        {/* 04 — the matching case study, not all of them */}
        <Chapter n="04" title="Neko je već bio tu" width="380px">
          {matched
            ? <a href={matched.href} className={`${s.card} ${s.proof}`}>
                <span className={s.proofClient}>{matched.clientName}</span>
                <span className={s.proofCat}>{matched.category}</span>
                <p className={s.proofBefore}>{matched.before}</p>
                <span className={s.proofRule} aria-hidden />
                <span className={s.metricRow}>
                  {matched.after.map((m) => (
                    <span key={m.label} className={s.metric}>
                      <span className={s.metricValue}>{m.value}</span>
                      <span className={s.metricLabel}>{m.label}</span>
                    </span>
                  ))}
                </span>
                <span className={s.proofArrow}>
                  <ArrowIcon size={13} />
                </span>
              </a>
            : null}
          <a href="/projects" className={`${s.card} ${s.allLink}`}>
            Svi projekti
            <span className={s.round}>
              <ArrowIcon />
            </span>
          </a>
        </Chapter>

        {/* 05 — the objection, where it actually lands */}
        <Chapter n="05" title="Pomislićete" width="300px">
          <article className={`${s.card} ${s.objection}`}>
            <p className={s.objQ}>
              {source
                ? `„${source.objection[0]}"`
                : "„Radi nam i ovako, zašto bih menjao?“"}
            </p>
            <p className={s.objA}>
              {source
                ? source.objection[1]
                : "Odgovor zavisi od toga odakle vam klijenti stižu. Odgovorite na prvo pitanje."}
            </p>
          </article>
        </Chapter>

        {/* 06 — what happens next */}
        <Chapter n="06" title="Kako radimo" width="320px">
          <article className={`${s.card} ${s.process}`}>
            <ol className={s.stepList}>
              {STEPS.map(([title, note], i) => (
                <li key={title} className={s.stepItem}>
                  <span className={s.stepNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className={s.stepTitle}>{title}</span>
                    <span className={s.stepNote}>
                      {i === 0 && source
                        ? `Počinjemo od toga zašto ${source.label.toLowerCase()} više ne nosi sama.`
                        : note}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </article>
        </Chapter>

        {/* 07 — the human bit */}
        <Chapter n="07" title="Sitnice" width="470px">
          <div className={s.funGrid}>
            <AskCard />
            <ClockCard />
            <BuzzCard />
          </div>
        </Chapter>

        {/* 08 — writing */}
        <Chapter n="08" title="Blog" width="290px">
          <div className={s.postCol}>
            {posts.map((a) => (
              <a
                key={a.slug}
                href={`/journal/${a.slug}`}
                className={`${s.card} ${s.post}`}
              >
                <span className={s.postTitle}>{a.title}</span>
                <span className={s.postFoot}>
                  <span className={s.smallNote}>
                    {formatDate(a.publishedAt)}
                  </span>
                  <span className={s.round}>
                    <ArrowIcon />
                  </span>
                </span>
              </a>
            ))}
            <a href="/journal" className={`${s.card} ${s.allLink}`}>
              Svi tekstovi
              <span className={s.round}>
                <ArrowIcon />
              </span>
            </a>
          </div>
        </Chapter>

        {/* 09 — the enquiry, already half written */}
        <Chapter n="09" title="Kontakt" width="360px">
          <ContactCard prefill={source?.prefill ?? ""} />
        </Chapter>
      </div>
    </div>
  );
}

function ContactCard({ prefill }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [state, setState] = useState("idle");

  // Their answer writes the first line for them, until they type over it.
  useEffect(() => {
    if (!touched) setMessage(prefill ? `${prefill} ` : "");
  }, [prefill, touched]);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setState("invalid");
    if (!message.trim()) return setState("empty");
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: email, message }),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) {
        setEmail("");
        setMessage("");
        setTouched(false);
      }
    } catch {
      setState("error");
    }
  }

  const note = {
    idle: "Odgovaramo u roku od jednog radnog dana.",
    invalid: "Ta adresa ne izgleda ispravno.",
    empty: "Napišite nešto. Bilo šta.",
    sending: "Šaljemo…",
    done: "Primljeno. Javljamo se uskoro.",
    error: "Nije poslato. Pokušajte ponovo za minut.",
  }[state];

  return (
    <article className={`${s.card} ${s.contact}`} id="kontakt">
      <span className={s.eyebrowLight}>Vaš red</span>
      <p className={s.contactTitle}>
        {prefill ? "Nastavite rečenicu." : "Gde ste vi sada?"}
      </p>
      <form className={s.contactForm} onSubmit={submit}>
        <input
          className={s.field}
          type="email"
          placeholder="vas@email.com"
          aria-label="Email adresa"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
        />
        <textarea
          className={s.field}
          rows={3}
          placeholder="Na čemu radite?"
          aria-label="Poruka"
          value={message}
          onChange={(e) => {
            setTouched(true);
            setMessage(e.target.value);
            setState("idle");
          }}
        />
        <button className={s.send} type="submit" disabled={state === "sending"}>
          Pošaljite
          <span className={s.sendIcon}>
            <ArrowIcon />
          </span>
        </button>
      </form>
      <p
        className={`${s.note} ${["invalid", "empty", "error"].includes(state) ? s.noteError : ""}`}
      >
        {note}
      </p>
      <div className={s.direct}>
        <a href={`mailto:${CONTACT.email}`}>
          <MailIcon />
          {CONTACT.email}
        </a>
        <a href={`tel:${CONTACT.tel}`}>
          <PhoneIcon />
          {CONTACT.phone}
        </a>
      </div>
    </article>
  );
}
