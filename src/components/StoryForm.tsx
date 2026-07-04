"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

type Status = "idle" | "sending" | "done" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent/60 focus:bg-black/30";

export default function StoryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          role: fd.get("role"),
          email: fd.get("email"),
          story: fd.get("story"),
          canShare: fd.get("canShare") === "yes",
          _gotcha: fd.get("_gotcha"),
        }),
      });

      if (res.ok) {
        setStatus("done");
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        setError(
          data?.error ??
            "Something went wrong sending that. Please try again, or email me directly.",
        );
        setStatus("error");
      }
    } catch {
      setError(
        "Couldn't reach the server. Check your connection and try again, or email me directly.",
      );
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="glass rounded-3xl p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-400" strokeWidth={1.75} />
        <h3 className="mt-4 text-xl font-semibold">Thank you, got it.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Your story is saved and I read every single one. The best of them
          shape what I write next. Truly, thank you for trusting me with it.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent transition-colors hover:text-accent-2"
        >
          Share another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-3xl p-6 sm:p-8">
      {/* Honeypot — bots fill this, humans never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">
            Name <span className="text-muted">(optional)</span>
          </span>
          <input
            name="name"
            type="text"
            placeholder="Or stay anonymous"
            className={`mt-2 ${inputClass}`}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-foreground">
            Role &amp; city <span className="text-muted">(optional)</span>
          </span>
          <input
            name="role"
            type="text"
            placeholder="e.g. Backend dev, Buea"
            className={`mt-2 ${inputClass}`}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-foreground">
          Email <span className="text-muted">(optional, only if you want a reply)</span>
        </span>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          className={`mt-2 ${inputClass}`}
        />
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-foreground">Your story</span>
        <textarea
          name="story"
          required
          rows={7}
          placeholder="What happened? The fees, the outages, the doubt, the door that finally opened. Tell it your way."
          className={`mt-2 resize-y ${inputClass}`}
        />
      </label>

      <label className="mt-4 flex items-start gap-3 text-sm text-muted">
        <input
          name="canShare"
          type="checkbox"
          value="yes"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border bg-black/20 accent-[var(--accent)]"
        />
        <span>
          You may quote my story (anonymously unless I gave my name) in a blog
          post.
        </span>
      </label>

      {status === "error" && (
        <p className="mt-4 flex items-start gap-2 text-sm text-rose-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
          <span>
            {error}{" "}
            <a
              href={`mailto:${siteConfig.email}?subject=My developer story`}
              className="underline hover:text-foreground"
            >
              Email it instead.
            </a>
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-accent/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <Send className="h-4 w-4" strokeWidth={2} />
        {status === "sending" ? "Sending…" : "Share my story"}
      </button>
    </form>
  );
}
