"use client";

import { useState } from "react";
import { Hand, Scissors, Square } from "lucide-react";
import Shell from "./Shell";

const MOVES = [
  { key: "rock", label: "Rock", Icon: Square },
  { key: "paper", label: "Paper", Icon: Hand },
  { key: "scissors", label: "Scissors", Icon: Scissors },
] as const;

type MoveKey = (typeof MOVES)[number]["key"];

function beats(a: MoveKey, b: MoveKey): boolean {
  return (
    (a === "rock" && b === "scissors") ||
    (a === "paper" && b === "rock") ||
    (a === "scissors" && b === "paper")
  );
}

export default function RockPaperScissors() {
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ you: 0, cpu: 0 });

  function play(you: MoveKey) {
    const cpu = MOVES[Math.floor(Math.random() * 3)].key;
    if (you === cpu) {
      setResult(`Both picked ${you}. Draw.`);
    } else if (beats(you, cpu)) {
      setResult(`${you} beats ${cpu}. You win.`);
      setScore((s) => ({ ...s, you: s.you + 1 }));
    } else {
      setResult(`${cpu} beats ${you}. I win.`);
      setScore((s) => ({ ...s, cpu: s.cpu + 1 }));
    }
  }

  return (
    <Shell label="Rock paper scissors">
      <div className="flex gap-2">
        {MOVES.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => play(key)}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-border bg-white/5 px-3 py-3 text-xs font-medium text-muted transition-colors hover:text-foreground"
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted">{result ?? "Pick one."}</span>
        <span className="font-mono text-xs text-muted">
          you {score.you} : {score.cpu} me
        </span>
      </div>
    </Shell>
  );
}
