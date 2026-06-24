"use client";

import { useEffect, useMemo, useState } from "react";

const ICONS = ["🐛", "🚀", "🪲", "☕", "💾", "🧠", "⚙️", "🦄"];
const HISCORE_KEY = "memory:best";

type Card = { id: number; icon: string };

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
    [...ICONS, ...ICONS].map((icon, id) => ({ id, icon })),
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

  const won = matched.length === ICONS.length;

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
    if (flipped.includes(index) || matched.includes(deck[index].icon)) return;

    const next = [...flipped, index];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].icon === deck[b].icon) {
        setMatched((prev) => [...prev, deck[a].icon]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  const isUp = (i: number) =>
    flipped.includes(i) || matched.includes(deck[i].icon);

  const verdict = useMemo(() => {
    if (moves <= 10) return "Photographic memory. 🧠";
    if (moves <= 16) return "Sharp. Very sharp.";
    return "You got there. Eventually. 😅";
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
          {matched.length}/{ICONS.length}
        </span>
      </div>

      <div className="relative mx-auto mt-3 grid max-w-[16rem] grid-cols-4 gap-2 sm:max-w-[18rem]">
        {deck.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(i)}
            disabled={!started || isUp(i)}
            aria-label={isUp(i) ? card.icon : "hidden card"}
            className={`flex aspect-square items-center justify-center rounded-xl border border-border text-2xl transition-all ${
              isUp(i)
                ? "bg-white/10"
                : "bg-white/5 active:scale-90"
            }`}
          >
            <span className={isUp(i) ? "animate-[pop_0.18s_ease]" : "opacity-0"}>
              {isUp(i) ? card.icon : "?"}
            </span>
          </button>
        ))}

        {(!started || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 p-4 text-center backdrop-blur-sm">
            {won && (
              <>
                <p className="font-semibold">Solved in {moves} moves!</p>
                <p className="mt-1 text-xs text-muted">{verdict}</p>
              </>
            )}
            {!started && (
              <p className="text-xs text-muted">Match all 8 pairs of the stack.</p>
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
