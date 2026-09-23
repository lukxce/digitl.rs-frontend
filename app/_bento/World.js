"use client";

import { useEffect, useRef } from "react";
import WORLD_DOTS from "./worldDots";

/** The studio's two bases; either can be beaconed on the globe. */
export const CITIES = {
  belgrade: [20.45, 44.79],
  london: [-0.1276, 51.5074],
};
/** Countries with ads run in them, matched per dot rather than by region box. */
export const MARKET_CODES = new Set([
  // Europe
  "ALB",
  "AUT",
  "BEL",
  "BIH",
  "BGR",
  "HRV",
  "CZE",
  "DNK",
  "EST",
  "FIN",
  "FRA",
  "DEU",
  "GRC",
  "HUN",
  "IRL",
  "ITA",
  "LVA",
  "LTU",
  "MDA",
  "MNE",
  "NLD",
  "MKD",
  "NOR",
  "POL",
  "PRT",
  "ROU",
  "SRB",
  "SVK",
  "SVN",
  "ESP",
  "SWE",
  "CHE",
  "UKR",
  "GBR",
  // North Africa
  "MAR",
  "DZA",
  "TUN",
  "LBY",
  "EGY",
  // Middle East
  "TUR",
  "ISR",
  "JOR",
  "LBN",
  "SAU",
  "ARE",
  "QAT",
  "KWT",
  "BHR",
  "OMN",
  // Caucasus
  "ARM",
  "AZE",
  "GEO",
  // Asia
  "IND",
  "CHN",
  "JPN",
  "KOR",
  "IDN",
  "PHL",
  "VNM",
  "THA",
  "MYS",
  "SGP",
  // Americas
  "USA",
  "CAN",
  "BRA",
  "CHL",
  "PER",
  // Rest
  "NGA",
  "AUS",
]);

export const MARKETS_COUNT = MARKET_CODES.size;
const TILT = (18 * Math.PI) / 180;
const LAT_TOP = 80;
const LAT_BOTTOM = -58;

function readColors(el) {
  const cs = getComputedStyle(el);
  return {
    dot: cs.getPropertyValue("--dot").trim() || "rgba(23,23,23,.34)",
    accent: cs.getPropertyValue("--blue").trim() || "#2a29ff",
    pin: cs.getPropertyValue("--lime").trim() || "#9adf2a",
    line: cs.getPropertyValue("--line").trim() || "#eaeaea",
  };
}

/**
 * Real land geometry (Natural Earth 110m) drawn as dots — either an
 * orthographic globe that spins, or a flat equirectangular map.
 */
export default function World({
  mode = "globe",
  highlight = false,
  pins = [CITIES.belgrade],
  className,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let raf = 0;
    let lambda = mode === "globe" ? -0.4 : 0;
    let last = performance.now();
    let colors = readColors(canvas);
    let sinceColorRead = 0;

    // Belgrade: solid lime dot, soft halo, and a ring that breathes outward.
    const drawBeacon = (pin, radius) => {
      if (!pin) return;
      const t = (performance.now() % 2200) / 2200;
      ctx.fillStyle = colors.pin;
      ctx.strokeStyle = colors.pin;

      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, radius * 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 0.75 * (1 - t);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, radius + t * radius * 3.4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawGlobe = (w, h) => {
      const r = Math.min(w, h) / 2 - 2;
      const cx = w / 2;
      const cy = h / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.stroke();

      const project = (lon, lat) => {
        const l = (lon * Math.PI) / 180 - lambda;
        const p = (lat * Math.PI) / 180;
        const cosc =
          Math.sin(TILT) * Math.sin(p) +
          Math.cos(TILT) * Math.cos(p) * Math.cos(l);
        if (cosc <= 0) return null;
        return {
          x: cx + r * Math.cos(p) * Math.sin(l),
          y:
            cy -
            r *
              (Math.cos(TILT) * Math.sin(p) -
                Math.sin(TILT) * Math.cos(p) * Math.cos(l)),
          depth: cosc,
        };
      };

      ctx.fillStyle = colors.dot;
      for (const [lon, lat] of WORLD_DOTS) {
        const p = project(lon, lat);
        if (!p) continue;
        ctx.globalAlpha = Math.min(1, p.depth * 1.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const [lon, lat] of pins) {
        const pin = project(lon, lat);
        if (pin) drawBeacon(pin, 4.5);
      }
    };

    const drawFlat = (w, h) => {
      // Fit the map at its true aspect and centre it, so it never stretches.
      const aspect = 360 / (LAT_TOP - LAT_BOTTOM);
      const mapW = Math.min(w, h * aspect);
      const mapH = mapW / aspect;
      const offX = (w - mapW) / 2;
      const offY = (h - mapH) / 2;
      const project = (lon, lat) => ({
        x: offX + ((lon + 180) / 360) * mapW,
        y: offY + ((LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM)) * mapH,
      });

      for (const [lon, lat, code] of WORLD_DOTS) {
        const p = project(lon, lat);
        const hot = highlight && MARKET_CODES.has(code);
        ctx.fillStyle = hot ? colors.accent : colors.dot;
        ctx.globalAlpha = hot ? 1 : 0.32;
        ctx.beginPath();
        ctx.arc(p.x, p.y, hot ? 1.9 : 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const [lon, lat] of pins) drawBeacon(project(lon, lat), 5.5);
    };

    const frame = (now) => {
      const dt = now - last;
      last = now;
      sinceColorRead += dt;
      if (sinceColorRead > 600) {
        colors = readColors(canvas);
        sinceColorRead = 0;
      }

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (mode === "globe") {
        if (!reduce) lambda += dt * 0.00016;
        drawGlobe(w, h);
      } else {
        drawFlat(w, h);
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [mode, highlight, pins]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
