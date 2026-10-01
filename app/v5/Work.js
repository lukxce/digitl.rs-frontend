"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import b from "./base.module.css";
import { ArrowUpRight } from "./icons";
import { Counter, EASE, Head, useApp, useVisible } from "./ui";
import w from "./work.module.css";

/** One case: the cover shown whole, the lesson as a headline, the numbers in a row. */
function Case({ c, i, closest }) {
  const ref = useRef(null);
  const run = useVisible(ref, 0.35);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const lesson = c.takeaways?.[0]?.title;
  const [m1, m2] = c.metrics;

  return (
    <motion.a
      ref={ref}
      layout
      href={c.href}
      className={w.case}
      style={{ order: i }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.9,
        ease: EASE,
        layout: { duration: 0.7, ease: EASE },
      }}
    >
      <motion.span
        className={w.cover}
        initial={{ clipPath: "inset(18% 6% 18% 6% round 28px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <motion.img
          src={c.cover}
          alt={`Sajt za ${c.name}`}
          loading="lazy"
          style={{ y, scale: 1.12 }}
        />
        <span className={w.tag}>{c.category}</span>
        {closest ? <span className={w.closest}>Najsličnije vama</span> : null}
      </motion.span>

      <span className={w.meta}>
        <span className={w.who}>
          {c.logo
            ? <span className={w.logo}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logo} alt="" />
              </span>
            : null}
          <b>{c.name}</b>
        </span>
        <span className={w.go}>
          <ArrowUpRight size={18} />
        </span>
      </span>

      {lesson ? <span className={w.lesson}>{lesson}</span> : null}

      <span className={w.numbers}>
        {[m1, m2].filter(Boolean).map((m, k) => (
          <span key={m.label} className={k ? w.num2 : w.num1}>
            <b>
              <Counter metric={m} run={run} ms={1500} />
            </b>
            <em>{m.label}</em>
          </span>
        ))}
      </span>
    </motion.a>
  );
}

export default function Work({ clients }) {
  const { plan } = useApp();
  const list = (
    plan?.match
      ? [...clients].sort(
          (a, z) => (z.slug === plan.match) - (a.slug === plan.match),
        )
      : clients
  ).slice(0, 4);

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
            Sve studije slučaja <ArrowUpRight size={15} />
          </a>
        </div>
        {/* Two columns, the second set lower; on phones they collapse into one list in order. */}
        <div className={w.grid}>
          {[0, 1].map((col) => (
            <div key={col} className={`${w.col} ${col ? w.colLow : ""}`}>
              {list.map((c, i) =>
                i % 2 === col
                  ? <Case
                      key={c.slug}
                      c={c}
                      i={i}
                      closest={plan?.match === c.slug}
                    />
                  : null,
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
