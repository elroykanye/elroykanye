import type { Metadata } from "next";
import Link from "next/link";
import { Layers } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogExplorer from "@/components/blog/BlogExplorer";
import { getSearchIndex, getAllTags, getAllSeries } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on building software from Cameroon, backend engineering, and the occasional war story.",
};

export default function BlogIndex() {
  const docs = getSearchIndex();
  const tags = getAllTags();
  const series = getAllSeries();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          The <span className="gradient-text">blog</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Notes on the things I build, backends, microservices, messaging, and
          the occasional war story, alongside an honest series about what it
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
              Share your story, it might shape what I write next.
            </span>
          </span>
          <span className="shrink-0 text-sm font-medium text-accent">
            Share yours →
          </span>
        </Link>

        {/* Browse by series */}
        {series.length > 0 && (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
              <Layers className="h-4 w-4 text-accent-2" strokeWidth={2} />
              Series
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {series.map((s) => (
                <Link
                  key={s.slug}
                  href={`/blog/series/${s.slug}`}
                  className="glass glass-hover rounded-2xl p-5"
                >
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {s.posts.length} {s.posts.length === 1 ? "post" : "posts"} →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search + tag filter + all posts */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            All posts
          </h2>
          {docs.length === 0 ? (
            <p className="mt-6 text-muted">No posts yet, check back soon.</p>
          ) : (
            <BlogExplorer docs={docs} tags={tags} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
