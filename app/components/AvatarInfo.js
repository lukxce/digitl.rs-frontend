import Image from "next/image";
import { canOptimizeImage } from "../../lib/imageHosts.js";
import digitlLogo from "../assets/digitl-logo.png";
import styles from "./AvatarInfo.module.css";
import { defaultSocialLinks } from "./socialIcons";

/**
 * @param {{
 *   name: string;
 *   role: string;
 *   imageSrc: string | import("next/image").StaticImageData;
 *   imageAlt?: string;
 *   socialLinks?: Array<{ href: string; label: string; Icon: () => import("react").JSX.Element }>;
 *   className?: string;
 * }} props
 */
export default function AvatarInfo({
  name = "Digitl",
  role = "Full-service marketing for businesses",
  imageSrc = digitlLogo,
  imageAlt = "Digitl logo",
  socialLinks = defaultSocialLinks,
  className = "",
}) {
  return (
    <section
      className={`${styles.root} ${className}`.trim()}
      aria-label={name ? `${name} profile` : "Profile"}
    >
      <div className={styles.avatarWrap}>
        <Image
          src={imageSrc}
          alt={imageAlt || name}
          width={96}
          height={96}
          className={styles.avatar}
          sizes="96px"
          unoptimized={!canOptimizeImage(imageSrc)}
        />
      </div>

      <p className={styles.name}>{name}</p>
      <p className={styles.role}>{role}</p>

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
    </section>
  );
}
