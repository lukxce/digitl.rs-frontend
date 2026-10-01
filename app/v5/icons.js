// Line icons for v5, drawn on a 24px grid with a 2px stroke.

function I({ size = 16, children, fill = false, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p) => (
  <I {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </I>
);
export const ArrowLeft = (p) => (
  <I {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </I>
);
export const ArrowUpRight = (p) => (
  <I {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </I>
);
export const Check = (p) => (
  <I {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </I>
);
export const X = (p) => (
  <I {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </I>
);
export const Plus = (p) => (
  <I {...p}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
export const Phone = (p) => (
  <I {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </I>
);
export const Search = (p) => (
  <I {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </I>
);
export const Bolt = (p) => (
  <I {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </I>
);
export const Tag = (p) => (
  <I {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
  </I>
);
export const Chart = (p) => (
  <I {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </I>
);
export const Trend = (p) => (
  <I {...p}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </I>
);
export const Trophy = (p) => (
  <I {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M17 6h3a3 3 0 0 1-3 4M7 6H4a3 3 0 0 0 3 4" />
  </I>
);
export const Play = (p) => (
  <I fill {...p}>
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5" />
  </I>
);
export const Pause = (p) => (
  <I fill {...p}>
    <rect x="6" y="4" width="4" height="16" rx="1.2" />
    <rect x="14" y="4" width="4" height="16" rx="1.2" />
  </I>
);
export const Rotate = (p) => (
  <I {...p}>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </I>
);
export const FileText = (p) => (
  <I {...p}>
    <path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </I>
);
export const Globe = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </I>
);
export const Megaphone = (p) => (
  <I {...p}>
    <path d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1" />
    <path d="M19 9a4 4 0 0 1 0 6" />
  </I>
);
export const Calendar = (p) => (
  <I {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </I>
);
export const Layers = (p) => (
  <I {...p}>
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </I>
);
export const Pen = (p) => (
  <I {...p}>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" />
  </I>
);
export const Gauge = (p) => (
  <I {...p}>
    <path d="M4 18a9 9 0 1 1 16 0" />
    <path d="m12 13 4-4" />
  </I>
);
export const Pin = (p) => (
  <I {...p}>
    <path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12" />
    <circle cx="12" cy="9" r="2.5" />
  </I>
);
export const Clock = (p) => (
  <I {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </I>
);
export const Mail = (p) => (
  <I {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </I>
);
export const Lock = (p) => (
  <I {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </I>
);
export const Shield = (p) => (
  <I {...p}>
    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </I>
);
export const Users = (p) => (
  <I {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
  </I>
);
export const Message = (p) => (
  <I {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
  </I>
);
export const Quote = (p) => (
  <I fill {...p}>
    <path d="M3 21v-6.5C3 8.6 5.6 5 10.4 3.6l.9 1.9C8.4 6.7 7.2 8.8 7 12h4v9zm11 0v-6.5c0-5.9 2.6-9.5 7.4-10.9l.9 1.9c-2.9 1.2-4.1 3.3-4.3 6.5h4v9z" />
  </I>
);
