import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { Clock, ListTree } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LikeButton from "@/components/blog/LikeButton";
import ShareButton from "@/components/blog/ShareButton";
import Comments from "@/components/blog/Comments";
import {
  getAllPosts,
  getPostBySlug,
  getSeriesForPost,
  extractToc,
  formatDate,
  slugify,
} from "@/lib/blog";
import { blogPostingSchema, jsonLdProps } from "@/lib/structured-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const series = getSeriesForPost(slug);
  const toc = extractToc(post.content);

  return (
    <>
      <Header />
      <script {...jsonLdProps(blogPostingSchema(post))} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-16 pt-32">
        <Link
          href="/blog"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All posts
        </Link>

        <article className="mt-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm text-muted">
            <span>{formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              {post.readingTime} min read
            </span>
          </div>

          {series && (
            <p className="mt-3 text-sm text-muted">
              Part {series.index + 1} of {series.total} in{" "}
              <Link
                href={`/blog/series/${series.slug}`}
                className="font-medium text-accent transition-colors hover:text-accent-2"
              >
                {series.name}
              </Link>
            </p>
          )}

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog/tag/${slugify(tag)}`}
                    className="block rounded-full border border-border px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Table of contents for longer posts */}
          {toc.length >= 3 && (
            <nav
              aria-label="Table of contents"
              className="glass mt-8 rounded-2xl p-5"
            >
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ListTree className="h-4 w-4 text-accent-2" strokeWidth={2} />
                On this page
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {toc.map((item) => (
                  <li
                    key={item.id}
                    className={item.level === 3 ? "pl-4" : ""}
                  >
                    <a
                      href={`#${item.id}`}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="glass mt-10 rounded-3xl p-6 sm:p-10">
            <div className="prose prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:tracking-tight prose-a:text-accent-2 prose-pre:border prose-pre:border-border prose-pre:bg-black/50 prose-code:text-accent-2">
              <MDXRemote
                source={post.content}
                options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
              />
            </div>
          </div>

          {/* Previous / next in series */}
          {series && (series.prev || series.next) && (
            <nav className="mt-8 grid gap-3 sm:grid-cols-2">
              {series.prev ? (
                <Link
                  href={`/blog/${series.prev.slug}`}
                  className="glass glass-hover rounded-2xl p-4"
                >
                  <span className="text-xs text-muted">
                    ← Previous in {series.name}
                  </span>
                  <span className="mt-1 block font-medium">
                    {series.prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {series.next ? (
                <Link
                  href={`/blog/${series.next.slug}`}
                  className="glass glass-hover rounded-2xl p-4 sm:text-right"
                >
                  <span className="text-xs text-muted">
                    Next in {series.name} →
                  </span>
                  <span className="mt-1 block font-medium">
                    {series.next.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
            </nav>
          )}

          <div className="mt-8 flex items-center gap-3">
            <LikeButton slug={slug} />
            <ShareButton title={post.title} />
          </div>

          <Comments slug={slug} />
        </article>
      </main>
      <Footer />
    </>
  );
}
