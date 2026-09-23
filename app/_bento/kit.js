"use client";

/**
 * Shared pieces for the /bento layout experiments. Each concept owns its own
 * stylesheet and composition; only the plumbing lives here.
 */

import { useEffect, useState } from "react";

export const CONTACT = {
  email: "hello@digitl.rs",
  phone: "064 133 8383",
  tel: "+381641338383",
};

export function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronIcon({ flip = false }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={flip ? { transform: "rotate(180deg)" } : undefined}
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.6"
        y="4.8"
        width="18.8"
        height="14.4"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M3.4 7l8.6 6 8.6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.2 3.5l2.4 4-1.9 2a12.4 12.4 0 005.1 5.1l2-1.9 4 2.4v3a1.9 1.9 0 01-2.1 1.9C9.3 19.3 4.7 14.7 3.6 5.6A1.9 1.9 0 015.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** @param {string} storageKey */
export function useTheme(storageKey = "bento-theme") {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {
      // No stored preference is fine; the system setting still applies.
    }
  }, [storageKey]);

  const toggle = () => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next =
      (theme ?? (dark ? "dark" : "light")) === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // Not persisting is fine; the toggle still works for this visit.
    }
  };

  return [theme, toggle];
}

export function ThemeToggle({ theme, onToggle, className = "" }) {
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const read = () => setSystemDark(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  // Picked in JS: CSS-only variants fight over which icon is visible.
  const isDark = theme ? theme === "dark" : systemDark;

  return (
    <button
      type="button"
      className={className}
      onClick={onToggle}
      aria-label={isDark ? "Svetla tema" : "Tamna tema"}
    >
      {isDark
        ? <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        : <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              cx="12"
              cy="12"
              r="4.4"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>}
    </button>
  );
}

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("sr-RS", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Reveal elements as they enter the viewport (vertical concepts). */
export function useReveal(rootRef, selector = "[data-reveal]") {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll(selector)];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const n of nodes) n.setAttribute("data-shown", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-shown", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, [rootRef, selector]);
}

/** Wheel/drag/keyboard horizontal scrolling for the sideways concepts. */
export function useHorizontalScroll(trackRef, progressRef) {
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Only hijack the wheel while the track actually scrolls sideways, so the
    // stacked phone layout keeps normal vertical scrolling.
    const sideways = () => el.scrollWidth > el.clientWidth + 8;
    let target = el.scrollLeft;
    let raf = 0;

    const max = () => el.scrollWidth - el.clientWidth;
    const clamp = (v) => Math.max(0, Math.min(v, max()));

    const tick = () => {
      const next = el.scrollLeft + (target - el.scrollLeft) * 0.14;
      if (Math.abs(target - next) < 0.5) {
        el.scrollLeft = target;
        raf = 0;
        return;
      }
      el.scrollLeft = next;
      raf = requestAnimationFrame(tick);
    };

    const scrollTo = (value) => {
      target = clamp(value);
      if (reduce.matches) {
        el.scrollLeft = target;
        return;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (!sideways()) return;
      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (!delta) return;
      e.preventDefault();
      if (!raf) target = el.scrollLeft;
      scrollTo(target + delta);
    };

    // Anything outside the hook (the chapter nav) asks for a scroll this way,
    // so the rAF below owns the position instead of fighting a scrollTo().
    const onRequest = (e) => scrollTo(e.detail ?? 0);

    const onScroll = () => {
      if (!raf) target = el.scrollLeft;
      const m = max();
      progressRef?.current?.style.setProperty(
        "--progress",
        String(m > 0 ? el.scrollLeft / m : 0),
      );
    };

    const onKey = (e) => {
      if (!sideways()) return;
      if (e.target.closest?.("input, textarea, select")) return;
      const page = el.clientWidth * 0.8;
      const moves = {
        ArrowRight: 320,
        ArrowLeft: -320,
        PageDown: page,
        PageUp: -page,
      };
      if (e.key in moves) {
        e.preventDefault();
        if (!raf) target = el.scrollLeft;
        scrollTo(target + moves[e.key]);
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        scrollTo(max());
      }
    };

    // Mouse drag-to-scroll; a click that ends a drag must not open a link.
    let drag = null;
    let suppressClick = false;

    const onPointerDown = (e) => {
      if (!sideways() || e.pointerType !== "mouse" || e.button !== 0) return;
      if (e.target.closest("input, textarea, button, a, [data-no-drag]"))
        return;
      drag = { x: e.clientX, left: el.scrollLeft, moved: false };
    };
    const onPointerMove = (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) {
        drag.moved = true;
        el.setAttribute("data-dragging", "");
      }
      if (drag.moved) {
        cancelAnimationFrame(raf);
        raf = 0;
        el.scrollLeft = drag.left - dx;
        target = el.scrollLeft;
      }
    };
    const onPointerUp = () => {
      if (drag?.moved) suppressClick = true;
      drag = null;
      el.removeAttribute("data-dragging");
    };
    const onClickCapture = (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };
    const onDragStart = (e) => e.preventDefault();

    el.addEventListener("dg:scrollto", onRequest);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);
    window.addEventListener("keydown", onKey);
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("dg:scrollto", onRequest);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("keydown", onKey);
    };
  }, [trackRef, progressRef]);
}
