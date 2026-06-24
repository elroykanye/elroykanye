"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  Rocket,
  Star,
  Sparkles,
  Cpu,
  Database,
  Coffee,
  Heart,
  type LucideIcon,
} from "lucide-react";
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

const RAIN: LucideIcon[] = [Bug, Rocket, Star, Sparkles, Cpu, Database, Coffee, Heart];
const COLORS = ["text-accent", "text-accent-2", "text-accent-3", "text-emerald-400", "text-amber-300"];

type Drop = {
  id: number;
  left: number;
  Icon: LucideIcon;
  color: string;
  delay: number;
  dur: number;
};

export default function EasterEggs() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Friendly console message for the curious.
  useEffect(() => {
    console.log(
      `%cHey, you opened the console.%c\nLike what you see? The whole site is hand-built with Next.js.\nPsst — try the Konami code on the page. Up Up Down Down Left Right Left Right B A\n— ${siteConfig.name}`,
      "font-size:14px;font-weight:bold;color:#7c83ff",
      "font-size:12px;color:#9aa3b8",
    );
  }, []);

  useEffect(() => {
    let idx = 0;
    const rain = () => {
      const next: Drop[] = Array.from({ length: 60 }, (_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 100,
        Icon: RAIN[Math.floor(Math.random() * RAIN.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 2,
      }));
      setDrops(next);
      setToast("You found the secret. Respect.");
      setTimeout(() => setDrops([]), 5000);
      setTimeout(() => setToast(null), 3500);
    };
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = key === KONAMI[idx] ? idx + 1 : key === KONAMI[0] ? 1 : 0;
      if (idx === KONAMI.length) {
        idx = 0;
        rain();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {drops.length > 0 && (
        <div
          className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
          aria-hidden
        >
          {drops.map((d) => {
            const Icon = d.Icon;
            return (
              <span
                key={d.id}
                className={`absolute top-[-10vh] ${d.color}`}
                style={{
                  left: `${d.left}vw`,
                  animation: `fall ${d.dur}s linear ${d.delay}s forwards`,
                }}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
            );
          })}
        </div>
      )}
      {toast && (
        <div className="glass fixed bottom-6 left-1/2 z-[61] inline-flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-accent-2" strokeWidth={2} />
          {toast}
        </div>
      )}
    </>
  );
}
