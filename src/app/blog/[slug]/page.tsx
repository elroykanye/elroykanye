import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LikeButton from "@/components/blog/LikeButton";
import ShareButton from "@/components/blog/ShareButton";
import Comments from "@/components/blog/Comments";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
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
          <p className="font-mono text-sm text-muted">
            {formatDate(post.date)}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="glass mt-10 rounded-3xl p-6 sm:p-10">
            <div className="prose prose-invert max-w-none prose-headings:tracking-tight prose-a:text-accent-2 prose-pre:border prose-pre:border-border prose-pre:bg-black/50 prose-code:text-accent-2">
              <MDXRemote source={post.content} />
            </div>
          </div>

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
