"use client";

import { useState, type FormEvent } from "react";
import Shell from "./Shell";

export default function NumberGuess() {
  const [target] = useState(() => 1 + Math.floor(Math.random() * 50));
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("I'm thinking of a number from 1 to 50.");
  const [tries, setTries] = useState(0);
  const [won, setWon] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = Number(guess);
    if (!n || won) return;
    const t = tries + 1;
    setTries(t);
    if (n === target) {
      setHint(`Got it in ${t} ${t === 1 ? "try" : "tries"}. It was ${target}.`);
      setWon(true);
    } else if (n < target) {
      setHint("Higher.");
    } else {
      setHint("Lower.");
    }
    setGuess("");
  }

  return (
    <Shell label="Guess the number">
      <p className="text-sm text-muted">{hint}</p>
      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          type="number"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          disabled={won}
          placeholder="?"
          className="w-24 rounded-lg border border-border bg-black/20 px-3 py-2 text-sm outline-none focus:border-accent/60"
        />
        <button
          type="submit"
          disabled={won}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          Guess
        </button>
      </form>
    </Shell>
  );
}
