"use client";

import { useState } from "react";
import { Bug, Brain, Rocket, type LucideIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import BugSquash from "@/components/games/BugSquash";
import MemoryMatch from "@/components/games/MemoryMatch";
import ReactionTest from "@/components/games/ReactionTest";

const TABS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "bugs", label: "Bug Squash", Icon: Bug },
  { id: "memory", label: "Match the Stack", Icon: Brain },
  { id: "reaction", label: "Ship It", Icon: Rocket },
];

type TabId = (typeof TABS)[number]["id"];

export default function Games() {
  const [active, setActive] = useState<TabId>("bugs");

  return (
    <section id="play" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeading index="07" title="The Arcade" />
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
        Three tiny games, because a portfolio shouldn&apos;t be a chore to read.
        High scores save to your browser. Go on, flex.
      </p>

      <Reveal>
        <div className="mt-8 border border-ink bg-ink p-4 text-paper sm:p-6">
          {/* Tab selector */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                aria-pressed={active === tab.id}
                className={`flex min-h-11 shrink-0 items-center gap-1.5 border px-4 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
                  active === tab.id
                    ? "border-signal bg-signal text-ink"
                    : "border-paper/25 bg-transparent text-paper/65 hover:border-paper/60 hover:text-paper"
                }`}
              >
                <tab.Icon className="h-4 w-4" strokeWidth={2} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active game — only the mounted one runs its timers */}
          <div className="mt-5 border border-paper/25 bg-paper/[0.04] p-4 sm:p-6">
            {active === "bugs" && <BugSquash />}
            {active === "memory" && <MemoryMatch />}
            {active === "reaction" && <ReactionTest />}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
