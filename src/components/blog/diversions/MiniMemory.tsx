"use client";

import { useState } from "react";
import { Bug, Rocket, Cpu, Database, type LucideIcon } from "lucide-react";
import Shell from "./Shell";

const ICONS: { key: string; Icon: LucideIcon }[] = [
  { key: "bug", Icon: Bug },
  { key: "rocket", Icon: Rocket },
  { key: "cpu", Icon: Cpu },
  { key: "db", Icon: Database },
];

type Card = { id: number; key: string; Icon: LucideIcon };

function shuffle(): Card[] {
  const pairs = [...ICONS, ...ICONS].map((c, i) => ({ ...c, id: i }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

export default function MiniMemory() {
  const [cards] = useState(shuffle);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  function flip(idx: number) {
    if (flipped.length === 2 || flipped.includes(idx)) return;
    if (matched.includes(cards[idx].key)) return;

    const next = [...flipped, idx];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a].key === cards[b].key) {
        setMatched((m) => [...m, cards[a].key]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  const won = matched.length === ICONS.length;

  return (
    <Shell label="Memory match">
      <p className="text-sm text-muted">
        {won ? `Cleared in ${moves} moves.` : "Find all four pairs."}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {cards.map((card, idx) => {
          const show =
            flipped.includes(idx) || matched.includes(card.key);
          const Icon = card.Icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(idx)}
              className={`flex aspect-square items-center justify-center rounded-lg border transition-colors ${
                show
                  ? "border-accent/50 bg-accent/10 text-accent-2"
                  : "border-border bg-white/5 text-transparent hover:border-accent/30"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </button>
          );
        })}
      </div>
    </Shell>
  );
}
