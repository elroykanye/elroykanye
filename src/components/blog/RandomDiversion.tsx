"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DIVERSIONS } from "./diversions/registry";

// On mount, pick a random diversion and splice it in after a random paragraph
// of the post body. Runs client-side only, so there is no hydration mismatch
// and it reshuffles on every page load.
export default function RandomDiversion() {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [Picked, setPicked] = useState<React.ComponentType | null>(null);
  const placed = useRef(false);

  useEffect(() => {
    if (placed.current) return; // guard against StrictMode double-invoke
    const content = document.querySelector("[data-post-content]");
    if (!content) return;

    const paragraphs = Array.from(
      content.querySelectorAll(":scope > p"),
    ) as HTMLElement[];
    if (paragraphs.length < 3) return; // too short to bother

    // Insert somewhere in the body, never right at the very start or end.
    const min = 1;
    const max = paragraphs.length - 1;
    const idx = min + Math.floor(Math.random() * (max - min));

    const holder = document.createElement("div");
    holder.className = "not-prose my-8";
    paragraphs[idx].after(holder);
    placed.current = true;

    const Comp = DIVERSIONS[Math.floor(Math.random() * DIVERSIONS.length)];
    setPicked(() => Comp);
    setMount(holder);

    return () => {
      holder.remove();
      placed.current = false;
    };
  }, []);

  if (!mount || !Picked) return null;
  return createPortal(<Picked />, mount);
}
