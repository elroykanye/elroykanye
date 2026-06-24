import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? siteConfig.name;
  const date = post ? formatDate(post.date) : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e293b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, color: "#60a5fa" }}>
          {`${siteConfig.name} · Blog`}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ fontSize: 30, color: "#9ca3af" }}>{date}</div>
      </div>
    ),
    { ...size },
  );
}
