"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bug,
  Rocket,
  Cpu,
  Database,
  Cloud,
  GitBranch,
  Terminal,
  Coffee,
  type LucideIcon,
} from "lucide-react";

const ICONS: { key: string; Icon: LucideIcon }[] = [
  { key: "bug", Icon: Bug },
  { key: "rocket", Icon: Rocket },
  { key: "cpu", Icon: Cpu },
  { key: "db", Icon: Database },
  { key: "cloud", Icon: Cloud },
  { key: "git", Icon: GitBranch },
  { key: "terminal", Icon: Terminal },
  { key: "coffee", Icon: Coffee },
];
const PAIRS = ICONS.length;
const HISCORE_KEY = "memory:best";

type Card = { id: number; key: string; Icon: LucideIcon };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  return shuffle(
    [...ICONS, ...ICONS].map((c, id) => ({ id, key: c.key, Icon: c.Icon })),
  );
}

export default function MemoryMatch() {
  const [deck, setDeck] = useState<Card[]>(makeDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const b = localStorage.getItem(HISCORE_KEY);
    setBest(b ? Number(b) : null);
  }, []);

  const won = matched.length === PAIRS;

  useEffect(() => {
    if (won) {
      setBest((prev) => {
        const next = prev === null ? moves : Math.min(prev, moves);
        localStorage.setItem(HISCORE_KEY, String(next));
        return next;
      });
    }
  }, [won, moves]);

  const reset = () => {
    setDeck(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStarted(true);
  };

  const flip = (index: number) => {
    if (!started || flipped.length === 2) return;
    if (flipped.includes(index) || matched.includes(deck[index].key)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].key === deck[b].key) {
        setMatched((prev) => [...prev, deck[a].key]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  const isUp = (i: number) =>
    flipped.includes(i) || matched.includes(deck[i].key);

  const verdict = useMemo(() => {
    if (moves <= 10) return "Photographic memory.";
    if (moves <= 16) return "Sharp. Very sharp.";
    return "You got there. Eventually.";
  }, [moves]);

  return (
    <div>
      <p className="text-center text-xs text-muted">
        Flip cards, match the pairs in as few moves as possible.
      </p>

      <div className="mt-3 flex items-center justify-between font-mono text-xs">
        <span>
          moves <span className="gradient-text font-bold">{moves}</span>
        </span>
        <span className="text-muted">best {best ?? "—"}</span>
        <span className="text-muted">
          {matched.length}/{PAIRS}
        </span>
      </div>

      <div className="relative mx-auto mt-3 grid max-w-[16rem] grid-cols-4 gap-2 sm:max-w-[18rem]">
        {deck.map((card, i) => {
          const up = isUp(i);
          const Icon = card.Icon;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(i)}
              disabled={!started || up}
              aria-label={up ? card.key : "hidden card"}
              className={`flex aspect-square items-center justify-center rounded-xl border border-border transition-all ${
                up ? "bg-white/10" : "bg-white/5 active:scale-90"
              }`}
            >
              {up ? (
                <Icon
                  className="h-6 w-6 animate-[pop_0.18s_ease] text-accent-2"
                  strokeWidth={1.75}
                />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-muted/50" />
              )}
            </button>
          );
        })}

        {(!started || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 p-4 text-center backdrop-blur-sm">
            {won && (
              <>
                <p className="font-semibold">Solved in {moves} moves!</p>
                <p className="mt-1 text-xs text-muted">{verdict}</p>
              </>
            )}
            {!started && (
              <p className="text-xs text-muted">
                Match all {PAIRS} pairs of the stack.
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className="mt-3 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5"
            >
              {won ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
