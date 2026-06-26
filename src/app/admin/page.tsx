"use client";

import { useCallback, useEffect, useState } from "react";

type PendingComment = {
  id: string;
  postSlug: string;
  name: string;
  body: string;
  createdAt: string;
};

type Submission = {
  id: string;
  name: string | null;
  role: string | null;
  email: string | null;
  story: string;
  canShare: boolean;
  createdAt: string;
};

const TOKEN_KEY = "adminToken";

function fmt(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState<PendingComment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const load = useCallback(async (t: string) => {
    const r = await fetch("/api/admin", {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (r.status === 401) {
      setError("Wrong password.");
      setAuthed(false);
      sessionStorage.removeItem(TOKEN_KEY);
      return;
    }
    const d = await r.json();
    setComments(d.pendingComments ?? []);
    setSubmissions(d.submissions ?? []);
    setAuthed(true);
    setError("");
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      load(saved).catch(() => {});
    }
  }, [load]);

  async function signIn() {
    sessionStorage.setItem(TOKEN_KEY, token);
    await load(token).catch(() => setError("Couldn't reach the server."));
  }

  async function act(action: string, id: string) {
    await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, id }),
    });
    await load(token);
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Enter your admin password to moderate comments and read story
          submissions.
        </p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && signIn()}
          placeholder="Password"
          className="mt-5 w-full rounded-xl border border-border bg-black/20 px-4 py-3 text-sm outline-none focus:border-accent/60"
        />
        {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
        <button
          type="button"
          onClick={signIn}
          className="mt-4 rounded-xl bg-accent px-5 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30"
        >
          Sign in
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Admin</h1>

      {/* Pending comments */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold">
          Pending comments{" "}
          <span className="text-sm font-normal text-muted">
            ({comments.length})
          </span>
        </h2>
        <div className="mt-4 grid gap-3">
          {comments.length === 0 && (
            <p className="text-sm text-muted">Nothing waiting. All clear.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3 text-xs text-muted">
                <span>
                  <span className="font-semibold text-foreground">{c.name}</span>{" "}
                  on <span className="font-mono">{c.postSlug}</span>
                </span>
                <span className="font-mono">{fmt(c.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                {c.body}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => act("approve", c.id)}
                  className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => act("deleteComment", c.id)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-rose-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story submissions */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold">
          Story submissions{" "}
          <span className="text-sm font-normal text-muted">
            ({submissions.length})
          </span>
        </h2>
        <div className="mt-4 grid gap-3">
          {submissions.length === 0 && (
            <p className="text-sm text-muted">No stories yet.</p>
          )}
          {submissions.map((s) => (
            <div key={s.id} className="glass rounded-2xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>
                  <span className="font-semibold text-foreground">
                    {s.name || "Anonymous"}
                  </span>
                  {s.role ? ` · ${s.role}` : ""}
                  {s.email ? ` · ${s.email}` : ""}
                </span>
                <span className="font-mono">{fmt(s.createdAt)}</span>
              </div>
              {s.canShare && (
                <p className="mt-1 text-xs font-medium text-emerald-400">
                  OK to quote
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
                {s.story}
              </p>
              <button
                type="button"
                onClick={() => act("deleteSubmission", s.id)}
                className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-rose-300"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
