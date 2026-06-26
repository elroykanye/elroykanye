import Link from "next/link";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/blog-utils";

export type PostCardData = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  series?: string;
  readingTime: number;
};

// Presentational only (no hooks, no server-only imports) so it renders fine
// inside both server pages and the client search component.
export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="glass glass-hover h-full rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
          <span className="text-accent-2">{formatDate(post.date)}</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <Clock className="h-3 w-3" strokeWidth={2} />
            {post.readingTime} min
          </span>
          {post.series && (
            <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">
              {post.series}
            </span>
          )}
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-2 leading-relaxed text-muted">{post.summary}</p>

        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-4 inline-block text-sm font-medium text-accent">
          Read more →
        </span>
      </article>
    </Link>
  );
}
