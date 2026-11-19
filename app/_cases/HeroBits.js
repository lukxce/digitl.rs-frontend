"use client";

import { motion } from "motion/react";
import { STICKERS } from "../_usluge/Stickers";

/* The moving parts of a case study's top: the service sticker beside the
   client's name, and the two headline numbers pinned to the cover. */
export function NameSticker({ kind, className }) {
  const Sticker = kind ? STICKERS[kind] : null;
  if (!Sticker) return null;
  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ scale: 0, rotate: -40 }}
      animate={{ scale: 1, rotate: 8 }}
      transition={{ type: "spring", stiffness: 240, damping: 14, delay: 0.35 }}
      whileHover={{ rotate: -6, scale: 1.08 }}
    >
      <Sticker size="100%" />
    </motion.span>
  );
}

export function Pins({ pins, className }) {
  return pins.slice(0, 2).map((n, i) => (
    <motion.span
      key={n.label}
      className={className}
      data-i={i}
      initial={{ opacity: 0, y: 18, rotate: i ? 4 : -4 }}
      animate={{ opacity: 1, y: 0, rotate: i ? 2 : -3 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        delay: 0.55 + i * 0.18,
      }}
    >
      <b>{n.value}</b>
      <span>{n.label}</span>
    </motion.span>
  ));
}
