"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import Shell from "./Shell";

const RIDDLES: { q: string; a: string }[] = [
  {
    q: "I am everywhere in your code but I weigh nothing, I separate everything but join nothing. What am I?",
    a: "Whitespace.",
  },
  {
    q: "The more you take from me, the bigger I get. What am I?",
    a: "A hole. (Also a tech-debt backlog.)",
  },
  {
    q: "I have keys but open no locks, I have space but no room, you can enter but cannot go inside. What am I?",
    a: "A keyboard.",
  },
  {
    q: "I am told a thousand times a day and believed every time, even though I am almost never true. What am I?",
    a: "“It works on my machine.”",
  },
  {
    q: "I am born from a question mark and a colon, and I make seniors squint. What am I?",
    a: "A nested ternary.",
  },
  {
    q: "Forward I am heavy, backward I am not. What word am I?",
    a: "“ton” (reverse it and you get “not”).",
  },
  {
    q: "I run without legs, I have a head and a tail but no body. What am I?",
    a: "A coin. (Also a git branch, if you squint.)",
  },
  {
    q: "Two developers fixed me at the same time. Now I exist twice and neither of them is happy. What am I?",
    a: "A merge conflict.",
  },
];

export default function RiddleCard() {
  const [r] = useState(
    () => RIDDLES[Math.floor(Math.random() * RIDDLES.length)],
  );
  const [shown, setShown] = useState(false);

  return (
    <Shell label="A riddle, while you're here">
      <p className="text-sm leading-relaxed text-foreground">{r.q}</p>
      {shown ? (
        <p className="mt-3 text-sm font-medium text-accent-2">{r.a}</p>
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <Eye className="h-4 w-4" strokeWidth={2} />
          Reveal answer
        </button>
      )}
    </Shell>
  );
}
