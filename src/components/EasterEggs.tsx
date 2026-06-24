"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const RAIN = ["🐛", "🚀", "🪲", "✨", "☕", "💾", "🧠", "🦄"];

type Drop = { id: number; left: number; emoji: string; delay: number; dur: number };

export default function EasterEggs() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Friendly console message for the curious (hi, fellow dev 👋).
  useEffect(() => {
    console.log(
      `%c👋 Hey, you opened the console.%c\nLike what you see? The whole site is hand-built with Next.js.\nPsst — try the Konami code on the page. ↑↑↓↓←→←→ B A\n— ${siteConfig.name}`,
      "font-size:14px;font-weight:bold;color:#7c83ff",
      "font-size:12px;color:#9aa3b8",
    );
  }, []);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        rain();
      }
    };
    const rain = () => {
      const next: Drop[] = Array.from({ length: 60 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        emoji: RAIN[Math.floor(Math.random() * RAIN.length)],
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 2,
      }));
      setDrops(next);
      setToast("🎉 You found the secret. Respect.");
      setTimeout(() => setDrops([]), 5000);
      setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {drops.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden>
          {drops.map((d) => (
            <span
              key={d.id}
              className="absolute top-[-10vh] text-2xl"
              style={{
                left: `${d.left}vw`,
                animation: `fall ${d.dur}s linear ${d.delay}s forwards`,
              }}
            >
              {d.emoji}
            </span>
          ))}
        </div>
      )}
      {toast && (
        <div className="glass fixed bottom-6 left-1/2 z-[61] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium">
          {toast}
        </div>
      )}
    </>
  );
}
