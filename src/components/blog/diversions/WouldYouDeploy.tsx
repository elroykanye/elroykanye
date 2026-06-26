"use client";

import { useState } from "react";
import Shell from "./Shell";

const PROMPTS: { q: string; yes: string; no: string }[] = [
  {
    q: "It's 4:55pm on a Friday. The fix is one line. Do you deploy?",
    yes: "Bold. The on-call engineer will remember you.",
    no: "Wise. Monday-you sends their regards.",
  },
  {
    q: "The tests pass but you don't know why. Ship it?",
    yes: "Living dangerously. At least write that down somewhere.",
    no: "Good instinct. Green for the wrong reason is still red.",
  },
  {
    q: "Comment the code, or let it 'speak for itself'?",
    yes: "Comment it. Future-you has the memory of a goldfish.",
    no: "Brave. The code never explains the why, only the what.",
  },
  {
    q: "Force push to a shared branch to clean up history?",
    yes: "Hope you warned the team. And have a reflog.",
    no: "Correct. Some sleeping dragons stay sleeping.",
  },
];

export default function WouldYouDeploy() {
  const [p] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);

  return (
    <Shell label="Be honest">
      <p className="text-sm font-medium text-foreground">{p.q}</p>
      {choice ? (
        <p className="mt-3 text-sm text-muted">
          {choice === "yes" ? p.yes : p.no}
        </p>
      ) : (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setChoice("yes")}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            Do it
          </button>
          <button
            type="button"
            onClick={() => setChoice("no")}
            className="rounded-lg border border-border bg-white/5 px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Absolutely not
          </button>
        </div>
      )}
    </Shell>
  );
}
