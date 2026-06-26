"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { getVisitorId } from "@/lib/visitor";

export default function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const vid = getVisitorId();
    fetch(
      `/api/likes?slug=${encodeURIComponent(slug)}&visitorId=${encodeURIComponent(vid)}`,
    )
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count ?? 0);
        setLiked(Boolean(d.liked));
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [slug]);

  async function toggle() {
    const vid = getVisitorId();
    const wasLiked = liked;

    // Optimistic update.
    setLiked(!wasLiked);
    setCount((c) => c + (wasLiked ? -1 : 1));

    try {
      const r = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, visitorId: vid }),
      });
      const d = await r.json();
      if (r.ok && typeof d.count === "number") {
        setCount(d.count);
        setLiked(Boolean(d.liked));
      } else {
        // Revert on failure.
        setLiked(wasLiked);
        setCount((c) => c + (wasLiked ? 1 : -1));
      }
    } catch {
      setLiked(wasLiked);
      setCount((c) => c + (wasLiked ? 1 : -1));
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!ready}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this post" : "Like this post"}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 ${
        liked
          ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
          : "border-border bg-white/5 text-muted hover:text-foreground"
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-transform ${liked ? "scale-110 fill-current" : ""}`}
        strokeWidth={2}
      />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
