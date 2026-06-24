"use client";

import { useEffect, useState } from "react";
import { currently } from "@/lib/site";

// A little "currently" status line that cycles every few seconds.
export default function CurrentlyTicker() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((prev) => (prev + 1) % currently.length);
        setShow(true);
      }, 300);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm">
      <span className="font-mono text-xs text-muted">currently</span>
      <span
        className={`text-foreground/90 transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {currently[i]}
      </span>
    </div>
  );
}
