import Image from "next/image";
import { canOptimizeImage } from "../../../lib/imageHosts.js";
import { defaultSocialLinks } from "../socialIcons";
import AvailabilityBadge from "./AvailabilityBadge";
import styles from "./HeroCardHeader.module.css";

export default function HeroCardHeader({
  name,
  subtitle,
  avatarSrc,
  avatarAlt,
  availabilitySlotsLabel,
  availabilityPeriodLabel,
  socialLinks = defaultSocialLinks,
  className = "",
}) {
  return (
    <header className={`${styles.header} ${className}`.trim()}>
      <div className={styles.left}>
        <div className={styles.avatarWrap}>
          <Image
            src={avatarSrc}
            alt={avatarAlt}
            width={96}
            height={96}
            sizes="48px"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "grayscale(1)",
            }}
            unoptimized={!canOptimizeImage(avatarSrc)}
          />
        </div>
        <div className={styles.meta}>
          <p className={styles.name}>{name}</p>
          <p className={styles.subtitle}>{subtitle}</p>
          {socialLinks.length > 0
            ? <div className={styles.socialRow}>
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className={styles.socialLink}
                    aria-label={label}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            : null}
        </div>
      </div>
      <AvailabilityBadge
        slotsLabel={availabilitySlotsLabel}
        periodLabel={availabilityPeriodLabel}
      />
    </header>
  );
}
