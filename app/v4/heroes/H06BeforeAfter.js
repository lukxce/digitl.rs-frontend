"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeroCopy from "../HeroCopy";
import s from "./h06.module.css";

/* 06 · Pre i posle: one browser window, two sites. Left of the handle a
   typical dated small-business site (an illustration, drawn in CSS); right
   of it a site we built, from the client's real cover. Drag the handle (mouse
   or finger), click anywhere to jump, or use the arrow keys. */

const isSpeed = (m) => /pagespeed/i.test(String(m?.label ?? ""));

/** The "Posle" site. The score ring must be the client's own PageSpeed
    result, never a made-up one, so: ThermiQ if it has a real score, else any
    client with a real score, else ThermiQ, else the first with a cover. */
function pickClient(clients) {
  const withCover = (clients ?? []).filter((c) => c?.cover);
  const thermiq = (c) => /thermiq/i.test(c.slug ?? "");
  const scored = (c) => (c.metrics ?? []).some(isSpeed);
  return (
    withCover.find((c) => thermiq(c) && scored(c)) ??
    withCover.find(scored) ??
    withCover.find(thermiq) ??
    withCover[0] ??
    null
  );
}

/* The covers are 3200×1800 mockups (a laptop and a phone on a coloured
   ground). Cropped to the laptop's screen they read as the live site inside
   our browser window; a cover of any other shape is used whole. */
const SCREEN = [960, 282, 1772, 1180];
function screenSrc(cover, w) {
  const base = String(cover).split("?")[0];
  const m = base.match(/-(\d+)x(\d+)\.\w+$/);
  if (!m) return null;
  const W = Number(m[1]);
  const H = Number(m[2]);
  if (Math.abs(W / H - 16 / 9) > 0.01) return null;
  const k = W / 3200;
  const rect = SCREEN.map((v) => Math.round(v * k)).join(",");
  return `${base}?rect=${rect}&w=${w}&fm=webp&q=82`;
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function Ring({ value, tone }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const n = Number(String(value).replace(",", "."));
  const frac = Number.isFinite(n) ? clamp(n / 100, 0, 1) : 1;
  return (
    <span
      className={s.ring}
      data-tone={tone}
      style={{ "--c": c.toFixed(2), "--f": frac }}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <circle className={s.ringTrack} cx="20" cy="20" r={r} />
        <circle
          className={s.ringFill}
          cx="20"
          cy="20"
          r={r}
          strokeDasharray={c.toFixed(2)}
        />
      </svg>
      <b>{value}</b>
    </span>
  );
}

function Chevrons() {
  return (
    <svg viewBox="0 0 28 16" width="26" height="15" aria-hidden="true">
      <path
        d="M8 3 3 8l5 5M20 3l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect
        x="3.2"
        y="7"
        width="9.6"
        height="6.8"
        rx="1.8"
        fill="currentColor"
      />
      <path
        d="M5.4 7V5.2a2.6 2.6 0 0 1 5.2 0V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        d="M8 2.2 14.4 13.4H1.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 6.4v3.2M8 11.4v.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M3 11.5 7 7.5l2.5 2.5L13.5 6M10 6h3.5v3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* A typical dated small-business site: Times, beige and grey, a table-like
   layout, underlined links, a visitor counter and a gallery that never loads. */
function OldSite() {
  return (
    <div className={s.old}>
      <div className={s.oldPage}>
        <div className={s.oldHead}>
          <span className={s.oldLogo}>
            VašaFirma <small>d.o.o.</small>
          </span>
          <span className={s.oldSlogan}>Kvalitet · Tradicija · Poverenje</span>
        </div>
        <div className={s.oldNav}>
          <u>Početna</u> | <u className={s.oldVisited}>O nama</u> |{" "}
          <u>Usluge</u> | <u>Galerija</u> | <u>Cenovnik</u> | <u>Kontakt</u>
        </div>
        <div className={s.oldBody}>
          <div className={s.oldSide}>
            <b>Meni</b>
            <span>» Usluge</span>
            <span>» Reference</span>
            <span>» Galerija</span>
            <span>» Kontakt</span>
            <b className={s.oldSideHead}>Linkovi</b>
            <span>» Vremenska prognoza</span>
            <span>» Red vožnje</span>
          </div>
          <div className={s.oldMain}>
            <span className={s.oldWelcome}>Dobrodošli na naš sajt</span>
            <span className={s.oldRule} />
            <span className={s.oldBanner}>
              <span className={s.oldPhoto} />
              <span className={s.oldCaption}>Naš poslovni prostor</span>
            </span>
            <span className={s.oldText}>
              Firma VašaFirma d.o.o. se bavi pružanjem usluga u Vašem gradu i
              okolini. Za sve informacije o našim uslugama i cenama pozovite nas
              telefonom ili nam pošaljite e-mail.
            </span>
            <span className={s.oldRow}>
              <span className={s.oldLoad}>
                <i className={s.oldSpin} />
                Učitavanje galerije...
              </span>
              <span className={s.oldCounter}>
                Posetilaca:
                <i>001234</i>
              </span>
              <span className={s.oldButton}>Pošaljite upit</span>
            </span>
            <span className={s.oldUpdated}>
              Poslednje ažuriranje: 14.03.2011.
            </span>
          </div>
        </div>
        <div className={s.oldFoot}>
          © 2009 VašaFirma d.o.o. | Tel: 011/123-456 | Sajt najbolje izgleda u
          rezoluciji 1024x768
        </div>
      </div>
    </div>
  );
}

/* Fallback for the "Posle" side when no client cover exists: a clean,
   clearly generic modern site. */
function FreshSite() {
  return (
    <div className={s.fresh}>
      <div className={s.freshNav}>
        <span className={s.freshLogo}>
          <i />
          vasafirma
        </span>
        <span className={s.freshLinks}>
          <i />
          <i />
          <i />
        </span>
        <span className={s.freshCta}>Pozovite</span>
      </div>
      <div className={s.freshHero}>
        <div>
          <span className={s.freshPill}>Primer</span>
          <span className={s.freshTitle}>Vaša usluga, jasno i brzo.</span>
          <span className={s.freshLine} />
          <span className={s.freshLine} data-short />
          <span className={s.freshBtn}>Zakažite</span>
        </div>
        <span className={s.freshArt} />
      </div>
    </div>
  );
}

export default function H06BeforeAfter({ clients }) {
  const heroRef = useRef(null);
  const viewRef = useRef(null);
  const handleRef = useRef(null);
  const pos = useRef(50);
  const tween = useRef(0);
  const drag = useRef(null);
  const touched = useRef(false);
  const oldWins = useRef(false);
  const [insecure, setInsecure] = useState(false);
  const [dragging, setDragging] = useState(false);

  const client = useMemo(() => pickClient(clients), [clients]);
  const speed = client?.metrics?.find(isSpeed) ?? null;
  const first = client?.metrics?.[0] ?? null;
  const shot = client ? screenSrc(client.cover, 1400) : null;
  const srcSet = client
    ? shot
      ? [900, 1400, 2000]
          .map((w) => `${screenSrc(client.cover, w)} ${w}w`)
          .join(", ")
      : undefined
    : undefined;

  const setPos = (p) => {
    const v = clamp(p, 0, 100);
    pos.current = v;
    viewRef.current?.style.setProperty("--pos", `${v.toFixed(2)}%`);
    handleRef.current?.setAttribute("aria-valuenow", String(Math.round(v)));
    const old = v > 55;
    if (old !== oldWins.current) {
      oldWins.current = old;
      setInsecure(old);
    }
  };

  /** Animate the handle through `stops` ([[to, ms], ...]). */
  const play = (stops, ease = easeInOut) => {
    cancelAnimationFrame(tween.current);
    let i = 0;
    let from = pos.current;
    let t0 = performance.now();
    const step = (now) => {
      const [to, ms] = stops[i];
      const k = clamp((now - t0) / ms, 0, 1);
      setPos(from + (to - from) * ease(k));
      if (k < 1) {
        tween.current = requestAnimationFrame(step);
      } else if (++i < stops.length) {
        from = to;
        t0 = now;
        tween.current = requestAnimationFrame(step);
      }
    };
    tween.current = requestAnimationFrame(step);
  };
  const stop = () => cancelAnimationFrame(tween.current);
  const touch = () => {
    touched.current = true;
    heroRef.current?.setAttribute("data-touched", "");
  };

  const pctAt = (clientX) => {
    const r = viewRef.current.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };

  /* First view: the rings fill and the handle sweeps once as a hint. Off
     screen, the loader and the knob's pulse stop. */
  // biome-ignore lint/correctness/useExhaustiveDependencies: play only touches refs; run once
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let hinted = false;
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        hero.dataset.run = e.isIntersecting ? "1" : "0";
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          hero.setAttribute("data-seen", "");
          if (!hinted && !reduce && !touched.current) {
            hinted = true;
            timer = window.setTimeout(() => {
              if (touched.current) return;
              play([
                [28, 900],
                [72, 1300],
                [50, 950],
              ]);
            }, 650);
          }
        }
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(tween.current);
    };
  }, []);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    stop();
    touch();
    drag.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      type: e.pointerType,
      live: e.pointerType === "mouse",
    };
    if (e.pointerType === "mouse") {
      e.preventDefault();
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDragging(true);
      play([[clamp(pctAt(e.clientX), 0, 100), 320]], (t) => 1 - (1 - t) ** 3);
    }
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.live) {
      // Touch: a mostly horizontal move takes the handle; vertical is the
      // page scrolling (touch-action: pan-y) and ends in pointercancel.
      const dx = Math.abs(e.clientX - d.x0);
      const dy = Math.abs(e.clientY - d.y0);
      if (dx < 6 || dx < dy) return;
      d.live = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDragging(true);
    }
    stop();
    setPos(pctAt(e.clientX));
  };
  const onPointerUp = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    if (!d.live) {
      // A tap jumps the handle there.
      play([[clamp(pctAt(e.clientX), 0, 100), 420]], (t) => 1 - (1 - t) ** 3);
    }
    drag.current = null;
    setDragging(false);
  };
  const onPointerCancel = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKeyDown = (e) => {
    const map = { ArrowLeft: -5, ArrowRight: 5, PageDown: -20, PageUp: 20 };
    let to = null;
    if (e.key in map) to = pos.current + map[e.key];
    if (e.key === "Home") to = 0;
    if (e.key === "End") to = 100;
    if (to === null) return;
    e.preventDefault();
    stop();
    touch();
    play([[clamp(to, 0, 100), 260]], (t) => 1 - (1 - t) ** 3);
  };

  const name = client?.name ?? null;
  const shotImg = client
    ? // eslint-disable-next-line @next/next/no-img-element
      <img
        className={s.shot}
        src={shot ?? client.cover}
        srcSet={srcSet}
        sizes="(max-width: 900px) 94vw, 1080px"
        alt={`Sajt koji smo napravili za ${client.name}`}
        draggable={false}
        decoding="async"
      />
    : null;

  return (
    <div ref={heroRef} className={s.hero}>
      <HeroCopy align="center" />

      <figure className={s.stage}>
        <div className={s.browser}>
          <div className={s.bar}>
            <span className={s.dots} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className={s.url} data-insecure={insecure || undefined}>
              {insecure ? <WarnIcon /> : <LockIcon />}
              <span className={s.urlWarn}>Nije bezbedno</span>
              <span className={s.urlText}>vasafirma.rs</span>
            </span>
            <span className={s.barEnd} aria-hidden="true">
              <i />
              <i />
            </span>
          </div>

          <div
            ref={viewRef}
            className={s.view}
            data-h06-view
            data-dragging={dragging || undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            <div className={s.after}>
              {client ? shotImg : <FreshSite />}
              <span className={`${s.tag} ${s.tagPost}`}>
                <i />
                Posle
              </span>
              <span className={`${s.score} ${s.scorePost}`}>
                {speed || !client
                  ? <Ring value={speed ? speed.value : "100"} tone="good" />
                  : <span className={s.scoreIcon}>
                      <TrendIcon />
                    </span>}
                <span className={s.scoreText}>
                  <b>
                    {name
                      ? <>
                          <span className={s.wide}>Sajt: </span>
                          {name}
                        </>
                      : "Primer novog sajta"}
                  </b>
                  {client && !speed && first
                    ? <span>
                        {first.value} {first.label}
                      </span>
                    : <span>
                        PageSpeed<span className={s.wide}>, mobilni</span>
                      </span>}
                </span>
              </span>
            </div>

            <div className={s.before} aria-hidden="true">
              <OldSite />
              <span className={`${s.tag} ${s.tagPre}`}>
                <i />
                Pre
              </span>
              <span className={`${s.score} ${s.scorePre}`}>
                <Ring value="31" tone="bad" />
                <span className={s.scoreText}>
                  <b>
                    <span className={s.wide}>Tipičan stari sajt</span>
                    <span className={s.narrow}>Stari sajt</span>
                  </b>
                  <span>
                    PageSpeed<span className={s.wide}>, mobilni</span>
                  </span>
                </span>
              </span>
            </div>

            <div
              ref={handleRef}
              className={s.handle}
              role="slider"
              tabIndex={0}
              aria-label="Pre i posle: pomerite ručicu"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={50}
              aria-valuetext="Pre levo, posle desno"
              onKeyDown={onKeyDown}
            >
              <span className={s.knob}>
                <Chevrons />
              </span>
            </div>
          </div>
        </div>

        <figcaption className={s.caption}>
          Levo: tipičan stari sajt (ilustracija). Desno:{" "}
          {name
            ? <>
                sajt koji smo napravili za <b>{name}</b>.
              </>
            : "primer novog sajta (ilustracija)."}
        </figcaption>
      </figure>
    </div>
  );
}
