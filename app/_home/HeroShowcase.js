"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AdsCard from "./heroCards/AdsCard";
import BrandCard from "./heroCards/BrandCard";
import SocialCard from "./heroCards/SocialCard";
import WebCard from "./heroCards/WebCard";
import s from "./heroShowcase.module.css";
import SearchClimb from "./SearchClimb";
import ServicePicker from "./ServicePicker";
import { EASE } from "./ui";

/* The hero's right side: one of our services, shown working. The last row
   inside the card switches between services; on load a random one is
   picked (after mount, so the server and the browser render the same
   thing first). */

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
  const footer = (
    <ServicePicker items={CARDS} current={pick} onPick={(id) => setPick(id)} />
  );
  return (
    <div className={s.stage}>
      <AnimatePresence mode="wait" initial={false}>
        {cur
          ? <motion.div
              key={cur.id}
              className={s.card}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <cur.Card footer={footer} />
            </motion.div>
          : <div key="wait" className={s.wait} aria-hidden="true" />}
      </AnimatePresence>
    </div>
  );
}
