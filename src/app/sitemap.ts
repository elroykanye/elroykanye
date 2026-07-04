import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import {
  getAllPosts,
  getAllSeries,
  getAllTags,
  getPostsByTagSlug,
} from "@/lib/blog";

// Most recent publish/update date across a set of posts, for section pages
// (series/tag) whose own "freshness" is really just their newest post.
function latestDate(posts: { date: string; updated?: string }[]): Date {
  const dates = posts.map((p) => new Date(p.updated ?? p.date).getTime());
  return new Date(dates.length ? Math.max(...dates) : Date.now());
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const seriesPages = getAllSeries().map((s) => ({
    url: `${siteConfig.url}/blog/series/${s.slug}`,
    lastModified: latestDate(s.posts),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const tagPages = getAllTags().map((t) => {
    const posts = getPostsByTagSlug(t.slug)?.posts ?? [];
    return {
      url: `${siteConfig.url}/blog/tag/${t.slug}`,
      lastModified: latestDate(posts),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    };
  });

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/share`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...seriesPages,
    ...tagPages,
    ...posts,
  ];
}
