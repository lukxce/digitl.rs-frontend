"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE, useVisible } from "../v5/ui";
import d from "./device.module.css";

/* Reads only what the browser already exposes. Nothing is stored or sent. */

function browserName() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "pregledač";
}

function detectAdblock() {
  return new Promise((resolve) => {
    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner pub_300x250 text-ad";
    bait.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:300px;height:250px;";
    document.body.appendChild(bait);
    setTimeout(() => {
      const blocked =
        bait.offsetHeight === 0 || getComputedStyle(bait).display === "none";
      bait.remove();
      resolve(blocked);
    }, 150);
  });
}

function read() {
  const c = navigator.connection || {};
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return {
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: Math.round((window.devicePixelRatio || 1) * 10) / 10,
    touch,
    phone: touch && window.innerWidth < 760,
    net: c.effectiveType || null,
    down: typeof c.downlink === "number" ? c.downlink : null,
    save: Boolean(c.saveData),
    dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    lang: navigator.language || "",
    time: now.toLocaleTimeString("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    after: hour >= 18 || hour < 8 || day === 0 || day === 6,
    browser: browserName(),
  };
}

function facts(x, adblock) {
  return [
    [
      "Ekran",
      `${x.w} × ${x.h}${x.dpr > 1 ? ` · oštrina ${String(x.dpr).replace(".", ",")}×` : ""}`,
    ],
    [
      "Uređaj",
      x.phone
        ? "telefon, prstom"
        : x.touch
          ? "tablet ili ekran na dodir"
          : "računar, mišem",
    ],
    ["Pregledač", x.browser],
    [
      "Mreža",
      x.net
        ? `${x.net.toUpperCase()}${x.down ? `, oko ${String(x.down).replace(".", ",")} Mb/s` : ""}${x.save ? ", štednja podataka" : ""}`
        : "nepoznata",
    ],
    [
      "Blokator oglasa",
      adblock == null ? "proveravam…" : adblock ? "uključen" : "nije uključen",
    ],
    ["Tema", x.dark ? "tamna" : "svetla"],
    ["Vreme", `${x.time} · ${x.tz}`],
  ];
}

function insights(x, adblock) {
  const out = [];
  if (x.phone)
    out.push(
      "Gledate sa telefona. Sajtove pravimo prvo za ovaj ekran, pa tek onda za računar.",
    );
  else
    out.push(
      "Gledate sa računara, ali većina vaših kupaca vas verovatno prvi put vidi sa telefona. Zato tamo počinjemo.",
    );
  if (adblock)
    out.push(
      "Imate blokator oglasa, pa vam deo oglasa nikad ne stigne. Zato rast ne oslanjamo samo na oglase: SEO i sajt rade i kad su oglasi blokirani.",
    );
  if (
    x.save ||
    x.net === "2g" ||
    x.net === "3g" ||
    (x.down != null && x.down < 2)
  )
    out.push(
      "Vaša veza je sporija. Na ovakvoj mreži spor sajt izgubi posetioca pre nego što se uopšte učita.",
    );
  if (x.after)
    out.push(
      "Sada je van radnog vremena. Ljudi traže usluge i uveče i vikendom, a tada je sajt jedini koji im odgovara.",
    );
  return out.slice(0, 3);
}

export default function Device() {
  const ref = useRef(null);
  const visible = useVisible(ref, 0.3);
  const [x, setX] = useState(null);
  const [adblock, setAdblock] = useState(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!visible || x) return;
    setX(read());
    detectAdblock().then(setAdblock);
  }, [visible, x]);

  const list = x ? facts(x, adblock) : [];
  useEffect(() => {
    if (!x || shown >= list.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), 260);
    return () => clearTimeout(t);
  }, [x, shown, list.length]);

  const done = x && shown >= list.length && adblock != null;

  return (
    <div ref={ref} className={d.wrap}>
      <div className={d.dossier}>
        <div className={d.top}>
          <span className={d.dot} />
          <span>Šta vaš pregledač zna o vama</span>
          <em>samo na ovom uređaju</em>
        </div>
        <dl className={d.facts}>
          {list.slice(0, shown).map(([k, v]) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <dt>{k}</dt>
              <dd>{v}</dd>
            </motion.div>
          ))}
          {x && shown < list.length ? <span className={d.cursor} /> : null}
        </dl>
      </div>

      <div className={d.read}>
        <span className={d.label}>Šta to znači za vaš sajt</span>
        <AnimatePresence>
          {done
            ? insights(x, adblock).map((t, i) => (
                <motion.p
                  key={t}
                  className={d.insight}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.5, ease: EASE }}
                >
                  {t}
                </motion.p>
              ))
            : <p className={d.wait}>Čitam…</p>}
        </AnimatePresence>
        <p className={d.note}>
          Ništa od ovoga ne čuvamo i ne šaljemo. Sve se pročita i ostaje u vašem
          pregledaču.
        </p>
      </div>
    </div>
  );
}
