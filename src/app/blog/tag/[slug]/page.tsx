import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/blog/PostCard";
import { getAllTags, getPostsByTagSlug } from "@/lib/blog";
import { breadcrumbSchema, jsonLdProps } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllTags().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = getPostsByTagSlug(slug);
  if (!result) return {};
  return {
    title: `Posts tagged "${result.tag}"`,
    description: `Every post tagged "${result.tag}".`,
    alternates: { canonical: `/blog/tag/${slug}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const result = getPostsByTagSlug(slug);
  if (!result) notFound();

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
    { name: result.tag, url: `${siteConfig.url}/blog/tag/${slug}` },
  ]);

  return (
    <>
      <Header />
      <script {...jsonLdProps(breadcrumbs)} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-16 pt-32">
        <Link
          href="/blog"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          ← All posts
        </Link>

        <p className="mt-8 font-mono text-sm text-accent-2">Tag</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
          {result.tag}
        </h1>
        <p className="mt-4 text-muted">
          {result.posts.length}{" "}
          {result.posts.length === 1 ? "post" : "posts"}.
        </p>

        <ul className="mt-10 grid gap-4">
          {result.posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
