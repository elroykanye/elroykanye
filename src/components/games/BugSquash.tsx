"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bug, Gem, Bomb, type LucideIcon } from "lucide-react";

type Kind = "bug" | "gold" | "bomb";
type Cell = { kind: Kind; id: number; expires: number } | null;

const GRID = 9;
const GAME_SECONDS = 20;
const HISCORE_KEY = "bugsquash:hi";

const FACE: Record<Kind, LucideIcon> = { bug: Bug, gold: Gem, bomb: Bomb };
const COLOR: Record<Kind, string> = {
  bug: "text-emerald-400",
  gold: "text-amber-300",
  bomb: "text-rose-400",
};
const POINTS: Record<Kind, number> = { bug: 1, gold: 3, bomb: -2 };

function verdict(score: number): string {
  if (score <= 0) return "The bugs send their regards.";
  if (score < 8) return "Junior squasher. The linter is disappointed.";
  if (score < 16) return "Mid-level reflexes. The bugs respect you now.";
  if (score < 26) return "Senior squasher — promotion incoming.";
  return "Principal Bug Slayer. Apply to my team.";
}

export default function BugSquash() {
  const [cells, setCells] = useState<Cell[]>(Array(GRID).fill(null));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_SECONDS);
  const [running, setRunning] = useState(false);
  const [hi, setHi] = useState(0);
  const [shake, setShake] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    setHi(Number(localStorage.getItem(HISCORE_KEY) || 0));
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setTime(GAME_SECONDS);
    setCells(Array(GRID).fill(null));
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setCells(Array(GRID).fill(null));
      setHi((h) => {
        const next = Math.max(h, score);
        localStorage.setItem(HISCORE_KEY, String(next));
        return next;
      });
      return;
    }
    const t = setTimeout(() => setTime((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time, score]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCells((prev) => {
        const next = prev.map((c) => (c && c.expires < now ? null : c));
        const pressure = 1 - time / GAME_SECONDS;
        if (Math.random() < 0.14 + pressure * 0.22) {
          const empty = next.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0);
          if (empty.length) {
            const slot = empty[Math.floor(Math.random() * empty.length)];
            const roll = Math.random();
            const kind: Kind = roll > 0.88 ? "bomb" : roll > 0.72 ? "gold" : "bug";
            const life = kind === "gold" ? 850 : 1050 - pressure * 350;
            next[slot] = { kind, id: idRef.current++, expires: now + life };
          }
        }
        return next;
      });
    }, 110);
    return () => clearInterval(interval);
  }, [running, time]);

  const whack = (i: number) => {
    const cell = cells[i];
    if (!running || !cell) return;
    setScore((s) => s + POINTS[cell.kind]);
    if (cell.kind === "bomb") {
      setShake(true);
      setTimeout(() => setShake(false), 350);
    }
    setCells((prev) => {
      const next = [...prev];
      next[i] = null;
      return next;
    });
  };

  const idle = !running && time === GAME_SECONDS;
  const over = !running && time <= 0;

  return (
    <div className={shake ? "animate-[wiggle_0.35s_ease]" : ""}>
      <div className="flex items-center justify-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Bug className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2} /> +1
        </span>
        <span className="inline-flex items-center gap-1">
          <Gem className="h-3.5 w-3.5 text-amber-300" strokeWidth={2} /> +3
        </span>
        <span className="inline-flex items-center gap-1">
          <Bomb className="h-3.5 w-3.5 text-rose-400" strokeWidth={2} /> avoid
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-xs">
        <span>
          score <span className="gradient-text font-bold">{score}</span>
        </span>
        <span className="text-muted">best {hi}</span>
        <span className={time <= 5 && running ? "text-accent-3" : "text-muted"}>
          {time}s
        </span>
      </div>

      <div className="relative mx-auto mt-3 grid max-w-[15rem] grid-cols-3 gap-2 sm:max-w-[17rem]">
        {cells.map((cell, i) => {
          const Icon = cell ? FACE[cell.kind] : null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => whack(i)}
              disabled={!running}
              aria-label={cell ? `Squash ${cell.kind}` : "empty"}
              className="flex aspect-square items-center justify-center rounded-xl border border-border bg-white/5 transition-transform active:scale-90 disabled:cursor-default"
            >
              {Icon && cell && (
                <Icon
                  className={`h-7 w-7 animate-[pop_0.18s_ease] ${COLOR[cell.kind]}`}
                  strokeWidth={2}
                />
              )}
            </button>
          );
        })}

        {(idle || over) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/70 p-4 text-center backdrop-blur-sm">
            {over && (
              <>
                <p className="font-semibold">Time! Scored {score}.</p>
                <p className="mt-1 text-xs text-muted">{verdict(score)}</p>
              </>
            )}
            {idle && (
              <p className="text-xs text-muted">
                The bugs won&apos;t squash themselves.
              </p>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-3 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5"
            >
              {over ? "Play again" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
