"use client";

import { useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import BugSquash from "@/components/games/BugSquash";
import MemoryMatch from "@/components/games/MemoryMatch";
import ReactionTest from "@/components/games/ReactionTest";

const TABS = [
  { id: "bugs", label: "Bug Squash", emoji: "🐛" },
  { id: "memory", label: "Match the Stack", emoji: "🧠" },
  { id: "reaction", label: "Ship It", emoji: "🚀" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Games() {
  const [active, setActive] = useState<TabId>("bugs");

  return (
    <section id="play" className="scroll-mt-24 py-12">
      <SectionHeading index="04" title="The Arcade" />
      <p className="mt-3 text-sm text-muted">
        Three tiny games, because a portfolio shouldn&apos;t be a chore to read.
        High scores save to your browser. Go on, flex.
      </p>

      <Reveal>
        <div className="glass mt-6 rounded-3xl p-4 sm:p-6">
          {/* Tab selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  active === tab.id
                    ? "bg-accent text-white shadow-lg shadow-accent/30"
                    : "border border-border bg-white/5 text-muted hover:text-foreground"
                }`}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active game — only the mounted one runs its timers */}
          <div className="mt-5 rounded-2xl border border-border bg-black/20 p-4 sm:p-6">
            {active === "bugs" && <BugSquash />}
            {active === "memory" && <MemoryMatch />}
            {active === "reaction" && <ReactionTest />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
