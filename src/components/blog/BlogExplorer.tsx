"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { slugify } from "@/lib/blog-utils";
import type { SearchDoc, TagInfo } from "@/lib/blog";
import PostCard from "@/components/blog/PostCard";

export default function BlogExplorer({
  docs,
  tags,
}: {
  docs: SearchDoc[];
  tags: TagInfo[];
}) {
  // Seeds from ?q=, so the WebSite SearchAction schema (schema.org) points
  // at a URL that actually pre-fills a search rather than a dead link.
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 3 },
          { name: "tags", weight: 2 },
          { name: "series", weight: 1.5 },
          { name: "summary", weight: 1 },
          { name: "text", weight: 0.4 },
        ],
        threshold: 0.38,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [docs],
  );

  const results = useMemo(() => {
    let list = docs;
    if (query.trim()) list = fuse.search(query.trim()).map((r) => r.item);
    if (activeTag)
      list = list.filter((d) => d.tags.some((t) => slugify(t) === activeTag));
    return list;
  }, [query, activeTag, docs, fuse]);

  return (
    <div>
      {/* Search */}
      <div className="relative mt-8">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={2}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-xl border border-border bg-black/20 py-3 pl-11 pr-10 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent/60"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === null
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-white/5 text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => setActiveTag((cur) => (cur === t.slug ? null : t.slug))}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === t.slug
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border bg-white/5 text-muted hover:text-foreground"
              }`}
            >
              {t.tag}
              <span className="ml-1.5 opacity-60">{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {results.length === 0 ? (
        <p className="mt-12 text-muted">
          Nothing matches that. Try a different search or clear the filters.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {results.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
