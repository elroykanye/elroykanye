"use client";

import { useEffect, useState } from "react";
import { currently } from "@/lib/site";

export default function CurrentlyTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((value) => (value + 1) % currently.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-baseline">
      <span className="field-label text-forest">Currently</span>
      <span className="text-sm leading-relaxed text-muted" aria-live="polite">
        {currently[index]}
      </span>
    </div>
  );
}
