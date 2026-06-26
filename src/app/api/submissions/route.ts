import { NextResponse } from "next/server";
import { submissions, isDbConfigured } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

// Public: a reader sharing their story from the /share page.
export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "Submissions aren't available right now." },
      { status: 503 },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (data._gotcha) return NextResponse.json({ ok: true });

  const story = String(data.story ?? "").trim();
  if (!story) {
    return NextResponse.json({ error: "Tell me your story first." }, { status: 400 });
  }
  if (story.length > 8000) {
    return NextResponse.json({ error: "That's a bit too long." }, { status: 400 });
  }

  const col = await submissions();
  await col.insertOne({
    name: String(data.name ?? "").trim() || undefined,
    role: String(data.role ?? "").trim() || undefined,
    email: String(data.email ?? "").trim() || undefined,
    story,
    canShare: Boolean(data.canShare),
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
