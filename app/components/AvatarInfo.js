import Image from "next/image";
import digitlLogo from "../assets/digitl-logo.png";
import { defaultSocialLinks } from "./socialIcons";
import styles from "./AvatarInfo.module.css";

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
  role = "Full-Service marketing agencija",
  imageSrc = digitlLogo,
  imageAlt = "Profile photo",
  socialLinks = defaultSocialLinks,
  className = "",
}) {
  const imageUnoptimized =
    typeof imageSrc === "string" && /^https?:\/\//.test(imageSrc);

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
          unoptimized={imageUnoptimized}
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
