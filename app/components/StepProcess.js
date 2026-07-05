"use client";

import { animate, motion, useInView, useMotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  scrollRevealDistance,
  scrollRevealDuration,
  scrollRevealEase,
  scrollRevealViewport,
} from "../../lib/scrollReveal";
import ladder from "../assets/ladder.svg";
import OvalIcon from "../assets/Oval.svg";
import styles from "./StepProcess.module.css";

function LaunchArrowIcon({ className }) {
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

export default function StepProcess() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.4 });

  const count = useMotionValue(1);
  const [display, setDisplay] = useState(1);

  useEffect(() => {
    if (!isInView) {
      count.set(1);
      setDisplay(1);
      return;
    }

    const controls = animate(count, 4, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplay(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, count]);

  const steps = [
    {
      title: "Discovery & Audit",
      description: "We understand your business, goals and data",
    },
    {
      title: "Strategy & Direction",
      description: "We define focus, priorities, and growth roadmap.",
    },
    {
      title: "Execution & Optimization",
      description: "We launch, test, iterate, and scale what actually works.",
    },
    {
      title: "Reporting & Growth",
      description: "Clear reporting, insights, and next-step decisions.",
    },
  ];

  return (
    <div className={styles.root}>
      {/* MAIN STEP */}
      <div className={styles.mainStep}>
        <motion.div ref={ref} className={styles.mainStepContent}>
          <h2 className={styles.mainStepNumber}>{display}</h2>
        </motion.div>

        <div className={styles.mainStepText}>
          <h3 className={styles.mainStepTitle}>How we work</h3>
          <p className={styles.mainStepDescription}>
            <span className={styles.mainStepDescriptionBold}>
              A proven process
            </span>{" "}
            designed to keep things clear, efficient, and focused from{" "}
            <span className={styles.mainStepDescriptionBold}>
              start to finish
            </span>
            .
          </p>
        </div>

        <Image
          src={ladder}
          alt="Ladder"
          width={124}
          height={164}
          unoptimized
          className={styles.ladder}
        />
      </div>

      {/* STEPS */}
      {steps.map((step, index) => {
        const isReversed = index % 2 === 0;
        const titleAlign = isReversed ? styles.alignLeft : styles.alignRight;
        const descriptionAlign = isReversed
          ? styles.alignRight
          : styles.alignLeft;

        const animation = {
          hidden: {
            opacity: 0,
            y: scrollRevealDistance,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: scrollRevealDuration,
              ease: scrollRevealEase,
            },
          },
        };

        return (
          <div className={styles.step} key={step.title}>
            <motion.h3
              className={`${styles.title} ${titleAlign}`}
              variants={animation}
              initial="hidden"
              whileInView="visible"
              viewport={scrollRevealViewport}
            >
              {step.title}
            </motion.h3>

            <div className={styles.stepNumberContainer}>
              <Image
                src={OvalIcon}
                alt="Oval"
                width={26}
                height={26}
                unoptimized
              />
              <p className={styles.stepNumber}>0{index + 1}</p>
            </div>

            <motion.p
              className={`${styles.description} ${descriptionAlign}`}
              variants={animation}
              initial="hidden"
              whileInView="visible"
              viewport={scrollRevealViewport}
              transition={{
                duration: scrollRevealDuration,
                delay: 0.12,
                ease: scrollRevealEase,
              }}
            >
              {step.description}
            </motion.p>
          </div>
        );
      })}

      <Link href="/#contact" className={styles.launchLink}>
        <span>Start a conversation</span>
        <LaunchArrowIcon className={styles.launchArrow} />
      </Link>
    </div>
  );
}
