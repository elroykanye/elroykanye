import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1e293b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, color: "#60a5fa", marginBottom: 16 }}>
          {siteConfig.url.replace("https://", "")}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.1 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 40, color: "#9ca3af", marginTop: 8 }}>
          {siteConfig.role}
        </div>
      </div>
    ),
    { ...size },
  );
}
