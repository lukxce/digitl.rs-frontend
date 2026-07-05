/**
 * Shared social network icons + the default link list used across the site
 * (HeroCardHeader, AvatarInfo). Order: Instagram, Facebook, X, LinkedIn.
 *
 * Update the `href` values here once the profiles are created - this is the
 * single place where social links live.
 */

export function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle
        cx="12"
        cy="12"
        r="4.25"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconFacebook() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13.5 21v-7.5h2.52l.48-3h-3V8.55c0-.87.24-1.55 1.5-1.55H16.5V4.14c-.27-.04-1.2-.14-2.28-.14-2.26 0-3.72 1.38-3.72 3.9v2.6H7.5v3H10.5V21h3z" />
    </svg>
  );
}

export function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.36l7.18-8.2L2 3h6.34l4.37 5.78L17.75 3zm-1.08 16.16h1.7L7.42 4.74H5.6l11.07 14.42z" />
    </svg>
  );
}

export function IconLinkedin() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Placeholder hrefs until the profiles are created. */
export const defaultSocialLinks = [
  { href: "#", label: "Instagram", Icon: IconInstagram },
  { href: "#", label: "Facebook", Icon: IconFacebook },
  { href: "#", label: "X", Icon: IconX },
  { href: "#", label: "LinkedIn", Icon: IconLinkedin },
];
