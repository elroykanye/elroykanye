import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing about engineering, open source, and career.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The <span className="gradient-text">blog</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Notes on the things I build — backends, microservices, messaging, and
          the occasional war story — alongside an honest series about what it
          takes to develop software from Cameroon.
        </p>

        <Link
          href="/share"
          className="glass glass-hover mt-8 flex flex-col gap-1 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <span>
            <span className="font-semibold text-foreground">
              Are you a developer in Cameroon?
            </span>{" "}
            <span className="text-muted">
              Share your story — it might shape what I write next.
            </span>
          </span>
          <span className="shrink-0 text-sm font-medium text-accent">
            Share yours →
          </span>
        </Link>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted">No posts yet — check back soon.</p>
        ) : (
          <ul className="mt-12 grid gap-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="block">
                  <article className="glass glass-hover rounded-2xl p-6 sm:p-8">
                    <p className="font-mono text-xs text-accent-2">
                      {formatDate(post.date)}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold transition-colors group-hover:text-accent">
                      {post.title}
                    </h2>
                    <p className="mt-2 leading-relaxed text-muted">
                      {post.summary}
                    </p>
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
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
