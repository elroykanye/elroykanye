import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/blog/PostCard";
import { getAllSeries, getSeriesBySlug } from "@/lib/blog";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};
  return {
    title: series.name,
    description: `Every post in the "${series.name}" series.`,
    alternates: { canonical: `/blog/series/${slug}` },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-32">
        <Link
          href="/blog"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All posts
        </Link>

        <p className="mt-8 font-mono text-sm text-accent-2">Series</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {series.name}
        </h1>
        <p className="mt-4 text-muted">
          {series.posts.length}{" "}
          {series.posts.length === 1 ? "part" : "parts"}, in reading order.
        </p>

        <ol className="mt-10 grid gap-4">
          {series.posts.map((post, i) => (
            <li key={post.slug}>
              <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                Part {i + 1}
              </p>
              <PostCard post={post} />
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
