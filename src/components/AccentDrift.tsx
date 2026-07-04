"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Full hue rotation every ~5 minutes at rest, plus a nudge on each navigation.
const DRIFT_DEG_PER_MS = 360 / (5 * 60 * 1000);
const NAV_NUDGE_DEG = 45;
const EASE = 0.06;
const TICK_MS = 100;

// Must match --accent's oklch() lightness/chroma/base-hue in globals.css —
// this is the only accent used as a solid button background, so its
// contrast against button text is what --accent-ink is picked for.
const ACCENT_L = 0.78;
const ACCENT_C = 0.15;
const ACCENT_BASE_HUE = 265;

const FOREGROUND_LUMINANCE = 0.82; // ~#e8eaf2
const BACKGROUND_LUMINANCE = 0.0018; // ~#05060a

function oklchToLinearSrgb(l: number, c: number, hDeg: number) {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  return [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ] as const;
}

function relativeLuminance([r, g, b]: readonly [number, number, number]) {
  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(b);
}

function contrastRatio(a: number, b: number) {
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function inkForHue(hueShift: number) {
  const accentLuminance = relativeLuminance(
    oklchToLinearSrgb(ACCENT_L, ACCENT_C, ACCENT_BASE_HUE + hueShift)
  );
  const withForeground = contrastRatio(accentLuminance, FOREGROUND_LUMINANCE);
  const withBackground = contrastRatio(accentLuminance, BACKGROUND_LUMINANCE);
  return withForeground >= withBackground
    ? "var(--foreground)"
    : "var(--background)";
}

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
    root.style.setProperty("--accent-ink", inkForHue(start));

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
        root.style.setProperty("--accent-ink", inkForHue(s.current));
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
