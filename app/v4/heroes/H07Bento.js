"use client";

import { useEffect, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h07.module.css";

/* 07 · Bento uživo. The services as a bento of small live widgets, in the
   colours of the bento homepage. A tile leans toward the cursor and runs
   faster while you are on it; a click turns it over to say in one line
   what the service does. Everything shown is illustrative (vasafirma.rs),
   never a client's numbers. */

const Turn = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v4.5h-4.5" />
  </svg>
);

const Heart = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.4-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.7-7.5 10.1-7.5 10.1Z" />
  </svg>
);

/* a) paid ads: two sources feed small dots into one inbox */
function Ads() {
  const dots = [
    ["g", "0s"],
    ["m", "-0.7s"],
    ["g", "-1.4s"],
    ["m", "-2.1s"],
  ];
  return (
    <div className={s.adsW}>
      <div className={s.srcs}>
        <span className={s.src}>
          <i className={s.gMark}>G</i>
          Google
        </span>
        <span className={s.src}>
          <i className={s.mMark}>M</i>
          Meta
        </span>
      </div>
      <div className={s.flow}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0 25 C42 25 58 50 100 50" />
          <path d="M0 75 C42 75 58 50 100 50" />
        </svg>
        {dots.map(([from, d]) => (
          <span key={d} className={s.dx} style={{ "--d": d }}>
            <span className={`${s.dy} ${from === "m" ? s.fromM : ""}`}>
              <i />
            </span>
          </span>
        ))}
      </div>
      <div className={s.inboxBox}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3.5 13.5 6 5.5h12l2.5 8M3.5 13.5V18a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-4.5M3.5 13.5h5l1 2h5l1-2h5" />
        </svg>
        <b>Upiti</b>
      </div>
    </div>
  );
}

/* b) SEO: the rank rolls from 9 to 1 while the result climbs the list */
function Seo() {
  return (
    <div className={s.seoW}>
      <p className={s.rankBox}>
        <span className={s.hash}>#</span>
        <span className={s.reel}>
          <span className={s.reelIn}>
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((d) => (
              <b key={d}>{d}</b>
            ))}
          </span>
        </span>
      </p>
      <p className={s.rankLabel}>Pozicija na pretrazi</p>
      <p className={s.query}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
        servis klima Niš
      </p>
      <ol className={s.serp}>
        <li className={s.r1}>
          <i />
          <b />
        </li>
        <li className={s.r2}>
          <i />
          <b />
        </li>
        <li className={s.r3}>
          <i />
          <b />
        </li>
        <li className={s.rMe}>
          <i />
          <span>vasafirma.rs</span>
        </li>
      </ol>
    </div>
  );
}

/* c) web: a page assembles itself, then the speed score fills to 100 */
function Web() {
  return (
    <div className={s.webW}>
      <div className={s.browser}>
        <p className={s.bBar}>
          <i />
          <i />
          <i />
          <span>vasafirma.rs</span>
        </p>
        <div className={s.bBody}>
          <i className={`${s.blk} ${s.bNav}`} style={{ "--d": "0s" }} />
          <span className={`${s.blk} ${s.bHero}`} style={{ "--d": "0.2s" }}>
            <i />
            <i />
            <em />
          </span>
          <span className={`${s.blk} ${s.bCards}`} style={{ "--d": "0.45s" }}>
            <i />
            <i />
            <i />
          </span>
          <i className={`${s.blk} ${s.bLine}`} style={{ "--d": "0.65s" }} />
        </div>
      </div>
      <div className={s.score}>
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle className={s.scoreBg} cx="32" cy="32" r="26" />
          <circle
            className={s.scoreFg}
            cx="32"
            cy="32"
            r="26"
            pathLength="100"
          />
        </svg>
        <b />
      </div>
    </div>
  );
}

/* d) social: a grid of posts fills in, one gets a heart */
function Social() {
  return (
    <div className={s.socW}>
      <div className={s.posts}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <i key={i} style={{ "--i": i }} />
        ))}
        <span className={s.heart}>
          <Heart />
        </span>
      </div>
    </div>
  );
}

/* e) brand: one typeface through its weights, three colours */
function Brand() {
  return (
    <div className={s.brandW}>
      <p className={s.aa}>Aa</p>
      <p className={s.brandFoot}>
        <span>Manrope</span>
        <span className={s.swatches}>
          <i />
          <i />
          <i />
        </span>
      </p>
    </div>
  );
}

/* f) leads: messages arrive and stack up */
function Leads() {
  return (
    <ul className={s.leadList}>
      <li className={s.l1}>
        <i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17M12 3.5c2.4 2.4 3.4 5.2 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.2-3.4-8.5s1-6.1 3.4-8.5Z" />
          </svg>
        </i>
        <span>
          <b>Novi upit sa sajta</b>
          <small>Kontakt forma</small>
        </span>
        <em>sada</em>
      </li>
      <li className={s.l2}>
        <i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.6 3.5h2.6l1.4 4.3-2 1.5a12 12 0 0 0 6.1 6.1l1.5-2 4.3 1.4v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
          </svg>
        </i>
        <span>
          <b>Poziv iz oglasa</b>
          <small>Google oglasi</small>
        </span>
        <em>sada</em>
      </li>
      <li className={s.l3}>
        <i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </i>
        <span>
          <b>Poruka sa Instagrama</b>
          <small>Direktna poruka</small>
        </span>
        <em>sada</em>
      </li>
    </ul>
  );
}

const TILES = [
  {
    id: "ads",
    title: "Plaćeno oglašavanje",
    text: "Google i Meta oglasi podešeni da donose upite, ne samo klikove.",
    W: Ads,
  },
  {
    id: "seo",
    title: "SEO",
    text: "Stranice koje Google razume i koje kupci nađu kad traže vašu uslugu.",
    W: Seo,
  },
  {
    id: "web",
    title: "Web",
    text: "Brz sajt koji posetu pretvara u upit ili porudžbinu.",
    W: Web,
  },
  {
    id: "social",
    title: "Društvene mreže",
    text: "Objave i kampanje koje grade poverenje pre prvog poziva.",
    W: Social,
  },
  {
    id: "brand",
    title: "Brend",
    text: "Ime, boje i glas koji se pamte i isti su na svakom kanalu.",
    W: Brand,
  },
  {
    id: "leads",
    title: "Upiti",
    text: "Svi upiti na jednom mestu, sa izvorom, da znate šta se isplati.",
    W: Leads,
  },
];

const TILT = 8;

function Tile({ id, title, text, W }) {
  const [flipped, setFlipped] = useState(false);
  const tile = useRef(null);
  const tilt = useRef(null);
  const frontBtn = useRef(null);
  const backBtn = useRef(null);

  // hover runs the widget faster; the rate change keeps each loop's place
  const rate = (r) => {
    for (const a of tile.current?.getAnimations({ subtree: true }) ?? []) {
      if (a.animationName) a.updatePlaybackRate(r);
    }
  };
  const onEnter = (e) => {
    if (e.pointerType === "mouse") rate(2.4);
  };
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = tile.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const el = tilt.current;
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * TILT).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 2 * TILT).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = (e) => {
    if (e.pointerType !== "mouse") return;
    rate(1);
    const el = tilt.current;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  const flip = (to) => {
    const hadFocus = tile.current.contains(document.activeElement);
    setFlipped(to);
    // the face that turns away is hidden half way, so hand focus over
    if (hadFocus)
      setTimeout(
        () => (to ? backBtn : frontBtn).current?.focus({ preventScroll: true }),
        420,
      );
  };

  return (
    <div
      ref={tile}
      className={`${s.tile} ${s[id]}`}
      data-tile
      data-flipped={flipped || undefined}
      onPointerEnter={onEnter}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div ref={tilt} className={s.tilt}>
        <div className={s.card}>
          <div className={`${s.face} ${s.front}`}>
            <p className={s.tTitle}>{title}</p>
            <span className={s.turn}>
              <Turn />
            </span>
            <div className={s.widget} aria-hidden="true">
              <W />
            </div>
            <i className={s.glare} />
            <button
              ref={frontBtn}
              type="button"
              className={s.hit}
              aria-label={`${title}: okrenite karticu`}
              onClick={() => flip(true)}
            />
          </div>
          <button
            ref={backBtn}
            type="button"
            className={`${s.face} ${s.back}`}
            onClick={() => flip(false)}
          >
            <span className={s.backTitle}>{title}</span>
            <span className={s.backText}>{text}</span>
            <span className={s.backLink}>
              <Turn />
              Okrenite
            </span>
            <i className={s.glare} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function H07Bento() {
  const hero = useRef(null);

  // loops run only while the hero is on screen
  useEffect(() => {
    const el = hero.current;
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute("data-paused", !e.isIntersecting),
      { threshold: 0.02 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hero} className={s.hero} data-paused>
      <HeroCopy align="left" className={s.copy} />
      <div className={s.bento}>
        {TILES.map((t) => (
          <Tile key={t.id} {...t} />
        ))}
      </div>
    </div>
  );
}
