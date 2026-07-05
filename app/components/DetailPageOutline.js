import styles from "./DetailPageOutline.module.css";
import { OutlineProvider } from "./detailPageOutlineContext";
import OnThisPageNav from "./OnThisPageNav";

/**
 * @param {{
 *   items: Array<{ id: string; label: string }>;
 *   children: import("react").ReactNode;
 *   className?: string;
 * }} props
 */
export default function DetailPageOutline({ items, children, className = "" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return children;
  }

  return (
    <OutlineProvider items={items}>
      <div className={`${styles.shell} ${className}`.trim()}>
        <div className={styles.navSlot}>
          <OnThisPageNav
            items={items}
            headingId="on-this-page-desktop-title"
            className={styles.desktopOutline}
          />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </OutlineProvider>
  );
}

export { default as DetailPageOutlineMobileNav } from "./DetailPageOutlineMobileNav";
