"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MessageCircle, Send } from "lucide-react";

type Comment = { id: string; name: string; body: string; createdAt: string };
type Status = "idle" | "sending" | "pending" | "error";

function timeAgo(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Comments({ slug }: { slug: string }) {
  const [list, setList] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setList(d.comments ?? []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [slug]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setError("");

    try {
      const r = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name: fd.get("name"),
          body: fd.get("body"),
          _gotcha: fd.get("_gotcha"),
        }),
      });
      const d = await r.json().catch(() => null);
      if (r.ok) {
        form.reset();
        setStatus("pending");
      } else {
        setError(d?.error ?? "Couldn't post that. Try again.");
        setStatus("error");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and retry.");
      setStatus("error");
    }
  }

  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <MessageCircle className="h-5 w-5 text-accent-2" strokeWidth={2} />
        Comments
        {loaded && list.length > 0 && (
          <span className="text-sm font-normal text-muted">({list.length})</span>
        )}
      </h2>

      {/* Existing approved comments */}
      <div className="mt-5 grid gap-3">
        {loaded && list.length === 0 && (
          <p className="text-sm text-muted">
            No comments yet. Be the first to say something.
          </p>
        )}
        {list.map((c) => (
          <div key={c.id} className="glass rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">
                {c.name}
              </span>
              <span className="font-mono text-xs text-muted">
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
              {c.body}
            </p>
          </div>
        ))}
      </div>

      {/* Comment form */}
      {status === "pending" ? (
        <div className="glass mt-6 rounded-2xl p-5 text-center text-sm text-muted">
          Thanks. Your comment is in and will show up once it&apos;s approved.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="glass mt-6 rounded-2xl p-4 sm:p-5">
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />
          <input
            name="name"
            type="text"
            placeholder="Name (optional)"
            className="w-full rounded-xl border border-border bg-black/20 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60"
          />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Add to the conversation…"
            className="mt-3 w-full resize-y rounded-xl border border-border bg-black/20 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60"
          />
          {status === "error" && (
            <p className="mt-2 text-sm text-rose-400">{error}</p>
          )}
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Comments are reviewed before they appear.
            </p>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
              {status === "sending" ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
