"use client";

import p from "./servicePicker.module.css";

/* The last row inside every hero card: which service the card is showing,
   and the others to switch to. Drawn like the progress chips the cards
   used to end with, so it reads as part of the animation. */

function Mark() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m5 12.5 4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ServicePicker({ items, current, onPick }) {
  return (
    <div className={p.row}>
      <span className={p.label}>Primer za</span>
      <div className={p.chips} role="group" aria-label="Usluga">
        {items.map((it) => {
          const on = it.id === current;
          return (
            <button
              key={it.id}
              type="button"
              aria-pressed={on}
              className={p.chip}
              data-on={on || undefined}
              onClick={() => onPick(it.id)}
            >
              <span className={p.mark}>
                <Mark />
              </span>
              {it.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
