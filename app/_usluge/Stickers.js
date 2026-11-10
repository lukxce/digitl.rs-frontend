/* Sticker illustrations (first drawn for the /novi test, now used by the
   service pages too): flat brand shapes with an ink
   outline and a white sticker edge, drawn on a 120 px grid. */

const INK = "#0b0b16";
const BLUE = "#2a29ff";
const LIME = "#9ef34a";
const CORAL = "#ff8078";
const MIST = "#f4f4f6";

function Edge({ d, fill, sw = 3 }) {
  return (
    <>
      <path
        d={d}
        fill="#fff"
        stroke="#fff"
        strokeWidth={sw + 9}
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill={fill}
        stroke={INK}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </>
  );
}

function Svg({ size, label, children, className }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      {children}
    </svg>
  );
}

/** A search result that sits first: a card, a magnifier, a lime "1". */
export function SearchSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge
        d="M18 30h84a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V38a8 8 0 0 1 8-8z"
        fill="#fff"
      />
      <rect x="22" y="44" width="46" height="7" rx="3.5" fill={BLUE} />
      <rect x="22" y="57" width="70" height="5" rx="2.5" fill="#d6d6de" />
      <rect x="22" y="67" width="56" height="5" rx="2.5" fill="#d6d6de" />
      <Edge d="M84 6a17 17 0 1 1 0 34a17 17 0 0 1 0-34z" fill={LIME} />
      <path
        d="M80 15l6-3v19"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Edge d="M40 84a13 13 0 1 1 0 26a13 13 0 0 1 0-26z" fill={BLUE} />
      <path
        d="M36 97a4 4 0 1 1 8 0a4 4 0 0 1-8 0M43 100l3 3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** A rising chart on a lime tile. */
export function ChartSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge
        d="M22 14h76a12 12 0 0 1 12 12v68a12 12 0 0 1-12 12H22a12 12 0 0 1-12-12V26a12 12 0 0 1 12-12z"
        fill={LIME}
      />
      <path
        d="M26 86l20-20 14 12 30-34"
        fill="none"
        stroke={INK}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 42h18v18"
        fill="none"
        stroke={INK}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="26" cy="86" r="5" fill={INK} />
    </Svg>
  );
}

/** A target with an arrow in the middle: paid ads. */
export function TargetSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge d="M58 12a46 46 0 1 1 0 92a46 46 0 0 1 0-92z" fill="#fff" />
      <circle cx="58" cy="58" r="33" fill={BLUE} />
      <circle cx="58" cy="58" r="21" fill="#fff" />
      <circle
        cx="58"
        cy="58"
        r="10"
        fill={CORAL}
        stroke={INK}
        strokeWidth="3"
      />
      <Edge d="M60 56l40-40l4 10l10 4l-40 40z" fill={LIME} sw={2.6} />
      <path
        d="M60 56l-6 8"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** A magnifier over rising bars: SEO. */
export function SeoSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge d="M14 70h18v36H14zM40 52h18v54H40zM66 34h18v72H66z" fill={MIST} />
      <rect
        x="66"
        y="34"
        width="18"
        height="72"
        fill={BLUE}
        stroke={INK}
        strokeWidth="3"
      />
      <Edge d="M70 8a26 26 0 1 1 0 52a26 26 0 0 1 0-52z" fill="#fff" />
      <circle cx="70" cy="34" r="16" fill={LIME} stroke={INK} strokeWidth="3" />
      <Edge d="M88 52l18 18l-7 7l-18-18z" fill={INK} sw={2} />
    </Svg>
  );
}

/** A browser window with a page in it: web. */
export function WebSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge
        d="M16 18h88a8 8 0 0 1 8 8v66a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8V26a8 8 0 0 1 8-8z"
        fill="#fff"
      />
      <path d="M8 34h104" stroke={INK} strokeWidth="3" />
      <circle cx="18" cy="26" r="3" fill={CORAL} />
      <circle cx="27" cy="26" r="3" fill={LIME} />
      <circle cx="36" cy="26" r="3" fill={BLUE} />
      <rect x="18" y="44" width="44" height="8" rx="4" fill={INK} />
      <rect x="18" y="58" width="36" height="5" rx="2.5" fill="#d6d6de" />
      <rect x="18" y="74" width="30" height="12" rx="6" fill={BLUE} />
      <rect
        x="68"
        y="44"
        width="34"
        height="42"
        rx="6"
        fill={LIME}
        stroke={INK}
        strokeWidth="2.5"
      />
    </Svg>
  );
}

/** A phone with a like bubble: social media. */
export function SocialSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <Edge
        d="M36 8h40a8 8 0 0 1 8 8v88a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8V16a8 8 0 0 1 8-8z"
        fill="#fff"
      />
      <rect x="36" y="22" width="40" height="40" rx="5" fill={BLUE} />
      <rect x="36" y="68" width="30" height="5" rx="2.5" fill="#d6d6de" />
      <rect x="36" y="78" width="22" height="5" rx="2.5" fill="#d6d6de" />
      <Edge
        d="M84 42c10 0 20 7 20 17s-10 17-20 17l-9 6 2-8c-7-3-12-8-12-15 0-10 9-17 19-17z"
        fill={CORAL}
      />
      <path d="M84 66l-7-7a4.5 4.5 0 0 1 7-6a4.5 4.5 0 0 1 7 6z" fill="#fff" />
    </Svg>
  );
}

/** Colour swatches fanned out: brand. */
export function BrandSticker({ size = 120, className }) {
  return (
    <Svg size={size} className={className}>
      <g transform="rotate(-16 60 96)">
        <Edge d="M40 22h26v76H40z" fill={LIME} />
      </g>
      <g transform="rotate(4 60 96)">
        <Edge d="M48 16h26v80H48z" fill={BLUE} />
      </g>
      <g transform="rotate(22 60 96)">
        <Edge d="M56 22h26v76H56z" fill={CORAL} />
      </g>
      <Edge d="M60 82a12 12 0 1 1 0 24a12 12 0 0 1 0-24z" fill="#fff" />
      <circle cx="60" cy="94" r="4" fill={INK} />
    </Svg>
  );
}

/** One sticker per service, by the homepage's service id. */
export const STICKERS = {
  ads: TargetSticker,
  seo: SearchSticker,
  web: WebSticker,
  social: SocialSticker,
  brand: BrandSticker,
};
