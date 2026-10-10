"use client";

import { useEffect, useRef, useState } from "react";

/** An image in the text, with its caption. If the file is gone (an upload
    left behind on an old host), the figure steps aside instead of leaving a
    broken frame and a caption about nothing. */
export default function Figure({ caption, className, ...img }) {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);

  // An image can fail before React is listening; catch that case too.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth === 0) setGone(true);
  }, []);

  if (gone) return null;
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        loading="lazy"
        decoding="async"
        onError={() => setGone(true)}
        {...img}
        alt={img.alt ?? ""}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
