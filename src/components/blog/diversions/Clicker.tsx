"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";
import Shell from "./Shell";

const DURATION = 5;

export default function Clicker() {
  const [running, setRunning] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [best, setBest] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function start() {
    setClicks(0);
    setLeft(DURATION);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setClicks((c) => {
            setBest((b) => (b === null || c > b ? c : b));
            return c;
          });
          return 0;
        }
        return l - 1;
      });
    }, 1000);
  }

  return (
    <Shell label="Click race">
      <p className="text-sm text-muted">
        How many clicks in {DURATION} seconds? Go.
      </p>
      <button
        type="button"
        onClick={() => (running ? setClicks((c) => c + 1) : start())}
        className="mt-3 flex h-24 w-full flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white/5 text-foreground transition-colors hover:border-accent/40"
      >
        <MousePointerClick className="h-6 w-6 text-accent-2" strokeWidth={2} />
        <span className="text-2xl font-bold tabular-nums">{clicks}</span>
        <span className="text-xs text-muted">
          {running ? `${left}s left` : "Click to start"}
        </span>
      </button>
      {best !== null && !running && (
        <p className="mt-2 text-center text-xs text-muted">Best: {best}</p>
      )}
    </Shell>
  );
}
