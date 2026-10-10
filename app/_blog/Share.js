"use client";

import { useEffect, useState } from "react";
import { IconLinkedin, IconX } from "../components/socialIcons";
import { Check } from "../_home/icons";
import s from "./article.module.css";

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />
    </svg>
  );
}

/** Copy the link, or pass the article on to LinkedIn or X. */
export default function Share({ url, title, className = "" }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // older browsers, or a page that is not allowed the clipboard
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
  }

  const u = encodeURIComponent(url);
  return (
    <div className={`${s.share} ${className}`}>
      <p className={s.sideLabel}>Podelite tekst</p>
      <div className={s.shareRow}>
        <button
          type="button"
          className={s.copyBtn}
          data-done={copied ? "true" : undefined}
          onClick={copy}
        >
          {copied ? <Check size={16} strokeWidth={3} /> : <LinkIcon />}
          <span aria-live="polite">{copied ? "Kopirano" : "Kopiraj link"}</span>
        </button>
        <a
          className={s.shareBtn}
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Podelite na LinkedIn-u"
        >
          <IconLinkedin />
        </a>
        <a
          className={s.shareBtn}
          href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${u}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Podelite na X-u"
        >
          <IconX />
        </a>
      </div>
    </div>
  );
}
