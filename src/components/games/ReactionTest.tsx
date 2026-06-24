"use client";

import { useEffect, useRef, useState } from "react";
import { Rocket, Bug } from "lucide-react";

const HISCORE_KEY = "reaction:best";
type Phase = "idle" | "waiting" | "go" | "tooSoon" | "done";

export default function ReactionTest() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startAt = useRef(0);

  useEffect(() => {
    const b = localStorage.getItem(HISCORE_KEY);
    setBest(b ? Number(b) : null);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const arm = () => {
    setPhase("waiting");
    const delay = 1200 + Math.random() * 2800;
    timeout.current = setTimeout(() => {
      startAt.current = performance.now();
      setPhase("go");
    }, delay);
  };

  const tap = () => {
    if (phase === "idle" || phase === "done" || phase === "tooSoon") {
      arm();
      return;
    }
    if (phase === "waiting") {
      if (timeout.current) clearTimeout(timeout.current);
      setPhase("tooSoon");
      return;
    }
    if (phase === "go") {
      const reaction = Math.round(performance.now() - startAt.current);
      setMs(reaction);
      setPhase("done");
      setBest((prev) => {
        const next = prev === null ? reaction : Math.min(prev, reaction);
        localStorage.setItem(HISCORE_KEY, String(next));
        return next;
      });
    }
  };

  const palette: Record<Phase, string> = {
    idle: "bg-white/5 border-border",
    waiting: "bg-rose-500/20 border-rose-400/40",
    go: "bg-emerald-500/25 border-emerald-400/50",
    tooSoon: "bg-amber-500/20 border-amber-400/40",
    done: "bg-white/5 border-border",
  };

  const verdict =
    ms < 220
      ? "Inhumanly fast. Are you a bot?"
      : ms < 300
        ? "Production-grade reflexes."
        : ms < 400
          ? "Solid. Ship it."
          : "Works on my machine.";

  return (
    <div>
      <p className="text-center text-xs text-muted">
        Wait for green, then tap to <span className="font-mono">ship</span>. Tap
        on red and you shipped a bug.
      </p>

      <div className="mt-3 flex items-center justify-center font-mono text-xs text-muted">
        best {best !== null ? `${best} ms` : "—"}
      </div>

      <button
        type="button"
        onClick={tap}
        className={`mt-3 flex min-h-[12rem] w-full flex-col items-center justify-center rounded-2xl border p-6 text-center transition-colors ${palette[phase]}`}
      >
        {phase === "idle" && (
          <span className="text-sm text-muted">Tap to arm. Then wait…</span>
        )}
        {phase === "waiting" && (
          <span className="text-lg font-semibold">Wait for green…</span>
        )}
        {phase === "go" && (
          <span className="inline-flex items-center gap-2 text-2xl font-bold gradient-text">
            <Rocket className="h-6 w-6" strokeWidth={2} /> SHIP IT!
          </span>
        )}
        {phase === "tooSoon" && (
          <>
            <span className="inline-flex items-center gap-2 text-lg font-semibold">
              <Bug className="h-5 w-5 text-rose-400" strokeWidth={2} /> Too soon!
            </span>
            <span className="mt-1 text-xs text-muted">
              You shipped on red. Tap to retry.
            </span>
          </>
        )}
        {phase === "done" && (
          <>
            <span className="text-3xl font-bold gradient-text">{ms} ms</span>
            <span className="mt-1 text-xs text-muted">{verdict}</span>
            <span className="mt-2 text-xs text-muted">Tap to go again.</span>
          </>
        )}
      </button>
    </div>
  );
}
