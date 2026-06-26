"use client";

import { useRef, useState } from "react";
import Shell from "./Shell";

type Phase = "idle" | "waiting" | "go" | "tooSoon" | "done";

export default function ReactionGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState(0);
  const startRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    setPhase("waiting");
    const delay = 1000 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  }

  function click() {
    if (phase === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("tooSoon");
    } else if (phase === "go") {
      setMs(Math.round(performance.now() - startRef.current));
      setPhase("done");
    }
  }

  const surface =
    phase === "go"
      ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
      : phase === "waiting"
        ? "border-rose-400/40 bg-rose-400/10 text-rose-200"
        : "border-border bg-white/5 text-muted";

  return (
    <Shell label="Reaction test">
      <p className="text-sm text-muted">
        Click when the box turns green. No cheating.
      </p>
      <button
        type="button"
        onClick={phase === "idle" || phase === "done" || phase === "tooSoon" ? start : click}
        className={`mt-3 flex h-24 w-full items-center justify-center rounded-xl border text-sm font-medium transition-colors ${surface}`}
      >
        {phase === "idle" && "Click to start"}
        {phase === "waiting" && "Wait for green..."}
        {phase === "go" && "CLICK!"}
        {phase === "tooSoon" && "Too soon. Click to retry."}
        {phase === "done" && `${ms} ms. Click to go again.`}
      </button>
    </Shell>
  );
}
