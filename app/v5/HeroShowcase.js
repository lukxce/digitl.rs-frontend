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

/* The hero's right side: one of our services, shown working. A different
   one each visit, picked after the page loads (so the server and the
   browser render the same thing first); `show` forces one, for the lab. */

export const CARDS = [
  { id: "seo", name: "SEO", Card: SearchClimb },
  { id: "ads", name: "Oglasi", Card: AdsCard },
  { id: "social", name: "Mreže", Card: SocialCard },
  { id: "web", name: "Sajt", Card: WebCard },
  { id: "brand", name: "Brend", Card: BrandCard },
];

export default function HeroShowcase({ show = null, nonce = 0 }) {
  const [pick, setPick] = useState(null);

  // nonce: a new value asks for a fresh random pick
  // biome-ignore lint/correctness/useExhaustiveDependencies: nonce re-rolls the pick
  useEffect(() => {
    if (show) {
      setPick(show);
      return;
    }
    const i = Math.floor(Math.random() * CARDS.length);
    setPick(CARDS[i].id);
  }, [show, nonce]);

  const cur = CARDS.find((c) => c.id === pick);
  return (
    <div className={s.slot}>
      <AnimatePresence mode="wait" initial={false}>
        {cur
          ? <motion.div
              key={`${cur.id}-${nonce}`}
              className={s.card}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <cur.Card />
            </motion.div>
          : <div key="wait" className={s.wait} aria-hidden="true" />}
      </AnimatePresence>
    </div>
  );
}
