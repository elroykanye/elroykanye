import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { comments, submissions, isDbConfigured } from "@/lib/mongodb";
import { checkAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

// Private: everything awaiting your attention — pending comments + all stories.
export async function GET(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ pendingComments: [], submissions: [] });
  }

  const cCol = await comments();
  const sCol = await submissions();

  const pending = await cCol
    .find({ status: "pending" })
    .sort({ createdAt: -1 })
    .toArray();
  const subs = await sCol.find({}).sort({ createdAt: -1 }).toArray();

  return NextResponse.json({
    pendingComments: pending.map((d) => ({
      id: String(d._id),
      postSlug: d.postSlug,
      name: d.name,
      body: d.body,
      createdAt: d.createdAt,
    })),
    submissions: subs.map((d) => ({
      id: String(d._id),
      name: d.name ?? null,
      role: d.role ?? null,
      email: d.email ?? null,
      story: d.story,
      canShare: d.canShare,
      createdAt: d.createdAt,
    })),
  });
}

// Private: moderate — approve/delete a comment, or delete a story.
export async function POST(req: Request) {
  if (!checkAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const action = String(data.action ?? "");
  const id = String(data.id ?? "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    return NextResponse.json({ error: "bad id" }, { status: 400 });
  }

  const cCol = await comments();
  const sCol = await submissions();

  switch (action) {
    case "approve":
      await cCol.updateOne({ _id }, { $set: { status: "approved" } });
      break;
    case "deleteComment":
      await cCol.deleteOne({ _id });
      break;
    case "deleteSubmission":
      await sCol.deleteOne({ _id });
      break;
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
