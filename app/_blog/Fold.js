"use client";

/* The sources: the first few show, the rest fade under an arrow that opens
   them (Luka, 13 Nov 2026: long source lists stretched the page). */

import { useState } from "react";
import { ChevronDown } from "../_home/icons";
import p from "./prose.module.css";

export default function Fold({ children, label = "Prikaži sve izvore" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={p.fold} data-open={open ? "" : undefined}>
      <div className={p.foldBody}>{children}</div>
      <button
        type="button"
        className={p.foldKey}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{open ? "Sakrij" : label}</span>
        <i aria-hidden="true">
          <ChevronDown size={16} />
        </i>
      </button>
    </div>
  );
}
