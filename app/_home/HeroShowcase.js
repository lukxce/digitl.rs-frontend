"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AdsCard from "./heroCards/AdsCard";
import BrandCard from "./heroCards/BrandCard";
import SocialCard from "./heroCards/SocialCard";
import WebCard from "./heroCards/WebCard";
import s from "./heroShowcase.module.css";
import SearchClimb from "./SearchClimb";
import { EASE } from "./ui";

/* The hero's right side: one of our services, shown working. A row of pills
   above the card picks the service; on load a random one is picked (after
   mount, so the server and the browser render the same thing first). */

export const CARDS = [
  { id: "seo", name: "SEO", Card: SearchClimb },
  { id: "ads", name: "Oglasi", Card: AdsCard },
  { id: "social", name: "Mreže", Card: SocialCard },
  { id: "web", name: "Sajt", Card: WebCard },
  { id: "brand", name: "Brend", Card: BrandCard },
];

export default function HeroShowcase() {
  const [pick, setPick] = useState(null);

  useEffect(() => {
    setPick(CARDS[Math.floor(Math.random() * CARDS.length)].id);
  }, []);

  const cur = CARDS.find((c) => c.id === pick);
  return (
    <div className={s.slot}>
      <div className={s.pills} role="tablist" aria-label="Usluga">
        {CARDS.map((c) => {
          const on = c.id === pick;
          return (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={on}
              className={s.pill}
              data-on={on || undefined}
              onClick={() => setPick(c.id)}
            >
              {on
                ? <motion.span
                    layoutId="hero-service"
                    className={s.pillOn}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                : null}
              <span className={s.pillText}>{c.name}</span>
            </button>
          );
        })}
      </div>

      <div className={s.stage}>
        <AnimatePresence mode="wait" initial={false}>
          {cur
            ? <motion.div
                key={cur.id}
                className={s.card}
                role="tabpanel"
                aria-label={cur.name}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <cur.Card />
              </motion.div>
            : <div key="wait" className={s.wait} aria-hidden="true" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
