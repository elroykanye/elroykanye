"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Full hue rotation every ~5 minutes at rest, plus a nudge on each navigation.
const DRIFT_DEG_PER_MS = 360 / (5 * 60 * 1000);
const NAV_NUDGE_DEG = 45;
const EASE = 0.06;
const TICK_MS = 100;

export default function AccentDrift() {
  const pathname = usePathname();
  const state = useRef({ current: 0, target: 0, prevPath: pathname });
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const root = document.documentElement;
    const start = Math.random() * 360;
    state.current.current = start;
    state.current.target = start;
    root.style.setProperty("--hue-shift", start.toFixed(2));

    if (reducedMotion.current) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      if (dt >= TICK_MS) {
        last = now;
        const s = state.current;
        s.target += DRIFT_DEG_PER_MS * dt;
        s.current += (s.target - s.current) * EASE;
        root.style.setProperty("--hue-shift", s.current.toFixed(2));
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (pathname === state.current.prevPath) return;
    state.current.prevPath = pathname;
    if (reducedMotion.current) return;
    state.current.target += NAV_NUDGE_DEG;
  }, [pathname]);

  return null;
}
