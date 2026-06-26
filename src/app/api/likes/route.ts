import { NextResponse } from "next/server";
import { likes, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Public: like count for a post, and whether this visitor already liked it.
export async function GET(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ count: 0, liked: false });

  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const visitorId = url.searchParams.get("visitorId") ?? "";
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const col = await likes();
  const doc = await col.findOne({ postSlug: slug });
  const ids = doc?.visitorIds ?? [];

  return NextResponse.json({ count: ids.length, liked: ids.includes(visitorId) });
}

// Public: toggle this visitor's like for a post.
export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = String(data.slug ?? "").trim();
  const visitorId = String(data.visitorId ?? "").trim();
  if (!slug || !visitorId) {
    return NextResponse.json(
      { error: "slug and visitorId required" },
      { status: 400 },
    );
  }

  const col = await likes();
  const doc = await col.findOne({ postSlug: slug });
  const liked = doc?.visitorIds?.includes(visitorId) ?? false;

  if (liked) {
    await col.updateOne({ postSlug: slug }, { $pull: { visitorIds: visitorId } });
  } else {
    await col.updateOne(
      { postSlug: slug },
      { $addToSet: { visitorIds: visitorId } },
      { upsert: true },
    );
  }

  const updated = await col.findOne({ postSlug: slug });
  return NextResponse.json({
    count: updated?.visitorIds?.length ?? 0,
    liked: !liked,
  });
}
