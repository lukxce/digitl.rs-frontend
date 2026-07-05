import Link from "next/link";
import CtaButton from "../CtaButton";
import styles from "./CTAButtons.module.css";

export default function CTAButtons({
  primaryHref = "#",
  primaryLabel = "Get started",
  secondaryHref = "#",
  secondaryLabel = "My work",
}) {
  return (
    <div className={styles.row}>
      <CtaButton title={primaryLabel} action={primaryHref} />
      <Link href={secondaryHref} className={styles.secondary}>
        {secondaryLabel}
      </Link>
    </div>
  );
}
