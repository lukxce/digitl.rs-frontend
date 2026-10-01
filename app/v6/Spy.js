"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { EASE } from "../v5/ui";
import { ArrowUpRight, Search } from "../v5/icons";
import y from "./spy.module.css";

/* Opens the competitor's live ads in the two public libraries: Meta's Ad
   Library (searched by name, Serbia) and Google's Ads Transparency Center
   (searched by domain). Nothing is fetched by us. */

function domainOf(s) {
  const raw = s.trim().toLowerCase();
  if (!raw) return "";
  try {
    return new URL(
      /^https?:\/\//.test(raw) ? raw : `https://${raw}`,
    ).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function Spy() {
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const domain = domainOf(site);
  const meta = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=RS&q=${encodeURIComponent(name.trim())}&search_type=keyword_unordered`;
  const google = `https://adstransparency.google.com/?region=RS&domain=${encodeURIComponent(domain)}`;

  return (
    <div className={y.wrap}>
      <div className={y.form}>
        <label>
          <span>Ime konkurenta</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="npr. Firma doo"
          />
        </label>
        <label>
          <span>
            Sajt konkurenta <em>(za Google)</em>
          </span>
          <input
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="firma.rs"
            inputMode="url"
          />
        </label>
        <div className={y.links}>
          <a
            className={y.btn}
            data-on={name.trim() ? "true" : undefined}
            href={name.trim() ? meta : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!name.trim()}
          >
            <i>M</i> Oglasi na Meti <ArrowUpRight size={15} />
          </a>
          <a
            className={y.btn}
            data-on={domain ? "true" : undefined}
            href={domain ? google : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!domain}
          >
            <i data-g="true">G</i> Oglasi na Google-u <ArrowUpRight size={15} />
          </a>
        </div>
        <p className={y.note}>
          Otvara javne biblioteke oglasa koje Meta i Google sami objavljuju. Mi
          ništa ne preuzimamo.
        </p>
      </div>

      <div className={y.preview} aria-hidden="true">
        <span className={y.glass}>
          <Search size={18} />
          {name.trim() || "konkurent"}
        </span>
        <div className={y.ads}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className={y.ad}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3 + (i % 3) * 0.6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              <i />
              <b />
              <s />
              <s />
              <em>Aktivan oglas</em>
            </motion.span>
          ))}
        </div>
        <motion.span
          className={y.lens}
          animate={{ x: [0, 120, 40, 180, 0], y: [0, 40, 110, 70, 0] }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: EASE,
          }}
        />
        <span className={y.honest}>
          Ilustracija. Pravi oglasi se otvaraju u biblioteci.
        </span>
      </div>
    </div>
  );
}
