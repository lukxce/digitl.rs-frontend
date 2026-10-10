"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Plus, X } from "../_home/icons";
import g from "./gallery.module.css";
import { imageSize, sized, srcSet } from "./lib";

const FOCUSABLE = "button:not([disabled]), a[href]";

/** The larger view: Esc, the backdrop or the button close it, arrows step
    through the chapter's pictures, and focus goes back where it came from. */
function Lightbox({ items, index, setIndex, onClose }) {
  const lenis = useLenis();
  const still = useReducedMotion();
  const panel = useRef(null);
  const closeBtn = useRef(null);
  const [host, setHost] = useState(null);
  const many = items.length > 1;
  const count = items.length;

  // Inside the page's own root, so the tokens and the typeface apply.
  useEffect(() => {
    setHost(document.querySelector("[data-own-chrome]") ?? document.body);
  }, []);

  useEffect(() => {
    if (!host) return;
    const before = document.activeElement;
    closeBtn.current?.focus({ preventScroll: true });
    return () => before?.focus?.({ preventScroll: true });
  }, [host]);

  // the page behind stays where it is
  useEffect(() => {
    if (!host) return;
    const html = document.documentElement;
    const { overflow, paddingRight } = html.style;
    const bar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (bar > 0) html.style.paddingRight = `${bar}px`;
    lenis?.stop();
    return () => {
      html.style.overflow = overflow;
      html.style.paddingRight = paddingRight;
      lenis?.start();
    };
  }, [host, lenis]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && count > 1) {
        setIndex((i) => (i + 1) % count);
      } else if (e.key === "ArrowLeft" && count > 1) {
        setIndex((i) => (i - 1 + count) % count);
      } else if (e.key === "Tab") {
        const stops = [...(panel.current?.querySelectorAll(FOCUSABLE) ?? [])];
        if (!stops.length) return;
        const first = stops[0];
        const last = stops[stops.length - 1];
        const at = document.activeElement;
        if (!panel.current.contains(at)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && at === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && at === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count, onClose, setIndex]);

  if (!host) return null;
  const m = items[index];
  const size = imageSize(m.src) ?? { width: 1600, height: 900 };

  return createPortal(
    <motion.div
      ref={panel}
      className={g.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={many ? `Slika ${index + 1} od ${count}` : "Uvećana slika"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: still ? 0 : 0.25 }}
      onClick={(e) => {
        if (!e.target.closest("[data-keep]")) onClose();
      }}
    >
      <div className={g.bar} data-keep>
        {many
          ? <span className={g.count}>
              {index + 1} / {count}
            </span>
          : <span />}
        <button
          ref={closeBtn}
          type="button"
          className={g.round}
          onClick={onClose}
          aria-label="Zatvorite"
        >
          <X size={18} />
        </button>
      </div>

      <motion.figure
        key={m.src}
        className={g.stage}
        initial={still ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-keep
          src={sized(m.src, 2000, 82)}
          srcSet={srcSet(m.src, [1000, 1600, 2400], 82)}
          sizes="96vw"
          alt={m.alt ?? ""}
          width={size.width}
          height={size.height}
          style={{
            aspectRatio: `${size.width} / ${size.height}`,
            "--ar": Math.round((size.width / size.height) * 1000) / 1000,
          }}
        />
        {m.caption ? <figcaption data-keep>{m.caption}</figcaption> : null}
      </motion.figure>

      {many
        ? <div className={g.steps} data-keep>
            <button
              type="button"
              className={g.round}
              onClick={() => setIndex((i) => (i - 1 + count) % count)}
              aria-label="Prethodna slika"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className={g.round}
              onClick={() => setIndex((i) => (i + 1) % count)}
              aria-label="Sledeća slika"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        : null}
    </motion.div>,
    host,
  );
}

const SIZES = {
  full: "(max-width: 1099px) 100vw, 960px",
  half: "(max-width: 699px) 84vw, (max-width: 1099px) 50vw, 480px",
  third: "(max-width: 699px) 84vw, (max-width: 1099px) 34vw, 320px",
};

/** A chapter's pictures. One is shown large; two sit side by side; three or
    more lead with the first and line the rest up under it. On a phone more
    than one becomes a strip to swipe. Each opens larger on click. */
export default function Gallery({ items }) {
  const [open, setOpen] = useState(null);
  const list = (items ?? []).filter((m) => m?.src);
  if (!list.length) return null;
  const n = list.length;
  const layout = n === 1 ? "one" : n === 2 ? "two" : "lead";

  return (
    <>
      <div
        className={g.gallery}
        data-layout={layout}
        style={{ "--rest": Math.min(3, Math.max(1, n - 1)) }}
      >
        {list.map((m, i) => {
          const size = imageSize(m.src) ?? { width: 1600, height: 900 };
          const big = n === 1 || (layout === "lead" && i === 0);
          const slot = big ? "full" : n === 2 || n === 3 ? "half" : "third";
          return (
            <figure
              key={m.src}
              className={g.item}
              data-big={big ? "" : undefined}
            >
              <button
                type="button"
                className={g.frame}
                onClick={() => setOpen(i)}
                aria-label={`Uvećajte sliku: ${m.alt || m.caption || `slika ${i + 1}`}`}
                style={{ aspectRatio: `${size.width} / ${size.height}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sized(m.src, big ? 1600 : 960)}
                  srcSet={srcSet(
                    m.src,
                    big ? [800, 1200, 1920] : [480, 800, 1200],
                  )}
                  sizes={SIZES[slot]}
                  alt={m.alt ?? ""}
                  width={size.width}
                  height={size.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className={g.zoom} aria-hidden="true">
                  <Plus size={16} />
                </span>
              </button>
              {m.caption ? <figcaption>{m.caption}</figcaption> : null}
            </figure>
          );
        })}
      </div>
      <AnimatePresence>
        {open != null
          ? <Lightbox
              key="lightbox"
              items={list}
              index={open}
              setIndex={setOpen}
              onClose={() => setOpen(null)}
            />
          : null}
      </AnimatePresence>
    </>
  );
}
