"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";
import {
  scrollRevealDistance,
  scrollRevealDuration,
  scrollRevealEase,
  scrollRevealStagger,
  scrollRevealStaggerDelay,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import styles from "./Faq.module.css";
import ScrollReveal from "./ScrollReveal";
import Title from "./Title";

const easeOut = [0.22, 1, 0.36, 1];

const faqListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: scrollRevealStagger,
      delayChildren: scrollRevealStaggerDelay,
    },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: scrollRevealDistance },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: scrollRevealDuration, ease: scrollRevealEase },
  },
};

const FAQS = [
  {
    question: "Koliko brzo možemo da krenemo?",
    answer:
      "Zavisi od obima i trenutnih kapaciteta. Ako postoji prostor za saradnju, obično krećemo u roku od 1–2 nedelje nakon inicijalnog dogovora.",
  },
  {
    question: "Šta ako nismo sigurni šta nam tačno treba?",
    answer:
      "To je čest slučaj. U prvim koracima pomažemo da se definišu prioriteti i fokus, pre nego što se krene u egzekuciju.",
  },
  {
    question: "Da li radite samo kompletne projekte ili i pojedinačne usluge?",
    answer:
      "Radimo i jedno i drugo. Možemo preuzeti kompletan marketing ili konkretan segment (npr. oglase, sajt ili SEO), ali samo ako postoji jasan cilj i način da se rezultat meri. Ne radimo zadatke „reda radi“.",
  },
  {
    question: "Kako izgleda komunikacija tokom saradnje?",
    answer:
      "Komunikacija je direktna i unapred dogovorena. Imate kontakt sa ljudima koji rade na projektu, redovne update-ove i jasan ritam rada. Bez posrednika, bez čekanja i bez nejasnih odgovora.",
  },
  {
    question: "Sa kakvim firmama najčešće radite?",
    answer:
      "Najčešće radimo sa firmama koje žele da unaprede prodaju, rast ili pozicioniranje i razumeju da marketing mora imati ulogu u poslovanju. Veličina firme nije presudna.",
  },
];

function AskArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Arrow</title>
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusMinusIcon({ open, reduceMotion }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <title>Toggle</title>
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <motion.path
        d="M12 5v14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={false}
        animate={{
          opacity: open ? 0 : 1,
          scaleY: open ? 0 : 1,
        }}
        style={{ transformOrigin: "center" }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.35, ease: easeOut }
        }
      />
    </svg>
  );
}

function FaqItem({ question, answer, initialOpen }) {
  const [open, setOpen] = useState(initialOpen ?? false);
  const contentId = useId();
  const reduceMotion = useReducedMotion() === true;

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.question}>{question}</span>
        <span className={styles.iconWrap}>
          <motion.span
            className={styles.iconInner}
            initial={false}
            animate={{ rotate: reduceMotion ? 0 : open ? 180 : 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.35, ease: easeOut }
            }
          >
            <PlusMinusIcon open={open} reduceMotion={reduceMotion} />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            className={styles.panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.2, ease: easeOut }
                : {
                    height: { duration: 0.35, ease: easeOut },
                    opacity: { duration: 0.25, ease: easeOut },
                  }
            }
            style={{ overflow: "hidden" }}
          >
            <div className={styles.panelInner}>
              <p className={styles.answer}>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Faq() {
  const reduceMotion = useReducedMotion() === true;

  const listContent = FAQS.map((item, index) => {
    const faqItem = (
      <FaqItem
        key={item.question}
        initialOpen={index === 0}
        question={item.question}
        answer={item.answer}
      />
    );

    return reduceMotion
      ? <li key={item.question} className={styles.listItem}>
          {faqItem}
        </li>
      : <motion.li
          key={item.question}
          className={styles.listItem}
          variants={faqItemVariants}
        >
          {faqItem}
        </motion.li>;
  });

  return (
    <section className={styles.root} aria-labelledby="faq-title">
      <ScrollReveal className={styles.titleContainer}>
        <Title title="Imate još pitanja pre nego što krenemo?" width={480} />
      </ScrollReveal>
      {reduceMotion
        ? <ul className={styles.list}>{listContent}</ul>
        : <motion.ul
            className={styles.list}
            variants={faqListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={scrollRevealViewport}
          >
            {listContent}
          </motion.ul>}
      <ScrollReveal delay={0.24}>
        <div className={styles.rootInner}>
          <p className={styles.followUpText}>Imate dodatna pitanja?</p>
          <Link href="/#contact" className={styles.askLink}>
            <span>Javite se</span>
            <AskArrowIcon className={styles.askArrow} />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
