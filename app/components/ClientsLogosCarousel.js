import Image from "next/image";
import primaDental from "../assets/primadental logo.webp";
import startupsRs from "../assets/startups.rs logo.webp";
import thermiq from "../assets/thermiq logo.webp";
import styles from "./ClientsLogosCarousel.module.css";

const logos = [
  { src: primaDental, alt: "Prima Dental", height: 96 },
  { src: startupsRs, alt: "Startups.rs", height: 36 },
  { src: thermiq, alt: "Thermiq", height: 77 },
];

function LogoRow({ keyPrefix }) {
  return logos.map((logo) => (
    <div key={`${keyPrefix}-${logo.alt}`} className={styles.logoItem}>
      <Image
        src={logo.src}
        alt={logo.alt}
        height={logo.height}
        width={200}
        style={{ height: `${logo.height}px`, width: "auto" }}
        unoptimized
      />
    </div>
  ));
}

export default function ClientsLogosCarousel({
  title,
  marginTop,
  marginBottom,
}) {
  const style = {
    ...(marginTop != null && { marginTop }),
    ...(marginBottom != null && { marginBottom }),
  };

  return (
    <div
      className={styles.root}
      style={Object.keys(style).length ? style : undefined}
    >
      {title && <p className={styles.label}>{title}</p>}
      <div className={styles.viewport}>
        <div className={styles.track}>
          <LogoRow keyPrefix="marquee-a" />
          <LogoRow keyPrefix="marquee-b" />
        </div>
      </div>
    </div>
  );
}
