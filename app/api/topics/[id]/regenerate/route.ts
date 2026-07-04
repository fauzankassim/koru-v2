import { NextRequest, NextResponse } from "next/server";
import { topicStore, preferenceStore } from "@/lib/storage";
import { generateJSON } from "@/lib/agent";
import { buildTopicSystemPrompt, buildTopicUserPrompt } from "@/prompts/system";
import { TopicMaterials, LearningPreferences } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await topicStore.get(id);
  if (!topic) return NextResponse.json({ error: "Topic not found" }, { status: 404 });

  try {
    const body = await req.json().catch(() => ({}));
    const overridePreferences = body?.preferences as LearningPreferences | undefined;
    const preferences = overridePreferences ?? (await preferenceStore.get());

    const materials = await generateJSON<TopicMaterials>(
      buildTopicSystemPrompt(preferences),
      buildTopicUserPrompt(topic.name, topic.elo)
    );
    const updated = await topicStore.update(id, { materials, preferences });
    return NextResponse.json({ topic: updated });
  } catch (err) {
    console.error("Failed to regenerate topic:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to regenerate" },
      { status: 500 }
    );
  }
}