"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { scrollRevealEase } from "../../lib/scrollReveal";
import FigmaIcon from "../assets/figma.svg";
import FramerIcon from "../assets/framer.svg";
import PhotoshopIcon from "../assets/photoshop.svg";
import styles from "./ToolsList.module.css";

export default function ToolsList() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const steps = [
    {
      icon: <Image src={FigmaIcon} alt="Figma" width={26} height={26} />,
      title: "Figma",
      description: "Leading design tool",
      percentage: 90,
    },
    {
      icon: <Image src={FramerIcon} alt="Framer" width={26} height={26} />,
      title: "Framer",
      description: "No-code website builder",
      percentage: 70,
    },
    {
      icon: (
        <Image src={PhotoshopIcon} alt="Photoshop" width={26} height={26} />
      ),
      title: "Adobe Photoshop",
      description: "Raster graphics editor",
      percentage: 60,
    },
  ];

  return (
    <div className={styles.root} ref={ref}>
      {steps.map((step) => (
        <div className={styles.step} key={step.title}>
          {/* 🔵 Animated fill */}
          <motion.div
            className={styles.fill}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${step.percentage}%` } : {}}
            transition={{ duration: 1.6, ease: scrollRevealEase }}
          />

          <div className={styles.stepIcon}>{step.icon}</div>

          <div className={styles.stepContent}>
            <div className={styles.stepTitle}>{step.title}</div>
            <div className={styles.stepDescription}>{step.description}</div>
          </div>

          <div className={styles.stepPercentage}>{step.percentage}%</div>
        </div>
      ))}
    </div>
  );
}
