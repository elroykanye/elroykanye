"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    // Native share sheet on mobile / supported browsers.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled — fall through to copy.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; nothing more we can do gracefully.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-400" strokeWidth={2} />
      ) : (
        <Share2 className="h-4 w-4" strokeWidth={2} />
      )}
      {copied ? "Link copied" : "Share"}
    </button>
  );
}
