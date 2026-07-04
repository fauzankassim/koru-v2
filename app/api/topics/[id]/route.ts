import { NextRequest, NextResponse } from "next/server";
import { topicStore } from "@/lib/storage";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await topicStore.get(id);
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  return NextResponse.json({ topic });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name } = await req.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }
  const topic = await topicStore.get(id);
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  const updated = await topicStore.update(id, { name: name.trim() });
  return NextResponse.json({ topic: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await topicStore.delete(id);
  return NextResponse.json({ ok: true });
}