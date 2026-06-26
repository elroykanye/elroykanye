"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Shell from "./Shell";

type Q = {
  q: string;
  code?: string;
  options: string[];
  answer: number;
  why: string;
};

const BANK: Q[] = [
  {
    q: "What does this log?",
    code: "console.log(0.1 + 0.2 === 0.3);",
    options: ["true", "false", "NaN", "TypeError"],
    answer: 1,
    why: "Floating point math. 0.1 + 0.2 is 0.30000000000000004, not exactly 0.3.",
  },
  {
    q: "Time complexity of a binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
    why: "You halve the search space each step, so it is logarithmic.",
  },
  {
    q: "What does typeof NaN return in JavaScript?",
    options: ['"number"', '"NaN"', '"undefined"', '"object"'],
    answer: 0,
    why: "NaN is, ironically, of type number.",
  },
  {
    q: "Which HTTP method is NOT idempotent?",
    options: ["GET", "PUT", "DELETE", "POST"],
    answer: 3,
    why: "POST typically creates a new resource each time it is called.",
  },
  {
    q: "What does this evaluate to?",
    code: "'5' + 3",
    options: ['"53"', "8", '"8"', "NaN"],
    answer: 0,
    why: "The + operator with a string concatenates, so you get the string '53'.",
  },
  {
    q: "And this one?",
    code: "'5' - 3",
    options: ['"2"', "2", "NaN", '"53"'],
    answer: 1,
    why: "The - operator coerces the string to a number, giving the number 2.",
  },
  {
    q: "Which data structure is LIFO (last in, first out)?",
    options: ["Queue", "Stack", "Heap", "Linked list"],
    answer: 1,
    why: "A stack pushes and pops from the same end.",
  },
  {
    q: "Default port for PostgreSQL?",
    options: ["3306", "5432", "6379", "27017"],
    answer: 1,
    why: "5432 for Postgres. 3306 is MySQL, 6379 Redis, 27017 MongoDB.",
  },
  {
    q: "The HTTP status code 418 means...",
    options: ["Too Many Requests", "I'm a teapot", "Gone", "Payment Required"],
    answer: 1,
    why: "418 I'm a teapot, from an April Fools RFC that refuses to die.",
  },
  {
    q: "Which of these is truthy in JavaScript?",
    options: ['0', '""', "[]", "NaN"],
    answer: 2,
    why: "An empty array is truthy. The other three are falsy.",
  },
  {
    q: "Within a single Kafka partition, messages are...",
    options: ["Unordered", "Ordered", "Deduplicated", "Encrypted"],
    answer: 1,
    why: "Ordering is guaranteed within a partition, not across partitions.",
  },
  {
    q: "git command to undo the last commit but keep the changes staged?",
    options: [
      "git reset --hard HEAD~1",
      "git reset --soft HEAD~1",
      "git revert HEAD",
      "git checkout HEAD~1",
    ],
    answer: 1,
    why: "--soft moves the branch back but leaves your changes staged. --hard would discard them.",
  },
  {
    q: "What does Boolean('false') return?",
    options: ["false", "true", "TypeError", "undefined"],
    answer: 1,
    why: "Any non-empty string is truthy, even the string 'false'.",
  },
  {
    q: "Default port for HTTPS?",
    options: ["80", "443", "8080", "22"],
    answer: 1,
    why: "443 for HTTPS, 80 for HTTP, 22 for SSH.",
  },
];

export default function QuizCard() {
  const [q] = useState(() => BANK[Math.floor(Math.random() * BANK.length)]);
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  const correct = picked === q.answer;

  return (
    <Shell label="Quick quiz">
      <p className="text-sm font-medium text-foreground">{q.q}</p>
      {q.code && (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-black/50 p-3 font-mono text-xs text-accent-2">
          {q.code}
        </pre>
      )}
      <div className="mt-3 grid gap-2">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          let cls =
            "border-border bg-white/5 text-muted hover:text-foreground";
          if (done && isAnswer)
            cls = "border-emerald-400/50 bg-emerald-400/10 text-emerald-300";
          else if (done && isPicked)
            cls = "border-rose-400/50 bg-rose-400/10 text-rose-300";
          return (
            <button
              key={i}
              type="button"
              disabled={done}
              onClick={() => setPicked(i)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left font-mono text-sm transition-colors ${cls}`}
            >
              <span>{opt}</span>
              {done && isAnswer && <Check className="h-4 w-4" strokeWidth={2} />}
              {done && isPicked && !isAnswer && (
                <X className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          );
        })}
      </div>
      {done && (
        <p className="mt-3 text-sm text-muted">
          <span
            className={`font-semibold ${correct ? "text-emerald-300" : "text-rose-300"}`}
          >
            {correct ? "Nailed it. " : "Not quite. "}
          </span>
          {q.why}
        </p>
      )}
    </Shell>
  );
}
