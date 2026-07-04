import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";
import { getAllSeries, getSeriesBySlug } from "@/lib/blog";

export const alt = "Blog series";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export default async function SeriesOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  const name = series?.name ?? slug;
  const count = series?.posts.length ?? 0;

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
          {`${siteConfig.name} · Series`}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>
          {name}
        </div>
        <div style={{ fontSize: 30, color: "#9ca3af" }}>
          {`${count} ${count === 1 ? "part" : "parts"}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
