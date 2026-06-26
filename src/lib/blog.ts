import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { slugify, formatDate } from "./blog-utils";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export { slugify, formatDate };

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO string, e.g. "2026-06-24"
  summary: string;
  tags: string[];
  series?: string;
  order?: number;
  readingTime: number; // minutes
};

export type Post = PostMeta & {
  content: string;
};

function computeReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? slug,
    date: data.date
      ? new Date(data.date).toISOString().slice(0, 10)
      : "1970-01-01",
    summary: data.summary ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    series: typeof data.series === "string" ? data.series : undefined,
    order: typeof data.order === "number" ? data.order : undefined,
    readingTime: computeReadingTime(content),
    content,
  };
}

function postFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((file) => /\.mdx?$/.test(file));
}

export function getAllPosts(): PostMeta[] {
  return postFiles()
    .map((file) => {
      // Strip the content body from the listing payload.
      const { content: _content, ...meta } = readPostFile(file);
      void _content;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const mdx = path.join(POSTS_DIR, `${slug}.mdx`);
  const md = path.join(POSTS_DIR, `${slug}.md`);
  const file = fs.existsSync(mdx)
    ? `${slug}.mdx`
    : fs.existsSync(md)
      ? `${slug}.md`
      : null;
  if (!file) return null;
  return readPostFile(file);
}

// ---- Series ----

export type Series = { name: string; slug: string; posts: PostMeta[] };

// Reading order within a series: explicit `order` first, then chronological.
function bySeriesOrder(a: PostMeta, b: PostMeta): number {
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.date < b.date ? -1 : 1;
}

export function getAllSeries(): Series[] {
  const map = new Map<string, PostMeta[]>();
  for (const post of getAllPosts()) {
    if (!post.series) continue;
    const arr = map.get(post.series) ?? [];
    arr.push(post);
    map.set(post.series, arr);
  }
  return [...map.entries()]
    .map(([name, posts]) => ({
      name,
      slug: slugify(name),
      posts: posts.sort(bySeriesOrder),
    }))
    .sort((a, b) => b.posts.length - a.posts.length);
}

export function getSeriesBySlug(slug: string): Series | null {
  return getAllSeries().find((s) => s.slug === slug) ?? null;
}

export type SeriesContext = {
  name: string;
  slug: string;
  index: number; // zero-based position
  total: number;
  prev: PostMeta | null;
  next: PostMeta | null;
};

export function getSeriesForPost(slug: string): SeriesContext | null {
  for (const s of getAllSeries()) {
    const i = s.posts.findIndex((p) => p.slug === slug);
    if (i >= 0) {
      return {
        name: s.name,
        slug: s.slug,
        index: i,
        total: s.posts.length,
        prev: i > 0 ? s.posts[i - 1] : null,
        next: i < s.posts.length - 1 ? s.posts[i + 1] : null,
      };
    }
  }
  return null;
}

// ---- Tags ----

export type TagInfo = { tag: string; slug: string; count: number };

export function getAllTags(): TagInfo[] {
  const map = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) map.set(tag, (map.get(tag) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTagSlug(
  tagSlug: string,
): { tag: string; posts: PostMeta[] } | null {
  const info = getAllTags().find((t) => t.slug === tagSlug);
  if (!info) return null;
  const posts = getAllPosts().filter((p) =>
    p.tags.some((t) => slugify(t) === tagSlug),
  );
  return { tag: info.tag, posts };
}

// ---- Search index (shipped to the client for fuzzy search) ----

export type SearchDoc = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  series?: string;
  date: string;
  readingTime: number;
  text: string; // trimmed plain-text body for matching
};

function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/[#>*_~]+/g, " ") // markdown punctuation
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchIndex(): SearchDoc[] {
  return postFiles()
    .map((file) => {
      const p = readPostFile(file);
      return {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        tags: p.tags,
        series: p.series,
        date: p.date,
        readingTime: p.readingTime,
        text: toPlainText(p.content).slice(0, 2000),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---- Table of contents ----

export type TocItem = { id: string; text: string; level: number };

// Pull h2/h3 headings from the markdown, slugged the same way rehype-slug
// slugs the rendered headings so the anchor links line up.
export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;

  for (const line of content.split("\n")) {
    if (/^```/.test(line.trim())) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/[*_`]/g, "").trim();
      items.push({ id: slugger.slug(text), text, level });
    }
  }
  return items;
}
