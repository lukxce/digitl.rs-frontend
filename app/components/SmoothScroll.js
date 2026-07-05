"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function shouldEnableLenis() {
  if (typeof window === "undefined") {
    return false;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const mobileViewport = window.matchMedia("(max-width: 768px)").matches;

  return !reduceMotion && !mobileViewport;
}

/**
 * Lenis keeps its own scroll position, so on route change the page could
 * stay scrolled where the previous page was (or land mid-lerp). Reset to
 * top on navigation — except for anchor links and back/forward, where the
 * browser/Lenis anchor handling should win.
 */
function ScrollToTopOnRouteChange() {
  const lenis = useLenis();
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const isHistoryNav = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNav.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isHistoryNav.current) {
      isHistoryNav.current = false;
      return;
    }
    if (window.location.hash) {
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mediaQueries = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 768px)"),
    ];

    const update = () => setEnabled(shouldEnableLenis());

    update();
    for (const mediaQuery of mediaQueries) {
      mediaQuery.addEventListener("change", update);
    }

    return () => {
      for (const mediaQuery of mediaQueries) {
        mediaQuery.removeEventListener("change", update);
      }
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    import("lenis/dist/lenis.css");
  }, [enabled]);

  if (!enabled) {
    return children;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        duration: 1.4,
        smoothWheel: true,
        anchors: true,
      }}
    >
      <ScrollToTopOnRouteChange />
      {children}
    </ReactLenis>
  );
}
