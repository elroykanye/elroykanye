import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/blog-utils";
import Reveal from "@/components/Reveal";

export default function Writing({ posts }: { posts: PostMeta[] }) {
  return (
    <section id="notes" className="scroll-mt-24 border-y border-ink/25 py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_2.2fr]">
        <Reveal>
          <div>
            <p className="field-label text-clay">Field notes / 03</p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] sm:text-5xl">
              Notes from the Grassfields
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Systems, teams, and the practical reality of building software
              from Cameroon.
            </p>
            <Link
              href="/blog"
              className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-clay pb-1 text-sm font-semibold text-clay transition-[gap] hover:gap-5"
            >
              Read all notes <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>

        <div className="divide-y divide-ink/20 border-y border-ink/20">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 60}>
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-3 py-6 sm:grid-cols-[8rem_1fr_auto] sm:items-center"
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-forest">
                  {formatDate(post.date)} · {post.readingTime} min
                </p>
                <div>
                  <h3 className="text-lg font-semibold leading-snug transition-colors group-hover:text-clay">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                    {post.summary}
                  </p>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-clay transition-transform group-hover:translate-x-1 sm:block" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
