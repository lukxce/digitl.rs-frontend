"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import b from "./base.module.css";
import { ArrowUpRight } from "./icons";
import { Counter, EASE, Head, useApp, useVisible } from "./ui";
import w from "./work.module.css";

const DWELL = 4800;

/** Project list on the left, a large live preview on the right. The preview
    cycles on its own until the visitor points at a project. */
export default function Work({ clients }) {
  const { plan } = useApp();
  const list = (
    plan?.match
      ? [...clients].sort(
          (a, z) => (z.slug === plan.match) - (a.slug === plan.match),
        )
      : clients
  ).slice(0, 4);
  const ref = useRef(null);
  const visible = useVisible(ref, 0.35);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    if (plan?.match) setActive(0);
  }, [plan?.match]);

  useEffect(() => {
    if (!visible || held || list.length < 2) return;
    const t = setTimeout(() => setActive((v) => (v + 1) % list.length), DWELL);
    return () => clearTimeout(t);
  }, [visible, held, active, list.length]);

  const cur = list[active] ?? list[0];
  if (!cur) return null;

  return (
    <section className={`${b.section} ${w.section}`} data-section="Rezultati">
      <div className={b.container}>
        <div className={w.top}>
          <Head
            id="rezultati"
            label="Rezultati"
            title="Brojevi iz stvarnih projekata."
            intro="Svaki broj je iz objavljene studije slučaja. Sajtove možete da otvorite i izmerite sami."
          />
          <a className={w.all} href="/projects">
            Svi projekti <ArrowUpRight size={15} />
          </a>
        </div>

        <div
          ref={ref}
          className={w.layout}
          onPointerLeave={() => setHeld(false)}
        >
          <ol className={w.list}>
            {list.map((c, i) => {
              const on = i === active;
              const m = c.metrics[0];
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    className={w.row}
                    data-on={on ? "true" : undefined}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== "mouse") return;
                      setHeld(true);
                      setActive(i);
                    }}
                    onClick={() => {
                      setHeld(true);
                      setActive(i);
                    }}
                    aria-pressed={on}
                  >
                    <span className={w.idx}>0{i + 1}</span>
                    <span className={w.name}>
                      <b>{c.name}</b>
                      <span>{c.category}</span>
                    </span>
                    {m
                      ? <span className={w.metric}>
                          <b>{m.value}</b>
                          <span>{m.label}</span>
                        </span>
                      : null}
                    {plan?.match === c.slug
                      ? <span className={w.match}>Najsličnije vama</span>
                      : null}
                    {on && visible && !held
                      ? <motion.i
                          key={`bar-${active}`}
                          className={w.bar}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: DWELL / 1000,
                            ease: "linear",
                          }}
                        />
                      : null}
                  </button>
                </li>
              );
            })}
          </ol>

          <a
            className={w.preview}
            href={cur.href}
            aria-label={`Studija slučaja: ${cur.name}`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={cur.slug}
                className={w.shot}
                initial={{
                  opacity: 0,
                  scale: 1.06,
                  clipPath: "inset(0 0 0 100%)",
                }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0 0%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cur.cover} alt={`Sajt za ${cur.name}`} />
              </motion.span>
            </AnimatePresence>
            <span className={w.overlay}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={cur.slug}
                  className={w.stats}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.15 }}
                >
                  {cur.metrics.slice(0, 3).map((m) => (
                    <span key={m.label} className={w.stat}>
                      <b>
                        <Counter metric={m} run={visible} />
                      </b>
                      <span>{m.label}</span>
                    </span>
                  ))}
                </motion.span>
              </AnimatePresence>
              <span className={w.open}>
                Studija slučaja <ArrowUpRight size={15} />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
