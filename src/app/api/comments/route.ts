import { NextResponse } from "next/server";
import { comments, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Public: approved comments for a post.
export async function GET(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ comments: [] });

  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const col = await comments();
  const docs = await col
    .find({ postSlug: slug, status: "approved" })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json({
    comments: docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      body: d.body,
      createdAt: d.createdAt,
    })),
  });
}

// Public: submit a comment. Stored as "pending" until approved in /admin.
export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Comments aren't available right now." },
      { status: 503 },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill this. Pretend success so they don't retry.
  if (data._gotcha) return NextResponse.json({ ok: true, pending: true });

  const slug = String(data.slug ?? "").trim();
  const name = String(data.name ?? "").trim();
  const body = String(data.body ?? "").trim();

  if (!slug || !body) {
    return NextResponse.json({ error: "Write something first." }, { status: 400 });
  }
  if (body.length > 4000 || name.length > 80) {
    return NextResponse.json({ error: "That's a bit too long." }, { status: 400 });
  }

  const col = await comments();
  await col.insertOne({
    postSlug: slug,
    name: name || "Anonymous",
    body,
    status: "pending",
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true, pending: true });
}
